var Class = (function () {
    function Class(name) {
        this.name = name;
        this.arr = [1, 2, 3, 4];
    }
    Class.prototype.draw = function (draw) {
        this.draw = draw;
    };
    return Class;
}());
var object = new Class('suraj');
for (var key in object) {
    if (object.hasOwnProperty(key)) {
        var element = object[key];
        console.log(element);
    }
}
