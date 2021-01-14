import React, { useEffect, useState } from 'react';
import './css/grid3x3.css';
import styled from 'styled-components'
import PeopleList from './components/PeopleList';
import firebase from 'firebase/app'
import "firebase/firestore"
import { useSetRecoilState } from 'recoil';
import peopleAtom from './atoms/peopleAtom';
import PeopleClass from './classes/PeopleClass';
import ElectedPerson from './components/ElectedPerson';
import isNewElectAtom from './atoms/isNewElectAtom';
import constants from './utils/constants';

let firstLoad = true

function App() {
    const setPeople = useSetRecoilState(peopleAtom)
    const setIsNewElect = useSetRecoilState(isNewElectAtom)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        firebase.firestore().collection(constants.PEOPLE_COLLECTION).onSnapshot(querySnapshot => {
            const peopleJson = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
            const newPeople = new PeopleClass(peopleJson)
            let shouldSetIsNewElect = false
            setPeople(oldPeople => {
                if (detectNewElect(oldPeople, newPeople)) {
                    shouldSetIsNewElect = true
                }
                return newPeople
            })
            if (shouldSetIsNewElect) {
                setIsNewElect(true)
            }
            if (firstLoad && newPeople.list.length !== 0 && newPeople.electedToday() === false) {
                firstLoad = false
                newPeople.list.filter(person => person.hide).forEach(hiddenPesron => {
                    newPeople.updatePerson(hiddenPesron.id, {hide: false}, setPeople)
                })
            }
            setLoading(false)
        })
    }, [setIsNewElect, setPeople])

    const detectNewElect = (oldPeople: PeopleClass, newPeople: PeopleClass) => {
        const oldElect = oldPeople.getElected()
        const newElect = newPeople.getElected()
        if (oldElect === null) return false
        if (newElect === null) return false
        return oldElect.id !== newElect.id
    }
    
    return (
        <AppDiv className="grid3x3">
            {loading ? (
                <span>Loading dev team...</span>
            ) : (
                <>
                    <div className="a5">
                        <ElectedPerson></ElectedPerson>
                        <PeopleList></PeopleList>
                    </div>
                    <div className="a8">
                        <Href href="https://github.com/felixxwu/chair-picker">GitHub</Href>
                    </div>
                </>
            )}
        </AppDiv>
    );
}

const AppDiv = styled.div`
    --personCircleWidth: 100px;
    --personCircleHeight: var(--personCircleWidth);
    --personCircleTextWidth: 70px;
    --personCircleMaxFontSize: 40px;
    --personCircleBorderRadius: calc(var(--personCircleHeight) / 2);
    --personCircleBorderWidth: 4px;
    --personCircleMargin: 25px;
    --personCircleButtonFontSize: 10px;
    --personCircleButtonPadding: 5px;
    --personCircleBoxShadow: 0px 1px 15px hsl(0deg 0% 0% / 30%);

    --bigPersonCircleWidth: 150px;
    --bigPersonCircleHeight: var(--bigPersonCircleWidth);
    --bigPersonCircleTextWidth: 120px;
    --bigPersonCircleMaxFontSize: 60px;
    --bigPersonCircleBorderRadius: calc(var(--bigPersonCircleHeight) / 2);

    --electButtonPadding: 15px;
    --electButtonBorderRadius: 8px;
    --electedPadding: 0px;
    --titleFontSize: 25px;
    --titlePadding: 40px;

    --textFontSize: 15px;
    --lightness: 75%;
    --white: hsl(0, 0%, var(--lightness));
    --addPersonIconWidth: 30px;
    --peopleListWidth: min(100vw, 600px);
    --offBlack: hsl(0, 0%, 30%);
    --shortTransition: 0.5s;
    --longTransition: 2s;
    --fadeUpDistance: 100px;
    --extraScrollPadding: 100px;
    --lexend: 'Lexend Deca', sans-serif;

    width: 100vw;
    min-height: calc(100vh - var(--extraScrollPadding));
    font-family: var(--lexend);
    color: var(--white);
    padding-bottom: var(--extraScrollPadding);
    overflow-x: hidden;

    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
`

const Href = styled.a`
    color: var(--offBlack);
    margin-top: var(--extraScrollPadding);
    font-size: var(--textFontSize);
`

export default App;
