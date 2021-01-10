import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components'
import peopleAtom from '../atoms/peopleAtom';
import constants from '../utils/constants';
import AddPerson from './AddPerson';
import PersonCircle from './PersonCircle';

function PeopleList() {
    const people = useRecoilValue(peopleAtom)
    
    return (
        <PeopleListDiv>
            {people.getSortedList().map((person, index) => (
                <PersonCircle id={person.id} key={person.id} index={index}></PersonCircle>
            ))}
            <AddPerson animationDelay={people.list.length * constants.INIT_ANIMATION_TIME}></AddPerson>
        </PeopleListDiv>
    );
}

const PeopleListDiv = styled.div`
    display: grid;
    margin: auto;
    max-width: var(--peopleListWidth);
    width: fit-content;
    grid-template-columns: repeat(auto-fill, var(--personCircleWidth));
    grid-template-rows: repeat(auto-fill, var(--personCircleHeight));
    grid-gap: var(--personCircleMargin);
    padding: var(--personCircleMargin);
`

export default PeopleList;
