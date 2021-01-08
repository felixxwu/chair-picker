import React from 'react';
import styled from 'styled-components'
import constants from '../utils/constants';
import AddIconSvg from '../images/add.svg'
import firebase from 'firebase/app'
import "firebase/firestore"
import { useRecoilValue } from 'recoil';
import peopleAtom from '../atoms/peopleAtom';
import findDistinctHue from '../utils/findDistinctHue';
import Person from '../classes/PersonClass';

function AddPerson() {
    const people = useRecoilValue(peopleAtom)

    
    const handleClick = () => {
        const hue = findDistinctHue(people.list.map(person => person.hue))
        const newPerson = new Person('', constants.DEFAULT_NAME, hue, false, (new Date()).getTime(), 0)
        firebase.firestore().collection(constants.PEOPLE_COLLECTION).add({
            name: newPerson.name,
            hue: newPerson.hue,
            hide: newPerson.hide,
            created: newPerson.created,
            elected: newPerson.elected
        }).then(docRef => {
            document.getElementById(docRef.id)?.click()
        })
    }

    return (
        <AddPersonDiv className="grid3x3" onClick={handleClick}>
            <AddIcon src={AddIconSvg}/>
        </AddPersonDiv>
    );
}

const AddPersonDiv = styled.div`
    background-color: ${props => props.theme.colour};
    color: var(--white);
    width: var(--personCircleWidth);
    height: var(--personCircleHeight);
    border-radius: var(--personCircleBorderRadius);
    border: var(--personCircleBorderWidth) solid var(--white);
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
        background-color: var(--offBlack);
    }
`

const AddIcon = styled.img`
    width: var(--addPersonIconWidth);
    filter: brightness(var(--lightness));
`

export default AddPerson;
