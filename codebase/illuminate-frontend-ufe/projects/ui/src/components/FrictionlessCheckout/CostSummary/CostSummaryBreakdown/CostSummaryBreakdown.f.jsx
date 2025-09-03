import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors } from 'style/config';
import {
    Flex, Grid, Text, Link
} from 'components/ui';
import InfoButton from 'components/InfoButton';
import basketUtils from 'utils/Basket';
import localeUtils from 'utils/LanguageLocale';
import isFunction from 'utils/functions/isFunction';
import checkoutUtils from 'utils/Checkout';
import { globalModals, renderModal } from 'utils/globalModals';
import BCC from 'utils/BCC';
import RetailDeliveryFeeItem from 'components/FrictionlessCheckout/CostSummary/RetailDeliveryFeeItem';

const { SHIPPING_AND_HANDLING_INFO, BOPIS_BAG_FEE_INFO, BOPIS_SALES_TAX_INFO, SALES_TAX_INFO } = globalModals;

function openMediaModal(showMediaModal) {
    let shippingMediaId;
    const { US_SHIPPING_INFO, CA_SHIPPING_INFO } = BCC.MEDIA_IDS;

    if (localeUtils.isCanada()) {
        shippingMediaId = CA_SHIPPING_INFO;
    } else {
        shippingMediaId = US_SHIPPING_INFO;
    }

    showMediaModal({
        isOpen: true,
        mediaId: shippingMediaId,
        title: this.props.shippingHandlingInfo,
        titleDataAt: 'shippingHandlingModalTitle'
    });
}

function showOrderTotalSectionInfoModal(modalMediaId, modalTitle, showGotItButton, showMediaModal) {
    const modalData = {
        isOpen: true,
        mediaId: modalMediaId,
        title: this.props.getText(modalTitle)
    };

    if (showGotItButton) {
        modalData.dismissButtonText = this.props.goIt;
    }

    showMediaModal(modalData);
}

function showShippingInfoModal(modals, showMediaModal) {
    renderModal(modals[SHIPPING_AND_HANDLING_INFO], () => openMediaModal(showMediaModal));
}

function showBagFeeInfoModal(modals, isBopis, showMediaModal) {
    renderModal(modals[BOPIS_BAG_FEE_INFO], () => {
        showOrderTotalSectionInfoModal(BCC.MEDIA_IDS.BOPIS_BAG_FEE, 'bagFee', isBopis, showMediaModal);
    });
}

function showTaxInfoModal(modals, isBopis, showMediaModal) {
    renderModal(modals[isBopis ? BOPIS_SALES_TAX_INFO : SALES_TAX_INFO], () => {
        showOrderTotalSectionInfoModal(isBopis ? BCC.MEDIA_IDS.BOPIS_TAX_INFO : BCC.MEDIA_IDS.TAX_INFO, 'salesTax', isBopis, showMediaModal);
    });
}

function Subtotal({ locales, rawSubTotal }) {
    return (
        <Grid
            gap={2}
            columns='1fr auto'
            role='row'
            aria-label={`${locales.merchandiseSubtotalText}: ${rawSubTotal || ''}`}
        >
            <span
                children={locales.merchandiseSubtotalText}
                data-at={Sephora.debug.dataAt('merch_subtotal_label')}
                role='cell'
            />
            <span
                data-at={Sephora.debug.dataAt('bsk_total_merch')}
                role='cell'
            >
                {rawSubTotal || ''}
            </span>
        </Grid>
    );
}

function RedeemedPoints({ locales, redeemedBiPoints }) {
    if (redeemedBiPoints == null || redeemedBiPoints === 0) {
        return null;
    }

    return (
        <Grid
            gap={2}
            columns='1fr auto'
            role='row'
            aria-label={`${locales.pointsUsed}: ${redeemedBiPoints}`}
        >
            <span
                children={locales.pointsUsed}
                role='cell'
            />
            <Text
                data-at={Sephora.debug.dataAt('bsk_points_used')}
                key='pointsUsed'
                role='cell'
            >
                {redeemedBiPoints}
            </Text>
        </Grid>
    );
}

