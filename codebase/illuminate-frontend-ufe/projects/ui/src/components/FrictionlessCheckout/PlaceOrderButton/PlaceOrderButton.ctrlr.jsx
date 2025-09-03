/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Button } from 'components/ui';
import ApplePayButton from 'components/ApplePayButton/ApplePayButton';
import store from 'store/Store';
import checkoutApi from 'services/api/checkout';
import Debounce from 'utils/Debounce';
import OrderUtils from 'utils/Order';
import checkoutUtils from 'utils/Checkout';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import VenmoActions from 'actions/VenmoActions';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import { SET_PLACE_ORDER_PRE_HOOK } from 'constants/actionTypes/order';
import basketUtils from 'utils/Basket';
import CheckoutBindings from 'analytics/bindingMethods/pages/checkout/CheckoutBindings';
import actions from 'actions/Actions';
import PazeActions from 'actions/PazeActions';
import FreePaymentButton from 'components/FrictionlessCheckout/PlaceOrderButton/FreePaymentButton/FreePaymentButton';
import Venmo from 'utils/Venmo';
import FrictionlessUtils from 'utils/FrictionlessCheckout';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import UI from 'utils/UI';
import OrderActions from 'actions/OrderActions';
import Storage from 'utils/localStorage/Storage';
import { TestTargetReady } from 'constants/events';
import userUtils from 'utils/User';

const { showGiftAddressWarningModal } = actions;
const { checkForCheckoutSectionsCompleteness, getErrorStatesFromSubmitOrderAPI } = FrictionlessUtils;

