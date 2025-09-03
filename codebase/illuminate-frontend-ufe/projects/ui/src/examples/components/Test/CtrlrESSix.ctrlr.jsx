/* eslint-disable class-methods-use-this */

/* eslint-disable no-console */
/* eslint-disable no-undef */
const React = require('react');
const { wrapComponent } = require('utils/framework').default;
const BaseClass = require('components/BaseClass').default;

const ReactDOM = require('react-dom');

class CtrlrESSix extends BaseClass {
    propCtrlr = 'propCtrlrVal';

    constructor(props) {
        super(props);
        this.state = {};

        if (!Sephora.isNodeRender) {
            this.click = this.click.bind(this);
            this.ctrlr = this.ctrlr.bind(this);
        }
    }

    /* onClick Handler */
    click = function () {
        /* eslint-disable-next-line  no-alert*/
        alert(this.class + ' CLICKED!');
        this.setState({}, () => console.log('re-Rendered'));
    };

    /* This is run by componentDidMount() */
    ctrlr = function () {
        var el = ReactDOM.findDOMNode(this);
        console.log(this.class + ' Controller Run: ' + el);
    };

    /* You can use any react lifecycle functions by attaching them to the prototype */
    // eslint-disable-next-line camelcase
    UNSAFE_componentWillMount = function () {
        console.log('Test Component is about to Mount');
    };

    getContent() {
        return 'Im a Super function';
    }

    render() {
        return (
            <div onClick={this.click}>
                ES6 Ctrlr JSX Component
                {/* If super component references variables that change that aren't in
                    the component's props or state they will not be taken into account by
                    shouldComponentUpdate() and the component may not rerender */}
                <div>{SuperComponent.prototype.render.call(this)}</div>
            </div>
        );
    }
}

module.exports = wrapComponent(CtrlrESSix, 'CtrlrESSix', true);
