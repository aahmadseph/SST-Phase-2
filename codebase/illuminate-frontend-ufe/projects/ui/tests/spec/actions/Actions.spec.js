const { BasketType } = require('constants/Basket').default;

describe('Actions', () => {
    let processStub;
    let setNextPageDataStub;

    const Actions = require('actions/Actions').default;
    const processEvent = require('analytics/processEvent').default;
    const anaUtils = require('analytics/utils').default;

    beforeEach(() => {
        processStub = spyOn(processEvent, 'process');
        setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
    });

    describe('showBccModal', () => {
        it('should return a TYPE of SHOW_BCC_MODAL', () => {
            const result = Actions.showBccModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_BCC_MODAL);
        });
    });

    describe('showSignInModal', () => {
        it('should return a TYPE of SHOW_SIGN_IN_MODAL', () => {
            const result = Actions.showSignInModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_SIGN_IN_MODAL);
        });

        it('should not call to setNextPageData if is not open', () => {
            Actions.showSignInModal({ isOpen: false });
            expect(setNextPageDataStub).not.toHaveBeenCalled();
        });

        it('should not call to process if is not open', () => {
            Actions.showSignInModal({ isOpen: false });
            expect(processStub).not.toHaveBeenCalled();
        });

        // it('should call to process if is open', () => {
        //     Actions.showSignInModal({ isOpen: true });
        //     expect(processStub).toHaveBeenCalledWith('asyncPageLoad', objectContaining({}));
        // });
    });

    describe('showSignInWithMessagingModal', () => {
        it('should return a TYPE of SHOW_SIGN_IN_WITH_MESSAGING_MODAL', () => {
            const result = Actions.showSignInWithMessagingModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_SIGN_IN_WITH_MESSAGING_MODAL);
        });

        it('should not call to process if is not open', () => {
            Actions.showSignInWithMessagingModal({ isOpen: false });
            expect(processStub).not.toHaveBeenCalled();
        });

        // it('should call to process if is open', () => {
        //     Actions.showSignInWithMessagingModal({ isOpen: true });
        //     expect(processStub).toHaveBeenCalledWith('asyncPageLoad', objectContaining({}));
        // });
    });

    describe('showAuthenticateModal', () => {
        it('should return a TYPE of SHOW_AUTHENTICATE_MODAL', () => {
            const result = Actions.showAuthenticateModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_AUTHENTICATE_MODAL);
        });
    });

    describe('showForgotPasswordModal', () => {
        it('should return a TYPE of SHOW_FORGOT_PASSWORD_MODAL', () => {
            const result = Actions.showForgotPasswordModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_FORGOT_PASSWORD_MODAL);
        });
    });

    describe('showInfoModal', () => {
        it('should return a TYPE of SHOW_INFO_MODAL', () => {
            const result = Actions.showInfoModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_INFO_MODAL);
        });
    });

    describe('showMediaModal', () => {
        it('should return a TYPE of SHOW_MEDIA_MODAL', () => {
            const result = Actions.showMediaModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_MEDIA_MODAL);
        });
    });

    describe('showColorIQModal', () => {
        it('should return a TYPE of SHOW_COLOR_IQ_MODAL', () => {
            const result = Actions.showColorIQModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_COLOR_IQ_MODAL);
        });
    });

    describe('showRegisterModal', () => {
        it('should return a TYPE of SHOW_REGISTER_MODAL', () => {
            const result = Actions.showRegisterModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_REGISTER_MODAL);
        });
    });

    describe('showBiRegisterModal', () => {
        it('should return a TYPE of SHOW_BI_REGISTER_MODAL', () => {
            const result = Actions.showBiRegisterModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_BI_REGISTER_MODAL);
        });
    });

    describe('forceRegisterModal', () => {
        it('should return a TYPE of SHOW_BI_REGISTER_MODAL', () => {
            const result = Actions.forceRegisterModal(true);
            expect(result.type).toEqual(Actions.TYPES.SHOW_BI_REGISTER_MODAL);
        });

        it('should return a TYPE of SHOW_REGISTER_MODAL', () => {
            const result = Actions.forceRegisterModal(false);
            expect(result.type).toEqual(Actions.TYPES.SHOW_REGISTER_MODAL);
        });
    });

    describe('showSampleModal', () => {
        it('should return a TYPE of SHOW_SAMPLE_MODAL', () => {
            const result = Actions.showSampleModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_SAMPLE_MODAL);
        });
    });

    describe('showVideoModal', () => {
        it('should return a TYPE of SHOW_VIDEO_MODAL', () => {
            const result = Actions.showVideoModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_VIDEO_MODAL);
        });
    });

    describe('showPromoModal', () => {
        it('should return a TYPE of SHOW_PROMO_MODAL', () => {
            const result = Actions.showPromoModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_PROMO_MODAL);
        });
    });

    describe('showRewardModal', () => {
        it('should return a TYPE of SHOW_REWARD_MODAL', () => {
            const result = Actions.showRewardModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_REWARD_MODAL);
        });
    });

    describe('showOrderConfirmRewardModal', () => {
        it('should return a TYPE of SHOW_ORDER_CONFIRM_REWARD_MODAL', () => {
            const result = Actions.showOrderConfirmRewardModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_ORDER_CONFIRM_REWARD_MODAL);
        });
    });

    describe('showQuickLookModal', () => {
        it('should return a TYPE of SHOW_QUICK_LOOK_MODAL', () => {
            const result = Actions.showQuickLookModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_QUICK_LOOK_MODAL);
        });
    });

    describe('showAddToBasketModal', () => {
        it('should return a TYPE of SHOW_ADD_TO_BASKET_MODAL', () => {
            const result = Actions.showAddToBasketModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_ADD_TO_BASKET_MODAL);
        });

        it('should return an object with all required fields', () => {
            // Arrange
            // eslint-disable-next-line object-curly-newline
            const {
                TYPES: { SHOW_ADD_TO_BASKET_MODAL },
                showAddToBasketModal
            } = Actions;
            const params = {
                analyticsContext: 'analyticsContext',
                basketType: BasketType.Standard,
                error: 'error',
                isOpen: true,
                preferredStoreName: '',
                product: {},
                quantity: 1,
                sku: {},
                replenishmentSelected: undefined,
                replenishmentFrequency: undefined,
                isAutoReplenMostCommon: undefined
            };

            // Act
            const action = showAddToBasketModal(params);
            delete params.quantity;

            // Assert
            expect(action).toEqual({
                type: SHOW_ADD_TO_BASKET_MODAL,
                payload: {
                    ...params,
                    qty: 1
                }
            });
        });
    });

    describe('showEmailMeWhenInStockModal', () => {
        it('should return a TYPE of SHOW_EMAIL_WHEN_IN_STOCK_MODAL', () => {
            const result = Actions.showEmailMeWhenInStockModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_EMAIL_WHEN_IN_STOCK_MODAL);
        });

        it('should return an object with all required fields', () => {
            // Arrange
            // eslint-disable-next-line object-curly-newline
            const {
                TYPES: { SHOW_EMAIL_WHEN_IN_STOCK_MODAL },
                showEmailMeWhenInStockModal
            } = Actions;
            const params = {
                isOpen: true,
                product: {},
                currentSku: {},
                isQuickLook: false,
                updateEmailButtonCTA: () => {},
                isComingSoon: true,
                analyticsContext: {}
            };

            // Act
            const action = showEmailMeWhenInStockModal(params);

            // Assert
            expect(action).toEqual({
                ...params,
                type: SHOW_EMAIL_WHEN_IN_STOCK_MODAL
            });
        });
    });

    describe('updateQuickLookContent', () => {
        it('should return a TYPE of UPDATE_QUICK_LOOK', () => {
            const result = Actions.updateQuickLookContent({});
            expect(result.type).toEqual(Actions.TYPES.UPDATE_QUICK_LOOK);
        });
    });

    describe('showCountrySwitcherModal', () => {
        it('should return a TYPE of SHOW_COUNTRY_SWITCHER_MODAL', () => {
            const result = Actions.showCountrySwitcherModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_COUNTRY_SWITCHER_MODAL);
        });
    });

    describe('showInterstice', () => {
        it('should return a TYPE of SHOW_INTERSTICE', () => {
            const result = Actions.showInterstice({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_INTERSTICE);
        });
    });

    describe('showShareLinkModal', () => {
        it('should return a TYPE of SHOW_SHARE_LINK_MODAL', () => {
            const result = Actions.showShareLinkModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_SHARE_LINK_MODAL);
        });
    });

    describe('showProductFinderModal', () => {
        it('should return a TYPE of SHOW_PRODUCT_FINDER_MODAL', () => {
            const result = Actions.showProductFinderModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_PRODUCT_FINDER_MODAL);
        });
    });

    describe('showFindInStoreModal', () => {
        it('should return a TYPE of SHOW_FIND_IN_STORE_MODAL', () => {
            const result = Actions.showFindInStoreModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_FIND_IN_STORE_MODAL);
        });
    });

    describe('showFindInStoreMapModal', () => {
        it('should return a TYPE of SHOW_FIND_IN_STORE_MAP_MODAL', () => {
            const result = Actions.showFindInStoreMapModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_FIND_IN_STORE_MAP_MODAL);
        });
    });

    describe('updatePurchasedHistoryItemCount', () => {
        it('should return a TYPE of UPDATE_PURCHASE_HISTORY_ITEM_COUNT', () => {
            const result = Actions.updatePurchasedHistoryItemCount({});
            expect(result.type).toEqual(Actions.TYPES.UPDATE_PURCHASE_HISTORY_ITEM_COUNT);
        });
    });

    describe('showRougeRewardCardModal', () => {
        it('should return a TYPE of SHOW_ROUGE_REWARD_CARD_MODAL', () => {
            const result = Actions.showRougeRewardCardModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_ROUGE_REWARD_CARD_MODAL);
        });
    });

    describe('showExtendSessionModal', () => {
        it('should return a TYPE of SHOW_EXTEND_SESSION_MODAL', () => {
            const result = Actions.showExtendSessionModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_EXTEND_SESSION_MODAL);
        });
    });

    describe('showExtendSessionFailureModal', () => {
        it('should return a TYPE of SHOW_EXTEND_SESSION_FAILURE_MODAL', () => {
            const result = Actions.showExtendSessionFailureModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_EXTEND_SESSION_FAILURE_MODAL);
        });
    });

    describe('updateConfirmationStatus', () => {
        it('should return a TYPE of UPDATE_CONFIRMATION_STATUS', () => {
            const result = Actions.updateConfirmationStatus({});
            expect(result.type).toEqual(Actions.TYPES.UPDATE_CONFIRMATION_STATUS);
        });
    });

    describe('showAddressVerificationModal', () => {
        it('should return a TYPE of SHOW_ADDRESS_VERIFICATION_MODAL', () => {
            const result = Actions.showAddressVerificationModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_ADDRESS_VERIFICATION_MODAL);
        });
    });

    describe('showSimilarProductsModal', () => {
        it('should return a TYPE of SHOW_SIMILAR_PRODUCTS_MODAL', () => {
            const result = Actions.showSimilarProductsModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_SIMILAR_PRODUCTS_MODAL);
        });
    });

    describe('showBeautyTraitsModal', () => {
        it('should return a TYPE of SHOW_BEAUTY_TRAITS_MODAL', () => {
            const result = Actions.showBeautyTraitsModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_BEAUTY_TRAITS_MODAL);
        });
    });

    describe('showWizard', () => {
        let result;
        beforeEach(() => {
            result = Actions.showWizard(true);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.SHOW_WIZARD);
        });

        it('should open the wizard', () => {
            expect(result.isOpen).toBeTruthy();
        });

        it('should should claose', () => {
            result = Actions.showWizard(false);
            expect(result.showShadeFinderQuizModal).toBeFalsy();
        });
    });

    describe('showTaxclaimErrorModal', () => {
        it('should return a TYPE of SHOW_TAXCLAIM_ERROR_MODAL', () => {
            const result = Actions.showTaxclaimErrorModal({});
            expect(result.type).toEqual(Actions.TYPES.SHOW_TAXCLAIM_ERROR_MODAL);
        });
    });
});
