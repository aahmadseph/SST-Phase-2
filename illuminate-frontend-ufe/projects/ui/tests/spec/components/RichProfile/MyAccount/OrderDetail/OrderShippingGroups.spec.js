/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');

describe('OrderShippingGroups component', function () {
    let OrderShippingGroups;
    let component;
    let store;
    let Actions;
    let OrderUtils;

    beforeEach(function () {
        store = require('Store').default;
        spyOn(store, 'getState').and.returnValue({ user: { smsStatus: { isSMSOptInAvailable: true } } });
        OrderUtils = require('utils/Order').default;
        Actions = require('Actions').default;
        OrderShippingGroups = require('components/RichProfile/MyAccount/OrderDetail/OrderShippingGroups').default;
        const wrapper = shallow(<OrderShippingGroups />);
        component = wrapper.instance();
    });

    describe('getGuestShippingAddress', () => {
        let testAddress = {};

        beforeEach(() => {
            testAddress = {
                firstName: 'testFirstName',
                lastName: 'testLastName',
                city: 'testCity',
                state: 'testState',
                postalCode: 'testPostalCode',
                someProp: 'testOtherVal'
            };
        });

        it('should keep firstName prop', () => {
            expect(component.getGuestShippingAddress(testAddress)).toEqual(jasmine.objectContaining({ firstName: 'testFirstName' }));
        });

        it('should keep lastName prop', () => {
            expect(component.getGuestShippingAddress(testAddress)).toEqual(jasmine.objectContaining({ lastName: 'testLastName' }));
        });

        it('should keep city prop', () => {
            expect(component.getGuestShippingAddress(testAddress)).toEqual(jasmine.objectContaining({ city: 'testCity' }));
        });

        it('should keep state prop', () => {
            expect(component.getGuestShippingAddress(testAddress)).toEqual(jasmine.objectContaining({ state: 'testState' }));
        });

        it('should keep postalCode prop', () => {
            expect(component.getGuestShippingAddress(testAddress)).toEqual(jasmine.objectContaining({ postalCode: 'testPostalCode' }));
        });

        it('should substring first three digits in postal code if a locale is Canada', () => {
            testAddress.postalCode = '123456';

            expect(component.getGuestShippingAddress(testAddress, true)).toEqual(jasmine.objectContaining({ postalCode: '123' }));
        });

        it('should remove other props', () => {
            expect(component.getGuestShippingAddress(testAddress)).not.toEqual(jasmine.objectContaining({ someProp: 'testOtherVal' }));
        });
    });

    describe('getGuestBillingAddress', () => {
        let testAddress = {};

        beforeEach(() => {
            testAddress = {
                firstName: 'testFirstName',
                lastName: 'testLastName',
                someProp: 'testOtherVal'
            };
        });

        it('should keep firstName prop', () => {
            expect(component.getGuestBillingAddress(testAddress)).toEqual(jasmine.objectContaining({ firstName: 'testFirstName' }));
        });

        it('should keep lastName prop', () => {
            expect(component.getGuestBillingAddress(testAddress)).toEqual(jasmine.objectContaining({ lastName: 'testLastName' }));
        });

        it('should remove other props', () => {
            expect(component.getGuestBillingAddress(testAddress)).not.toEqual(jasmine.objectContaining({ someProp: 'testOtherVal' }));
        });
    });

    describe('filterObject', () => {
        it('should remove keep props from the list in props array', () => {
            expect(
                component.filterObject(
                    {
                        a: 1,
                        b: 2,
                        c: 3
                    },
                    ['a']
                )
            ).toEqual(jasmine.objectContaining({ a: 1 }));
        });

        it('should remove props that are not in props array', () => {
            expect(
                component.filterObject(
                    {
                        a: 1,
                        b: 2,
                        c: 3
                    },
                    ['b']
                )
            ).not.toEqual(jasmine.objectContaining({ a: 1 }));
        });
    });
});
