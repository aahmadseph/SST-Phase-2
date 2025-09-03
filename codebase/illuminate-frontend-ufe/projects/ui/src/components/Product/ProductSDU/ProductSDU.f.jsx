import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Flex } from 'components/ui';
import SDURenewalPricing from 'components/SDURenewalPricing';

const ProductSDU = ({
    price, date, sephoraSubscription, sameDayUnlimited, qty, isTrial, free
}) => {
    return (
        <React.Fragment>
            <Box
                data-at={Sephora.debug.dataAt('item_brand_label')}
                fontWeight='bold'
            >
                {sephoraSubscription}
            </Box>
            {sameDayUnlimited}
            <Box marginTop={1}>
                <SDURenewalPricing
                    hasUserSDUTrial={isTrial}
                    SDUFormattedDate={date}
                    sduListPrice={price}
                />
            </Box>
            <Flex
                justifyContent='space-between'
                marginTop={2}
                fontWeight='bold'
            >
                <span data-at={Sephora.debug.dataAt('qty_label')}>{qty}: 1</span>
                <div data-at={Sephora.debug.dataAt('item_price')}>{isTrial ? free : price}*</div>
            </Flex>
        </React.Fragment>
    );
};

ProductSDU.defaultProps = {};

ProductSDU.propTypes = {
    price: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    sephoraSubscription: PropTypes.string.isRequired,
    sameDayUnlimited: PropTypes.string.isRequired,
    qty: PropTypes.string.isRequired,
    isTrial: PropTypes.bool.isRequired,
    free: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(ProductSDU, 'ProductSDU');
