/*global Test*/
var ReactDOM = require('react-dom');

/* onClick Handler */
Test.prototype.click = function () {
    /* eslint-disable-next-line  no-alert*/
    alert(this.class + '!!! YEAHHH!');
    /* eslint-disable-next-line no-console */
    this.setState({}, () => console.log('re-Rendered'));
};

/* This is run by componentDidMount() if you are using react */
Test.prototype.ctrlr = function () {
    // var el = this.getDOMNode();
    // eslint-disable-next-line no-unused-vars
    var el = ReactDOM.findDOMNode(this);
};

/* You can use any react lifecycle functions by attaching them to the prototype */
// eslint-disable-next-line no-undef
// eslint-disable-next-line camelcase
Test.prototype.UNSAFE_componentWillMount = function () {
    /* eslint-disable-next-line no-console */
    console.log('Test Component is about to Mount');
};
