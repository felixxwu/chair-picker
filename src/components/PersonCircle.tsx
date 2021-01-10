import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components'
import peopleAtom from '../atoms/peopleAtom';
import constants from '../utils/constants';
import hsl2rgb from '../utils/hsl2rgb';
import warning from '../utils/warning';
import firebase from 'firebase/app'
import "firebase/firestore"

function PersonCircle(props: {
    id: string,
    index: number
}) {
    const [people, setPeople] = useRecoilState(peopleAtom)
    const [hidden, SetHidden] = useState(true)
    const person = people.getPerson(props.id)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setTimeout(() => {
            SetHidden(false)
        }, props.index * constants.INIT_ANIMATION_TIME);
    }, [])

    if (person === null) return warning('person is null')

    const colour = hsl2rgb(person.hue / 360, constants.PERSON_SATURATION, constants.PERSON_LIGHTNESS, 1)
    const colourBorder = hsl2rgb(person.hue / 360, constants.PERSON_SATURATION, constants.PERSON_LIGHTNESS_BORDER, 1)

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length === 0) {
            handleDelete()
            return
        }
        people.updatePerson(props.id, {name: event.target.value}, setPeople)
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (inputRef.current === null) return warning('inputRef is null')
            inputRef.current.blur()
        }
    }

    const handleClick = () => {
        if (inputRef.current === null) return warning('inputRef is null')
        inputRef.current.focus()
        inputRef.current.setSelectionRange(0, inputRef.current.value.length)
    }

    const handleDelete = () => {
        firebase.firestore().collection(constants.PEOPLE_COLLECTION).doc(props.id).delete()
    }

    const handleHide = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        event.stopPropagation()
        people.updatePerson(props.id, {hide: !person.hide}, setPeople)
    }

    return (
        <PersonCircleDiv
            id={props.id}
            className="grid3x3"
            onClick={handleClick}
            theme={{colour, hide: person.hide, colourBorder, hidden}}
        >
            <Button className="a2" onClick={handleHide}>
                {person.hide ? constants.UNHIDE_TEXT : constants.HIDE_TEXT}
            </Button>
            <NameInput
                className="a5"
                value={person.name}
                onChange={handleNameChange}
                onKeyPress={handleKeyPress}
                ref={inputRef}
                theme={{nameLength: person.name.length}}
            />
            <Button className="a8" onClick={handleDelete}>
                {constants.DELETE_TEXT}
            </Button>
        </PersonCircleDiv>
    );
}

const PersonCircleDiv = styled.div`
    background-color: ${props => props.theme.colour};
    color: var(--white);
    width: var(--personCircleWidth);
    height: var(--personCircleHeight);
    border-radius: var(--personCircleBorderRadius);
    border: var(--personCircleBorderWidth) solid ${props => props.theme.colourBorder};
    box-sizing: border-box;
    cursor: text;
    box-shadow: var(--personCircleBoxShadow);
    transition: var(--shortTransition);

    ${props => {
        if (props.theme.hidden) {
            return `
                opacity: 0;
                transform: translateY(var(--fadeUpDistance));
            `
        } else {
            return `
                opacity: ${props.theme.hide ? constants.HIDDEN_OPACITY : 1};
                transform: translateY(0);
            `
        }
    }}

    --buttonOpacity: 0;
    &:hover {
        --buttonOpacity: 1;
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
    opacity: var(--buttonOpacity);
    font-size: var(--personCircleButtonFontSize);
    padding: var(--personCircleButtonPadding);
    cursor: pointer;
    transition: var(--shortTransition);

    &:hover {
        text-decoration: underline;
    }
`

export default PersonCircle;
