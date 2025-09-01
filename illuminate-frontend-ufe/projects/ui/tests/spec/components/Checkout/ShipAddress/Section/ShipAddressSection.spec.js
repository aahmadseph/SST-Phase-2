/* eslint-disable object-curly-newline */
const React = require('react');
const { any, objectContaining, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('ShipAddressSection component', () => {
    let ShipAddressSection;
    let ReactDOM;
    let store;
    let Actions;
    let orderUtils;
    let setStateStub;
    let component;
    let props;
    let addressStub;
    let dispatch;
    let dispatchStub;
    let showInfoModal;
    let showInfoModalStub;
    let e;
    let decorators;
    let userUtils;
    let OrderActions;
    let ErrorsUtils;
    let locationUtils;
    let ShipAddressActions;

    beforeEach(() => {
        ShipAddressSection = require('components/Checkout/Sections/ShipAddress/Section/ShipAddressSection').default;
        ReactDOM = require('react-dom');
        store = require('Store').default;
        Actions = require('Actions').default;
        orderUtils = require('utils/Order').default;
        decorators = require('utils/decorators').default;
        userUtils = require('utils/User').default;
        OrderActions = require('actions/OrderActions').default;
        ErrorsUtils = require('utils/Errors').default;
        locationUtils = require('utils/Location').default;
        ShipAddressActions = require('actions/ShipAddressActions').default;

        addressStub = {
            addressId: 12345,
            address1: '123 lane ave',
            address2: '',
            zipCode: 12345,
            city: 'Schenectady',
            state: 'New York',
            country: 'US',
            phoneNumber: '1231231234',
            isDefault: false,
            isAddressVerified: true
        };

        dispatch = store.dispatch;
        dispatchStub = spyOn(store, 'dispatch');
        showInfoModal = Actions.showInfoModal;
        showInfoModalStub = spyOn(Actions, 'showInfoModal');
    });

    describe('Handle Show More and Show Less Clicks', () => {
        let scrollIntoViewStub;

        beforeEach(() => {
            props = {
                profileAddresses: [addressStub, addressStub, addressStub, addressStub, addressStub, addressStub, addressStub]
            };
            const wrapper = shallow(<ShipAddressSection {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            component.refs = {
                shipAddress0: document.body,
                shipAddress1: document.body,
                shipAddress2: document.body,
                shipAddress3: document.body,
                shipAddress4: document.body,
                shipAddress5: document.body,
                shipAddress6: document.body
            };

            setStateStub.and.callFake((...args) => args[1]());
            scrollIntoViewStub = createSpy();
            spyOn(ReactDOM, 'findDOMNode').and.returnValue({
                scrollIntoView: scrollIntoViewStub
            });
        });

        describe('Show More Click', () => {
            it('should update addressesToDisplay state to 7', () => {
                component.handleShowMoreOnClick();
                expect(setStateStub).toHaveBeenCalledWith(
                    {
                        addressesToDisplay: 6
                    },
                    any(Function)
                );
            });

            it('should update addressesToDisplay state to 7', () => {
                component.state = {
                    addressesToDisplay: 6
                };
                component.handleShowMoreOnClick();
                expect(setStateStub).toHaveBeenCalledWith(
                    {
                        addressesToDisplay: 7
                    },
                    any(Function)
                );
            });

            it('should call scrollIntoViewStub', () => {
                component.handleShowMoreOnClick();
                expect(scrollIntoViewStub).toHaveBeenCalledWith({
                    block: 'start',
                    behavior: 'smooth'
                });
            });
        });

        describe('Show Less Click', () => {
            it('should update addressesToDisplay state to 3', () => {
                component.handleShowLessOnClick();
                expect(setStateStub).toHaveBeenCalledWith(
                    {
                        addressesToDisplay: 3
                    },
                    any(Function)
                );
            });

            it('should call scrollIntoViewStub', () => {
                component.handleShowLessOnClick();
                expect(scrollIntoViewStub).toHaveBeenCalledWith({
                    block: 'start',
                    behavior: 'smooth'
                });
            });
        });
    });

    describe('Show Add ShipAddress Form', () => {
        let originalConfigurationSettings;

        beforeEach(() => {
            e = {
                preventDefault: createSpy()
            };

            originalConfigurationSettings = window.Sephora.configurationSettings;
            window.Sephora.configurationSettings.maxShippingAddress = 3;

            showInfoModalStub.and.returnValue('showInfoModalStub');
        });

        afterEach(() => {
            window.Sephora.configurationSettings = originalConfigurationSettings;
        });

        it('should dispatch showInfoModal since number of addresses has reached limit', () => {
            const title = 'Remove address';
            const message = 'You can have up to 3 addresses. ' + 'Please delete one and try to add again.';
            const confirmButtonText = 'Continue';

            props = {
                profileAddresses: [addressStub, addressStub, addressStub]
            };
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();

            component.showAddShipAddressForm(e);

            expect(dispatchStub).toHaveBeenCalledWith('showInfoModalStub');
            expect(showInfoModalStub).toHaveBeenCalledWith({
                isOpen: true,
                title: title,
                message: message,
                buttonText: confirmButtonText
            });
        });

        it('should set openAddressForm state to true', () => {
            props = {
                profileAddresses: [addressStub],
                shippingGroupId: 0
            };
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            component.showAddShipAddressForm(e);
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    openAddressForm: true,
                    editAddress: null
                },
                any(Function)
            );
        });
    });

    describe('Show Edit ShipAddress Form', () => {
        it('should set openAddressForm state to true', () => {
            props = {
                profileAddresses: [addressStub],
                shippingGroupId: 0
            };
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            component.showEditShipAddressForm({ address: 'editAdress' });
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    openAddressForm: true,
                    editAddress: { address: 'editAdress' }
                },
                any(Function)
            );
        });
    });

    describe('Close ShipAddress Form', () => {
        it('should set openAdressForm state to false and clear editAddress state', () => {
            props = {
                profileAddresses: [addressStub],
                shippingGroupId: 0
            };
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            component.closeAddressForm();
            expect(setStateStub).toHaveBeenCalledWith({
                openAddressForm: false,
                editAddress: null
            });
        });
    });

    describe('Show Remove Ship Address Modal', () => {
        let title;
        let message;
        let confirmButtonText;
        let hasCancelButton;
        let cancelButtonText;
        let getOrderIdStub;
        let removeOrderShippingAddressStub;
        let fakePromise;
        let getAddressBookStub;
        let getOrderDetailsStub;
        let updateOrderStub;

        beforeEach(() => {
            e = { preventDefault: createSpy() };

            getOrderIdStub = spyOn(orderUtils, 'getOrderId').and.returnValue('1');

            removeOrderShippingAddressStub = spyOn(ShipAddressActions, 'removeOrderShippingAddress');
            getAddressBookStub = spyOn(ShipAddressActions, 'getAddressBook');
            getOrderDetailsStub = spyOn(ShipAddressActions, 'getOrderDetails');

            spyOn(userUtils, 'getProfileId').and.returnValue('profileId');
            spyOn(userUtils, 'getShippingCountry').and.returnValue({ countryCode: 'US' });

            updateOrderStub = spyOn(OrderActions, 'updateOrder');
            updateOrderStub.and.returnValue('updateOrderStub');

            spyOn(ErrorsUtils, 'collectAndValidateBackEndErrors');

            spyOn(decorators, 'withInterstice').and.callFake(arg0 => arg0);
        });

        it('should dispatch showInfoModal with correct arguments', () => {
            // Arrange
            store.dispatch = dispatch;
            dispatchStub = spyOn(store, 'dispatch');
            Actions.showInfoModal = showInfoModal;
            showInfoModalStub = spyOn(Actions, 'showInfoModal');
            title = 'Remove address';
            message = 'Are you sure you would like to permanently delete your address?';
            confirmButtonText = 'Remove';
            hasCancelButton = true;
            cancelButtonText = 'Cancel';
            props = {
                profileAddresses: [addressStub],
                shippingGroupId: 0
            };

            // Act
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();
            component.showRemoveShipAddressModal('12345', e);

            // Assert
            expect(dispatchStub).toHaveBeenCalled();
            expect(showInfoModalStub).toHaveBeenCalledWith({
                isOpen: true,
                title,
                message,
                buttonText: confirmButtonText,
                callback: any(Function),
                showCancelButton: hasCancelButton,
                cancelText: cancelButtonText,
                showCloseButton: true
            });
        });

        it('should execute callback promise on success when removing current order address', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve();
                    expect(getOrderIdStub).toHaveBeenCalledTimes(1);
                    expect(getOrderDetailsStub).toHaveBeenCalledTimes(1);
                    expect(getOrderDetailsStub).toHaveBeenCalledWith('1');
                    expect(getAddressBookStub).toHaveBeenCalledTimes(1);
                    done();

                    return fakePromise;
                },
                catch: () => {
                    return () => {};
                }
            };

            removeOrderShippingAddressStub.and.returnValue(fakePromise);
            getOrderDetailsStub.and.returnValue(Promise.resolve());
            getAddressBookStub.and.returnValue(Promise.resolve());

            props = {
                profileAddresses: [addressStub],
                shippingGroupId: 0,
                shippingAddress: {
                    addressId: '12345'
                }
            };
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();

            component.showRemoveShipAddressModal('12345', e);

            showInfoModalStub.calls.first().args[0].callback();

            expect(removeOrderShippingAddressStub).toHaveBeenCalledTimes(1);
            expect(removeOrderShippingAddressStub).toHaveBeenCalledWith('1', 0, '12345');
        });

        it('should execute callback promise on success when not removing current order address', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve();
                    expect(getOrderIdStub).toHaveBeenCalledTimes(1);
                    expect(getAddressBookStub).toHaveBeenCalledTimes(1);
                    done();

                    return fakePromise;
                },
                catch: () => {
                    return () => {};
                }
            };

            removeOrderShippingAddressStub.and.returnValue(fakePromise);
            getAddressBookStub.and.returnValue(Promise.resolve());

            props = {
                profileAddresses: [addressStub],
                shippingGroupId: 0
            };
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();

            component.showRemoveShipAddressModal('12345', e);

            showInfoModalStub.calls.first().args[0].callback();

            expect(removeOrderShippingAddressStub).toHaveBeenCalledTimes(1);
            expect(removeOrderShippingAddressStub).toHaveBeenCalledWith('1', 0, '12345');
        });
    });

    describe('Set New Shipping Address', () => {
        beforeEach(() => {
            props = {
                profileAddresses: [addressStub],
                shippingGroupId: 0
            };
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.state.addressValidated = true;
            component.setNewShippingAddress(addressStub);
        });

        it('should update this.newShippingAddress correctly', () => {
            const newAddressDataStub = Object.assign({}, addressStub);
            delete newAddressDataStub.isDefault;
            delete newAddressDataStub.isAddressVerified;
            const expectedObject = {
                address: newAddressDataStub,
                isDefaultAddress: false,
                shippingGroupId: 0,
                addressValidated: undefined
            };
            expect(component.newShippingAddress).toEqual(objectContaining(expectedObject));
        });

        it('should update currentShipAddressId state', () => {
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    currentShipAddressId: 12345
                },
                any(Function)
            );
        });

        describe('for AVS', () => {
            beforeEach(() => {
                Sephora.configurationSettings.enableAddressValidation = true;
                component.setNewShippingAddress(addressStub);
            });

            it('should call updateAddress with correct args', () => {
                const newAddressDataStub = Object.assign({}, addressStub);
                delete newAddressDataStub.isDefault;
                delete newAddressDataStub.isAddressVerified;
                const expectedObject = {
                    address: newAddressDataStub,
                    isDefaultAddress: false,
                    shippingGroupId: 0,
                    addressValidated: true
                };
                expect(component.newShippingAddress).toEqual(objectContaining(expectedObject));
            });
        });
    });

    describe('Save and Continue', () => {
        let sectionSavedStub;
        let updateShippingAddressStub;
        let fakePromise;
        let collectAndValidateBackEndErrorsStub;
        let validateAddressStub;

        beforeEach(() => {
            e = { preventDefault: createSpy() };
            sectionSavedStub = spyOn(OrderActions, 'sectionSaved');
            updateShippingAddressStub = spyOn(ShipAddressActions, 'updateShippingAddress');
            collectAndValidateBackEndErrorsStub = spyOn(ErrorsUtils, 'collectAndValidateBackEndErrors');
            spyOn(locationUtils, 'getLocation').and.returnValue({ pathname: '/checkout/shippingAddress' });
            spyOn(decorators, 'withInterstice').and.callFake(arg0 => arg0);
        });

        it('should do nothing if no selected address', () => {
            props = {
                profileAddresses: [addressStub],
                shippingGroupId: 0
            };
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();
            validateAddressStub = spyOn(component, 'validateAddress');
            component.saveAndContinue(e);
            expect(dispatchStub).toHaveBeenCalled();
            expect(sectionSavedStub).not.toHaveBeenCalled();
            expect(updateShippingAddressStub).not.toHaveBeenCalled();
        });

        describe('if current address is still selected', () => {
            beforeEach(() => {
                props = {
                    profileAddresses: [addressStub],
                    shippingGroupId: 0,
                    shippingAddress: addressStub
                };
                const wrapper = shallow(<ShipAddressSection {...props} />);
                component = wrapper.instance();
                validateAddressStub = spyOn(component, 'validateAddress');
            });

            it('should close section and move on', () => {
                component.saveAndContinue(e);
                expect(dispatchStub).toHaveBeenCalled();
                expect(sectionSavedStub).toHaveBeenCalledWith('/checkout/shippingAddress', component, false);
            });

            describe('for AVS', () => {
                beforeEach(() => {
                    Sephora.configurationSettings.enableAddressValidation = true;
                });

                it('should validate the address', () => {
                    component.saveAndContinue(e);
                    expect(validateAddressStub).toHaveBeenCalledWith(addressStub.addressId);
                });
            });
        });

        xit('should make api call and execute code in the then', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve();
                    expect(validateAddressStub).toHaveBeenCalledTimes(1);
                    expect(validateAddressStub).toHaveBeenCalledWith(addressStub.addressId);
                    done();

                    return fakePromise;
                },
                catch: () => {
                    return () => {};
                }
            };

            props = {
                profileAddresses: [addressStub],
                shippingGroupId: 0
            };
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();
            validateAddressStub = spyOn(component, 'validateAddress');
            component.newShippingAddress = { address: addressStub };

            updateShippingAddressStub.and.returnValue(fakePromise);
            component.saveAndContinue(e);

            expect(updateShippingAddressStub).toHaveBeenCalledTimes(1);
            expect(updateShippingAddressStub).toHaveBeenCalledWith(component.newShippingAddress);
        });

        xit('should make api call and execute code in the catch', done => {
            fakePromise = {
                then: () => {
                    return fakePromise;
                },
                catch: function (reject) {
                    reject({ errorData: 'errorData' });

                    expect(collectAndValidateBackEndErrorsStub).toHaveBeenCalledTimes(1);
                    expect(collectAndValidateBackEndErrorsStub).toHaveBeenCalledWith(
                        {
                            errorData: 'errorData'
                        },
                        component
                    );

                    done();

                    return fakePromise;
                }
            };

            props = {
                profileAddresses: [addressStub],
                shippingGroupId: 0
            };
            const wrapper = shallow(<ShipAddressSection {...props} />);
            component = wrapper.instance();

            component.newShippingAddress = addressStub;

            updateShippingAddressStub.and.returnValue(fakePromise);
            component.saveAndContinue(e);

            expect(updateShippingAddressStub).toHaveBeenCalledTimes(1);
            expect(updateShippingAddressStub).toHaveBeenCalledWith(component.newShippingAddress);
        });
    });

    describe('AccessPointButton component integration', () => {
        it('should be rendered', () => {
            const wrapperWithProps = shallow(
                <ShipAddressSection
                    {...props}
                    isHalAvailable
                    profileAddresses={[]}
                />,
                { disableLifecycleMethods: true }
            )
                .find('ShipAddressForm')
                .shallow();
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            expect(accessPointBtn.exists()).toBe(true);
        });

        it('should NOT be rendered when ShipAddressSection prop isHalAvailable is false', () => {
            const wrapperWithProps = shallow(
                <ShipAddressSection
                    {...props}
                    isHalAvailable={false}
                    profileAddresses={[]}
                />,
                { disableLifecycleMethods: true }
            )
                .find('ShipAddressForm')
                .shallow();
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            expect(accessPointBtn.exists()).toBe(false);
        });

        it('should NOT be passed a prop variant', () => {
            const wrapperWithProps = shallow(
                <ShipAddressSection
                    {...props}
                    isHalAvailable
                    profileAddresses={[]}
                />,
                { disableLifecycleMethods: true }
            )
                .find('ShipAddressForm')
                .shallow();
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            const fullVariant = accessPointBtn.props().variant;
            expect(fullVariant).toBe(undefined);
        });
    });
});
