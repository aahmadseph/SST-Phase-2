import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import Location from 'utils/Location';
import orderDetailsBindings from 'analytics/bindingMethods/pages/orderDetails/orderDetailsBindings';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import { SHOW_SPA_PAGE_LOAD_PROGRESS } from 'constants/actionTypes/page';

const TYPES = {
    SHOW_BCC_MODAL: 'SHOW_BCC_MODAL',
    SHOW_CONTENT_MODAL: 'SHOW_CONTENT_MODAL',
    SHOW_CHILD_CONTENT_MODAL: 'SHOW_CHILD_CONTENT_MODAL',
    SHOW_SIGN_IN_MODAL: 'SHOW_SIGN_IN_MODAL',
    SHOW_SIGN_IN_WITH_MESSAGING_MODAL: 'SHOW_SIGN_IN_WITH_MESSAGING_MODAL',
    SHOW_REGISTER_MODAL: 'SHOW_REGISTER_MODAL',
    SHOW_MOBILE_CONFIRM_MODAL: 'SHOW_MOBILE_CONFIRM_MODAL',
    SHOW_BI_REGISTER_MODAL: 'SHOW_BI_REGISTER_MODAL',
    SHOW_FORGOT_PASSWORD_MODAL: 'SHOW_FORGOT_PASSWORD_MODAL',
    SHOW_INFO_MODAL: 'SHOW_INFO_MODAL',
    SHOW_BUY_NOW_PAY_LATER_MODAL: 'SHOW_BUY_NOW_PAY_LATER_MODAL',
    SHOW_SAMPLE_MODAL: 'SHOW_SAMPLE_MODAL',
    SHOW_VIDEO_MODAL: 'SHOW_VIDEO_MODAL',
    SHOW_PROMO_MODAL: 'SHOW_PROMO_MODAL',
    SHOW_REWARD_MODAL: 'SHOW_REWARD_MODAL',
    SHOW_APPLY_REWARDS_MODAL: 'SHOW_APPLY_REWARDS_MODAL',
    SHOW_QUICK_LOOK_MODAL: 'SHOW_QUICK_LOOK_MODAL',
    SHOW_ADD_TO_BASKET_MODAL: 'SHOW_ADD_TO_BASKET_MODAL',
    SHOW_MEDIA_MODAL: 'SHOW_MEDIA_MODAL',
    SHOW_COLOR_IQ_MODAL: 'SHOW_COLOR_IQ_MODAL',
    UPDATE_QUICK_LOOK: 'UPDATE_QUICK_LOOK',
    SHOW_COUNTRY_SWITCHER_MODAL: 'SHOW_COUNTRY_SWITCHER_MODAL',
    SHOW_EMAIL_WHEN_IN_STOCK_MODAL: 'SHOW_EMAIL_WHEN_IN_STOCK_MODAL',
    SHOW_INTERSTICE: 'SHOW_INTERSTICE',
    SHOW_SHARE_LINK_MODAL: 'SHOW_SHARE_LINK_MODAL',
    SHOW_ORDER_CANCELATION_MODAL: 'SHOW_ORDER_CANCELATION_MODAL',
    SHOW_PRODUCT_FINDER_MODAL: 'SHOW_PRODUCT_FINDER_MODAL',
    SHOW_FIND_IN_STORE_MODAL: 'SHOW_FIND_IN_STORE_MODAL',
    SHOW_FIND_IN_STORE_MAP_MODAL: 'SHOW_FIND_IN_STORE_MAP_MODAL',
    UPDATE_PURCHASE_HISTORY_ITEM_COUNT: 'UPDATE_PURCHASE_HISTORY_ITEM_COUNT',
    UPDATE_PURCHASE_HISTORY_ITEMS: 'UPDATE_PURCHASE_HISTORY_ITEMS',
    UPDATE_COMPLETE_PURCHASE_HISTORY_ITEMS: 'UPDATE_COMPLETE_PURCHASE_HISTORY_ITEMS',
    SHOW_ROUGE_REWARD_CARD_MODAL: 'SHOW_ROUGE_REWARD_CARD_MODAL',
    SHOW_ORDER_CONFIRM_REWARD_MODAL: 'SHOW_ORDER_CONFIRM_REWARD_MODAL',
    SHOW_AUTHENTICATE_MODAL: 'SHOW_AUTHENTICATE_MODAL',
    SHOW_PRODUCT_MEDIA_ZOOM_MODAL: 'SHOW_PRODUCT_MEDIA_ZOOM_MODAL',
    SHOW_CREDIT_CARD_PRESCREEN_MODAL: 'SHOW_CREDIT_CARD_PRESCREEN_MODAL',
    SHOW_SCAN_REWARD_CARD_MODAL: 'SHOW_SCAN_REWARD_CARD_MODAL',
    SHOW_CREDIT_REPORT_DETAILS_MODAL: 'SHOW_CREDIT_REPORT_DETAILS_MODAL',
    UPDATE_CONFIRMATION_STATUS: 'UPDATE_CONFIRMATION_STATUS',
    SHOW_EXTEND_SESSION_MODAL: 'SHOW_EXTEND_SESSION_MODAL',
    SHOW_EXTEND_SESSION_FAILURE_MODAL: 'SHOW_EXTEND_SESSION_FAILURE_MODAL',
    SHOW_ADDRESS_VERIFICATION_MODAL: 'SHOW_ADDRESS_VERIFICATION_MODAL',
    SHOW_SIMILAR_PRODUCTS_MODAL: 'SHOW_SIMILAR_PRODUCTS_MODAL',
    SHOW_UFE_MODAL: 'SHOW_UFE_MODAL',
    SHOW_RESERVE_AND_PICK_UP_MODAL: 'SHOW_RESERVE_AND_PICK_UP_MODAL',
    SHOW_REVIEW_IMAGE_MODAL: 'SHOW_REVIEW_IMAGE_MODAL',
    SHOW_BEAUTY_TRAITS_MODAL: 'SHOW_BEAUTY_TRAITS_MODAL',
    SHOW_CREDIT_CARD_OFFER_MODAL: 'SHOW_CREDIT_CARD_OFFER_MODAL',
    SHOW_WIZARD: 'SHOW_WIZARD',
    SHOW_STORE_SWITCHER_MODAL: 'SHOW_STORE_SWITCHER_MODAL',
    SHOW_SAME_DAY_DELIVERY_LOCATION_MODAL: 'SHOW_SAME_DAY_DELIVERY_LOCATION_MODAL',
    SHOW_CURBSIDE_PICKUP_CHECKIN_MODAL: 'SHOW_CURBSIDE_PICKUP_CHECKIN_MODAL',
    SHOW_FREE_RETURNS_MODAL: 'SHOW_FREE_RETURNS_MODAL',
    SHOW_MARKDOWN_MODAL: 'SHOW_MARKDOWN_MODAL',
    SHOW_DELIVERY_ISSUE_MODAL: 'SHOW_DELIVERY_ISSUE_MODAL',
    ADD_RV_DATA: 'ADD_RV_DATA',
    ADD_BEAUTY_RECOMMENDATIONS: 'ADD_BEAUTY_RECOMMENDATIONS',
    SHOW_CONSUMER_PRIVACY_MODAL: 'SHOW_CONSUMER_PRIVACY_MODAL',
    SHOW_BEAUTY_PREFERENCES_MODAL: 'SHOW_BEAUTY_PREFERENCES_MODAL',
    SHOW_BEAUTY_PREFERENCES_SAVED_MODAL: 'SHOW_BEAUTY_PREFERENCES_SAVED_MODAL',
    SHOW_SMS_SIGNUP_MODAL: 'SHOW_SMS_SIGNUP_MODAL',
    SHOW_ACCOUNT_DEACTIVATED_MODAL: 'SHOW_ACCOUNT_DEACTIVATED_MODAL',
    SHOW_CLOSE_ACCOUNT_MODAL: 'SHOW_CLOSE_ACCOUNT_MODAL',
    SHOW_CHECK_PASSWORD_MODAL: 'SHOW_CHECK_PASSWORD_MODAL',
    SHOW_GALLERY_LIGHTBOX_MODAL: 'SHOW_GALLERY_LIGHTBOX_MODAL',
    SHOW_GAME_INFO_MODAL: 'SHOW_GAME_INFO_MODAL',
    SHOW_CHECK_YOUR_EMAIL_MODAL: 'SHOW_CHECK_YOUR_EMAIL_MODAL',
    SHOW_EMAIL_LOOKUP_MODAL: 'SHOW_EMAIL_LOOKUP_MODAL',
    SHOW_ADD_GIFT_MESSAGE_MODAL: 'SHOW_ADD_GIFT_MESSAGE_MODAL',
    SHOW_REMOVE_GIFT_MESSAGE_MODAL: 'SHOW_REMOVE_GIFT_MESSAGE_MODAL',
    SHOW_GALLERY_LIGHTBOX_KEBAB_MODAL: 'SHOW_GALLERY_LIGHTBOX_KEBAB_MODAL',
    SHOW_REPORT_CONTENT_MODAL: 'SHOW_REPORT_CONTENT_MODAL',
    SHOW_SMS_SIGNIN_MODAL: 'SHOW_SMS_SIGNIN_MODAL',
    SHOW_LOCATION_AND_STORES_MODAL: 'SHOW_LOCATION_AND_STORES_MODAL',
    SHOW_GIFT_ADDRESS_WARNING_MODAL: 'SHOW_GIFT_ADDRESS_WARNING_MODAL',
    SHOW_RESET_PASSWORD_CONFIRMATION_MODAL: 'SHOW_RESET_PASSWORD_CONFIRMATION_MODAL',
    SHOW_MULTIPLE_ROUGE_REWARDS_MODAL: 'SHOW_MULTIPLE_ROUGE_REWARDS_MODAL',
    SHOW_REWARDS_BAZAAR_MODAL: 'SHOW_REWARDS_BAZAAR_MODAL',
    SHOW_FREE_SAMPLES_MODAL: 'SHOW_FREE_SAMPLES_MODAL',
    SHOW_ITEM_SUBSTITUTION_MODAL: 'SHOW_ITEM_SUBSTITUTION_MODAL',
    SHOW_BI_CARD_MODAL: 'SHOW_BI_CARD_MODAL',
    SHOW_PRODUCT_SAMPLES_MODAL: 'SHOW_PRODUCT_SAMPLES_MODAL',
    SHOW_EDIT_BEAUTY_PREFERENCES_MODAL: 'SHOW_EDIT_BEAUTY_PREFERENCES_MODAL',
    SHOW_EDP_CONFIRM_RSVP_MODAL: 'SHOW_EDP_CONFIRM_RSVP_MODAL',
    SHOW_MANAGE_LIST_MODAL: 'SHOW_MANAGE_LIST_MODAL',
    SHOW_DELETE_LIST_MODAL: 'SHOW_DELETE_LIST_MODAL',
    SHOW_PASSKEYS_INFO_MODAL: 'SHOW_PASSKEYS_INFO_MODAL',
    SHOW_TAXCLAIM_ERROR_MODAL: 'SHOW_TAXCLAIM_ERROR_MODAL',
    SHOW_SDU_AGREEMENT_MODAL: 'SHOW_SDU_AGREEMENT_MODAL',
    SHOW_ALTERNATE_PICKUP_PERSON_MODAL: 'SHOW_ALTERNATE_PICKUP_PERSON_MODAL',
    SHOW_PLACE_ORDER_TERMS_MODAL: 'SHOW_PLACE_ORDER_TERMS_MODAL',
    SHOW_EMAIL_TYPO_MODAL: 'SHOW_EMAIL_TYPO_MODAL',
    SHOW_REMOVE_PHONE_CONFIRMATION_MODAL: 'SHOW_REMOVE_PHONE_CONFIRMATION_MODAL',
    SHOW_AUTOREPLENISH_PRODUCTS_MODAL: 'SHOW_AUTOREPLENISH_PRODUCTS_MODAL',
    SHOW_SHARE_LOVE_LIST_LINK_MODAL: 'SHOW_SHARE_LOVE_LIST_LINK_MODAL',
    SHOW_MY_LISTS_MODAL: 'SHOW_MY_LISTS_MODAL',
    SHOW_CHOOSE_OPTIONS_MODAL: 'SHOW_CHOOSE_OPTIONS_MODAL',
    SET_CHOOSE_OPTIONS_DELIVERY_OPTION: 'SET_CHOOSE_OPTIONS_DELIVERY_OPTION',
    SHOW_GENERIC_ERROR_MODAL: 'SHOW_GENERIC_ERROR_MODAL',
    SHOW_GLOBAL_SDU_LANDING_PAGE_MODAL: 'SHOW_GLOBAL_SDU_LANDING_PAGE_MODAL'
};

