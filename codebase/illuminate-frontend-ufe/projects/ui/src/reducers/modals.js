/* eslint-disable complexity */
import actions from 'actions/Actions';
const { TYPES: ACTION_TYPES } = actions;
import {
    SHOW_EDIT_MY_PROFILE_MODAL,
    SHOW_EDIT_FLOW_MODAL,
    SHOW_SOCIAL_REGISTRATION_MODAL,
    SHOW_SOCIAL_REOPT_MODAL
} from 'constants/actionTypes/profile';

import { CURBSIDE_CONCIERGE_INFO_MODAL, ENABLE_MODALS } from 'constants/actionTypes/modalActions';

const initialState = {
    renderModals: false,
    seoName: null,
    width: null,
    showBccModal: false,
    showRegisterModal: false,
    isEmailDisabled: false,
    showSignInModal: false,
    showSignInWithMessagingModal: false,
    showBiRegisterModal: false,
    showForgotPasswordModal: false,
    showInfoModal: false,
    showBuyNowPayLaterModal: false,
    buyNowPayLaterInstallment: null,
    buyNowPayLaterTotalAmount: null,
    showAfterpay: null,
    showKlarna: null,
    infoModalTitle: '',
    infoModalMessage: '',
    infoModalButtonText: '',
    infoModalButtonWidth: null,
    infoModalFooterColumns: null,
    infoModalFooterGridGap: null,
    infoModalFooterDisplay: null,
    infoModalFooterJustifyContent: null,
    infoModalBodyFooterPaddingX: null,
    infoModalShowFooterBorder: false,
    infoModalCallback: null,
    infoModalCancelButtonCallback: null,
    infoModalWidth: null,
    showInfoModalCancelButton: false,
    showInfoModalCancelButtonLeft: false,
    showInfoModalFooter: true,
    showCloseButton: false,
    infoModalCancelText: '',
    infoModalMessageIsHtml: false,
    confirmMsgObj: {},
    showMediaModal: false,
    mediaModalId: '',
    mediaModalTitle: '',
    mediaModalClose: null,
    mediaModalCloseDataAt: null,
    mediaModalBodyDataAt: null,
    dismissButtonText: '',
    dismissButtonDataAt: '',
    modalDataAt: '',
    showSampleModal: false,
    showVideoModal: false,
    showRewardModal: false,
    showApplyRewardsModal: false,
    rewardsType: null,
    showOrderConfirmRewardModal: false,
    sampleList: null,
    rewardList: null,
    allowedQtyPerOrder: 0,
    samplesMessage: '',
    showPromoModal: false,
    showColorIQModal: false,
    colorIQModalCallback: null,
    promoCode: null,
    promosList: null,
    minMsgSkusToSelect: 0,
    maxMsgSkusToSelect: 0,
    instructions: '',
    promoTitleText: '',
    promoCategoryTitle: '',
    showFindInStoreModal: false,
    showFindInStoreMapModal: false,
    storesToShow: null,
    zipCode: null,
    searchedDistance: null,
    currentProduct: null,
    showCountrySwitcherModal: false,
    bccModalTemplate: null,
    signInMessages: null,
    signInCallback: null,
    signInErrback: null,
    signInSource: '',
    registerCallback: null,
    registerErrback: null,
    biRegisterCallback: null,
    biRegisterCancellationCallback: null,
    extraParams: null,
    showQuickLookModal: false,
    quickLookProduct: null,
    skuType: null,
    quickLookSku: null,
    addedProduct: null,
    addedSku: null,
    itemQty: 0,
    desiredCountry: null,
    desiredLang: null,
    presetLogin: null,
    switchCountryName: null,
    showEmailMeWhenInStockModal: false,
    showEditMyProfileModal: false,
    showEditFlowModal: false,
    editFlowTitle: '',
    editFlowContent: null,
    biAccount: null,
    socialProfile: null,
    saveProfileCallback: null,
    saveBeautyTraitCallBack: null,
    showShareLinkModal: false,
    showOrderCancelationModal: false,
    showShareLoveListLinkModal: false,
    shareLoveListUrl: '',
    loveListName: '',
    canceledOrderId: null,
    selfCancelationReasons: null,
    showAddToBasketModal: false,
    preferredStoreName: null,
    subTitle: '',
    error: null,
    showSocialRegistrationModal: false,
    socialRegistrationProvider: null,
    showSocialReOptModal: false,
    socialReOptCallback: null,
    isEditProfileFlow: false,
    isCommunity: false,
    showProductFinderModal: false,
    guidedSellingData: null,
    showAuthenticateModal: false,
    experienceDetail: {},
    reservation: null,
    getGuestDetails: null,
    showProductMediaZoomModal: false,
    showBeautyPreferencesFlow: false,
    showManageListModal: false,
    showDeleteListModal: false,
    customListId: null,
    listName: '',
    loveListId: null,

    //Rouge Reward Card Modal
    showRougeRewardCardModal: false,
    rougeRewardCardModalSku: null,
    rougeRewardCardModalCallback: null,

    showCreditCardPrescreenModal: false,
    showScanRewardCardModal: false,
    showCreditReportDetailsModal: false,
    showExtendSessionModal: false,
    showExtendSessionFailureModal: false,

    showAddressVerificationModal: false,
    verificationType: '',
    currentAddress: null,
    recommendedAddress: null,
    verificationSuccessCallback: null,
    verificationCancelCallback: null,

    showSimilarProducts: false,
    recommendedProductIDs: '',
    brandName: null,
    productName: null,
    productImages: null,
    itemId: null,

    showReserveAndPickUpModal: false,
    reserveAndPickUpModalCallback: null,
    reserveAndPickUpModalMountCallback: null,
    reserveAndPickUpModalCancelCallback: null,
    disableNonBopisStores: false,
    disableOutOfStockStores: false,
    pickupInsteadModalRef: null,
    isRopisSelected: false,
    location: null,
    useBackToStoreLink: false,
    isBopis: false,

    showReviewImageModal: false,
    reviewSelected: null,
    reviewSelectedIndex: null,
    reviewProductTitle: '',
    reviewsWithImage: null,
    reviewUser: null,
    isFromImageCarousel: null,

    showBeautyTraitsModal: false,
    checkStatusCallback: null,
    showCreditCardOfferModal: false,
    rewardsMessagingABTest: false,
    showStoreSwitcherModal: false,
    showStoreDetails: null,
    storeSwitcherOptions: {},
    storeSwitcherAfterCallback: null,

    showShippingDeliveryLocationModal: false,
    shippingDeliveryLocationModalCallback: null,
    shippingDeliveryLocationModalCancelCallback: null,
    shippingDeliveryLocationModalOptions: null,

    showMarkdownModal: false,
    curbsideConciergeInfoModal: null,
    showDeliveryIssueModal: false,

    showConsumerPrivacyModal: false,
    showBeautyPreferencesModal: false,
    showBeautyPreferencesSavedModal: false,

    showShadeFinderQuizModal: false,
    showSMSSignupModal: false,

    showAccountDeactivatedModal: false,
    errorMessageDeactivatedModal: '',

    showCloseAccountModal: false,
    showCheckPasswordModal: false,

    showGalleryLightBoxModal: false,
    activeGalleryItem: null,
    isGalleryCarousel: false,

    // Game Info Modal - START
    showGameInfoModal: false,
    showGameInfoModalConfetti: false,
    showGameInfoModalFooterBorder: false,
    gameInfoModalImagePadding: false,
    gameInoModalCopy: {},
    gameInoModalCtaLabel: '',
    gameInfoModalImage: {},
    gameInfoModalTitle: '',
    gameInoModalCtaDisabled: false,
    gameInoModalCtaAction: {},
    gameInfoModalCtaCallback: null,
    gameInfoModalDescription: '',
    // Game Info Modal - END

    showSMSSignInModal: false,

    showCheckYourEmailModal: false,
    isResetPasswordFlow: false,

    showAddGiftMessageModal: false,
    showRemoveGiftMessageModal: false,
    giftMessageOrderId: null,
    isEditGiftMessage: false,
    email: null,
    token: null,

    showEmailLookupModal: false,
    originalArgumentsObj: {},

    showGalleryLightBoxKebabModal: false,

    showReportContentModal: false,
    languageThemes: [],

    showLocationAndStoresModal: false,

    showGiftAddressWarningModal: false,
    giftAddressWarningRecipientName: null,
    giftAddressWarningCallback: null,
    showResetPasswordConfirmationModal: false,
    showMultipleRougeRewardsModal: false,
    availableRougeRewards: [],
    showRewardsBazaarModal: false,
    showFreeSamplesModal: false,

    showItemSubstitutionModal: false,
    firstChoiceItem: {},

    showBiCardModal: false,
    profileId: '',
    onClickBackButtonBiCardModal: null,
    data: {},
    childData: {},
    mainProductSample: {},
    productSamples: [],
    showEditBeautyPreferencesModal: false,
    beautyPreferencesToSave: [],
    showEDPConfirmRsvpModal: false,
    showPasskeysInfoModal: false,
    showTaxclaimErrorModal: false,
    hideSpoke: null,
    isOrderConfirmation: false,

    showSduAgreementModal: false,

    showAlternatePickupPersonModal: false,
    isCheckout: false,
    showPlaceOrderTermsModal: false,

    showEmailTypoModal: false,
    showRemovePhoneConfirmationModal: false,

    showAutoReplenishProductsModal: false,
    showMyListsModal: false,
    showChooseOptionsModal: false,
    selectedChooseOptionsDeliveryOption: null,
    analyticsContext: null,
    showGenericErrorModal: false,
    showSDULandingPageModal: false
};

