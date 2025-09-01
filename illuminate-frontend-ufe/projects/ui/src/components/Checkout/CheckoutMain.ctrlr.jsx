/* eslint-disable object-curly-newline */
/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import ReactDOM from 'react-dom';
import { space, mediaQueries } from 'style/config';
import { Box, Flex, Image, Text } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import AccordionSection from 'components/Checkout/AccordionSection/AccordionSection';
import orderUtils from 'utils/Order';
import ShipOptionsDisplay from 'components/Checkout/Sections/ShipOptions/Display/ShipOptionsDisplay';
import ShipOptionsForm from 'components/Checkout/Sections/ShipOptions/ShipOptionsForm';
import AccountCreationSection from 'components/Checkout/Sections/AccountCreation/Section/AccountCreationSection';
import AccountDisplay from 'components/Checkout/Sections/AccountCreation/Display/AccountDisplay';
import OrderSummary from 'components/Checkout/OrderSummary';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import ShipAddressDisplay from 'components/Checkout/Sections/ShipAddress/Display/ShipAddressDisplay';
import ShipAddressSection from 'components/Checkout/Sections/ShipAddress/Section/ShipAddressSection';
import ShipToAccessPoint from 'components/Checkout/Sections/ShipToAccessPoint';
import PaymentSectionNewUser from 'components/Checkout/Sections/Payment/Section/PaymentSectionNewUser/PaymentSectionNewUser';
import PaymentSectionExistingUser from 'components/Checkout/Sections/Payment/Section/PaymentSectionExistingUser/PaymentSectionExistingUser';
import PaymentDisplay from 'components/Checkout/Sections/Payment/Display/PaymentDisplay';
import PickUpOrderContactInfo from 'components/Checkout/Sections/PickUpOrderContactInfo/Display/PickUpOrderContactInfo';
import PickUpOrderLocation from 'components/Checkout/Sections/PickUpOrderLocation';
import GiftCardShipOptionsForm from 'components/Checkout/Sections/GiftCardShipOptions/GiftCardShipOptionsForm';
import ReviewText from 'components/Checkout/Sections/Review/ReviewText';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import ComponentList from 'components/Content/ComponentList';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import Logo from 'components/Logo/Logo';
import CompactFooter from 'components/Footer/CompactFooter';
import ReCaptchaText from 'components/ReCaptchaText/ReCaptchaText';
import checkoutUtils from 'utils/Checkout';
import SddSection from 'components/Checkout/Sections/SddSections/SddSection';
import StandardSection from 'components/Checkout/Sections/SddSections/StandardSection';
import AccessPointButton from 'components/Checkout/Shared/AccessPointButton';
import AddGiftMessage from 'components/AddGiftMessage';
import skuHelpers from 'utils/skuHelpers';
import basketUtils from 'utils/Basket';
import basketConstants from 'constants/Basket';
import store from 'store/Store';

import smoothScroll from 'smoothscroll-polyfill';
import checkoutApi from 'services/api/checkout';
import profileApi from 'services/api/profile';
import Actions from 'actions/Actions';
import OrderActions from 'actions/OrderActions';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import watch from 'redux-watch';
import StringUtils from 'utils/String';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import ErrorsUtils from 'utils/Errors';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import sessionExtensionService from 'services/SessionExtensionService';
import UtilActions from 'utils/redux/Actions';
import anaConsts from 'analytics/constants';
import checkoutBindings from 'analytics/bindings/pages/checkout/checkoutBindings';
import klarnaUtils from 'utils/Klarna';
import afterpayUtils from 'utils/Afterpay';
import pazeUtils from 'utils/Paze.js';
import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import PazeActions from 'actions/PazeActions';
import VenmoActions from 'actions/VenmoActions';
import contentConstants from 'constants/content';
import locationUtils from 'utils/Location';

let readyForAnalytics = () => {};
let isShippingRequestInProgress;
let getShippingMethodPromise;
import { SECTION_SAVED } from 'constants/actionTypes/order';
import creditCardUtils from 'utils/CreditCard';
import Venmo from 'utils/Venmo';
const { loadChaseTokenizer } = creditCardUtils;
const { CONTEXTS } = contentConstants;
const { SHIPPING_GROUPS } = orderUtils;

const authorizationGetText = localeUtils.getLocaleResourceFile('components/Checkout/PlaceOrderButton/locales', 'PlaceOrderButton');

const { GIFT_MESSAGE_STATUS } = basketConstants;
const CHECKOUT_SECTIONS = checkoutUtils.CHECKOUT_SECTIONS;
const CHECKOUT_PATH = checkoutUtils.CHECKOUT_PATH;
const { ACCOUNT, SHIP_ADDRESS, SHIP_OPTIONS, PAYMENT, REVIEW, GIFT_CARD_OPTIONS, DELIVER_TO, GIFT_MESSAGE } = CHECKOUT_SECTIONS;

const sectionTitleDataAtTable = new Map();
sectionTitleDataAtTable.set(CHECKOUT_SECTIONS.PICKUP_ORDER_LOCATION_INFO.name, Sephora.debug.dataAt('pickup_location_section_title'));
sectionTitleDataAtTable.set(CHECKOUT_SECTIONS.PICKUP_ORDER_CONTACT_INFO.name, Sephora.debug.dataAt('pickup_contact_info_section_title'));
sectionTitleDataAtTable.set(CHECKOUT_SECTIONS.SHIP_ADDRESS.name, Sephora.debug.dataAt('shipping_address_section_title'));
sectionTitleDataAtTable.set(CHECKOUT_SECTIONS.GIFT_CARD_ADDRESS.name, Sephora.debug.dataAt('gc_shipping_address_title'));
sectionTitleDataAtTable.set(CHECKOUT_SECTIONS.SHIP_OPTIONS.name, Sephora.debug.dataAt('delivery_gift_options_title'));
sectionTitleDataAtTable.set(CHECKOUT_SECTIONS.SHIP_OPTIONS_REPLEN.name, Sephora.debug.dataAt('delivery_gift_options_title'));
sectionTitleDataAtTable.set(CHECKOUT_SECTIONS.GIFT_CARD_OPTIONS.name, Sephora.debug.dataAt('gc_delivery_message_title'));
sectionTitleDataAtTable.set(CHECKOUT_SECTIONS.DELIVER_TO.name, Sephora.debug.dataAt('deliver_to_title'));
sectionTitleDataAtTable.set(CHECKOUT_SECTIONS.GIFT_MESSAGE.name, Sephora.debug.dataAt('gift_message'));

const messageDataAtTable = new Map();
messageDataAtTable.set(CHECKOUT_SECTIONS.GIFT_CARD_ADDRESS.name, Sephora.debug.dataAt('gc_will_be_shipped'));

class CheckoutMain extends BaseClass {
    // need to have an isInitialized property inside of focus state, because it's used to prevent
    // children of accordion sections loading until component focus has been determined
    // by updateStatePerHistoryPathChange, so that there is no flicker of display section error state
    // to an actual section's contents
    constructor(props) {
        super(props);
        this.state = {
            focus: {
                isInitialized: false
            },
            orderDetails: {
                header: {}
            },
            isHalAvailable: false
        };
        this.sectionPath = '';
    }

    componentDidMount() {
        // Get if Canada user is eligible for Access Point.
        const { isCapEnabled, isRampupEnabled } = Sephora.configurationSettings;

        if (isCapEnabled && isRampupEnabled && localeUtils.isCanada()) {
            this.getCapElibility();
        }

        if (Sephora.configurationSettings.isChasePaymentEnabled) {
            loadChaseTokenizer();
        }

        Sephora.isDesktop() && sessionExtensionService.setExpiryTimer(this.props.requestCounter);
        smoothScroll.polyfill();
        store.setAndWatch('order.orderShippingMethods', this, null, true);
        store.setAndWatch('order.addressList', this, null, true);
        store.setAndWatch('order.isApplePayFlow', this, null, true);
        store.setAndWatch('klarna.isSelected', this, data => this.setState({ isKlarnaSelected: data.isSelected }));
        store.setAndWatch('afterpay.isSelected', this, data => this.setState({ isAfterpaySelected: data.isSelected }));
        store.setAndWatch('paze.isSelected', this, data => this.setState({ isPazeSelected: data.isSelected }));
        store.setAndWatch('venmo.isSelected', this, data => this.setState({ isVenmoSelected: data.isSelected }));
        /** @TODO: USE this place to keep klarna state in sync with Local Storage, for example:
         *
         const storedKlarnaData = Storage.local.getItem(LOCAL_STORAGE.KLARNA_DATA);
         store.dispatch(UtilActions.merge(
         'klarna',
         'isDisabled',
         storedKlarnaData && storedKlarnaData.isDisabled)
         );
         * Don't forget to clean up this storage variable on Checkout Init Success and on
         * Place Order Success
         */
        store.setAndWatch('order.bankRewardsValidPaymentsMessage', this, null, true);
        store.setAndWatch('order.paymentOptions', this, null, true);
        const orderDetails = store.getState().order.orderDetails;

        store.watchAction(SECTION_SAVED, action => {
            //if payment completeness has changed due to user checking play
            //terms and conditions we need to update this.state.isPaymentComplete
            if (!this.state.isPaymentComplete && action.isPaymentSectionComplete) {
                this.setState({ isPaymentComplete: action.isPaymentSectionComplete });
            }

            //need to update placeOrder button here since payment option has already been
            //chosen and user has now just checked terms and conditions and clicked
            //save and continue to move on (which should enable the subscribe button)
            checkoutUtils.disablePlaceOrderButtonBasedOnCheckoutCompleteness();

            if (Sephora.isAgent) {
                //If it is Sephora Mirror, independent of the agent role, when saving a Checkout section needs to open credit card section
                if (action.section !== `${CHECKOUT_PATH}/${CHECKOUT_SECTIONS.PAYMENT.path}`) {
                    Storage.session.setItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD, true);
                }
            }

            this.refreshCheckout({ isUpdateOrder: action.isUpdateOrder });
        });
        // after Url change this may update some extra order data and open new section
        store.setAndWatch('historyLocation', this, data => {
            this.setState({ currentPath: data.historyLocation.path });
            this.updateStatePerHistoryPathChange(data.historyLocation);
        });
        let prevPromotionDiscount = orderDetails?.priceInfo?.promotionDiscount;
        store.setAndWatch('order.orderDetails', this, order => {
            this.parseAndSetCheckoutState(order.orderDetails);

            const { promotionDiscount } = order.orderDetails.priceInfo;

            if (this.sectionPath === CHECKOUT_SECTIONS.PAYMENT.path && prevPromotionDiscount !== promotionDiscount) {
                prevPromotionDiscount = promotionDiscount;
            } else {
                checkoutUtils.disablePlaceOrderButtonBasedOnCheckoutCompleteness();
            }

            const tmpCardMessage = orderUtils.getTempSephoraCardMessage();

            if (!orderUtils.isKlarnaEnabledForThisOrder(order.orderDetails) && this.state.isKlarnaSelected) {
                store.dispatch(KlarnaActions.toggleSelect(false));
            }

            if (!orderUtils.isAfterpayEnabledForThisOrder(order.orderDetails) && this.state.isAfterpaySelected) {
                store.dispatch(AfterpayActions.toggleSelect(false));
            }

            if (!orderUtils.isPazeEnabledForThisOrder(order.orderDetails) && this.state.isPazeSelected) {
                store.dispatch(PazeActions.toggleSelect(false));
            }

            if (!orderUtils.isVenmoEnabledForThisOrder(order.orderDetails) && this.state.isVenmoSelected) {
                store.dispatch(VenmoActions.toggleSelect(false));
            }

            if (tmpCardMessage) {
                store.dispatch(
                    Actions.showInfoModal({
                        isOpen: true,
                        title: StringUtils.capitalize(tmpCardMessage.type),
                        message: tmpCardMessage.messages.join('. ')
                    })
                );
            }
        });

