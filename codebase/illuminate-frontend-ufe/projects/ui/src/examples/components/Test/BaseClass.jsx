/* Pre-ES6 syntax for declaring a class */

var BaseClass = function () {
    this.state = {};
};

BaseClass.prototype.property = 1;

BaseClass.prototype.getContent = function () {
    return 'Hello Base';
};

BaseClass.prototype.render = function () {
    return <div>Base</div>;
};
