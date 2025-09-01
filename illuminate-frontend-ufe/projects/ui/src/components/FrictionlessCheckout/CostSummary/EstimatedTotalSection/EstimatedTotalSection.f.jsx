import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Text, Link
} from 'components/ui';

import PlaceOrderButton from 'components/FrictionlessCheckout/PlaceOrderButton';

import KlarnaMarketing from 'components/Klarna/KlarnaMarketing';

import localeUtils from 'utils/LanguageLocale';
import mediaUtils from 'utils/Media';

import anaConsts from 'analytics/constants';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

import { colors, fontSizes, fontWeights } from 'style/config';
const { Media } = mediaUtils;

function EstimatedTotal({
    estimatedTotalFontSize,
    grossSubTotal,
    hasPickupSubstituteItems,
    hasSameDaySubstituteItems,
    totalItems,
    subtotal,
    locales,
    showXItems,
    storeCardAmount,
    creditCardAmount
}) {
    const showStar = hasPickupSubstituteItems || hasSameDaySubstituteItems;
    const totalLabel = showXItems ? `${locales.estimatedTotal} (${totalItems} ${locales.items})` : locales.estimatedTotal;
    const totalAmount = showStar
        ? `${storeCardAmount ? creditCardAmount || '$0.00' : subtotal}*`
        : storeCardAmount
            ? creditCardAmount || '$0.00'
            : subtotal;

    return (
        <Flex
            is='h4'
            alignItems='center'
            justifyContent='space-between'
            fontSize={estimatedTotalFontSize}
            fontWeight={fontWeights.bold}
            role='row'
            aria-label={`${totalLabel}: ${totalAmount}`}
        >
            <Text
                data-at={Sephora.debug.dataAt('total_label')}
                children={totalLabel}
                role='cell'
            />
            <Box
                is='span'
                alignItems='baseline'
                display='inline-flex'
                gap={1}
                role='cell'
            >
                {(grossSubTotal || storeCardAmount) && (
                    <Text
                        color={colors.gray}
                        fontWeight={fontWeights.normal}
                        css={{ textDecoration: 'line-through' }}
                        data-at={Sephora.debug.dataAt('bsk_total_without_discount_cc')}
                        children={showStar ? `${grossSubTotal || subtotal}*` : grossSubTotal || subtotal}
                        aria-label={`${locales.originalPrice}: ${grossSubTotal || subtotal}`}
                    />
                )}
                <Text
                    data-at={Sephora.debug.dataAt('bsk_total_cc')}
                    children={totalAmount}
                    aria-label={`${locales.finalTotal}: ${totalAmount}`}
                />
            </Box>
        </Flex>
    );
}

function BuyNowPayLater({
    replenishmentDiscountAmount,
    isSDUItemInBasket,
    isAfterpayCheckoutEnabled,
    isAfterpayEnabledForProfile,
    isKlarnaCheckoutEnabled,
    isPayPalPayLaterEligible,
    firstBuyDiscountTotal,
    subtotal
}) {
    const { afterpayEnabled: isAfterpayPaymentEnabled, isKlarnaPaymentEnabled } = Sephora.configurationSettings;

    const isAfterpayEnabled = isAfterpayPaymentEnabled && isAfterpayCheckoutEnabled && isAfterpayEnabledForProfile;
    const isKlarnaEnabled = isKlarnaPaymentEnabled && isKlarnaCheckoutEnabled;
    const isPayPalPayLaterEligibleEnabled = Sephora.configurationSettings.isPayPalEnabled && isPayPalPayLaterEligible;

    // If Klarna AND After pay are falsy OR any of the others then return null.
    if ((!isAfterpayEnabled && !isKlarnaEnabled && !isPayPalPayLaterEligibleEnabled) || isSDUItemInBasket || replenishmentDiscountAmount != null) {
        return null;
    }

    return (
        <KlarnaMarketing
            subtotal={subtotal}
            firstBuyDiscountTotal={firstBuyDiscountTotal}
            analyticsPageType={anaConsts.PAGE_TYPES.CHECKOUT}
            analyticsContext={anaConsts.CONTEXT.CHECKOUT_PAGE}
            isAfterpayEnabled={isAfterpayEnabled}
            isKlarnaEnabled={isKlarnaEnabled}
            isPayPalPayLaterEligibleEnabled={isPayPalPayLaterEligibleEnabled}
        />
    );
}

function SDUMessaging({ locales }) {
    const { youSave, sduSavingsCA, sduSavingsUS, withSDUUnlimited } = locales;

    return (
        <Text
            is='p'
            fontSize='sm'
            color='green'
            data-at={Sephora.debug.dataAt('sdu_savings_label')}
        >
            {`${youSave} `}
            <strong children={localeUtils.isCanada() ? sduSavingsCA : sduSavingsUS} />
            {` ${withSDUUnlimited}`}
        </Text>
    );
}

