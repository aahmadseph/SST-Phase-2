/* eslint-disable no-undef */
/* eslint-disable object-curly-newline */
const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const userUtils = require('utils/User').default;
const actions = require('actions/Actions').default;
const store = require('Store').default;
const utilityApi = require('services/api/utility').default;
const keyConsts = require('utils/KeyConstants').default;
const decorators = require('utils/decorators').default;
const processEvent = require('analytics/processEvent').default;
const analyticsConsts = require('analytics/constants').default;
const anaUtils = require('analytics/utils').default;
const EmailMeWhenInStockModal = require('components/GlobalModals/EmailMeWhenInStockModal/EmailMeWhenInStockModal').default;

describe('EmailMeWhenInStockModal', () => {
    let shallowComponent;
    let testCurrentSku;
    let testProduct;
    let component;

    describe('render', () => {
        beforeEach(() => {
            testCurrentSku = {
                actionFlags: {
                    backInStockReminderStatus: 'active',
                    isAddToBasket: false,
                    myListStatus: 'notAdded',
                    showFlashOnPDP: true
                },
                biExclusiveLevel: 'none',
                displayName: '1736610 Lolita II',
                freeShippingMessage: 'spend $50 for free shipping',
                isBiOnly: false,
                isComingSoonTreatment: false,
                isFindInStore: true,
                isFlash: false,
                isFree: false,
                isFreeShippingSku: false,
                isGoingFast: false,
                isHazmat: false,
                isInBasket: false,
                isLimitedEdition: false,
                isLimitedQuantity: false,
                isNaturalOrganic: false,
                isNaturalSephora: false,
                isNew: false,
                isOnlineOnly: false,
                isOnlyFewLeft: false,
                isOutOfStock: true,
                isPaypalRestricted: false,
                isSephoraExclusive: true,
                isWithBackInStockTreatment: true,
                listPrice: '$20.00',
                maxPurchaseQuantity: 0,
                onSaleSku: false,
                refinements: {
                    finishRefinements: ['Matte'],
                    colorRefinements: ['Nude']
                },
                size: '0.22 oz/ 6.6 mL',
                skuId: '1736610',
                skuImages: { image97: '/productimages/sku/s1736610-main-Sgrid.jpg' },
                skuName: 'Lolita II',
                smallImage: '/productimages/sku/s1736610+sw.jpg',
                targetUrl: '/product/everlasting-love-liquid-lipstick-P384954?skuId=1736610',
                type: 'Standard',
                url: 'http://10.105.36.160:80/v1/catalog/skus/1736610?parentProduct=P384954',
                variationDesc: 'terra cotta nude',
                variationType: 'Color',
                variationValue: 'Lolita II'
            };

            testProduct = {
                currentSku: testCurrentSku,
                displayName: 'Everlasting Liquid Lipstick',
                productDetails: {
                    brand: { displayName: 'Kat Von D' },
                    displayName: 'Everlasting Liquid Lipstick'
                }
            };
        });

        describe('General modal structure', () => {
            let props;
            let ModalComp;
            let ModalTitleComp;
            let ProductImageComp;
            let ProductBrandNameBox;
            let ProductDescriptionBox;
            let SizeAndItemNumberComp;
            let ProductVariationComp;

            beforeEach(() => {
                props = {
                    isOpen: true,
                    product: {
                        productDetails: {
                            brand: { displayName: 'Kat Von D' },
                            displayName: 'Everlasting Liquid Lipstick'
                        }
                    },
                    currentSku: testCurrentSku,
                    alreadySubscribed: false
                };

                shallowComponent = shallow(<EmailMeWhenInStockModal {...props} />);
            });

            it('should render a modal instance', () => {
                ModalComp = shallowComponent.find('Modal');
                expect(ModalComp.length).toBe(1);
            });

            xit('should render the correct modal title', () => {
                ModalTitleComp = ModalComp.find('ModalTitle').children(0);
                expect(ModalTitleComp.text()).toBe('Email me when available');
            });

            it('should render sku image as Product image', () => {
                ProductImageComp = shallowComponent.find('ProductImage').get(0);
                expect(ProductImageComp.props.id).toBe(testCurrentSku.skuId);
            });

            it('should render the product brand name', () => {
                ProductBrandNameBox = shallowComponent.find('Box').get(0);
                expect(ProductBrandNameBox.props.dangerouslySetInnerHTML.__html).toBe(testProduct.productDetails.brand.displayName);
            });

            it('should render the product name', () => {
                ProductDescriptionBox = shallowComponent.find('Box').get(1);
                expect(ProductDescriptionBox.props.dangerouslySetInnerHTML.__html).toBe(testProduct.productDetails.displayName);
            });

            it('should render sku size and item number component', () => {
                SizeAndItemNumberComp = shallowComponent.find('SizeAndItemNumber');
                expect(SizeAndItemNumberComp.length).toBe(1);
            });

            it('should render product variation component', () => {
                ProductVariationComp = shallowComponent.find('ProductVariation');
                expect(ProductVariationComp.length).toBe(1);
            });
        });

        describe('Show Signin block - user not subscribed', () => {
            let state;
            let props;
            let EmailInputComp;
            let ButtonComp;

            beforeEach(() => {
                props = {
                    isOpen: true,
                    product: { productDetails: testProduct },
                    currentSku: testCurrentSku,
                    alreadySubscribed: false
                };

                shallowComponent = shallow(<EmailMeWhenInStockModal {...props} />);

                state = {
                    showSignupBlock: true,
                    errorMessages: [],
                    inputDisabled: false,
                    presetEmail: null
                };
                shallowComponent.setState(state);
            });

            it('should render the email input', () => {
                EmailInputComp = shallowComponent.find('InputEmail');
                expect(EmailInputComp.length).toBe(1);
            });

            it('should not disable the email input', () => {
                EmailInputComp = shallowComponent.find('InputEmail').get(0);
                expect(EmailInputComp.props.disabled).toBe(undefined);
            });

            it('should render the correct button text', () => {
                ButtonComp = shallowComponent.find('Button').get(0);
                expect(ButtonComp.props.children).toBe('Complete');
            });
        });

        describe('Already subscribed user', () => {
            let props;
            let state;
            let EmailInputComp;
            let ButtonComp;

            beforeEach(() => {
                spyOn(userUtils, 'isAnonymous').and.returnValue(true);

                spyOn(store, 'getState').and.returnValue({
                    user: {
                        subscribedAnonEmail: 'test@mail.com',
                        login: 'test@mail.com'
                    }
                });

                props = {
                    isOpen: true,
                    product: { productDetails: testProduct },
                    currentSku: testCurrentSku,
                    alreadySubscribed: true
                };

                state = {
                    showSignupBlock: true,
                    errorMessages: [],
                    presetEmail: 'test@mail.com',
                    inputDisabled: true
                };

                shallowComponent = shallow(<EmailMeWhenInStockModal {...props} />);
                shallowComponent.setState(state);
                shallowComponent.instance().componentDidMount();
            });

            it('should render a disabled email input component', () => {
                EmailInputComp = shallowComponent.find('InputEmail').get(0);
                expect(EmailInputComp.props.disabled).toBe(true);
            });

            it('should render the correct button text', () => {
                ButtonComp = shallowComponent.find('Button').get(0);
                expect(ButtonComp.props.children).toBe('Stop Email Notifications');
            });
        });

        describe('close modal', () => {
            let props;
            let dispatchStub;
            let dispatchQuicklookStub;

            beforeEach(() => {
                dispatchStub = spyOn(store, 'dispatch');
                spyOn(actions, 'showEmailMeWhenInStockModal');
                props = {
                    product: {
                        productId: 'P1234567',
                        brand: {}
                    },
                    currentSku: {
                        skuId: '1234567',
                        skuImages: {},
                        actionFlags: {}
                    },
                    isQuickLook: false
                };
                const wrapper = shallow(<EmailMeWhenInStockModal {...props} />);
                component = wrapper.instance();
                dispatchQuicklookStub = spyOn(component, 'dispatchQuicklook');

                component.requestClose();
            });

            it('should dispatch an action', () => {
                expect(dispatchStub).toHaveBeenCalledTimes(1);
            });

            it('should close EmailMeWhenInStock Modal', () => {
                expect(actions.showEmailMeWhenInStockModal).toHaveBeenCalledWith({ isOpen: false });
            });

            it('should not dispatch QuickLook', () => {
                expect(dispatchQuicklookStub).not.toHaveBeenCalledTimes(1);
            });

            it('props isQuickLook === true should dispatch QuickLook', () => {
                props.isQuickLook = true;
                const wrapper = shallow(<EmailMeWhenInStockModal {...props} />);
                component = wrapper.instance();
                dispatchQuicklookStub = spyOn(component, 'dispatchQuicklook');
                component.requestClose();

                expect(dispatchQuicklookStub).toHaveBeenCalledTimes(1);
            });
        });

        describe('EmailMeWhenInStock handler', () => {
            let event;
            let props;
            let requestEmailStub;
            let cancelEmailStub;

            beforeEach(() => {
                event = {
                    preventDefault: createSpy('preventDefault'),
                    key: keyConsts.ENTER
                };
                requestEmailStub = spyOn(utilityApi, 'requestEmailNotificationForOutOfStockSku').and.returnValue(Promise.resolve({}));
                cancelEmailStub = spyOn(utilityApi, 'cancelEmailNotificationRequest').and.returnValue(Promise.resolve({}));
                props = {
                    product: {
                        productId: 'P1234567',
                        brand: {}
                    },
                    currentSku: {
                        skuId: '1234567',
                        skuImages: {},
                        actionFlags: {}
                    },
                    isQuickLook: false
                };
                const wrapper = shallow(<EmailMeWhenInStockModal {...props} />);
                component = wrapper.instance();
                component.emailInput.current = {
                    validateError: createSpy('validateError'),
                    getValue: createSpy('getValue').and.returnValue('1@ql.com')
                };
            });

            it('should subscribe for sku', () => {
                component.handleEmailMeWhenInStock(event);
                expect(requestEmailStub).toHaveBeenCalledWith('1@ql.com', '1234567');
            });

            it('should subscribe for sku', () => {
                component.handleRemoveEmailSubscription(event);
                expect(cancelEmailStub).toHaveBeenCalledWith('1@ql.com', '1234567');
            });

            xit('should raise event LINK_TRACKING_EVENT with data object that has all required fields', () => {
                // Arrange
                const { LINK_TRACKING_EVENT } = analyticsConsts;
                const resolvedApiCall = Promise.resolve();
                spyOn(decorators, 'withInterstice').and.returnValue(() => resolvedApiCall);
                const { pageName, previousPage } = {
                    pageName: 'pageName',
                    previousPage: 'previousPage'
                };
                spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue({
                    pageName,
                    previousPage
                });
                const processEventProcessSpy = spyOn(processEvent, 'process');
                const wrapper = shallow(<EmailMeWhenInStockModal {...props} />);
                const modalWindow = wrapper.instance();
                modalWindow.emailInput = {
                    validateError: () => false,
                    getValue: () => {}
                };

                // Act
                modalWindow.emailMeHandler(new Event(''));

                // Assert
                resolvedApiCall.then(() => {
                    expect(processEventProcessSpy).toHaveBeenCalledWith(LINK_TRACKING_EVENT, {
                        data: {
                            eventStrings: ['event71'],
                            sku: props.currentSku,
                            linkName: 'Email Me When Available: Success',
                            internalCampaign: ['top-right-out-of-stock-button', props.product.productId, 'email-me-when-available-success'],
                            actionInfo: 'Email Me When Available: Success',
                            pageName,
                            previousPage
                        }
                    });
                });
            });
        });
    });
});
