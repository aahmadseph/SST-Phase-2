/* eslint-disable no-unused-vars */
const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const CallToAction = require('components/ProductPage/CallToAction').default;
const skuUtils = require('utils/Sku').default;
const Storage = require('utils/localStorage/Storage').default;
const userUtils = require('utils/User').default;
const localeUtils = require('utils/LanguageLocale').default;

describe('<CallToAction />', () => {
    const ADD_TO_BASKET_DATA_AT = 'addToBasketDataAt';
    let getText;
    let props, getProductTypeStub, addToBasketCallbackStub, localStorageStub;

    beforeEach(() => {
        localStorageStub = spyOn(Storage.local, 'getItem');
        addToBasketCallbackStub = createSpy();
        getText = localeUtils.getLocaleResourceFile('components/ProductPage/CallToAction/locales', 'CallToAction');
        props = {
            product: {
                productId: '123456',
                currentProductUserSpecificDetails: {
                    SDDRougeTestThreshold: 35
                }
            },
            sku: {
                skuId: '123',
                isOutOfStock: false
            },
            addToBasketDataAt: ADD_TO_BASKET_DATA_AT,
            addToBasketDataAtSm: ADD_TO_BASKET_DATA_AT,
            addToBasketCallback: addToBasketCallbackStub,
            isCustomSets: false,
            isRopis: false
        };
    });

    describe('Regular Product', () => {
        it('should render AddToBasketButton with correct data-at', () => {
            // Arrange
            getProductTypeStub = spyOn(skuUtils, 'getProductType').and.returnValue(skuUtils.skuTypes.STANDARD);
            const component = shallow(<CallToAction {...props} />);
            // Assert
            const AddToBasketButton = component.find(`ErrorBoundary(Connect(AddToBasketButton))[data-at="${ADD_TO_BASKET_DATA_AT}"]`);
            expect(AddToBasketButton.exists()).toBe(true);
        });
    });

    describe('Rouge reward Product', () => {
        it('should render rouge reward buttons with correct data-at', () => {
            // Arrange
            getProductTypeStub = spyOn(skuUtils, 'getProductType').and.returnValue(skuUtils.skuTypes.ROUGE_REWARD_CARD);
            const component = shallow(<CallToAction {...props} />);
            // Assert
            const RougeRewardButton = component.find(`RougeRewardButton[dataAt="${ADD_TO_BASKET_DATA_AT}"]`);
            expect(RougeRewardButton.exists()).toBe(true);
        });
    });

    describe('BOPIS tooltip component', () => {
        it('should be displayed when user lands on page for the first time ', () => {
            const wrapper = shallow(<CallToAction {...props} />);
            localStorageStub.and.returnValue(null);
            wrapper.instance().initializeState([wrapper.instance().getInitialBopisTooltipLogic({ sku: { isOnlineOnly: false } })]);

            expect(wrapper.find('Popover').length).toEqual(1);
        });

        it('should not be displayed if sku isOnlineOnly ', () => {
            const wrapper = shallow(<CallToAction {...props} />);
            localStorageStub.and.returnValue(true);
            wrapper.instance().initializeState([wrapper.instance().getInitialBopisTooltipLogic({ sku: { isOnlineOnly: true } })]);

            expect(wrapper.find('Popover').length).toEqual(0);
        });

        it('should not be displayed if it was already displayed and persisted in local storage ', () => {
            const wrapper = shallow(<CallToAction {...props} />);
            localStorageStub.and.returnValue(false);
            wrapper.instance().initializeState([wrapper.instance().getInitialBopisTooltipLogic({ sku: { isOnlineOnly: false } })]);

            expect(wrapper.find('Popover').length).toEqual(0);
        });

        it('should render SDDRougeFreeShip message when eligible', () => {
            spyOn(userUtils, 'isSDDRougeFreeShipEligible').and.returnValue(true);
            const wrapper = shallow(<CallToAction {...props} />);
            localStorageStub.and.returnValue(null);
            wrapper.instance().initializeState([wrapper.instance().getInitialBopisTooltipLogic({ sku: { isOnlineOnly: false } })]);

            expect(wrapper.find('Popover').props().content).toEqual(getText('SDDRougeFreeShip'));
        });

        it('should render SDDRougeTestFreeShipping message when eligible with $35 dolar Threshold', () => {
            spyOn(userUtils, 'isSDDRougeFreeShipEligible').and.returnValue(false);
            const wrapper = shallow(<CallToAction {...props} />);
            localStorageStub.and.returnValue(null);
            wrapper.instance().initializeState([wrapper.instance().getInitialBopisTooltipLogic({ sku: { isOnlineOnly: false } })]);

            expect(wrapper.find('Popover').props().content).toEqual(getText('SDDRougeTestFreeShipping', [35]));
        });
    });
});
