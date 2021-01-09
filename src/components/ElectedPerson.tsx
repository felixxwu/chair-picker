import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components'
import constants from '../utils/constants';
import "firebase/firestore"
import { useRecoilState } from 'recoil';
import peopleAtom from '../atoms/peopleAtom';
import Person from '../classes/PersonClass';
import warning from '../utils/warning';
import hsl2rgb from '../utils/hsl2rgb';
import isNewElectAtom from '../atoms/isNewElectAtom';

function ElectedPerson() {
    const [people, setPeople] = useRecoilState(peopleAtom)
    const [isNewElect, setIsNewElect] = useRecoilState(isNewElectAtom)
    const [shufflingPerson, setShufflingPerson] = useState<Person | null>(null)
    const elected = shufflingPerson === null ? people.getElected() : shufflingPerson

    const getListOfPeople = useCallback(() => {
        let randomPeople = []
        const offset = Math.floor(Math.random() * constants.SHUFFLE_LENGTH)
        for (let i = 0; i < constants.SHUFFLE_LENGTH; i++) {
            const unhiddenPeople = people.list.filter(p => !p.hide)
            const randomPerson = unhiddenPeople[(i + offset) % unhiddenPeople.length]
            randomPeople.push(randomPerson)
        }
        return randomPeople
    }, [people])

    const shufflePeople = useCallback((listOfPeople: Person[]) => {
        return new Promise<void>(res => {
            const delay = constants.SHUFFLE_BASE_INTERVAL * (1 / Math.pow(listOfPeople.length + 1, constants.SHUFFLE_SLOPE))
            if (listOfPeople.length === 0) {
                setTimeout(() => {
                    res()
                }, delay + constants.SHUFFLE_PAUSE);
                return
            }
            
            setShufflingPerson(listOfPeople[0])
            setTimeout(() => {
                shufflePeople(listOfPeople.slice(1)).then(res)
            }, delay);
        })
    }, [])

    useEffect(() => {
        if (isNewElect) {
            setIsNewElect(false)
            shufflePeople(getListOfPeople()).then(() => {
                setShufflingPerson(null)
            })
        }
    }, [isNewElect, getListOfPeople, setIsNewElect, shufflePeople])
    
    if (elected === null) return warning('elected person is null')

    const colour = hsl2rgb(elected.hue / 360, constants.PERSON_SATURATION, constants.PERSON_LIGHTNESS, 1)
    const colourBorder = hsl2rgb(elected.hue / 360, constants.PERSON_SATURATION, constants.PERSON_LIGHTNESS_BORDER, 1)

    const handleElect = () => {
        if (shufflingPerson !== null) return
        const candidates = people.list.filter(p => p.id !== elected.id).filter(p => !p.hide)
        const newElected = candidates[Math.floor(Math.random() * candidates.length)]
        people.updatePerson(newElected.id, {elected: (new Date()).getTime()}, setPeople)
        shufflePeople(getListOfPeople()).then(() => {
            setShufflingPerson(null)
        })
    }

    return (
        <ElectedPersonDiv className="grid3x3" theme={{colour, shuffling: shufflingPerson !== null}}>
            <Title className="a2">Today's chair is...</Title>
            <BigCircle className="a5 grid3x3" theme={{colourBorder}}>
                <Name theme={{nameLength: elected.name.length}}>
                    {elected.name}
                </Name>
            </BigCircle>
            <ElectButton className="a8" onClick={handleElect}>Elect a new chair</ElectButton>
        </ElectedPersonDiv>
    );
}

const ElectedPersonDiv = styled.div`
    padding: var(--electedPadding);
    --colour: ${props => props.theme.colour};
    --opacity: ${props => props.theme.shuffling ? constants.HIDDEN_OPACITY : 1};
`

const BigCircle = styled.div`
    background-color: var(--colour);
    width: var(--bigPersonCircleWidth);
    height: var(--bigPersonCircleHeight);
    color: var(--white);
    border-radius: var(--bigPersonCircleBorderRadius);
    border: var(--personCircleBorderWidth) solid ${props => props.theme.colourBorder};
    box-sizing: border-box;
    box-shadow: var(--personCircleBoxShadow);
    opacity: var(--opacity);
`

const Name = styled.div`
    width: ${props => props.theme.nameLength}ch;
    color: var(--white);
    font-family: monospace;
    font-weight: bold;
    font-size: min(var(--bigPersonCircleMaxFontSize), calc(var(--bigPersonCircleTextWidth) / ${props => props.theme.nameLength} / 0.54966666666));
`

const Title = styled.span`
    padding: var(--titlePadding);
    font-size: var(--titleFontSize);
    font-weight: bold;
    text-align: center;
`

const ElectButton = styled.button`
    border: none;
    outline: none;
    padding: var(--electButtonPadding);
    color: var(--black);
    background-color: var(--white);
    box-shadow: var(--personCircleBoxShadow);
    margin: var(--titlePadding);
    border-radius: var(--electButtonBorderRadius);
    font-family: var(--lexend);
    cursor: pointer;
`

export default ElectedPerson;