class PlaceOrderButton extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            orderQuantity: 0,
            orderTotal: '',
            placeOrderPreHook: null,
            isProcessingOrder: false,
            orderError: null
        };
    }

    componentDidMount() {
        const { togglePlaceOrderDisabled } = this.props;

        const isVenmoFlow = Venmo.isVenmoExpressFlow();

        this.setState({
            isVenmoFlow
        });

        store.setAndWatch('order.acceptAutoReplenishTerms', this, order =>
            this.setState({ acceptAutoReplenishTerms: order.acceptAutoReplenishTerms })
        );

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
                !basketUtils.isZeroCheckout() && store.dispatch(togglePlaceOrderDisabled(true));
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
                !basketUtils.isZeroCheckout() && store.dispatch(togglePlaceOrderDisabled(true));
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
                !basketUtils.isZeroCheckout() && store.dispatch(togglePlaceOrderDisabled(true));
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
                !basketUtils.isZeroCheckout() && store.dispatch(togglePlaceOrderDisabled(true));
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
            } else if (this.props.isSDUItemInBasket && !this.props.sduAcceptTerms) {
                this.triggerSDUModal();
            } else {
                originalPlaceOrder(data);
            }

            if (this.props.isAutoReplenishBasket && this.props.acceptAutoReplenish) {
                this.props.showPlaceOrderTermsModal(false);
            }
        };

        if (Sephora.isAgent) {
            //If it is Sephora Mirror, agent should see place order button disabled. However, certain roles should see enabled button only for card

            if (!Sephora.isAgentAuthorizedRole?.(['3']) && !OrderUtils.isZeroCheckout()) {
                const updatedOrderDetails = {
                    ...this.props.orderDetails,
                    header: {
                        ...this.props.orderDetails?.header,
                        isComplete: false
                    }
                };
                store.dispatch(OrderActions.updateOrder(updatedOrderDetails));
            }
        }

        this.placeOrder = Debounce.preventDoubleClick(this.placeOrder);

        Sephora.Util.onLastLoadEvent(window, [TestTargetReady], () => {
            store.setAndWatch('testTarget', this, newOffers => {
                const showPreviouslyPurchasedPdp = !!newOffers?.testTarget?.offers?.previouslyPurchasedPdp?.show;

                this.setState({
                    showPreviouslyPurchasedPdp
                });
            });
        });
    }

    handleVenmoClick = () => {
        Venmo.checkoutWithVenmo({ defaultPayment: this.state.defaultPaymentName, callback: this.onPlaceOrderSuccess });
    };

    isFreePaymentAvailable = () => {
        const {
            isKlarnaSelected,
            isKlarnaReady,
            isAfterpaySelected,
            isAfterpayReady,
            isPazeSelected,
            isPazeReady,
            isVenmoSelected,
            isVenmoReady,
            isVenmoFlow
        } = this.state;
        const { canCheckoutPaze } = this.props;

        const isFreePayment =
            (isKlarnaSelected && isKlarnaReady) ||
            (isAfterpaySelected && isAfterpayReady) ||
            (isPazeSelected && isPazeReady && canCheckoutPaze) ||
            (isVenmoSelected && isVenmoReady && !isVenmoFlow);

        return isFreePayment;
    };

    placeFreePaymentOrder = (event, freePaymentName) => {
        this.processPlaceOrderClickEvent(freePaymentName);
        const { getText, denialMessage } = this.props;

        const errorMessage = getText('authorizeErrorMessage', [freePaymentName]);

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

    processPlaceOrderBtnClick = (e, freePaymentName) => {
        const { isVenmoSelected, isVenmoFlow } = this.state;
        const errors = checkForCheckoutSectionsCompleteness(this.props.orderDetails);

        if (Object.keys(errors).length > 0) {
            this.props.setCheckoutSectionErrors(errors);
            UI.scrollTo({ elementId: Object.keys(errors)[0], hasOffset: false });

            return;
        }

        isVenmoSelected && !isVenmoFlow ? this.handleVenmoClick() : this.placeFreePaymentOrder(e, freePaymentName);
    };

    triggerSDUModal = () => {
        this.props.showSDUAgreementModal({
            isOpen: true,
            isBopis: this.props.isBopis,
            canCheckoutPaze: this.props.canCheckoutPaze,
            isSDUItemInBasket: this.props.isSDUItemInBasket
        });
    };

    closeSDUModal = () => {
        typeof this.props.closeSDUModal === 'function' && this.props.closeSDUModal();
    };

    placeOrder = (data = {}) => {
        const shouldValidateCVV = this.props.isCVVError && !this.props.orderDetails?.priceInfo?.paypalAmount;

        if (!this.props.orderDetails?.header?.isComplete || shouldValidateCVV) {
            // means order has an error somewhere
            const errors = checkForCheckoutSectionsCompleteness(this.props.orderDetails, shouldValidateCVV);

            if (Object.keys(errors).length > 0) {
                this.props.setCheckoutSectionErrors(errors);
                this.props.isSDUItemInBasket && this.closeSDUModal();
                UI.scrollTo({ elementId: Object.keys(errors)[0], hasOffset: false });
                FrictionlessCheckoutBindings.errorTrackingBeforeAPICall(errors);

                return;
            }
        }

        this.props.isSDUItemInBasket && this.closeSDUModal();

        const isSavePayPal = OrderUtils.isPayPalSaveToAccountChecked();
        const params = {
            savePayPal: this.state.isPaypalPaymentEnabled ? isSavePayPal : false,
            originOfOrder: this.props.originOfOrder
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
        store.dispatch(this.props.togglePlaceOrderDisabled(true));

        this.setState({
            isProcessingOrder: true,
            orderError: null
        });

        const birthdayGift = basketUtils.getBirthdayGift();

        decorators
            .withInterstice(
                checkoutApi.placeOrder,
                INTERSTICE_DELAY_MS
            )(params)
            .then(submittedDetails => {
                let isDefaultPaymentUsed;
                const { defaultPaymentMethodName, isDefaultPaymentBeingUsed } = this.props;
                const { existingDefaultPayment } = this.state;
                const defaultPaymentNameToSend = defaultPaymentMethodName || existingDefaultPayment;

                if (this.isFreePaymentAvailable()) {
                    const freePaymentName = this.getFreePaymentName()?.toLowerCase();
                    const isUsingExistingDefaultPayment = freePaymentName === existingDefaultPayment;
                    isDefaultPaymentUsed = isUsingExistingDefaultPayment;
                } else {
                    isDefaultPaymentUsed = isDefaultPaymentBeingUsed;
                }

                FrictionlessCheckoutBindings.setAnalyticsForOrderConfirmation(defaultPaymentNameToSend, isDefaultPaymentUsed);

                FrictionlessCheckoutBindings.setPlaceOrderBtnClickanalytics({
                    isSuccess: true
                });

                if (birthdayGift) {
                    const { skuId, productId, brandName, productName } = birthdayGift.sku;
                    CheckoutBindings.birthdayGiftRedemption({ skuId, productId, brandName, productName });
                }

                if (this.props.isBopis) {
                    CheckoutBindings.placeBOPISOrder();
                } else {
                    CheckoutBindings.placeStandardOrder();
                }

                this.setState({
                    isProcessingOrder: false,
                    orderError: null
                });

                this.onPlaceOrderSuccess(submittedDetails);
            })
            .catch(this.onPlaceOrderFailure);
    };

    onPlaceOrderSuccess = submittedDetails => {
        this.props.isBopis && analyticsUtils.setNextPageData({ customData: { clickBopisPlaceOrder: true } });
        checkoutUtils.placeOrderSuccess(submittedDetails);

        if (this.state.showPreviouslyPurchasedPdp) {
            const profileId = userUtils.getProfileId();

            if (profileId) {
                const cacheKey = `purchaseHistory_${profileId}`;
                Storage.db.removeItem(cacheKey).catch(err => {
                    Sephora.logger.error('[Purchase History Cache Clear Error]:', err);
                });
            }
        }
    };

    onPlaceOrderFailure = errorData => {
        const errors = getErrorStatesFromSubmitOrderAPI(errorData);

        if (Object.keys(errors || {}).length > 0) {
            FrictionlessCheckoutBindings.setPlaceOrderBtnClickanalytics({
                isSuccess: false,
                hasErrorMessage: errorData?.errorMessages?.length > 0
            });
            UI.scrollTo({ elementId: Object.keys(errors)[0], hasOffset: false });
            this.props.setCheckoutSectionErrors(errors);
        }

        this.setState({
            isProcessingOrder: false,
            orderError: errorData?.errorMessages?.[0]
        });
    };

    showGiftAddressWarning = () => {
        const placeOrderCallback = this.placeOrder;
        const recipientName = this.state?.digitalGiftMsg?.recipientName;

        return store.dispatch(showGiftAddressWarningModal({ isOpen: true, placeOrderCallback, recipientName }));
    };

    renderPaymentButton = () => {
        const freePaymentName = this.getFreePaymentName();
        const { isApplePayFlow, isAddressMisMatch, isProcessingOrder, orderTotal } = this.state;

        const {
            block = true,
            children = this.props.placeOrder,
            isBopis,
            isAutoReplenishBasket,
            showPlaceOrderTermsModal,
            acceptAutoReplenish,
            isSDUItemInBasket
        } = this.props;

        const getButtonAriaLabel = () => {
            const baseLabel = `${this.props.placeOrderFor} ${orderTotal}`;

            if (isProcessingOrder) {
                return `${baseLabel}. ${this.props.processingOrder}`;
            }

            if (this.getDisabledState()) {
                return `${baseLabel}. ${this.props.buttonDisabled}`;
            }

            return baseLabel;
        };

        if (isApplePayFlow) {
            return (
                <ApplePayButton
                    isApplePayPayment={true}
                    isBopis={isBopis}
                    block={block}
                />
            );
        } else if (this.isFreePaymentAvailable()) {
            return (
                <FreePaymentButton
                    onClick={e => this.processPlaceOrderBtnClick(e, freePaymentName)}
                    block={block}
                    minWidth={[null, '15em']}
                    data-at={Sephora.debug.dataAt('place_order_btn')}
                    freePaymentName={freePaymentName}
                    label={this.props.placeFreePayment}
                    orderTotal={orderTotal}
                    withText={this.props.withText}
                    forProcessingText={this.props.forProcessingText}
                    logoAlt={this.props.logoAlt}
                />
            );
        } else {
            const buttonText = isProcessingOrder ? this.props.processingOrder : children;

            return (
                <Button
                    variant='special'
                    disabled={this.getDisabledState()}
                    onClick={
                        isAutoReplenishBasket && !acceptAutoReplenish
                            ? () => showPlaceOrderTermsModal(true, !isSDUItemInBasket)
                            : isAddressMisMatch
                                ? this.showGiftAddressWarning
                                : this.placeOrder
                    }
                    block={block}
                    minWidth={[null, '15em']}
                    data-at={Sephora.debug.dataAt('place_order_btn')}
                    aria-label={getButtonAriaLabel()}
                >
                    {buttonText}
                </Button>
            );
        }
    };

    getDisabledState = () => {
        const disabledButton = this.props.disabled;
        const {
            isKlarnaSelected, isKlarnaReady, isAfterpaySelected, isAfterpayReady, isPazeSelected, isPazeReady, isVenmoSelected, isVenmoReady
        } =
            this.state;

        return (
            disabledButton ||
            (isKlarnaSelected && !isKlarnaReady) ||
            (isAfterpaySelected && !isAfterpayReady) ||
            (isPazeSelected && !isPazeReady) ||
            (isVenmoSelected && !isVenmoReady)
        );
    };

    getFreePaymentName = () => {
        const { isKlarnaSelected, isPazeSelected, isAfterpaySelected } = this.state;

        if (isKlarnaSelected) {
            return 'Klarna';
        } else if (isPazeSelected) {
            return 'Paze';
        } else if (isAfterpaySelected) {
            return 'Afterpay';
        } else {
            return 'Venmo';
        }
    };

    render() {
        return <>{this.renderPaymentButton()}</>;
    }
}

export default wrapComponent(PlaceOrderButton, 'PlaceOrderButton', true);
