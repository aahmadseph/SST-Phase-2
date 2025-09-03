var BaseClass = require('components/Test/BaseClass').prototype.originClass;

var Test = function () {
    BaseClass.apply(this, arguments);
    this.state = {};
};

Test.prototype = Object.assign({}, BaseClass.prototype);

Test.prototype.getTestContent = function () {
    return 'Hello ' + this.props.greeting;
};

Test.prototype.render = function () {
    return (
        <div>
            <div onClick={this.click}>
                <h1>{this.getTestContent()}</h1>
            </div>
            <div>{BaseClass.prototype.render.apply(this)}</div>
        </div>
    );
};