        store.setAndWatch('order', this, data => {
            const { isHalAvailable: prevIsHalAvailable } = this.state;

            const isHalAvailable = data?.order?.orderDetails?.header?.isHalAvailable;
            const isCAPAvailable = data?.order?.isCAPAvailable;
            const nextIsHalAvailable = orderUtils.isHalAvailable(isHalAvailable, isCAPAvailable);

            // isHalAvailable is going to be updated from false to true in the order
            // state and no the other way around
            if (nextIsHalAvailable && !prevIsHalAvailable) {
                this.setState({ isHalAvailable: nextIsHalAvailable });
            }
        });

        store.setAndWatch('klarna.error', this, data => {
            const { error } = data;

            if (error && error.errorMessage) {
                const { KLARNA_PAYMENT } = anaConsts.PAGE_DETAIL;
                error.fireAnalytics && checkoutUtils.fireFlexiblePaymentsAnalytics(error.errorMessage, KLARNA_PAYMENT);
                this.setState({ klarnaError: error.errorMessage });
            }
        });

        store.setAndWatch('afterpay.error', this, data => {
            const { error } = data;

            if (error && error.errorMessage) {
                const { AFTERPAY_PAYMENT } = anaConsts.PAGE_DETAIL;
                error.fireAnalytics && checkoutUtils.fireFlexiblePaymentsAnalytics(error.errorMessage, AFTERPAY_PAYMENT);
                this.setState({ afterpayError: error.errorMessage });
            }
        });

        checkoutUtils.changeCheckoutUrlBasedOnOrderCompleteness(
            this.state.isShipOptionsFirstTimeForNewUser,
            this.state.isGiftShipOptionsFirstTimeForNewUser,
            true
        );
        store.dispatch(OrderActions.orderReviewIsActive(orderDetails.header.isComplete));
        store.subscribe(
            watch(
                store.getState,
                'basket.appliedPromotions'
            )(() => {
                digitalData.page.attributes.tempProps.isAddOrRemovePromo = true;
                this.refreshCheckoutWithoutUrlChange();
            }),
            this
        );

        //Analytics
        Sephora.analytics.initialLoadDependencies.push(
            new Promise(resolve => {
                readyForAnalytics = resolve;
            })
        );

        checkoutBindings.watchForErrors();

        // After Checkout renders, we are ready to display loginLevelMessages
        // next time MNW component renders.
        Storage.local.removeItem(LOCAL_STORAGE.POSTPONE_LOGIN_PROFILE_WARNINGS);

