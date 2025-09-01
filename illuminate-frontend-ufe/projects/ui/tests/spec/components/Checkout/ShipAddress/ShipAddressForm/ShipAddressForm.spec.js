const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;

describe('ShipAddressForm component', () => {
    let ShipAddressForm;
    let checkoutApi;
    let decorators;
    let store;
    let OrderActions;
    let dispatchStub;
    let setStateStub;
    let component;
    let props;

    beforeEach(() => {
        ShipAddressForm = require('components/Checkout/Sections/ShipAddress/ShipAddressForm/ShipAddressForm').default;
        checkoutApi = require('services/api/checkout').default;
        decorators = require('utils/decorators').default;
        store = require('Store').default;
        dispatchStub = spyOn(store, 'dispatch');
        OrderActions = require('actions/OrderActions').default;
    });

    describe('Initialization of Ctrlr', () => {
        let togglePlaceOrderDisabledStub;

        it('should disable the place order button', () => {
            togglePlaceOrderDisabledStub = spyOn(OrderActions, 'togglePlaceOrderDisabled');
            togglePlaceOrderDisabledStub.and.returnValue('togglePlaceOrderDisabled');
            props = {
                isAddAddress: true,
                isEditMode: false,
                address: {},
                shippingGroupId: '0',
                isDefaultChecked: true,
                cancelCallback: createSpy()
            };
            const wrapper = shallow(<ShipAddressForm {...props} />);
            component = wrapper.instance();
            component.componentDidMount();

            expect(dispatchStub).toHaveBeenCalledWith('togglePlaceOrderDisabled');
            expect(togglePlaceOrderDisabledStub).toHaveBeenCalledWith(true);
        });
    });

    describe('Close Ship Address Form', () => {
        beforeEach(() => {
            props = {
                isAddAddress: true,
                isEditMode: false,
                address: {},
                shippingGroupId: '0',
                isDefaultChecked: true,
                cancelCallback: createSpy().and.returnValue('some_value!')
            };
            const wrapper = shallow(<ShipAddressForm {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        describe('For Mobile', () => {
            beforeEach(() => {
                spyOn(Sephora, 'isMobile').and.returnValue(true);
                spyOn(Sephora, 'isDesktop').and.returnValue(false);
                component.closeShipAddressForm();
            });

            it('should call setState and set isOpen to false', () => {
                expect(setStateStub).toHaveBeenCalledWith({ isOpen: false }, 'some_value!');
            });

            it('should call callback function passed in props', () => {
                expect(component.props.cancelCallback).toHaveBeenCalledTimes(1);
            });
        });

        describe('For Desktop', () => {
            beforeEach(() => {
                spyOn(Sephora, 'isMobile').and.returnValue(false);
                spyOn(Sephora, 'isDesktop').and.returnValue(true);
                component.closeShipAddressForm();
            });

            it('should not call setState', () => {
                expect(setStateStub).not.toHaveBeenCalled();
            });

            it('should call callback function passed in props', () => {
                expect(component.props.cancelCallback).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe('Handle Default Method', () => {
        describe('when props.isDefaultChecked is true', () => {
            beforeEach(() => {
                props = {
                    isAddAddress: true,
                    isEditMode: false,
                    address: {},
                    shippingGroupId: '0',
                    isDefaultChecked: true
                };
                const wrapper = shallow(<ShipAddressForm {...props} />);
                component = wrapper.instance();
                setStateStub = spyOn(component, 'setState');
                component.handleIsDefault();
            });

            it('should set isDefault state to false', () => {
                expect(setStateStub).toHaveBeenCalledWith({ isDefault: false });
            });
        });

        describe('when props.isDefaultChecked is false', () => {
            beforeEach(() => {
                props = {
                    isAddAddress: true,
                    isEditMode: false,
                    address: {},
                    shippingGroupId: '0',
                    isDefaultChecked: false
                };
                const wrapper = shallow(<ShipAddressForm {...props} />);
                component = wrapper.instance();
                setStateStub = spyOn(component, 'setState');
                component.handleIsDefault();
            });

            it('should set isDefault state to true', () => {
                expect(setStateStub).toHaveBeenCalledWith({ isDefault: true });
            });
        });

        describe('analytics tracking', () => {
            let processEvent;
            let processStub;

            beforeEach(() => {
                processEvent = require('analytics/processEvent').default;
                processStub = spyOn(processEvent, 'process');
                props = {
                    isAddAddress: true,
                    isEditMode: false,
                    address: {},
                    shippingGroupId: '0',
                    isDefaultChecked: true
                };
                const wrapper = shallow(<ShipAddressForm {...props} />);
                wrapper.setState({ isDefault: true });
                component = wrapper.instance();
                component.handleIsDefault();
            });

            it('should call linkTracking event with the correct values', () => {
                const linkTrackingData = {
                    data: {
                        eventStrings: ['event71', 'event121'],
                        linkName: 'D=c55',
                        pageDetail: digitalData.page.pageInfo.pageName,
                        actionInfo: 'checkout:default shipping address',
                        previousPage: 'checkout:shipping:n/a:*'
                    }
                };
                expect(processStub).toHaveBeenCalledWith('linkTrackingEvent', linkTrackingData);
            });
        });
    });

    describe('show error method', () => {
        beforeEach(() => {
            props = {
                isAddAddress: true,
                isEditMode: false,
                address: {},
                shippingGroupId: '0',
                isDefaultChecked: true,
                cancelCallback: createSpy()
            };
            const wrapper = shallow(<ShipAddressForm {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        describe('when handleResponseError returns false', () => {
            beforeEach(() => {
                component.addressForm = { handleResponseError: createSpy().and.returnValue(false) };
                component.showError('this is an error');
            });

            it('should call this.addressForm.handleResponse once', () => {
                expect(component.addressForm.handleResponseError).toHaveBeenCalledTimes(1);
            });

            it('should set state for errorMessages with message', () => {
                expect(setStateStub).toHaveBeenCalledWith({ errorMessages: ['this is an error'] });
            });
        });

        describe('when handleResponseError returns true', () => {
            beforeEach(() => {
                component.addressForm = { handleResponseError: createSpy().and.returnValue(true) };
            });

            it('should not set state for errorMessages', () => {
                expect(setStateStub).not.toHaveBeenCalled();
            });
        });
    });

    describe('validate address form method', () => {
        let e;
        beforeEach(() => {
            e = { preventDefault: createSpy() };
            const wrapper = shallow(<ShipAddressForm {...props} />);
            component = wrapper.instance();
            component.addressForm = { validateForm: createSpy().and.returnValue(true) };
            component.createAddress = createSpy();
            setStateStub = spyOn(component, 'setState');
        });

        it('should call preventDefault once', () => {
            component.validateAddressForm(e);
            expect(e.preventDefault).toHaveBeenCalledTimes(1);
        });

        it('should call setState to remove errorMessages', () => {
            component.validateAddressForm(e);
            expect(setStateStub).toHaveBeenCalledWith({ errorMessages: '' });
        });

        it('should call this.addressForm.validateForm once', () => {
            component.validateAddressForm(e);
            expect(component.addressForm.validateForm).toHaveBeenCalledTimes(1);
        });

        it('should call create address if it is valid', () => {
            component.validateAddressForm(e);
            expect(component.createAddress).toHaveBeenCalled();
        });

        it('should not call create address if it is not valid', () => {
            component.addressForm.validateForm.and.returnValue(false);
            component.validateAddressForm(e);
            expect(component.createAddress).not.toHaveBeenCalled();
        });
    });

    describe('create address method', () => {
        let createShippingAddressStub;
        let updateShippingAddressStub;
        let fakePromise;
        beforeEach(() => {
            fakePromise = {
                then: () => {
                    return fakePromise;
                },
                catch: () => {
                    return () => {};
                }
            };
            createShippingAddressStub = spyOn(checkoutApi, 'createShippingAddress').and.returnValue(fakePromise);
            updateShippingAddressStub = spyOn(checkoutApi, 'updateShippingAddress').and.returnValue(fakePromise);
            spyOn(decorators, 'withInterstice').and.callFake(arg0 => arg0);
            const wrapper = shallow(<ShipAddressForm {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.addressForm = {
                validateForm: createSpy().and.returnValue(true),
                getData: createSpy().and.returnValue({}),
                hasAVS: createSpy().and.returnValue(false),
                isAddressVerified: createSpy().and.returnValue(true),
                isAddressModified: createSpy().and.returnValue(true)
            };
            component.validateAddress = createSpy();
            component.sectionSaved = createSpy();
            component.state.isDefault = true;
        });

        describe('for update address', () => {
            beforeEach(() => {
                component.props = {
                    address: { address1: 'address1' },
                    isAddAddress: false,
                    isEditMode: true,
                    shippingGroupId: '0',
                    isDefaultChecked: true,
                    cancelCallback: createSpy()
                };
            });

            it('should call this.addressForm.getData once', () => {
                component.createAddress();
                expect(component.addressForm.getData).toHaveBeenCalledTimes(1);
            });

            it('should call updateShippingAddress API with correct args', () => {
                component.createAddress();
                expect(updateShippingAddressStub).toHaveBeenCalledWith({
                    addressValidated: undefined,
                    isDefaultAddress: true,
                    shippingGroupId: '0'
                });
            });

            it('should call validateAddress with correct args', done => {
                fakePromise = {
                    then: function (resolve) {
                        resolve({ addressId: 'id' });
                        expect(component.validateAddress).toHaveBeenCalledWith(
                            { addressId: 'id' },
                            {
                                isDefaultAddress: true,
                                shippingGroupId: '0',
                                addressValidated: undefined
                            }
                        );
                        done();

                        return fakePromise;
                    },
                    catch: () => {
                        return () => {};
                    }
                };
                updateShippingAddressStub.and.returnValue(fakePromise);
                component.createAddress();
            });

            describe('for AVS', () => {
                beforeEach(() => {
                    Sephora.configurationSettings.enableAddressValidation = true;
                    component.addressForm.hasAVS.and.returnValue(true);
                    component.createAddress();
                });

                it('should call updateShippingAddress API with correct args', () => {
                    expect(updateShippingAddressStub).toHaveBeenCalledWith({
                        addressValidated: true,
                        isDefaultAddress: true,
                        shippingGroupId: '0'
                    });
                });
            });
        });

        describe('for add address', () => {
            beforeEach(() => {
                component.props = {
                    isAddAddress: true,
                    isEditMode: false,
                    address: null,
                    shippingGroupId: '0',
                    isDefaultChecked: true,
                    cancelCallback: createSpy()
                };
            });

            it('should call this.addressForm.getData once', () => {
                component.createAddress();
                expect(component.addressForm.getData).toHaveBeenCalledTimes(1);
            });

            it('should call createShippingAddress API with correct args', () => {
                component.createAddress();
                expect(createShippingAddressStub).toHaveBeenCalledWith({
                    addressValidated: undefined,
                    isDefaultAddress: true,
                    shippingGroupId: '0'
                });
            });

            it('should call validateAddress on success func with correct args', done => {
                fakePromise = {
                    then: function (resolve) {
                        resolve({ addressId: 'id' });
                        expect(component.validateAddress).toHaveBeenCalledWith(
                            { addressId: 'id' },
                            {
                                isDefaultAddress: true,
                                shippingGroupId: '0',
                                addressValidated: undefined
                            }
                        );
                        done();

                        return fakePromise;
                    },
                    catch: () => {
                        return () => {};
                    }
                };
                createShippingAddressStub.and.returnValue(fakePromise);
                component.createAddress();
            });

            describe('for AVS', () => {
                beforeEach(() => {
                    Sephora.configurationSettings.enableAddressValidation = true;
                    component.addressForm.hasAVS.and.returnValue(true);
                    component.createAddress();
                });

                it('should call createShippingAddress API with correct args', () => {
                    expect(createShippingAddressStub).toHaveBeenCalledWith({
                        addressValidated: true,
                        isDefaultAddress: true,
                        shippingGroupId: '0'
                    });
                });
            });
        });
    });

    describe('AccessPointButton component integration', () => {
        it('should be rendered', () => {
            const wrapperWithProps = shallow(
                <ShipAddressForm
                    {...props}
                    isHalAvailable
                />
            );
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            expect(accessPointBtn.length).toBe(1);
        });

        it('should NOT be rendered when ShipAddressForm prop isHalAvailable is false', () => {
            const wrapperWithProps = shallow(
                <ShipAddressForm
                    {...props}
                    isHalAvailable={false}
                />
            );
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            expect(accessPointBtn.length).toBe(0);
        });

        it('should NOT be passed a prop variant', () => {
            const wrapperWithProps = shallow(
                <ShipAddressForm
                    {...props}
                    isHalAvailable
                />
            );
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            const fullVariant = accessPointBtn.props().variant;
            expect(fullVariant).toBe(undefined);
        });
    });
});