function Discount({ text, discountAmount, summaryDataAtLabel, summaryDataAtAmount }) {
    if (!(discountAmount && Number(basketUtils.removeCurrency(discountAmount)))) {
        return null;
    }

    return (
        <Grid
            gap={2}
            columns='1fr auto'
            role='row'
            aria-label={`${text}: -${discountAmount}`}
        >
            <span
                data-at={Sephora.debug.dataAt(summaryDataAtLabel)}
                role='cell'
                children={text}
            />
            <Text
                data-at={Sephora.debug.dataAt(summaryDataAtAmount)}
                key='discountAmount'
                color={colors.red}
                role='cell'
            >
                -{discountAmount}
            </Text>
        </Grid>
    );
}

function PickupFree({ locales: { pickup, free } }) {
    return (
        <Grid
            gap={2}
            columns='1fr auto'
            role='row'
            aria-label={`${pickup}: ${free}`}
        >
            <span
                data-at={Sephora.debug.dataAt('discounts_label')}
                children={pickup}
                role='cell'
            />
            <Text
                data-at={Sephora.debug.dataAt('bsk_total_discount')}
                color={colors.red}
                role='cell'
            >
                {free}
            </Text>
        </Grid>
    );
}

function BagFeeSubTotal({ locales: { bagFee, information }, bagFeeSubTotal, infoModalCallback }) {
    return (
        <Grid
            gap={2}
            columns='1fr auto'
            role='row'
            aria-label={`${bagFee}: ${bagFeeSubTotal}`}
        >
            <Link
                data-at={Sephora.debug.dataAt('bag_fee_link')}
                padding={1}
                margin={-1}
                onClick={isFunction(infoModalCallback) ? infoModalCallback : undefined}
                role='cell'
                aria-label={`${bagFee} ${information}`}
            >
                {bagFee}
                {isFunction(infoModalCallback) && (
                    <InfoButton
                        isOutline
                        marginLeft={-1}
                        aria-label={`${bagFee} ${information}`}
                    />
                )}
            </Link>
            <Text
                data-at={Sephora.debug.dataAt('bsk_total_bag_fee')}
                role='cell'
            >
                {bagFeeSubTotal}
            </Text>
        </Grid>
    );
}

function ShippingHandling({ locales: { free, tbdText, shippingAndHandlingText, information }, infoModalCallback, isBopis, priceInfo }) {
    const shippingCost = isBopis ? free : priceInfo?.totalShipping || priceInfo?.merchandiseShipping || tbdText;
    const isFreeShipping = shippingCost?.toLowerCase() === free.toLowerCase();

    return (
        <Grid
            gap={2}
            columns='1fr auto'
            role='row'
            aria-label={`${shippingAndHandlingText}: ${shippingCost}`}
        >
            <Link
                padding={1}
                margin={-1}
                data-at={Sephora.debug.dataAt('shippingHandlingLink')}
                onClick={isFunction(infoModalCallback) ? infoModalCallback : undefined}
                role='cell'
                aria-label={`${shippingAndHandlingText} ${information}`}
            >
                {shippingAndHandlingText}
                {isFunction(infoModalCallback) && (
                    <InfoButton
                        isOutline
                        marginLeft={-1}
                        aria-label={`${shippingAndHandlingText} ${information}`}
                    />
                )}
            </Link>
            <Text
                data-at={Sephora.debug.dataAt('bsk_total_ship')}
                color={isFreeShipping ? colors.red : undefined}
                role='cell'
            >
                {shippingCost}
            </Text>
        </Grid>
    );
}

