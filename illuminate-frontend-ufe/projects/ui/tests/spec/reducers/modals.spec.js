/* eslint-disable object-curly-newline, no-console */
const { objectContaining } = jasmine;
const modalReducer = require('reducers/modals').default;
const ACTION_TYPES = require('actions/Actions').default.TYPES;

describe('modals reducer', () => {
    let initialState;
    let expectedState;

    beforeEach(function () {
        initialState = {
            renderModals: false,
            showBccModal: false,
            seoName: null,
            width: null,
            showRegisterModal: false,
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
            infoModalCallback: null,
            infoModalFooterColumns: null,
            infoModalFooterGridGap: null,
            infoModalBodyFooterPaddingX: null,
            showInfoModalCancelButton: false,
            showInfoModalCancelButtonLeft: false,
            infoModalButtonWidth: null,
            infoModalFooterDisplay: null,
            infoModalFooterJustifyContent: null,
            infoModalShowFooterBorder: false,
            infoModalCancelButtonCallback: null,
            infoModalWidth: null,
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
            promoTitleText: '',
            promoCategoryTitle: '',
            showAddToBasketModal: false,
            preferredStoreName: null,
            showColorIQModal: false,
            colorIQModalCallback: null,
            promoCode: null,
            promosList: null,
            minMsgSkusToSelect: 0,
            maxMsgSkusToSelect: 0,
            instructions: '',
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
            saveBeautyTraitCallBack: null,
            saveProfileCallback: null,
            showShareLinkModal: false,
            showOrderCancelationModal: false,
            showShareLoveListLinkModal: false,
            shareLoveListUrl: '',
            loveListName: '',
            canceledOrderId: null,
            selfCancelationReasons: null,
            subTitle: '',
            error: null,
            showSocialRegistrationModal: false,
            socialRegistrationProvider: null,
            showSocialReOptModal: false,
            socialReOptCallback: null,
            isEditProfileFlow: false,
            isCommunity: false,
            showProductFinderModal: false,
            showProductMediaZoomModal: false,
            guidedSellingData: null,
            showAuthenticateModal: false,
            experienceDetail: {},
            showRougeRewardCardModal: false,
            rougeRewardCardModalSku: null,
            rougeRewardCardModalCallback: null,
            showCreditCardPrescreenModal: false,
            showScanRewardCardModal: false,
            showCreditReportDetailsModal: false,
            showExtendSessionModal: false,
            showExtendSessionFailureModal: false,
            reservation: null,
            getGuestDetails: null,
            showAddressVerificationModal: false,
            verificationType: '',
            currentAddress: null,
            recommendedAddress: null,
            verificationSuccessCallback: null,
            verificationCancelCallback: null,
            showSimilarProducts: false,
            brandName: null,
            productName: null,
            productImages: null,
            itemId: null,
            showReserveAndPickUpModal: false,
            disableNonBopisStores: false,
            disableOutOfStockStores: false,
            pickupInsteadModalRef: null,
            reserveAndPickUpModalCallback: null,
            reserveAndPickUpModalMountCallback: null,
            reserveAndPickUpModalCancelCallback: null,
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
            showStoreSwitcherModal: false,
            showStoreDetails: null,
            storeSwitcherOptions: {},
            storeSwitcherAfterCallback: null,
            showShippingDeliveryLocationModal: false,
            shippingDeliveryLocationModalOptions: null,
            shippingDeliveryLocationModalCallback: null,
            shippingDeliveryLocationModalCancelCallback: null,
            recommendedProductIDs: '',
            showMarkdownModal: false,
            curbsideConciergeInfoModal: null,
            rewardsMessagingABTest: false,
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
            showCheckYourEmailModal: false,
            isResetPasswordFlow: false,
            email: null,
            token: null,
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
            showSMSSignInModal: false,
            showEmailLookupModal: false,
            originalArgumentsObj: {},
            isEmailDisabled: false,
            showAddGiftMessageModal: false,
            showRemoveGiftMessageModal: false,
            giftMessageOrderId: null,
            showGalleryLightBoxKebabModal: false,
            showReportContentModal: false,
            languageThemes: [],
            showLocationAndStoresModal: false,
            isEditGiftMessage: false,
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
            showBeautyPreferencesFlow: false,
            showManageListModal: false,
            showDeleteListModal: false,
            customListId: null,
            listName: '',
            loveListId: null,
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
            showAutoReplenishProductsModal: false,
            showInfoModalFooter: true,
            showMyListsModal: false,
            showChooseOptionsModal: false,
            selectedChooseOptionsDeliveryOption: null,
            showRemovePhoneConfirmationModal: false,
            analyticsContext: null,
            showGenericErrorModal: false,
            showSDULandingPageModal: false
        };

        expectedState = Object.assign({}, initialState);
    });

    it('should return the initial state', () => {
        expect(modalReducer(undefined, {})).toEqual(initialState);
    });

    it('should enable/disable the bcc modal', () => {
        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_BCC_MODAL,
            isOpen: true,
            seoName: null,
            width: null,
            bccModalTemplate: {}
        });

        expectedState.showBccModal = true;
        expectedState.bccModalTemplate = {};

        expect(newState).toEqual(expectedState);
    });

    it('should enable/disable the sign in modal', () => {
        const message = 'Signed in successfully';

        const callback = function () {
            console.log(message);
        };

        const errback = function () {
            console.log(message);
        };

        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_SIGN_IN_MODAL,
            isOpen: true,
            isNewUserFlow: false,
            messages: message,
            callback: callback,
            errback: errback,
            source: 'test',
            analyticsData: null,
            extraParams: null,
            email: null,
            showBeautyPreferencesFlow: false,
            isOrderConfirmation: false
        });

        expectedState.showSignInModal = true;
        expectedState.signInMessages = message;
        expectedState.signInCallback = callback;
        expectedState.signInErrback = errback;
        expectedState.isNewUserFlow = false;
        expectedState.analyticsData = null;
        expectedState.extraParams = null;
        expectedState.signInSource = 'test';

        expect(newState).toEqual(expectedState);
    });

    it('should enable/disable the sign in with messaging modal', () => {
        const message = 'Signed in successfully';

        const callback = function () {
            console.log(message);
        };

        const errback = function () {
            console.log(message);
        };

        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_SIGN_IN_WITH_MESSAGING_MODAL,
            isOpen: true,
            isPaypalFlow: undefined,
            isApplePayFlow: undefined,
            isGuestBookingEnabled: undefined,
            potentialServiceBIPoints: undefined,
            messages: message,
            callback: callback,
            errback: errback,
            isCreditCardApply: true,
            extraParams: null
        });

        expectedState.showSignInWithMessagingModal = true;
        expectedState.signInMessages = message;
        expectedState.signInCallback = callback;
        expectedState.signInErrback = errback;
        expectedState.isPaypalFlow = undefined;
        expectedState.isApplePayFlow = undefined;
        expectedState.isGuestBookingEnabled = undefined;
        expectedState.potentialServiceBIPoints = undefined;
        expectedState.isCreditCardApply = true;

        expect(newState).toEqual(expectedState);
    });

    it('should enable/disable the quicklook modal', () => {
        const mockSku = {};
        const mockedError = {};
        const mocketPlatform = 'platform';
        const mockedOrigin = 'creditcard';
        const mockedRootContainerName = 'just arrived';
        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_QUICK_LOOK_MODAL,
            isOpen: true,
            skuType: 'STANDARD',
            sku: mockSku,
            error: mockedError,
            platform: mocketPlatform,
            origin: mockedOrigin,
            rootContainerName: mockedRootContainerName,
            analyticsContext: 'analyticsContext',
            categoryProducts: [],
            isCommunityGallery: undefined,
            communityGalleryAnalytics: undefined
        });

        expectedState.showQuickLookModal = true;
        expectedState.skuType = 'STANDARD';
        expectedState.quickLookSku = mockSku;
        expectedState.error = mockedError;
        expectedState.platform = mocketPlatform;
        expectedState.origin = mockedOrigin;
        expectedState.rootContainerName = mockedRootContainerName;
        expectedState.analyticsContext = 'analyticsContext';
        expectedState.categoryProducts = [];
        expectedState.isCommunityGallery = undefined;
        expectedState.communityGalleryAnalytics = undefined;

        expect(newState).toEqual(expectedState);
    });

    it('should enable/disable the quicklook modal as reward', () => {
        const mockSku = {};
        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_QUICK_LOOK_MODAL,
            isOpen: true,
            skuType: 'REWARD',
            sku: mockSku,
            error: null,
            platform: null,
            origin: null,
            rootContainerName: null,
            analyticsContext: 'analyticsContext',
            categoryProducts: [],
            isCommunityGallery: undefined,
            communityGalleryAnalytics: undefined
        });

        expectedState.showQuickLookModal = true;
        expectedState.skuType = 'REWARD';
        expectedState.quickLookSku = mockSku;
        expectedState.error = null;
        expectedState.platform = null;
        expectedState.origin = null;
        expectedState.rootContainerName = null;
        expectedState.analyticsContext = 'analyticsContext';
        expectedState.categoryProducts = [];
        expectedState.isCommunityGallery = undefined;
        expectedState.communityGalleryAnalytics = undefined;

        expect(newState).toEqual(expectedState);
    });

    it('should update the quicklook product', () => {
        const mockProduct = {
            seoName: 'they-re-real-lengthening-volumizing-mascara-P289307',
            seoTitle: 'They`re Real! Lengthening & Volumizing Mascara - Benefit Cosmetics'
        };

        const mockSku = {};

        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.UPDATE_QUICK_LOOK,
            quickLookProduct: mockProduct,
            sku: mockSku
        });

        expectedState.quickLookProduct = mockProduct;
        expectedState.sku = mockSku;

        expect(newState).toEqual(expectedState);
    });

    it('should enable/disabled the country switcher modal', () => {
        let newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_COUNTRY_SWITCHER_MODAL,
            isOpen: true,
            desiredCountry: 'US',
            desiredLang: 'EN',
            switchCountryName: 'United States'
        });

        expectedState.showCountrySwitcherModal = true;
        expectedState.desiredCountry = 'US';
        expectedState.desiredLang = 'EN';
        expectedState.switchCountryName = 'United States';

        expect(newState).toEqual(expectedState);

        newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_COUNTRY_SWITCHER_MODAL,
            isOpen: true,
            desiredCountry: 'CA',
            desiredLang: 'EN',
            switchCountryName: 'Canada'
        });

        expectedState.desiredCountry = 'CA';
        expectedState.desiredLang = 'EN';
        expectedState.switchCountryName = 'Canada';

        expect(newState).toEqual(expectedState);

        newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_COUNTRY_SWITCHER_MODAL,
            isOpen: true,
            desiredCountry: 'CA',
            desiredLang: 'FR',
            switchCountryName: 'Canada'
        });

        expectedState.desiredCountry = 'CA';
        expectedState.desiredLang = 'FR';
        expectedState.switchCountryName = 'Canada';

        expect(newState).toEqual(expectedState);
    });

    it('should enable/disable the forgot password modal', () => {
        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_FORGOT_PASSWORD_MODAL,
            isOpen: true,
            email: 'a@b.com'
        });

        expectedState.showForgotPasswordModal = true;
        expectedState.presetLogin = 'a@b.com';

        expect(newState).toEqual(expectedState);
    });

    it('should enable/disable the info modal', () => {
        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_INFO_MODAL,
            isOpen: true,
            title: 'blah',
            message: 'this is a message',
            buttonText: '',
            buttonWidth: null,
            callback: null,
            cancelCallback: null,
            showCancelButton: false,
            showCancelButtonLeft: false,
            cancelText: '',
            footerColumns: null,
            footerGridGap: null,
            footerDisplay: null,
            footerJustifyContent: null,
            bodyFooterPaddingX: null,
            showFooterBorder: false,
            isHtml: false,
            confirmMsgObj: {},
            showCloseButton: false,
            dataAt: 'dataAt',
            dataAtTitle: 'dataAtTitle',
            dataAtMessage: 'dataAtMessage',
            dataAtMessageContext: 'dataAtMessageContext',
            dataAtButton: 'dataAtButton',
            dataAtCancelButton: 'dataAtCancelButton',
            dataAtClose: 'dataAtClose',
            cancelButtonCallback: null,
            width: null,
            showFooter: false
        });

        expectedState.showInfoModal = true;
        expectedState.infoModalTitle = 'blah';
        expectedState.infoModalMessage = 'this is a message';
        expectedState.infoModalButtonText = '';
        expectedState.infoModalButtonWidth = null;
        expectedState.infoModalCancelButtonCallback = null;
        expectedState.infoModalCallback = null;
        expectedState.infoModalCancelCallback = null;
        expectedState.showInfoModalCancelButton = false;
        expectedState.showInfoModalCancelButtonLeft = false;
        expectedState.infoModalCancelText = '';
        expectedState.infoModalFooterColumns = null;
        expectedState.infoModalFooterGridGap = null;
        expectedState.infoModalFooterDisplay = null;
        expectedState.infoModalFooterJustifyContent = null;
        expectedState.infoModalShowFooterBorder = false;
        expectedState.infoModalMessageIsHtml = false;
        expectedState.infoModalBodyPaddingBottom = undefined;
        expectedState.infoModalWidth = null;
        expectedState.confirmMsgObj = {};
        expectedState.dataAt = 'dataAt';
        expectedState.dataAtTitle = 'dataAtTitle';
        expectedState.dataAtMessage = 'dataAtMessage';
        expectedState.dataAtMessageContext = 'dataAtMessageContext';
        expectedState.dataAtButton = 'dataAtButton';
        expectedState.dataAtCancelButton = 'dataAtCancelButton';
        expectedState.dataAtClose = 'dataAtClose';
        expectedState.showInfoModalFooter = false;

        expect(newState).toEqual(expectedState);
    });

    it('should enable the register modal', () => {
        const callback = function () {
            console.log('');
        };

        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_REGISTER_MODAL,
            isOpen: true,
            openPostBiSignUpModal: false,
            presetLogin: false,
            callback: callback,
            isStoreUser: false,
            biData: null,
            errback: null,
            isCreditCardApply: false,
            analyticsData: 'analytics',
            extraParams: null,
            isCompleteAccountSetupModal: false,
            isEmailDisabled: false,
            isSSIEnabled: false
        });

        expectedState.showRegisterModal = true;
        expectedState.openPostBiSignUpModal = false;
        expectedState.registerCallback = callback;
        expectedState.presetLogin = false;
        expectedState.isStoreUser = false;
        expectedState.biData = null;
        expectedState.registerErrback = null;
        expectedState.isCreditCardApply = false;
        expectedState.analyticsData = 'analytics';
        expectedState.extraParams = null;
        expectedState.isCompleteAccountSetupModal = false;
        expectedState.isSSIEnabled = false;
        expectedState.isEpvEmailValidation = undefined;

        expect(newState).toEqual(expectedState);
    });

    it('should enable the bi register modal', () => {
        const callback = function () {
            console.log('');
        };

        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_BI_REGISTER_MODAL,
            isOpen: true,
            callback: callback,
            isCommunity: false,
            cancellationCallback: null,
            isCreditCardApply: false,
            analyticsData: 'analytics',
            extraParams: null
        });

        expectedState.showBiRegisterModal = true;
        expectedState.biRegisterCallback = callback;
        expectedState.isCommunity = false;
        expectedState.biRegisterCancellationCallback = null;
        expectedState.isCreditCardApply = false;
        expectedState.analyticsData = 'analytics';
        expectedState.extraParams = null;

        expect(newState).toEqual(expectedState);
    });

    it('should enable address verification modal', () => {
        const callback = function () {};

        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_ADDRESS_VERIFICATION_MODAL,
            isOpen: true,
            verificationType: 'my type',
            currentAddress: {},
            recommendedAddress: {},
            successCallback: callback,
            cancelCallback: callback
        });

        expectedState.showAddressVerificationModal = true;
        expectedState.verificationType = 'my type';
        expectedState.currentAddress = {};
        expectedState.recommendedAddress = {};
        expectedState.verificationSuccessCallback = callback;
        expectedState.verificationCancelCallback = callback;

        expect(newState).toEqual(expectedState);
    });

    it('should enable similar products modal', () => {
        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_SIMILAR_PRODUCTS_MODAL,
            isOpen: true,
            brandName: 'my brand',
            productName: 'my product',
            productImages: [{}],
            itemId: 'P123',
            analyticsContext: 'analyticsContext',
            badgeAltText: 'my badge',
            isYouMayAlsoLike: true,
            productId: 'P123',
            analyticsData: {
                linkData: 'purchase history'
            },
            recommendedProductIDs: '',
            skuId: ''
        });

        expectedState.showSimilarProducts = true;
        expectedState.brandName = 'my brand';
        expectedState.productName = 'my product';
        expectedState.productImages = [{}];
        expectedState.itemId = 'P123';
        expectedState.analyticsContext = 'analyticsContext';
        expectedState.badgeAltText = 'my badge';
        expectedState.isYouMayAlsoLike = true;
        expectedState.productId = 'P123';
        expectedState.analyticsData = {
            linkData: 'purchase history'
        };
        expectedState.skuId = '';

        expect(newState).toEqual(expectedState);
    });

    it('should enable rewards modal', () => {
        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_APPLY_REWARDS_MODAL,
            isOpen: true,
            rewardsType: 'CBR',
            isBopis: false,
            cmsInfoModals: {}
        });

        expectedState.showApplyRewardsModal = true;
        expectedState.rewardsType = 'CBR';
        expectedState.isBopis = false;
        expectedState.cmsInfoModals = {};

        expect(newState).toEqual(expectedState);
    });

    it('should create new state when action of type === ACTION_TYPES.SHOW_ADD_TO_BASKET_MODAL comes', () => {
        // Arrange
        const action = {
            type: ACTION_TYPES.SHOW_QUICK_LOOK_MODAL,
            showAddToBasketModal: 'showAddToBasketModal',
            addedProduct: 'addedProduct',
            addedSku: 'addedSku',
            itemQty: 'itemQtyqty',
            error: 'error',
            analyticsContext: 'analyticsContext'
        };

        // Act
        const newState = modalReducer(initialState, action);

        // Assert
        // eslint-disable-next-line no-unused-vars
        const { restAction } = action;
        expect(newState).toEqual(objectContaining({ ...restAction }));
    });

    it('should open Store Switcher modal', () => {
        const callback = () => {};
        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_STORE_SWITCHER_MODAL,
            isOpen: true,
            options: {},
            afterCallback: callback
        });

        expectedState.storeSwitcherOptions = {};
        expectedState.showStoreDetails = undefined;
        expectedState.showStoreSwitcherModal = true;
        expectedState.storeSwitcherAfterCallback = callback;
        expectedState.preventDefaultSearchUpdates = undefined;
        expectedState.okButtonText = undefined;
        expectedState.showCancelButton = undefined;
        expectedState.storeSwitcherEntry = undefined;

        expect(newState).toEqual(expectedState);
    });

    it('should enable/disable the Consumer Privacy modal', () => {
        const newState = modalReducer(initialState, {
            type: ACTION_TYPES.SHOW_CONSUMER_PRIVACY_MODAL,
            isOpen: true
        });

        expectedState.showConsumerPrivacyModal = true;

        expect(newState).toEqual(expectedState);
    });
});
