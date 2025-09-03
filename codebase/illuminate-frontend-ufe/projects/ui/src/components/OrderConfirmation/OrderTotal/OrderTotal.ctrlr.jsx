import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Grid, Divider, Link
} from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import InfoButton from 'components/InfoButton/InfoButton';
import { space } from 'style/config';
import checkoutUtils from 'utils/Checkout';
import orderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import RetailDeliveryFeeItem from 'components/SharedComponents/RetailDeliveryFeeItem';
import BCC from 'utils/BCC';
import store from 'store/Store';
import Actions from 'Actions';

import * as productListItemConstants from 'components/Product/ProductListItem/constants';
import * as orderConfirmationConstants from 'components/OrderConfirmation/constants';
import { globalModals, renderModal } from 'utils/globalModals';

const { SHIPPING_AND_HANDLING_INFO } = globalModals;
const { ZERO_CHECKOUT_OPTIONS } = orderUtils;

class OrderTotal extends BaseClass {
    openMediaModal = (modalTitle = '') => {
        const shippingMediaId = localeUtils.isCanada() ? BCC.MEDIA_IDS.CA_SHIPPING_INFO : BCC.MEDIA_IDS.US_SHIPPING_INFO;
        store.dispatch(
            Actions.showMediaModal({
                isOpen: true,
                mediaId: shippingMediaId,
                title: modalTitle,
                titleDataAt: 'shippingHandlingModalTitle'
            })
        );
    };

    constructor(props) {
        super(props);
        this.state = {
            subtotal: this.props.priceInfo ? this.props.priceInfo.merchandiseSubtotal : null
        };
    }

    componentDidMount() {
        if (this.props.priceInfo) {
            orderUtils.calculateMerchandiseSubtotal(this.props.priceInfo).then(subtotal => {
                this.setState({ subtotal });
            });
        }
    }

    componentDidUpdate() {
        if (this.props.priceInfo) {
            orderUtils.calculateMerchandiseSubtotal(this.props.priceInfo).then(subtotal => {
                if (this.state.subtotal !== subtotal) {
                    this.setState({ subtotal });
                }
            });
        }
    }

    handleShippingAndHandlingClick = getText => () => {
        renderModal(this.props.globalModals[SHIPPING_AND_HANDLING_INFO], () => {
            this.openMediaModal(getText('shippingAndHandlingInfo'));
        });
    };

    /* eslint-disable-next-line complexity */
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/OrderConfirmation/OrderTotal/locales', 'OrderTotal');

        const {
            biInfo,
            isOrderDetail,
            orderLocale,
            priceInfo,
            ssdOrder = false,
            useEstimatedLabelForOrderTotal = false,
            isSDUOnly = false,
            isSDUOrderOnly = false,
            showSDUBISection = false,
            isSelfServiceNCR = false,
            orderPriceInfo = {},
            redeemedPoints,
            isSDDOrderProcessing,
            splitEDDExperienceDisplayed
        } = this.props;

        if (!priceInfo) {
            return null;
        }

        const at = isOrderDetail ? 'orderdetail' : 'confirmation';

        const { itemWidths } = isOrderDetail ? productListItemConstants : orderConfirmationConstants;

        const wrapStyles = {
            width: [
                null,
                null,
                (isOrderDetail ? parseInt(itemWidths.DESC) : 0) +
                    parseInt(itemWidths.PRICE) +
                    parseInt(itemWidths.QTY) +
                    parseInt(itemWidths.AMOUNT) +
                    '%'
            ],
            marginTop: splitEDDExperienceDisplayed ? [4, 7] : 0,
            paddingLeft: [null, null, isOrderDetail ? 6 : 4],
            marginLeft: !isOrderDetail ? [null, null, 'auto'] : null
        };

        let taxAmount = priceInfo.tax || priceInfo.stateTax;

        if (!taxAmount && localeUtils.isUS()) {
            taxAmount = ZERO_CHECKOUT_OPTIONS.US;
        }

        const {
            goodsAndServicesTax, harmonizedSalesTax, provincialSalesTax, maxAmountToBeAuthorized, orderTotal, shipmentTotal
        } = priceInfo;

        const showIncreasedAuthorizationWarning = isOrderDetail
            ? orderUtils.hasSubstitutions() && isSDDOrderProcessing && !!maxAmountToBeAuthorized
            : orderUtils.hasSubstitutions() && !!maxAmountToBeAuthorized;

        const taxLabel = isOrderDetail ? 'tax' : 'estimatedTax';
        const pstLabel = isOrderDetail ? 'pst' : 'estimatedPst';
        const gstOrHstLabel = isOrderDetail ? 'gstOrHst' : 'estimatedGstOrHst';
        const isMobile = Sephora.isMobile();
        const showDividerForSDU = isMobile && (isSDUOnly || isSDUOrderOnly);
        const showStar = showIncreasedAuthorizationWarning ? '*' : '';

