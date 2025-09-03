/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { space } from 'style/config';
import { Box, Text, Grid } from 'components/ui';
import BasketBreakdownSummary from 'components/BasketBreakdownSummary/BasketBreakdownSummary';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile(
    'components/RichProfile/MyAccount/OrderDetail/StandardAndSddOrderSummary/locales',
    'StandardAndSddOrderSummary'
);

const StandardAndSddOrderSummary = props => {
    return (
        <Grid
            alignItems='flex-start'
            columns={[null, null, 2]}
            gap={5}
        >
            <Box
                borderRadius={2}
                padding={3}
                backgroundColor='nearWhite'
                lineHeight='tight'
            >
                <Text
                    is='h3'
                    fontSize='md'
                    fontWeight={'bold'}
                    children={getText('orderSummary')}
                    marginBottom={space[1]}
                />
                <BasketBreakdownSummary
                    {...props}
                    itemsLink
                />
            </Box>
        </Grid>
    );
};

StandardAndSddOrderSummary.defaultProps = {
    itemsLink: false
};
StandardAndSddOrderSummary.propTypes = {
    itemsLink: PropTypes.bool
};

export default wrapFunctionalComponent(StandardAndSddOrderSummary, 'StandardAndSddOrderSummary');