        // Clear storage as a safety check before confirming Split EDD experience availability.
        Storage.local.removeItem(LOCAL_STORAGE.SPLIT_EDD_EXPERIENCE);
    }

    getCapElibility = () => {
        profileApi
            .getCapEligibility()
            .then(response => {
                store.dispatch(UtilActions.merge('order', 'isCAPAvailable', response.isCAPAvailable));
            })
            .catch(errorData => {
                ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
            });
    };

    componentDidUpdate(prevProps, prevState) {
        const initialFocusState = { isInitialized: false };

        function getFocusNodeName(state) {
            const focus = state?.focus ? state.focus : initialFocusState;

            //ignore isInitialized property because it's always set to true once the controller runs
            return Object.keys(focus).filter(key => key !== 'isInitialized' && state.focus[key] === true)[0];
        }

        const prevFocusNodeName = getFocusNodeName(prevState);
        const currentFocusNodeName = getFocusNodeName(this.state);

        if (prevFocusNodeName !== currentFocusNodeName) {
            const element = ReactDOM.findDOMNode(this[currentFocusNodeName]);

            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({
                        block: 'start',
                        behavior: 'smooth'
                    });
                }, 150);
            }
        }
    }

    parseAndSetCheckoutState = orderDetails => {
        this.setState(
            prevState => {
                const isNewUserFlow = prevState.isNewUserFlow || userUtils.isAnonymous();
                const newState = {
                    orderDetails: orderDetails,
                    isNewUserFlow: isNewUserFlow,
                    isShipOptionsFirstTimeForNewUser:
                        prevState.isShipOptionsFirstTimeForNewUser || (isNewUserFlow && !checkoutUtils.isShipAddressComplete()),
                    isGiftShipOptionsFirstTimeForNewUser:
                        prevState.isGiftShipOptionsFirstTimeForNewUser || (isNewUserFlow && !checkoutUtils.isGiftCardAddressComplete()),
                    isPaymentComplete: checkoutUtils.isPaymentSectionComplete(),

                    // for the scenario that shipping methods has a shipping restriction error
                    // (normally for hazmat item to excluded areas like HI or AL),
                    // therefore no shipping methods are returned
                    // in this case, disable the editing of shipping options
                    // TODO: if api response of errors ever changes, then this code needs to change
                    isEditShipOptionsDisabled: orderUtils.isShipmentRestriction(orderDetails) || !checkoutUtils.isShipAddressComplete(),
                    isGiftCardShipOptionsDisabled: !checkoutUtils.isGiftCardShipOptionsComplete()
                };

                // Flag zero dollar orders that requires CVV validation.
                // Once order is flagged as isZeroDollarOrderWithCVVValidation: true, this value won't change
                // unless page is reloaded and component's local state is wiped out.
                const isZeroCheckout = orderUtils.isZeroCheckout();

                if (isZeroCheckout) {
                    const isZeroDollarOrderWithCVVValidation = orderUtils.isZeroDollarOrderWithCVVValidation();

                    if (!prevState.isZeroDollarOrderWithCVVValidation && isZeroDollarOrderWithCVVValidation) {
                        newState.isZeroDollarOrderWithCVVValidation = true;
                    }
                }

                //set focus initialization to true so that content in accordions load if order is complete
                if (orderDetails.header.isComplete) {
                    newState.focus = Object.assign(prevState.focus, { isInitialized: true });
                    const { isBopisOrder } = orderDetails.header;

                    if (isBopisOrder) {
                        digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.BOPIS_CHECKOUT;
                    }

                    //We infer page name on place order accordion, so go ahead and fire analytics
                    readyForAnalytics();
                }

                return newState;
            },
            () => {
                //only fire performance event the once upon page render
                if (!this.pageRendered) {
                    //SOASTA Tracking
                    Sephora.Util.Perf.report('Page Rendered');
                    this.pageRendered = true;
                }
            }
        );
    };

    refreshCheckoutWithoutUrlChange = () => {
        this.refreshCheckout({ changeURL: false });
    };

    refreshCheckout = ({ isUpdateOrder = true, changeURL = true } = {}) => {
        let getOrderDetails;
        let updateShippingMethods = false;

        if (isUpdateOrder) {
            getOrderDetails = () => {
                return decorators
                    .withInterstice(
                        checkoutApi.getOrderDetails,
                        INTERSTICE_DELAY_MS
                    )(orderUtils.getOrderId())
                    .then(newOrderDetails => {
                        const isZeroCheckout = orderUtils.isZeroCheckout();
                        const isSDUOnlyOrder = orderUtils.isSDUOnlyOrder(newOrderDetails);
                        const hasRRC = orderUtils.hasRRC(newOrderDetails);
                        const { isBopisOrder } = newOrderDetails.header;

                        //UC-388 We do not have to update Shipping methods if the order belongs to any of these cases.
                        if ((!isZeroCheckout || (isZeroCheckout && hasRRC)) && !isBopisOrder) {
                            updateShippingMethods = true;
                        }

                        if (updateShippingMethods) {
                            const shippingGroupEntries = newOrderDetails.shippingGroups.shippingGroupsEntries;
                            let shippingGroup;

                            if (locationUtils.isCheckoutGiftCardShipping()) {
                                const physicalGiftCardShippingGroup = orderUtils.getPhysicalGiftCardShippingGroup(newOrderDetails);
                                shippingGroup = physicalGiftCardShippingGroup ?? shippingGroupEntries[0].shippingGroup;
                            } else {
                                shippingGroup = shippingGroupEntries[0].shippingGroup;
                            }

                            if (!isSDUOnlyOrder) {
                                this.getShippingMethods(newOrderDetails.header.orderId, shippingGroup.shippingGroupId);
                            }
                        }

                        store.dispatch(OrderActions.updateOrder(newOrderDetails));
                    });
            };
        } else {
            getOrderDetails = () => Promise.resolve();
        }

        getOrderDetails()
            .then(() => {
                if (changeURL) {
                    checkoutUtils.changeCheckoutUrlBasedOnOrderCompleteness(
                        this.state.isShipOptionsFirstTimeForNewUser,
                        this.state.isGiftShipOptionsFirstTimeForNewUser
                    );
                }
            })
            .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
    };

    changeRoute = checkoutPath => {
        const path = `${CHECKOUT_PATH}/${checkoutPath}`;
        store.dispatch(historyLocationActions.goTo({ path }));
        store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
    };

    checkSelectedPayment = ({ orderDetails, checkoutPath }) => {
        // keep Klarna selected in order to be able to restore the option
        // when user gets back to the Payment Section
        const isKlarnaSelected =
            orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.KLARNA) && this.isKlarnaEnabledForThisOrder(orderDetails);
        store.dispatch(KlarnaActions.toggleSelect(!!isKlarnaSelected));

        // keep Afterpay selected in order to be able to restore the option
        // when user gets back to the Payment Section
        const isAfterpaySelected =
            orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.AFTERPAY) && this.isAfterpayEnabledForThisOrder(orderDetails);
        store.dispatch(AfterpayActions.toggleSelect(!!isAfterpaySelected));

        // keep Paze selected in order to be able to restore the option
        // when user gets back to the Payment Section
        const isPazeSelected =
            orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.PAZE) && this.isPazeEnabledForThisOrder(orderDetails);
        store.dispatch(PazeActions.toggleSelect(!!isPazeSelected));

        // keep Venmo selected in order to be able to restore the option
        // when user gets back to the Payment Section
        const isVenmoSelected =
            orderUtils.getPaymentGroup(orderDetails, orderUtils.PAYMENT_GROUP_TYPE.VENMO) && this.isVenmoEnabledForThisOrder(orderDetails);
        store.dispatch(VenmoActions.toggleSelect(!!isVenmoSelected));

        const afterpayIsDefault = this.state.paymentOptions?.defaultPayment === 'afterpay';
        const klarnaIsDefault = this.state.paymentOptions?.defaultPayment === 'klarna';

        if (isAfterpaySelected && afterpayIsDefault && checkoutPath === 'checkout') {
            store.dispatch(AfterpayActions.setReady(true));
        }

        if (isKlarnaSelected && klarnaIsDefault && checkoutPath === 'checkout') {
            const errorMessage = authorizationGetText('authorizeErrorMessage', ['Klarna']);
            store.dispatch(KlarnaActions.backgroundInit(errorMessage));
        }

        if (isPazeSelected && checkoutPath === 'checkout') {
            store.dispatch(PazeActions.loadIframe(true));
            pazeUtils.initCheckoutWidget();
        }

        if (isVenmoSelected && checkoutPath === 'checkout') {
            Venmo.initializeVenmoCheckout();
        }
    };

    updateStatePerHistoryPathChange = router => {
        const callback = () => {
            const focus = {};
            const { orderDetails } = this.state;
            const checkoutPath = this.extractCheckoutPath(router.path);
            // make sure all accordions focus view states are set to false
            this.resetAccordionFocusState(focus);

            focus.isInitialized = true;

            // open the accordion focus state that is specific to the url
            this.updateAccordionFocusState({
                checkoutPath,
                focus
            });

            this.checkSelectedPayment({
                orderDetails,
                checkoutPath
            });

            store.dispatch(OrderActions.orderReviewIsActive(orderDetails.header.isComplete));

            // Analytics
            this.accordionAnalytics({
                orderDetails,
                checkoutPath
            });
        };

        this.sectionPath = this.extractCheckoutPath(router.path);
        // need for callback to happen either way on either fulfillment or rejection.
        // would prefer to use Promise.finally() but it's not well supported yet.
        this.updateOrderDetails(router).then(callback, callback);
    };

    updateAccordionFocusState = ({ checkoutPath, focus }) => {
        let { isShipOptionsFirstTimeForNewUser, isGiftShipOptionsFirstTimeForNewUser } = this.state;

        // open the accordion focus state that is specific to the url
        Object.keys(CHECKOUT_SECTIONS).forEach(section => {
            const sectionData = CHECKOUT_SECTIONS[section];

            // because api returns shipping options as complete whenever an address is
            // completed, when it's a new user entering their first time in the shipping
            // options section, change the state that is tracking that to false so that
            // it will not force open for any future address updates
            if (checkoutPath === sectionData.path && !(sectionData.path === CHECKOUT_SECTIONS.REVIEW.path)) {
                focus[sectionData.name] = true;

                if (checkoutPath === CHECKOUT_SECTIONS.SHIP_OPTIONS.path && this.state.isNewUserFlow) {
                    isShipOptionsFirstTimeForNewUser = false;
                } else if (checkoutPath === CHECKOUT_SECTIONS.GIFT_CARD_OPTIONS.path && this.state.isNewUserFlow) {
                    isGiftShipOptionsFirstTimeForNewUser = false;
                }
            }
        });

        this.setState({
            isShipOptionsFirstTimeForNewUser,
            isGiftShipOptionsFirstTimeForNewUser,
            focus
        });
    };

    isPazeEnabledForThisOrder = orderDetails => {
        return orderUtils.isPazeEnabledForThisOrder(orderDetails) && (!this.state.isNewUserFlow || checkoutUtils.isGuestOrder());
    };

    isVenmoEnabledForThisOrder = orderDetails => {
        return orderUtils.isVenmoEnabledForThisOrder(orderDetails) && (!this.state.isNewUserFlow || checkoutUtils.isGuestOrder());
    };

    extractCheckoutPath = path => {
        //regex to pick out the path name after the last '/'
        const pathRegex = /[^/?]+(?=\/$|$)/;

        return pathRegex.exec(path)[0];
    };

    resetAccordionFocusState = focus => {
        Object.keys(this.state.focus).forEach(name => (focus[name] = false));
        focus.isInitialized = true;
    };

    accordionAnalytics = ({ orderDetails, checkoutPath }) => {
        if (!digitalData.page.attributes.initialPageLoadDidOccur) {
            // Accordions are added to focus once they have been opened, so if there is only
            // one accordion in the focus object, it is the initial page load
            const { isBopisOrder } = orderDetails.header;

            // Bopis pagename for /checkout is set elsewhere and should not get overridden here
            !(isBopisOrder && (checkoutPath === 'checkout' || checkoutPath === 'null')) &&
                checkoutBindings.setPageName(this.state.focus, checkoutPath);
            checkoutBindings.setPageType();

            readyForAnalytics();
        } else if (digitalData.page.attributes.tempProps.isAddOrRemovePromo) {
            // Dont fire async page load call on checkout refresh after add/remove promo
            digitalData.page.attributes.tempProps.isAddOrRemovePromo = false;
        } else {
            checkoutBindings.processAsyncPageLoad(checkoutPath);
        }
    };

    isAutoUpdateShippingGroup = () => {
        const { order } = store.getState();

        return order && order.orderDetails.header.autoUpdateShippingGroup;
    };

    isAutoUpdateCreditCard = () => {
        const { order } = store.getState();

        return order && order.orderDetails.header.autoUpdateCreditCard;
    };

    getShippingMethods = (orderId, shippingGroupId) => {
        if (!isShippingRequestInProgress) {
            isShippingRequestInProgress = true;
            getShippingMethodPromise = checkoutApi
                .getAvailableShippingMethods(orderId, shippingGroupId)
                .then(shippingData => {
                    store.dispatch(OrderActions.updateShippingMethods(shippingData.shippingMethods, shippingGroupId));
                    isShippingRequestInProgress = false;
                })
                .catch(errorData => {
                    ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                    isShippingRequestInProgress = false;
                });
        }

        return getShippingMethodPromise;
    };

    updateOrderDetails = router => {
        const orderDetails = this.state.orderDetails?.isInitialized ? this.state.orderDetails : store.getState().order.orderDetails;
        const shouldCancelOrderUpdate =
            orderUtils.hasHalDraftAddress(orderDetails) && router.path === `${CHECKOUT_PATH}/${CHECKOUT_SECTIONS.SHIP_ADDRESS.path}`;

        if (shouldCancelOrderUpdate) {
            return Promise.resolve();
        }

        const getAddressList = (profileId, shipCountry) => {
            return checkoutApi
                .getAddressBook(profileId, shipCountry)
                .then(addressBook => {
                    store.dispatch(UtilActions.merge('order', 'addressList', addressBook.addressList));
                    store.dispatch(OrderActions.updateAddressListWithHalAddress());
                })
                .catch(errorData => {
                    ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                });
        };

        const getOrderPayments = orderId => {
            return checkoutApi
                .getCreditCards(orderId)
                .then(payments => {
                    store.dispatch(UtilActions.merge('order', 'paymentOptions', payments));
                })
                .catch(errorData => {
                    ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                });
        };

        const orderId = orderUtils.getOrderId();
        const orderDependenciesUpdates = [];

        //call shipping methods anytime there is a shipmentRestriction error to trigger error modal
        const shouldOrderShippingMethodsUpdate =
            router.prevPath === `${CHECKOUT_PATH}/${CHECKOUT_SECTIONS.SHIP_ADDRESS.path}` || orderUtils.isShipmentRestriction(orderDetails);

        if (shouldOrderShippingMethodsUpdate) {
            const hasSDDItems = orderUtils.hasSameDayDeliveryItems(orderDetails);
            const hasSDUOnlyInSddBasket = orderUtils.hasSDUOnlyInSddBasket(orderDetails);
            const hasStandardDeliveryItems = orderUtils.hasStandardDeliveryItems(orderDetails);

            if (hasSDDItems && !hasSDUOnlyInSddBasket) {
                const shippingGroupId = orderUtils.getSameDayShippingGroup(orderDetails).shippingGroupId;
                orderDependenciesUpdates.push(() => this.getShippingMethods(orderId, shippingGroupId));
            }

            if (hasStandardDeliveryItems) {
                const shippingGroupId = orderUtils.getHardGoodShippingGroup(orderDetails).shippingGroupId;
                orderDependenciesUpdates.push(() => this.getShippingMethods(orderId, shippingGroupId));
            }
        }

        const shouldOrderGiftCardShippingMethodsUpdate = router.prevPath === `${CHECKOUT_PATH}/${CHECKOUT_SECTIONS.GIFT_CARD_ADDRESS.path}`;

        if (shouldOrderGiftCardShippingMethodsUpdate) {
            const shippingGroupId = orderUtils.getPhysicalGiftCardShippingGroup(orderDetails).shippingGroupId;
            orderDependenciesUpdates.push(() => this.getShippingMethods(orderId, shippingGroupId));
        }

        // if existing user has valid profile addresses and is on shipping address accordion
        // make api call to get users addresses for current shipping country and
        // update the store with the addressList returned from the api call
        const shouldOrderAddressBookUpdate =
            router.path === `${CHECKOUT_PATH}/${CHECKOUT_SECTIONS.SHIP_ADDRESS.path}` ||
            router.path === `${CHECKOUT_PATH}/${CHECKOUT_SECTIONS.GIFT_CARD_ADDRESS.path}`;

        if (!userUtils.isAnonymous() && shouldOrderAddressBookUpdate) {
            const profileId = userUtils.getProfileId();
            const shipCountry = userUtils.getShippingCountry().countryCode;
            orderDependenciesUpdates.push(() => getAddressList(profileId, shipCountry));
        }

        // if existing user is on payments accordion make api call to get users saved
        // credit cards and other payment options.
        // update the store with the payment options returned from the api call
        const shouldOrderCreditCardsUpdate = router.path === `${CHECKOUT_PATH}/${CHECKOUT_SECTIONS.PAYMENT.path}`;

        if (shouldOrderCreditCardsUpdate) {
            const { isKlarnaPaymentEnabled, afterpayEnabled } = Sephora.configurationSettings;
            orderDependenciesUpdates.push(() => getOrderPayments(orderId));

            if (isKlarnaPaymentEnabled && this.isKlarnaEnabledForThisOrder(orderDetails)) {
                klarnaUtils.loadLibrary();
            }

            if (afterpayEnabled && this.isAfterpayEnabledForThisOrder(orderDetails)) {
                afterpayUtils.loadLibrary();
            }
        }

        return new Promise(resolve => {
            let i = -1;
            const makeNextDependencyCall = () => {
                i++;

                if (i >= orderDependenciesUpdates.length) {
                    resolve();
                } else {
                    orderDependenciesUpdates[i]().then(makeNextDependencyCall).catch(makeNextDependencyCall);
                }
            };
            makeNextDependencyCall();
        });
    };

    /* Klarna option is enabled if isKlarnaCheckoutEnabled flag is true for existing and guest users only  */
    isKlarnaEnabledForThisOrder = orderDetails => {
        return (
            orderUtils.isKlarnaEnabledForThisOrder(orderDetails) &&
            !this.state.klarnaError &&
            (!this.state.isNewUserFlow || checkoutUtils.isGuestOrder())
        );
    };

    /* Afterpay option is enabled if isAfterpayCheckoutEnabled flag is true for existing and guest users only  */
    isAfterpayEnabledForThisOrder = orderDetails => {
        return orderUtils.isAfterpayEnabledForThisOrder(orderDetails) && (!this.state.isNewUserFlow || checkoutUtils.isGuestOrder());
    };

    setAccessPoint = accessPoint => {
        const { orderDetails } = this.state;
        const shippingGroupId = orderUtils.getHardGoodShippingGroup(orderDetails).shippingGroupId;

        const address = {
            addressType: orderUtils.SHIPPING_METHOD_TYPES.HAL,
            address1: accessPoint?.addressLine1,
            city: accessPoint?.city,
            state: accessPoint?.state,
            postalCode: accessPoint?.zipCode,
            country: accessPoint?.country,
            altPickLocationID: accessPoint?.locationId,
            altPickLocationType: accessPoint?.pickupLocationType,
            altPickLocationPartner: accessPoint?.carrierFixed,
            altLocationPhone: accessPoint?.phoneNumber,
            halCompany: accessPoint?.companyName
        };

        const halOperatingHours = accessPoint?.operatingHours;

        store.dispatch(OrderActions.createDraftHalAddress(address, shippingGroupId, halOperatingHours)).then(() => {
            this.changeRoute(CHECKOUT_SECTIONS.SHIP_ADDRESS.path);
        });
    };

    resetAccessPoint = () => {
        store.dispatch(OrderActions.removeHalAddress());
        store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/locales', 'CheckoutMain');
        const isDesktop = Sephora.isDesktop();
        const isMobile = Sephora.isMobile();
        const isGuestCheckout = checkoutUtils.isGuestOrder();

        const { countryFlagImage } = userUtils.getShippingCountry();
        const isCanada = localeUtils.isCanada();

        const isBopis = this.state?.orderDetails?.header?.isBopisOrder;
        const isRopis = this.state?.orderDetails?.header?.isRopisOrder;
        const isInitialized = this.state?.orderDetails?.isInitialized;
        const isPromoCaptchaEnabled = Sephora.configurationSettings.captchaApplyPromotionEnabled;
        const isAutoReplenishBasket = orderUtils.hasAutoReplenishItems(this.state?.orderDetails);
        const isCMSCheckoutConfirmationEnabled = Sephora.configurationSettings.isCMSCheckoutConfirmationEnabled;

        return (
            <div css={styles.wrap}>
                <header css={styles.head}>
                    <Logo />
                </header>
                <main css={styles.body}>
                    {isGuestCheckout && isMobile && (
                        <OrderSummary
                            isMobileGuest={true}
                            isBopis={isBopis}
                            isRopis={isRopis}
                        />
                    )}
                    <LegacyContainer>
                        {(this.props.regions || this.props.data?.contentZone?.length > 0) && (
                            <Box paddingTop={5}>
                                {isCMSCheckoutConfirmationEnabled ? (
                                    <ComponentList
                                        items={this.props.data?.contentZone}
                                        context={CONTEXTS.CONTAINER}
                                        removeLastItemMargin={true}
                                        removeFirstItemMargin={true}
                                    />
                                ) : (
                                    <BccComponentList items={this.props.regions.left} />
                                )}
                            </Box>
                        )}
                        <LegacyGrid gutter={isDesktop && 7}>
                            <LegacyGrid.Cell width={isDesktop && 'fill'}>
                                <Flex
                                    alignItems='center'
                                    data-at={Sephora.debug.dataAt('checkout_country_flag')}
                                    paddingY={5}
                                >
                                    <Text
                                        is='h1'
                                        fontFamily='serif'
                                        lineHeight='none'
                                        fontSize={isMobile ? 'xl' : '2xl'}
                                    >
                                        {getText(isBopis ? 'pickupOrderCheckout' : 'checkout')}
                                    </Text>

                                    {isCanada && countryFlagImage && (
                                        <Image
                                            src={countryFlagImage}
                                            marginLeft={3}
                                            height={32}
                                            width={48}
                                        />
                                    )}
                                </Flex>
                                {isInitialized && this.getCheckoutAccordion(isBopis)}
                            </LegacyGrid.Cell>
                            {!(isGuestCheckout && isMobile) && (
                                <LegacyGrid.Cell
                                    paddingTop={isDesktop && 5}
                                    display={isDesktop && 'flex'}
                                    width={isDesktop && 'fit'}
                                >
                                    {isDesktop || <SectionDivider marginTop={null} />}
                                    <div
                                        css={
                                            isDesktop && {
                                                width: 295,
                                                position: 'relative'
                                            }
                                        }
                                    >
                                        <OrderSummary
                                            isBopis={isBopis}
                                            isAutoReplenishBasket={isAutoReplenishBasket}
                                        />
                                    </div>
                                </LegacyGrid.Cell>
                            )}
                        </LegacyGrid>
                        <span
                            id='paypal-container'
                            style={{ display: 'none' }}
                        />
                        {isPromoCaptchaEnabled && <ReCaptchaText marginTop={isMobile ? 6 : 5} />}
                    </LegacyContainer>
                </main>
                <CompactFooter />
            </div>
        );
    }

    getCheckoutAccordion = (isNumbered = true) => {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/AccordionSection/locales', 'AccordionSection');
        const orderHasReplen = orderUtils.hasAutoReplenishItems(this.state?.orderDetails);
        const hasSDUInBasket = orderUtils.hasSDUInBasket(this.state?.orderDetails);
        const allItemsAreReplen = orderUtils.allItemsInBasketAreReplen(this.state?.orderDetails);
        const isBasketSddAndReplen = orderUtils.hasSameDayDeliveryItems(this.state.orderDetails) && orderHasReplen;
        const creditCardRequiredMessage =
            this.state?.orderDetails?.paymentGroups?.paymentMessages?.[0] &&
            this.state?.orderDetails?.paymentGroups?.paymentMessages?.[0].messages?.[0];
        const creditCardMessageTypeError =
            this.state?.orderDetails?.paymentGroups?.paymentMessages?.[0] &&
            this.state?.orderDetails?.paymentGroups?.paymentMessages?.[0].type === 'error';
        const accordionSectionsData = this.checkoutAccordionConfiguration(
            this.state.orderDetails,
            this.state.isNewUserFlow,
            orderHasReplen,
            allItemsAreReplen
        );

        // set the disabled flag to false. inside of map callback, once it hits the section that is
        // in focus afterwards it will switch to being true, therefore disabling the section.
        let disabledFlag = false;
        let sectionCount = 1;
        const isMobile = Sephora.isMobile();
        const isGuestCheckout = checkoutUtils.isGuestOrder();
        const payPalPaymentGroup = orderUtils.getPayPalPaymentGroup(this.state.orderDetails);

        const isOrderComplete = this.state.orderDetails.header.isComplete;
        let errorDueToPreviousSectionError = false;
        const isAutoUpdateCreditCard = this.isAutoUpdateCreditCard();
        const isBopisOrder = this.state.orderDetails?.header?.isBopisOrder;
        const isZeroDollarOrderWithCVVValidation = this.state.isZeroDollarOrderWithCVVValidation;
        const middleZone = this.props?.data?.middleZone;

        return accordionSectionsData.map((section, index) => {
            const isDisabled = this.state.isNewUserFlow && disabledFlag;

            switch (section) {
                // case 'deliverToSection':
                case 'sddSection': {
                    return (
                        <SddSection
                            isDisabled={isDisabled}
                            isError={errorDueToPreviousSectionError}
                            key={section}
                        />
                    );
                }
                case 'standardSection': {
                    return (
                        <StandardSection
                            isDisabled={isDisabled}
                            isError={errorDueToPreviousSectionError}
                            key={section}
                            isBasketSddAndReplen={isBasketSddAndReplen}
                            hasSDUInBasket={hasSDUInBasket}
                            isMobile={isMobile}
                            middleZone={middleZone}
                        />
                    );
                }
                default: {
                    const { title, name, path, isError, note, infoButton } = section;

                    const accordionTitle = isNumbered ? `${sectionCount}. ${getText(title)}` : getText(title);
                    const displayNoteAutoReplenish = isBasketSddAndReplen && name === DELIVER_TO.name;

                    let accordionTitleComp = accordionTitle;

                    if (infoButton) {
                        accordionTitleComp = (
                            <>
                                {accordionTitle} {infoButton}
                            </>
                        );
                    }

                    const accordionNote = note ? getText(note) : null;

                    let accordionSection;
                    // account creation can't be edited, so no edit callback
                    // ship options cannot be edited when there is shipping options api error - user needs to update address

                    let editCallback =
                        !this.state.focus[name] &&
                        name !== ACCOUNT.name &&
                        name !== GIFT_MESSAGE.name &&
                        !(name === SHIP_OPTIONS.name && this.state.isEditShipOptionsDisabled) &&
                        !(name === GIFT_CARD_OPTIONS.name && this.state.isGiftCardShipOptionsDisabled) &&
                        this.changeRoute.bind(this, path);

                    const shouldShowUpdatedBadge = name === PAYMENT.name && isAutoUpdateCreditCard;

                    if (!this.state.isNewUserFlow && this.state.isApplePayFlow && [SHIP_ADDRESS.name, SHIP_OPTIONS.name].indexOf(name) !== -1) {
                        editCallback = null;
                    }

                    if (isBopisOrder && name !== PAYMENT.name) {
                        editCallback = null;
                    }

                    let shouldAccordionBeOpenInMobileView = this.state.focus[name] || isOrderComplete || isError;

                    // The Shipping & Delivery options should be collapsed when its a Guest checkout
                    // with Paypal payment mode for mobile view.
                    if (isOrderComplete && isGuestCheckout && payPalPaymentGroup !== null && !this.state.focus[name]) {
                        shouldAccordionBeOpenInMobileView = false;
                    }

                    const hasHalAddress = orderUtils.hasHalAddress(this.state.orderDetails);

                    // Accordion must be open for BOPIS orders no matter what
                    // in order to display Pickup Location and Pickup Person
                    // if is HAL(Fedex Location) also!
                    if (isBopisOrder || hasHalAddress) {
                        shouldAccordionBeOpenInMobileView = true;
                    }

                    // Accordion Sections names that MUST always be open
                    // and they MUST be visible always.
                    if (name === GIFT_MESSAGE.name) {
                        shouldAccordionBeOpenInMobileView = true;
                    }

                    const isOpen = isMobile ? shouldAccordionBeOpenInMobileView : true;
                    const shouldShowSkeleton = isOpen && this.state.currentPath === `${CHECKOUT_PATH}/${path}`;

                    if (name !== REVIEW.name) {
                        accordionSection = (
                            <AccordionSection
                                ref={comp => (this[name] = comp)}
                                key={accordionTitle + index}
                                index={index}
                                dataAt={title}
                                dataAtSectionTitle={sectionTitleDataAtTable.get(name)}
                                dataAtMessage={messageDataAtTable.get(name)}
                                title={accordionTitleComp}
                                note={displayNoteAutoReplenish ? getText('deliverToNoteAutoReplenish') : accordionNote}
                                isOpen={isOpen}
                                shouldShowSkeleton={shouldShowSkeleton}
                                name={name}
                                isDisabled={isDisabled}
                                editCallback={editCallback}
                                message={section.components.message}
                                isError={this.state.focus.isInitialized && ((!this.state.focus[name] && isError) || errorDueToPreviousSectionError)}
                                children={
                                    this.state.focus.isInitialized && (this.state.focus[name] ? section.components.focus : section.components.unfocus)
                                }
                                isBopis={isBopisOrder}
                                orderHasReplen={orderHasReplen}
                                hasSDUInBasket={hasSDUInBasket}
                                shouldShowUpdatedBadge={shouldShowUpdatedBadge}
                                creditCardRequiredMessage={creditCardRequiredMessage}
                                creditCardMessageTypeError={creditCardMessageTypeError}
                                showCheckoutFreeReturnsCopy={this.state.showCheckoutFreeReturnsCopy}
                            />
                        );
                    } else {
                        accordionSection = (
                            <AccordionSection
                                key={accordionTitle + index}
                                index={index}
                                dataAt={title}
                                title={accordionTitleComp}
                                isOpen={isMobile ? isOrderComplete || isZeroDollarOrderWithCVVValidation : true}
                                isDisabled={isDisabled}
                                isError={errorDueToPreviousSectionError}
                                orderHasReplen={orderHasReplen}
                                hasSDUInBasket={hasSDUInBasket}
                                children={section.component}
                            />
                        );
                    }

                    if (errorDueToPreviousSectionError) {
                        errorDueToPreviousSectionError = false;
                    }

                    if (this.state.focus.isInitialized && isError && !this.state.focus[name]) {
                        errorDueToPreviousSectionError = true;
                    }

                    sectionCount += 1;

                    if (this.state.focus[name]) {
                        disabledFlag = true;
                    }

                    return accordionSection;
                }
            }
        });
    };

    canCheckoutPaze = () => {
        return Storage.local.getItem(LOCAL_STORAGE.CAN_CHECKOUT_PAZE) === true;
    };

    getPaymentName = () => {
        let paymentName = null;

        switch (true) {
            case this.state.isKlarnaSelected:
                paymentName = 'payWithKlarna';

                break;
            case this.state.isAfterpaySelected:
                paymentName = 'payWithAfterpay';

                break;
            case this.state.isPazeSelected:
                paymentName = this.canCheckoutPaze() ? 'payWithPaze' : null;

                break;
            case this.state.isVenmoSelected:
                paymentName = 'payWithVenmo';

                break;
            default:
                paymentName = null;

                break;
        }

        return paymentName;
    };

    // most of the below logic comes from mobile-web
    // mobile-web/public/js/app/components/checkout/SectionsConfig.js
    /* takes the order details and configs the data that will populate accordion sections
     ** in specific order
     ** @params: orderDetails object
     ** @params: isNewUserFlow boolean
     ** @returns: an array of objects with section data
     */
    checkoutAccordionConfiguration = (orderDetails, isNewUserFlow = false, orderHasReplen = false, allItemsAreReplen = false) => {
        if (orderUtils.hasSameDayDeliveryItems(orderDetails)) {
            return this.getSddAccordionConfiguration(orderDetails);
        }

        const getText = localeUtils.getLocaleResourceFile('components/Checkout/locales', 'CheckoutMain');
        const sectionsData = [];
        const isZeroCheckout = orderUtils.isZeroCheckout();
        const isCBRPromoAppliedInBasket = basketUtils.isCBRPromoAppliedInBasket();
        const isBopisOrder = this.state.orderDetails?.header?.isBopisOrder;
        const showAddMessageLink = this.state.orderDetails?.header?.digitalGiftMessagingStatus !== GIFT_MESSAGE_STATUS.NOT_AVAILABLE;
        const physicalGiftCardShippingGroup = orderUtils.getPhysicalGiftCardShippingGroup(orderDetails);
        const shippingMethods = this.state.orderShippingMethods;
        const isGuestCheckout = checkoutUtils.isGuestOrder();
        const allowUpdatedShippingCalculationsMsg = orderUtils.allowUpdatedShippingCalculationsMsg(orderDetails);
        const isZeroDollarOrderWithCVVValidation = this.state.isZeroDollarOrderWithCVVValidation;

        const isHalAvailable = this.state.isHalAvailable;
        const pickupMethodId = orderDetails?.pickup?.pickupMethods?.filter(method => method?.isSelected)[0]?.pickupMethodId;

        const hasSignInForFreeShipMessage =
            isGuestCheckout && orderDetails?.items?.basketLevelMessages?.some(message => message.messageContext === 'basket.amountToFreeShipping');

        const userEmail = orderDetails?.header?.guestProfile?.email;
        const isMobile = Sephora.isMobile();
        const hasRRC = orderUtils.hasRRC(orderDetails);

        const middleZone = this.props?.data?.middleZone;

        if (isBopisOrder) {
            const pickUpOrderLocationData = Object.assign({}, CHECKOUT_SECTIONS.PICKUP_ORDER_LOCATION_INFO);
            pickUpOrderLocationData.components = {
                focus: (
                    <PickUpOrderLocation
                        pickupMethodId={pickupMethodId}
                        storeDetails={this.state.orderDetails.pickup.storeDetails}
                        pickupOrderHoldDaysMessage={this.state.orderDetails.pickup.pickupOrderHoldDaysMessage}
                    />
                ),
                unfocus: (
                    <PickUpOrderLocation
                        pickupMethodId={pickupMethodId}
                        storeDetails={this.state.orderDetails.pickup.storeDetails}
                        pickupOrderHoldDaysMessage={this.state.orderDetails.pickup.pickupOrderHoldDaysMessage}
                    />
                )
            };
            sectionsData.push(pickUpOrderLocationData);

            const pickUpOrderContactInfoData = Object.assign({}, CHECKOUT_SECTIONS.PICKUP_ORDER_CONTACT_INFO);
            pickUpOrderContactInfoData.components = {
                focus: (
                    <PickUpOrderContactInfo
                        email={this.state.orderDetails.pickup.email}
                        firstname={this.state.orderDetails.pickup.firstname}
                        lastName={this.state.orderDetails.pickup.lastName}
                        pickupOrderNotifyWithinMessage={this.state.orderDetails.pickup.pickupOrderNotifyWithinMessage}
                        orderId={orderDetails?.header?.orderId}
                        altPickupPersonDetails={this.state.orderDetails.pickup.altPickupPersonDetails}
                        isAltPickupPersonEnabled={orderDetails?.header?.isAltPickupPersonEnabled}
                    />
                ),
                unfocus: (
                    <PickUpOrderContactInfo
                        email={this.state.orderDetails.pickup.email}
                        firstname={this.state.orderDetails.pickup.firstname}
                        lastName={this.state.orderDetails.pickup.lastName}
                        pickupOrderNotifyWithinMessage={this.state.orderDetails.pickup.pickupOrderNotifyWithinMessage}
                        orderId={orderDetails?.header?.orderId}
                        altPickupPersonDetails={this.state.orderDetails.pickup.altPickupPersonDetails}
                        isAltPickupPersonEnabled={orderDetails?.header?.isAltPickupPersonEnabled}
                    />
                )
            };
            sectionsData.push(pickUpOrderContactInfoData);
        }

        if (!isBopisOrder && physicalGiftCardShippingGroup) {
            const giftCardAddressData = Object.assign({}, CHECKOUT_SECTIONS.GIFT_CARD_ADDRESS);
            giftCardAddressData.components = {
                focus: (
                    <ShipAddressSection
                        isNewUserFlow={this.state.isNewUserFlow}
                        shippingAddress={physicalGiftCardShippingGroup.address}
                        profileAddresses={this.state.addressList}
                        shippingGroupId={physicalGiftCardShippingGroup.shippingGroupId}
                        isGiftCardAddress={true}
                        isGuestCheckout={isGuestCheckout}
                        openAddressForm={false}
                        isComplete={physicalGiftCardShippingGroup.isComplete}
                        isHalAvailable={isHalAvailable}
                    />
                ),
                unfocus: (
                    <ShipAddressDisplay
                        address={physicalGiftCardShippingGroup.address}
                        isComplete={physicalGiftCardShippingGroup.isComplete}
                        isHalAvailable={isHalAvailable}
                        hasRRC={hasRRC}
                    />
                ),
                message: getText('yourGiftCardShippedToAddressMessage')
            };
            giftCardAddressData.isError = !physicalGiftCardShippingGroup.isComplete;
            sectionsData.push(giftCardAddressData);

            const giftCardOptionsData = Object.assign({}, CHECKOUT_SECTIONS.GIFT_CARD_OPTIONS);
            giftCardOptionsData.components = {
                focus: (
                    <GiftCardShipOptionsForm
                        allowUpdatedShippingCalculationsMsg={allowUpdatedShippingCalculationsMsg}
                        shippingMethods={shippingMethods[physicalGiftCardShippingGroup.shippingGroupId]}
                        shippingGroup={physicalGiftCardShippingGroup}
                        isPhysicalGiftCard
                    />
                ),
                unfocus: (
                    <ShipOptionsDisplay
                        shippingMethod={physicalGiftCardShippingGroup.shippingMethod}
                        giftMessage={physicalGiftCardShippingGroup.giftMessage}
                        shippingGroup={physicalGiftCardShippingGroup}
                        shippingGroupType={SHIPPING_GROUPS.GIFT}
                        isPhysicalGiftCard
                    />
                )
            };
            giftCardOptionsData.isError = !physicalGiftCardShippingGroup.shippingMethod.isComplete;
            sectionsData.push(giftCardOptionsData);
        }

        const hardGoodShippingGroup = orderUtils.getHardGoodShippingGroup(orderDetails);
        const isShippableOrder = orderUtils.isShippableOrder(orderDetails);
        const hasHalAddress = orderUtils.hasHalAddress(orderDetails);
        const hasAutoReplenishment = orderUtils.hasAutoReplenishItems(orderDetails);
        const isCanada = this.state.orderDetails?.header?.orderLocale === 'CA';

        if (!isBopisOrder && hardGoodShippingGroup) {
            const shipAddressData = Object.assign({}, CHECKOUT_SECTIONS.SHIP_ADDRESS);
            const isComplete = hasHalAddress
                ? hardGoodShippingGroup.isComplete && !hardGoodShippingGroup?.address?.isDraft
                : hardGoodShippingGroup.isComplete;
            const shouldRenderShipToAccessPoint = !isZeroCheckout && hasHalAddress;

            if (isZeroCheckout && !hasRRC) {
                shipAddressData.title = 'shippingDelivery';
            }

            if (shouldRenderShipToAccessPoint) {
                shipAddressData.title = isCanada ? 'shipToPickupLocation' : 'shippingToFedex';
                shipAddressData.infoButton = (
                    <AccessPointButton
                        display='inline-block'
                        variant='iconOnly'
                    />
                );
                shipAddressData.components = {
                    focus: (
                        <ShipToAccessPoint
                            editMode
                            isGuestCheckout={isGuestCheckout}
                            shippingGroupId={hardGoodShippingGroup.shippingGroupId}
                            shippingAddress={hardGoodShippingGroup.address}
                            setAccessPoint={this.setAccessPoint}
                            resetAccessPoint={this.resetAccessPoint}
                            isCanada={isCanada}
                        />
                    ),
                    unfocus: (
                        <ShipToAccessPoint
                            isComplete={isComplete}
                            isGuestCheckout={isGuestCheckout}
                            shippingAddress={hardGoodShippingGroup.address}
                            setAccessPoint={this.setAccessPoint}
                            resetAccessPoint={this.resetAccessPoint}
                            isCanada={isCanada}
                        />
                    )
                };
            } else {
                shipAddressData.components = {
                    focus: (
                        <ShipAddressSection
                            isNewUserFlow={this.state.isNewUserFlow}
                            shippingAddress={hardGoodShippingGroup.address}
                            profileAddresses={this.state.addressList}
                            shippingGroupId={hardGoodShippingGroup.shippingGroupId}
                            isComplete={hardGoodShippingGroup.isComplete}
                            orderHasPhysicalGiftCard={!!physicalGiftCardShippingGroup}
                            isZeroCheckout={isZeroCheckout}
                            isGuestCheckout={isGuestCheckout}
                            shippingMethod={hardGoodShippingGroup.shippingMethod}
                            setAccessPoint={this.setAccessPoint}
                            isHalAvailable={isHalAvailable}
                            showTaxExemptAddress
                        />
                    ),
                    unfocus: (
                        <ShipAddressDisplay
                            address={hardGoodShippingGroup.address}
                            isZeroCheckout={isZeroCheckout}
                            shippingMethod={hardGoodShippingGroup.shippingMethod}
                            isComplete={hardGoodShippingGroup.isComplete}
                            setAccessPoint={this.setAccessPoint}
                            isHalAvailable={isHalAvailable}
                            hasRRC={hasRRC}
                        />
                    )
                };
            }

            if (physicalGiftCardShippingGroup) {
                shipAddressData.components.message = getText('shippedToAddressMessage');
            }

            shipAddressData.isError = !isComplete;
            sectionsData.push(shipAddressData);

            if (!isZeroCheckout || (isZeroCheckout && orderUtils.hasRRC(orderDetails)) || hasAutoReplenishment) {
                const shipOptionsData = Object.assign({}, orderHasReplen ? CHECKOUT_SECTIONS.SHIP_OPTIONS_REPLEN : CHECKOUT_SECTIONS.SHIP_OPTIONS);
                shipOptionsData.components = {
                    focus: (
                        <ShipOptionsForm
                            orderHasReplen={orderHasReplen}
                            allowUpdatedShippingCalculationsMsg={allowUpdatedShippingCalculationsMsg}
                            shippingMethods={shippingMethods[hardGoodShippingGroup.shippingGroupId]}
                            isGuestCheckout={isGuestCheckout}
                            shippingGroup={hardGoodShippingGroup}
                            middleZone={middleZone}
                        />
                    ),
                    unfocus: (
                        <ShipOptionsDisplay
                            allItemsAreReplen={allItemsAreReplen}
                            orderHasReplen={orderHasReplen}
                            shippingMethod={hardGoodShippingGroup.shippingMethod}
                            hasSignInForFreeShipMessage={hasSignInForFreeShipMessage}
                            userEmail={userEmail}
                            shippingGroup={hardGoodShippingGroup}
                            middleZone={middleZone}
                        />
                    )
                };
                shipOptionsData.isError = !hardGoodShippingGroup.shippingMethod.isComplete;
                sectionsData.push(shipOptionsData);
            }
        }

        if (showAddMessageLink) {
            const giftMessageData = Object.assign({}, CHECKOUT_SECTIONS.GIFT_MESSAGE);
            giftMessageData.components = {
                focus,
                unfocus: (
                    <AddGiftMessage
                        isCheckout={true}
                        isMobile={isMobile}
                        orderId={orderDetails?.header?.orderId}
                        giftMessagingStatus={orderDetails?.header?.digitalGiftMessagingStatus}
                    />
                )
            };
            sectionsData.push(giftMessageData);
        }

        // 1. For orders where user must accept T&C located in the payment section
        // therefore payment section should be shown even if orderTotal is zero
        // 2. If isZeroCheckout and has RRC promo applied then show payments section.
        if (
            !isZeroCheckout ||
            (isZeroCheckout && orderUtils.hasRRC(orderDetails)) ||
            (isZeroCheckout && orderUtils.hasCCR(orderDetails)) ||
            isCBRPromoAppliedInBasket ||
            hasAutoReplenishment ||
            isZeroDollarOrderWithCVVValidation
        ) {
            const creditCardPaymentGroup = orderUtils.getCreditCardPaymentGroup(orderDetails) || { isComplete: false };
            const payPalPaymentGroup = orderUtils.getPayPalPaymentGroup(orderDetails) || { isComplete: false };
            const giftCardPaymentGroups = orderUtils.getGiftCardPaymentGroups(orderDetails);
            const storeCredits = orderUtils.getStoreCredits(orderDetails);
            const isPayPalEnabled = orderUtils.isPayPalEnabled(orderDetails);
            const isKlarnaEnabledForThisOrder = this.isKlarnaEnabledForThisOrder(orderDetails);
            const isAfterpayEnabledForThisOrder = this.isAfterpayEnabledForThisOrder(orderDetails);
            const isPazeEnabledForThisOrder = this.isPazeEnabledForThisOrder(orderDetails);
            const isVenmoEnabledForThisOrder = this.isVenmoEnabledForThisOrder(orderDetails);
            const isAfterpayEnabledForThisProfile = checkoutUtils.isAfterpayEnabledForThisProfile(orderDetails);
            const isSddOrder = orderUtils.hasSameDayDeliveryItems(orderDetails);
            // check to see if there is only a physical gift card in the order, as gift card in payments
            // should be hidden if that's the case
            const isPhysicalGiftCardOnly = physicalGiftCardShippingGroup && !hardGoodShippingGroup;
            const shouldRenderGiftCardSection = !isPhysicalGiftCardOnly && !isZeroCheckout;
            // TODO 17.8: figure out how to tell if isPayPalEnabled
            // let paymentLable =isPayPalPaymentEnabled() ?
            //         '(Credit Card, PayPal, Gift Card)' :
            //         '(Credit Card, Gift Card)';
            // TODO 18.1: implement play check
            // title: 'Payment method',
            // subTitle: paymentLabel,
            const paymentData = Object.assign({}, CHECKOUT_SECTIONS.PAYMENT);
            const PaymentSectionComp = this.state.isNewUserFlow ? PaymentSectionNewUser : PaymentSectionExistingUser;

            const hasAutoReplenishItemInBasket = orderUtils.hasAutoReplenishItems(orderDetails);
            const paymentName = this.getPaymentName();
            const amount = orderDetails?.priceInfo?.creditCardAmount || orderDetails?.priceInfo?.paypalAmount;
            const [installmentValue] = skuHelpers.formatInstallmentValue(amount);
            const orderItems = orderDetails?.items;
            const checkoutEnabled = this.state.isKlarnaSelected
                ? orderItems?.isKlarnaCheckoutEnabled
                : this.state.isAfterpaySelected
                    ? orderItems?.isAfterpayCheckoutEnabled
                    : false;
            const paymentCreditCardPaymentGroup = creditCardPaymentGroup.isComplete && creditCardPaymentGroup;
            const paymentShippingAddress =
                (hardGoodShippingGroup && hardGoodShippingGroup.address) || (physicalGiftCardShippingGroup && physicalGiftCardShippingGroup.address);

            paymentData.components = {
                focus: (
                    <PaymentSectionComp
                        isZeroCheckout={isZeroCheckout}
                        defaultPayment={this.state.paymentOptions.defaultPayment}
                        creditCardOptions={this.state.paymentOptions.creditCards}
                        paypalOption={this.state.paymentOptions.paypal}
                        isGiftCardShow={shouldRenderGiftCardSection}
                        isPhysicalGiftCardOnly={isPhysicalGiftCardOnly}
                        creditCardPaymentGroup={paymentCreditCardPaymentGroup}
                        isPayPalEnabled={isPayPalEnabled}
                        isPayPalSelected={payPalPaymentGroup.isComplete}
                        isKlarnaEnabledForThisOrder={isKlarnaEnabledForThisOrder}
                        isAfterpayEnabledForThisOrder={isAfterpayEnabledForThisOrder}
                        isPazeEnabledForThisOrder={isPazeEnabledForThisOrder}
                        isVenmoEnabledForThisOrder={isVenmoEnabledForThisOrder}
                        isAfterpayEnabledForThisProfile={isAfterpayEnabledForThisProfile}
                        paymentName={paymentName}
                        klarnaCheckoutExperience={this.state.klarnaCheckoutExperience}
                        shippingAddress={paymentShippingAddress}
                        isBopis={isBopisOrder}
                        isSddOrder={isSddOrder}
                        hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                        orderDetails={orderDetails}
                    />
                ),
                unfocus: (
                    <PaymentDisplay
                        selected={true}
                        checkoutEnabled={checkoutEnabled}
                        installmentValue={installmentValue}
                        isSummary={true}
                        paymentName={paymentName}
                        creditCard={creditCardPaymentGroup.isComplete && creditCardPaymentGroup}
                        giftCards={giftCardPaymentGroups}
                        storeCredits={storeCredits}
                        isPayPal={isPayPalEnabled && payPalPaymentGroup.isComplete}
                        paypalEmail={payPalPaymentGroup.email}
                        isComplete={this.state.isPaymentComplete}
                        isBopis={isBopisOrder}
                        isSddOrder={isSddOrder}
                        renderccBanner={true}
                        hasSavedPaypal={!orderUtils.userHasSavedPayPalAccount(orderDetails)}
                        hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                        isGiftCardShow={shouldRenderGiftCardSection}
                    />
                )
            };
            paymentData.isError = !this.state.isPaymentComplete;
            sectionsData.push(paymentData);
        }

        if (!isBopisOrder && isNewUserFlow && !isGuestCheckout) {
            const accountData = Object.assign({}, CHECKOUT_SECTIONS.ACCOUNT);
            accountData.components = {
                focus: this.state.orderDetails.header && <AccountCreationSection profile={this.state.orderDetails.header.profile} />,
                unfocus: this.state.orderDetails.header && <AccountDisplay {...this.state.orderDetails.header.profile} />
            };
            sectionsData.push(accountData);
        }

        if (
            !isBopisOrder &&
            !this.state.isApplePayFlow &&
            !this.state.isKlarnaSelected &&
            !this.state.isAfterpaySelected &&
            !isGuestCheckout &&
            !orderHasReplen
        ) {
            const reviewData = Object.assign({}, CHECKOUT_SECTIONS.REVIEW);

            reviewData.component = (
                <ReviewText
                    isZeroCheckout={isZeroCheckout}
                    isZeroDollarOrderWithCVVValidation={isZeroDollarOrderWithCVVValidation}
                    isShippableOrder={isShippableOrder}
                />
            );
            sectionsData.push(reviewData);
        }

        return sectionsData;
    };

    getSddAccordionConfiguration = orderDetails => {
        const configuration = [];
        const isZeroCheckout = orderUtils.isZeroCheckout();
        const isGuestCheckout = checkoutUtils.isGuestOrder();
        const physicalGiftCardShippingGroup = orderUtils.getPhysicalGiftCardShippingGroup(orderDetails);
        const hasStandardItems = orderUtils.hasStandardDeliveryItems(orderDetails);
        const isHalAvailable = this.state.isHalAvailable;
        const isSDUOnlyOrder = orderUtils.isSDUOnlyOrder(orderDetails);
        const hasSDUOnlyInSddBasket = orderUtils.hasSDUOnlyInSddBasket(orderDetails);
        const hasAutoReplenishment = orderUtils.hasAutoReplenishItems(orderDetails);
        const hasSDUInBasket = orderUtils.hasSDUInBasket(this.state?.orderDetails);
        const shippingGroup =
            !isSDUOnlyOrder && (hasSDUOnlyInSddBasket || hasStandardItems)
                ? orderDetails.shippingGroups.shippingGroupsEntries.find(
                    group => group.shippingGroupType !== SHIPPING_GROUPS.SDU_ELECTRONIC && group.shippingGroupType !== SHIPPING_GROUPS.SAME_DAY
                )
                : orderDetails.shippingGroups.shippingGroupsEntries.find(group => group.shippingGroupType === SHIPPING_GROUPS.SAME_DAY);
        const isElectronicShippingGroup = shippingGroup && orderUtils.isElectronicShippingGroup(shippingGroup);
        const hasRRC = orderUtils.hasRRC(orderDetails);

        if (!isSDUOnlyOrder || (!isElectronicShippingGroup && !hasSDUInBasket)) {
            const deliverToSection = {
                ...CHECKOUT_SECTIONS.DELIVER_TO,
                components: {
                    focus: (
                        <ShipAddressSection
                            isSameDay
                            isNewUserFlow={this.state.isNewUserFlow}
                            shippingAddress={shippingGroup.shippingGroup.address}
                            profileAddresses={this.state.addressList}
                            shippingGroupId={shippingGroup.shippingGroup.shippingGroupId}
                            isComplete={shippingGroup.shippingGroup.isComplete}
                            orderHasPhysicalGiftCard={!!physicalGiftCardShippingGroup}
                            isZeroCheckout={isZeroCheckout}
                            isGuestCheckout={isGuestCheckout}
                            hasSddItems
                            shippingMethod={shippingGroup.shippingGroup.shippingMethod}
                            isHalAvailable={isHalAvailable}
                        />
                    ),
                    unfocus: (
                        <ShipAddressDisplay
                            address={shippingGroup.shippingGroup.address}
                            isZeroCheckout={isZeroCheckout}
                            hasSddItems
                            shippingMethod={shippingGroup.shippingGroup.shippingMethod}
                            isComplete={shippingGroup.shippingGroup.isComplete}
                            isHalAvailable={isHalAvailable}
                            hasRRC={hasRRC}
                        />
                    )
                }
            };
            deliverToSection.isError = !shippingGroup.shippingGroup.isComplete;

            if (!isElectronicShippingGroup && !isSDUOnlyOrder) {
                configuration.push(deliverToSection);
            }

            if (!hasStandardItems) {
                // Don't show the note if the order only has Same Day Delivery Notes
                deliverToSection.note = false;
            }
        }

        configuration.push('sddSection');
        const hardGoodShippingGroup = orderUtils.getHardGoodShippingGroup(orderDetails);
        const hardGoodOrGiftCardShippingGroup = hardGoodShippingGroup || physicalGiftCardShippingGroup;
        const orderHasReplen = orderUtils.hasAutoReplenishItems(this.state?.orderDetails);

        if (hasSDUInBasket && !isSDUOnlyOrder && hardGoodOrGiftCardShippingGroup) {
            const shipOptionsData = Object.assign({}, hasSDUOnlyInSddBasket ? CHECKOUT_SECTIONS.SHIP_OPTIONS_REPLEN : CHECKOUT_SECTIONS.SHIP_OPTIONS);
            const allowUpdatedShippingCalculationsMsg = orderUtils.allowUpdatedShippingCalculationsMsg(orderDetails);
            const shippingMethods = this.state.orderShippingMethods;
            shipOptionsData.title = 'deliveryAutoReplenish';

            shipOptionsData.components = {
                focus: (
                    <ShipOptionsForm
                        orderHasReplen={orderHasReplen}
                        allowUpdatedShippingCalculationsMsg={allowUpdatedShippingCalculationsMsg}
                        shippingMethods={shippingMethods[hardGoodOrGiftCardShippingGroup.shippingGroupId]}
                        isGuestCheckout={isGuestCheckout}
                        shippingGroup={hardGoodOrGiftCardShippingGroup}
                        hasSDUInBasket={hasSDUInBasket}
                    />
                ),
                unfocus: (
                    <ShipOptionsDisplay
                        orderHasReplen={orderHasReplen}
                        shippingMethod={hardGoodOrGiftCardShippingGroup.shippingMethod}
                        hasSDUInBasket={hasSDUInBasket}
                        shippingGroup={hardGoodOrGiftCardShippingGroup}
                    />
                )
            };
            shipOptionsData.isError = !hardGoodOrGiftCardShippingGroup.shippingMethod.isComplete;
            configuration.push(shipOptionsData);
        }

        if ((hasStandardItems && !hasSDUInBasket) || isElectronicShippingGroup) {
            configuration.push('standardSection');
        }

        const isBopisOrder = this.state.orderDetails?.header?.isBopisOrder;
        const showAddMessageLink = this.state.orderDetails?.header?.digitalGiftMessagingStatus !== GIFT_MESSAGE_STATUS.NOT_AVAILABLE;
        const isMobile = Sephora.isMobile();

        if (showAddMessageLink) {
            const giftMessageData = Object.assign({}, CHECKOUT_SECTIONS.GIFT_MESSAGE);
            giftMessageData.components = {
                focus,
                unfocus: (
                    <AddGiftMessage
                        isCheckout={true}
                        isMobile={isMobile}
                        orderId={orderDetails?.header?.orderId}
                        giftMessagingStatus={orderDetails?.header?.digitalGiftMessagingStatus}
                    />
                )
            };
            configuration.push(giftMessageData);
        }

        // for orders where user must accept T&C located in the payment section
        // therefore payment section should be shown even if orderTotal is zero
        if (!isZeroCheckout || isSDUOnlyOrder || hasAutoReplenishment || hasSDUInBasket || isElectronicShippingGroup) {
            const creditCardPaymentGroup = orderUtils.getCreditCardPaymentGroup(orderDetails) || { isComplete: false };
            const payPalPaymentGroup = orderUtils.getPayPalPaymentGroup(orderDetails) || { isComplete: false };
            const giftCardPaymentGroups = orderUtils.getGiftCardPaymentGroups(orderDetails);
            const storeCredits = orderUtils.getStoreCredits(orderDetails);
            const isPayPalEnabled = orderUtils.isPayPalEnabled(orderDetails);
            const isKlarnaEnabledForThisOrder = this.isKlarnaEnabledForThisOrder(orderDetails);
            const isAfterpayEnabledForThisOrder = this.isAfterpayEnabledForThisOrder(orderDetails);
            const isPazeEnabledForThisOrder = this.isPazeEnabledForThisOrder(orderDetails);
            const isVenmoEnabledForThisOrder = this.isVenmoEnabledForThisOrder(orderDetails);
            const isAfterpayEnabledForThisProfile = checkoutUtils.isAfterpayEnabledForThisProfile(orderDetails);
            const isSddOrder = orderUtils.hasSameDayDeliveryItems(orderDetails);
            // check to see if there is only a physical gift card in the order, as gift card in payments
            // should be hidden if that's the case
            const isPhysicalGiftCardOnly = physicalGiftCardShippingGroup && !hardGoodShippingGroup;
            const shouldRenderGiftCardSection = !isPhysicalGiftCardOnly && !isZeroCheckout;
            // TODO 17.8: figure out how to tell if isPayPalEnabled
            // let paymentLable =isPayPalPaymentEnabled() ?
            //         '(Credit Card, PayPal, Gift Card)' :
            //         '(Credit Card, Gift Card)';
            // TODO 18.1: implement play check
            // title: 'Payment method',
            // subTitle: paymentLabel,
            const paymentSection = Object.assign({}, CHECKOUT_SECTIONS.PAYMENT);
            const PaymentSectionComp = this.state.isNewUserFlow ? PaymentSectionNewUser : PaymentSectionExistingUser;
            const hasAutoReplenishItemInBasket = orderUtils.hasAutoReplenishItems(orderDetails);
            const paymentName = this.state.isKlarnaSelected ? 'payWithKlarna' : this.state.isAfterpaySelected ? 'payWithAfterpay' : null;
            const amount = orderDetails?.priceInfo?.creditCardAmount || orderDetails?.priceInfo?.paypalAmount;
            const [installmentValue] = skuHelpers.formatInstallmentValue(amount);
            const orderItems = orderDetails?.items;
            const checkoutEnabled = this.state.isKlarnaSelected
                ? orderItems?.isKlarnaCheckoutEnabled
                : this.state.isAfterpaySelected
                    ? orderItems?.isAfterpayCheckoutEnabled
                    : false;

            paymentSection.components = {
                focus: (
                    <PaymentSectionComp
                        isZeroCheckout={isZeroCheckout}
                        defaultPayment={this.state.paymentOptions.defaultPayment}
                        creditCardOptions={this.state.paymentOptions.creditCards}
                        paypalOption={this.state.paymentOptions.paypal}
                        isGiftCardShow={shouldRenderGiftCardSection}
                        isPhysicalGiftCardOnly={isPhysicalGiftCardOnly}
                        creditCardPaymentGroup={creditCardPaymentGroup.isComplete && creditCardPaymentGroup}
                        isPayPalEnabled={isPayPalEnabled}
                        isPayPalSelected={payPalPaymentGroup.isComplete}
                        isKlarnaEnabledForThisOrder={isKlarnaEnabledForThisOrder}
                        isAfterpayEnabledForThisOrder={isAfterpayEnabledForThisOrder}
                        isAfterpayEnabledForThisProfile={isAfterpayEnabledForThisProfile}
                        isPazeEnabledForThisOrder={isPazeEnabledForThisOrder}
                        isVenmoEnabledForThisOrder={isVenmoEnabledForThisOrder}
                        paymentName={paymentName}
                        klarnaCheckoutExperience={this.state.klarnaCheckoutExperience}
                        shippingAddress={
                            (hardGoodShippingGroup && hardGoodShippingGroup.address) ||
                            (physicalGiftCardShippingGroup && physicalGiftCardShippingGroup.address)
                        }
                        isBopis={isBopisOrder}
                        isSddOrder={isSddOrder}
                        hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                        orderDetails={orderDetails}
                        borderFreeCancelCallBack={this.borderFreeCancelCallBack}
                    />
                ),
                unfocus: (
                    <PaymentDisplay
                        selected={true}
                        checkoutEnabled={checkoutEnabled}
                        installmentValue={installmentValue}
                        isSummary={true}
                        paymentName={paymentName}
                        creditCard={creditCardPaymentGroup.isComplete && creditCardPaymentGroup}
                        giftCards={giftCardPaymentGroups}
                        storeCredits={storeCredits}
                        isPayPal={isPayPalEnabled && payPalPaymentGroup.isComplete}
                        paypalEmail={payPalPaymentGroup.email}
                        isComplete={this.state.isPaymentComplete}
                        isBopis={isBopisOrder}
                        isSddOrder={isSddOrder}
                        hasSavedPaypal={!orderUtils.userHasSavedPayPalAccount(orderDetails)}
                        hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                        isGiftCardShow={shouldRenderGiftCardSection}
                    />
                )
            };
            paymentSection.isError = !this.state.isPaymentComplete;
            configuration.push(paymentSection);
        }

        return configuration;
    };
}

const styles = {
    wrap: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
    },
    head: {
        display: 'flex',
        justifyContent: 'center',
        boxShadow: '0 1px 4px 0 var(--color-darken2)',
        paddingTop: space[4],
        paddingBottom: space[4],
        [mediaQueries.md]: {
            paddingTop: space[6],
            paddingBottom: space[6]
        }
    },
    body: {
        flex: '1 0 auto'
    }
};

export default wrapComponent(CheckoutMain, 'CheckoutMain', true);
