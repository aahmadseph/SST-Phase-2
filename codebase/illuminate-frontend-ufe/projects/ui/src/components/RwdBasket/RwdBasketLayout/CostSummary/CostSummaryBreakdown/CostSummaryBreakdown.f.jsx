import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Flex, Grid, Text, Link
} from 'components/ui';
import InfoButton from 'components/InfoButton';

import { colors } from 'style/config';

import basketUtils from 'utils/Basket';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import isFunction from 'utils/functions/isFunction';

function Subtotal({ getText, rawSubTotal }) {
    return (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <span
                children={getText('merchandiseSubtotalText')}
                data-at={Sephora.debug.dataAt('merch_subtotal_label')}
            />
            <span data-at={Sephora.debug.dataAt('bsk_total_merch')}>{rawSubTotal || ''}</span>
        </Grid>
    );
}

function RedeemedPoints({ getText, redeemedBiPoints }) {
    if (redeemedBiPoints == null || redeemedBiPoints === 0) {
        return null;
    }

    return (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <span children={getText('pointsUsed')} />
            <Text
                data-at={Sephora.debug.dataAt('bsk_points_used')}
                key='pointsUsed'
            >
                {redeemedBiPoints}
            </Text>
        </Grid>
    );
}

function Discount({ getText, discountAmount }) {
    if (!(discountAmount && Number(basketUtils.removeCurrency(discountAmount)))) {
        return null;
    }

    return (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <span
                data-at={Sephora.debug.dataAt('discounts_label')}
                children={getText('discountsText')}
            />
            <Text
                data-at={Sephora.debug.dataAt('bsk_total_discount')}
                color={colors.red}
            >
                -{discountAmount}
            </Text>
        </Grid>
    );
}

function PickupFree({ getText }) {
    return (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <span
                data-at={Sephora.debug.dataAt('discounts_label')}
                children={getText('pickup')}
            />
            <Text
                data-at={Sephora.debug.dataAt('bsk_total_discount')}
                color={colors.red}
            >
                {getText('free')}
            </Text>
        </Grid>
    );
}

function BagFeeSubTotal({ getText, bagFeeSubTotal, infoModalCallback }) {
    return (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <Link
                data-at={Sephora.debug.dataAt('bag_fee_link')}
                padding={1}
                margin={-1}
                onClick={isFunction(infoModalCallback) ? infoModalCallback : undefined}
            >
                {getText('bagFee')}
                {isFunction(infoModalCallback) && (
                    <InfoButton
                        isOutline
                        marginLeft={-1}
                    />
                )}
            </Link>
            <Text data-at={Sephora.debug.dataAt('bag_fee_value')}>{bagFeeSubTotal}</Text>
        </Grid>
    );
}

function ShippingHandling({ getText, userHasFreeShipping, infoModalCallback }) {
    const shippingCost = getText(userHasFreeShipping ? 'free' : 'tbdText');

    return (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <Link
                padding={1}
                margin={-1}
                data-at={Sephora.debug.dataAt('shippingHandlingLink')}
                onClick={isFunction(infoModalCallback) ? infoModalCallback : undefined}
            >
                {getText('shippingAndHandlingText')}
                {isFunction(infoModalCallback) && (
                    <InfoButton
                        isOutline
                        marginLeft={-1}
                    />
                )}
            </Link>
            <Text
                data-at={Sephora.debug.dataAt('bsk_total_ship')}
                color={userHasFreeShipping ? colors.red : undefined}
            >
                {shippingCost}
            </Text>
        </Grid>
    );
}

function AutoreplenishDiscount({ getText, replenishmentDiscountAmount, isAutoReplenishmentEnabled }) {
    if (!isAutoReplenishmentEnabled || replenishmentDiscountAmount == null) {
        return null;
    }

    return (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <span
                children={getText('autoReplenishSavings')}
                data-at={Sephora.debug.dataAt('bsk_total_replenish_label')}
            />
            <Text
                key={'replenishmentDiscountAmount'}
                color={colors.red}
                data-at={Sephora.debug.dataAt('bsk_total_replenish')}
            >{`-${replenishmentDiscountAmount}`}</Text>
        </Grid>
    );
}

function Tax({ getText, showZeroDollarsTax, infoModalCallback }) {
    let taxValue = getText('tbdText');

    if (showZeroDollarsTax) {
        taxValue = localeUtils.isFrench() ? '0,00 $' : '$0.00';
    }

    return (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <span>
                {localeUtils.isCanada() ? (
                    getText('gstHstText')
                ) : (
                    <Link
                        padding={1}
                        margin={-1}
                        data-at={Sephora.debug.dataAt('tax_btn')}
                        onClick={isFunction(infoModalCallback) ? infoModalCallback : undefined}
                    >
                        {getText('taxText')}
                        {isFunction(infoModalCallback) && (
                            <InfoButton
                                isOutline
                                marginLeft={-1}
                            />
                        )}
                    </Link>
                )}
            </span>
            <Text data-at={Sephora.debug.dataAt('bsk_total_tax')}>{taxValue}</Text>
        </Grid>
    );
}

function CostSummaryBreakdown({
    isBIUser,
    isSignedIn,
    rawSubTotal,
    redeemedBiPoints,
    replenishmentDiscountAmount,
    discountAmount,
    isSDDBasketAvailable,
    bagFeeSubTotal,
    hasMetFreeShippingThreshhold,
    showShippingAndHandling,
    showPickupFree,
    showBagFeeSubTotal,
    showZeroDollarsTax,
    userHasFreeShipping,
    infoModalCallbacks
}) {
    const getText = resourceWrapper(
        localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/CostSummary/CostSummaryBreakdown/locales', 'CostSummaryBreakdown')
    );

    return (
        <Flex
            lineHeight='tight'
            marginBottom={4}
            flexDirection={'column'}
            gap={2}
        >
            <Subtotal
                getText={getText}
                rawSubTotal={rawSubTotal}
            />
            <RedeemedPoints
                getText={getText}
                redeemedBiPoints={redeemedBiPoints}
            />
            <Discount
                getText={getText}
                discountAmount={discountAmount}
            />
            {showPickupFree && <PickupFree getText={getText} />}
            {showBagFeeSubTotal && bagFeeSubTotal && (
                <BagFeeSubTotal
                    getText={getText}
                    bagFeeSubTotal={bagFeeSubTotal}
                    infoModalCallback={infoModalCallbacks.bagFee}
                />
            )}
            {showShippingAndHandling && (
                <ShippingHandling
                    getText={getText}
                    isBIUser={isBIUser}
                    isSignedIn={isSignedIn}
                    isSDDBasketAvailable={isSDDBasketAvailable}
                    hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
                    infoModalCallback={infoModalCallbacks.shippingAndHandling}
                    userHasFreeShipping={userHasFreeShipping}
                />
            )}
            <AutoreplenishDiscount
                getText={getText}
                replenishmentDiscountAmount={replenishmentDiscountAmount}
                isAutoReplenishmentEnabled={Sephora.configurationSettings.isAutoReplenishmentEnabled}
            />
            <Tax
                getText={getText}
                showZeroDollarsTax={showZeroDollarsTax}
                infoModalCallback={infoModalCallbacks.salesTax}
            />
        </Flex>
    );
}

export default wrapFunctionalComponent(CostSummaryBreakdown, 'CostSummaryBreakdown');
