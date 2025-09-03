import {
    borders, colors, fontSizes, fontWeights, lineHeights, mediaQueries, space
} from 'style/config';
import { Divider, Link, Text } from 'components/ui';
import OrderItemList from 'components/OrderConfirmation/OrderItemList/OrderItemList';
import OrderTotal from 'components/OrderConfirmation/OrderTotal';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';

const ShippingGroup = ({
    children,
    items,
    itemsPriceInfo,
    orderDetailsLink,
    orderLocale,
    showTotals,
    title,
    viewOrderLink,
    viewOrderText,
    mixedBasketGiftMessageStandard1,
    mixedBasketGiftMessageStandard2,
    digitalGiftMessageEmail,
    shippingGroup,
    showSplitEDD
}) => {
    return (
        <>
            {showSplitEDD || (
                <LegacySubHeader
                    title={title}
                    children={children}
                    viewOrderText={viewOrderText}
                    orderDetailsLink={orderDetailsLink}
                    viewOrderLink={viewOrderLink}
                    digitalGiftMessageEmail={digitalGiftMessageEmail}
                    mixedBasketGiftMessageStandard1={mixedBasketGiftMessageStandard1}
                    mixedBasketGiftMessageStandard2={mixedBasketGiftMessageStandard2}
                />
            )}
            <OrderItemList
                items={items}
                customStyle={showSplitEDD ? styles.splitEDDItemsList : styles.orderItemList}
                shippingGroup={shippingGroup}
                showSplitEDD={showSplitEDD}
            />
            {showTotals && (
                <>
                    <Divider css={styles.divider} />
                    <OrderTotal
                        orderLocale={orderLocale}
                        priceInfo={itemsPriceInfo}
                        ssdOrder
                    />
                </>
            )}
        </>
    );
};

const LegacySubHeader = ({
    title,
    children,
    viewOrderText,
    orderDetailsLink,
    viewOrderLink,
    digitalGiftMessageEmail,
    mixedBasketGiftMessageStandard1,
    mixedBasketGiftMessageStandard2
}) => {
    return (
        <>
            {title && (
                <Text
                    is='p'
                    css={styles.title}
                >
                    {title}
                </Text>
            )}
            {children}
            <Text
                is='p'
                css={styles.viewOrderText}
            >
                {viewOrderText}
                <Link
                    href={orderDetailsLink}
                    css={styles.viewOrderLink}
                >
                    {viewOrderLink}
                </Link>
            </Text>
            {digitalGiftMessageEmail && (
                <Text
                    is='p'
                    css={styles.viewOrderText}
                    data-at={Sephora.debug.dataAt('order_confirmation_gift_message')}
                >
                    {mixedBasketGiftMessageStandard1}
                    <strong>{` ${digitalGiftMessageEmail} `}</strong>
                    {mixedBasketGiftMessageStandard2}
                </Text>
            )}
        </>
    );
};

const styles = {
    divider: {
        border: `${borders[1]} ${colors.nearWhite}`,
        margin: `${space[5]}px 0`
    },
    title: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        lineHeight: '20px',
        marginTop: space[5]
    },
    viewOrderText: {
        lineHeight: lineHeights.tight,
        margin: `${space[4]}px 0`,
        [mediaQueries.md]: { lineHeight: '17px' }
    },
    viewOrderLink: { color: colors.blue },
    orderItemList: { header: { marginTop: space[0] } },
    splitEDDItemsList: { root: { marginTop: space[5] } }
};

ShippingGroup.defaultProps = {
    showTotals: false,
    title: ''
};
ShippingGroup.propTypes = {
    items: PropTypes.array.isRequired,
    itemsPriceInfo: PropTypes.object.isRequired,
    orderDetailsLink: PropTypes.string.isRequired,
    orderLocale: PropTypes.string.isRequired,
    showTotals: PropTypes.bool,
    title: PropTypes.string,
    viewOrderLink: PropTypes.string.isRequired,
    viewOrderText: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(ShippingGroup, 'ShippingGroup');
