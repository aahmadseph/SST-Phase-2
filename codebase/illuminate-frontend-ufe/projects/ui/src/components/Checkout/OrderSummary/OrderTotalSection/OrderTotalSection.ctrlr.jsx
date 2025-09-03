/* eslint-disable object-curly-newline */
/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Text, Divider, Link } from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import PlaceOrderButton from 'components/Checkout/PlaceOrderButton/PlaceOrderButton';
import CheckoutPromoSection from 'components/Checkout/OrderSummary/CheckoutPromoSection/CheckoutPromoSection';
import CheckoutLegalOptIn from 'components/Checkout/Shared/CheckoutLegalOptIn';
import InfoButton from 'components/InfoButton/InfoButton';
import basketUtils from 'utils/Basket';
import checkoutUtils from 'utils/Checkout';
import orderUtils from 'utils/Order';
import anaConsts from 'analytics/constants';
import KlarnaMarketing from 'components/Klarna/KlarnaMarketing/KlarnaMarketing';
import TestTarget from 'components/TestTarget/TestTarget';
import ErrorMsg from 'components/ErrorMsg';
import localeUtils from 'utils/LanguageLocale';
import BCC from 'utils/BCC';
import RetailDeliveryFeeItem from 'components/SharedComponents/RetailDeliveryFeeItem';
import CreditCardBanner from 'components/CreditCard/CreditCardBanner';
import SDUAgreement from 'components/Checkout/OrderSummary/OrderTotalSection/SDUAgreement';
import AgentAwareAgreement from 'components/Checkout/OrderSummary/OrderTotalSection/AgentAwareAgreement';
import agentAwareUtils from 'utils/AgentAware';
import store from 'store/Store';
import Actions from 'Actions';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { globalModals, renderModal } from 'utils/globalModals';

const { SHIPPING_AND_HANDLING_INFO, BOPIS_BAG_FEE_INFO, BOPIS_PIF_FEE_INFO, BOPIS_SALES_TAX_INFO, SALES_TAX_INFO } = globalModals;

class OrderTotalSection extends BaseClass {
    constructor(props) {
        super(props);
        const { ...initProps } = this.props || {};
        this.state = initProps;
    }

    componentDidMount() {
        store.setAndWatch('order.orderDetails.items.basketLevelMessages', this, data => {
            const { basketLevelMessages } = data;
            let warningMessages;

            if (basketLevelMessages) {
                warningMessages = basketLevelMessages.reduce((acc, current) => {
                    current.type === 'warning' &&
                        acc.push({
                            message: current.messages[0],
                            messageContext: current.messageContext
                        });

                    return acc;
                }, []);

                this.setState({ warningMessages });
            }
        });

        store.setAndWatch('order.orderDetails.items.items', this, data => {
            const SDUProduct = data.items.filter(item => item.sku.type === 'SDU')[0];
            this.setState({ isSDUProductInBasket: !!SDUProduct });
        });

        store.setAndWatch('user.userSubscriptions', this, data => {
            this.setState({ isSDUSubscriptionActive: data?.userSubscriptions?.length > 0 && data.userSubscriptions[0].status.startsWith('ACTIVE') });
        });

        store.setAndWatch('order.acceptAutoReplenishTerms', this, order =>
            this.setState({ acceptAutoReplenishTerms: order.acceptAutoReplenishTerms })
        );
        store.setAndWatch('order.acceptSDUTerms', this, order => this.setState({ acceptSDUTerms: order.acceptSDUTerms }));

        if (Sephora.isAgent) {
            store.setAndWatch('order.acceptAgentAwareTerms', this, order => this.setState({ acceptAgentAwareTerms: order.acceptAgentAwareTerms }));
        }
    }

    showOrderTotalSectionInfoModal = (modalMediaId, modalTitle, showGotItButton) => {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/OrderSummary/OrderTotalSection/locales', 'OrderTotalSection');

        const modalData = {
            isOpen: true,
            mediaId: modalMediaId,
            title: getText(modalTitle)
        };

        if (showGotItButton) {
            modalData.dismissButtonText = getText('gotIt');
        }

        store.dispatch(Actions.showMediaModal(modalData));
    };

