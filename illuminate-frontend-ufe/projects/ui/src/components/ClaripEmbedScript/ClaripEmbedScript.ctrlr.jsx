/* eslint-disable class-methods-use-this */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { initialize, load } from 'utils/claripScript';
import { wrapComponent } from 'utils/framework';

initialize();

class ClaripEmbedScript extends BaseClass {
    componentDidMount() {
        load(this.props.onload);
    }

    render() {
        return null;
    }
}

ClaripEmbedScript.propTypes = {
    onload: PropTypes.func.isRequired
};

export default wrapComponent(ClaripEmbedScript, 'ClaripEmbedScript', true);
