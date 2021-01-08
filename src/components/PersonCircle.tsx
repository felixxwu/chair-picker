import React, { useRef } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components'
import peopleAtom from '../atoms/peopleAtom';
import constants from '../utils/constants';
import hsl2rgb from '../utils/hsl2rgb';
import warning from '../utils/warning';
import firebase from 'firebase/app'
import "firebase/firestore"

function PersonCircle(props: {
    id: string
}) {
    const [people, setPeople] = useRecoilState(peopleAtom)
    const person = people.getPerson(props.id)
    const inputRef = useRef<HTMLInputElement>(null)
    if (person === null) return warning('person is null')

    const colour = hsl2rgb(person.hue / 360, constants.PERSON_SATURATION, constants.PERSON_LIGHTNESS, 1)

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        people.updatePerson(props.id, {name: event.target.value}, setPeople)
    }

    const handleClick = () => {
        if (inputRef.current === null) return warning('inputRef is null')
        inputRef.current.focus()
        inputRef.current.setSelectionRange(0, inputRef.current.value.length)
    }

    const handleDelete = () => {
        firebase.firestore().collection(constants.PEOPLE_COLLECTION).doc(props.id).delete()
    }

    return (
        <PersonCircleDiv
            id={props.id}
            className="grid3x3"
            onClick={handleClick}
            theme={{colour}}
        >
            <Button className="a2">hide</Button>
            <NameInput
                className="a5"
                value={person.name}
                onChange={handleNameChange}
                ref={inputRef}
                theme={{nameLength: person.name.length}}
            />
            <Button className="a8" onClick={handleDelete}>delete</Button>
        </PersonCircleDiv>
    );
}

const PersonCircleDiv = styled.div`
    background-color: ${props => props.theme.colour};
    color: var(--white);
    width: var(--personCircleWidth);
    height: var(--personCircleHeight);
    border-radius: var(--personCircleBorderRadius);
    border: var(--personCircleBorderWidth) solid var(--white);
    box-sizing: border-box;
    cursor: text;

    --buttonDisplay: none;
    &:hover {
        --buttonDisplay: initial;
    }
`

const NameInput = styled.input`
    width: ${props => props.theme.nameLength}ch;
    background: transparent;
    color: var(--white);
    outline: none;
    border: none;
    font-family: monospace;
    font-weight: bold;
    font-size: min(var(--personCircleMaxFontSize), calc(var(--personCircleTextWidth) / ${props => props.theme.nameLength} / 0.54966666666));
    padding: 0;
    margin: 0;
`

const Button = styled.span`
    display: var(--buttonDisplay);
    font-size: var(--personCircleButtonFontSize);
    padding: var(--personCircleButtonPadding);
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`

export default PersonCircle;
