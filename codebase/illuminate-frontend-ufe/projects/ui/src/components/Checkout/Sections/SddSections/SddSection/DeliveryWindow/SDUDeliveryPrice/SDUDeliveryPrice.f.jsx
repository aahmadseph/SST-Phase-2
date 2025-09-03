import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile(
    'components/Checkout/Sections/SddSections/SddSection/DeliveryWindow/SDUDeliveryPrice/locales',
    'SDUDeliveryPrice'
);

const SDUDeliveryPrice = ({ isCanada }) => {
    return (
        <Text
            is='p'
            color='gray'
            fontSize='sm'
            lineHeight='tight'
        >
            {isCanada ? getText('sduMemberFeeCA') : getText('sduMemberFeeUS')}{' '}
            <Text
                is='br'
                display={['none', 'block']}
            />
            {isCanada ? getText('sduScheduledFeeCA') : getText('sduScheduledFeeUS')}
        </Text>
    );
};

SDUDeliveryPrice.defaultProps = {
    sduMemberFeeUS: '',
    sduMemberFeeCA: '',
    sduScheduledFeeUS: '',
    sduScheduledFeeCA: ''
};

SDUDeliveryPrice.propTypes = {
    sduMemberFeeUS: PropTypes.string.isRequired,
    sduMemberFeeCA: PropTypes.string.isRequired,
    sduScheduledFeeUS: PropTypes.string.isRequired,
    sduScheduledFeeCA: PropTypes.string.isRequired,
    isCanada: PropTypes.bool.isRequired
};

export default wrapFunctionalComponent(SDUDeliveryPrice, 'SDUDeliveryPrice');
