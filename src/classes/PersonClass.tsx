import UpdateObject from "./PersonUpdateInterface"

export default class Person {
    id: string
    name: string
    hue: number
    hide: boolean
    created: number
    
    constructor(id: string, name: string, hue: number, hide: boolean, created: number) {
        this.id = id
        this.name = name
        this.hue = hue
        this.hide = hide
        this.created = created
    }

    update(updateObject: UpdateObject) {
        const json = {...this.toJson(), ...updateObject}
        return new Person(json.id, json.name, json.hue, json.hide, json.created)
    }

    toJson() {
        return {id: this.id, name: this.name, hue: this.hue, hide: this.hide, created: this.created}
    }
}