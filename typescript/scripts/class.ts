/**
 * > npm run tsc
 * @param {String} name - name of class
 */
class Class {
    constructor (name: String) {
        this.name = name;
        this.arr = [1,2,3,4];
    }
    draw(draw) {
        this.draw = draw;
    }
}

let object = new Class('suraj');

for (const key in object) {
    if (object.hasOwnProperty(key)) {
        const element = object[key];
        console.log(element)
    }
}

