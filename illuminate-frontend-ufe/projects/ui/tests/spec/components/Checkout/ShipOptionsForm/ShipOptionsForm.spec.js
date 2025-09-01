/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');

describe('ShipOptionsForm component', () => {
    let component;
    let wrapper;
    let props;
    let storeDispatchStub;
    let store;
    let checkoutApi;
    let OrderActions;
    let orderUtils;
    let Location;
    let ShipOptionsForm;
    let actionStubData;
    let fakePromise;
    let formsUtils;
    let decorators;

    const mockedShippingData = [
        {
            isComplete: false,
            shippingFee: '$0.00',
            shippingMethodDescription: '(Estimated Delivery: Fri 10/27)',
            shippingMethodId: '300004',
            shippingMethodType: 'Standard 3 Day'
        },
        {
            shippingFee: '$10.95',
            shippingMethodDescription: '(Estimated Delivery: Thu 10/26)',
            shippingMethodId: '300008',
            shippingMethodType: '2 Day Shipping'
        },
        {
            shippingFee: '$6.95',
            shippingMethodDescription: '(Estimated Delivery: Thu 10/26 to Mon 10/30)',
            shippingMethodId: '300012',
            shippingMethodType: 'USPS Priority'
        }
    ];

    beforeEach(() => {
        store = require('Store').default;
        checkoutApi = require('services/api/checkout').default;
        OrderActions = require('actions/OrderActions').default;
        orderUtils = require('utils/Order').default;
        formsUtils = require('utils/Forms').default;
        Location = require('utils/Location').default;

        ShipOptionsForm = require('components/Checkout/Sections/ShipOptions/ShipOptionsForm/ShipOptionsForm').default;

        storeDispatchStub = spyOn(store, 'dispatch');
        decorators = require('utils/decorators').default;
        spyOn(decorators, 'withInterstice').and.callFake(arg0 => arg0);
    });

    describe('#saveForm', () => {
        it('should dispatch Save Section Order Action to store', () => {
            props = {
                shippingMethods: [],
                shippingGroup: {
                    shippingMethod: mockedShippingData[0],
                    shippingGroupId: '0'
                }
            };
            wrapper = shallow(<ShipOptionsForm {...props} />);
            component = wrapper.instance();

            component.shipMethodsList = { getData: () => {} };
            spyOn(component.shipMethodsList, 'getData').and.returnValue(props.shippingGroup.shippingMethod);

            fakePromise = {
                then: function (callback) {
                    callback({});

                    return fakePromise;
                },
                catch: () => {}
            };

            spyOn(component, 'setShippingMethod').and.returnValue(fakePromise);

            actionStubData = {
                type: 'SECTION_SAVED',
                section: 'test'
            };
            spyOn(Location, 'getLocation').and.returnValue({ pathname: 'test' });
            spyOn(OrderActions, 'sectionSaved').and.returnValue(actionStubData);

            component.saveForm();
            expect(storeDispatchStub).toHaveBeenCalledWith(actionStubData);
        });
    });

    describe('#setShippingMethod', () => {
        it('should send shipping method to API', () => {
            props = {
                shippingMethods: [],
                shippingGroup: {
                    shippingMethod: mockedShippingData[0],
                    shippingGroupId: '0'
                }
            };

            wrapper = shallow(<ShipOptionsForm {...props} />);
            component = wrapper.instance();
            component.shipMethodsList = { getData: () => {} };

            const stubCheckoutApi = spyOn(checkoutApi, 'setShippingMethod');

            const newShippingMethod = props.shippingGroup.shippingMethod;
            const orderId = 'current';
            const sendData = {
                orderId,
                shippingGroupId: props.shippingGroup.shippingGroupId,
                shippingMethodId: newShippingMethod.shippingMethodId
            };

            component.setShippingMethod(props.shippingGroup, orderId, newShippingMethod);
            expect(stubCheckoutApi).toHaveBeenCalledWith(sendData);
        });
    });
});
