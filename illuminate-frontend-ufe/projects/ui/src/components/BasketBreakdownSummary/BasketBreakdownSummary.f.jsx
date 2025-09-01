/* eslint-disable class-methods-use-this */
import { colors, space, fontWeights } from 'style/config';
import {
    Grid, Icon, Flex, Link, Text, Box
} from 'components/ui';
import React from 'react';
import PropTypes from 'prop-types';
import UI from 'utils/UI';
import FrameworkUtils from 'utils/framework';
import AddToBasketActions from 'actions/AddToBasketActions';
import OrderStatusDisplayName from 'components/RichProfile/MyAccount/OrderDetail/OrderStatusDisplayName/OrderStatusDisplayName';
import { SDD_ORDER_DETAILS, STANDARD_SHIPPING_ORDER_DETAILS } from 'utils/OrderDetails';
import localeUtils from 'utils/LanguageLocale';

const { wrapFunctionalComponent } = FrameworkUtils;
const { BASKET_TYPES } = AddToBasketActions;

const getText = localeUtils.getLocaleResourceFile('components/BasketBreakdownSummary/locales', 'BasketBreakdownSummary');

function BasketBreakdownSummary({
    itemsByBasket,
    bold,
    borderTop,
    standardStatus,
    sddStatus,
    sddStatusDisplayName,
    standardStatusDisplayName,
    itemsLink,
    sameDayUnlimitedShippingGroup
}) {
    if (!Array.isArray(itemsByBasket)) {
        return null;
    }

    const sddBasket = itemsByBasket.find(b => b.basketType === BASKET_TYPES.SAMEDAY_BASKET);
    const standardBasket = itemsByBasket.find(b => b.basketType === BASKET_TYPES.STANDARD_BASKET);
    const hasAllShippingTypes = sddBasket && standardBasket;

    if (!hasAllShippingTypes) {
        return null;
    }

    const itemInflection = count => `(${count} ${getText(count === 1 ? 'item' : 'items')})`;
    const sameDayMessage = sameDayUnlimitedShippingGroup ? getText('sameDayUnlimited') : getText('sameDayDelivery');
    const standardMessage = getText('standard');

    return (
        <Grid
            columns='1fr auto'
            alignItems='center'
            gap={3}
            marginTop={borderTop && space[1]}
            paddingTop={borderTop && space[1]}
            borderTop={borderTop && 1}
            borderColor={borderTop && colors.lightGray}
        >
            <Flex
                alignItems='center'
                fontWeight={bold && fontWeights.bold}
            >
                <Icon
                    marginRight={3}
                    data-at={Sephora.debug.dataAt('icon_same_day')}
                    name='bag'
                />
                <Box maxWidth='70px'>{sameDayMessage}</Box>
                {itemsLink ? (
                    <Link
                        marginLeft={2}
                        color='blue'
                        onClick={() => {
                            UI.scrollTo({ elementId: SDD_ORDER_DETAILS });
                        }}
                    >
                        {itemInflection(sddBasket.itemsCount)}
                    </Link>
                ) : (
                    <Text marginLeft={2}>{itemInflection(sddBasket.itemsCount)}</Text>
                )}
            </Flex>
            <OrderStatusDisplayName
                orderStatusDisplayName={sddStatusDisplayName}
                orderStatus={sddStatus}
            />
            <Flex
                alignItems='center'
                fontWeight={bold && fontWeights.bold}
            >
                <Icon
                    marginRight={3}
                    data-at={Sephora.debug.dataAt('icon_same_day')}
                    name='truck'
                />
                {standardMessage}
                {itemsLink ? (
                    <Link
                        marginLeft={2}
                        color='blue'
                        onClick={() => {
                            UI.scrollTo({ elementId: STANDARD_SHIPPING_ORDER_DETAILS });
                        }}
                    >
                        {itemInflection(standardBasket.itemsCount)}
                    </Link>
                ) : (
                    <Text marginLeft={2}>{itemInflection(standardBasket.itemsCount)}</Text>
                )}
            </Flex>
            <OrderStatusDisplayName
                orderStatusDisplayName={standardStatusDisplayName}
                orderStatus={standardStatus}
            />
        </Grid>
    );
}

BasketBreakdownSummary.defaultProps = {
    itemsLink: false,
    bold: false,
    isRopisSkuAdded: false
};
BasketBreakdownSummary.propTypes = {
    itemsByBasket: PropTypes.array,
    isRopisSkuAdded: PropTypes.bool,
    bold: PropTypes.bool,
    standardStatus: PropTypes.string,
    sddStatus: PropTypes.string,
    sddStatusDisplayName: PropTypes.string,
    standardStatusDisplayName: PropTypes.string,
    itemsLink: PropTypes.bool
};

export default wrapFunctionalComponent(BasketBreakdownSummary, 'BasketBreakdownSummary');
