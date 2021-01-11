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
    const [hidden, setHidden] = useState(true)
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setHidden(false)
        }, 300);
        setTimeout(() => {
            setShowButton(true)
        }, 1300);
    }, [])

    const elected = shufflingPerson === null ? people.getElected() : shufflingPerson
    
    const getShuffleList = useCallback(() => {
        let randomPeople = []
        const offset = Math.floor(Math.random() * constants.SHUFFLE_LENGTH)
        for (let i = 0; i < constants.SHUFFLE_LENGTH; i++) {
            const candidates = people.getCandidates()
            const randomPerson = candidates[(i + offset) % candidates.length]
            randomPeople.push(randomPerson)
        }
        return randomPeople
    }, [people])

    const shufflePeople = useCallback((peopleLeftToShuffle: Person[]) => {
        return new Promise<void>(res => {
            const delay = constants.SHUFFLE_BASE_INTERVAL * (1 / Math.pow(peopleLeftToShuffle.length + 1, constants.SHUFFLE_SLOPE))
            if (peopleLeftToShuffle.length === 0) {
                setTimeout(() => {
                    res()
                }, delay + constants.SHUFFLE_PAUSE);
                return
            }
            setShufflingPerson(peopleLeftToShuffle[0])
            setTimeout(() => {
                shufflePeople(peopleLeftToShuffle.slice(1)).then(res)
            }, delay);
        })
    }, [])

    useEffect(() => {
        if (isNewElect) {
            setIsNewElect(false)
            shufflePeople(getShuffleList()).then(() => {
                setShufflingPerson(null)
            })
        }
    }, [isNewElect, getShuffleList, setIsNewElect, shufflePeople])

    const handleElect = () => {
        if (shufflingPerson !== null) return
        // if elected person is already set, hide current one and choose new
        if (elected !== null) {
            people.updatePerson(elected.id, {hide: true}, setPeople)
        }
        const newElect = people.pickNewElect()
        if (newElect === null) return
        people.updatePerson(newElect.id, {elected: (new Date()).getTime()}, setPeople)
        shufflePeople(getShuffleList()).then(() => {
            setShufflingPerson(null)
        })
    }

    const colour = elected === null ? (
        "var(--black)"
    ) : (
        hsl2rgb(elected.hue / 360, constants.PERSON_SATURATION, constants.PERSON_LIGHTNESS, 1)
    )
    const colourBorder = elected === null ? (
        "var(--offBlack)"
    ) : (
        hsl2rgb(elected.hue / 360, constants.PERSON_SATURATION, constants.PERSON_LIGHTNESS_BORDER, 1)
    )
    const name = elected === null ? (
        "?"
    ) : (
        elected.name
    )

    return (
        <ElectedPersonDiv className="grid3x3" theme={{
            colour,
            shuffling: shufflingPerson !== null,
            hidden,
            showButton
        }}>
            <Title className="a2">Today's chair is...</Title>
            <BigCircle className="a5 grid3x3" theme={{colourBorder}}>
                <Name theme={{nameLength: name.length}}>
                    {name}
                </Name>
            </BigCircle>
            <ElectButton className="a8" onClick={handleElect}>{(() => {
                if (shufflingPerson !== null) return "Drum roll please..."
                if (elected === null) {
                    return "Elect today's chair"
                } else {
                    return "Not here? Elect someone else"
                }
            })()}</ElectButton>
        </ElectedPersonDiv>
    );
}

const ElectedPersonDiv = styled.div`
    --colour: ${props => props.theme.colour};
    --opacity: ${props => props.theme.shuffling ? constants.HIDDEN_OPACITY : 1};
    --buttonOpacity: ${props => props.theme.showButton ? 1 : 0};
    padding: var(--electedPadding);
    transition: var(--longTransition);
    transform: scale(${props => props.theme.scale});

    ${props => {
        if (props.theme.hidden) {
            return `
                opacity: 0;
                transform: translateY(calc(-1 * var(--fadeUpDistance)));
            `
        } else {
            return `
                opacity: 1;
                transform: translateY(0);
            `
        }
    }}
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
    font-size: var(--textFontSize);
    cursor: pointer;
    opacity: var(--buttonOpacity);
    transition: var(--longTransition);
`

export default ElectedPerson;
