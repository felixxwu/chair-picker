import React, { useEffect, useState } from 'react';
import './css/grid3x3.css';
import styled from 'styled-components'
import PersonCircle from './components/PersonCircle'
import PeopleList from './components/PeopleList';
import firebase from 'firebase/app'
import "firebase/firestore"
import { useRecoilState } from 'recoil';
import peopleAtom from './atoms/peopleAtom';
import PeopleClass from './classes/PeopleClass';

function App() {
    const [people, setPeople] = useRecoilState(peopleAtom)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        firebase.firestore().collection('people').onSnapshot(querySnapshot => {
            const peopleJson = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
            setPeople(new PeopleClass(peopleJson))
            setLoading(false)
        })
    }, [])
    
    return (
        <AppDiv className="grid3x3">
            <Scrollable>
                {loading ? (
                    <span>Loading dev team...</span>
                ) : (
                    <PeopleList></PeopleList>
                )}
            </Scrollable>
        </AppDiv>
    );
}

const AppDiv = styled.div`
    --personCircleWidth: 100px;
    --personCircleHeight: var(--personCircleWidth);
    --personCircleTextWidth: 80px;
    --personCircleMaxFontSize: 40px;
    --personCircleBorderRadius: calc(var(--personCircleHeight) / 2);
    --personCircleBorderWidth: 2px;
    --personCircleMargin: 15px;
    --personCircleButtonFontSize: 10px;
    --personCircleButtonPadding: 5px;
    --addPersonIconWidth: 30px;
    --peopleListWidth: min(100vw, 600px);
    --lightness: 80%;
    --white: hsl(0, 0%, var(--lightness));
    --offBlack: hsl(0, 0%, 25%);
    --shortTransition: 0.3s;
    --extraScrollPadding: 100px;

    width: 100%;
    height: 100%;
    font-family: 'Lexend Deca', sans-serif;
    color: var(--white);

    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
`

const Scrollable = styled.div`
    padding-top: var(--extraScrollPadding);
    padding-bottom: var(--extraScrollPadding);
    max-height: 100vh;
    overflow-x: auto;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    &::-webkit-scrollbar {
        display: none;
    }
`

export default App;
