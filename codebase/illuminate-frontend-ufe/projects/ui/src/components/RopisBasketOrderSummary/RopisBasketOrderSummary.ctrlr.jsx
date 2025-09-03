import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Divider, Grid, Button, Text
} from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import InfoButton from 'components/InfoButton/InfoButton';
import localeUtils from 'utils/LanguageLocale';
import StickyFooter from 'components/StickyFooter/StickyFooter';
import MediaUtils from 'utils/Media';
import checkoutUtils from 'utils/Checkout';
import anaUtils from 'analytics/utils';
import decorators from 'utils/decorators';
import checkoutApi from 'services/api/checkout';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import PaymentModal from 'components/PaymentModal/PaymentModal';
import TaxModal from 'components/TaxModal/TaxModal';
import OccupationalTaxItem from 'components/SharedComponents/OcuppationalTaxItem';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import store from 'store/Store';
import Actions from 'actions/Actions';
import BasketConstants from 'constants/Basket';
import OrderUtils from 'utils/Order';
import { itemWidths } from 'components/Product/ProductListItem/constants';
import BCC from 'utils/BCC';
import { globalModals, renderModal } from 'utils/globalModals';

const { BOPIS_BAG_FEE_INFO, BOPIS_PIF_FEE_INFO, BOPIS_SALES_TAX_INFO, SALES_TAX_INFO } = globalModals;
const { wrapComponent } = FrameworkUtils;
const { Media } = MediaUtils;
const { PICK_UP_ITEMS_OUT_OF_STOCK, PICK_UP_IN_STORE_ON_HOLD } = BasketConstants;
const { ZERO_CHECKOUT_OPTIONS, ROPIS_CONSTANTS } = OrderUtils;

const getText = (text, vars) =>
    localeUtils.getLocaleResourceFile('components/RopisBasketOrderSummary/locales', 'RopisBasketOrderSummary')(text, vars);

const { HEADER_LEVEL_ORDER_STATUS } = ROPIS_CONSTANTS;

const TOTALS_WIDTH = parseInt(itemWidths.DESC) + parseInt(itemWidths.PRICE) + parseInt(itemWidths.QTY) + parseInt(itemWidths.AMOUNT) + '%';

