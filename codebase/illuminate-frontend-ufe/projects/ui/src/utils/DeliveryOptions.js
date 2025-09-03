import store from 'store/Store';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import languageLocaleUtils from 'utils/LanguageLocale';
import { TIME_OUT } from 'constants/location';
import Actions from 'Actions';
import { NEXT_DAY_DELIVERY_MESSAGE } from 'constants/TestTarget';
import userUtils from 'utils/User';
import Empty from 'constants/empty';

const { getLocaleResourceFile, isFrench } = languageLocaleUtils;

function fireStoreSelectionModalAnalytics(isRopisStore, currentSku) {
    const pageType = isRopisStore ? anaConsts.PAGE_TYPES.ROPIS : anaConsts.PAGE_TYPES.BOPIS;
    const pageDetail = anaConsts.PAGE_DETAIL.STORE_SELECTION;
    const eventData = {
        pageName: `${pageType}:${pageDetail}:n/a:*`,
        pageType: pageType,
        pageDetail: pageDetail,
        linkData: anaConsts.LinkData.VIEW_OTHER_STORES,
        sku: { skuId: currentSku?.skuId }
    };
    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: eventData });
}

function showStoreListModal(e, isRopisStore, options = {}) {
    e.preventDefault();
    e.stopPropagation();
    const getExperienceText = getLocaleResourceFile('components/Happening/ExperienceLocation/locales', 'ExperienceLocation');
    const isFromChangeMethod = options?.isFromChangeMethod;

    const { item, callback, mountCallback, cancelCallback } = options;
    const currentProduct = this.props.currentProduct || {
        currentSku: item?.sku,
        productDetails: {
            brandName: item?.sku?.brandName,
            displayName: item?.sku?.displayName,
            productId: item?.sku?.productId
        }
    };

    if (navigator.geolocation) {
        const actionInfo = {
            isOpen: true,
            currentProduct: currentProduct,
            isRopisSelected: this.props.reserveAndPickup,
            ...(isFromChangeMethod && {
                disableNonBopisStores: true,
                disableOutOfStockStores: true,
                callback: callback,
                mountCallback: mountCallback,
                cancelCallback: cancelCallback
            })
        };
        navigator.geolocation.getCurrentPosition(
            position => {
                actionInfo.location = position;
                store.dispatch(Actions.showReserveAndPickUpModal(actionInfo));
                fireStoreSelectionModalAnalytics(isRopisStore, currentProduct?.currentSku);
            },
            () => {
                store.dispatch(
                    Actions.showInfoModal({
                        isOpen: true,
                        title: getExperienceText('locationSharingDisabled'),
                        message: getExperienceText('locationUpdateSettings'),
                        buttonText: getExperienceText('ok'),
                        callback: () => {
                            store.dispatch(Actions.showReserveAndPickUpModal(actionInfo));
                            fireStoreSelectionModalAnalytics(isRopisStore, currentProduct?.currentSku);
                        }
                    })
                );
            },
            { timeout: TIME_OUT }
        );
    }
}

function getCountdownMessage(isBopis, hours, minutes, startingPrice) {
    let countDownMessage;

    if (isBopis) {
        countDownMessage = hours ? `Order within ${hours} hours ${minutes} min, ready today` : `Order within ${minutes} min, ready today`;
    } else {
        const startingPriceString = startingPrice ? `, starting at $${startingPrice}` : '';
        countDownMessage = hours
            ? `Order within ${hours} hours ${minutes} min, get it today${startingPriceString}`
            : `Order within ${minutes} min, get it today${startingPriceString}`;
    }

    return countDownMessage;
}

function getUsersTime() {
    const currentUserTime = new Date();
    const currentUserTimeHours = currentUserTime.getHours();
    const currentUserTimeMinutes = currentUserTime.getMinutes();

    return {
        currentUserTimeHours,
        currentUserTimeMinutes
    };
}

function getStringWithTrimmedPrice(msg) {
    if (!msg) {
        return '';
    }

    const index = isFrench() ? msg.indexOf(' à partir') : msg.indexOf(', starting at');
    const trimmedString = msg.slice(0, index);

    return index > -1 ? trimmedString : msg;
}

