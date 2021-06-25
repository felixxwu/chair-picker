import { SetterOrUpdater } from "recoil";
import warning from "../utils/warning";
import Person from "./PersonClass";
import firebase from 'firebase/app'
import "firebase/firestore"
import constants from "../utils/constants";
import UpdateObject from "./PersonUpdateInterface";

const lastUpdate: any = {}

export default class PeopleClass {
    list: Person[]
    
    constructor(personArray: any) {
        if (!Array.isArray(personArray)) warning('personArray is not an array')
        this.list = []
        personArray.forEach((person: any) => {
            if (person.id === undefined) warning('person has no id')
            if (person.name === undefined) warning('person has no name')
            if (person.hue === undefined) warning('person has no hue')
            if (person.hide === undefined) warning('person has no hide attribute')
            if (person.created === undefined) warning('person has no created attribute')
            if (person.elected === undefined) warning('person has no elected attribute')
            this.list.push(new Person(person.id, person.name, person.hue, person.hide, person.created, person.elected))
        })
    }

    getPerson(id: string) {
        const person = this.list.filter(person => person.id === id)[0]
        if (person === undefined) return null
        return person
    }

    getSortedList() {
        const sortingFunction = (a: Person, b: Person) => a.elected < b.elected ? 1 : -1
        const hiddenPeople = this.list.filter(person => person.hide).sort(sortingFunction)
        const unhiddenPeople = this.list.filter(person => !person.hide).sort(sortingFunction)
        return unhiddenPeople.concat(hiddenPeople)
    }

    getElected() {
        if (this.list.length === 0) return null
        if (this.electedToday() === false) return null

        const unhiddenPeople = this.list.filter(p => !p.hide)
        if (unhiddenPeople.length === 0) return null

        const lastElected = unhiddenPeople.sort((a, b) => a.elected < b.elected ? 1 : -1)[0]
        return lastElected
    }

    electedToday() {
        if (this.list.length === 0) return false

        const lastElected = this.list.slice().sort((a, b) => a.elected < b.elected ? 1 : -1)[0]
        const lastElectedDate = (new Date(lastElected.elected)).toUTCString().slice(0, 16)
        const today = (new Date()).toUTCString().slice(0, 16)
        return lastElectedDate === today
    }

    getCandidates() {
        const unhiddenPeople = this.list.filter(p => !p.hide)
        const numPeopleFromEndToShuffle = 3
        const notRecentlyEelected = unhiddenPeople.sort((a, b) => a.elected < b.elected ? -1 : 1).slice(0, numPeopleFromEndToShuffle)
        return notRecentlyEelected
    }

    pickNewElect() {
        const candidates = this.getCandidates()
        const newElect = candidates[Math.floor(Math.random() * candidates.length)]
        if (newElect === undefined) return null
        return newElect
    }

    deepCopy() {
        return new PeopleClass(this.toJson())
    }

    toJson() {
        return this.list.map(person => person.toJson())
    }

    updatePerson(
        id: string,
        updateObject: UpdateObject,
        setPeople: SetterOrUpdater<PeopleClass>
    ) {
        const updateNumber = lastUpdate[id] === undefined ? 0 : lastUpdate[id] + 1
        lastUpdate[id] = updateNumber
        setTimeout(() => {
            if (lastUpdate[id] !== updateNumber) return
            firebase.firestore().collection(constants.PEOPLE_COLLECTION).doc(id).update(updateObject).then(() => {
                console.log('updated', {id}, {updateObject})
            })
        }, constants.UPDATE_DEBOUNCE_TIME);
        setPeople(oldPeople => {
            const newPeople = oldPeople.deepCopy()
            newPeople.list = newPeople.list.map(person => {
                if (person.id === id) {
                    return person.update(updateObject)
                } else {
                    return person
                }
            })
            return newPeople
        })
    }
}