function showEmailLookupModal(argumentsObj = {}) {
    return {
        type: TYPES.SHOW_EMAIL_LOOKUP_MODAL,
        isOpen: argumentsObj.isOpen,
        originalArgumentsObj: argumentsObj.isOpen ? argumentsObj.originalArgumentObj : {}
    };
}

function showCheckYourEmailModal(argumentsObj = {}) {
    return {
        type: TYPES.SHOW_CHECK_YOUR_EMAIL_MODAL,
        ...argumentsObj
    };
}

function showCompleteAccountSetupModal(argumentsObj = {}) {
    return {
        type: TYPES.SHOW_REGISTER_MODAL,
        ...argumentsObj,
        isCompleteAccountSetupModal: true
    };
}

async function validateEmailVerificationToken(securityToken) {
    const { default: authenticationApi } = await import(/* webpackMode: "eager" */ 'services/api/authentication');
    const { default: decorators } = await import(/* webpackMode: "eager" */ 'utils/decorators');

    return function (dispatch) {
        return decorators
            .withInterstice(authenticationApi.validatePasswordToken, INTERSTICE_DELAY_MS)(securityToken, true)
            .then(data => {
                return dispatch(
                    showCompleteAccountSetupModal({
                        isOpen: true,
                        isStoreUser: true,
                        isEpvEmailValidation: data.emailVerification,
                        biData: {
                            userEmail: data.email,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            birthDay: data.birthDay,
                            birthMonth: data.birthMonth,
                            phoneNumber: data.phoneNumber,
                            profileId: data.profileId,
                            biAccountId: data.clientId,
                            postalCode: data.postalCode
                        }
                    })
                );
            })
            .catch(() => {
                dispatch(showCheckYourEmailModal({ isOpen: true, token: securityToken }));
            });
    };
}

