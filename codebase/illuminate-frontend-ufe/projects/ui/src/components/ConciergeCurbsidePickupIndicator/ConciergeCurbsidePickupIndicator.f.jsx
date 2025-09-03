import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import LanguageLocale from 'utils/LanguageLocale';
import CurbsidePickupIndicator from 'components/CurbsidePickupIndicator';

const getText = LanguageLocale.getLocaleResourceFile('components/ConciergeCurbsidePickupIndicator/locales', 'ConciergeCurbsidePickupIndicator');

function ConciergeCurbsidePickupIndicator(props) {
    const text = props.children || getText('conciergeCurbsidePickupAvailable');

    return (
        <CurbsidePickupIndicator
            iconName={props.iconName}
            iconColor={props.iconColor}
            {...props}
        >
            {text}
        </CurbsidePickupIndicator>
    );
}

ConciergeCurbsidePickupIndicator.defaultProps = {
    marginTop: '',
    iconName: 'star',
    iconColor: 'yellow'
};

ConciergeCurbsidePickupIndicator.propTypes = {
    marginTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is: PropTypes.string,
    dataAt: PropTypes.string,
    iconName: PropTypes.string,
    iconColor: PropTypes.string
};

export default wrapFunctionalComponent(ConciergeCurbsidePickupIndicator, 'ConciergeCurbsidePickupIndicator');
