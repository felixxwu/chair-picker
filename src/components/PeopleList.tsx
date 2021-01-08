import React from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components'
import peopleAtom from '../atoms/peopleAtom';
import AddPerson from './AddPerson';
import PersonCircle from './PersonCircle';

function PeopleList() {
    const [people, setPeople] = useRecoilState(peopleAtom)
    
    return (
        <PeopleListDiv>
            {people.getSortedList().map(person => (
                <PersonCircle id={person.id} key={person.id}></PersonCircle>
            ))}
            <AddPerson></AddPerson>
        </PeopleListDiv>
    );
}

const PeopleListDiv = styled.div`
    display: grid;
    margin: auto;
    max-width: var(--peopleListWidth);
    grid-template-columns: repeat(auto-fill, var(--personCircleWidth));
    grid-template-rows: repeat(auto-fill, var(--personCircleHeight));
    grid-gap: var(--personCircleMargin);
`

export default PeopleList;