function getBOPISCountdownMessage(bopisMessage) {
    const hrsBOPIS = bopisMessage?.match(/[0-9]+:[0-9]+/)?.[0].split(':');
    let pickupMessageCountdown = bopisMessage;

    if (hrsBOPIS) {
        const { currentUserTimeHours, currentUserTimeMinutes } = getUsersTime();

        const convertedStoreTime = Number(hrsBOPIS[0]);
        const limitTime = convertedStoreTime !== 12 ? convertedStoreTime + 12 : convertedStoreTime;
        let totalHoursBOPIS = ((limitTime - currentUserTimeHours) * 60 - currentUserTimeMinutes) / 60;
        let hours = Math.floor(totalHoursBOPIS);
        let minutes = Math.floor((totalHoursBOPIS % 1) * 60);

        if (totalHoursBOPIS < 0) {
            totalHoursBOPIS = ((24 - currentUserTimeHours) * 60 - currentUserTimeMinutes) / 60;
            hours = limitTime + Math.floor(totalHoursBOPIS);
            minutes = Math.floor((totalHoursBOPIS % 1) * 60);
        }

        pickupMessageCountdown = getCountdownMessage(true, hours, minutes);
    }

    return pickupMessageCountdown;
}

function getSDDCountdownMessage(msg) {
    if (msg?.match(NEXT_DAY_DELIVERY_MESSAGE.ORDER_NOW) || msg?.match(NEXT_DAY_DELIVERY_MESSAGE.ORDER_TODAY)) {
        return msg;
    }

    const storeOrderTimeLimit = msg?.match(/[0-9]+/);
    let sameDayDeliveryMessageCountdown = msg;

    if (storeOrderTimeLimit) {
        const convertedStoreTime = Number(storeOrderTimeLimit);
        const limitTime = convertedStoreTime !== 12 ? convertedStoreTime + 12 : convertedStoreTime;

        const { currentUserTimeHours, currentUserTimeMinutes } = getUsersTime();

        let totalHours = ((limitTime - currentUserTimeHours) * 60 - currentUserTimeMinutes) / 60;
        const startingPrice = msg.split(/\$/)[1];
        let hours = Math.floor(totalHours);
        let minutes = Math.floor((totalHours % 1) * 60);

        // validate if the totalHours is valid, example client ordering from CA and choosing NY store
        if (totalHours < 0) {
            totalHours = ((24 - currentUserTimeHours) * 60 - currentUserTimeMinutes) / 60;
            hours = limitTime + Math.floor(totalHours);
            minutes = Math.floor((totalHours % 1) * 60);
        }

        sameDayDeliveryMessageCountdown = getCountdownMessage(false, hours, minutes, startingPrice);
    }

    return sameDayDeliveryMessageCountdown;
}

function isSDUAllowedForUser(userSubscriptions) {
    const SDUSubscription = userSubscriptions?.filter(subscription => subscription.type === 'SDU') || Empty.Array;
    const isUserSDUTrialEligible = userUtils.isAnonymous() ? true : SDUSubscription.length > 0 && SDUSubscription[0]?.isTrialEligible;
    const hasUserSDUSubscribed = SDUSubscription.length > 0 && SDUSubscription[0].status === 'ACTIVE';

    return isUserSDUTrialEligible && !hasUserSDUSubscribed;
}

const closeSDULandingPageModal = () => {
    store.dispatch(Actions.showSDULandingPageModal({ isOpen: false }));
};

function showSDULandingPageModal(options = {}) {
    const {
        isOpen = true,
        mediaId,
        skuTrialPeriod,
        isSDUAddedToBasket = false,
        isUserSDUTrialEligible = false,
        isCanada = false,
        skipConfirmationModal = false,
        isUserSDUTrialAllowed = false,
        fromChooseOptionsModal = false
    } = options;

    store.dispatch(
        Actions.showSDULandingPageModal({
            isOpen,
            sduMediaId: mediaId,
            skuTrialPeriod,
            isSDUAddedToBasket,
            isUserSDUTrialEligible,
            isCanada,
            skipSDUConfirmationModal: skipConfirmationModal,
            isUserSDUTrialAllowed,
            closeSDULandingPageModal,
            fromChooseOptionsModal
        })
    );
}

export default {
    showStoreListModal,
    getCountdownMessage,
    getUsersTime,
    getBOPISCountdownMessage,
    getSDDCountdownMessage,
    isSDUAllowedForUser,
    getStringWithTrimmedPrice,
    showSDULandingPageModal
};