function AutoreplenishDiscount({ locales: { autoReplenishSavings }, replenishmentDiscountAmount, isAutoReplenishmentEnabled }) {
    if (!isAutoReplenishmentEnabled || replenishmentDiscountAmount == null) {
        return null;
    }

    return (
        <Grid
            gap={2}
            columns='1fr auto'
            role='row'
            aria-label={`${autoReplenishSavings}: -${replenishmentDiscountAmount}`}
        >
            <span
                children={autoReplenishSavings}
                data-at={Sephora.debug.dataAt('bsk_total_replenish_label')}
                role='cell'
                aria-label={autoReplenishSavings}
            />
            <Text
                key={'replenishmentDiscountAmount'}
                color={colors.red}
                data-at={Sephora.debug.dataAt('bsk_total_replenish')}
                role='cell'
                aria-label={`${autoReplenishSavings}: -${replenishmentDiscountAmount}`}
            >
                {`-${replenishmentDiscountAmount}`}
            </Text>
        </Grid>
    );
}

function renderGstHst(priceInfo) {
    const goodsAndServicesTax = Number(basketUtils.removeCurrency(priceInfo?.goodsAndServicesTax));
    const harmonizedSalesTax = Number(basketUtils.removeCurrency(priceInfo?.harmonizedSalesTax));
    const canadaSalesTax = Number(goodsAndServicesTax + harmonizedSalesTax);
    const canadaSalesTaxFormatted = localeUtils.getFormattedPrice(canadaSalesTax, false, true);

    return canadaSalesTaxFormatted;
}

function Tax({
    locales: {
        tbdText, gstHstText, taxText, otherFees, moreInfo
    }, showZeroDollarsTax, infoModalCallback, priceInfo, isBopis
}) {
    const tbdValue = tbdText;
    const isShipAddressComplete = checkoutUtils.isShipAddressComplete();

    let taxValue =
        (!priceInfo.giftCardSubtotal && priceInfo.merchandiseSubtotal !== priceInfo.orderTotal) ||
        priceInfo.giftCardShipping ||
        (isShipAddressComplete && priceInfo.tax)
            ? priceInfo.tax || priceInfo.stateTax || tbdValue
            : tbdValue;

    if (showZeroDollarsTax) {
        taxValue = localeUtils.isFrench() ? '0,00 $' : '$0.00';
    }

    return (
        <Grid
            gap={2}
            columns='1fr auto'
            aria-label={taxText}
        >
            <span>
                {localeUtils.isCanada() ? (
                    gstHstText
                ) : (
                    <Link
                        padding={1}
                        margin={-1}
                        data-at={Sephora.debug.dataAt('tax_btn')}
                        onClick={isFunction(infoModalCallback) ? infoModalCallback : undefined}
                        aria-label={taxText}
                    >
                        {taxText} {isBopis && otherFees}
                        {isFunction(infoModalCallback) && (
                            <InfoButton
                                aria-label={`${taxText}: ${moreInfo}`}
                                isOutline
                                marginLeft={-1}
                            />
                        )}
                    </Link>
                )}
            </span>
            <Text data-at={Sephora.debug.dataAt('bsk_total_tax')}>{localeUtils.isCanada() ? renderGstHst(priceInfo) : taxValue}</Text>
        </Grid>
    );
}

function ProvincialSalesTax({ priceInfo, locales: { pst } }) {
    return (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <span>{pst}</span>
            <Text data-at={Sephora.debug.dataAt('bsk_total_tax')}>{priceInfo.provincialSalesTax}</Text>
        </Grid>
    );
}

