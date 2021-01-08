import { SetterOrUpdater } from "recoil";
import warning from "../utils/warning";
import Person from "./PersonClass";
import firebase from 'firebase/app'
import "firebase/firestore"
import constants from "../utils/constants";
import UpdateObject from "./PersonUpdateInterface";

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
            this.list.push(new Person(person.id, person.name, person.hue, person.hide, person.created))
        })
    }

    getPerson(id: string) {
        const person = this.list.filter(person => person.id === id)[0]
        if (person === undefined) return null
        return person
    }

    getSortedList() {
        return this.list.slice().sort((a, b) => a.created > b.created ? 1 : -1)
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
        firebase.firestore().collection(constants.PEOPLE_COLLECTION).doc(id).update(updateObject)
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