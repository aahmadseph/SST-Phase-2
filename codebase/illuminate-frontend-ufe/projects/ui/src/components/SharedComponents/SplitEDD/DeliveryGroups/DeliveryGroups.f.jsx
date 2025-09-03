import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Box } from 'components/ui';
import CheckoutItemsList from 'components/Checkout/OrderSummary/CheckoutItemsList/CheckoutItemsList';

function DeliveryGroups(props) {
    const { computedDeliveryGroups } = props;

    return (
        <Box
            marginRight={4}
            css={{
                '& > :last-child': {
                    marginBottom: 0
                }
            }}
        >
            {computedDeliveryGroups.map(deliveryGroup => {
                return (
                    <Box marginBottom={4}>
                        <Text
                            is='p'
                            marginBottom={2}
                            fontWeight='bold'
                            color='green'
                            lineHeight='tight'
                            fontSize='sm'
                        >
                            {deliveryGroup.showEstimatedDeliveryDateRange
                                ? deliveryGroup.shippingMethodDescription
                                : `${deliveryGroup.promiseDateLabel} ${deliveryGroup.promiseDateValue}`}
                        </Text>
                        <CheckoutItemsList
                            items={deliveryGroup.items}
                            isSplitEDDVariant={true}
                        />
                    </Box>
                );
            })}
        </Box>
    );
}

DeliveryGroups.propTypes = {
    computedDeliveryGroups: PropTypes.array
};

DeliveryGroups.defaultProps = {
    computedDeliveryGroups: []
};

export default wrapFunctionalComponent(DeliveryGroups, 'DeliveryGroups');
