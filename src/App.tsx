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
            <div>
                <ElectedPerson></ElectedPerson>
                {loading ? (
                    <span>Loading dev team...</span>
                ) : (
                    <PeopleList></PeopleList>
                )}
            </div>
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

    --addPersonIconWidth: 30px;
    --peopleListWidth: min(100vw, 600px);
    --lightness: 80%;
    --white: hsl(0, 0%, var(--lightness));
    --offBlack: hsl(0, 0%, 30%);
    --shortTransition: 0.3s;
    --extraScrollPadding: 30px;
    --lexend: 'Lexend Deca', sans-serif;

    width: 100vw;
    font-family: var(--lexend);
    color: var(--white);
    padding-top: var(--extraScrollPadding);
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

export default App;