function EstimatedTotalSection({
    grossSubTotal,
    subtotal,
    isBopis,
    totalItems,
    isAfterpayCheckoutEnabled,
    isAfterpayEnabledForProfile,
    isKlarnaCheckoutEnabled,
    firstBuyDiscountTotal,
    hasPickupSubstituteItems,
    hasSameDaySubstituteItems,
    isSDUItemInBasket,
    isSDDBasketAvailable,
    isUserSDUMember,
    isSDUOnlyInBasket,
    replenishmentDiscountAmount,
    showShippingAndTaxes,
    isPayPalPayLaterEligible,
    locales,
    placeOrderLabel,
    storeCardAmount,
    creditCardAmount
}) {
    const { bopisTaxes, shippingAndTaxes } = locales;
    const isSDU = isUserSDUMember || isSDUItemInBasket;
    const hasSDDItem = isSDDBasketAvailable && !isSDUOnlyInBasket;
    const showSDUMessage = isSDU && hasSDDItem;

    const renderShippingTaxesText = (
        <Text
            is='p'
            color={colors.gray}
            fontSize={'sm'}
            data-at={Sephora.debug.dataAt('shipping_taxes_label')}
            children={isBopis ? bopisTaxes : shippingAndTaxes}
        />
    );

    const renderEstimatedTotal = ({ estimatedTotalFontSize, showXItems }) => (
        <EstimatedTotal
            grossSubTotal={grossSubTotal}
            totalItems={totalItems}
            subtotal={subtotal}
            locales={locales}
            hasPickupSubstituteItems={hasPickupSubstituteItems}
            hasSameDaySubstituteItems={hasSameDaySubstituteItems}
            estimatedTotalFontSize={estimatedTotalFontSize}
            showXItems={showXItems}
            isBopis={isBopis}
            storeCardAmount={storeCardAmount}
            creditCardAmount={creditCardAmount}
        />
    );

    const renderPlaceOrderStickyFooter = () => {
        const canCheckoutPaze = Storage.local.getItem(LOCAL_STORAGE.CAN_CHECKOUT_PAZE);

        return (
            <Media lessThan='md'>
                <Flex
                    flexDirection='column'
                    gap={2}
                    position='fixed'
                    right={0}
                    bottom={0}
                    left={0}
                    backgroundColor={colors.white}
                    zIndex={'var(--layer-flyout)'}
                    padding={4}
                    paddingTop={2}
                    borderBottom={`1px solid ${colors.lightGray}`}
                    boxShadow='light'
                    role='complementary'
                    aria-label={`${locales.orderCostSummaryText} ${locales.mobilePlaceOrderSection}`}
                >
                    {renderEstimatedTotal({ estimatedTotalFontSize: fontSizes.base, showXItems: true })}
                    <PlaceOrderButton
                        isBopis={isBopis}
                        children={placeOrderLabel}
                        isSDUItemInBasket={isSDUItemInBasket}
                        canCheckoutPaze={canCheckoutPaze}
                    />
                    {(hasSameDaySubstituteItems || hasPickupSubstituteItems) && (
                        <Text
                            is='p'
                            color={colors.gray}
                            fontSize='xs'
                            role='note'
                            aria-label={`${locales.sameDayDeliveryAuthorizationNotice}`}
                        >
                            {locales.sddSubstituteDisclaimer} <Text fontWeight='bold'>{locales.temporarilyAuthorized}</Text>
                            {` ${locales.forText} `}
                            <Text fontWeight='bold'>{`${subtotal}.`}</Text>{' '}
                            <Link
                                href='/beauty/terms-of-use'
                                color={colors.blue}
                                aria-label={`${locales.seeFullTerms} - ${locales.openNewWindowText}`}
                            >
                                {locales.seeFullTerms}
                            </Link>
                        </Text>
                    )}
                </Flex>
            </Media>
        );
    };

    return (
        <section
            aria-label={`${locales.orderTotalAndPlaceOrderSection}`}
            role='region'
        >
            {renderPlaceOrderStickyFooter()}
            <Flex
                flexDirection='column'
                gap={[2, 3]}
            >
                {renderEstimatedTotal({ estimatedTotalFontSize: fontSizes.md, showXItems: false })}
                <BuyNowPayLater
                    isAfterpayCheckoutEnabled={isAfterpayCheckoutEnabled}
                    isAfterpayEnabledForProfile={isAfterpayEnabledForProfile}
                    isKlarnaCheckoutEnabled={isKlarnaCheckoutEnabled}
                    isPayPalPayLaterEligible={isPayPalPayLaterEligible}
                    firstBuyDiscountTotal={firstBuyDiscountTotal}
                    subtotal={subtotal}
                    isSDUItemInBasket={isSDUItemInBasket}
                    replenishmentDiscountAmount={replenishmentDiscountAmount}
                />
                {showShippingAndTaxes ||
                    (showSDUMessage && (
                        <Flex flexDirection='column'>
                            <SDUMessaging locales={locales} />
                            {showShippingAndTaxes && renderShippingTaxesText}
                        </Flex>
                    ))}
            </Flex>
        </section>
    );
}

export default wrapFunctionalComponent(EstimatedTotalSection, 'EstimatedTotalSection');
