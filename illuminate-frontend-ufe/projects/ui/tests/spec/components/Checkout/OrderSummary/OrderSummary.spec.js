/* eslint-disable no-unused-vars */
const ReactDOM = require('react-dom');
const store = require('Store').default;
const OrderSummary = require('components/Checkout/OrderSummary/OrderSummary').default;
const Actions = require('actions/Actions').default;
const basketUtils = require('utils/Basket').default;
const checkoutUtils = require('utils/Checkout').default;
const orderUtils = require('utils/Order').default;
const userUtils = require('utils/User').default;
const localeUtils = require('utils/LanguageLocale').default;
const UI = require('utils/UI').default;

const React = require('react');
const { shallow } = enzyme;
const { any } = jasmine;

describe('OrderSummary component', () => {
    let component;
    let wrapper;
    let showInfoModalStub;
    let showMediaModalStub;
    let dispatchStub;
    let setAndWatch;
    let setAndWatchStub;
    let isCanadaStub;
    let setStateStub;
    let findDOMNodeSpy;
    let scrollToSpy;
    let scrollBySpy;
    let orderDetails;
    let order;
    let calculateMerchandiseTotalStub;
    let getShippingCountryStub;

    beforeEach(() => {
        orderDetails = {
            priceInfo: {},
            items: {},
            promotion: {},
            header: { isComplete: false }
        };
        dispatchStub = spyOn(store, 'dispatch');
        setAndWatch = store.setAndWatch;
        setAndWatchStub = spyOn(store, 'setAndWatch');
        showInfoModalStub = spyOn(Actions, 'showInfoModal');
        showMediaModalStub = spyOn(Actions, 'showMediaModal');
        getShippingCountryStub = spyOn(userUtils, 'getShippingCountry').and.returnValue({ countryCode: 'US' });
        isCanadaStub = spyOn(localeUtils, 'isCanada').and.returnValue(false);
        wrapper = shallow(<OrderSummary />);
        component = wrapper.instance();
    });

    describe('the controller', function () {
        let callback;

        beforeEach(function () {
            order = { orderDetails: orderDetails };
            setStateStub = spyOn(component, 'setState');
            spyOn(orderUtils, 'calculateMerchandiseSubtotal').and.returnValue('$120.00');
            setAndWatchStub.and.callFake((...args) => {
                if (args[0] === 'order.orderDetails') {
                    callback = args[2];
                }
            });
            component.componentDidMount();
        });

        it('should set and watch for order details', () => {
            // Act
            wrapper = shallow(<OrderSummary />);
            component = wrapper.instance();

            // Assert
            expect(setAndWatchStub).toHaveBeenCalledWith('order.orderDetails', component, any(Function));
        });

        it('should call set state for canada locale', function () {
            const state = {
                isCanada: false,
                isUS: true
            };
            expect(setStateStub).toHaveBeenCalledWith(state);
        });

        it('should set and watch for order details callback should be called', async () => {
            await callback(order);
            expect(setStateStub.calls.mostRecent().args).toEqual([
                {
                    priceInfo: orderDetails.priceInfo,
                    items: orderDetails.items,
                    merchandiseTotal: '$120.00',
                    promotion: orderDetails.promotion,
                    itemsInOrderExpanded: orderDetails.header.isComplete,
                    isPlayEditOrder: undefined,
                    isPlayOrder: undefined,
                    paymentGroups: {}
                },
                any(Function)
            ]);
        });
    });

    describe('check for non credit card payment', () => {
        it('should return true for gift card payment', () => {
            const priceInfo = { giftCardAmount: 'some amount' };

            expect(checkoutUtils.isMoreThanJustCC(priceInfo)).toBeTruthy();
        });
    });

    describe('check for non credit card payment', () => {
        it('should return true for store card payment', () => {
            const priceInfo = { storeCardAmount: 'some amount' };

            expect(checkoutUtils.isMoreThanJustCC(priceInfo)).toBeTruthy();
        });
    });

    describe('check for non credit card payment', () => {
        it('should return true for eGift card payment', () => {
            const priceInfo = { eGiftCardAmount: 'some amount' };

            expect(checkoutUtils.isMoreThanJustCC(priceInfo)).toBeTruthy();
        });
    });

    describe('check for credit card payment', () => {
        it('should return false for credit card payment', () => {
            const priceInfo = { creditCardAmount: 'some amount' };

            expect(checkoutUtils.isMoreThanJustCC(priceInfo)).toBeFalsy();
        });
    });

    describe('calculate merchandise total function', () => {
        it('should return merchandise total if no gift card subtotal present', async () => {
            const priceInfo = { merchandiseSubtotal: '$120.00' };
            const subtotal = await orderUtils.calculateMerchandiseSubtotal(priceInfo);
            expect(subtotal).toEqual('$120.00');
        });

        it('should return merchandise total plus gift card subtotal if gift card present', async () => {
            const priceInfo = {
                merchandiseSubtotal: '$120.00',
                giftCardSubtotal: '$50.00'
            };
            const subtotal = await orderUtils.calculateMerchandiseSubtotal(priceInfo);
            expect(subtotal).toEqual('$170.00');
        });
    });

    describe('adjustScrollPositionForIOS', () => {
        beforeEach(() => {
            //Arrange
            spyOn(UI, 'isIOS').and.returnValue(true);
            scrollToSpy = spyOn(window, 'scrollTo');
            scrollBySpy = spyOn(window, 'scrollBy');
            findDOMNodeSpy = spyOn(ReactDOM, 'findDOMNode').and.callFake(() => {
                return {
                    offsetTop: 50,
                    offsetHeight: 50
                };
            });

            //Act
            wrapper = shallow(<OrderSummary isMobileGuest={true} />);
            component = wrapper.instance();
            component.adjustScrollPositionForIOS();
        });

        it('should call findDOMNode for Mobile Guests on IOS', () => {
            //Assert
            expect(findDOMNodeSpy).toHaveBeenCalled();
        });

        it('should call helperUtils.scrollTo with the correct params when state.itemsInOrderExpanded is Falsy', () => {
            //Assert
            expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
        });

        it('should call window.scrollBy with the correct params when state.itemsInOrderExpanded is true', () => {
            //Act
            wrapper = shallow(<OrderSummary isMobileGuest={true} />);
            component = wrapper.instance();
            component.setState({ itemsInOrderExpanded: true });
            component.adjustScrollPositionForIOS();

            //Assert
            expect(scrollBySpy).toHaveBeenCalledWith(0, 5);
        });
    });
});
