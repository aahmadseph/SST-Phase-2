import {
    UPDATE_SUBSCRIPTIONS,
    UPDATE_SUBSCRIPTION_LIST,
    UPDATE_ACTIVE_SUBSCRIPTIONS,
    UPDATE_PAUSED_SUBSCRIPTIONS,
    UPDATE_CANCELLED_SUBSCRIPTIONS,
    UNSUBSCRIBE_AUTOREPLENISHMENT,
    LOAD_SHIPPING_AND_PAYMENT_INFO,
    LOAD_CREDIT_CARD_LIST,
    CLEAR_SUBSCRIPTIONS,
    LOAD_COUNTRIES,
    LOAD_CONTENT
} from 'constants/actionTypes/autoReplenishment';
import auth from 'utils/Authentication';
import userUtils from 'utils/User';
import dateUtils from 'utils/Date';
import urlUtils from 'utils/Url';
import Actions from 'Actions';
import GetProductFrequencyApi from 'services/api/productFrequency';
import getAddressAndPayment from 'services/api/profile/getAddressAndPayment';
import getCreditCardsFromProfile from 'services/api/profile/creditCards/getCreditCardsFromProfile';
import getCountryList from 'services/api/utility/getCountryList';
import profileApi from 'services/api/profile';
import EditDataActions from 'actions/EditDataActions';
import addToBasketActions from 'actions/AddToBasketActions';
import basketConstants from 'constants/Basket';
import BCC from 'utils/BCC';
import { colors } from 'style/config';
import orderUtils from 'utils/Order';
import AutoReplenishmentBindings from 'analytics/bindingMethods/pages/myAccount/AutoReplenishmentBindings';
import SameDayUnlimitedBindings from 'analytics/bindingMethods/pages/myAccount/SameDayUnlimitedBindings';
import SubscriptionTypesConstants from 'constants/SubscriptionTypes';
import localeUtils from 'utils/LanguageLocale';
import { getContent } from 'services/api/Content/getContent';

const {
    SUBSCRIPTION_TYPES: { SAME_DAY_UNLIMITED }
} = SubscriptionTypesConstants;
const { BasketType } = basketConstants;
const { AUTO_REPLENISHMENT_FAQ, AUTO_REPLENISHMENT } = BCC.MEDIA_IDS;
const { detectSephoraCard, CREDIT_CARD_TYPES } = orderUtils;
const SUBSCRIPTION_STATUS = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    CANCELLED: 'cancelled'
};

const getText = localeUtils.getLocaleResourceFile('actions/locales', 'AutoReplenishmentActions');
const isAutoReplenishEmptyHubEnabled = !!Sephora.configurationSettings?.isAutoReplenishEmptyHubEnabled;

