/* eslint-disable object-curly-newline */
import store from 'store/Store';
import Actions from 'actions/Actions';
import PromoActions from 'actions/PromoActions';
import addToCartPixels from 'analytics/addToCartPixels';
import UtilActions from 'utils/redux/Actions';
import Location from 'utils/Location';
import basketUtils from 'utils/Basket';
import userUtils from 'utils/User';
import decorators from 'utils/decorators';
import processEvent from 'analytics/processEvent';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import basketApi from 'services/api/basket';
import localeUtils from 'utils/LanguageLocale';
import ErrorsUtils from 'utils/Errors';
import anaUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import { updateBasket, refreshBasket } from 'actions/RwdBasketActions';
import Empty from 'constants/empty';

const {
    LINK_TRACKING_EVENT,
    Event: { EVENT_71 },
    ACTION_INFO: { APPLY_PROMO_POINTS_MULTIPLIER, APPLY_PROMO_POINTS_MULTIPLIER_FROM },
    USER_INPUT: { ENTER_PROMO, REMOVE_PROMO }
} = anaConsts;

const ERROR = 'error';
const PROMO_INVALID = 'basketLevelMsg';
const WARNING = 'warning';
const SDD_ROUGE_TEST_BELOW_THRESHOLD = 'basket.sddRougeTest.droppedBelowThreshold';

function getBasicAnalyticsData(promoCode, isError = false) {
    const appliedPromos = Promos.getAppliedPromoCodes();
    appliedPromos.push(promoCode);

    const isFrictionlessCheckoutPage = Location.isFrictionlessCheckoutPage();
    let actionInfo = APPLY_PROMO_POINTS_MULTIPLIER;

    const pageSourceName = anaUtils.getCustomPageSourceName();

    if (pageSourceName) {
        actionInfo = `${APPLY_PROMO_POINTS_MULTIPLIER_FROM} ${pageSourceName}`;
    }

    return {
        eventStrings: [EVENT_71],
        linkName: isError ? 'Error' : APPLY_PROMO_POINTS_MULTIPLIER,
        actionInfo,
        userInput: `${isFrictionlessCheckoutPage ? ENTER_PROMO : ''}${appliedPromos.join(',').toLowerCase()}`
    };
}

function sendBrazePromoCodeEvent(promoCode) {
    if (Sephora.configurationSettings?.enableSOTEventsPhase1 === false) {
        return;
    }

    // Send a custom braze event when a promo code is redeemed on qualifying SKUS
    // Send a custom braze property including the promo code used

    // Check if code is not CBR/CCR/RRC
    if (Promos.getPromoType(promoCode) === Promos.PROMO_TYPES.PROMO && !Promos.isRrcPromoCode(promoCode)) {
        global.braze && braze.logCustomEvent('promocodeRedeemed', { promocode: promoCode });
    }
}

// eslint-disable-next-line no-unused-vars
function submitMsgPromotions(couponCode) {
    const promo = store.getState().promo;
    const sampleSkuIdList = promo.msgPromosSkuList.filter(elem => elem.couponCode === couponCode).map(elem => elem.skuId);

    if (sampleSkuIdList && sampleSkuIdList.length > 0) {
        decorators
            .withInterstice(basketApi.addMsgPromotionToBasket, INTERSTICE_DELAY_MS)(couponCode, sampleSkuIdList)
            .then(data => {
                data.promoWarning = !data.promoWarning ? null : data.promoWarning;
                store.dispatch(updateBasket({ newBasket: data, shouldCalculateRootBasketType: false }));
                processEvent.process(LINK_TRACKING_EVENT, { data: getBasicAnalyticsData(couponCode) });

                return new Promise(resolve => {
                    resolve(data);
                });
            })
            .catch(reason => {
                store.dispatch(PromoActions.removeMsgPromosByCode(couponCode));
                store.dispatch(
                    UtilActions.merge(
                        'promo',
                        'promoError',
                        Object.assign({}, reason, {
                            promoCode: couponCode
                        })
                    )
                );

                return new Promise((resolve, reject) => {
                    reject(reason);
                });
            });
    }
}

function showPromoConfirmationModal() {
    const getPromoText = localeUtils.getLocaleResourceFile('utils/locales', 'Promos');
    const title = getPromoText('promoConfirmationTitle');
    const message = getPromoText('promoConfirmationMessage');
    const buttonText = getPromoText('ok');
    store.dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title,
            message,
            showCancelButton: false,
            isHtml: false,
            buttonText
        })
    );
}

