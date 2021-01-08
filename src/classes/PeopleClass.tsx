import { SetterOrUpdater } from "recoil";
import warning from "../utils/warning";
import Person from "./PersonClass";

export default class PeopleClass {
    list: Person[]
    
    constructor(personArray: any) {
        if (!Array.isArray(personArray)) warning('personArray is not an array')
        this.list = []
        personArray.forEach((person: any) => {
            if (person.id === undefined) warning('person has no id')
            if (person.name === undefined) warning('person has no name')
            this.list.push(new Person(person.id, person.name, person.hue))
        })
    }

    getPerson(id: string) {
        const person = this.list.filter(person => person.id === id)[0]
        if (person === undefined) return null
        return person
    }

    deepCopy() {
        return new PeopleClass(this.toJson())
    }

    toJson() {
        return this.list.map(person => person.toJson())
    }

    updatePerson(
        id: string,
        updateObject: {
            name?: string,
            hue?: number
        },
        setPeople: SetterOrUpdater<PeopleClass>
    ) {
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