import React, { useEffect } from 'react';
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
    
    useEffect(() => {
        firebase.firestore().collection('people').onSnapshot(querySnapshot => {
            const peopleJson = querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
            setPeople(new PeopleClass(peopleJson))
        })
    }, [])
    
    return (
        <AppDiv className="grid3x3">
            {people.list.length === 0 ? (
                <span>Loading dev team...</span>
            ) : (
                <PeopleList></PeopleList>
            )}
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
    --personCircleMargin: 10px;
    --personCircleButtonFontSize: 10px;
    --personCircleButtonPadding: 5px;

    --addPersonIconWidth: 30px;

    --peopleListWidth: min(100vw, 600px);
    
    --lightness: 80%;
    --white: hsl(0, 0%, var(--lightness));
    --offBlack: hsl(0, 0%, 25%);

    width: 100%;
    height: 100%;
    font-family: 'Lexend Deca', sans-serif;
    color: var(--white);
`

export default App;