async function removeEmailVerificationFromURL(shouldVerifyUrl = false) {
    const { default: historyLocationActions } = await import(/* webpackMode: "eager" */ 'actions/framework/HistoryLocationActions');

    if (shouldVerifyUrl) {
        const loc = Location.getLocation();
        const isEmailVerificationUrl = loc.pathname === '/emailVerification';

        if (!isEmailVerificationUrl) {
            return null;
        }
    }

    return function (dispatch) {
        return dispatch(historyLocationActions.replaceLocation({ path: '/', queryParams: {} }));
    };
}

export default {
    TYPES,

    removeEmailVerificationFromURL,
    validateEmailVerificationToken,
    showCheckYourEmailModal,
    showEmailLookupModal,

    showSMSSignInModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_SMS_SIGNIN_MODAL,
            ...argumentsObj
        };
    },

    // Modals
    showBccModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_BCC_MODAL,
            isOpen: argumentsObj.isOpen,
            seoName: argumentsObj.seoName,
            width: argumentsObj.width,
            bccModalTemplate: argumentsObj.bccModalTemplate,
            bccParentComponentName: argumentsObj.bccParentComponentName
        };
    },

    showContentModal: function (argumentsObj = {}) {
        if (argumentsObj.isOpen && argumentsObj?.data?.sid) {
            const sid = argumentsObj.data.sid.toLowerCase();
            let pageType, pageDetail, pageName;

            if (argumentsObj?.data?.isPrescreenModal) {
                pageType = anaConsts.PAGE_TYPES.CREDIT_CARD;
                pageDetail = anaConsts.PAGE_DETAIL.PRESCREEN_BANNER;
                pageName = `${pageType}:${pageDetail}:n/a:*`;
            } else {
                pageType = anaConsts.PAGE_TYPES.CONTENTFUL_MODAL;
                pageDetail = 'modal-open';
                pageName = `${pageType}:${pageDetail}:n/a:*sid=${sid}`;
            }

            const eVar75 = `${pageDetail}:${sid}`;
            const analyticsData = argumentsObj?.analyticsData || {};

            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageType,
                    pageDetail,
                    pageName,
                    internalCampaign: eVar75,
                    ...analyticsData
                }
            });
        }

        return {
            type: TYPES.SHOW_CONTENT_MODAL,
            isOpen: argumentsObj.isOpen,
            data: argumentsObj.data
        };
    },

    showChildContentModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_CHILD_CONTENT_MODAL,
            isOpen: argumentsObj.isOpen,
            childData: argumentsObj.childData
        };
    },

    showSignInModal: function (argumentsObj = {}) {
        //Analytics - Track Sign-In Modal
        // Moving this for the modal test 122169 and 125141
        // if (argumentsObj.isOpen) {
        //     let pageName = 'sign in:sign in:n/a:*';
        //     let signInData = {
        //         pageName,
        //         pageType: 'sign in',
        //         pageDetail: 'sign in'
        //     };

        //     Object.assign(signInData, argumentsObj.analyticsData);
        //     processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: signInData });
        // }
        // Moving this for the modal test 122169 and 125141
        //end Analtytics

        return {
            type: TYPES.SHOW_SIGN_IN_MODAL,
            isOpen: argumentsObj.isOpen,
            email: argumentsObj.email,
            isNewUserFlow: argumentsObj.isNewUserFlow,
            messages: argumentsObj.messages,
            callback: argumentsObj.callback,
            errback: argumentsObj.errback,
            source: argumentsObj.source,
            analyticsData: argumentsObj.analyticsData,
            extraParams: argumentsObj.extraParams,
            showBeautyPreferencesFlow: argumentsObj.showBeautyPreferencesFlow,
            isOrderConfirmation: argumentsObj.isOrderConfirmation
        };
    },

    showSignInWithMessagingModal: function (argumentsObj = {}) {
        //Analytics - Track Sign-In Modal
        // let signInData = {
        //     pageName: 'sign in:sign in:n/a:*',
        //     pageType: 'sign in',
        //     pageDetail: 'sign in'
        // };

        // if (argumentsObj.isOpen) {
        //     Object.assign(signInData, argumentsObj.analyticsData);
        //     processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: signInData });
        // }
        // TODO: if you're gonna uncomment this code, please uncomment unit-test related to it
        // (Actions.spec.js)
        //end Analtytics

        return {
            type: TYPES.SHOW_SIGN_IN_WITH_MESSAGING_MODAL,
            isOpen: argumentsObj.isOpen,
            isPaypalFlow: argumentsObj.isPaypalFlow,
            isApplePayFlow: argumentsObj.isApplePayFlow,
            isGuestBookingEnabled: argumentsObj.isGuestBookingEnabled,
            potentialServiceBIPoints: argumentsObj.potentialServiceBIPoints,
            messages: argumentsObj.messages,
            callback: argumentsObj.callback,
            errback: argumentsObj.errback,
            isCreditCardApply: argumentsObj.isCreditCardApply,
            extraParams: argumentsObj.extraParams
        };
    },

    showAuthenticateModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_AUTHENTICATE_MODAL,
            ...argumentsObj
        };
    },

    showForgotPasswordModal: function (isOpen, email) {
        return {
            type: TYPES.SHOW_FORGOT_PASSWORD_MODAL,
            isOpen: isOpen,
            email: email
        };
    },

    /*
        ARGUMENTS FOR SHOW INFO MODAL
        isOpen: boolean
        title: string for title section of modal (optional)
        message: string for body of modal
        buttonText: string for the button text (Yes, Confirm) (optional)
        callback: function to run after user clicks the confirm button (optional)
        showCancelButton: boolean, displays optional cancel button (optional, defaults to false)
        cancelText: string for the cancel button text (showCancelButton needs to be true)
        isHtml: boolean for whether the message is html or not (optional, defaults to false)
        confirmMsgObj: contains title and message for a confirmation modal
            that is launched after click confirm or yes button (optional)
    */
    showInfoModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_INFO_MODAL,
            isOpen: argumentsObj.isOpen,
            title: argumentsObj.title,
            message: argumentsObj.message,
            footerColumns: argumentsObj.footerColumns,
            footerDisplay: argumentsObj.footerDisplay,
            footerJustifyContent: argumentsObj.footerJustifyContent,
            bodyFooterPaddingX: argumentsObj.bodyFooterPaddingX,
            bodyPaddingBottom: argumentsObj.bodyPaddingBottom,
            showFooterBorder: argumentsObj.showFooterBorder,
            footerGridGap: argumentsObj.footerGridGap,
            buttonText: argumentsObj.buttonText,
            buttonWidth: argumentsObj.buttonWidth,
            callback: argumentsObj.callback,
            showCancelButton: argumentsObj.showCancelButton,
            showCancelButtonLeft: argumentsObj.showCancelButtonLeft,
            cancelText: argumentsObj.cancelText,
            isHtml: argumentsObj.isHtml,
            confirmMsgObj: argumentsObj.confirmMsgObj,
            cancelCallback: argumentsObj.cancelCallback,
            showCloseButton: argumentsObj.showCloseButton,
            dataAt: argumentsObj.dataAt,
            dataAtTitle: argumentsObj.dataAtTitle,
            dataAtMessage: argumentsObj.dataAtMessage,
            dataAtMessageContext: argumentsObj.dataAtMessageContext,
            dataAtButton: argumentsObj.dataAtButton,
            dataAtClose: argumentsObj.dataAtClose,
            dataAtCancelButton: argumentsObj.dataAtCancelButton,
            cancelButtonCallback: argumentsObj.cancelButtonCallback,
            width: argumentsObj.width,
            showFooter: argumentsObj.showFooter
        };
    },

    showBuyNowPayLaterModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_BUY_NOW_PAY_LATER_MODAL,
            isOpen: argumentsObj.isOpen,
            installmentValue: argumentsObj.installmentValue,
            totalAmount: argumentsObj.totalAmount,
            showAfterpay: argumentsObj.isAfterpayEnabled,
            showKlarna: argumentsObj.isKlarnaEnabled,
            showPaypal: argumentsObj.isPayPalPayLaterEligibleEnabled,
            selectedPaymentMethod: argumentsObj.selectedPaymentMethod
        };
    },

    showMediaModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_MEDIA_MODAL,
            isOpen: argumentsObj.isOpen,
            mediaId: argumentsObj.mediaId,
            title: argumentsObj.title,
            titleDataAt: argumentsObj.titleDataAt,
            modalBodyDataAt: argumentsObj.modalBodyDataAt,
            modalClose: argumentsObj.modalClose,
            modalCloseDataAt: argumentsObj.modalCloseDataAt,
            width: argumentsObj.width,
            showMediaTitle: argumentsObj.showMediaTitle,
            dismissButtonText: argumentsObj.dismissButtonText,
            dismissButtonDataAt: argumentsObj.dismissButtonDataAt,
            modalDataAt: argumentsObj.modalDataAt
        };
    },

    showColorIQModal: function (isOpen, callback) {
        return {
            type: TYPES.SHOW_COLOR_IQ_MODAL,
            isOpen: isOpen,
            callback: callback
        };
    },

    showRegisterModal: function (argumentsObj = {}) {
        const isEmailVerificationEnabled = Sephora.configurationSettings.isEmailVerificationEnabled;

        /*
          Hijack showRegisterModal action. We will open email lookup modal instead.
          Original argumentObj will be saved and passed to Create Account modal after Email lookup.
        */
        if (isEmailVerificationEnabled && argumentsObj.isOpen && !argumentsObj.skipEmailLookup) {
            return showEmailLookupModal({ isOpen: true, originalArgumentObj: argumentsObj });
        }

        return {
            type: TYPES.SHOW_REGISTER_MODAL,
            isOpen: argumentsObj.isOpen,
            isEmailDisabled: argumentsObj.isEmailDisabled,
            isSSIEnabled: argumentsObj.isSSIEnabled,
            openPostBiSignUpModal: argumentsObj.openPostBiSignUpModal,
            message: argumentsObj.message,
            callback: argumentsObj.callback,
            presetLogin: argumentsObj.userEmail,
            isStoreUser: argumentsObj.isStoreUser,
            biData: argumentsObj.biData,
            errback: argumentsObj.errback,
            isCreditCardApply: argumentsObj.isCreditCardApply,
            analyticsData: argumentsObj.analyticsData,
            extraParams: argumentsObj.extraParams
        };
    },

    showMobileConfirmModal: function (isOpen, mobilePhone, onContinue) {
        return {
            type: TYPES.SHOW_MOBILE_CONFIRM_MODAL,
            payload: {
                isOpen,
                mobilePhone,
                onContinue
            }
        };
    },

    showBiRegisterModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_BI_REGISTER_MODAL,
            isOpen: argumentsObj.isOpen,
            callback: argumentsObj.callback,
            cancellationCallback: argumentsObj.cancellationCallback,
            isCommunity: argumentsObj.isCommunity,
            isCreditCardApply: argumentsObj.isCreditCardApply,
            analyticsData: argumentsObj.analyticsData,
            extraParams: argumentsObj.extraParams
        };
    },

    forceRegisterModal: function (isOnlyBI) {
        if (isOnlyBI) {
            // User is already registered, show BI Register Modal
            return {
                type: TYPES.SHOW_BI_REGISTER_MODAL,
                isOpen: true
            };
        } else {
            return {
                type: TYPES.SHOW_REGISTER_MODAL,
                isOpen: true
            };
        }
    },

    showSampleModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_SAMPLE_MODAL,
            isOpen: argumentsObj.isOpen,
            sampleList: argumentsObj.sampleList,
            allowedQtyPerOrder: argumentsObj.allowedQtyPerOrder,
            samplesMessage: argumentsObj.samplesMessage,
            analyticsContext: argumentsObj.analyticsContext
        };
    },

    showVideoModal: function (config) {
        return {
            type: TYPES.SHOW_VIDEO_MODAL,
            isOpen: config.isOpen,
            videoTitle: config.videoTitle,
            videoModalUpdated: config.videoModalUpdated,
            video: config.video
        };
    },

    showPromoModal: function (
        isOpen,
        promosList,
        minMsgSkusToSelect,
        maxMsgSkusToSelect,
        instructions,
        promoCode,
        location,
        successCallback,
        titleText,
        categoryTitle
    ) {
        return {
            type: TYPES.SHOW_PROMO_MODAL,
            isOpen: isOpen,
            promoCode: promoCode,
            promosList: promosList,
            minMsgSkusToSelect: minMsgSkusToSelect,
            maxMsgSkusToSelect: maxMsgSkusToSelect,
            instructions: instructions,
            location: location,
            successCallback: successCallback,
            promoTitleText: titleText,
            promoCategoryTitle: categoryTitle
        };
    },

    showRewardModal: function (isOpen) {
        return {
            type: TYPES.SHOW_REWARD_MODAL,
            isOpen: isOpen
        };
    },

    showApplyRewardsModal: function (isOpen, rewardsType, isBopis, cmsInfoModals) {
        return {
            type: TYPES.SHOW_APPLY_REWARDS_MODAL,
            isOpen,
            rewardsType,
            isBopis,
            cmsInfoModals
        };
    },

    showOrderConfirmRewardModal: function (isOpen, rewards) {
        return {
            type: TYPES.SHOW_ORDER_CONFIRM_REWARD_MODAL,
            isOpen: isOpen,
            rewardList: rewards
        };
    },

    showQuickLookModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_QUICK_LOOK_MODAL,
            isOpen: argumentsObj.isOpen,
            skuType: argumentsObj.skuType,
            sku: argumentsObj.sku,
            error: argumentsObj.error,
            platform: argumentsObj.platform,
            origin: argumentsObj.origin,
            analyticsContext: argumentsObj.analyticsContext,
            isDisabled: argumentsObj.isDisabled,
            rootContainerName: argumentsObj.rootContainerName,
            categoryProducts: argumentsObj.categoryProducts,
            isCommunityGallery: argumentsObj.isCommunityGallery,
            communityGalleryAnalytics: argumentsObj.communityGalleryAnalytics
        };
    },

    showAddToBasketModal: ({
        analyticsContext,
        basketType,
        error,
        isOpen,
        preferredStoreName,
        product,
        quantity: qty,
        sku,
        replenishmentFrequency,
        replenishmentSelected,
        isAutoReplenMostCommon
    }) => ({
        type: TYPES.SHOW_ADD_TO_BASKET_MODAL,
        payload: {
            analyticsContext,
            basketType,
            error,
            isOpen,
            preferredStoreName,
            product,
            qty,
            sku,
            replenishmentSelected,
            replenishmentFrequency,
            isAutoReplenMostCommon
        }
    }),

    showChooseOptionsModal: (argumentsObj = {}) => {
        return {
            type: TYPES.SHOW_CHOOSE_OPTIONS_MODAL,
            isOpen: argumentsObj.isOpen,
            skuType: argumentsObj.sku?.type,
            sku: argumentsObj.sku,
            product: argumentsObj.product,
            analyticsContext: argumentsObj.analyticsContext,
            pageName: argumentsObj.pageName,
            error: argumentsObj.error
        };
    },
    setChooseOptionsDeliveryOption: deliveryOption => {
        return {
            type: TYPES.SET_CHOOSE_OPTIONS_DELIVERY_OPTION,
            deliveryOption
        };
    },

    showSDULandingPageModal: payload => ({
        type: TYPES.SHOW_GLOBAL_SDU_LANDING_PAGE_MODAL,
        isOpen: payload.isOpen,
        payload
    }),

    showEmailMeWhenInStockModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_EMAIL_WHEN_IN_STOCK_MODAL,
            isOpen: argumentsObj.isOpen,
            product: argumentsObj.product,
            currentSku: argumentsObj.currentSku,
            isQuickLook: argumentsObj.isQuickLook,
            updateEmailButtonCTA: argumentsObj.updateEmailButtonCTA,
            isComingSoon: argumentsObj.isComingSoon,
            analyticsContext: argumentsObj.analyticsContext
        };
    },

    redirectToHome: () => () => {
        Location.setLocation('/');

        return Promise.resolve();
    },

    updateQuickLookContent: function (product, sku) {
        return {
            type: TYPES.UPDATE_QUICK_LOOK,
            quickLookProduct: product,
            sku: sku
        };
    },

    showCountrySwitcherModal: function (isOpen, ctry, lang, ctryName) {
        return {
            type: TYPES.SHOW_COUNTRY_SWITCHER_MODAL,
            isOpen: isOpen,
            desiredCountry: ctry,
            desiredLang: lang,
            switchCountryName: ctryName
        };
    },

    // Interstice

    showInterstice: function (isVisible) {
        return {
            type: TYPES.SHOW_INTERSTICE,
            isVisible: isVisible
        };
    },

    showSpaLoad: function (isLoading) {
        return {
            type: SHOW_SPA_PAGE_LOAD_PROGRESS,
            payload: isLoading
        };
    },

    showShareLinkModal: function (isOpen, title, shareUrl, subTitle, isGallery = false) {
        return {
            type: TYPES.SHOW_SHARE_LINK_MODAL,
            isOpen: isOpen,
            title: title,
            shareUrl: shareUrl,
            subTitle: subTitle,
            isGallery
        };
    },

    showShareLoveListLinkModal: function ({
        isOpen, shareLoveListUrl, loveListName, loveListId, skuIds
    } = {}) {
        return {
            type: TYPES.SHOW_SHARE_LOVE_LIST_LINK_MODAL,
            isOpen,
            shareLoveListUrl,
            loveListName,
            loveListId,
            skuIds
        };
    },

    showOrderCancelationModal: function (isOpen, orderId, selfCancelationReasons) {
        orderDetailsBindings.cancelOrderModal();

        return {
            type: TYPES.SHOW_ORDER_CANCELATION_MODAL,
            isOpen: isOpen,
            canceledOrderId: orderId,
            selfCancelationReasons: selfCancelationReasons
        };
    },

    showProductFinderModal: function (isOpen, bccData) {
        return {
            type: TYPES.SHOW_PRODUCT_FINDER_MODAL,
            isOpen: isOpen,
            bccData: bccData
        };
    },

    showManageListModal: function ({ isOpen, listName, loveListId } = {}) {
        return {
            type: TYPES.SHOW_MANAGE_LIST_MODAL,
            isOpen,
            listName,
            loveListId
        };
    },

    showDeleteListModal: function ({ isOpen, customListId } = {}) {
        return {
            type: TYPES.SHOW_DELETE_LIST_MODAL,
            isOpen,
            customListId
        };
    },

    showFindInStoreModal: function (isOpen, currentProduct, zipCode, searchedDistance, storesToShow) {
        return {
            type: TYPES.SHOW_FIND_IN_STORE_MODAL,
            isOpen: isOpen,
            currentProduct: currentProduct,
            zipCode: zipCode,
            searchedDistance: searchedDistance,
            storesToShow: storesToShow
        };
    },

    showFindInStoreMapModal: function ({
        isOpen, currentProduct, selectedStore, zipCode, searchedDistance, storesToShow, useBackToStoreLink
    }) {
        return {
            type: TYPES.SHOW_FIND_IN_STORE_MAP_MODAL,
            isOpen: isOpen,
            currentProduct: currentProduct,
            selectedStore: selectedStore,
            zipCode: zipCode,
            searchedDistance: searchedDistance,
            storesToShow: storesToShow,
            useBackToStoreLink: useBackToStoreLink
        };
    },

    updatePurchasedHistoryItemCount: function (count) {
        return {
            type: TYPES.UPDATE_PURCHASE_HISTORY_ITEM_COUNT,
            purchasedItemsCount: count
        };
    },

    updatePurchasedHistoryItems: function (items) {
        return {
            type: TYPES.UPDATE_PURCHASE_HISTORY_ITEMS,
            payload: items
        };
    },

    updateCompletePurchaseHistoryItems: function (items) {
        return {
            type: TYPES.UPDATE_COMPLETE_PURCHASE_HISTORY_ITEMS,
            payload: items
        };
    },

    showRougeRewardCardModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_ROUGE_REWARD_CARD_MODAL,
            isOpen: argumentsObj.isOpen,
            sku: argumentsObj.sku,
            callback: argumentsObj.callback,
            analyticsContext: argumentsObj.analyticsContext,
            isRougeExclusiveCarousel: argumentsObj.isRougeExclusiveCarousel
        };
    },

    showCreditCardPrescreenModal: function (isOpen, response = {}) {
        return {
            type: TYPES.SHOW_CREDIT_CARD_PRESCREEN_MODAL,
            isOpen,
            response
        };
    },

    showScanRewardCardModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_SCAN_REWARD_CARD_MODAL,
            isOpen: argumentsObj.isOpen
        };
    },

    showCreditReportDetailsModal: function (isOpen, content = {}) {
        return {
            type: TYPES.SHOW_CREDIT_REPORT_DETAILS_MODAL,
            isOpen,
            content
        };
    },

    showExtendSessionModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_EXTEND_SESSION_MODAL,
            isOpen: argumentsObj.isOpen,
            requestCounter: argumentsObj.requestCounter
        };
    },

    showExtendSessionFailureModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_EXTEND_SESSION_FAILURE_MODAL,
            isOpen: argumentsObj.isOpen
        };
    },

    // @TODO move all OLR actions to a separate file.
    updateConfirmationStatus: function (status) {
        return {
            type: TYPES.UPDATE_CONFIRMATION_STATUS,
            status: status
        };
    },

    showProductMediaZoomModal: function (isOpen, product, index, mediaItems, isGalleryItem = false) {
        return {
            type: TYPES.SHOW_PRODUCT_MEDIA_ZOOM_MODAL,
            isOpen: isOpen,
            product: product,
            index: index,
            mediaItems: mediaItems,
            isGalleryItem
        };
    },

    showAddressVerificationModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_ADDRESS_VERIFICATION_MODAL,
            isOpen: argumentsObj.isOpen,
            verificationType: argumentsObj.verificationType,
            currentAddress: argumentsObj.currentAddress,
            recommendedAddress: argumentsObj.recommendedAddress,
            successCallback: argumentsObj.successCallback,
            cancelCallback: argumentsObj.cancelCallback
        };
    },

    showSimilarProductsModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_SIMILAR_PRODUCTS_MODAL,
            isOpen: argumentsObj.isOpen,
            productImages: argumentsObj.productImages,
            brandName: argumentsObj.brandName,
            productName: argumentsObj.productName,
            itemId: argumentsObj.itemId,
            analyticsContext: argumentsObj.analyticsContext,
            badgeAltText: argumentsObj.badgeAltText,
            isYouMayAlsoLike: argumentsObj.isYouMayAlsoLike,
            productId: argumentsObj.productId,
            analyticsData: argumentsObj.analyticsData,
            recommendedProductIDs: argumentsObj.recommendedProductIDs,
            skuId: argumentsObj.skuId
        };
    },

    showReserveAndPickUpModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_RESERVE_AND_PICK_UP_MODAL,
            isOpen: argumentsObj.isOpen,
            currentProduct: argumentsObj.currentProduct,
            location: argumentsObj.location,
            searchedDistance: argumentsObj.searchedDistance,
            storesToShow: argumentsObj.storesToShow,
            isRopisSelected: argumentsObj.isRopisSelected,
            disableNonBopisStores: argumentsObj.disableNonBopisStores,
            disableOutOfStockStores: argumentsObj.disableOutOfStockStores,
            pickupInsteadModalRef: argumentsObj.pickupInsteadModalRef,
            callback: argumentsObj.callback,
            mountCallback: argumentsObj.mountCallback,
            cancelCallback: argumentsObj.cancelCallback
        };
    },

    showUFEModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_UFE_MODAL,
            isOpen: argumentsObj.isOpen,
            ufeModalId: argumentsObj.ufeModalId
        };
    },

    showReviewImageModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_REVIEW_IMAGE_MODAL,
            isOpen: argumentsObj.isOpen,
            reviewSelected: argumentsObj.reviewSelected,
            reviewSelectedIndex: argumentsObj.reviewSelectedIndex,
            reviewsWithImage: argumentsObj.reviewsWithImage,
            reviewsReference: argumentsObj.reviewsReference,
            reviewUser: argumentsObj.reviewUser,
            reviewProductTitle: argumentsObj.reviewProductTitle,
            reviewSelectedPhotoId: argumentsObj.reviewSelectedPhotoId,
            isFromImageCarousel: argumentsObj.isFromImageCarousel
        };
    },

    showBeautyTraitsModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_BEAUTY_TRAITS_MODAL,
            isOpen: argumentsObj.isOpen,
            checkStatusCallback: argumentsObj.checkStatusCallback
        };
    },

    showCreditCardOfferModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_CREDIT_CARD_OFFER_MODAL,
            isOpen: argumentsObj.isOpen,
            rewardsMessagingABTest: argumentsObj.rewardsMessagingABTest,
            isBasketPageTest: argumentsObj.isBasketPageTest
        };
    },

    showFreeReturnsModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_FREE_RETURNS_MODAL,
            isOpen: argumentsObj.isOpen
        };
    },

    showWizard: function (isOpen, currentProduct, componentName) {
        return {
            type: TYPES.SHOW_WIZARD,
            isOpen,
            currentProduct,
            componentName
        };
    },

    showStoreSwitcherModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_STORE_SWITCHER_MODAL,
            ...argumentsObj
        };
    },

    showShippingDeliveryLocationModal:
        (argumentsObj = {}) =>
            dispatch => {
                if (argumentsObj.isOpen) {
                    const pageType = argumentsObj?.sduZipcodeModal ? anaConsts.PAGE_NAMES.SAME_DAY_UNLIMITED : anaConsts.PAGE_NAMES.SAME_DAY_DELIVERY;
                    const pageDetail = argumentsObj?.sduZipcodeModal
                        ? anaConsts.PAGE_TYPES.ENTER_ZIP_CODE
                        : anaConsts.PAGE_TYPES.SAME_DAY_LOCATION_SELECTOR;
                    const previousPageName =
                    argumentsObj?.sduZipcodeModal &&
                    `${anaConsts.PAGE_NAMES.SAME_DAY_UNLIMITED}:${
                        argumentsObj?.isUserSDUTrialEligible ? anaConsts.PAGE_TYPES.TRIAL_OFFER : anaConsts.PAGE_TYPES.SUBSCRIPTION_OFFER
                    }:n/a:*`;
                    const entry = argumentsObj?.entry;
                    const eventData = {
                        pageName: `${pageType}:${pageDetail}:n/a:*`,
                        pageType: pageType,
                        pageDetail: pageDetail,
                        previousPageName,
                        ...(entry && { linkData: `${entry} entry` })
                    };
                    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: eventData });
                }

                dispatch({
                    type: TYPES.SHOW_SAME_DAY_DELIVERY_LOCATION_MODAL,
                    isOpen: argumentsObj.isOpen,
                    options: argumentsObj.options,
                    callback: argumentsObj.callback,
                    cancelCallback: argumentsObj.cancelCallback,
                    primaryButtonText: argumentsObj.primaryButtonText,
                    sku: argumentsObj.sku
                });

                return Promise.resolve();
            },

    showCurbsidePickupCheckinModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_CURBSIDE_PICKUP_CHECKIN_MODAL,
            ...argumentsObj
        };
    },

    showMarkdownModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_MARKDOWN_MODAL,
            ...argumentsObj
        };
    },

    showDeliveryIssueModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_DELIVERY_ISSUE_MODAL,
            isOpen: argumentsObj.isOpen
        };
    },

    addRecentlyViewedData: function (rvData) {
        return {
            type: TYPES.ADD_RV_DATA,
            payload: rvData
        };
    },

    addBeautyRecommendations: function (skus) {
        return {
            type: TYPES.ADD_BEAUTY_RECOMMENDATIONS,
            payload: skus
        };
    },

    showConsumerPrivacyModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_CONSUMER_PRIVACY_MODAL,
            ...argumentsObj
        };
    },

    showBeautyPreferencesModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_BEAUTY_PREFERENCES_MODAL,
            ...argumentsObj
        };
    },

    showBeautyPreferencesSavedModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_BEAUTY_PREFERENCES_SAVED_MODAL,
            ...argumentsObj
        };
    },

    showSMSSignupModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_SMS_SIGNUP_MODAL,
            ...argumentsObj
        };
    },

    showAccountDeactivatedModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_ACCOUNT_DEACTIVATED_MODAL,
            ...argumentsObj
        };
    },

    showCloseAccountModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_CLOSE_ACCOUNT_MODAL,
            ...argumentsObj
        };
    },

    showCheckPasswordModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_CHECK_PASSWORD_MODAL,
            ...argumentsObj
        };
    },

    showGalleryLightBoxModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_GALLERY_LIGHTBOX_MODAL,
            ...argumentsObj
        };
    },

    showGameInfoModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_GAME_INFO_MODAL,
            ...argumentsObj
        };
    },

    showAddGiftMessageModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_ADD_GIFT_MESSAGE_MODAL,
            ...argumentsObj
        };
    },

    showRemoveGiftMessageModal: function (argumentObj = {}) {
        return {
            type: TYPES.SHOW_REMOVE_GIFT_MESSAGE_MODAL,
            ...argumentObj
        };
    },

    showGalleryLightBoxKebabModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_GALLERY_LIGHTBOX_KEBAB_MODAL,
            ...argumentsObj
        };
    },

    showReportContentModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_REPORT_CONTENT_MODAL,
            ...argumentsObj
        };
    },

    showLocationAndStoresModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_LOCATION_AND_STORES_MODAL,
            ...argumentsObj
        };
    },

    showGiftAddressWarningModal: function (argumentObj = {}) {
        return {
            type: TYPES.SHOW_GIFT_ADDRESS_WARNING_MODAL,
            ...argumentObj
        };
    },

    showResetPasswordConfirmationModal(argumentsObj = {}) {
        return {
            type: TYPES.SHOW_RESET_PASSWORD_CONFIRMATION_MODAL,
            ...argumentsObj
        };
    },

    showMultipleRougeRewardsModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_MULTIPLE_ROUGE_REWARDS_MODAL,
            ...argumentsObj
        };
    },
    showRewardsBazaarModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_REWARDS_BAZAAR_MODAL,
            ...argumentsObj
        };
    },

    showFreeSamplesModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_FREE_SAMPLES_MODAL,
            ...argumentsObj
        };
    },

    showItemSubstitutionModal(argumentsObj = {}) {
        return {
            type: TYPES.SHOW_ITEM_SUBSTITUTION_MODAL,
            ...argumentsObj
        };
    },

    showBiCardModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_BI_CARD_MODAL,
            ...argumentsObj
        };
    },

    showProductSamplesModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_PRODUCT_SAMPLES_MODAL,
            ...argumentsObj
        };
    },

    showEditBeautyPreferencesModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_EDIT_BEAUTY_PREFERENCES_MODAL,
            ...argumentsObj
        };
    },

    showEDPConfirmRsvpModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_EDP_CONFIRM_RSVP_MODAL,
            ...argumentsObj
        };
    },

    showPasskeysInfoModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_PASSKEYS_INFO_MODAL,
            ...argumentsObj
        };
    },

    showTaxclaimErrorModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_TAXCLAIM_ERROR_MODAL,
            ...argumentsObj
        };
    },

    showSDUAgreementModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_SDU_AGREEMENT_MODAL,
            ...argumentsObj
        };
    },

    showAlternatePickupPersonModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_ALTERNATE_PICKUP_PERSON_MODAL,
            ...argumentsObj
        };
    },

    showPlaceOrderTermsModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_PLACE_ORDER_TERMS_MODAL,
            ...argumentsObj
        };
    },

    showEmailTypoModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_EMAIL_TYPO_MODAL,
            ...argumentsObj
        };
    },
    showRemovePhoneConfirmationModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_REMOVE_PHONE_CONFIRMATION_MODAL,
            ...argumentsObj
        };
    },

    showAutoReplenishProductsModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_AUTOREPLENISH_PRODUCTS_MODAL,
            ...argumentsObj
        };
    },

    showGenericErrorModal: function (argumentsObj = {}) {
        return {
            type: TYPES.SHOW_GENERIC_ERROR_MODAL,
            isOpen: argumentsObj.isOpen,
            ...argumentsObj
        };
    }
};
