/*global SuperESSix*/
/* eslint-disable no-console */
var ReactDOM = require('react-dom');

/* onClick Handler */
SuperESSix.prototype.click = function () {
    /* eslint-disable-next-line  no-alert*/
    alert(this.class + ' CLICKED!');
    this.setState({}, () => console.log('re-Rendered'));
};

/* This is run by componentDidMount() */
SuperESSix.prototype.ctrlr = function () {
    // eslint-disable-next-line no-unused-vars
    var el = ReactDOM.findDOMNode(this);
};

/* You can use any react lifecycle functions by attaching them to the prototype */
// eslint-disable-next-line camelcase
SuperESSix.prototype.UNSAFE_componentWillMount = function () {
    console.log('Test Component is about to Mount');
};
