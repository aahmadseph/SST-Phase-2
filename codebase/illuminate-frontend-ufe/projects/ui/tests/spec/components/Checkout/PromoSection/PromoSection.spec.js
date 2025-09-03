const React = require('react');
const { shallow } = require('enzyme');
const PromoSection = require('components/Checkout/PromoSection/PromoSection').default;
const { SEO_NAMES } = require('utils/BCC').default;
const { createSpy } = jasmine;

describe('PromoSection component', () => {
    let wrapper;
    let component;
    let event;
    let setStateStub;
    let setPromosStub;
    let setBasketWarningsStub;
    let showWarningMessageStub;
    let refreshBasketStub;
    let removePromoStub;
    let applyPromoStub;
    let collectAndValidateBackEndErrorsStub;
    let showBccModalStub;
    let processStub;
    let preventDefaultStub;

    const promoUtils = require('utils/Promos').default;
    const ErrorsUtils = require('utils/Errors').default;
    const Location = require('utils/Location').default;
    const processEvent = require('analytics/processEvent').default;
    let hideErrorStub;

    beforeEach(() => {
        refreshBasketStub = createSpy();
        showBccModalStub = createSpy();
        removePromoStub = spyOn(promoUtils, 'removePromo');
        applyPromoStub = spyOn(promoUtils, 'applyPromo');
        showWarningMessageStub = spyOn(promoUtils, 'showWarningMessage');
        collectAndValidateBackEndErrorsStub = spyOn(ErrorsUtils, 'collectAndValidateBackEndErrors');
        processStub = spyOn(processEvent, 'process');
        hideErrorStub = createSpy();
        preventDefaultStub = createSpy();

        event = { preventDefault: preventDefaultStub };

        wrapper = shallow(
            <PromoSection
                hideError={hideErrorStub}
                basket={{}}
                promotion={{}}
                error={{}}
                showBccModal={showBccModalStub}
                refreshBasket={refreshBasketStub}
            />
        );
        component = wrapper.instance();
        setStateStub = spyOn(component, 'setState');
    });

    describe('Component Initialization', () => {
        describe('basket changes handler', () => {
            let basket;
            let getAppliedPromotionsStub;

            beforeEach(() => {
                basket = {};
                getAppliedPromotionsStub = spyOn(promoUtils, 'getAppliedPromotions');
                setPromosStub = spyOn(component, 'setPromos');
                setBasketWarningsStub = spyOn(component, 'setBasketWarnings');
                spyOn(component, 'handlePromotionChange');
            });

            it('should call setPromos if location is not Checkout', () => {
                spyOn(Location, 'isCheckout').and.returnValue(false);
                component.componentDidMount();
                expect(setPromosStub).toHaveBeenCalledWith(getAppliedPromotionsStub(basket));
            });

            it('should not call setPromos if location is Checkout', () => {
                spyOn(Location, 'isCheckout').and.returnValue(true);
                component.componentDidMount();
                expect(setPromosStub).not.toHaveBeenCalled();
            });

            it('should call setBasketWarnings', () => {
                component.componentDidMount();
                expect(setBasketWarningsStub).toHaveBeenCalledWith(basket);
            });
        });

        describe('promotion updates handler', () => {
            let getAppliedPromotionsStub;

            beforeEach(() => {
                getAppliedPromotionsStub = spyOn(promoUtils, 'getAppliedPromotions');
                setPromosStub = spyOn(component, 'setPromos');
                spyOn(component, 'handleBasketChange');
            });

            it('should call setPromos if location is Checkout', () => {
                spyOn(Location, 'isCheckout').and.returnValue(true);
                component.componentDidMount();
                expect(setPromosStub).toHaveBeenCalledWith(getAppliedPromotionsStub({}));
            });

            it('should not call setPromos if location is not Checkout', () => {
                spyOn(Location, 'isCheckout').and.returnValue(false);
                component.componentDidMount();
                expect(setPromosStub).not.toHaveBeenCalled();
            });
        });

        describe('error', () => {
            let showErrorPromoMessageStub;

            beforeEach(() => {
                showErrorPromoMessageStub = spyOn(component, 'showErrorPromoMessage');
                component.componentDidMount();
            });

            it('should not call to showErrorPromoMessage if promo does not has an error', () => {
                expect(showErrorPromoMessageStub).not.toHaveBeenCalled();
            });

            it('should update state without an error', () => {
                expect(setStateStub).toHaveBeenCalledWith({ isAllPromoCodesModalOpen: false });
            });

            it('should call to showErrorPromoMessage if promo has an error', () => {
                wrapper.setProps({
                    error: {
                        errorMessages: ['my errorMessages'],
                        errorCode: 1
                    }
                });

                expect(showErrorPromoMessageStub).toHaveBeenCalled();
            });

            it('should update state with an error', () => {
                const promoError = {
                    errorMessages: ['my errorMessages'],
                    errorCode: -2
                };

                const stateObj = {
                    errorMessage: 'my errorMessages',
                    errorCode: -2,
                    hasError: true,
                    isAllPromoCodesModalOpen: false
                };

                wrapper.setProps({ error: promoError });
                expect(setStateStub).toHaveBeenCalledWith(stateObj);
            });

            it('should not show the error while controller is running', () => {
                const promoError = {
                    errorMessages: ['my errorMessages'],
                    errorCode: -2
                };
                wrapper.setState({ isMounted: false });
                wrapper.setProps({ error: promoError });
                expect(hideErrorStub).not.toHaveBeenCalled();
            });

            it('should show the error after controller ran for the first time', () => {
                const promoError = {
                    errorMessages: ['my errorMessages'],
                    errorCode: -2
                };
                wrapper.setState({ isMounted: true });
                wrapper.setProps({ error: promoError });
                expect(hideErrorStub).toHaveBeenCalledWith(false);
            });
        });
    });

    describe('setPromos method', () => {
        beforeEach(() => {
            component.promoInput = { empty: createSpy() };
            setStateStub.and.callFake((...args) => args[1]());
            component.setPromos();
        });

        it('should call to setState', () => {
            expect(setStateStub).toHaveBeenCalled();
        });

        it('should empty the input', () => {
            expect(component.promoInput.empty).toHaveBeenCalled();
        });
    });

    describe('setBasketWarnings method', () => {
        let basket;

        it('should not call refreshBasket if promoWarning has no message', () => {
            basket = { promoWarning: '' };

            component.setBasketWarnings(basket);
            expect(refreshBasketStub).not.toHaveBeenCalled();
        });

        it('should not display warning modal if promoWarning has no message', () => {
            basket = { promoWarning: '' };

            component.setBasketWarnings(basket);
            expect(showWarningMessageStub).not.toHaveBeenCalled();
        });

        it('should display warning modal if promoWarning has a message', () => {
            basket = { promoWarning: 'my promoWarning message' };

            component.setBasketWarnings(basket);
            expect(showWarningMessageStub).toHaveBeenCalledWith('my promoWarning message');
        });

        it('should call to refreshBasket action if promoWarning has a message', () => {
            basket = { promoWarning: 'my promoWarning message' };

            component.setBasketWarnings(basket);
            expect(refreshBasketStub).toHaveBeenCalled();
        });

        it('should call setState', () => {
            basket = {
                promoWarning: 'my promoWarning message',
                basketLevelMessages: []
            };

            component.setBasketWarnings(basket);
            expect(setStateStub).toHaveBeenCalledWith({
                warningMessage: basket.promoWarning,
                basketLevelMessages: basket.basketLevelMessages
            });
        });
    });

    describe('applyPromoCode method', () => {
        it('should call to applyPromo', () => {
            component.promoInput = {
                getValue: createSpy().and.returnValue(''),
                trim: createSpy()
            };

            component.applyPromoCode('captchaToken');
            expect(applyPromoStub).toHaveBeenCalledWith('', 'captchaToken');
        });
    });

    describe('showErrorPromoMessage method', () => {
        let setValueStub;

        beforeEach(() => {
            setValueStub = createSpy();
            component.promoInput = { setValue: setValueStub };
        });

        it('should call to collectAndValidateBackEndErrors', () => {
            component.showErrorPromoMessage({});
            expect(collectAndValidateBackEndErrorsStub).toHaveBeenCalledWith({}, component);
        });

        it('should not set value to promo input', () => {
            component.showErrorPromoMessage({});
            expect(setValueStub).not.toHaveBeenCalled();
        });

        it('should set value to promo input', () => {
            component.showErrorPromoMessage({ promoCode: 1 });
            expect(setValueStub).toHaveBeenCalledWith(1);
        });
    });

    describe('showError method', () => {
        let showErrorStub;

        beforeEach(() => {
            showErrorStub = createSpy();
            component.promoInput = { showError: showErrorStub };
        });

        it('should update the state', () => {
            component.showError('my message', null, 'my errorKey');
            expect(setStateStub).toHaveBeenCalledWith({ promoStartsToApply: false });
        });

        it('should call showError in promoInput', () => {
            component.showError('my message', null, 'my errorKey');
            expect(showErrorStub).toHaveBeenCalledWith('my message', null, 'my errorKey');
        });
    });

    describe('removePromoCode method', () => {
        it('should call preventDefault', () => {
            component.removePromoCode(event, {});
            expect(preventDefaultStub).toHaveBeenCalled();
        });

        it('should call removePromoStub', () => {
            component.removePromoCode(event, {});
            expect(removePromoStub).toHaveBeenCalledWith({});
        });
    });

    describe('handleTextChange method', () => {
        it('should update the state', () => {
            component.handleTextChange({ currentTarget: { value: [1] } });
            expect(setStateStub).toHaveBeenCalledWith({ promoStartsToApply: true });
        });
    });

    describe('showPromoModal method', () => {
        it('should call to showBccModal action', () => {
            component.showPromoModal();
            expect(showBccModalStub).toHaveBeenCalledWith({
                isOpen: true,
                seoName: SEO_NAMES.PROMOTIONS_MODAL,
                width: 872
            });
        });

        it('should call to fireAnalytics', () => {
            const fireAnalyticsStub = spyOn(component, 'fireAnalytics');
            component.showPromoModal();
            expect(fireAnalyticsStub).toHaveBeenCalled();
        });
    });

    describe('fireAnalytics method', () => {
        it('should not call to analytics if not on checkout or basket page', () => {
            spyOn(Location, 'isCheckout').and.returnValue(false);
            spyOn(Location, 'isBasketPage').and.returnValue(false);
            component.fireAnalytics();
            expect(processStub).not.toHaveBeenCalled();
        });

        it('should call to analytics with correct data if on checkout page', () => {
            const data = {
                eventStrings: ['scCheckout'],
                pageName: 'checkout:view promo code modal:n/a:*',
                pageType: 'checkout',
                pageDetail: 'view promo code modal',
                linkData: 'checkout:view promo codes'
            };

            spyOn(Location, 'isCheckout').and.returnValue(true);
            spyOn(Location, 'isBasketPage').and.returnValue(false);
            component.fireAnalytics();
            expect(processStub).toHaveBeenCalledWith('asyncPageLoad', { data });
        });
        it('should call to analytics with correct data if on basket page', () => {
            const data = {
                pageName: 'basket:view promo code modal:n/a:*',
                pageType: 'basket',
                pageDetail: 'view promo code modal',
                linkData: 'basket:view promo codes'
            };

            spyOn(Location, 'isBasketPage').and.returnValue(true);
            spyOn(Location, 'isCheckout').and.returnValue(false);
            component.fireAnalytics();
            expect(processStub).toHaveBeenCalledWith('asyncPageLoad', { data });
        });
    });

    describe('handleFocus method', () => {
        it('should not update the state if does not have an error', () => {
            component.handleFocus();
            expect(setStateStub).not.toHaveBeenCalled();
        });

        it('should update the state if has an error', () => {
            component.state.hasError = true;
            component.handleFocus();
            expect(setStateStub).toHaveBeenCalledWith({ hasError: false });
        });
    });

    describe('validateCaptchaAndApplyPromo method', () => {
        let getValueStub;
        let executeStub;

        beforeEach(() => {
            getValueStub = createSpy().and.returnValue('myCaptchaPromo');
            executeStub = createSpy();

            component.promoInput = { getValue: getValueStub };

            component.reCaptcha = { execute: executeStub };
        });

        it('should call to preventDefault', () => {
            component.validateCaptchaAndApplyPromo(event);
            expect(preventDefaultStub).toHaveBeenCalled();
        });

        it('should call to execute', () => {
            Sephora.configurationSettings.captchaApplyPromotionPatternsList = ['MYCAPTCHAPROMO'];
            component.validateCaptchaAndApplyPromo(event);
            expect(executeStub).toHaveBeenCalled();
        });

        it('should call to applyPromoCode', () => {
            const applyPromoCodeStub = spyOn(component, 'applyPromoCode');
            Sephora.configurationSettings.captchaApplyPromotionPatternsList = ['captchapromo'];
            component.validateCaptchaAndApplyPromo(event);
            expect(applyPromoCodeStub).toHaveBeenCalled();
        });
    });

    describe('onCaptchaTokenReady method', () => {
        let resetStub;
        let applyPromoCodeStub;

        beforeEach(() => {
            applyPromoCodeStub = spyOn(component, 'applyPromoCode');
            resetStub = createSpy();

            component.reCaptcha = { reset: resetStub };
        });

        it('should not call to applyPromoCode if token is invalid', () => {
            component.onCaptchaTokenReady(null);
            expect(applyPromoCodeStub).not.toHaveBeenCalled();
        });

        it('should call to applyPromoCode if token is valid', () => {
            component.onCaptchaTokenReady(12345);
            expect(applyPromoCodeStub).toHaveBeenCalledWith(12345);
        });

        it('should call to reset', () => {
            component.onCaptchaTokenReady();
            expect(resetStub).toHaveBeenCalled();
        });
    });

    describe('PromoSection visual', () => {
        describe('promos list', () => {
            const findPromosList = c => c.find('[data-at="basket_promo_item"]');

            const allPromos = [
                {
                    couponCode: 'it$off',
                    discountAmount: '$4.00',
                    displayName: 'Item discount $off',
                    promotionId: 'promo4760003',
                    promotionType: 'Item Discount'
                },
                {
                    couponCode: 'gwp',
                    discountAmount: '',
                    displayName: 'GWP Promo',
                    promotionId: 'promo51016',
                    promotionType: 'Order Discount - Amount Off - GWP'
                }
            ];

            it('should not render if no promos applied', () => {
                wrapper.setState({ basketPromosList: [] });
                expect(findPromosList(wrapper).exists()).toEqual(false);
            });

            it('should render correct number of promos', () => {
                wrapper.setState({ basketPromosList: allPromos });
                expect(findPromosList(wrapper).length).toEqual(2);
            });

            describe('for regular items', () => {
                it('should render correct info', () => {
                    wrapper.setState({ basketPromosList: allPromos });
                    expect(findPromosList(wrapper).first().find('[data-at="promo_info"]').text()).toEqual('Item discount $off ($4.00)');
                });

                it('should render correct indicator', () => {
                    wrapper.setState({ basketPromosList: allPromos });
                    expect(findPromosList(wrapper).first().find('[data-at="applied_promo"]').text()).toEqual('Applied');
                });

                it('should render remove link', () => {
                    wrapper.setState({ basketPromosList: allPromos });
                    expect(findPromosList(wrapper).first().find('Link').last().text()).toEqual('Remove');
                });
            });

            describe('for no ptice items', () => {
                it('should render correct info', () => {
                    wrapper.setState({ basketPromosList: allPromos });
                    expect(findPromosList(wrapper).last().find('[data-at="promo_info"]').text()).toEqual('GWP Promo');
                });

                it('should render correct indicator', () => {
                    wrapper.setState({ basketPromosList: allPromos });
                    expect(findPromosList(wrapper).last().find('[data-at="applied_promo"]').text()).toEqual('Applied');
                });

                it('should render remove link', () => {
                    wrapper.setState({ basketPromosList: allPromos });
                    expect(findPromosList(wrapper).last().find('Link').last().text()).toEqual('Remove');
                });
            });

            describe('for PFD promo item', () => {
                it('should not render PFD info', () => {
                    wrapper.setState({
                        basketPromosList: [
                            {
                                couponCode: 'pfd_10_750_20002360076_55082',
                                discountAmount: '$7.20',
                                displayName: 'Points for Discount',
                                promotionId: 'pointspercentoffpromo',
                                promotionType: 'Order Discount'
                            }
                        ]
                    });
                    expect(findPromosList(wrapper).exists()).toEqual(false);
                });
            });

            it('click on remove link should call removePromoCode', () => {
                const removePromoCodeSpy = spyOn(component, 'removePromoCode');

                wrapper.setState({ basketPromosList: allPromos });
                findPromosList(wrapper).first().find('Link').last().simulate('click');
                findPromosList(wrapper).last().find('Link').last().simulate('click');
                expect(removePromoCodeSpy).toHaveBeenCalledTimes(2);
            });
        });
    });
});