const showBopisInfoModal = (modalMediaId, modalTitle, showGotItButton) => {
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

class RopisBasketOrderSummary extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            modalIsOpen: false,
            basketHandlerClicked: false
        };
    }

    enableButton = () => {
        this.setState({ disabled: false });
    };

    registerCompleteInfoModalViewed = data => {
        this.setState({ modalIsOpen: data.isOpen });

        // We added watcher logic to stop the initiate checkout call until user hits continue or closes
        // the Registration complete modal on basket page when they register as new user while proceeding to checkout.
        if (!this.state.modalIsOpen && this.state.basketHandlerClicked) {
            this.initiateCheckout();
        }
    };

    initiateCheckout = () => {
        checkoutUtils
            .initializeCheckout({ ropisCheckout: true })
            .then(() => {
                if (!this.state.modalIsOpen) {
                    checkoutUtils.initOrderSuccess(false);
                }
            })
            .catch(reason => {
                checkoutUtils.initOrderFailure(reason);
            })
            .finally(() => {
                this.enableButton();
            });
    };

    basketHandler = () => {
        this.setState(
            {
                disabled: true,
                basketHandlerClicked: true
            },
            () => {
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        actionInfo: anaConsts.LinkData.ROPIS_CONTINUE_TO_RESERVATION,
                        linkName: 'D=c55',
                        ...anaUtils.getLastAsyncPageLoadData()
                    }
                });
                this.initiateCheckout();
            }
        );
    };

    checkoutHandler = () => {
        const params = { originOfOrder: Sephora.isMobile() ? 'mobileWeb' : 'web' };
        this.setState({ disabled: true }, () => {
            decorators
                .withInterstice(
                    checkoutApi.placeOrder,
                    INTERSTICE_DELAY_MS
                )(params)
                .then(response => {
                    // To prevent race condition between analytics s.tl call
                    // and submit order call, remember the event here
                    // and fire s.tl for it on the next page (order confirmation)
                    anaUtils.setNextPageData({
                        customData: { clickRopisCompleteReservation: true }
                    });
                    checkoutUtils.placeOrderSuccess(response);
                })
                .catch(reason => {
                    // in case of failure, fire s.tl call immediately
                    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                        data: {
                            actionInfo: anaConsts.LinkData.ROPIS_RESERVATION_COMPLETE,
                            linkName: 'D=c55',
                            eventStrings: [anaConsts.Event.EVENT_71]
                        }
                    });
                    checkoutUtils.placeOrderFailure(reason, null, true);
                })
                .finally(() => {
                    this.enableButton();
                });
        });
    };

    showPaymentModal = () => {
        this.setState({ activePaymentModal: true });
    };

    showTaxModal = () => {
        this.setState({ activeTaxModal: true });
    };

    componentDidMount() {
        store.watchAction(Actions.TYPES.SHOW_INFO_MODAL, this.registerCompleteInfoModalViewed);
    }

    handleReservationDetailsClick = () => {
        const { isCheckout = false } = this.props;

        return isCheckout ? this.checkoutHandler() : this.basketHandler();
    };

    handleClosePaymentModal = () => {
        this.setState({ activePaymentModal: false });
    };

    handleCloseTaxModal = () => {
        this.setState({ activeTaxModal: false });
    };

    handleBagFeeTextClick = () => {
        const { isBopisOrder, globalModals: globalModalsData } = this.props;

        renderModal(globalModalsData[BOPIS_BAG_FEE_INFO], () => {
            showBopisInfoModal(BCC.MEDIA_IDS.BOPIS_BAG_FEE, 'bagFeeText', isBopisOrder);
        });
    };

    handleSpecialFeeTextClick = () => {
        const { isBopisOrder, globalModals: globalModalsData } = this.props;

        renderModal(globalModalsData[BOPIS_PIF_FEE_INFO], () => {
            showBopisInfoModal(BCC.MEDIA_IDS.BOPIS_PIF_FEE, 'specialFeeText', isBopisOrder);
        });
    };

    handleTaxTextClick = () => {
        const { isBopisOrder, globalModals: globalModalsData } = this.props;

        renderModal(globalModalsData[isBopisOrder ? BOPIS_SALES_TAX_INFO : SALES_TAX_INFO], () => {
            showBopisInfoModal(isBopisOrder ? BCC.MEDIA_IDS.BOPIS_TAX_INFO : BCC.MEDIA_IDS.TAX_INFO, 'salesTax', isBopisOrder);
        });
    };

    showBopisAuthWarning = () => {
        const { maxAmountToBeAuthorized } = this.props.priceInfo;
        // Only show the warning displayed when an item's substitution may affect the price, if there's an actual
        // item that has been substituted, and if the order has NOT been picked up yet.
        const hasSubstitutions = OrderUtils.hasSubstitutions();
        const isOrderProcessing = OrderUtils.isOrderProcessing();

        return !!maxAmountToBeAuthorized && hasSubstitutions && isOrderProcessing;
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            pickupBasket = {},
            isCheckout = false,
            isConfirmation = false,
            isOrderDetail = false,
            priceInfo = {},
            isCanceledPickupOrder = false,
            isBopisOrder,
            orderStatus,
            redeemedPoints
        } = this.props;

        const isCanada = localeUtils.isCanada();
        const formattedZeroPrice = localeUtils.isFRCanada() ? ZERO_CHECKOUT_OPTIONS.CA_FR : ZERO_CHECKOUT_OPTIONS.US;

        const errorMessages = pickupBasket.basketLevelMessages || [];
        const hasErrors = errorMessages.some(
            msg => msg && (msg.messageContext === PICK_UP_ITEMS_OUT_OF_STOCK || msg.messageContext === PICK_UP_IN_STORE_ON_HOLD)
        );

        const merchSubtotal = isCanceledPickupOrder
            ? formattedZeroPrice
            : isConfirmation || isOrderDetail
                ? priceInfo.merchandiseSubtotal
                : pickupBasket.subtotal;
        const taxAmount = isCanceledPickupOrder ? formattedZeroPrice : isConfirmation || isOrderDetail ? priceInfo.tax : pickupBasket.estimatedTax;
        const orderTotal = isCanceledPickupOrder
            ? formattedZeroPrice
            : isConfirmation || isOrderDetail
                ? priceInfo.orderTotal
                : pickupBasket.estimatedTotal;
        const storeCreditAmount = isBopisOrder ? priceInfo.storeCardAmount : null;
        const discountTotal = isBopisOrder ? priceInfo.promotionDiscount : null;
        const specialFeeSubtotal = isBopisOrder ? priceInfo.pif : null;
        const bagFeeSubtotal = isBopisOrder ? priceInfo.bagFeeSubtotal : null;
        const giftCardAmount = isBopisOrder ? priceInfo.giftCardAmount : null;
        const creditCardAmount = isBopisOrder ? priceInfo.creditCardAmount : null;
        const paypalAmount = isBopisOrder ? priceInfo.paypalAmount : null;
        const eGiftCardAmount = isBopisOrder ? priceInfo.eGiftCardAmount : null;
        const { maxAmountToBeAuthorized } = priceInfo;

        const showBopisAuthWarning = this.showBopisAuthWarning();

        const reservationDetailsButton = (
            <Button
                block={true}
                data-at={Sephora.debug.dataAt('ropis_continue_reserve_btn')}
                variant='special'
                disabled={this.state.disabled || hasErrors}
                onClick={this.handleReservationDetailsClick}
            >
                {getText(isCheckout ? 'completeReservation' : 'reservationDetailsButtonText')}
            </Button>
        );

        return (
            <React.Fragment>
                <PaymentModal
                    close={this.handleClosePaymentModal}
                    isOpen={this.state.activePaymentModal}
                />
                <TaxModal
                    close={this.handleCloseTaxModal}
                    isOpen={this.state.activeTaxModal}
                />
                <Box
                    {...(isOrderDetail && {
                        width: [null, null, TOTALS_WIDTH],
                        paddingLeft: [null, null, 6]
                    })}
                    lineHeight='tight'
                >
                    <Grid columns='1fr auto'>
                        <span children={getText('merchandiseSubtotalText')} />
                        <strong
                            data-at={Sephora.debug.dataAt('ropis_merch_subtotal')}
                            children={merchSubtotal}
                        />
                    </Grid>
                    <Grid
                        columns='1fr auto'
                        marginY={2}
                    >
                        <span children={getText('pickup')} />
                        <strong
                            data-at={Sephora.debug.dataAt('ropis_bsk_pickup')}
                            children={getText('free')}
                        />
                    </Grid>
                    {redeemedPoints > 0 && (
                        <Grid
                            columns='1fr auto'
                            marginY={2}
                        >
                            <span children={getText('pointsUsedInThisOrder')} />
                            <strong children={redeemedPoints} />
                        </Grid>
                    )}
                    {storeCreditAmount && (
                        <Grid
                            columns='1fr auto'
                            marginY={2}
                        >
                            <span children={getText('storeCredit')} />
                            <strong
                                data-at={Sephora.debug.dataAt('bopis_store_credit')}
                                children={storeCreditAmount}
                            />
                        </Grid>
                    )}
                    {discountTotal && (
                        <Grid columns='1fr auto'>
                            <span children={getText('discountsText')} />
                            <strong
                                data-at={Sephora.debug.dataAt('bopis_discounts')}
                                children={`-${discountTotal}`}
                            />
                        </Grid>
                    )}
                    {bagFeeSubtotal && (
                        <Grid
                            columns='1fr auto'
                            marginY={2}
                        >
                            <span>
                                {getText('bagFeeText')} <InfoButton onClick={this.handleBagFeeTextClick} />
                            </span>
                            <strong
                                data-at={Sephora.debug.dataAt('bopis_bag_fee')}
                                children={bagFeeSubtotal}
                            />
                        </Grid>
                    )}
                    {specialFeeSubtotal && (
                        <Grid
                            columns='1fr auto'
                            marginY={2}
                        >
                            <span>
                                {getText('specialFeeText')} <InfoButton onClick={this.handleSpecialFeeTextClick} />
                            </span>
                            <strong children={specialFeeSubtotal} />
                        </Grid>
                    )}
                    {giftCardAmount && (
                        <Grid
                            columns='1fr auto'
                            marginY={2}
                        >
                            <span children={getText('giftCardRedeemedText')} />
                            <strong
                                data-at={Sephora.debug.dataAt('bopis_gc_redeemed')}
                                children={`-${giftCardAmount}`}
                            />
                        </Grid>
                    )}
                    {eGiftCardAmount && (
                        <Grid
                            columns='1fr auto'
                            marginY={2}
                        >
                            <span children={getText('eGiftCardRedeemedText')} />
                            <strong
                                data-at={Sephora.debug.dataAt('bopis_egc_redeemed')}
                                children={eGiftCardAmount}
                            />
                        </Grid>
                    )}
                    {creditCardAmount && (
                        <Grid
                            columns='1fr auto'
                            marginY={2}
                        >
                            <span children={getText('creditCardPaymentText')} />
                            <strong
                                data-at={Sephora.debug.dataAt('bopis_creditcard_payment')}
                                children={creditCardAmount}
                            />
                        </Grid>
                    )}
                    {paypalAmount && (
                        <Grid
                            columns='1fr auto'
                            marginY={2}
                        >
                            <span children={getText('payPalPaymentText')} />
                            <strong
                                data-at={Sephora.debug.dataAt('bopis_paypal_payment')}
                                children={paypalAmount}
                            />
                        </Grid>
                    )}
                    <OccupationalTaxItem />
                    <Grid columns='1fr auto'>
                        <span>
                            {getText(isCanada ? (isBopisOrder && 'caTax') || 'estimatedTaxCA' : (isBopisOrder && 'tax') || 'estimatedTaxText')}{' '}
                            <InfoButton
                                onClick={this.handleTaxTextClick}
                                data-at={Sephora.debug.dataAt('ropis_tax_info_icon')}
                            />
                        </span>
                        <strong
                            data-at={Sephora.debug.dataAt('ropis_estimated_tax')}
                            children={taxAmount}
                        />
                    </Grid>
                    <Divider marginY={3} />
                    <Grid
                        columns='1fr auto'
                        fontSize='md'
                        fontWeight='bold'
                    >
                        <span children={getText(isOrderDetail && showBopisAuthWarning ? 'estimatedTotalText' : 'orderTotal')} />
                        <strong data-at={Sephora.debug.dataAt('ropis_estimated_total')}>
                            {orderTotal}
                            {showBopisAuthWarning ? '*' : ''}
                        </strong>
                    </Grid>
                    {showBopisAuthWarning && (
                        <Markdown
                            color='gray'
                            content={getText('bopisIncreasedAuthorizationWarning', [maxAmountToBeAuthorized])}
                            fontSize='sm'
                            paddingBottom='0.8rem'
                            paddingTop='0.8rem'
                            aria-label={getText('bopisIncreasedAuthorizationWarning', [maxAmountToBeAuthorized])}
                            tabIndex='0'
                        />
                    )}
                    {!isBopisOrder && (
                        <Text
                            is='p'
                            data-at={Sephora.debug.dataAt('ropis_payment_info_msg')}
                            fontSize='sm'
                            marginTop={1}
                            marginBottom={isConfirmation || [null, null, 4]}
                        >
                            {getText('paymentText')}{' '}
                            <InfoButton
                                onClick={this.showPaymentModal}
                                data-at={Sephora.debug.dataAt('ropis_payment_info_icon')}
                            />
                        </Text>
                    )}
                    {isBopisOrder &&
                        (orderStatus === HEADER_LEVEL_ORDER_STATUS.PROCESSING || orderStatus === HEADER_LEVEL_ORDER_STATUS.READY_FOR_PICK_UP) && (
                        <Box
                            paddingY={2}
                            paddingX={3}
                            borderRadius={2}
                            backgroundColor='nearWhite'
                            marginTop={2}
                            lineHeight='tight'
                        >
                            <Text
                                color={'black'}
                                data-at={Sephora.debug.dataAt('bi_point_earn_msg')}
                                children={getText('beautyInsiderPoints')}
                            ></Text>
                        </Box>
                    )}
                    {!isConfirmation && !isOrderDetail && (
                        <Media lessThan='md'>
                            <StickyFooter accountForBottomNav={!isCheckout}>{reservationDetailsButton}</StickyFooter>
                        </Media>
                    )}
                    {!isConfirmation && !isOrderDetail && <Media greaterThan='sm'>{reservationDetailsButton}</Media>}
                </Box>
            </React.Fragment>
        );
    }
}

RopisBasketOrderSummary.defaultProps = {
    redeemedPoints: 0
};

RopisBasketOrderSummary.propTypes = {
    redeemedPoints: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default wrapComponent(RopisBasketOrderSummary, 'RopisBasketOrderSummary', true);