function SummaryLine({
    summaryName, amount, summaryDataAtLabel, summaryDataAtAmount, minusSign = false, hasRedText
}) {
    return (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <span data-at={Sephora.debug.dataAt(summaryDataAtLabel)}>{summaryName}</span>
            <Text
                data-at={Sephora.debug.dataAt(summaryDataAtAmount)}
                color={hasRedText ? colors.red : ''}
            >
                {minusSign ? '-' + amount : amount}
            </Text>
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
    priceInfo,
    locales,
    globalModals: modals,
    isBopis,
    showMediaModal,
    isZeroCheckout
}) {
    const shouldRenderExtraSummaryItems = checkoutUtils.isMoreThanJustCC(priceInfo) && !isZeroCheckout;

    return (
        <Flex
            lineHeight='tight'
            marginBottom={shouldRenderExtraSummaryItems ? 2 : 4}
            flexDirection={'column'}
            gap={2}
        >
            {!isZeroCheckout && (
                <Subtotal
                    locales={locales}
                    rawSubTotal={rawSubTotal}
                />
            )}
            <RedeemedPoints
                locales={locales}
                redeemedBiPoints={redeemedBiPoints}
            />
            <Discount
                text={locales.discountsText}
                discountAmount={discountAmount}
                summaryDataAtLabel={'discounts_label'}
                summaryDataAtAmount={'bsk_total_discount'}
            />
            {priceInfo?.giftCardAmount && (
                <Discount
                    text={locales.giftCardRedeemed}
                    discountAmount={priceInfo.giftCardAmount}
                    summaryDataAtLabel={'total_gc_amt_label'}
                    summaryDataAtAmount={'total_gc_amt'}
                />
            )}
            <AutoreplenishDiscount
                locales={locales}
                replenishmentDiscountAmount={replenishmentDiscountAmount}
                isAutoReplenishmentEnabled={Sephora.configurationSettings.isAutoReplenishmentEnabled}
            />
            {showPickupFree && <PickupFree locales={locales} />}
            {showBagFeeSubTotal && bagFeeSubTotal && (
                <BagFeeSubTotal
                    locales={locales}
                    bagFeeSubTotal={bagFeeSubTotal}
                    infoModalCallback={() => showBagFeeInfoModal(modals, isBopis, showMediaModal)}
                />
            )}
            {showShippingAndHandling && (
                <ShippingHandling
                    locales={locales}
                    isBIUser={isBIUser}
                    isSignedIn={isSignedIn}
                    isBopis={isBopis}
                    isSDDBasketAvailable={isSDDBasketAvailable}
                    hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
                    infoModalCallback={() => showShippingInfoModal(modals, showMediaModal)}
                    priceInfo={priceInfo}
                />
            )}
            <RetailDeliveryFeeItem
                priceInfo={priceInfo}
                isCheckout
            />
            {shouldRenderExtraSummaryItems && (
                <Flex
                    lineHeight='tight'
                    flexDirection='column'
                    gap={2}
                >
                    {priceInfo?.storeCardAmount && (
                        <SummaryLine
                            summaryName={locales.storeCreditRedeemed}
                            amount={priceInfo.storeCardAmount}
                            summaryDataAtLabel={'total_credit_amt_label'}
                            summaryDataAtAmount={'total_credit_amt'}
                            minusSign={true}
                            hasRedText={true}
                        />
                    )}
                    {priceInfo?.eGiftCardAmount && (
                        <SummaryLine
                            summaryName={locales.eGiftCardRedeemed}
                            amount={priceInfo.eGiftCardAmount}
                            summaryDataAtLabel={'total_egc_amt_label'}
                            summaryDataAtAmount={'total_egc_amt'}
                            minusSign={true}
                        />
                    )}
                    {priceInfo?.creditCardAmount && (
                        <SummaryLine
                            summaryName={locales.creditCardPayment}
                            amount={priceInfo.creditCardAmount}
                            summaryDataAtLabel={'total_cc_amt_label'}
                            summaryDataAtAmount={'total_cc_amt'}
                        />
                    )}
                    {priceInfo?.paypalAmount && (
                        <SummaryLine
                            summaryName={locales.payPalPayment}
                            amount={priceInfo.paypalAmount}
                            summaryDataAtLabel={'total_paypal_amt_label'}
                            summaryDataAtAmount={'total_paypal_amt'}
                        />
                    )}
                </Flex>
            )}

            {priceInfo?.provincialSalesTax && (
                <ProvincialSalesTax
                    locales={locales}
                    priceInfo={priceInfo}
                />
            )}

            <Tax
                locales={locales}
                showZeroDollarsTax={showZeroDollarsTax}
                infoModalCallback={() => showTaxInfoModal(modals, isBopis, showMediaModal)}
                priceInfo={priceInfo}
                isBopis={isBopis}
            />
        </Flex>
    );
}

export default wrapFunctionalComponent(CostSummaryBreakdown, 'CostSummaryBreakdown');
