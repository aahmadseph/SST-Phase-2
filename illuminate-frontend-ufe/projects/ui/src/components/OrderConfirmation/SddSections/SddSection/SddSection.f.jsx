import {
    Box, Divider, Icon, Link, Text
} from 'components/ui';
import {
    colors, fontSizes, fontWeights, lineHeights, mediaQueries, space
} from 'style/config';
import FulfillmentStatus from 'components/OrderConfirmation/FulfillmentStatus';
import OrderItemList from 'components/OrderConfirmation/OrderItemList/OrderItemList';
import OrderTotal from 'components/OrderConfirmation/OrderTotal';
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';

const SddSection = ({
    deliveryInfo,
    emailUpdatesText,
    orderDetailsLink,
    orderLocale,
    orderStates,
    sddItems,
    sddItemsPriceInfo,
    showTotals,
    title,
    viewOrderLink,
    viewOrderText,
    mixedBasketGiftMessageSdd1,
    mixedBasketGiftMessageSdd2,
    digitalGiftMessageEmail,
    whatToExpectText,
    sduListPrice,
    skuTrialPeriod,
    isSDUInOrder,
    viewOrderTextForSDU,
    sduRenewDate,
    standardAndSDUInOrder,
    isSDUSubscription,
    isSDUOrderOnly,
    isSDUTrial,
    isSameDayOrder,
    biInfo
}) => (
    <>
        <Box css={styles.header}>
            <Icon
                name='bag'
                css={styles.icon}
            />
            <Box>
                <Text
                    is='p'
                    css={styles.title}
                >
                    {title}
                </Text>
                <Text
                    is='p'
                    css={styles.deliveryInfo}
                >
                    {deliveryInfo}
                </Text>
            </Box>
        </Box>
        {!standardAndSDUInOrder && (
            <Box css={styles.fulfillmentStatusBox}>
                {
                    <FulfillmentStatus
                        pickupOrderStates={orderStates}
                        isSameDayOrder={isSameDayOrder}
                        isCheckout={true}
                    />
                }
            </Box>
        )}
        {!standardAndSDUInOrder && (
            <Text
                is='p'
                css={styles.whatToExpectText}
            >
                {whatToExpectText}
            </Text>
        )}
        {!standardAndSDUInOrder && (
            <Text
                is='p'
                css={styles.emailUpdatesText}
            >
                {emailUpdatesText}
            </Text>
        )}
        <Text
            is='p'
            css={styles.viewOrderText}
        >
            {isSDUInOrder ? viewOrderTextForSDU : viewOrderText}
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
                {mixedBasketGiftMessageSdd1}
                <strong>{` ${digitalGiftMessageEmail} `}</strong>
                {mixedBasketGiftMessageSdd2}
            </Text>
        )}
        <OrderItemList
            items={sddItems}
            customStyle={styles.orderItemList}
            sduListPrice={sduListPrice}
            skuTrialPeriod={skuTrialPeriod}
            isSDUTrial={isSDUTrial}
            sduRenewDate={sduRenewDate}
            isSDUSubscription={isSDUSubscription}
            isSDUOrderOnly={isSDUOrderOnly}
            showItemSubstitution={Sephora.configurationSettings.isItemSubstitutionEnabled}
            sameDayType={true}
        />
        {showTotals && (
            <>
                <Divider css={styles.divider} />
                <OrderTotal
                    orderLocale={orderLocale}
                    priceInfo={sddItemsPriceInfo}
                    redeemedPoints={biInfo.redeemedPoints}
                    ssdOrder
                />
            </>
        )}
    </>
);

const styles = {
    header: {
        alignItems: 'center',
        display: 'flex'
    },
    icon: { marginRight: space[3] },
    title: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        [mediaQueries.md]: {
            fontSize: fontSizes.md,
            lineHeight: '20px'
        }
    },
    deliveryInfo: {
        fontSize: fontSizes.sm,
        lineHeight: '14px'
    },
    fulfillmentStatusBox: { paddingTop: space[4] },
    whatToExpectText: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        marginTop: space[4]
    },
    emailUpdatesText: {
        fontSize: fontSizes.base,
        lineHeight: lineHeights.tight,
        marginTop: space[4]
    },
    viewOrderText: {
        lineHeight: lineHeights.tight,
        margin: `${space[4]}px 0`,
        [mediaQueries.md]: { lineHeight: '17px' }
    },
    viewOrderLink: { color: colors.blue },
    orderItemList: { header: { marginTop: space[0] } }
};

SddSection.defaultProps = {
    isSameDayOrder: false
};
SddSection.propTypes = {
    deliveryInfo: PropTypes.string.isRequired,
    emailUpdatesText: PropTypes.string.isRequired,
    orderDetailsLink: PropTypes.string.isRequired,
    orderLocale: PropTypes.string.isRequired,
    orderStates: PropTypes.array.isRequired,
    sddItems: PropTypes.array.isRequired,
    sddItemsPriceInfo: PropTypes.object.isRequired,
    showTotals: PropTypes.bool,
    title: PropTypes.string.isRequired,
    viewOrderLink: PropTypes.string.isRequired,
    viewOrderText: PropTypes.string.isRequired,
    whatToExpectText: PropTypes.string.isRequired,
    viewOrderTextForSDU: PropTypes.string.isRequired,
    isSameDayOrder: PropTypes.bool
};

export default wrapFunctionalComponent(SddSection, 'SddSection');
