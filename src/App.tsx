import React from 'react';
import './css/grid3x3.css';
import styled from 'styled-components'
import PersonCircle from './components/PersonCircle'
import PeopleList from './components/PeopleList';

function App() {
    return (
        <AppDiv className="grid3x3">
            <PeopleList></PeopleList>
        </AppDiv>
    );
}

const AppDiv = styled.div`
    --personCircleWidth: 100px;
    --personCircleHeight: var(--personCircleWidth);
    --personCircleTextWidth: 80px;
    --personCircleMaxFontSize: 40px;
    --personCircleBorderRadius: calc(var(--personCircleHeight) / 2);
    --personCircleBorderWidth: 3px;
    --personCircleMargin: 10px;
    --personCircleButtonFontSize: 10px;
    --personCircleButtonPadding: 5px;

    --peopleListWidth: min(100vw, 600px);
    
    --white: hsl(0, 0%, 80%);

    width: 100%;
    height: 100%;
`

export default App;
