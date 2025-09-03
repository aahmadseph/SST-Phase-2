import { Link, Text } from 'components/ui';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import PropTypes from 'prop-types';

const SameDaySkuOOSException = ({ oosBasket, oosUpdate, oosError }) => (
    <Text is='p'>
        {oosError}
        <Link
            href='/basket'
            color={'blue'}
            marginX={1}
        >
            {oosBasket}
        </Link>
        {oosUpdate}
    </Text>
);

SameDaySkuOOSException.propTypes = {
    oosError: PropTypes.string.isRequired,
    oosBasket: PropTypes.string.isRequired,
    oosUpdate: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(SameDaySkuOOSException, 'SameDaySkuOOSException');