    openInfoModal = (title, message) => {
        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: title,
                message: message
            })
        );
    };

    openMediaModal = () => {
        let shippingMediaId;
        const { US_SHIPPING_INFO, CA_SHIPPING_INFO } = BCC.MEDIA_IDS;
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/OrderSummary/OrderTotalSection/locales', 'OrderTotalSection');

        if (localeUtils.isCanada()) {
            shippingMediaId = CA_SHIPPING_INFO;
        } else {
            shippingMediaId = US_SHIPPING_INFO;
        }

        store.dispatch(
            Actions.showMediaModal({
                isOpen: true,
                mediaId: shippingMediaId,
                title: getText('shippingHandlingInfo'),
                titleDataAt: 'shippingHandlingModalTitle'
            })
        );
    };

    getOrderLine = (value, label, labelDataAt, valueDataAt, minusSign = false) => {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/OrderSummary/OrderTotalSection/locales', 'OrderTotalSection');

        if (labelDataAt === 'discounts_label' && orderUtils.isZeroPrice(value)) {
            return null;
        }

        return (
            <LegacyGrid
                gutter={2}
                marginBottom={2}
                style={!value ? { display: 'none' } : null}
            >
                <LegacyGrid.Cell
                    width='fill'
                    data-at={labelDataAt ? Sephora.debug.dataAt(labelDataAt) : null}
                    children={getText(label)}
                />
                <LegacyGrid.Cell
                    width='fit'
                    fontWeight='bold'
                    data-at={valueDataAt ? Sephora.debug.dataAt(valueDataAt) : null}
                    children={minusSign ? '-' + value : value}
                />
            </LegacyGrid>
        );
    };

    getShippingModalTitle = () => {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/OrderSummary/OrderTotalSection/locales', 'OrderTotalSection');

        return <Text data-at={Sephora.debug.dataAt('shippingHandlingModalTitle')}>{getText('shippingHandlingInfo')}</Text>;
    };

    renderGstHst(priceInfo) {
        const provincialSalesTax = Number(basketUtils.removeCurrency(priceInfo.provincialSalesTax));
        const goodsAndServicesTax = Number(basketUtils.removeCurrency(priceInfo.goodsAndServicesTax));
        const harmonizedSalesTax = Number(basketUtils.removeCurrency(priceInfo.harmonizedSalesTax));
        const canadaSalesTax = Number(goodsAndServicesTax + harmonizedSalesTax);
        const canadaSalesTaxFormatted = localeUtils.getFormattedPrice(canadaSalesTax, false, true);

        return (
            <React.Fragment>
                {this.getOrderLine(canadaSalesTaxFormatted, 'gstHst', 'total_gst_hst_label', 'total_gst_hst')}
                {provincialSalesTax ? this.getOrderLine(priceInfo.provincialSalesTax, 'pst', 'total_pst_label', 'total_pst') : null}
            </React.Fragment>
        );
    }

    renderAgentAwareCheckbox(isSDUProductInBasket, isAutoReplenishBasket) {
        if (Sephora.isAgent) {
            return (
                <AgentAwareAgreement
                    isSDUProductInBasket={isSDUProductInBasket}
                    isAutoReplenishBasket={isAutoReplenishBasket}
                    agentAwareShowClass={agentAwareUtils.applyShowAgentAwareClass()}
                />
            );
        } else {
            return null;
        }
    }

    showShippingInfoModal = () => {
        renderModal(this.props.globalModals[SHIPPING_AND_HANDLING_INFO], this.openMediaModal);
    };

    showBagFeeInfoModal = () => {
        const { isBopis } = this.props;
        renderModal(this.props.globalModals[BOPIS_BAG_FEE_INFO], () => {
            this.showOrderTotalSectionInfoModal(BCC.MEDIA_IDS.BOPIS_BAG_FEE, 'bagFee', isBopis);
        });
    };

    showPifFeeInfoModal = () => {
        const { isBopis } = this.props;
        renderModal(this.props.globalModals[BOPIS_PIF_FEE_INFO], () => {
            this.showOrderTotalSectionInfoModal(BCC.MEDIA_IDS.BOPIS_PIF_FEE, 'specialFee', isBopis);
        });
    };

    showTaxInfoModal = () => {
        const { isBopis } = this.props;
        renderModal(this.props.globalModals[isBopis ? BOPIS_SALES_TAX_INFO : SALES_TAX_INFO], () => {
            this.showOrderTotalSectionInfoModal(isBopis ? BCC.MEDIA_IDS.BOPIS_TAX_INFO : BCC.MEDIA_IDS.TAX_INFO, 'salesTax', isBopis);
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/OrderSummary/OrderTotalSection/locales', 'OrderTotalSection');
        const {
            priceInfo,
            isBopis,
            items,
            isConfirmation,
            isAutoReplenishBasket,
            isSDUOrderOnly,
            youSave,
            withSDUUnlimited,
            sduSavings,
            isSDUOnlyInSddBasket,
            paymentGroups
        } = this.props;
        const {
            isCanada,
            merchandiseTotal,
            warningMessages,
            acceptAutoReplenishTerms,
            acceptSDUTerms,
            acceptAgentAwareTerms,
            isSDUProductInBasket,
            isSDUSubscriptionActive
        } = this.state;

        const isDesktop = Sephora.isDesktop();
        const isMobile = Sephora.isMobile();
        const isZeroCheckout = orderUtils.isZeroCheckout();
        const isShipAddressComplete = checkoutUtils.isShipAddressComplete();
        const shouldShowPromotion = orderUtils.shouldShowPromotion();
        const showPointsReedeemed = Boolean(items && items.redeemedBiPoints && items.redeemedBiPoints > 0);

        if (!priceInfo || !priceInfo.orderTotal) {
            return null;
        }

        const tbdValue = basketUtils.getCurrency(priceInfo.orderTotal) + '-.--';
        const shippingCost = isBopis ? getText('free') : priceInfo.totalShipping || priceInfo.merchandiseShipping || tbdValue;

        const { afterpayEnabled: isAfterpayPaymentEnabled, isKlarnaPaymentEnabled } = Sephora.configurationSettings;
        const isAfterpayEnabled = isAfterpayPaymentEnabled && items.isAfterpayCheckoutEnabled && items.isAfterpayEnabledForProfile;
        const isKlarnaEnabled = isKlarnaPaymentEnabled && items.isKlarnaCheckoutEnabled;
        const isPayPalPayLaterEligibleEnabled = Sephora.configurationSettings.isPayPalEnabled && items.isPayPalPayLaterEligible;
        const hasBagFee = priceInfo && priceInfo.bagFeeSubtotal;
        const orderTotalWithoutBagFee =
            hasBagFee && isBopis
                ? parseFloat(basketUtils.removeCurrency(priceInfo?.orderTotal)) - parseFloat(basketUtils.removeCurrency(priceInfo?.bagFeeSubtotal))
                : 0;
        const orderTotal =
            hasBagFee && orderTotalWithoutBagFee === 0
                ? basketUtils.getCurrency(priceInfo?.orderTotal) + parseFloat(orderTotalWithoutBagFee).toFixed(2)
                : priceInfo?.orderTotal;
        const { isAutoReplenishmentEnabled } = Sephora.configurationSettings;
        const replenishmentPromotionDiscount =
            isAutoReplenishmentEnabled &&
            priceInfo.replenishmentPromotionDiscount &&
            !orderUtils.isZeroPrice(priceInfo.replenishmentPromotionDiscount) &&
            priceInfo.replenishmentPromotionDiscount;

        const hasWarningMessage = warningMessages && warningMessages?.length > 0;
        const hasRrcWarning = hasWarningMessage && warningMessages[0].messageContext === 'basket.rrcRemainingBalance';
        const basketType = isBopis ? 'bopis' : 'sdd';

        const paymentGroupType = paymentGroups?.paymentGroupsEntries[0]?.paymentGroupType;
        const isGroupTypePaze = paymentGroupType === orderUtils.PAYMENT_GROUP_TYPE.PAZE;
        const canCheckoutPaze = Storage.local.getItem(LOCAL_STORAGE.CAN_CHECKOUT_PAZE);

        let disablePlaceOrderButton = false;

        if (Sephora.isAgent) {
            disablePlaceOrderButton =
                (isAutoReplenishmentEnabled && isAutoReplenishBasket
                    ? (hasWarningMessage && !hasRrcWarning) || !acceptAutoReplenishTerms || !acceptAgentAwareTerms
                    : hasWarningMessage && !hasRrcWarning) ||
                (isSDUProductInBasket && (!acceptSDUTerms || !acceptAgentAwareTerms));
        } else {
            disablePlaceOrderButton =
                (isAutoReplenishmentEnabled && isAutoReplenishBasket
                    ? (hasWarningMessage && !hasRrcWarning) || !acceptAutoReplenishTerms
                    : hasWarningMessage && !hasRrcWarning) ||
                (isSDUProductInBasket && !acceptSDUTerms) ||
                (isGroupTypePaze && !canCheckoutPaze);
        }

        const extraFeesCopy = isBopis ? ` ${getText('andOtherFees')}` : '';
        const taxFeesBtnCopy = `${getText('tax')}${extraFeesCopy}`;
        const isSavingMessageVisible =
            !this.state.isBopis &&
            this.props.sddBasketHasItems &&
            (isSDUSubscriptionActive || (isSDUProductInBasket && !isSDUOrderOnly)) &&
            !isSDUOnlyInSddBasket;

        return (
            <Box
                lineHeight='tight'
                padding={isDesktop && 4}
            >
                {isMobile && shouldShowPromotion && !isConfirmation && (
                    <React.Fragment>
                        <CheckoutPromoSection isBopis={isBopis} />
                        <Divider marginY={4} />
                    </React.Fragment>
                )}
                {this.getOrderLine(merchandiseTotal, 'merchandiseSubtotal', 'merch_subtotal_label', 'total_merch')}
                {isAutoReplenishmentEnabled &&
                    this.getOrderLine(
                        replenishmentPromotionDiscount,
                        'autoReplenishmentSavings',
                        'auto_replenish_savings_label',
                        'auto_replenish_savings',
                        true
                    )}
                {showPointsReedeemed && (
                    <LegacyGrid
                        gutter={2}
                        marginY={2}
                    >
                        <LegacyGrid.Cell
                            width='fill'
                            data-at={Sephora.debug.dataAt('order_total_points_used_label')}
                            children={`Points ${getText('pointsUsed')}`}
                        />
                        <LegacyGrid.Cell
                            width='fit'
                            fontWeight='bold'
                            data-at={Sephora.debug.dataAt('order_total_points_used')}
                            key='points-used'
                        >
                            {items.redeemedBiPoints}
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                )}
                {priceInfo.promotionDiscount &&
                    this.getOrderLine(priceInfo.promotionDiscount, 'discounts', 'discounts_label', 'total_discount', true)}
                {this.getOrderLine(priceInfo.giftCardShipping, 'giftCardShipping', 'total_gc_ship_label', 'total_gc_ship')}
                {priceInfo.giftCardSubtotal &&
                    this.getOrderLine(priceInfo.merchandiseShipping, 'merchandiseShipping', 'total_merch_ship_label', 'total_merch_ship')}
                <RetailDeliveryFeeItem
                    priceInfo={priceInfo}
                    isCheckout
                />
                {!isSDUOrderOnly && (
                    <LegacyGrid
                        gutter={2}
                        marginBottom={2}
                    >
                        <LegacyGrid.Cell width='fill'>
                            <Link
                                padding={1}
                                margin={-1}
                                data-at={Sephora.debug.dataAt('bsk_total_ship_label')}
                                onClick={this.showShippingInfoModal}
                            >
                                {getText(isBopis ? 'pickupText' : 'shippingHandling')}
                                {isBopis || <InfoButton marginLeft={-1} />}
                            </Link>
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell
                            width='fit'
                            fontWeight='bold'
                            data-at={Sephora.debug.dataAt('bsk_total_ship')}
                            key='bsk_total_ship'
                        >
                            {shippingCost}
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                )}

                {isBopis && priceInfo.bagFeeSubtotal && (
                    <LegacyGrid
                        gutter={2}
                        marginBottom={2}
                    >
                        <LegacyGrid.Cell width='fill'>
                            <Link
                                data-at={Sephora.debug.dataAt('bag_fee_link')}
                                onClick={this.showBagFeeInfoModal}
                                padding={1}
                                margin={-1}
                            >
                                {getText('bagFee')}
                                <InfoButton marginLeft={-1} />
                            </Link>
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell
                            width='fit'
                            data-at={Sephora.debug.dataAt('bag_fee_value')}
                            fontWeight='bold'
                        >
                            {priceInfo.bagFeeSubtotal}
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                )}
                {isBopis && priceInfo.pif && (
                    <LegacyGrid
                        gutter={2}
                        marginBottom={2}
                    >
                        <LegacyGrid.Cell width='fill'>
                            <Link
                                onClick={this.showPifFeeInfoModal}
                                padding={1}
                                margin={-1}
                            >
                                {getText('specialFee')}
                                <InfoButton marginLeft={-1} />
                            </Link>
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell
                            width='fit'
                            fontWeight='bold'
                        >
                            {priceInfo.pif}
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                )}
                {isCanada ? (
                    this.renderGstHst(priceInfo)
                ) : (
                    <LegacyGrid
                        gutter={2}
                        marginBottom={2}
                    >
                        <LegacyGrid.Cell
                            width='fill'
                            data-at={Sephora.debug.dataAt('tax_btn')}
                        >
                            <Link
                                padding={1}
                                margin={-1}
                                onClick={this.showTaxInfoModal}
                            >
                                {taxFeesBtnCopy}
                                <InfoButton marginLeft={-1} />
                            </Link>
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell
                            width='fit'
                            data-at={Sephora.debug.dataAt('total_tax')}
                            fontWeight='bold'
                        >
                            {(!priceInfo.giftCardSubtotal && priceInfo.merchandiseSubtotal !== priceInfo.orderTotal) ||
                            priceInfo.giftCardShipping ||
                            (isShipAddressComplete && priceInfo.tax)
                                ? priceInfo.tax || priceInfo.stateTax || tbdValue
                                : tbdValue}
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                )}
                {checkoutUtils.isMoreThanJustCC(priceInfo) && !isZeroCheckout && (
                    <div>
                        {this.getOrderLine(priceInfo.storeCardAmount, 'storeCreditRedeemed', 'total_credit_amt_label', 'total_credit_amt', true)}
                        {this.getOrderLine(priceInfo.giftCardAmount, 'giftCardRedeemed', 'total_gc_amt_label', 'total_gc_amt', true)}
                        {this.getOrderLine(priceInfo.eGiftCardAmount, 'eGiftCardRedeemed', 'total_egc_amt_label', 'total_egc_amt', true)}
                        {this.getOrderLine(priceInfo.creditCardAmount, 'creditCardPayment', 'total_cc_amt_label', 'total_cc_amt')}
                        {this.getOrderLine(priceInfo.paypalAmount, 'payPalPayment', 'total_paypal_amt_label', 'total_paypal_amt')}
                    </div>
                )}

                <Divider
                    color='black'
                    height={2}
                    marginY={3}
                />
                <LegacyGrid
                    gutter={2}
                    fontWeight='bold'
                    fontSize='md'
                >
                    <LegacyGrid.Cell
                        width='fill'
                        children={getText('estimatedTotal')}
                        data-at={Sephora.debug.dataAt('total_label')}
                    />
                    {priceInfo && priceInfo.orderTotalWithoutDiscount && (
                        <LegacyGrid.Cell
                            width='fit'
                            data-at={Sephora.debug.dataAt('order_total_without_discount')}
                            fontWeight='normal'
                            color='gray'
                            css={{ textDecoration: 'line-through' }}
                            children={priceInfo.orderTotalWithoutDiscount}
                        />
                    )}
                    <LegacyGrid.Cell
                        width='fit'
                        data-at={Sephora.debug.dataAt('order_total')}
                        children={priceInfo.maxAmountToBeAuthorized ? `${orderTotal}*` : orderTotal}
                    />
                </LegacyGrid>

                {(isAfterpayEnabled || isKlarnaEnabled || isPayPalPayLaterEligibleEnabled) && !isConfirmation && (
                    <KlarnaMarketing
                        marginY={2}
                        subtotal={priceInfo.creditCardAmount || priceInfo.paypalAmount}
                        analyticsPageType={anaConsts.PAGE_TYPES.CHECKOUT}
                        analyticsContext={anaConsts.CONTEXT.CHECKOUT_PAGE}
                        isAfterpayEnabled={isAfterpayEnabled}
                        isKlarnaEnabled={isKlarnaEnabled}
                        isPayPalPayLaterEligibleEnabled={isPayPalPayLaterEligibleEnabled}
                    />
                )}

                {priceInfo.maxAmountToBeAuthorized && (
                    <Markdown
                        color='gray'
                        content={getText(`${basketType}IncreasedAuthorizationWarning`, [priceInfo.maxAmountToBeAuthorized])}
                        fontSize='sm'
                        paddingTop={isConfirmation ? '0.8rem' : 0}
                    />
                )}

                {isSavingMessageVisible && (
                    <Text
                        is='p'
                        marginTop={2}
                        fontSize='sm'
                        color='green'
                    >
                        {`${youSave} `}
                        <strong children={sduSavings} />
                        {` ${withSDUUnlimited}`}
                    </Text>
                )}

                {isDesktop && shouldShowPromotion && !isConfirmation && (
                    <React.Fragment>
                        <Divider marginY={4} />
                        <CheckoutPromoSection isBopis={isBopis} />
                    </React.Fragment>
                )}
                {isBopis && isConfirmation && (
                    <Box
                        lineHeight='tight'
                        backgroundColor='nearWhite'
                        marginY={3}
                        paddingX={3}
                        paddingY={2}
                        borderRadius={2}
                    >
                        <Text
                            is='p'
                            data-at={Sephora.debug.dataAt('bi_point_earn_msg')}
                            alignSelf='center'
                        >
                            {getText('pointsAfterPickup')}
                        </Text>
                    </Box>
                )}
                {isDesktop && !isBopis && (
                    <TestTarget
                        testName='creditCardBanners'
                        source='checkout'
                        testEnabled
                        testComponent={CreditCardBanner}
                        borderTop={1}
                        borderColor='divider'
                        paddingTop={4}
                        marginTop={4}
                    />
                )}
                {!isBopis && <Divider marginY={4} />}

                {hasWarningMessage && (
                    <ErrorMsg
                        children={warningMessages[0].message}
                        data-at={Sephora.debug.dataAt('order_summary_error_msg')}
                    />
                )}
                {isDesktop && isAutoReplenishBasket && isAutoReplenishmentEnabled && <CheckoutLegalOptIn />}
                {isDesktop && isSDUProductInBasket && <SDUAgreement />}
                {isDesktop &&
                    (isSDUProductInBasket || isAutoReplenishBasket) &&
                    this.renderAgentAwareCheckbox(isSDUProductInBasket, isAutoReplenishBasket)}
                <input
                    type='hidden'
                    id='form_variable'
                />
                {!isConfirmation && (
                    <PlaceOrderButton
                        disabled={disablePlaceOrderButton}
                        isBopis={isBopis}
                        children={getText('placeOrder')}
                        canCheckoutPaze={canCheckoutPaze}
                    />
                )}
            </Box>
        );
    }
}

export default wrapComponent(OrderTotalSection, 'OrderTotalSection', true);
