import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Flex } from 'components/ui';

const PRODUCT_ERROR_CODES = {
    COUNTRY_RESTRICTED_SKU: -4,
    INACTIVE_SKU: -12,
    INVALID_INPUT: -13,
    SKU_NOT_AVAILABLE: -15
};
// Error handling will be refined in https://jira.sephora.com/browse/GUAR-6427
const PRODUCT_ERROR_MESSAGES = {
    [PRODUCT_ERROR_CODES.COUNTRY_RESTRICTED_SKU]: 'Sorry, this product is not available in your country.',
    [PRODUCT_ERROR_CODES.INACTIVE_SKU]: 'Sorry, this product is no longer available.',
    [PRODUCT_ERROR_CODES.INVALID_INPUT]: 'Sorry, this product is no longer available.',
    [PRODUCT_ERROR_CODES.SKU_NOT_AVAILABLE]: 'Sorry, this product is no longer available.',
    UNKNOWN: 'Sorry, product details are not available right now. Please try again later.'
};

class ErrorDisplay extends BaseClass {
    getProductError = error => {
        return PRODUCT_ERROR_MESSAGES[error.errorCode] || PRODUCT_ERROR_MESSAGES.UNKNOWN;
    };

    render() {
        const { error, apiError } = this.props;

        if (error) {
            return (
                <Flex
                    flexDirection='column'
                    textAlign='center'
                    justifyContent='center'
                    height={[null, 412]}
                    fontSize={[null, 'md']}
                    color='error'
                >
                    {this.getProductError(error)}
                </Flex>
            );
        }

        if (apiError) {
            return (
                <Box
                    width='343px'
                    textAlign='center'
                    justifyContent='center'
                    color='error'
                >
                    {apiError}
                </Box>
            );
        }

        return null;
    }
}

export default wrapComponent(ErrorDisplay, 'ErrorDisplay', true);
