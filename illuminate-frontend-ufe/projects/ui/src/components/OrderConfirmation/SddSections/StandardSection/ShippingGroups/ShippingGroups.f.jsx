import { colors, borders, space } from 'style/config';
import { Divider } from 'components/ui';
import DeliveryInfo from 'components/OrderConfirmation/SddSections/StandardSection/ShippingGroups/DeliveryInfo';
import React from 'react';
import PropTypes from 'prop-types';
import ShippingGroup from 'components/OrderConfirmation/SddSections/StandardSection/ShippingGroups/ShippingGroup';
import StringUtils from 'utils/String';
import { wrapFunctionalComponent } from 'utils/framework';

const ShippingGroups = ({
    deliveryOnText,
    giftItems,
    giftItemsDeliveryOnDate,
    giftItemsPriceInfo,
    hardGoodItems,
    hardGoodItemsDeliveryOnDate,
    hardGoodItemsPriceInfo,
    multipleShippingGroups,
    orderDetailsLink,
    shippingGroupTitle,
    hasSDUInBasket,
    showTotals = true,
    shippingGroup,
    showSplitEDD
}) => {
    if (!multipleShippingGroups) {
        return (
            // Render SDD + STH
            <ShippingGroup
                items={[...hardGoodItems, ...giftItems]}
                orderDetailsLink={orderDetailsLink}
                shippingGroup={shippingGroup}
                showSplitEDD={showSplitEDD}
            />
        );
    }

    let shippingGroupNumber = 0;

    return (
        <>
            {!!hardGoodItems.length && (
                <>
                    <ShippingGroup
                        items={hardGoodItems}
                        itemsPriceInfo={hardGoodItemsPriceInfo}
                        orderDetailsLink={orderDetailsLink}
                        showTotals={showTotals}
                        title={!hasSDUInBasket && StringUtils.format(shippingGroupTitle, ++shippingGroupNumber)}
                    >
                        <DeliveryInfo
                            deliveryOnDate={hardGoodItemsDeliveryOnDate}
                            deliveryOnText={deliveryOnText}
                        />
                    </ShippingGroup>
                </>
            )}
            {!!giftItems.length && (
                <>
                    <Divider css={styles.divider} />
                    <ShippingGroup
                        items={giftItems}
                        itemsPriceInfo={giftItemsPriceInfo}
                        orderDetailsLink={orderDetailsLink}
                        showTotals
                        title={StringUtils.format(shippingGroupTitle, ++shippingGroupNumber)}
                    >
                        <DeliveryInfo
                            deliveryOnDate={giftItemsDeliveryOnDate}
                            deliveryOnText={deliveryOnText}
                        />
                    </ShippingGroup>
                </>
            )}
        </>
    );
};

const styles = {
    divider: {
        border: `${borders[1]} ${colors.nearWhite}`,
        margin: `${space[5]}px 0`
    }
};

ShippingGroups.defaultProps = {};
ShippingGroups.propTypes = {
    deliveryOnText: PropTypes.string.isRequired,
    giftItems: PropTypes.array.isRequired,
    giftItemsDeliveryOnDate: PropTypes.string.isRequired,
    giftItemsPriceInfo: PropTypes.object.isRequired,
    hardGoodItems: PropTypes.array.isRequired,
    hardGoodItemsDeliveryOnDate: PropTypes.string.isRequired,
    hardGoodItemsPriceInfo: PropTypes.object.isRequired,
    multipleShippingGroups: PropTypes.bool.isRequired,
    orderDetailsLink: PropTypes.string.isRequired,
    shippingGroupTitle: PropTypes.string.isRequired,
    hasSDUInBasket: PropTypes.bool.isRequired
};

export default wrapFunctionalComponent(ShippingGroups, 'ShippingGroups');
