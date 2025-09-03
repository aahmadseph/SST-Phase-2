/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Flex, Button, Link
} from 'components/ui';
import ApplePayButton from 'components/ApplePayButton/ApplePayButton';
import localeUtils from 'utils/LanguageLocale';
import StickyFooter from 'components/StickyFooter';
import store from 'store/Store';
import checkoutApi from 'services/api/checkout';
import OrderActions from 'actions/OrderActions';
import Debounce from 'utils/Debounce';
import OrderUtils from 'utils/Order';
import checkoutUtils from 'utils/Checkout';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import { SET_PLACE_ORDER_PRE_HOOK } from 'constants/actionTypes/order';
import basketUtils from 'utils/Basket';
import CheckoutBindings from 'analytics/bindingMethods/pages/checkout/CheckoutBindings';
import actions from 'actions/Actions';
import PazeActions from 'actions/PazeActions';
import VenmoActions from 'actions/VenmoActions';
import Markdown from 'components/Markdown/Markdown';
import VenmoButton from 'components/Checkout/PlaceOrderButton/VenmoButton/VenmoButton';

const { showGiftAddressWarningModal } = actions;

const getText = localeUtils.getLocaleResourceFile('components/Checkout/PlaceOrderButton/locales', 'PlaceOrderButton');

class PlaceOrderButton extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            orderQuantity: 0,
            orderTotal: '',
            placeOrderPreHook: null
        };
    }

    handleScroll = () => {
        this.setState({
            bottom: window.scrollY > 150 ? 0 : -75
        });
    };

    componentDidMount() {
        store.setAndWatch('order.acceptAutoReplenishTerms', this, order =>
            this.setState({ acceptAutoReplenishTerms: order.acceptAutoReplenishTerms })
        );
        store.setAndWatch('order.isPlaceOrderDisabled', this, order => {
            this.setState({ disabled: order.isPlaceOrderDisabled });
        });
        store.setAndWatch('order.orderDetails', this, order =>
            this.setState({
                orderQuantity: order.orderDetails.items.itemCount,
                orderTotal: order.orderDetails.priceInfo.orderTotal,
                isPaypalPaymentEnabled: order.orderDetails.header.isPaypalPaymentEnabled,
                userHasSavedPayPalAccount: OrderUtils.userHasSavedPayPalAccount(order.orderDetails),
                isAddressMisMatch: order.orderDetails.header.isAddressMisMatch,
                digitalGiftMsg: order.orderDetails.digitalGiftMsg,
                maxAmountToBeAuthorized: order.orderDetails.priceInfo.maxAmountToBeAuthorized
            })
        );
        store.setAndWatch('order.paymentOptions', this, order =>
            this.setState({
                existingDefaultPayment: order.paymentOptions.defaultPayment
            })
        );
        store.setAndWatch('order.isApplePayFlow', this, null, true);
        store.setAndWatch('klarna', this, data => {
            const isKlarnaDeselected = this.state.isKlarnaSelected && !data.klarna.isSelected;

            // if Klarna has been deselected -> restore the button state
            if (isKlarnaDeselected) {
                !basketUtils.isZeroCheckout() && store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
            }

            this.setState({
                isKlarnaSelected: data.klarna.isSelected,
                isKlarnaReady: data.klarna.isReady
            });
        });
        store.setAndWatch('afterpay', this, data => {
            const isAfterpayDeselected = this.state.isAfterpaySelected && !data.afterpay.isSelected;

            // if Afterpay has been deselected -> restore the button state
            if (isAfterpayDeselected) {
                !basketUtils.isZeroCheckout() && store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
            }

            this.setState({
                isAfterpaySelected: data.afterpay.isSelected,
                isAfterpayReady: data.afterpay.isReady
            });
        });
        store.setAndWatch('paze', this, data => {
            const isPazeDeselected = this.state.isPazeSelected && !data.paze.isSelected;

            // if Paze has been deselected -> restore the button state
            if (isPazeDeselected) {
                !basketUtils.isZeroCheckout() && store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
            }

            this.setState({
                isPazeSelected: data.paze.isSelected,
                isPazeReady: data.paze.isReady
            });
        });
        store.setAndWatch('venmo', this, data => {
            const isVenmoDeselected = this.state.isVenmoSelected && !data.venmo.isSelected;

            // if Venmo has been deselected -> restore the button state
            if (isVenmoDeselected) {
                !basketUtils.isZeroCheckout() && store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
            }

            this.setState({
                isVenmoSelected: data.venmo.isSelected,
                isVenmoReady: data.venmo.isReady
            });
        });
        store.setAndWatch('user', this, data => {
            this.setState({
                defaultPaymentName: data.user.selectedAsDefaultPaymentName
            });
        });
        store.watchAction(SET_PLACE_ORDER_PRE_HOOK, data => {
            this.setState({ placeOrderPreHook: data.placeOrderPreHook });
        });

        const originalPlaceOrder = this.placeOrder;
        this.placeOrder = (e, data) => {
            if (this.state.placeOrderPreHook) {
                this.state.placeOrderPreHook(e).then(originalPlaceOrder);
            } else {
                originalPlaceOrder(data);
            }
        };

        this.placeOrder = Debounce.preventDoubleClick(this.placeOrder);
    }

    placeFreePaymentOrder = (event, freePaymentName) => {
        this.processPlaceOrderClickEvent(freePaymentName);
        const errorMessage = getText('authorizeErrorMessage', [freePaymentName]);
        const denialMessage = getText('denialMessage');

        const paymentActionsMapping = {
            Klarna: KlarnaActions.placeOrder,
            Afterpay: AfterpayActions.placeOrder,
            Paze: PazeActions.placeOrder,
            Venmo: VenmoActions.placeOrder
        };

        const action = paymentActionsMapping[freePaymentName] || paymentActionsMapping['Paze'];

        store
            .dispatch(
                action({
                    errorMessage,
                    denialMessage,
                    transactionAmount: basketUtils.removeCurrency(this.state.orderTotal)
                })
            )
            .then(data => data && this.placeOrder(event, data));
    };

    processPlaceOrderClickEvent = freePaymentName => {
        const paymentName = freePaymentName.toLowerCase();
        const { defaultPaymentName, existingDefaultPayment } = this.state;
        const checkoutWithExistingDefaultPayment = paymentName === existingDefaultPayment;
        const actionInfo = `checkout:payment:continue with ${paymentName}`;
        const events = [anaConsts.Event.EVENT_71];

        if (defaultPaymentName || checkoutWithExistingDefaultPayment) {
            events.push('event252=1');
        }

        const eventData = {
            eventStrings: events,
            linkName: 'D=c55',
            actionInfo: actionInfo
        };

        const mostRecentAsyncLoadEvent = analyticsUtils.getMostRecentEvent('asyncPageLoad');

        if (mostRecentAsyncLoadEvent) {
            eventData.previousPage = mostRecentAsyncLoadEvent.eventInfo.attributes.previousPageName;
        }

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data: eventData });
    };

    placeOrder = (data = {}) => {
        const isSavePayPal = OrderUtils.isPayPalSaveToAccountChecked();
        const params = {
            savePayPal: this.state.isPaypalPaymentEnabled ? isSavePayPal : false,
            originOfOrder: Sephora.isMobile() ? 'mobileWeb' : 'web'
        };

        if (this.state.defaultPaymentName) {
            params.defaultPayment = this.state.defaultPaymentName;
        }

        // If this item comes from data, it means this order was placed using Klarna
        if (data.authorization_token) {
            params.klarnaAuthorizationToken = data.authorization_token;
        }

        // If this item comes from data, it means this order was placed using Paze (placeOrder in Paze Utils)
        if (data.paze) {
            params.paze = data.paze;
        }

        // When customer journey started on affiliate links, some information is stored and it needs to be send to the purchase API
        const { linkshareSiteId, linkshareTime } = analyticsUtils.getAffiliateGatewayParams();

        if (linkshareSiteId !== '' && linkshareTime !== '') {
            params.linkshareInformation = {
                linkshareSiteId,
                linkshareTime
            };
        }

        //disable place order button just in case
        store.dispatch(OrderActions.togglePlaceOrderDisabled(true));

        const birthdayGift = basketUtils.getBirthdayGift();

        decorators
            .withInterstice(
                checkoutApi.placeOrder,
                INTERSTICE_DELAY_MS
            )(params)
            .then(submittedDetails => {
                if (birthdayGift) {
                    const { skuId, productId, brandName, productName } = birthdayGift.sku;
                    CheckoutBindings.birthdayGiftRedemption({ skuId, productId, brandName, productName });
                }

                if (this.props.isBopis) {
                    CheckoutBindings.placeBOPISOrder();
                } else {
                    CheckoutBindings.placeStandardOrder();
                }

                this.onPlaceOrderSuccess(submittedDetails);
            })
            .catch(this.onPlaceOrderFailure);
    };

    onPlaceOrderSuccess = submittedDetails => {
        this.props.isBopis && analyticsUtils.setNextPageData({ customData: { clickBopisPlaceOrder: true } });
        checkoutUtils.placeOrderSuccess(submittedDetails);
    };

    onPlaceOrderFailure = errorData => {
        checkoutUtils.placeOrderFailure(errorData, this);
    };

    showGiftAddressWarning = () => {
        const placeOrderCallback = this.placeOrder;
        const recipientName = this.state?.digitalGiftMsg?.recipientName;

        return store.dispatch(showGiftAddressWarningModal({ isOpen: true, placeOrderCallback, recipientName }));
    };

    renderPaymentButton = () => {
        const freePaymentName = this.getFreePaymentName();
        const isDesktop = Sephora.isDesktop();
        const {
            isApplePayFlow,
            isKlarnaSelected,
            isKlarnaReady,
            isAfterpaySelected,
            isAfterpayReady,
            isPazeSelected,
            isPazeReady,
            isVenmoSelected,
            isAddressMisMatch
        } = this.state;
        const { block = true, children = getText('placeOrder'), isBopis, canCheckoutPaze } = this.props;

        // TODO PAZE: Change isPazeSelected to isPazeSelected && isPazeReady, since we need to load the iframe
        const isFreePaymentAvailable =
            (isKlarnaSelected && isKlarnaReady) || (isAfterpaySelected && isAfterpayReady) || (isPazeSelected && isPazeReady && canCheckoutPaze);
        const isButtonEnabled = !this.state.disabled && isFreePaymentAvailable;

        if (isApplePayFlow) {
            return (
                <ApplePayButton
                    isApplePayPayment={true}
                    isBopis={isBopis}
                    block={block}
                />
            );
        }

        if (isButtonEnabled) {
            if (isVenmoSelected) {
                return <VenmoButton />;
            }

            return (
                <Button
                    variant='special'
                    onClick={e => this.placeFreePaymentOrder(e, freePaymentName)}
                    block={block}
                    minWidth={isDesktop && '15em'}
                    data-at={Sephora.debug.dataAt('place_order_btn')}
                >
                    {getText(`place${freePaymentName}Order`)}
                </Button>
            );
        }

        return (
            <Button
                variant='special'
                disabled={this.getDisabledState()}
                onClick={isAddressMisMatch ? this.showGiftAddressWarning : this.placeOrder}
                block={block}
                minWidth={isDesktop && '15em'}
                data-at={Sephora.debug.dataAt('place_order_btn')}
            >
                {children}
            </Button>
        );
    };

    getDisabledState = () => {
        const disabledButton = this.props.disabled;
        const {
            isKlarnaSelected,
            isKlarnaReady,
            isAfterpaySelected,
            isAfterpayReady,
            isPazeSelected,
            isPazeReady,
            isVenmoSelected,
            isVenmoReady,
            disabled
        } = this.state;

        return (
            disabled ||
            disabledButton ||
            (isKlarnaSelected && !isKlarnaReady) ||
            (isAfterpaySelected && !isAfterpayReady) ||
            (isPazeSelected && !isPazeReady) ||
            (isVenmoSelected && !isVenmoReady)
        );
    };

    getFreePaymentName = () => {
        const { isKlarnaSelected, isPazeSelected, isVenmoSelected } = this.state;

        if (isKlarnaSelected) {
            return 'Klarna';
        }

        if (isPazeSelected) {
            return 'Paze';
        }

        if (isVenmoSelected) {
            return 'Venmo';
        }

        return 'Afterpay';
    };

    render() {
        const isDesktop = Sephora.isDesktop();
        const actionButton = this.renderPaymentButton();

        const { maxAmountToBeAuthorized } = this.state;

        return isDesktop ? (
            <>
                <Box marginTop={4}>{actionButton}</Box>
                {maxAmountToBeAuthorized && (
                    <Link
                        href='/beauty/terms-of-use'
                        target='_blank'
                        fontSize='xs'
                        color='gray'
                        marginTop={4}
                        marginBottom={2}
                    >
                        <Markdown content={getText('maxAuthAmountMessage', [maxAmountToBeAuthorized])} />
                    </Link>
                )}
            </>
        ) : (
            <StickyFooter accountForBottomNav={false}>
                <Flex
                    justifyContent='space-between'
                    fontWeight='bold'
                    lineHeight='none'
                    marginBottom={2}
                >
                    <span>
                        {this.state.orderQuantity} {this.state.orderQuantity > 1 ? getText('items') : getText('item')}
                    </span>
                    <span>
                        {getText('orderTotal')}: {this.state.orderTotal}
                        {maxAmountToBeAuthorized && '*'}
                    </span>
                </Flex>
                {actionButton}
                {maxAmountToBeAuthorized && (
                    <Link
                        href='/beauty/terms-of-use'
                        target='_blank'
                        fontSize='xs'
                        color='gray'
                        marginTop={4}
                        marginBottom={2}
                    >
                        <Markdown content={getText('maxAuthAmountMessage', [maxAmountToBeAuthorized])} />
                    </Link>
                )}
            </StickyFooter>
        );
    }
}

export default wrapComponent(PlaceOrderButton, 'PlaceOrderButton', true);
