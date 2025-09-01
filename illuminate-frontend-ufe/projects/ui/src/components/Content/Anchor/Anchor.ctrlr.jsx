import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import Location from 'utils/Location';
import UI from 'utils/UI';
import BaseClass from 'components/BaseClass';

class Anchor extends BaseClass {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const anchor = Location.getLocation().hash.replace('#', '');

        if (this.props.sid && this.props.sid === anchor) {
            setTimeout(() => {
                UI.getScrollSmooth(anchor);
            }, 1000);
        }
    }

    render() {
        const sid = this.props.sid;

        if (!sid) {
            return null;
        }

        return <div id={sid} />;
    }
}

Anchor.propTypes = {
    sid: PropTypes.string.isRequired
};

export default wrapComponent(Anchor, 'Anchor');