function applyPromotion(
    promoCode,
    captchaToken,
    appliedAt = Promos.CTA_TYPES.TEXT,
    isBccPromotionComponent = false,
    titleText = false,
    categoryTitle,
    personalizedPromoName,
    sid = null
) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Promos');

    store.dispatch(Actions.showBccModal({ isOpen: false }));
    store.dispatch(Actions.showContentModal({ isOpen: false }));

    let promoPopUpErrorMessages = [];
    let sddRougeTestPromoPopUpWarningMessage = [];

    const isBasketPage = Location.isBasketPage();
    const isCheckoutPage = Location.isCheckout();
    const isBasketOrCheckoutPage = isBasketPage || isCheckoutPage;
    const isBeautyOffersPage = Location.isOffersPage();
    const isFrictionlessCheckoutPage = Location.isFrictionlessCheckoutPage();

    return basketApi
        .applyPromotion(promoCode, captchaToken)
        .then(data => {
            const { responseStatus, items, minMsgSkusToSelect, maxMsgSkusToSelect, instructions, basketLevelMessages, SDDRougeTestThreshold } = data;

            if (responseStatus === 202) {
                const location = isBasketPage ? 'basket' : isCheckoutPage ? 'checkout' : null;

                // 202 is a responseStatus for MSG promo
                Promos.sendBrazePromoCodeEvent(promoCode);
                let successCallback;

                if (isBccPromotionComponent && !isBasketOrCheckoutPage) {
                    successCallback = () => showPromoConfirmationModal();
                }

                store.dispatch(
                    Actions.showPromoModal(
                        true,
                        items,
                        minMsgSkusToSelect,
                        maxMsgSkusToSelect,
                        instructions,
                        promoCode,
                        location,
                        successCallback,
                        titleText,
                        categoryTitle
                    )
                );
            } else {
                // Fire only if success Don't fire for Promo Modal Load
                // Clean errors before updating the basket so that new messages can be displayed
                Promos.updateMsgPromosIfSkuAutoRemoved(data);
                store.dispatch(UtilActions.merge('promo', 'promoError', null));
                Promos.sendBrazePromoCodeEvent(promoCode);

                store.dispatch(updateBasket({ newBasket: data, shouldCalculateRootBasketType: false }));

                const analyticsData = Promos.getBasicAnalyticsData(promoCode);

                // eVar65
                analyticsData.userInput = isFrictionlessCheckoutPage ? `${ENTER_PROMO}${promoCode}` : promoCode;

                // eVar61: pass the promoType
                analyticsData.biRewardType = Promos.getPromoType(promoCode);

                if (titleText && categoryTitle) {
                    analyticsData.internalCampaign = `${anaConsts.CONTEXT.BEAUTY_OFFERS}:${categoryTitle}:${titleText}:apply`;
                } else if (sid) {
                    analyticsData.internalCampaign = sid;
                }

                // Override 'eVar75' when a personalized promotion is applied
                if (personalizedPromoName) {
                    analyticsData.internalCampaign = personalizedPromoName;
                }

                if (isBeautyOffersPage) {
                    analyticsData.promoId = sid;
                    analyticsData.promoDisplayName = titleText;
                    analyticsData.totalbasketCount = basketUtils.getTotalBasketCount();
                }

                processEvent.process(LINK_TRACKING_EVENT, { data: analyticsData });

                promoPopUpErrorMessages = basketLevelMessages.filter(
                    msg => msg.type === ERROR && msg.messageContext === PROMO_INVALID && ErrorsUtils.isFormattedError(msg.messages[0])
                );

                if (promoPopUpErrorMessages.length > 0) {
                    Promos.showWarningMessage(promoPopUpErrorMessages[0].messages[0]);
                }

                sddRougeTestPromoPopUpWarningMessage = basketLevelMessages.filter(
                    msg => msg.type === WARNING && msg.messageContext === SDD_ROUGE_TEST_BELOW_THRESHOLD && SDDRougeTestThreshold
                );

                if (sddRougeTestPromoPopUpWarningMessage.length > 0) {
                    Promos.showSDDRougeTestWarningMessage(sddRougeTestPromoPopUpWarningMessage[0].messages[0]);
                }

                const { sku: promoSku, qty: promoQty } = items[items.length - 1];
                const { skuId, productName, brandName, displayName, listPrice } = promoSku;
                const priceForGoogle = listPrice === 'FREE' ? '0.00' : listPrice;

                const googleAnalyticsChangedBasketData = {
                    id: skuId,
                    name: productName,
                    brand: brandName || '',
                    variant: displayName,
                    quantity: promoQty || 1,
                    price: priceForGoogle
                };

                addToCartPixels.googleAnalyticsAddToBasketEvent(googleAnalyticsChangedBasketData);

                if (isBccPromotionComponent && !isBasketOrCheckoutPage) {
                    showPromoConfirmationModal();
                }
            }
        })
        .catch(async reason => {
            if (userUtils.isAnonymous()) {
                store.dispatch(UtilActions.merge('promo', 'afterLogin', [promoCode, null, appliedAt]));
            }

            const { errorMessages } = reason;
            const linkTrackingError = (await import(/* webpackMode: "eager" */ 'analytics/bindings/pages/all/linkTrackingError')).default;

            const analyticsData = Promos.getBasicAnalyticsData(promoCode, true);

            if (isFrictionlessCheckoutPage) {
                analyticsData.biRewardType = Promos.getPromoType(promoCode);
            }

            const {
                CTA_TYPES: { TEXT }
            } = Promos;
            const fieldErrors = isBccPromotionComponent && !isBasketOrCheckoutPage ? ['beauty offers promo'] : ['promo'];
            const data = {
                ...analyticsData,
                bindingMethods: [linkTrackingError],
                serverResponse: appliedAt === TEXT && !isBasketOrCheckoutPage ? errorMessages : isFrictionlessCheckoutPage ? 'D = s.prop48' : 'D=c48',
                fieldErrors,
                errorMessages
            };
            processEvent.process(LINK_TRACKING_EVENT, { data });

            store.dispatch(
                UtilActions.merge(
                    'promo',
                    'promoError',
                    Object.assign({}, reason, {
                        appliedAt,
                        promoCode
                    })
                )
            );

            if ((isBccPromotionComponent || Location.isBIPage()) && !isBasketOrCheckoutPage) {
                const title = getText('promoErrorTitle');
                const message = errorMessages[0];
                const buttonText = getText('ok');
                store.dispatch(
                    Actions.showInfoModal({
                        isOpen: true,
                        title,
                        message,
                        buttonText,
                        dataAtTitle: 'promo_reward_warning_label',
                        dataAtMessage: 'promo_reward_warning_msg',
                        dataAtButton: 'warning_popup_ok_button',
                        dataAtClose: 'close_warning_popup'
                    })
                );
            }

            return reason;
        });
}

