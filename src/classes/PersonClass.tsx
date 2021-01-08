export default class Person {
    id: string
    name: string
    hue: number
    
    constructor(id: string, name: string, hue: number) {
        this.id = id
        this.name = name
        this.hue = hue
    }

    setName(name: string) {
        this.name = name
    }

    setHue(hue: number) {
        this.hue = hue
    }

    update(updateObject: {
        name?: string,
        hue?: number
    }) {
        const json = {...this.toJson(), ...updateObject}
        return new Person(json.id, json.name, json.hue)
    }

    toJson() {
        return {id: this.id, name: this.name, hue: this.hue}
    }
}