        return !isSelfServiceNCR && (orderTotal || shipmentTotal) ? (
            <Box
                data-at={Sephora.debug.dataAt(this.props.dataAt)}
                lineHeight={isOrderDetail ? [null, null, 'base'] : 'tight'}
            >
                <Box {...wrapStyles}>
                    {this.getOrderLine(
                        this.state.subtotal || this.props.priceInfo,
                        'merchandiseSubtotal',
                        `${at}_label_merch_subtotal`,
                        `${at}_merch_subtotal`
                    )}
                    {this.getOrderLine(
                        priceInfo.replenishmentPromotionDiscount,
                        'autoReplenishSavings',
                        `${at}_label_auto_replenish_savings`,
                        `${at}_auto_replenish_savings`
                    )}
                    {biInfo &&
                        this.getOrderLine(
                            biInfo.redeemedPoints,
                            'pointsUsedInThisOrder',
                            `${at}_label_points_used_in_order_total`,
                            'points_used_in_order_total',
                            false
                        )}
                    {redeemedPoints > 0 &&
                        this.getOrderLine(
                            redeemedPoints,
                            'pointsUsedInThisOrder',
                            `${at}_label_points_used_in_order_total`,
                            'points_used_in_order_total'
                        )}
                    {isSDUOnly ||
                        isSDUOrderOnly ||
                        this.getOrderLine(
                            checkoutUtils.setShippingFee(priceInfo.totalShipping),
                            'shippingAndHandling',
                            `${at}_label_shipping`,
                            `${at}_shipping`
                        )}
                    <RetailDeliveryFeeItem
                        priceInfo={priceInfo}
                        orderPriceInfo={orderPriceInfo}
                        isOrderConfirmation
                    />
                    {this.getOrderLine(priceInfo.promotionDiscount, 'discounts', `${at}_label_discounts`, `${at}_discounts`, true)}

                    {
                        orderLocale === 'CA' ? (
                            <React.Fragment>
                                {!orderUtils.isZeroPrice(goodsAndServicesTax) &&
                                    this.getOrderLine(goodsAndServicesTax, gstOrHstLabel, `${at}_label_gst`, `${at}_gst`)}
                                {(!orderUtils.isZeroPrice(harmonizedSalesTax) || isSDUOnly || isSDUOrderOnly) &&
                                    this.getOrderLine(harmonizedSalesTax, gstOrHstLabel, `${at}_label_hst`, `${at}_hst`)}
                                {(!orderUtils.isZeroPrice(provincialSalesTax) || isSDUOnly || isSDUOrderOnly) &&
                                    this.getOrderLine(provincialSalesTax, pstLabel, `${at}_label_pst`, `${at}_pst`)}
                            </React.Fragment>
                        ) : (
                            this.getOrderLine(taxAmount, taxLabel, `${at}_label_tax`, `${at}_tax`)
                        ) // non-canada case
                    }

                    {checkoutUtils.isMoreThanJustCC(priceInfo) && (
                        <React.Fragment>
                            {!orderUtils.isZeroPrice(priceInfo.storeCardAmount) &&
                                this.getOrderLine(
                                    priceInfo.storeCardAmount,
                                    'storeCreditRedeemed',
                                    `${at}_label_store_credit`,
                                    `${at}_store_credit`,
                                    true
                                )}
                            {this.getOrderLine(priceInfo.giftCardAmount, 'giftCardRedeemed', `${at}_label_gc_redeemed`, `${at}_gc_reedeemed`, true)}
                            {this.getOrderLine(priceInfo.eGiftCardAmount, 'eGiftCardRedeemed', '', '', true)}
                            {!orderUtils.isZeroPrice(priceInfo.creditCardAmount) &&
                                this.getOrderLine(priceInfo.creditCardAmount, 'creditCardPayment', `${at}_label_cc_payment`, `${at}_cc_payment`)}
                            {this.getOrderLine(priceInfo.paypalAmount, 'payPalPayment')}
                        </React.Fragment>
                    )}
                </Box>
                {!showDividerForSDU && <Divider css={ssdOrder ? styles.ssdDivider : styles.divider} />}
                {showDividerForSDU && <Divider css={styles.divider} />}
                <Box {...wrapStyles}>
                    <Grid
                        columns='1fr auto'
                        gap={2}
                        fontWeight='bold'
                        fontSize='md'
                        marginY={4}
                    >
                        <span
                            data-at={Sephora.debug.dataAt(`${at}_label_order_total`)}
                            children={getText(
                                useEstimatedLabelForOrderTotal || (shipmentTotal && !isOrderDetail) ? 'estimatedOrderTotal' : 'orderTotal'
                            )}
                        />
                        <span data-at={Sephora.debug.dataAt(`${at}_order_total`)}>
                            {shipmentTotal ? shipmentTotal : orderTotal}
                            {showStar}
                        </span>
                    </Grid>
                    {showIncreasedAuthorizationWarning && (
                        <Markdown
                            color='gray'
                            content={getText('sddIncreasedAuthorizationWarning', [maxAmountToBeAuthorized])}
                            fontSize='sm'
                            aria-label={getText('sddIncreasedAuthorizationWarning')}
                            tabIndex='0'
                        />
                    )}
                </Box>
                {showSDUBISection && (
                    <Box {...wrapStyles}>
                        <Grid
                            columns='1fr auto'
                            gap={2}
                            paddingY={2}
                            paddingX={4}
                            borderRadius={1}
                            backgroundColor='nearWhite'
                        >
                            <span
                                data-at={Sephora.debug.dataAt(`${at}_sdu_bi_points`)}
                                children={getText('sduBIPointsText')}
                            />
                        </Grid>
                    </Box>
                )}
                {isOrderDetail || ssdOrder || (
                    <React.Fragment>
                        <Divider css={styles.divider} />
                        <Box {...wrapStyles}>
                            {getText('viewOrCancel')}{' '}
                            <Link
                                href={this.props.orderDetailsLink}
                                data-at={Sephora.debug.dataAt('view_details')}
                                color='blue'
                                underline={true}
                                padding={2}
                                margin={-2}
                                children={getText('orderDetails')}
                            />
                            .
                        </Box>
                    </React.Fragment>
                )}
            </Box>
        ) : isSelfServiceNCR ? (
            <>
                <Box {...wrapStyles}>
                    {this.getOrderLine(
                        orderPriceInfo.orderSubTotalWithTax,
                        'orderSubTotalWithTax',
                        `${at}_label_merch_subtotal_with_tax`,
                        `${at}_merch_subtotal_with_tax`
                    )}
                    {this.getOrderLine(
                        orderPriceInfo.shippingHandlingFee,
                        <Link
                            padding={1}
                            margin={-1}
                            data-at={Sephora.debug.dataAt(`${at}_label_shipping`)}
                            onClick={this.handleShippingAndHandlingClick(getText)}
                        >
                            {getText('shippingAndHandling')}
                            <InfoButton marginLeft={-1} />
                        </Link>,
                        '',
                        `${at}_shipping`
                    )}

                    {this.getOrderLine(
                        orderPriceInfo.oneTimeReplacementFee,
                        'oneTimeReplacementFee',
                        `${at}_label_merch_onetime_replacement_fee`,
                        `${at}_merch_onetime_replacement_fee`,
                        true
                    )}
                </Box>
                <Divider
                    height={2}
                    color='black'
                    marginY={1}
                />
                <Box {...wrapStyles}>
                    <Grid
                        columns='1fr auto'
                        gap={2}
                        fontWeight='bold'
                        fontSize='md'
                        marginY={2}
                    >
                        <span
                            data-at={Sephora.debug.dataAt(`${at}_label_order_total`)}
                            children={getText('orderTotal')}
                        />
                        <span data-at={Sephora.debug.dataAt(`${at}_order_total`)}>{orderPriceInfo.orderTotal}</span>
                    </Grid>
                </Box>
            </>
        ) : null;
    }

    getOrderLine = (value, label, labelDataAt = '', valueDataAtText = '', minusSign = false) => {
        const getText = localeUtils.getLocaleResourceFile('components/OrderConfirmation/OrderTotal/locales', 'OrderTotal');
        const labelChildren = typeof label === 'string' ? getText(label) : label;

        if (labelDataAt.endsWith('_label_discounts') && orderUtils.isZeroPrice(value)) {
            return null;
        }

        return (
            <Grid
                columns='1fr auto'
                gap={2}
                marginY={2}
                style={!value ? { display: 'none' } : null}
            >
                <span
                    data-at={Sephora.debug.dataAt(labelDataAt)}
                    children={labelChildren}
                />
                <strong
                    data-at={Sephora.debug.dataAt(valueDataAtText)}
                    children={minusSign ? '-' + value : value}
                />
            </Grid>
        );
    };
}

OrderTotal.defaultProps = {
    redeemedPoints: 0
};

OrderTotal.propTypes = {
    redeemedPoints: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

const styles = {
    divider: { margin: `${space[4]}px 0` },
    ssdDivider: { margin: `${space[4]}px 0 ${space[4]}px 59.5%` }
};

export default wrapComponent(OrderTotal, 'OrderTotal');