function ensureSinglePromoAction(promoAction, promoCode) {
    return (...args) => {
        if (!promoCode) {
            return promoAction && promoAction(...args);
        }

        if (Promos.promosInProgress) {
            return Promise.resolve();
        }

        return promoAction(...args);
    };
}

function fireRemovePromoAnalytics({ couponCode, promoId, promoDisplayName }) {
    const removePromo = anaConsts.ACTION_INFO.REMOVE_PROMO_POINTS_MULTIPLIER;
    const isFrictionlessCheckoutPage = Location.isFrictionlessCheckoutPage();
    let actionInfo = anaConsts.ACTION_INFO.REMOVE_PROMO_POINTS_MULTIPLIER;
    const pageSourceName = anaUtils.getCustomPageSourceName();

    if (pageSourceName) {
        actionInfo = `${anaConsts.ACTION_INFO.REMOVE_PROMO_POINTS_MULTIPLIER_FROM} ${pageSourceName}`;
    }

    const trackingData = {
        eventStrings: ['event71'],
        linkName: removePromo,
        actionInfo,
        userInput: `${isFrictionlessCheckoutPage ? REMOVE_PROMO : ''}${couponCode}`,
        biRewardType: Promos.getPromoType(couponCode)
    };

    const isBeautyOffersPage = Location.isOffersPage();

    if (isBeautyOffersPage) {
        trackingData.promoId = promoId;
        trackingData.promoDisplayName = promoDisplayName;
        trackingData.totalbasketCount = basketUtils.getTotalBasketCount();
    }

    processEvent.process(LINK_TRACKING_EVENT, {
        data: trackingData
    });
}

