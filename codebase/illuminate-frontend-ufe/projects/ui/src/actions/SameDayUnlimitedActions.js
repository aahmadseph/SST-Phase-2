import { UPDATE_SDU_SUBSCRIPTION, LOAD_BCC_CONTENT } from 'constants/actionTypes/sameDayUnlimited';
import getMediaContent from 'services/api/cms/getMediaContent';
import Actions from 'Actions';
import auth from 'utils/Authentication';
import UserActions from 'actions/UserActions';
import userUtils from 'utils/User';
import GetSDUSubscriptionApi from 'services/api/subscriptions/sameDayUnlimited/getSDUSubscription';
import GetProductFrequencyApi from 'services/api/productFrequency';
import localeUtils from 'utils/LanguageLocale';
import addToBasketActions from 'actions/AddToBasketActions';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
const getText = localeUtils.getLocaleResourceFile('actions/locales', 'SameDayUnlimitedActions');
const getTextLandingPage = localeUtils.getLocaleResourceFile('components/GlobalModals/SDULandingPageModal/locales', 'SDULandingPageModal');
import SameDayUnlimitedBindings from 'analytics/bindingMethods/pages/myAccount/SameDayUnlimitedBindings';
import getModal from 'services/api/cms/getModal';

const getSDUSubscription = () => (dispatch, getState) => {
    const {
        user: { beautyInsiderAccount = {}, profileId }
    } = getState();

    const { biAccountId } = beautyInsiderAccount;

    if (!biAccountId) {
        return;
    }

    GetSDUSubscriptionApi.getSDUSubscription({ profileId, biAccountId })
        .then(data => {
            dispatch({
                type: UPDATE_SDU_SUBSCRIPTION,
                payload: data
            });
        })
        // eslint-disable-next-line no-console
        .catch(err => console.warn('Failed to fetch Same Day Unlimited Subscription: ', err));
};

const loadSDUSubscription = () => dispatch => {
    if (!userUtils.isSignedIn()) {
        auth.requireAuthentication(true)
            .then(() => {
                dispatch(getSDUSubscription());
            })
            .catch(() => {});
    } else {
        dispatch(getSDUSubscription());
    }
};

const getBCCContent = data => {
    return {
        type: LOAD_BCC_CONTENT,
        payload: data
    };
};

const loadBCCContent = mediaId => dispatch => {
    return getMediaContent
        .getMediaContent(mediaId)
        .then(data => {
            dispatch(getBCCContent(data));
        })
        .catch(() => {});
};

const loadContentfulContent = sid => () => {
    const { country, channel, language } = Sephora.renderQueryParams;

    return getModal({
        country,
        language,
        channel,
        sid
    }).catch(() => {});
};

const openSDUConfirmationModal = message =>
    Actions.showInfoModal({
        isOpen: true,
        title: getText('sephoraSDUTitle'),
        buttonText: getText('gotIt'),
        isHtml: true,
        message
    });

const addSDUToBasket = (sduDetails, basketType, onDismiss, isUserSDUTrialEligible, skipConfirmationModal, fireAnalytics, SDUSku) => dispatch => {
    const analyticsContext = anaConsts.CONTEXT.SAME_DAY_UNLIMITED;
    const action = addToBasketActions.addToBasket(
        sduDetails,
        basketType,
        1,
        () => {
            if (onDismiss) {
                onDismiss();
            }

            SameDayUnlimitedBindings.addToBasket();

            fireAnalytics && fireAnalytics(true);
            const subHeader = getTextLandingPage('subHeader');
            const hasBeenAdded = getTextLandingPage('hasBeenAdded');
            const activateSubscription = getTextLandingPage('activateSubscription');
            const activateYour = getTextLandingPage('activateYour');
            const free30day = getTextLandingPage('free30day');
            const andSave = getTextLandingPage('andSave');
            const confirmationMessage = isUserSDUTrialEligible
                ? `<p><strong>${subHeader}</strong> ${hasBeenAdded}</p>\n\n<p>${activateYour} <strong>${free30day}</strong> ${andSave}</p>`
                : `<p><strong>${subHeader}</strong> ${hasBeenAdded}</p>\n\n<p>${activateSubscription}</p>`;
            skipConfirmationModal || dispatch(openSDUConfirmationModal(confirmationMessage));
        },
        analyticsContext,
        false,
        {},
        false,
        false,
        '',
        SDUSku
    );

    return dispatch(action);
};

const cancelConfirmationModal = dispatch => {
    dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title: getText('cancelSubscription'),
            message: getText('subscriptionCanceled'),
            footerColumns: 1,
            buttonText: getText('gotIt'),
            showCloseButton: true,
            callback: () => dispatch(getSDUSubscription())
        })
    );
};

const cancelSubscriptionConfirmation = (dispatch, subscriptionId, isTrial) => {
    GetProductFrequencyApi.unsubscribeAutoReplenishment(subscriptionId)
        .then(() => {
            dispatch(UserActions.getUserFull(null, () => cancelConfirmationModal(dispatch), { refreshSubscriptions: true }));

            const pageDetail = isTrial ? anaConsts.PAGE_DETAIL.CANCEL_TRIAL_CONFIRMATION : anaConsts.PAGE_DETAIL.CANCEL_SUBSCRIPTION_CONFIRMATION;
            const previousPageDetails = isTrial ? anaConsts.PAGE_DETAIL.CANCEL_TRIAL : anaConsts.PAGE_DETAIL.CANCEL_SUBSCRIPTION;

            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    pageName: `${anaConsts.PAGE_TYPES.SAME_DAY_UNLIMITED}:${pageDetail}:n/a:*`,
                    eventStrings: [anaConsts.Event.SDU_SUBSCRIPTION_CANCELED],
                    previousPage: `${anaConsts.PAGE_TYPES.SAME_DAY_UNLIMITED}:${previousPageDetails}:n/a:*`,
                    pageDetail
                }
            });
        })
        // eslint-disable-next-line no-console
        .catch(err => console.warn('Failed to cancel Same Day Unlimited Subscription: ', err));
};
const cancelSubscription = (isTrial, price, date, subscriptionId) => dispatch => {
    const message = isTrial
        ? `<p>${getText('wellMissYou')}</p><p>${getText('cancelTrialMsgStart')} ${price} ${getText('cancelTrialMsgEnd')}</p>`
        : `<p>${getText('wellMissYou')}</p><p>${getText('cancelSubscriptionMsg')}${date}.</p>`;
    SameDayUnlimitedBindings.cancelSubscriptionModalOpen();
    dispatch(
        Actions.showInfoModal({
            isHtml: true,
            isOpen: true,
            title: getText('cancelSubscription'),
            message,
            footerColumns: 2,
            buttonText: getText('cancelSubscription'),
            cancelText: getText('nevermind'),
            showCloseButton: true,
            showCancelButtonLeft: true,
            callback: () => cancelSubscriptionConfirmation(dispatch, subscriptionId, isTrial)
        })
    );
};

const displayGenericErrorModal = (title = getText('errorModalTitle'), message = getText('errorMessage')) =>
    Actions.showInfoModal({
        isOpen: true,
        title,
        message,
        buttonText: getText('ok'),
        footerColumns: 1
    });

export default {
    loadSDUSubscription,
    loadBCCContent,
    loadContentfulContent,
    openSDUConfirmationModal,
    addSDUToBasket,
    cancelSubscription,
    displayGenericErrorModal
};
