import LanguageLocale from 'utils/LanguageLocale';
import { Link, Text, Box } from 'components/ui';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors, lineHeights, space } from 'style/config';

const getText = LanguageLocale.getLocaleResourceFile('components/FrictionlessCheckout/SddSection/locales', 'SddSection');

const SameDaySkuOOSException = ({ addMarginBottom, hasPadding, addMarginTop }) => (
    <Box
        marginBottom={addMarginBottom && space[1]}
        paddingX={hasPadding && [space[1], 5]}
        marginTop={addMarginTop && space[1]}
        lineHeight={lineHeights.tight}
    >
        <Text color={colors.red}>
            {`${getText('oosError')} `}
            <Link
                href='/basket'
                color={colors.blue}
            >
                {getText('oosBasket')}
            </Link>
            {` ${getText('oosUpdate')}`}
        </Text>
    </Box>
);

SameDaySkuOOSException.defaultProps = {};
SameDaySkuOOSException.propTypes = {};

export default wrapFunctionalComponent(SameDaySkuOOSException, 'SameDaySkuOOSException');