const updateSubscriptions = () => (dispatch, getState) => {
    const {
        page: {
            autoReplenishment: {
                subscriptions: { numOfPagesLoaded }
            }
        },
        user: {
            beautyInsiderAccount: { biAccountId },
            profileId
        }
    } = getState();

    GetProductFrequencyApi.getAutoReplenishSubscriptions({ profileId, biAccountId }, numOfPagesLoaded)
        .then(data => {
            dispatch({
                type: UPDATE_SUBSCRIPTIONS,
                payload: data
            });
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log('Failed to fetch updated AutoReplenish Subscriptions:', err));
};

const updateSubscriptionList = () => (dispatch, getState) => {
    const {
        user: {
            beautyInsiderAccount: { biAccountId },
            profileId
        }
    } = getState();

    GetProductFrequencyApi.getAutoReplenishSubscriptions({ profileId, biAccountId })
        .then(data => {
            dispatch({
                type: UPDATE_SUBSCRIPTION_LIST,
                payload: data
            });
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log('Failed to fetch updated AutoReplenish Subscriptions:', err));
};

const updateActiveSubscriptions = () => (dispatch, getState) => {
    const {
        page: {
            autoReplenishment: {
                subscriptions: { activePagesLoaded }
            }
        },
        user: {
            beautyInsiderAccount: { biAccountId },
            profileId
        }
    } = getState();

    GetProductFrequencyApi.getAutoReplenishSubscriptions({ profileId, biAccountId }, activePagesLoaded, SUBSCRIPTION_STATUS.ACTIVE)
        .then(data => {
            dispatch({
                type: UPDATE_ACTIVE_SUBSCRIPTIONS,
                payload: data
            });
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log('Failed to load more ACTIVE AutoReplenish Subscriptions:', err));
};

const updatePausedSubscriptions = () => (dispatch, getState) => {
    const {
        page: {
            autoReplenishment: {
                subscriptions: { pausedPagesLoaded }
            }
        },
        user: {
            beautyInsiderAccount: { biAccountId },
            profileId
        }
    } = getState();

    GetProductFrequencyApi.getAutoReplenishSubscriptions({ profileId, biAccountId }, pausedPagesLoaded, SUBSCRIPTION_STATUS.PAUSED)
        .then(data => {
            dispatch({
                type: UPDATE_PAUSED_SUBSCRIPTIONS,
                payload: data
            });
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log('Failed to load more PAUSED AutoReplenish Subscriptions:', err));
};

const updateCancelledSubscriptions = () => (dispatch, getState) => {
    const {
        page: {
            autoReplenishment: {
                subscriptions: { cancelledPagesLoaded }
            }
        },
        user: {
            beautyInsiderAccount: { biAccountId },
            profileId
        }
    } = getState();

    GetProductFrequencyApi.getAutoReplenishSubscriptions({ profileId, biAccountId }, cancelledPagesLoaded, SUBSCRIPTION_STATUS.CANCELLED)
        .then(data => {
            dispatch({
                type: UPDATE_CANCELLED_SUBSCRIPTIONS,
                payload: data
            });
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log('Failed to load more CANCELLED AutoReplenish Subscriptions:', err));
};

const refreshSubscriptions = () => dispatch => {
    dispatch(clearSubscriptions());
    isAutoReplenishEmptyHubEnabled ? dispatch(updateSubscriptionList()) : dispatch(updateSubscriptions());
};

const loadSubscriptions = () => dispatch => {
    if (!userUtils.isSignedIn()) {
        auth.requireAuthentication(true)
            .then(() => {
                isAutoReplenishEmptyHubEnabled ? dispatch(updateSubscriptionList()) : dispatch(updateSubscriptions());
            })
            .catch(() => {});
    } else {
        isAutoReplenishEmptyHubEnabled ? dispatch(updateSubscriptionList()) : dispatch(updateSubscriptions());
    }
};

const openFAQModal = () =>
    Actions.showMediaModal({
        isOpen: true,
        mediaId: AUTO_REPLENISHMENT_FAQ,
        titleDataAt: 'auto-replenishment'
    });

const openAutoReplenishModal = () =>
    Actions.showMediaModal({
        isOpen: true,
        mediaId: AUTO_REPLENISHMENT,
        titleDataAt: 'auto-replenishment'
    });

const openConfirmUnsubscribeModal = () =>
    Actions.showInfoModal({
        isOpen: true,
        title: getText('unsubscribeModalConfirmTitle'),
        message: getText('unsubscribeModalConfirmMsg'),
        footerColumns: 1,
        buttonText: getText('unsubscribeModalConfirmButtonText'),
        showCloseButton: true
    });

const openConfirmPausedSubscriptionModal = () =>
    Actions.showInfoModal({
        isOpen: true,
        title: getText('pausedSubscriptionModalConfirmTitle'),
        message: getText('pausedSubscriptionModalConfirmMsg'),
        footerColumns: 1,
        buttonText: getText('pausedSubscriptionModalConfirmButtonText'),
        showCloseButton: true
    });

const openConfirmSkipSubscriptionModal = (message, isHtml = false) =>
    Actions.showInfoModal({
        isHtml,
        isOpen: true,
        title: getText('skipedSubscriptionModalConfirmTitle'),
        message: message,
        footerColumns: 1,
        buttonText: getText('pausedSubscriptionModalConfirmButtonText'),
        showCloseButton: true
    });

const openConfirmGetItSoonerModal = callback =>
    Actions.showInfoModal({
        isOpen: true,
        title: getText('getItSoonerConfirmationTitle'),
        message: getText('getItSoonerConfirmationContent'),
        callback,
        footerColumns: 1,
        cancelCallback: callback,
        buttonText: getText('getItSoonerConfirmButtonText')
    });

const displayGenericErrorModal = (title, message = getText('errorMessage')) =>
    Actions.showInfoModal({
        isOpen: true,
        title,
        message,
        buttonText: getText('unsubscribeModalConfirmButtonText'),
        footerColumns: 1
    });

const displaySkipErrorModal = (title, message, successCallback, cancelCallback) => {
    return Actions.showInfoModal({
        isOpen: true,
        title: title,
        message,
        buttonText: getText('pause'),
        showCancelButtonLeft: true,
        footerColumns: 2,
        callback: successCallback,
        cancelCallback
    });
};

const displayGetItSoonerErrorModal = (title, message, callback, cancelCallback) =>
    Actions.showInfoModal({
        isOpen: true,
        title: title,
        message,
        buttonText: getText('pause'),
        showCancelButtonLeft: true,
        footerColumns: 2,
        callback,
        cancelCallback
    });
const unsubscribeAutoReplenishment = (subscriptionId, fireGenericErrorAnalytics) => dispatch => {
    GetProductFrequencyApi.unsubscribeAutoReplenishment(subscriptionId)
        .then(data => {
            dispatch(unsubscribeAutoReplenishmentItem(data));
            dispatch(clearSubscriptions());
            isAutoReplenishEmptyHubEnabled ? dispatch(updateSubscriptionList()) : dispatch(updateSubscriptions());
        })
        .catch(() => {
            dispatch(displayGenericErrorModal(getText('unsubscribeItem')));
            fireGenericErrorAnalytics(getText('unsubscribeItem'), getText('errorMessage'));
        });
};

const clearSubscriptions = () => {
    return {
        type: CLEAR_SUBSCRIPTIONS
    };
};

const unsubscribeAutoReplenishmentItem = data => {
    return {
        type: UNSUBSCRIBE_AUTOREPLENISHMENT,
        payload: data
    };
};

const pauseAutoReplenishment = (subscriptionId, fireGenericErrorAnalytics) => dispatch => {
    GetProductFrequencyApi.pauseAutoReplenishment(subscriptionId)
        .then(() => {
            dispatch(clearSubscriptions());
            isAutoReplenishEmptyHubEnabled ? dispatch(updateSubscriptionList()) : dispatch(updateSubscriptions());
        })
        .catch(() => {
            dispatch(displayGenericErrorModal(getText('pauseItem')));
            fireGenericErrorAnalytics(getText('pauseItem'), getText('errorMessage'));
        });
};

const getItSoonerAutoReplenishment =
    (subscription, callback, closeGetItSoonerModal, fireConfirmationAnalytics, fireUnavailableAnalytics, fireGenericErrorAnalytics) => dispatch => {
        GetProductFrequencyApi.skipAutoReplenishment(subscription.subscriptionId, 2)
            .then(responseData => {
                if (responseData.errors?.length > 0) {
                    dispatch(
                        displayGetItSoonerErrorModal(
                            getText('getItSoonerUpdateTitle'),
                            responseData.errors[0].error,
                            () => callback(),
                            closeGetItSoonerModal
                        )
                    );
                    fireUnavailableAnalytics();
                    AutoReplenishmentBindings.unavailableGetItSooner(subscription);
                } else {
                    AutoReplenishmentBindings.confirmGetItSooner(subscription);
                    const item = subscription.items[0];
                    dispatch(addToBasketActions.addToBasket(item, BasketType.Standard, item.qty));
                    fireConfirmationAnalytics();
                    dispatch(openConfirmGetItSoonerModal(() => urlUtils.redirectTo('/basket')));
                }

                closeGetItSoonerModal();
            })
            .then(() => {
                isAutoReplenishEmptyHubEnabled ? dispatch(updateSubscriptionList()) : dispatch(updateSubscriptions());
            })
            .catch(() => {
                dispatch(displayGenericErrorModal(getText('getItSoonerUpdateTitle')));
                fireGenericErrorAnalytics(getText('getItSoonerUpdateTitle'), getText('errorMessage'));
            });
    };

const skipAutoReplenishment =
    (subscription, afterTextMessage, successCallback, cancelCallback, fireAnalytics, fireGenericErrorAnalytics) => dispatch => {
        GetProductFrequencyApi.skipAutoReplenishment(subscription.subscriptionId)
            .then(responseData => {
                if (responseData.errors?.length > 0) {
                    dispatch(displaySkipErrorModal(getText('skipItemUnavailable'), responseData.errors[0].error, successCallback, cancelCallback));
                    fireAnalytics('unavailableSkip');
                    AutoReplenishmentBindings.skipItemUnavailable(subscription);
                } else {
                    const nextScheduleRunDate = dateUtils.getPromiseDate(`${responseData.nextScheduleRunDate}T00:00`);
                    dispatch(
                        openConfirmSkipSubscriptionModal(
                            `<p>${getText('nextShipmentText')} <span style='color: ${
                                colors.green
                            }'>${nextScheduleRunDate}</span>${afterTextMessage}.</p>`,
                            true
                        )
                    );
                    dispatch(clearSubscriptions());
                    fireAnalytics('confirmSkip');
                    isAutoReplenishEmptyHubEnabled ? dispatch(updateSubscriptionList()) : dispatch(updateSubscriptions());
                }
            })
            .catch(() => {
                dispatch(displayGenericErrorModal(getText('skipItemUnavailable')));
                AutoReplenishmentBindings.skipItemUnavailable(subscription);
                fireGenericErrorAnalytics(getText('skipItemUnavailable'), getText('errorMessage'));
            });
    };

const updateReplenishPaymentSubscriptions = subscriptionData => dispatch => {
    GetProductFrequencyApi.updateReplenishPaymentSubscriptions(subscriptionData)
        .then(() => {
            dispatch(refreshSubscriptions());
        })
        .catch(() => dispatch(displayGenericErrorModal(getText('unsubscribeItem'))));
};

const updateAutoReplenishmentSubscription = (subscriptionData, fireGenericErrorAnalytics) => dispatch => {
    return GetProductFrequencyApi.updateReplenishSubscriptions(subscriptionData)
        .then(() => {
            dispatch(clearSubscriptions());
            isAutoReplenishEmptyHubEnabled ? dispatch(updateSubscriptionList()) : dispatch(updateSubscriptions());
            dispatch(
                loadShippingAndPaymentInfo(subscriptionData.profileId, subscriptionData?.shippingAddressId, subscriptionData.paymentInfo.paymentId)
            );
        })
        .catch(error => {
            dispatch(displayGenericErrorModal(getText('updateSubscriptionError')));
            fireGenericErrorAnalytics(getText('updateSubscriptionError'), getText('errorMessage'));
            throw error;
        });
};

const loadShippingAndPaymentInfo =
    (profileId, shippingAddressId, paymentId, failureCallback, fireGenericErrorAnalytics, addressRequired) => dispatch => {
        return getAddressAndPayment({ profileId, shippingAddressId, paymentId, addressRequired })
            .then(data => {
                dispatch({
                    type: LOAD_SHIPPING_AND_PAYMENT_INFO,
                    payload: data
                });
            })
            .catch(() => {
                failureCallback && failureCallback();
                dispatch(displayGenericErrorModal(getText('manageSubscription')));
                fireGenericErrorAnalytics(getText('manageSubscription'), getText('errorMessage'));
            });
    };

const loadCreditCardList = (profileId, source, successCallback, fireGenericErrorAnalytics) => dispatch => {
    return getCreditCardsFromProfile(profileId, source)
        .then(data => {
            dispatch({
                type: LOAD_CREDIT_CARD_LIST,
                payload: data
            });
        })
        .then(successCallback)
        .catch(() => {
            dispatch(displayGenericErrorModal(getText('manageSubscription')));
            fireGenericErrorAnalytics(getText('manageSubscription'), getText('errorMessage'));
        });
};

const setCountryList = data => {
    return {
        type: LOAD_COUNTRIES,
        payload: data
    };
};

const loadCountries = () => dispatch => {
    return getCountryList()
        .then(data => {
            dispatch(setCountryList(data));
        })
        .catch(() => dispatch(displayGenericErrorModal(getText('manageSubscription'))));
};

const updateEditDataAction = (name, value, isExtraData, infoData) => dispatch => {
    let creditCardInfo;
    const { editStore, formName } = infoData;

    if (!isExtraData) {
        creditCardInfo = {
            ...editStore,
            creditCard: {
                ...editStore.creditCard,
                [name]: value
            }
        };
    } else {
        creditCardInfo = { [name]: value };
    }

    dispatch(EditDataActions.updateEditData(creditCardInfo, formName));
};

const addOrUpdateCreditCard = (addressData, isDefault, isEditMode, creditCardData, fireGenericErrorAnalytics, subscriptionType) => () => {
    const {
        cardType, expMonth, expYear, cardNumber, creditCardId, securityCode
    } = creditCardData;

    const creditCardInfo = {
        isMarkAsDefault: isDefault,
        creditCard: {
            firstName: addressData.firstName,
            lastName: addressData.lastName,
            address: {
                address1: addressData.address1,
                address2: addressData.address2,
                city: addressData.city,
                state: addressData.state,
                postalCode: addressData.postalCode,
                country: addressData.country,
                phone: addressData.phone
            }
        }
    };

    creditCardInfo.creditCard.expirationMonth = expMonth;
    creditCardInfo.creditCard.expirationYear = expYear;
    creditCardInfo.creditCard.securityCode = securityCode;

    if (isEditMode) {
        creditCardInfo.creditCard.creditCardId = creditCardId;

        if (subscriptionType === SAME_DAY_UNLIMITED) {
            SameDayUnlimitedBindings.editPaymentSave();
        }
    } else {
        creditCardInfo.creditCard.cardType = cardType === CREDIT_CARD_TYPES.SEPHORA.name ? detectSephoraCard(cardNumber) : cardType;
        creditCardInfo.creditCard.cardNumber = cardNumber;

        if (subscriptionType === SAME_DAY_UNLIMITED) {
            SameDayUnlimitedBindings.addPaymentSave();
        }
    }

    const { creditCard } = creditCardInfo;
    const method = creditCard?.creditCardId ? profileApi.updateCreditCardOnProfile : profileApi.addCreditCardToProfile;

    return method(creditCardInfo).catch(error => {
        fireGenericErrorAnalytics(isEditMode ? getText('editCard') : getText('addNewCard'), error.errorMessages[0]);
        throw error;
    });
};

const setDefaultCCOnProfileAndDelete = creditCardToDefaultAndDelete => () => {
    const { creditCardForDefault, profileId, creditCardId } = creditCardToDefaultAndDelete;

    return profileApi
        .removeCreditCardFromProfile(profileId, creditCardId)
        .then(() => profileApi.setDefaultCreditCardOnProfile(creditCardForDefault))
        .catch(error => error);
};

const removeCreditCard = (profileId, creditCardId, fireGenericErrorAnalytics) => dispatch => {
    return profileApi.removeCreditCardFromProfile(profileId, creditCardId).catch(error => {
        const errorMessage = error.errorMessages ? error.errorMessages[0] : getText('errorMessage');
        dispatch(displayGenericErrorModal(getText('deleteCard'), errorMessage));
        fireGenericErrorAnalytics(getText('deleteCard'), errorMessage);
        throw error;
    });
};

const resumeAutoReplenishment = (subscriptionId, fireGenericErrorAnalytics) => dispatch => {
    return GetProductFrequencyApi.resumeAutoReplenishment(subscriptionId)
        .then(() => {
            dispatch(clearSubscriptions());
            isAutoReplenishEmptyHubEnabled ? dispatch(updateSubscriptionList()) : dispatch(updateSubscriptions());
        })
        .catch(error => {
            dispatch(displayGenericErrorModal(getText('resumeItem')));
            fireGenericErrorAnalytics(getText('resumeItem'), getText('errorMessage'));
            throw error;
        });
};

const loadContentfulContent = () => async dispatch => {
    const { country, language } = Sephora.renderQueryParams;
    const { data } = await getContent({
        country,
        language,
        path: '/autoreplenishment'
    });

    return dispatch({
        type: LOAD_CONTENT,
        payload: data
    });
};

const showSignInModal = () => dispatch => {
    dispatch(Actions.showSignInModal({ isOpen: true }));
};

export default {
    loadSubscriptions,
    updateActiveSubscriptions,
    updatePausedSubscriptions,
    updateCancelledSubscriptions,
    openFAQModal,
    openAutoReplenishModal,
    unsubscribeAutoReplenishment,
    pauseAutoReplenishment,
    skipAutoReplenishment,
    getItSoonerAutoReplenishment,
    loadShippingAndPaymentInfo,
    openConfirmUnsubscribeModal,
    openConfirmPausedSubscriptionModal,
    loadCreditCardList,
    updateAutoReplenishmentSubscription,
    updateReplenishPaymentSubscriptions,
    loadCountries,
    updateEditDataAction,
    addOrUpdateCreditCard,
    setDefaultCCOnProfileAndDelete,
    removeCreditCard,
    resumeAutoReplenishment,
    loadContentfulContent,
    showSignInModal
};