function removePromotion(couponCode, appliedAt = Promos.CTA_TYPES.TEXT, titleText = null, sid = null) {
    const orderId = basketUtils.getOrderId();

    return decorators
        .withInterstice(basketApi.removePromotion, INTERSTICE_DELAY_MS)(orderId, couponCode)
        .then(data => {
            data.promoWarning = data.promoWarning ? data.promoWarning : null;
            data.appliedPromotions = data.appliedPromotions ? data.appliedPromotions : [];
            store.dispatch(PromoActions.removeMsgPromosByCode(couponCode));

            if (Location.isCheckout()) {
                store.dispatch(refreshBasket());
            } else {
                store.dispatch(updateBasket({ newBasket: data, shouldCalculateRootBasketType: false }));
            }

            if (couponCode) {
                fireRemovePromoAnalytics({ couponCode, promoId: sid, promoDisplayName: titleText });
            }
        })
        .catch(reason =>
            store.dispatch(
                UtilActions.merge(
                    'promo',
                    'promoError',
                    Object.assign({}, reason, {
                        appliedAt,
                        promoCode: couponCode
                    })
                )
            )
        );
}

const Promos = {
    FIRST_INCENTIVE_DISCOUNT: 'firstbuypercentoff',

    ERROR_CODES: {
        PROMO_ERROR: -1,
        PROMO_OVER_LIMIT: -2
    },

    PROMO_TYPES: {
        PROMO: 'PROMO',
        CCR: 'CCR',
        CBR: 'CBR',
        PFD: 'PFD',
        RRC: 'RRC'
    },

    CTA_TYPES: {
        TEXT: 'TEXT',
        CCR: 'CCR',
        CBR: 'CBR',
        PFD: 'PFD',
        RRC: 'RRC'
    },

    getPromoType(couponCode = '') {
        return [
            [this.PROMO_TYPES.CCR, this.isRewardPromoCode.bind(this)],
            [this.PROMO_TYPES.CBR, this.isCbrPromoCode.bind(this)],
            [this.PROMO_TYPES.PFD, this.isPfdPromoCode.bind(this)],
            [this.PROMO_TYPES.RRC, this.isRrcPromoCode.bind(this)],
            [this.PROMO_TYPES.PROMO, () => true]
        ].find(v => v[1](couponCode))[0];
    },

    isRewardPromoCode: function (couponCode = '') {
        const couponCodeLowerCase = couponCode.toLowerCase();

        return couponCodeLowerCase.indexOf('rw') === 0 || couponCodeLowerCase === this.FIRST_INCENTIVE_DISCOUNT;
    },

    isCbrPromoCode: function (couponCode = '') {
        return couponCode.toLowerCase().indexOf('cbr') === 0;
    },

    isPfdPromoCode: function (couponCode = '') {
        return couponCode.toLowerCase().indexOf('pfd') === 0;
    },

    isRrcPromoCode: function (couponCode = '') {
        return couponCode.toLowerCase().indexOf('rrc') === 0 || couponCode.toLowerCase().indexOf('r-') === 0;
    },

    getAppliedPromoCodes: function (type = this.PROMO_TYPES.PROMO) {
        const appliedPromos = this.getAppliedPromotions(type);
        const promoCodes = [];

        if (appliedPromos && appliedPromos.length) {
            appliedPromos.map(promo => promoCodes.push(promo.couponCode));
        }

        return promoCodes;
    },

    getAppliedPromotions: function (type = this.PROMO_TYPES.PROMO, data) {
        let appliedPromotions = [];

        if (!data) {
            const isCheckout = Location.isCheckout();

            if (isCheckout) {
                const order = store.getState().order;

                if (order && order.orderDetails && order.orderDetails.promotion) {
                    appliedPromotions = order.orderDetails.promotion.appliedPromotions;
                }
            } else {
                const basket = basketUtils.getCurrentBasketData();

                if (basket && basket.appliedPromotions) {
                    appliedPromotions = basket.appliedPromotions;
                }
            }
        } else {
            appliedPromotions = data.appliedPromotions;
        }

        return this.filterPromotions(appliedPromotions, type);
    },

    filterPromotions: function (appliedPromotions = [], type) {
        if (!appliedPromotions || !appliedPromotions.length) {
            return [];
        }

        switch (type) {
            case this.PROMO_TYPES.CCR:
                return appliedPromotions.filter(promo => this.isRewardPromoCode(promo.couponCode));
            case this.PROMO_TYPES.CBR:
                return appliedPromotions.filter(promo => this.isCbrPromoCode(promo.couponCode));
            case this.PROMO_TYPES.PROMO:
                return appliedPromotions
                    .filter(promo => !this.isRewardPromoCode(promo.couponCode))
                    .filter(promo => !this.isCbrPromoCode(promo.couponCode));
            default:
                return appliedPromotions;
        }
    },

    getCCPromoDetails: function () {
        const user = store.getState().user;
        const { ccRewards } = user ?? {};

        if (!ccRewards?.firstPurchaseDiscountEligible) {
            return undefined;
        }

        return {
            couponExpirationDate: ccRewards.ccFirstTimeDiscountExpireDate,
            creditCardCouponCode: ccRewards.firstPurchaseDiscountCouponCode,
            shortDisplayName: `${parseInt(ccRewards.firstPurchaseDiscountPercentOff)}% off`
        };
    },

    extractError(promo = {}, ctaTypes = []) {
        const error = promo.promoError || {};
        const hasCtaType = ctaTypes.some(type => error.appliedAt === type);

        if (error.errorMessages && error.promoCode && hasCtaType) {
            return error;
        }

        return {};
    },

    promosInProgress: false,

    ensureSinglePromoAction: ensureSinglePromoAction,

    applyPromo: function (...args) {
        return ensureSinglePromoAction(applyPromotion, args[0])(...args);
    },

    removePromo: function (...args) {
        return ensureSinglePromoAction(removePromotion, args[0])(...args);
    },

    submitMsgPromos: function (...args) {
        return new Promise((resolve, reject) => {
            basketApi
                .addMsgPromotionToBasket(...args)
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    if (Location.isBasketPage() || Location.isCheckout()) {
                        store.dispatch(PromoActions.removeMsgPromosByCode(args[0]));
                        store.dispatch(
                            UtilActions.merge('promo', 'promoError', {
                                ...error,
                                promoCode: args[0]
                            })
                        );
                    } else {
                        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Promos');
                        const title = getText('promoErrorTitle');
                        const message = error.errorMessages;
                        const buttonText = getText('ok');
                        store.dispatch(
                            Actions.showInfoModal({
                                isOpen: true,
                                title,
                                message,
                                buttonText,
                                dataAtTitle: 'promo_reward_warning_label',
                                dataAtMessage: 'promo_reward_warning_msg',
                                dataAtButton: 'warning_popup_ok_button',
                                dataAtClose: 'close_warning_popup'
                            })
                        );
                    }

                    reject(error);
                });
        });
    },

    showWarningMessage: function (message, callback) {
        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Promos');
        const title = getText('promoWarning');
        const buttonText = getText('ok');

        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: title,
                message: message,
                buttonText: buttonText,
                dataAt: 'promo_warning_popup',
                dataAtTitle: 'promo_warning_title',
                dataAtMessage: 'promo_warning_message',
                ...(callback && {
                    callback: callback,
                    cancelCallback: callback
                })
            })
        );
    },

    showSDDRougeTestWarningMessage: function (message) {
        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Promos');
        const title = getText('promoOopsTitle');
        const buttonText = getText('gotIt');

        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title,
                message,
                buttonText,
                dataAt: 'sdd_rouge_test_promo_warning_popup',
                dataAtTitle: 'sdd_rouge_test_promo_warning_title',
                dataAtMessage: 'sdd_rouge_test_promo_warning_message'
            })
        );
    },

    isElegibleBiCashOptionExclusive: function (biCashOptions = {}) {
        if (!biCashOptions.eligibleCBRCount) {
            return false;
        }

        return biCashOptions.availablePromotions?.some(
            biCashOption => biCashOption.point === biCashOptions.eligiblePoint && biCashOption.segmentExclusive
        );
    },

    updateMsgPromosIfSkuAutoRemoved: function (basket) {
        const msgPromosSkuList = store.getState().promo.msgPromosSkuList || Empty.Array;
        const newMsgPromosSkuList = msgPromosSkuList.filter(x => basket.items.find(item => item.sku.skuId === x.skuId));

        if (newMsgPromosSkuList.length !== msgPromosSkuList.length) {
            store.dispatch(UtilActions.merge('promo', 'msgPromosSkuList', newMsgPromosSkuList));
        }
    },

    sendBrazePromoCodeEvent: sendBrazePromoCodeEvent,
    getBasicAnalyticsData: getBasicAnalyticsData,
    applyPromotion: applyPromotion,
    removePromotion: removePromotion
};

export default Promos;
