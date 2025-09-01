/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const { BasketType } = require('constants/Basket').default;
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const React = require('react');

describe('AddToBasketButton component', () => {
    const { any, anything, objectContaining } = jasmine;
    let ReactDOM;
    let AddToBasketButton;
    let props;
    let wrapper;
    let component;
    let event;
    let preventDefaultStub;
    let skuUtils;
    let analyticsData;

    beforeEach(() => {
        ReactDOM = require('react-dom');
        skuUtils = require('utils/Sku').default;
        global.braze = { logCustomEvent: createSpy() };

        AddToBasketButton = require('components/AddToBasketButton/AddToBasketButton').default;

        props = {
            sku: {
                productId: 'skuProductId',
                productName: 'skuProductName',
                brandName: 'skuBrandName',
                type: 'Standard',
                skuId: 'skuID1'
            },
            platform: 'mobile',
            origin: 'creditcard',
            originalContext: undefined,
            productId: 'topLevelProductId',
            productName: 'topLevelProductName',
            skuType: 'Standard',
            product: {
                displayName: 'productDisplayName',
                parentCategory: {
                    displayName: 'productCategory'
                },
                productDetails: {
                    displayName: 'productDisplayName',
                    shortDescription: 'productShortDescription'
                }
            },
            quantity: 2,
            analyticsContext: 'carousel',
            samplePanel: false,
            containerTitle: 'carouselName',
            onSuccess: createSpy(),
            isBIRBReward: false,
            rootContainerName: 'just arrived',
            basketType: BasketType.Standard,
            preferredStore: {
                preferredStoreInfo: {
                    storeId: '1111'
                }
            },
            basketItems: [],
            pendingBasketSkus: [],
            displayQuantityPickerInATB: true,
            isMultiProductsAdd: false
        };

        analyticsData = {
            productId: 'skuProductId',
            productName: 'skuProductName',
            productDescription: 'productShortDescription',
            productStrings: [';skuID1;;;;eVar26=skuID1'],
            displayQuantityPickerInATB: true,
            brandName: 'skuBrandName',
            category: 'productCategory',
            skuType: 'Standard',
            platform: 'mobile',
            origin: 'creditcard',
            pageName: undefined,
            originalContext: undefined,
            containerTitle: 'carouselName',
            isBIRBPageRewardModal: false,
            isAddFullSize: false,
            isBIRBReward: false,
            rootContainerName: 'just arrived',
            isPickup: false,
            isSameDay: false,
            isMultiProductsAdd: false,
            sku: {
                productId: 'skuProductId',
                productName: 'skuProductName',
                brandName: 'skuBrandName',
                type: 'Standard',
                skuId: 'skuID1'
            },
            isSameDayDeliveryEligible: undefined,
            isOnlineOnly: undefined,
            isAvailablePreferredStore: 'No',
            analyticsContext: 'carousel',
            personalizedInternalCampaign: undefined
        };
    });

    describe('Add To Basket Click', () => {
        let blurStub;

        beforeEach(function () {
            props.updateMsgPromo = createSpy();
            props.addToBasket = createSpy();
            props.addMultipleSkusToBasket = createSpy();

            blurStub = createSpy();
            preventDefaultStub = createSpy();
            event = { preventDefault: preventDefaultStub };

            spyOn(ReactDOM, 'findDOMNode').and.returnValue({ blur: blurStub });
        });

        describe('UTS-1587 AB test', () => {
            let quicklookModalUtils;
            let dispatchQuicklookSpy;

            beforeEach(function () {
                props.product = { productId: '123456' };
                quicklookModalUtils = require('utils/Quicklook').default;
                dispatchQuicklookSpy = spyOn(quicklookModalUtils, 'dispatchQuicklook');
            });

            it('Controller', () => {
                props.isNthCategoryPage = false;
                wrapper = shallow(<AddToBasketButton {...props} />);
                component = wrapper.instance();
                component.addClick(event);
                expect(dispatchQuicklookSpy).not.toHaveBeenCalled();
            });

            it('Bucket B', () => {
                props.isNthCategoryPage = true;
                wrapper = shallow(<AddToBasketButton {...props} />);
                component = wrapper.instance();
                component.addClick(event);
                expect(dispatchQuicklookSpy).toHaveBeenCalled();
            });
        });

        describe('without promo', () => {
            beforeEach(function () {
                props.product = { productId: '123456' };
                props.analyticsContext = {};
                props.autoReplenishChecked = false;
                props.productSampleModal = false;

                wrapper = shallow(<AddToBasketButton {...props} />);
                component = wrapper.instance();
                component.addClick(event);
            });

            it('should call dispatch with add to basket action and proper params', () => {
                expect(props.addToBasket).toHaveBeenCalledWith(
                    props.sku,
                    props.basketType,
                    2,
                    any(Function),
                    anything(),
                    anything(),
                    anything(),
                    anything(),
                    anything(),
                    anything(),
                    anything(),
                    undefined,
                    anything(),
                    props.productSampleModal
                );
            });

            it('should blur the button after click event', () => {
                expect(blurStub).toHaveBeenCalledTimes(1);
            });
        });

        it('with promo should call updateMsgPromo action', () => {
            // Arrange
            props.promoPanel = 'promo';
            wrapper = shallow(<AddToBasketButton {...props} />);
            component = wrapper.instance();

            // Act
            component.addClick(event);

            // Assert
            expect(props.updateMsgPromo).toHaveBeenCalledWith(props.sku);
        });

        it('should call addMultipleSkusToBasket action', () => {
            // Arrange
            const pendingBasketSkus = [
                {
                    qty: 2,
                    skuId: 'skuID1'
                },
                {
                    qty: 4,
                    skuId: 'skuID2'
                }
            ];
            wrapper = shallow(
                <AddToBasketButton
                    {...props}
                    pendingBasketSkus={[
                        {
                            qty: 4,
                            skuId: 'skuID2'
                        }
                    ]}
                />
            );
            component = wrapper.instance();
            spyOn(component, 'showAddToBasketModal');

            // Act
            component.addClick(event);

            // Assert
            expect(props.addMultipleSkusToBasket).toHaveBeenCalledWith(
                pendingBasketSkus,
                6,
                any(Function),
                anything(),
                undefined,
                undefined,
                undefined,
                null
            );
        });
    });

    describe('addClickModal function is being calling', () => {
        let blurStub;
        let Storage;
        let rrcUtils;
        let getProductTypeStub;
        let areRRCTermsConditionsAcceptedStub;

        beforeEach(function () {
            Storage = require('utils/localStorage/Storage').default;
            rrcUtils = require('utils/RrcTermsAndConditions').default;
            getProductTypeStub = spyOn(skuUtils, 'getProductType').and.returnValue('Reward_Card');
            spyOn(Storage.local, 'getItem');
            areRRCTermsConditionsAcceptedStub = spyOn(rrcUtils, 'areRRCTermsConditionsAccepted');

            props.sku = {
                biExclusiveLevel: 'Rouge',
                rewardSubType: 'Reward_Card',
                productId: '123456',
                productName: '$100 ROUGE REWARD',
                type: 'Standard'
            };

            props.product = { productId: '123456' };
            props.analyticsContext = {};
            props.showRougeRewardCardModal = createSpy();
            props.addToBasket = createSpy();
            props.showAddToBasketModal = createSpy();
            props.isRougeExclusiveCarousel = false;

            blurStub = createSpy();
            spyOn(ReactDOM, 'findDOMNode').and.returnValue({ blur: blurStub });

            wrapper = shallow(<AddToBasketButton {...props} />);
            component = wrapper.instance();

            component.setState({ isRougeRewardCard: true });
        });

        describe('show the normal path when T&C doesn\'t already accepted, ', () => {
            beforeEach(function () {
                component.addClickModal(event);
            });

            it('should get the product type with the sku', () => {
                expect(getProductTypeStub).toHaveBeenCalledWith(props.sku);
            });

            it('should trigger the showRougeRewardCardModal action', () => {
                expect(props.showRougeRewardCardModal).toHaveBeenCalledWith({
                    isOpen: true,
                    sku: props.sku,
                    analyticsContext: {},
                    isRougeExclusiveCarousel: false
                });
            });
        });

        it('should not open the modal of T&C', () => {
            areRRCTermsConditionsAcceptedStub.and.returnValue(true);
            component.addClickModal(event);
            expect(props.showRougeRewardCardModal).not.toHaveBeenCalled();
        });
    });

    describe('getAnalyticsData', () => {
        beforeEach(() => {
            wrapper = shallow(<AddToBasketButton {...props} />);
            component = wrapper.instance();
        });

        it('should return the correct data', () => {
            expect(component.getAnalyticsData()).toEqual(analyticsData);
        });

        it('should use the correct fallbacks to populate the return object', () => {
            props.sku.productId = null;
            props.sku.productName = null;
            analyticsData.sku.productId = null;
            analyticsData.sku.productName = null;
            wrapper = shallow(<AddToBasketButton {...props} />);
            component = wrapper.instance();
            analyticsData.productId = props.productId;
            analyticsData.productName = props.productName;

            expect(component.getAnalyticsData()).toEqual(analyticsData);
        });

        it('should use the correct alternate fallback to populate the return object', () => {
            props.sku.productName = null;
            props.productName = null;
            analyticsData.sku.productName = null;
            wrapper = shallow(<AddToBasketButton {...props} />);
            component = wrapper.instance();
            analyticsData.productName = props.product.displayName;

            expect(component.getAnalyticsData()).toEqual(analyticsData);
        });
    });

    describe('getAddToBasketSuccessCallback', () => {
        let fn;
        let callbackStub;
        let itemsStub;
        let getElementByIdStub;

        beforeEach(() => {
            itemsStub = {
                items: [
                    {
                        sku: { skuId: '12345' }
                    }
                ]
            };

            props.showAddToBasketModal = createSpy();

            spyOn(window, 'dispatchEvent'); // avoid call nested events
            callbackStub = createSpy();
            getElementByIdStub = spyOn(document, 'getElementById');
            wrapper = shallow(<AddToBasketButton {...props} />);
            component = wrapper.instance();
            fn = component.getAddToBasketSuccessCallback(callbackStub);
            fn(itemsStub);
        });

        it('should return a function', () => {
            expect(typeof fn).toEqual('function');
        });

        it('should call to onSuccess', () => {
            expect(props.onSuccess).toHaveBeenCalled();
        });

        it('should call the callback param', () => {
            expect(callbackStub).toHaveBeenCalled();
        });
    });

    describe('Controller initialization', () => {
        beforeEach(() => {
            props.sku = { skuId: 1425404 };
        });

        it('should enable button if basket is already initialized', () => {
            wrapper = shallow(
                <AddToBasketButton
                    itemCount={1}
                    {...props}
                />
            );
            component = wrapper.instance();

            // Act
            component.componentDidMount();

            // Assert
            expect(component.state.disabled).toBe(false);
        });

        it('should set isInBasket as true if the current item is in basket', () => {
            wrapper = shallow(
                <AddToBasketButton
                    {...props}
                    basketItems={[{ sku: { skuId: 1425404 } }]}
                    itemCount={1}
                />
            );
            component = wrapper.instance();

            // Act
            component.componentDidMount();

            // Assert
            expect(component.state.isInBasket).toBe(true);
        });
    });
});