// eslint-disable-next-line complexity
const reducer = function (state = initialState, action = {}) {
    switch (action.type) {
        case ENABLE_MODALS: {
            return {
                ...state,
                renderModals: action.payload
            };
        }
        case ACTION_TYPES.SHOW_BEAUTY_PREFERENCES_MODAL: {
            return {
                ...state,
                showBeautyPreferencesModal: action.isOpen
            };
        }
        case ACTION_TYPES.SHOW_BEAUTY_PREFERENCES_SAVED_MODAL: {
            return {
                ...state,
                showBeautyPreferencesSavedModal: action.isOpen,
                close: action.close,
                savedTitle: action.savedTitle,
                savedMessage1: action.savedMessage1,
                savedMessage2: action.savedMessage2,
                savedMessage3: action.savedMessage3,
                linkText: action.linkText,
                keepGoing: action.keepGoing,
                gotIt: action.gotIt,
                callback: action.callback,
                cancelCallback: action.cancelCallback
            };
        }
        case ACTION_TYPES.SHOW_ADD_GIFT_MESSAGE_MODAL: {
            return {
                ...state,
                showAddGiftMessageModal: action.isOpen,
                close: action.close,
                languageThemes: action.languageThemes,
                giftMessageOrderId: action.orderId,
                isEditGiftMessage: action.isEditGiftMessage
            };
        }
        case ACTION_TYPES.SHOW_REMOVE_GIFT_MESSAGE_MODAL: {
            return {
                ...state,
                showRemoveGiftMessageModal: action.isOpen,
                giftMessageOrderId: action.orderId || initialState.giftMessageOrderId
            };
        }
        case ACTION_TYPES.SHOW_WIZARD: {
            return {
                ...state,
                showShadeFinderQuizModal: action.isOpen,
                currentProduct: action.currentProduct,
                componentName: action.componentName
            };
        }
        case ACTION_TYPES.SHOW_BCC_MODAL: {
            return {
                ...state,
                showBccModal: action.isOpen,
                width: action.width,
                seoName: action.seoName,
                bccModalTemplate: action.bccModalTemplate
            };
        }
        case ACTION_TYPES.SHOW_CONTENT_MODAL: {
            return {
                ...state,
                showContentModal: action.isOpen,
                data: action.data
            };
        }
        case ACTION_TYPES.SHOW_CHILD_CONTENT_MODAL: {
            return {
                ...state,
                showChildContentModal: action.isOpen,
                childData: action.childData
            };
        }
        case ACTION_TYPES.SHOW_SIGN_IN_MODAL: {
            return {
                ...state,
                showSignInModal: action.isOpen,
                email: action.email,
                signInMessages: action.messages,
                isNewUserFlow: action.isNewUserFlow,
                signInCallback: action.callback,
                signInErrback: action.errback,
                signInSource: action.source,
                analyticsData: action.analyticsData,
                extraParams: action.extraParams,
                showBeautyPreferencesFlow: action.showBeautyPreferencesFlow,
                isOrderConfirmation: action.isOrderConfirmation
            };
        }
        case ACTION_TYPES.SHOW_AUTHENTICATE_MODAL: {
            const { isOpen, ...restProps } = action;

            return {
                ...state,
                showAuthenticateModal: isOpen,
                ...restProps
            };
        }

        case ACTION_TYPES.SHOW_SIGN_IN_WITH_MESSAGING_MODAL: {
            return {
                ...state,
                showSignInWithMessagingModal: action.isOpen,
                signInMessages: action.messages,
                isGuestBookingEnabled: action.isGuestBookingEnabled,
                potentialServiceBIPoints: action.potentialServiceBIPoints,
                isPaypalFlow: action.isPaypalFlow,
                isApplePayFlow: action.isApplePayFlow,
                signInCallback: action.callback,
                signInErrback: action.errback,
                isCreditCardApply: action.isCreditCardApply,
                extraParams: action.extraParams
            };
        }
        case ACTION_TYPES.SHOW_FORGOT_PASSWORD_MODAL: {
            return {
                ...state,
                showForgotPasswordModal: action.isOpen,
                presetLogin: action.email
            };
        }
        case ACTION_TYPES.SHOW_INFO_MODAL: {
            return {
                ...state,
                showInfoModal: action.isOpen,
                infoModalTitle: action.title,
                infoModalMessage: action.message,
                infoModalCallback: action.callback,
                infoModalButtonText: action.buttonText,
                infoModalButtonWidth: action.buttonWidth,
                infoModalFooterColumns: action.footerColumns,
                infoModalFooterGridGap: action.footerGridGap,
                infoModalFooterDisplay: action.footerDisplay,
                infoModalFooterJustifyContent: action.footerJustifyContent,
                infoModalBodyFooterPaddingX: action.bodyFooterPaddingX,
                infoModalBodyPaddingBottom: action.bodyPaddingBottom,
                infoModalShowFooterBorder: action.showFooterBorder,
                showInfoModalCancelButton: action.showCancelButton,
                showInfoModalCancelButtonLeft: action.showCancelButtonLeft,
                infoModalCancelText: action.cancelText,
                infoModalMessageIsHtml: action.isHtml,
                confirmMsgObj: action.confirmMsgObj,
                infoModalCancelCallback: action.cancelCallback,
                showCloseButton: action.showCloseButton,
                dataAt: action.dataAt,
                dataAtTitle: action.dataAtTitle,
                dataAtMessage: action.dataAtMessage,
                dataAtMessageContext: action.dataAtMessageContext,
                dataAtButton: action.dataAtButton,
                dataAtCancelButton: action.dataAtCancelButton,
                dataAtClose: action.dataAtClose,
                infoModalCancelButtonCallback: action.cancelButtonCallback,
                infoModalWidth: action.width,
                showInfoModalFooter: action.showFooter
            };
        }
        case ACTION_TYPES.SHOW_MOBILE_CONFIRM_MODAL: {
            const { isOpen: showMobileConfirmModal, mobilePhone, onContinue } = action.payload;

            return {
                ...state,
                showMobileConfirmModal,
                mobilePhone,
                onContinue
            };
        }
        case ACTION_TYPES.SHOW_SMS_SIGNUP_MODAL: {
            return {
                ...state,
                showSMSSignupModal: action.isOpen,
                close: action.close
            };
        }
        case ACTION_TYPES.SHOW_BUY_NOW_PAY_LATER_MODAL: {
            return {
                ...state,
                showBuyNowPayLaterModal: action.isOpen,
                buyNowPayLaterInstallment: action.installmentValue,
                buyNowPayLaterTotalAmount: action.totalAmount,
                showAfterpay: action.showAfterpay,
                showKlarna: action.showKlarna,
                showPaypal: action.showPaypal,
                selectedPaymentMethod: action.selectedPaymentMethod
            };
        }
        case ACTION_TYPES.SHOW_MEDIA_MODAL: {
            return {
                ...state,
                showMediaModal: action.isOpen,
                mediaModalId: action.mediaId,
                mediaModalTitle: action.title,
                mediaModalTitleDataAt: action.titleDataAt,
                mediaModalBodyDataAt: action.modalBodyDataAt,
                mediaModalClose: action.modalClose,
                mediaModalCloseDataAt: action.modalCloseDataAt,
                width: action.width,
                showMediaTitle: action.showMediaTitle,
                dismissButtonText: action.dismissButtonText,
                dismissButtonDataAt: action.dismissButtonDataAt,
                modalDataAt: action.modalDataAt
            };
        }
        case ACTION_TYPES.SHOW_SAMPLE_MODAL: {
            return {
                ...state,
                showSampleModal: action.isOpen,
                sampleList: action.sampleList,
                allowedQtyPerOrder: action.allowedQtyPerOrder,
                samplesMessage: action.samplesMessage,
                analyticsContext: action.analyticsContext
            };
        }
        case ACTION_TYPES.SHOW_VIDEO_MODAL: {
            return {
                ...state,
                showVideoModal: action.isOpen,
                videoTitle: action.videoTitle,
                videoModalUpdated: action.videoModalUpdated,
                video: action.video
            };
        }
        case ACTION_TYPES.SHOW_PROMO_MODAL: {
            return {
                ...state,
                showPromoModal: action.isOpen,
                promoCode: action.promoCode,
                promosList: action.promosList,
                minMsgSkusToSelect: action.minMsgSkusToSelect,
                maxMsgSkusToSelect: action.maxMsgSkusToSelect,
                instructions: action.instructions,
                location: action.location,
                successCallback: action.successCallback,
                promoTitleText: action.promoTitleText,
                promoCategoryTitle: action.promoCategoryTitle
            };
        }
        case ACTION_TYPES.SHOW_COLOR_IQ_MODAL: {
            return {
                ...state,
                showColorIQModal: action.isOpen,
                colorIQModalCallback: action.callback
            };
        }
        case ACTION_TYPES.SHOW_REWARD_MODAL: {
            return {
                ...state,
                showRewardModal: action.isOpen
            };
        }
        case ACTION_TYPES.SHOW_APPLY_REWARDS_MODAL: {
            return {
                ...state,
                showApplyRewardsModal: action.isOpen,
                rewardsType: action.rewardsType,
                isBopis: action.isBopis,
                cmsInfoModals: action.cmsInfoModals
            };
        }
        case ACTION_TYPES.SHOW_ORDER_CONFIRM_REWARD_MODAL: {
            return {
                ...state,
                showOrderConfirmRewardModal: action.isOpen,
                rewardList: action.rewardList
            };
        }
        case ACTION_TYPES.SHOW_REGISTER_MODAL: {
            return {
                ...state,
                showRegisterModal: action.isOpen,
                isEmailDisabled: action.isEmailDisabled,
                isSSIEnabled: action.isSSIEnabled,
                openPostBiSignUpModal: action.openPostBiSignUpModal,
                presetLogin: action.presetLogin,
                registerCallback: action.callback,
                isStoreUser: action.isStoreUser,
                biData: action.biData,
                registerErrback: action.errback,
                isCreditCardApply: action.isCreditCardApply,
                analyticsData: action.analyticsData,
                extraParams: action.extraParams,
                isCompleteAccountSetupModal: action.isCompleteAccountSetupModal,
                isEpvEmailValidation: action.isEpvEmailValidation
            };
        }
        case ACTION_TYPES.SHOW_BI_REGISTER_MODAL: {
            return {
                ...state,
                showBiRegisterModal: action.isOpen,
                biRegisterCallback: action.callback,
                biRegisterCancellationCallback: action.cancellationCallback,
                isCommunity: action.isCommunity,
                isCreditCardApply: action.isCreditCardApply,
                analyticsData: action.analyticsData,
                extraParams: action.extraParams
            };
        }
        case ACTION_TYPES.SHOW_QUICK_LOOK_MODAL: {
            return {
                ...state,
                showQuickLookModal: action.isOpen,
                showAddToBasketModal: action.isOpen ? false : state.showAddToBasketModal,
                skuType: action.skuType,
                quickLookSku: action.sku,
                error: action.error,
                platform: action.platform,
                origin: action.origin,
                analyticsContext: action.analyticsContext,
                rootContainerName: action.rootContainerName,
                categoryProducts: action.categoryProducts,
                isCommunityGallery: action.isCommunityGallery,
                communityGalleryAnalytics: action.communityGalleryAnalytics
            };
        }
        case ACTION_TYPES.SHOW_ADD_TO_BASKET_MODAL: {
            const {
                analyticsContext,
                basketType,
                error,
                isOpen: showAddToBasketModal,
                preferredStoreName,
                product: addedProduct,
                qty: itemQty,
                sku: addedSku,
                replenishmentFrequency,
                replenishmentSelected,
                isAutoReplenMostCommon,
                pageName
            } = action.payload;

            return {
                ...state,
                analyticsContext,
                basketType,
                error,
                showAddToBasketModal,
                preferredStoreName,
                addedProduct,
                replenishmentFrequency,
                replenishmentSelected,
                isAutoReplenMostCommon,
                itemQty,
                addedSku,
                pageName
            };
        }
        case ACTION_TYPES.SHOW_EMAIL_WHEN_IN_STOCK_MODAL: {
            return {
                ...state,
                showQuickLookModal: false,
                showEmailMeWhenInStockModal: action.isOpen,
                emailInStockProduct: action.product,
                emailInStockSku: action.currentSku,
                isQuickLook: action.isQuickLook,
                updateEmailButtonCTA: action.updateEmailButtonCTA,
                isComingSoon: action.isComingSoon,
                analyticsContext: action.analyticsContext
            };
        }
        case ACTION_TYPES.UPDATE_QUICK_LOOK: {
            return {
                ...state,
                quickLookProduct: action.quickLookProduct,
                sku: action.sku
            };
        }
        case ACTION_TYPES.SHOW_COUNTRY_SWITCHER_MODAL: {
            return {
                ...state,
                showCountrySwitcherModal: action.isOpen,
                desiredCountry: action.desiredCountry,
                desiredLang: action.desiredLang,
                switchCountryName: action.switchCountryName
            };
        }
        case SHOW_EDIT_MY_PROFILE_MODAL: {
            return {
                ...state,
                showEditMyProfileModal: action.isOpen,
                saveBeautyTraitCallBack: action.saveBeautyTraitCallBack
            };
        }
        case SHOW_EDIT_FLOW_MODAL: {
            return {
                ...state,
                showEditFlowModal: action.isOpen,
                editFlowTitle: action.title,
                editFlowContent: action.content,
                biAccount: action.biAccount,
                socialProfile: action.socialProfile,
                saveProfileCallback: action.saveProfileCallback
            };
        }

        case ACTION_TYPES.SHOW_SHARE_LOVE_LIST_LINK_MODAL: {
            return {
                ...state,
                showShareLoveListLinkModal: action.isOpen,
                shareLoveListUrl: action.shareLoveListUrl,
                loveListName: action.loveListName,
                loveListId: action.loveListId,
                skuIds: action.skuIds
            };
        }

        case ACTION_TYPES.SHOW_SHARE_LINK_MODAL: {
            return {
                ...state,
                showShareLinkModal: action.isOpen,
                title: action.title,
                shareUrl: action.shareUrl,
                subTitle: action.subTitle,
                isGallery: action.isGallery
            };
        }
        case ACTION_TYPES.SHOW_ORDER_CANCELATION_MODAL: {
            return {
                ...state,
                showOrderCancelationModal: action.isOpen,
                canceledOrderId: action.canceledOrderId,
                selfCancelationReasons: action.selfCancelationReasons
            };
        }
        case ACTION_TYPES.SHOW_PRODUCT_FINDER_MODAL: {
            return {
                ...state,
                showProductFinderModal: action.isOpen,
                guidedSellingData: action.bccData
            };
        }
        case ACTION_TYPES.SHOW_FIND_IN_STORE_MODAL: {
            return {
                ...state,
                showFindInStoreModal: action.isOpen,
                currentProduct: action.currentProduct,
                zipCode: action.zipCode,
                searchedDistance: action.searchedDistance,
                storesToShow: action.storesToShow
            };
        }
        case ACTION_TYPES.SHOW_FIND_IN_STORE_MAP_MODAL: {
            return {
                ...state,
                showFindInStoreMapModal: action.isOpen,
                currentProduct: action.currentProduct,
                selectedStore: action.selectedStore,
                zipCode: action.zipCode,
                searchedDistance: action.searchedDistance,
                storesToShow: action.storesToShow,
                useBackToStoreLink: action.useBackToStoreLink
            };
        }
        case SHOW_SOCIAL_REGISTRATION_MODAL: {
            return {
                ...state,
                showSocialRegistrationModal: action.isOpen,
                socialRegistrationProvider: action.socialRegistrationProvider
            };
        }
        case SHOW_SOCIAL_REOPT_MODAL: {
            return {
                ...state,
                showSocialReOptModal: action.isOpen,
                socialReOptCallback: action.socialReOptCallback,
                socialReOptCancellationCallback: action.cancellationCallback
            };
        }
        case ACTION_TYPES.SHOW_ROUGE_REWARD_CARD_MODAL: {
            return {
                ...state,
                showRougeRewardCardModal: action.isOpen,
                rougeRewardCardModalSku: action.sku,
                rougeRewardCardModalCallback: action.callback,
                analyticsContext: action.analyticsContext,
                isRougeExclusiveCarousel: action.isRougeExclusiveCarousel
            };
        }
        case ACTION_TYPES.SHOW_CREDIT_CARD_PRESCREEN_MODAL: {
            return {
                ...state,
                showCreditCardPrescreenModal: action.isOpen,
                response: action.response
            };
        }
        case ACTION_TYPES.SHOW_SCAN_REWARD_CARD_MODAL: {
            return {
                ...state,
                showScanRewardCardModal: action.isOpen
            };
        }
        case ACTION_TYPES.SHOW_CREDIT_REPORT_DETAILS_MODAL: {
            return {
                ...state,
                showCreditReportDetailsModal: action.isOpen,
                content: action.content
            };
        }
        case ACTION_TYPES.SHOW_EXTEND_SESSION_MODAL: {
            return {
                ...state,
                showExtendSessionModal: action.isOpen
            };
        }
        case ACTION_TYPES.SHOW_EXTEND_SESSION_FAILURE_MODAL: {
            return {
                ...state,
                showExtendSessionFailureModal: action.isOpen
            };
        }
        case ACTION_TYPES.SHOW_PRODUCT_MEDIA_ZOOM_MODAL: {
            return {
                ...state,
                showProductMediaZoomModal: action.isOpen,
                product: action.product,
                index: action.index,
                mediaItems: action.mediaItems,
                isGalleryItem: action.isGalleryItem
            };
        }
        case ACTION_TYPES.SHOW_ADDRESS_VERIFICATION_MODAL: {
            return {
                ...state,
                showAddressVerificationModal: action.isOpen,
                verificationType: action.verificationType,
                currentAddress: action.currentAddress,
                recommendedAddress: action.recommendedAddress,
                verificationSuccessCallback: action.successCallback,
                verificationCancelCallback: action.cancelCallback
            };
        }
        case ACTION_TYPES.SHOW_SIMILAR_PRODUCTS_MODAL: {
            return {
                ...state,
                showSimilarProducts: action.isOpen,
                brandName: action.brandName,
                productName: action.productName,
                productImages: action.productImages,
                itemId: action.itemId,
                analyticsContext: action.analyticsContext,
                badgeAltText: action.badgeAltText,
                isYouMayAlsoLike: action.isYouMayAlsoLike,
                productId: action.productId,
                analyticsData: action.analyticsData,
                recommendedProductIDs: action.recommendedProductIDs,
                skuId: action.skuId
            };
        }
        case ACTION_TYPES.SHOW_UFE_MODAL: {
            return {
                ...state,
                showUFEModal: action.isOpen,
                ufeModalId: action.ufeModalId
            };
        }
        case ACTION_TYPES.SHOW_RESERVE_AND_PICK_UP_MODAL: {
            return {
                ...state,
                showReserveAndPickUpModal: action.isOpen,
                reserveAndPickUpModalCallback: action.callback,
                reserveAndPickUpModalMountCallback: action.mountCallback,
                reserveAndPickUpModalCancelCallback: action.cancelCallback,
                currentProduct: action.currentProduct,
                location: action.location,
                searchedDistance: action.searchedDistance,
                storesToShow: action.storesToShow,
                pickupInsteadModalRef: action.pickupInsteadModalRef,
                disableNonBopisStores: action.disableNonBopisStores,
                disableOutOfStockStores: action.disableOutOfStockStores,
                isRopisSelected: action.isRopisSelected
            };
        }
        case ACTION_TYPES.SHOW_REVIEW_IMAGE_MODAL: {
            return {
                ...state,
                showReviewImageModal: action.isOpen,
                reviewProductTitle: action.reviewProductTitle,
                reviewSelected: action.reviewSelected,
                reviewSelectedIndex: action.reviewSelectedIndex,
                reviewUser: action.reviewUser,
                reviewsWithImage: action.reviewsWithImage,
                reviewsReference: action.reviewsReference,
                reviewSelectedPhotoId: action.reviewSelectedPhotoId,
                isFromImageCarousel: action.isFromImageCarousel
            };
        }
        case ACTION_TYPES.SHOW_BEAUTY_TRAITS_MODAL: {
            return {
                ...state,
                showBeautyTraitsModal: action.isOpen,
                checkStatusCallback: action.checkStatusCallback
            };
        }
        case ACTION_TYPES.SHOW_CREDIT_CARD_OFFER_MODAL: {
            return {
                ...state,
                showCreditCardOfferModal: action.isOpen,
                rewardsMessagingABTest: action.rewardsMessagingABTest,
                isBasketPageTest: action.isBasketPageTest
            };
        }
        case ACTION_TYPES.SHOW_FREE_RETURNS_MODAL: {
            return {
                ...state,
                showFreeReturnsModal: action.isOpen
            };
        }
        case ACTION_TYPES.SHOW_STORE_SWITCHER_MODAL: {
            return {
                ...state,
                showStoreSwitcherModal: action.isOpen,
                showStoreDetails: action.showStoreDetails,
                storeSwitcherOptions: action.options,
                storeSwitcherAfterCallback: action.afterCallback,
                preventDefaultSearchUpdates: action.preventDefaultSearchUpdates,
                storeSwitcherEntry: action.entry,
                okButtonText: action.okButtonText,
                showCancelButton: action.showCancelButton
            };
        }
        case ACTION_TYPES.SHOW_SAME_DAY_DELIVERY_LOCATION_MODAL: {
            return {
                ...state,
                showShippingDeliveryLocationModal: action.isOpen,
                shippingDeliveryLocationModalCallback: action.callback,
                shippingDeliveryLocationModalCancelCallback: action.cancelCallback,
                shippingDeliveryLocationModalOptions: action.options,
                primaryButtonText: action.primaryButtonText,
                sku: action.sku
            };
        }
        case ACTION_TYPES.SHOW_CURBSIDE_PICKUP_CHECKIN_MODAL: {
            return {
                ...state,
                showCurbsidePickupCheckinModal: action.isOpen,
                isCurbsideAvailable: action.isCurbsideAvailable
            };
        }
        case ACTION_TYPES.SHOW_MARKDOWN_MODAL: {
            return {
                ...state,
                showMarkdownModal: action.isOpen,
                title: action.title,
                text: action.text
            };
        }
        case ACTION_TYPES.SHOW_MANAGE_LIST_MODAL: {
            return {
                ...state,
                showManageListModal: action.isOpen,
                listName: action.listName,
                loveListId: action.loveListId
            };
        }
        case ACTION_TYPES.SHOW_DELETE_LIST_MODAL: {
            return {
                ...state,
                showDeleteListModal: action.isOpen,
                customListId: action.customListId
            };
        }
        case CURBSIDE_CONCIERGE_INFO_MODAL: {
            return {
                ...state,
                curbsideConciergeInfoModal: action.payload
            };
        }
        case ACTION_TYPES.SHOW_DELIVERY_ISSUE_MODAL: {
            return {
                ...state,
                showDeliveryIssueModal: action.isOpen
            };
        }
        case ACTION_TYPES.SHOW_CONSUMER_PRIVACY_MODAL: {
            return {
                ...state,
                showConsumerPrivacyModal: action.isOpen
            };
        }
        case ACTION_TYPES.SHOW_CLOSE_ACCOUNT_MODAL: {
            return {
                ...state,
                showCloseAccountModal: action.isOpen
            };
        }
        case ACTION_TYPES.SHOW_CHECK_PASSWORD_MODAL: {
            return {
                ...state,
                showCheckPasswordModal: action.isOpen,
                checkPasswordErrorMessages: action.errorMessages
            };
        }
        case ACTION_TYPES.SHOW_ACCOUNT_DEACTIVATED_MODAL: {
            return {
                ...state,
                showAccountDeactivatedModal: action.isOpen,
                errorMessageDeactivatedModal: action.errorMessage
            };
        }
        case ACTION_TYPES.SHOW_GALLERY_LIGHTBOX_MODAL: {
            return {
                ...state,
                showGalleryLightBoxModal: action.isOpen,
                activeGalleryItem: action.activeItem,
                isGalleryCarousel: action.isGalleryCarousel,
                galleryItems: action.galleryItems,
                isPdpCarousel: action.isPdpCarousel,
                sharedItem: action.sharedItem
            };
        }
        case ACTION_TYPES.SHOW_GAME_INFO_MODAL: {
            return {
                ...state,
                showGameInfoModal: action.isOpen,
                gameInoModalCopy: action.copy,
                gameInfoModalStatus: action.modalStatus,
                gameInoModalCtaLabel: action.ctaLabel,
                gameInfoModalImage: action.image,
                gameInfoModalTitle: action.title,
                gameInoModalCtaDisabled: action.ctaDisabled,
                gameInoModalCtaAction: action.ctaAction,
                gameInfoModalCtaCallback: action.ctaCallback,
                gameInfoModalDismissCallback: action.dismissCallback,
                gameInfoModalDescription: action.description,
                gameInfoModalImagePadding: action.imagePadding,
                showGameInfoModalConfetti: action.showConfetti,
                showGameInfoModalFooterBorder: action.footerBorder
            };
        }
        case ACTION_TYPES.SHOW_CHECK_YOUR_EMAIL_MODAL: {
            return {
                ...state,
                showCheckYourEmailModal: action.isOpen,
                isResetPasswordFlow: action.isResetPasswordFlow,
                showSignInWithMessagingModal: false,
                showForgotPasswordModal: false,
                showSignInModal: false,
                email: action.email,
                token: action.token
            };
        }
        case ACTION_TYPES.SHOW_EMAIL_LOOKUP_MODAL: {
            return {
                ...state,
                showEmailLookupModal: action.isOpen,
                originalArgumentsObj: action.originalArgumentsObj
            };
        }
        case ACTION_TYPES.SHOW_SMS_SIGNIN_MODAL: {
            return Object.assign({}, state, {
                showSMSSignInModal: action.isOpen,
                phoneNumber: action.phoneNumber,
                extraParams: action.extraParams,
                close: action.close
            });
        }
        case ACTION_TYPES.SHOW_GALLERY_LIGHTBOX_KEBAB_MODAL: {
            return {
                ...state,
                showGalleryLightBoxKebabModal: action.isOpen,
                photoId: action.photoId,
                isLoggedInUserPhoto: action.isLoggedInUserPhoto
            };
        }
        case ACTION_TYPES.SHOW_REPORT_CONTENT_MODAL: {
            return {
                ...state,
                showReportContentModal: action.isOpen,
                shareReportUrl: action.shareUrl
            };
        }
        case ACTION_TYPES.SHOW_LOCATION_AND_STORES_MODAL: {
            return {
                ...state,
                showLocationAndStoresModal: action.isOpen
            };
        }
        case ACTION_TYPES.SHOW_GIFT_ADDRESS_WARNING_MODAL: {
            return {
                ...state,
                showGiftAddressWarningModal: action.isOpen,
                giftAddressWarningRecipientName: action.recipientName,
                giftAddressWarningCallback: action.placeOrderCallback
            };
        }

        case ACTION_TYPES.SHOW_RESET_PASSWORD_CONFIRMATION_MODAL: {
            return {
                ...state,
                showResetPasswordConfirmationModal: action.isOpen,
                email: action.email
            };
        }

        case ACTION_TYPES.SHOW_MULTIPLE_ROUGE_REWARDS_MODAL: {
            return {
                ...state,
                showMultipleRougeRewardsModal: action.isOpen,
                availableRougeRewards: action.availableRougeRewards
            };
        }

        case ACTION_TYPES.SHOW_REWARDS_BAZAAR_MODAL: {
            return {
                ...state,
                showRewardsBazaarModal: action.isOpen,
                analyticsData: action.analyticsData,
                source: action.source
            };
        }

        case ACTION_TYPES.SHOW_FREE_SAMPLES_MODAL: {
            return {
                ...state,
                showFreeSamplesModal: action.isOpen
            };
        }

        case ACTION_TYPES.SHOW_ITEM_SUBSTITUTION_MODAL: {
            return {
                ...state,
                showItemSubstitutionModal: action.isOpen,
                firstChoiceItem: action.firstChoiceItem
            };
        }

        case ACTION_TYPES.SHOW_BI_CARD_MODAL: {
            return {
                ...state,
                showBiCardModal: action.isOpen,
                profileId: action.profileId,
                onClickBackButtonBiCardModal: action.onBackButtonClick
            };
        }

        case ACTION_TYPES.SHOW_PRODUCT_SAMPLES_MODAL: {
            return {
                ...state,
                showProductSamplesModal: action.isOpen,
                mainProductSample: action.mainProductSample,
                productSamples: action.samples
            };
        }

        case ACTION_TYPES.SHOW_EDIT_BEAUTY_PREFERENCES_MODAL: {
            return {
                ...state,
                showEditBeautyPreferencesModal: action.isOpen,
                beautyPreferencesToSave: action.beautyPreferencesToSave,
                categorySpecificMasterList: action.categorySpecificMasterList,
                hideSpoke: action.hideSpoke
            };
        }

        case ACTION_TYPES.SHOW_EDP_CONFIRM_RSVP_MODAL: {
            return {
                ...state,
                showEDPConfirmRsvpModal: action.isOpen,
                eventDisplayName: action.eventDisplayName,
                storeDisplayName: action.storeDisplayName,
                timeSlot: action.timeSlot,
                timeZone: action.timeZone,
                edpInfo: action.edpInfo,
                storeId: action.storeId,
                user: action.user
            };
        }

        case ACTION_TYPES.SHOW_PASSKEYS_INFO_MODAL: {
            return {
                ...state,
                showPasskeysInfoModal: action.isOpen
            };
        }

        case ACTION_TYPES.SHOW_TAXCLAIM_ERROR_MODAL: {
            return {
                ...state,
                showTaxclaimErrorModal: {
                    isOpen: action.isOpen,
                    errorType: action.errorType,
                    errorTypeLocaleMessage: action.errorTypeLocaleMessage
                }
            };
        }

        case ACTION_TYPES.SHOW_SDU_AGREEMENT_MODAL: {
            return {
                ...state,
                showSduAgreementModal: action.isOpen,
                isBopis: action.isBopis,
                canCheckoutPaze: action.canCheckoutPaze,
                isSDUItemInBasket: action.isSDUItemInBasket
            };
        }

        case ACTION_TYPES.SHOW_ALTERNATE_PICKUP_PERSON_MODAL: {
            return {
                ...state,
                showAlternatePickupPersonModal: action.isOpen,
                alternatePickupData: action.alternatePickupData
            };
        }

        case ACTION_TYPES.SHOW_PLACE_ORDER_TERMS_MODAL: {
            return {
                ...state,
                showPlaceOrderTermsModal: action.isOpen,
                autoReplenishOnly: action.arOnly
            };
        }

        case ACTION_TYPES.SHOW_EMAIL_TYPO_MODAL: {
            return {
                ...state,
                showEmailTypoModal: action.isOpen,
                isNewUserFlow: action.isNewUserFlow,
                email: action.email,
                onCancel: action.onCancel,
                onContinue: action.onContinue
            };
        }
        case ACTION_TYPES.SHOW_REMOVE_PHONE_CONFIRMATION_MODAL: {
            return {
                ...state,
                showRemovePhoneConfirmationModal: action.isOpen,
                phoneNumber: action.phoneNumber,
                onCancel: action.onCancel,
                onContinue: action.onContinue
            };
        }

        case ACTION_TYPES.SHOW_AUTOREPLENISH_PRODUCTS_MODAL: {
            return {
                ...state,
                showAutoReplenishProductsModal: action.isOpen
            };
        }

        case ACTION_TYPES.SHOW_MY_LISTS_MODAL: {
            return {
                ...state,
                showMyListsModal: action.showMyListsModal,
                showCreateListModal: action.showCreateListModal
            };
        }

        case ACTION_TYPES.SHOW_CHOOSE_OPTIONS_MODAL: {
            return {
                ...state,
                showChooseOptionsModal: action.isOpen,
                skuType: action.skuType,
                sku: action.sku,
                product: action.product,
                analyticsContext: action.analyticsContext,
                pageName: action.pageName,
                error: action.error,
                // Reset delivery option when modal closes to start fresh for new sessions
                selectedChooseOptionsDeliveryOption: action.isOpen ? state.selectedChooseOptionsDeliveryOption : null
            };
        }

        case ACTION_TYPES.SET_CHOOSE_OPTIONS_DELIVERY_OPTION: {
            return {
                ...state,
                selectedChooseOptionsDeliveryOption: action.deliveryOption
            };
        }

        case ACTION_TYPES.SHOW_GENERIC_ERROR_MODAL: {
            return {
                ...state,
                showGenericErrorModal: action.isOpen,
                genericErrorTitle: action.title,
                genericErrorHeader: action.header,
                genericErrorContent: action.content,
                genericErrorCta: action.cta
            };
        }

        case ACTION_TYPES.SHOW_GLOBAL_SDU_LANDING_PAGE_MODAL: {
            const { payload, isOpen = false } = action;

            return {
                ...state,
                ...payload,
                showSDULandingPageModal: isOpen
            };
        }

        default: {
            return state;
        }
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
