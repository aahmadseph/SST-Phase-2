import LanguageLocale from 'utils/LanguageLocale';
import { Link, Text } from 'components/ui';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

const getText = LanguageLocale.getLocaleResourceFile('components/Checkout/Sections/SddSections/SddSection/locales', 'SddSection');

const SameDaySkuOOSException = () => (
    <Text>
        {`${getText('oosError')} `}
        <Link
            href='/basket'
            color={'blue'}
        >
            {getText('oosBasket')}
        </Link>
        {` ${getText('oosUpdate')}`}
    </Text>
);

SameDaySkuOOSException.defaultProps = {};
SameDaySkuOOSException.propTypes = {};

export default wrapFunctionalComponent(SameDaySkuOOSException, 'SameDaySkuOOSException');
