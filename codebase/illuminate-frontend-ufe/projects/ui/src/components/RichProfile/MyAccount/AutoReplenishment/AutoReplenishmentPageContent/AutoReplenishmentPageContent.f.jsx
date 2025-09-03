/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import AutoReplenishEmptyHub from 'components/RichProfile/MyAccount/AutoReplenishment/AutoReplenishEmptyHub';
import AutoReplenishment from 'components/RichProfile/MyAccount/AutoReplenishment';

function AutoReplenishmentPageContent(props) {
    return props.shouldRenderEmptyHub ? <AutoReplenishEmptyHub /> : <AutoReplenishment />;
}

AutoReplenishmentPageContent.propTypes = {
    shouldRenderEmptyHub: PropTypes.bool.isRequired
};

export default wrapFunctionalComponent(AutoReplenishmentPageContent, 'AutoReplenishmentPageContent');
