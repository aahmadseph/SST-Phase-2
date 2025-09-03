const React = require('react');
const { shallow } = enzyme;

let store;
let checkoutUtils;
let UtilActions;
let component;
let wrapper;

describe('Checkout Button', function () {
    beforeEach(function () {
        const CheckoutButton = require('components/CheckoutButton/CheckoutButton').default;

        store = require('Store').default;
        checkoutUtils = require('utils/Checkout').default;
        UtilActions = require('utils/redux/Actions').default;

        spyOn(UtilActions, 'merge');
        spyOn(checkoutUtils, 'initializeCheckout');
        spyOn(checkoutUtils, 'initOrderSuccess');
        spyOn(checkoutUtils, 'initOrderFailure');
        spyOn(store, 'dispatch');

        wrapper = shallow(<CheckoutButton />);
        component = wrapper.instance();
    });

    describe('Checkout method', function () {
        it('should disable apple pay session ', function () {
            checkoutUtils.initializeCheckout.and.returnValue(Promise.resolve());
            component.checkout();
            expect(UtilActions.merge).toHaveBeenCalledWith('applePaySession', 'isActive', false);
        });

        it('should dispatch an action for disabled applepay session ', function () {
            checkoutUtils.initializeCheckout.and.returnValue(Promise.resolve());
            UtilActions.merge.and.returnValue('whatever');
            component.checkout();
            expect(store.dispatch).toHaveBeenCalledWith('whatever');
        });

        it('should initialize checkout', function () {
            checkoutUtils.initializeCheckout.and.returnValue(Promise.resolve());
            component.checkout();
            expect(checkoutUtils.initializeCheckout).toHaveBeenCalledTimes(1);
        });

        it('should invoke checkoutUtils.initOrderSuccess when succeeds', function (done) {
            checkoutUtils.initializeCheckout.and.returnValue(Promise.resolve('AAA'));
            component.checkout().then(() => {
                expect(checkoutUtils.initOrderSuccess).toHaveBeenCalledWith('AAA');
                done();
            });
        });

        it('should invoke checkoutUtils.initOrderFailure when fails', function (done) {
            // eslint-disable-next-line prefer-promise-reject-errors
            checkoutUtils.initializeCheckout.and.returnValue(Promise.reject({ shouldBeObjectHere: true }));
            component.checkout().then(() => {
                expect(checkoutUtils.initOrderFailure).toHaveBeenCalledWith({ shouldBeObjectHere: true }, undefined);
                done();
            });
        });
    });
});
