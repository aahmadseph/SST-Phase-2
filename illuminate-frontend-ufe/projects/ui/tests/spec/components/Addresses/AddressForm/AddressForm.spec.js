/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const { any, createSpy } = jasmine;

describe('AddressForm component', () => {
    let AddressActions;
    let localeUtils;
    let COUNTRIES;
    let AddressForm;
    let ErrorsUtils;
    let store;
    let getStateListStub;
    let props;
    let wrapper;
    let component;
    let setStateStub;
    let updateEditStoreStub;
    let setAndWatchStub;
    let utilityApi;
    let dispatchStub;
    let EditDataActions;
    let keyConsts;
    let processEvent;
    let helperUtils;
    let addressUtils;

    beforeEach(() => {
        AddressActions = require('actions/AddressActions').default;
        localeUtils = require('utils/LanguageLocale').default;
        addressUtils = require('utils/Address').default;
        keyConsts = require('utils/KeyConstants').default;
        COUNTRIES = localeUtils.COUNTRIES;
        AddressForm = require('components/Addresses/AddressForm/AddressForm').default;
        ErrorsUtils = require('utils/Errors').default;
        store = require('Store').default;
        utilityApi = require('services/api/utility').default;
        dispatchStub = spyOn(store, 'dispatch');
        EditDataActions = require('actions/EditDataActions').default;
        processEvent = require('analytics/processEvent').default;
        helperUtils = require('utils/Helpers').default;
        props = {
            editStore: 'addressFormTest'
        };
        wrapper = shallow(<AddressForm {...props} />);
        component = wrapper.instance();
        setStateStub = spyOn(component, 'setState');
    });

    describe('Initialize Ctrlr', () => {
        let setStateListStub;
        let getStateList;
        let setAndWatch;

        beforeEach(() => {
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            getStateList = AddressActions.getStateList;
            getStateListStub = spyOn(AddressActions, 'getStateList');
            setStateListStub = spyOn(component, 'setStateList');
            setAndWatch = store.setAndWatch;
            setAndWatchStub = spyOn(store, 'setAndWatch');
        });

        describe('for US addresses', () => {
            it('should call getStateList for US user', () => {
                // Arrange
                AddressActions.getStateList = getStateList;
                getStateListStub = spyOn(AddressActions, 'getStateList');
                component.state = {
                    isInternational: false,
                    address: {
                        country: COUNTRIES.US
                    }
                };

                // Act
                component.componentDidMount();

                // Assert
                expect(getStateListStub).toHaveBeenCalledTimes(1);
                expect(getStateListStub).toHaveBeenCalledWith(COUNTRIES.US, any(Function));
            });

            it('should call setStateList for addressForm after getting the state list', () => {
                // Arrange
                component.state = {
                    isInternational: false,
                    address: {
                        country: COUNTRIES.US
                    }
                };

                // Act
                component.componentDidMount();

                // Assert
                const states = ['usState1', 'usState2', 'usState3'];
                getStateListStub.calls.argsFor(0)[1](states);
                expect(setStateListStub).toHaveBeenCalledTimes(1);
                expect(setStateListStub).toHaveBeenCalledWith(states, COUNTRIES.US);
            });
        });

        describe('for CA addresses', () => {
            it('should call getStateList for CA user', () => {
                // Arrange
                AddressActions.getStateList = getStateList;
                getStateListStub = spyOn(AddressActions, 'getStateList');
                component.state = {
                    isInternational: false,
                    address: {
                        country: COUNTRIES.CA
                    }
                };

                // Act
                component.componentDidMount();

                // Assert
                expect(getStateListStub).toHaveBeenCalledTimes(1);
                expect(getStateListStub).toHaveBeenCalledWith(COUNTRIES.CA, any(Function));
            });

            it('should call setStateList for addressForm after getting the state list', () => {
                // Arrange
                component.state = {
                    isInternational: false,
                    address: {
                        country: COUNTRIES.CA
                    }
                };

                // Act
                component.componentDidMount();
                const states = ['caState1', 'caState2', 'caState3'];
                getStateListStub.calls.argsFor(0)[1](states);

                // Assert
                expect(setStateListStub).toHaveBeenCalledTimes(1);
                expect(setStateListStub).toHaveBeenCalledWith(states, COUNTRIES.CA);
            });
        });

        describe('for International addresses', () => {
            beforeEach(() => {
                component.state = {
                    isInternational: true,
                    address: {
                        country: 'Japan'
                    }
                };
                component.props = {
                    isEditMode: true,
                    address: {
                        state: 'internationalState'
                    },
                    editStore: 'addressFormTest'
                };
                component.componentDidMount();
            });

            it('should not call getStateList for International user', () => {
                expect(getStateListStub).not.toHaveBeenCalled();
            });

            it('should call updateEditStore for International user in edit mode', () => {
                expect(updateEditStoreStub).toHaveBeenCalledTimes(1);
                expect(updateEditStoreStub).toHaveBeenCalledWith('state', component.props.address.state);
            });
        });

        describe('for all country addresses', () => {
            let editDataStub;
            let prevStateStub;

            it('should call setAndWatch once with correct arguments', () => {
                // Arrange
                store.setAndWatch = setAndWatch;
                setAndWatchStub = spyOn(store, 'setAndWatch');

                // Act
                component.componentDidMount();

                // Assert
                expect(setAndWatchStub).toHaveBeenCalledTimes(1);
                expect(setAndWatchStub).toHaveBeenCalledWith('editData.addressFormTest', component, any(Function));
            });

            it('should call setAndWatch callback function', () => {
                // Arrange
                editDataStub = {
                    ['addressFormTest']: {
                        newAddress: 'testAddress'
                    }
                };
                prevStateStub = {
                    address: {}
                };

                // Act
                component.componentDidMount();
                setAndWatchStub.calls.argsFor(0)[2](editDataStub);

                // Assert
                expect(setStateStub).toHaveBeenCalledTimes(1);
                expect(setStateStub.calls.argsFor(0)[0](prevStateStub)).toEqual({
                    address: {
                        newAddress: 'testAddress'
                    }
                });
            });
        });
    });

    describe('Update Edit Store', () => {
        let getStateStub;
        let updateEditDataStub;

        beforeEach(() => {
            getStateStub = spyOn(store, 'getState').and.returnValue({
                editData: {
                    addressFormTest: {
                        newAddress: 'oldAddress'
                    }
                }
            });
            updateEditDataStub = spyOn(EditDataActions, 'updateEditData');
            component.updateEditStore('newAddress', 'testAddress');
        });

        it('should call store.getState once to get current editData', () => {
            expect(getStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call updateEditData with correct arguments', () => {
            expect(updateEditDataStub).toHaveBeenCalledTimes(1);
            expect(updateEditDataStub).toHaveBeenCalledWith({ newAddress: 'testAddress' }, 'addressFormTest');
        });
    });

    describe('Component will unmount', () => {
        let clearEditDataStub;
        let clearTimeoutStub;

        beforeEach(() => {
            clearEditDataStub = spyOn(EditDataActions, 'clearEditData');
            clearTimeoutStub = spyOn(global, 'clearTimeout');

            component.componentWillUnmount();
        });

        it('should dispatch editDataActions.clearEditData with props.editStore', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(clearEditDataStub).toHaveBeenCalledTimes(1);
            expect(clearEditDataStub).toHaveBeenCalledWith('addressFormTest');
        });

        it('should call clearTimeout to unsubscribe any pending debounce timer', () => {
            expect(clearTimeoutStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('formatZipPostalCode', () => {
        let formatZipPostalCodeSpy;

        beforeEach(() => {
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            formatZipPostalCodeSpy = spyOn(addressUtils, 'formatZipPostalCode').and.returnValue('formatted postal code');
            component.formatZipPostalCode('12345', '-', 5, 9);
        });

        it('should call formatZipPostalCode util with correct args', () => {
            expect(formatZipPostalCodeSpy).toHaveBeenCalledWith('12345', '-', 5, 9);
        });

        it('should call updateEditStore with correct args', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('postalCode', 'formatted postal code');
        });
    });

    describe('Handle Zip Code On Change', () => {
        let formatZipCodeStub;
        let formatPostalCodeStub;
        let autoFillCityAndStateStub;
        let e;

        beforeEach(() => {
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            autoFillCityAndStateStub = spyOn(component, 'autoFillCityAndState');
            e = {
                inputType: 'input',
                target: {
                    value: '1'
                }
            };
        });

        describe('For US Addresses', () => {
            beforeEach(() => {
                component.state = {
                    address: {
                        country: COUNTRIES.US
                    }
                };
                formatZipCodeStub = spyOn(component, 'formatZipPostalCode');
            });

            it('should call formatZipCode with e.data and e.inputType as arguments', () => {
                formatZipCodeStub.and.returnValue('1');
                component.handleZipCodeOnChange(e);

                expect(formatZipCodeStub).toHaveBeenCalledWith(e.target.value, '-', 5, 9);
            });

            describe('if zipCode becomes 9 digits with a hyphen', () => {
                beforeEach(() => {
                    formatZipCodeStub.and.returnValue('12345-1234');
                });

                it('should call autoFillCityAndState', () => {
                    component.handleZipCodeOnChange(e);

                    expect(autoFillCityAndStateStub).toHaveBeenCalledTimes(1);
                    expect(autoFillCityAndStateStub).toHaveBeenCalledWith('12345-1234');
                });

                it('should not call autoFillCityAndState if city and state are already set', () => {
                    component.state = {
                        address: {
                            state: 'CA',
                            city: 'San Francisco',
                            country: COUNTRIES.US
                        }
                    };
                    component.handleZipCodeOnChange(e);

                    expect(autoFillCityAndStateStub).not.toHaveBeenCalled();
                });

                it('should not call autoFillCityAndState zipCode is invalid', () => {
                    component.state = {
                        address: {
                            country: COUNTRIES.US
                        },
                        zipCodeInvalid: true
                    };
                    component.handleZipCodeOnChange(e);

                    expect(autoFillCityAndStateStub).not.toHaveBeenCalled();
                });
            });

            describe('if zipCode becomes less than 5', () => {
                beforeEach(() => {
                    formatZipCodeStub.and.returnValue('1234');
                    component.state = {
                        address: {
                            state: 'CA',
                            city: 'San Francisco',
                            country: COUNTRIES.US
                        }
                    };
                    component.handleZipCodeOnChange(e);
                });

                it('should not call autoFillCityAndState', () => {
                    expect(autoFillCityAndStateStub).not.toHaveBeenCalled();
                });

                it('should remove state and city from edit store', () => {
                    expect(updateEditStoreStub).toHaveBeenCalledTimes(2);
                    expect(updateEditStoreStub.calls.argsFor(0)).toEqual(['state', '']);
                    expect(updateEditStoreStub.calls.argsFor(1)).toEqual(['city', '']);
                });

                it('should setState to clear errors and hide city and state fields', () => {
                    expect(setStateStub).toHaveBeenCalledTimes(1);
                    expect(setStateStub).toHaveBeenCalledWith({
                        zipCodeInvalid: null,
                        cityStateZipInvalid: null,
                        displayCityStateInputs: false
                    });
                });
            });

            describe('if zipCode becomes 5 digits', () => {
                beforeEach(() => {
                    formatZipCodeStub.and.returnValue('12345');
                });

                it('should call autoFillCityAndState if zipCode is 5 digits', () => {
                    component.handleZipCodeOnChange(e);

                    expect(autoFillCityAndStateStub).toHaveBeenCalledTimes(1);
                    expect(autoFillCityAndStateStub).toHaveBeenCalledWith('12345');
                });

                it('should not call autoFillCityAndState if same zipCode was already set', () => {
                    component.state = {
                        address: {
                            country: COUNTRIES.US,
                            postalCode: '12345'
                        },
                        zipCodeInvalid: true
                    };
                    component.handleZipCodeOnChange(e);

                    expect(autoFillCityAndStateStub).not.toHaveBeenCalled();
                });
            });
        });

        describe('For CA Addresses', () => {
            beforeEach(() => {
                component.state = {
                    address: {
                        country: COUNTRIES.CA
                    }
                };
                formatPostalCodeStub = spyOn(component, 'formatZipPostalCode');
            });

            it('should call formatPostalCode with e.data and e.inputType as arguments', () => {
                formatPostalCodeStub.and.returnValue('1');
                component.handleZipCodeOnChange(e);

                expect(formatPostalCodeStub).toHaveBeenCalledWith(e.target.value, ' ', 3, 6);
            });

            describe('if zipCode becomes 6 chars with a space', () => {
                beforeEach(() => {
                    formatPostalCodeStub.and.returnValue('123 456');
                });

                it('should call autoFillCityAndState', () => {
                    component.handleZipCodeOnChange(e);

                    expect(autoFillCityAndStateStub).toHaveBeenCalledTimes(1);
                    expect(autoFillCityAndStateStub).toHaveBeenCalledWith('123 456');
                });
            });

            describe('if postalCode becomes less than 6 chars', () => {
                beforeEach(() => {
                    formatPostalCodeStub.and.returnValue('123 45');
                    component.state = {
                        address: {
                            state: 'BC',
                            city: 'Vancouver',
                            country: COUNTRIES.CA
                        }
                    };
                    component.handleZipCodeOnChange(e);
                });

                it('should not call autoFillCityAndState', () => {
                    expect(autoFillCityAndStateStub).not.toHaveBeenCalled();
                });

                it('should remove state and city from edit store', () => {
                    expect(updateEditStoreStub).toHaveBeenCalledTimes(2);
                    expect(updateEditStoreStub.calls.argsFor(0)).toEqual(['state', '']);
                    expect(updateEditStoreStub.calls.argsFor(1)).toEqual(['city', '']);
                });

                it('should setState to clear errors and hide city and state fields', () => {
                    expect(setStateStub).toHaveBeenCalledTimes(1);
                    expect(setStateStub).toHaveBeenCalledWith({
                        zipCodeInvalid: null,
                        cityStateZipInvalid: null,
                        displayCityStateInputs: false
                    });
                });
            });
        });

        describe('For International Addresses', () => {
            it('should just update the edit store with new value', () => {
                component.state = {
                    address: {
                        country: 'Japan'
                    }
                };
                component.handleZipCodeOnChange(e);

                expect(updateEditStoreStub).toHaveBeenCalledTimes(1);
                expect(updateEditStoreStub).toHaveBeenCalledWith('postalCode', e.target.value);
            });
        });
    });

    describe('Auto Fill City And State', () => {
        let getStateAndCityForZipCodeStub;
        let fakePromise;

        beforeEach(() => {
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            getStateAndCityForZipCodeStub = spyOn(utilityApi, 'getStateAndCityForZipCode');
            component.state = {
                address: {
                    country: COUNTRIES.US
                }
            };
        });

        it('should make getStateAndCityForZipCode api call with correct arguments', () => {
            getStateAndCityForZipCodeStub.and.returnValue(
                Promise.resolve({
                    state: 'NY',
                    city: 'New York'
                })
            );
            component.autoFillCityAndState('12345');
            expect(getStateAndCityForZipCodeStub).toHaveBeenCalledTimes(1);
            expect(getStateAndCityForZipCodeStub).toHaveBeenCalledWith(COUNTRIES.US, '12345');
        });

        it('should set state and update edit store after api success', function (done) {
            fakePromise = {
                then: function (resolve) {
                    resolve({
                        state: 'NY',
                        city: 'New York'
                    });
                    expect(setStateStub).toHaveBeenCalledTimes(1);
                    expect(setStateStub).toHaveBeenCalledWith({
                        displayCityStateInputs: true,
                        zipCodeInvalid: null
                    });

                    expect(updateEditStoreStub).toHaveBeenCalledTimes(2);
                    expect(updateEditStoreStub).toHaveBeenCalledWith('state', 'NY');
                    expect(updateEditStoreStub).toHaveBeenCalledWith('city', 'New York');

                    done();

                    return fakePromise;
                },
                catch: () => {
                    return () => {};
                }
            };

            getStateAndCityForZipCodeStub.and.returnValue(fakePromise);
            component.autoFillCityAndState('12345');
        });

        it('should set state and update edit store after api failure', function (done) {
            fakePromise = {
                then: () => {
                    return fakePromise;
                },
                catch: function (reject) {
                    reject();

                    expect(setStateStub).toHaveBeenCalledTimes(1);
                    expect(setStateStub).toHaveBeenCalledWith({
                        displayCityStateInputs: false,
                        zipCodeInvalid: 'Please enter a valid zipcode.'
                    });

                    expect(updateEditStoreStub).toHaveBeenCalledTimes(2);
                    expect(updateEditStoreStub).toHaveBeenCalledWith('state', '');
                    expect(updateEditStoreStub).toHaveBeenCalledWith('city', '');

                    done();

                    return fakePromise;
                }
            };

            getStateAndCityForZipCodeStub.and.returnValue(fakePromise);
            component.autoFillCityAndState('12111');
        });
    });

    describe('Format Phone Number', () => {
        const e = {
            target: {
                value: ''
            },
            inputType: ''
        };

        beforeEach(() => {
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            component.state = {
                isInternational: false
            };
            component.phoneNumberInput = {
                setValue: () => {}
            };
        });

        it('should format phone number to 1', () => {
            e.target.value = '1';
            component.formatPhoneNumber(e);
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    address: {
                        phone: '1',
                        formattedPhone: ''
                    }
                },
                any(Function)
            );
        });

        it('should format phone number to (123)4', () => {
            e.target.value = '1234';
            component.formatPhoneNumber(e);
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    address: {
                        phone: '1234',
                        formattedPhone: '(123) 4'
                    }
                },
                any(Function)
            );
        });

        it('should format phone number to (123) 456-7', () => {
            e.target.value = '1234567';
            component.formatPhoneNumber(e);
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    address: {
                        phone: '1234567',
                        formattedPhone: '(123) 456-7'
                    }
                },
                any(Function)
            );
        });

        it('should remove hyphen from phone number to (123) 456', () => {
            e.target.value = '123456';
            e.target.inputType = 'deleteContentBackward';
            component.formatPhoneNumber(e);
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    address: {
                        phone: '123456',
                        formattedPhone: '(123) 456'
                    }
                },
                any(Function)
            );
        });
    });

    describe('Set State List', () => {
        let stateList;

        beforeEach(() => {
            stateList = [{ description: 'state1' }, { description: 'state2' }, { description: 'state3' }];
        });

        it('should setState for country and stateList for new address creation', () => {
            component.stateSelect = {
                setValue: createSpy()
            };
            component.countrySelect = {
                setValue: createSpy()
            };
            component.setStateList(stateList, COUNTRIES.US);

            expect(setStateStub).toHaveBeenCalledWith({
                stateList: stateList
            });
        });

        it('should setState for country, stateList, and selectedState for edit address mode', () => {
            component.props = {
                isEditMode: true,
                address: { state: 'CA' }
            };
            component.stateSelect = {
                setValue: createSpy()
            };
            component.countrySelect = {
                setValue: createSpy()
            };
            component.setStateList(stateList, COUNTRIES.US);

            expect(setStateStub).toHaveBeenCalledWith({
                stateList: stateList
            });
        });
    });

    describe('Handle State Select', () => {
        let e;

        beforeEach(() => {
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            e = {
                target: {
                    value: 'CA'
                }
            };
        });

        it('should setState for newly selected state', () => {
            component.handleStateSelect(e);
            expect(updateEditStoreStub).toHaveBeenCalledWith('state', 'CA');
        });
    });

    describe('Handle City OnChange', () => {
        let e;

        beforeEach(() => {
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            e = {
                target: {
                    name: 'city',
                    value: 'San Francisco'
                }
            };
            component.handleCityOnChange(e);
        });

        it('should update editStore for city', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith(e.target.name, e.target.value);
        });

        it('should setState for cityStateZipInvalid', () => {
            expect(setStateStub).toHaveBeenCalledWith({
                cityStateZipInvalid: null
            });
        });
    });

    describe('Reset Country And State Info', () => {
        let country;
        let stateList;
        let isInternational;

        beforeEach(() => {
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            country = COUNTRIES.US;
            stateList = [{ description: 'state1' }, { description: 'state2' }, { description: 'state3' }];
            isInternational = false;

            component.props = {
                isCheckout: false
            };

            component.cityInput = {
                setValue: createSpy()
            };
            component.zipCodeInput = {
                setValue: createSpy()
            };
            component.resetCountryAndStateInfo(country, stateList, isInternational);
        });

        it('should setState using country, stateList, and isInternational', () => {
            expect(setStateStub).toHaveBeenCalledWith({
                stateList: stateList,
                isInternational: isInternational,
                displayCityStateInputs: false,
                zipCodeInvalid: null,
                address: {
                    country: undefined,
                    phone: '',
                    formattedPhone: ''
                }
            });
        });

        it('should update countryInput value', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('country', COUNTRIES.US);
        });

        it('should clear cityInput value', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('city', '');
        });

        it('should clear out zipCodeInput value', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('postalCode', '');
        });

        it('should clear out stateInput value', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('state', '');
        });
    });

    describe('Handle Country Select', () => {
        let e;
        let resetCountryAndStateInfoStub;
        let states;

        beforeEach(() => {
            getStateListStub = spyOn(AddressActions, 'getStateList');
            resetCountryAndStateInfoStub = spyOn(component, 'resetCountryAndStateInfo');
        });

        it('should call getStateList if country is US', () => {
            e = {
                target: {
                    value: COUNTRIES.US
                }
            };
            component.handleCountrySelect(e);
            expect(getStateListStub).toHaveBeenCalledTimes(1);
            states = ['usState1', 'usState2', 'usState3'];
            getStateListStub.calls.argsFor(0)[1](states);
            expect(resetCountryAndStateInfoStub).toHaveBeenCalledTimes(1);
            expect(resetCountryAndStateInfoStub).toHaveBeenCalledWith(COUNTRIES.US, states, false);
        });

        it('should call getStateList if country is CA', () => {
            e = {
                target: {
                    value: COUNTRIES.CA
                }
            };
            component.handleCountrySelect(e);
            expect(getStateListStub).toHaveBeenCalledTimes(1);
            states = ['caState1', 'caState2', 'caState3'];
            getStateListStub.calls.argsFor(0)[1](states);
            expect(resetCountryAndStateInfoStub).toHaveBeenCalledTimes(1);
            expect(resetCountryAndStateInfoStub).toHaveBeenCalledWith(COUNTRIES.CA, states, false);
        });

        it('should not call getStateList if country is not US or CA', () => {
            e = {
                target: {
                    value: 'JAPAN'
                }
            };
            component.handleCountrySelect(e);
            expect(getStateListStub).not.toHaveBeenCalled();
        });

        it('should call resetCountryAndStateInfo if country is not US or CA', () => {
            e = {
                target: {
                    value: 'JAPAN'
                }
            };
            component.handleCountrySelect(e);
            expect(resetCountryAndStateInfoStub).toHaveBeenCalled();
        });
    });

    describe('Validate Form', () => {
        let collectClientFieldErrorsStub;
        let fieldsForValidationStub;
        let validateStub;
        let clearErrorsStub;

        beforeEach(() => {
            component.state = {
                isInternational: false,
                address: {}
            };

            component.firstNameInput = {};
            component.lastNameInput = {};
            component.addressInput = {};
            component.zipCodeInput = {};
            component.cityInput = {};
            component.regionInput = {};
            component.phoneNumberInput = {};

            fieldsForValidationStub = [
                component.firstNameInput,
                component.lastNameInput,
                component.addressInput,
                component.zipCodeInput,
                component.cityInput
            ];

            collectClientFieldErrorsStub = spyOn(ErrorsUtils, 'collectClientFieldErrors').and.returnValue({ fields: [] });
            validateStub = spyOn(ErrorsUtils, 'validate');
            clearErrorsStub = spyOn(ErrorsUtils, 'clearErrors');
        });

        it('should call getErrors once and with initial fieldsForValidationArray', () => {
            component.props = {
                isPhoneFieldHidden: true
            };
            component.validateForm();
            expect(collectClientFieldErrorsStub).toHaveBeenCalledTimes(1);
            expect(collectClientFieldErrorsStub).toHaveBeenCalledWith(fieldsForValidationStub);
        });

        it('should call getErrors once and with updated fieldsForValidationArray', () => {
            fieldsForValidationStub.push(component.phoneNumberInput);
            component.validateForm();
            expect(collectClientFieldErrorsStub).toHaveBeenCalledTimes(1);
            expect(collectClientFieldErrorsStub).toHaveBeenCalledWith(fieldsForValidationStub);
        });

        it('should call getErrors once and with updated fieldsForValidationArray', () => {
            component.state = {
                isInternational: true,
                address: {}
            };
            fieldsForValidationStub.push(component.regionInput);
            fieldsForValidationStub.push(component.phoneNumberInput);
            component.validateForm();
            expect(collectClientFieldErrorsStub).toHaveBeenCalledTimes(1);
            expect(collectClientFieldErrorsStub).toHaveBeenCalledWith(fieldsForValidationStub);
        });

        it('should call ErrorsUtils.Validate once', () => {
            component.validateForm();
            expect(validateStub).toHaveBeenCalledTimes(1);
        });

        it('should call ErrorsUtils.ClearErrors once', () => {
            component.validateForm(false);
            expect(clearErrorsStub).toHaveBeenCalledTimes(1);
        });

        it('should not call ErrorsUtils.ClearErrors once', () => {
            component.validateForm(true);
            expect(clearErrorsStub).not.toHaveBeenCalled();
        });
    });

    describe('Handle Response Error', () => {
        const ErrorConstants = require('utils/ErrorConstants').default;
        let hasErrors;

        it('should handle response error for invalid city input', () => {
            hasErrors = component.handleResponseError('invalidCity', 'errorValue', ErrorConstants.ERROR_CODES.LOOKUP_CITY_INVALID);

            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                cityStateZipInvalid: 'invalidCity'
            });
            expect(hasErrors).toBeTruthy();
        });

        it('should handle response error for invalid city input', () => {
            hasErrors = component.handleResponseError('invalidState', 'errorValue', ErrorConstants.ERROR_CODES.LOOKUP_STATE_INVALID);

            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                cityStateZipInvalid: 'invalidState'
            });
            expect(hasErrors).toBeTruthy();
        });

        it('should handle response error for invalid city input', () => {
            hasErrors = component.handleResponseError('invalidPostalCode', 'errorValue', ErrorConstants.ERROR_CODES.LOOKUP_POSTAL_CODE_INVALID);

            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                cityStateZipInvalid: 'invalidPostalCode'
            });
            expect(hasErrors).toBeTruthy();
        });

        it('should handle response error for invalid city input', () => {
            hasErrors = component.handleResponseError('invalidCity', 'errorValue', ErrorConstants.ERROR_CODES.LOOKUP_CITY_INVALID);

            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith({
                cityStateZipInvalid: 'invalidCity'
            });
            expect(hasErrors).toBeTruthy();
        });

        it('should handle response error for address input', () => {
            component.addressInput = {
                showError: createSpy()
            };
            hasErrors = component.handleResponseError('errorMessage', 'errorValue', ErrorConstants.ERROR_CODES.ADDRESS1_INCORRECT);

            expect(component.addressInput.showError).toHaveBeenCalledTimes(1);
            expect(component.addressInput.showError).toHaveBeenCalledWith(
                'errorMessage',
                'errorValue',
                ErrorConstants.ERROR_CODES.ADDRESS1_INCORRECT
            );
            expect(hasErrors).toBeTruthy();
        });

        it('should handle response error for address2 input', () => {
            component.address2Input = {
                showError: createSpy()
            };
            hasErrors = component.handleResponseError('errorMessage', 'errorValue', ErrorConstants.ERROR_CODES.ADDRESS2_INCORRECT);

            expect(component.address2Input.showError).toHaveBeenCalledTimes(1);
            expect(component.address2Input.showError).toHaveBeenCalledWith(
                'errorMessage',
                'errorValue',
                ErrorConstants.ERROR_CODES.ADDRESS2_INCORRECT
            );
            expect(hasErrors).toBeTruthy();
        });

        it('should handle response error for firstname input', () => {
            component.firstNameInput = {
                showError: createSpy()
            };
            hasErrors = component.handleResponseError('errorMessage', 'errorValue', ErrorConstants.ERROR_CODES.FIRST_NAME_INCORRECT);

            expect(component.firstNameInput.showError).toHaveBeenCalledTimes(1);
            expect(component.firstNameInput.showError).toHaveBeenCalledWith(
                'errorMessage',
                'errorValue',
                ErrorConstants.ERROR_CODES.FIRST_NAME_INCORRECT
            );
            expect(hasErrors).toBeTruthy();
        });

        it('should handle response error for address input', () => {
            component.lastNameInput = {
                showError: createSpy()
            };
            hasErrors = component.handleResponseError('errorMessage', 'errorValue', ErrorConstants.ERROR_CODES.LAST_NAME_INCORRECT);

            expect(component.lastNameInput.showError).toHaveBeenCalledTimes(1);
            expect(component.lastNameInput.showError).toHaveBeenCalledWith(
                'errorMessage',
                'errorValue',
                ErrorConstants.ERROR_CODES.LAST_NAME_INCORRECT
            );
            expect(hasErrors).toBeTruthy();
        });

        it('should return false if there are no errors to handle', () => {
            hasErrors = component.handleResponseError();
            expect(hasErrors).toEqual(false);
        });
    });

    describe('getData', () => {
        let addressDataStub;

        it('should return addressData with phone property', () => {
            addressDataStub = {
                address: {
                    firstName: 'firstname',
                    lastName: 'lastname',
                    address1: 'address1',
                    address2: 'address2',
                    postalCode: 'postalCode',
                    city: 'city',
                    state: 'state',
                    country: 'country',
                    phone: '1231231234'
                },
                isPOBoxAddress: undefined,
                addressType: undefined
            };
            component.state = {
                address: addressDataStub.address,
                isAddressVerified: false
            };

            expect(component.getData()).toEqual(addressDataStub);
        });

        it('should return addressData without phone property', () => {
            addressDataStub = {
                address: {
                    firstName: 'firstname',
                    lastName: 'lastname',
                    address1: 'address1',
                    address2: 'address2',
                    postalCode: 'postalCode',
                    city: 'city',
                    state: 'state',
                    country: 'country'
                },
                isPOBoxAddress: undefined,
                addressType: undefined
            };
            component.state = {
                address: addressDataStub.address,
                isAddressVerified: false
            };
            component.props = {
                isPhoneFieldHidden: true
            };

            expect(component.getData()).toEqual(addressDataStub);
        });

        it('should return addressData with phone property and addressId', () => {
            addressDataStub = {
                address: {
                    firstName: 'firstname',
                    lastName: 'lastname',
                    address1: 'address1',
                    address2: 'address2',
                    postalCode: 'postalCode',
                    city: 'city',
                    state: 'state',
                    country: 'country',
                    phone: '1231231234'
                },
                isPOBoxAddress: undefined,
                addressType: undefined
            };
            component.state = {
                address: addressDataStub.address,
                isAddressVerified: false
            };
            component.prop = {
                isEditMode: true
            };

            expect(component.getData()).toEqual(addressDataStub);
        });
    });

    describe('setFieldFocus', () => {
        let focusStub;
        let nodeStub;
        it('should call focus method on the node element', () => {
            nodeStub = 'node';
            const ReactDOM = require('react-dom');
            focusStub = createSpy();
            spyOn(ReactDOM, 'findDOMNode').and.callFake(arg0 => {
                return arg0 === nodeStub
                    ? {
                        querySelector: () => {
                            return { focus: focusStub };
                        }
                    }
                    : null;
            });
            component.setFieldFocus(nodeStub);
            expect(focusStub).toHaveBeenCalled();
        });
    });

    describe('handleAddress1Focus', () => {
        let scrollToStub;

        beforeEach(() => {
            scrollToStub = spyOn(helperUtils, 'scrollTo');
        });

        it('should call setState with correct args', () => {
            component.handleAddress1Focus();
            expect(setStateStub).toHaveBeenCalledWith({ hasAddress1Focus: true });
        });

        it('should not call scrollTo on desktop', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(false);
            component.handleAddress1Focus();
            expect(scrollToStub).not.toHaveBeenCalled();
        });

        it('should call scrollTo on mobile', () => {
            spyOn(Sephora, 'isMobile').and.returnValue(true);
            component.addressInput = {
                setValue: () => {}
            };
            component.handleAddress1Focus();
            expect(scrollToStub).toHaveBeenCalled();
        });
    });

    describe('blurAddress1', () => {
        it('should call setState with correct args', () => {
            component.blurAddress1();
            expect(setStateStub).toHaveBeenCalledWith({
                hasAddress1Focus: false,
                loqateAddresses: []
            });
        });
    });

    describe('verifyLoqateAddressState', () => {
        const fieldsThatAffectAVS = ['address1', 'address2', 'state', 'city', 'postalCode'];
        const fieldsThatDoNotAffectAVS = ['firstName', 'lastName', 'country', 'phone', 'email'];

        it('should call setState with correct args', () => {
            fieldsThatAffectAVS.forEach(field => {
                component.verifyLoqateAddressState(field, field);
                expect(setStateStub).toHaveBeenCalledWith({
                    isAddressVerified: false,
                    isAddressModified: true
                });
            });
        });

        it('should not call setState if the field has not been modified', () => {
            // Arragnge
            const newProps = {
                ...props,
                address: {
                    ...wrapper.props().address,
                    address1: 'address1',
                    address2: 'address2',
                    state: 'state',
                    city: 'city',
                    postalCode: 'postalCode'
                }
            };

            // Act
            component = shallow(<AddressForm {...newProps} />);
            component = component.instance();

            // Assert
            fieldsThatAffectAVS.forEach(field => {
                component.verifyLoqateAddressState(field, field);
                expect(setStateStub).not.toHaveBeenCalled();
            });
        });

        it('should not call setState for certain fields', () => {
            fieldsThatDoNotAffectAVS.forEach(field => {
                component.verifyLoqateAddressState(field);
                expect(setStateStub).not.toHaveBeenCalled();
            });
        });
    });

    describe('handleAddress1Change', () => {
        let getLoqateAddressesStub;
        const countryStub = 'US';
        let fieldValueStub;

        beforeEach(() => {
            fieldValueStub = 'field value';
            getLoqateAddressesStub = spyOn(component, 'getLoqateAddresses');
            component.state = { address: { country: countryStub } };
            component.props = {
                isCheckout: true,
                isBillingAddress: false
            };
        });

        it('should call getLoqateAddresses with correct args', () => {
            component.handleAddress1Change(fieldValueStub);
            expect(getLoqateAddressesStub).toHaveBeenCalledWith(fieldValueStub);
        });

        it('should change loqateWaitingFor value', () => {
            component.handleAddress1Change(fieldValueStub);
            expect(component.loqateWaitingFor).toEqual(fieldValueStub);
        });
    });

    describe('handleAddress1KeyUp', () => {
        let event;
        let getLoqateAddressesStub;
        const countryStub = 'US';

        beforeEach(() => {
            event = {
                target: {
                    name: 'fieldName',
                    value: 'fieldValue'
                }
            };
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            getLoqateAddressesStub = spyOn(component, 'getLoqateAddresses');
            component.state = { address: { country: countryStub } };
        });

        it('should call updateEditStore with correct args', () => {
            component.handleAddress1KeyUp(event);
            expect(updateEditStoreStub).toHaveBeenCalledWith(event.target.name, event.target.value);
        });

        describe('with AVS', () => {
            beforeEach(() => {
                Sephora.configurationSettings.enableAddressValidation = true;
                component.props = {
                    isCheckout: true,
                    isBillingAddress: false
                };
            });

            it('should not call getLoqateAddresses for International', () => {
                component.state = { isInternational: true };
                component.handleAddress1KeyUp(event);
                expect(getLoqateAddressesStub).not.toHaveBeenCalled();
            });

            it('should not call getLoqateAddresses for billingAddress', () => {
                component.props.isBillingAddress = true;
                component.handleAddress1KeyUp(event);
                expect(getLoqateAddressesStub).not.toHaveBeenCalled();
            });
        });

        describe('with AVS disabled', () => {
            it('should not call getLoqateAddresses', () => {
                Sephora.configurationSettings.enableAddressValidation = false;
                component.handleAddress1KeyUp(event);
                expect(getLoqateAddressesStub).not.toHaveBeenCalled();
            });
        });
    });

    describe('handleAddress1KeyDown', () => {
        let event;
        let setHighlightedAddrIndex;
        let setHighlightedAddrIndexStub;
        let loqateAddresses;
        let preventDefaultStub;
        let handleAddress1FocusStub;

        beforeEach(() => {
            preventDefaultStub = createSpy();
            event = {
                target: {
                    name: 'fieldName',
                    value: 'fieldValue'
                },
                key: '',
                preventDefault: preventDefaultStub
            };
            loqateAddresses = ['a', 'b', 'c'];
            setHighlightedAddrIndex = component.setHighlightedAddrIndex;
            setHighlightedAddrIndexStub = spyOn(component, 'setHighlightedAddrIndex');
            handleAddress1FocusStub = spyOn(component, 'handleAddress1Focus');
            component.state = { loqateAddresses };
        });

        it('should call handleAddress1Focus if hasAddress1Focus is false', () => {
            component.state.hasAddress1Focus = false;
            component.handleAddress1KeyDown(event);
            expect(handleAddress1FocusStub).toHaveBeenCalled();
        });

        it('should call not call preventDefault', () => {
            component.handleAddress1KeyDown(event);
            expect(preventDefaultStub).not.toHaveBeenCalled();
        });

        it('should not call setHighlightedAddrIndexStub', () => {
            component.handleAddress1KeyDown(event);
            expect(setHighlightedAddrIndexStub).not.toHaveBeenCalled();
        });

        describe('on ESC pressed', () => {
            beforeEach(() => {
                event.key = keyConsts.ESC;
            });

            it('should empty address1 field', () => {
                component.handleAddress1KeyDown(event);
                expect(event.target.value).toEqual('');
            });

            it('should not call setHighlightedAddrIndexStub', () => {
                component.handleAddress1KeyDown(event);
                expect(setHighlightedAddrIndexStub).not.toHaveBeenCalled();
            });

            it('should not call handleAddress1Focus', () => {
                component.state.hasAddress1Focus = false;
                component.handleAddress1KeyDown(event);
                expect(handleAddress1FocusStub).not.toHaveBeenCalled();
            });
        });

        describe('on TAB pressed', () => {
            beforeEach(() => {
                event.key = keyConsts.TAB;
            });

            it('should not call setHighlightedAddrIndexStub', () => {
                component.handleAddress1KeyDown(event);
                expect(setHighlightedAddrIndexStub).not.toHaveBeenCalled();
            });

            it('should not call handleAddress1Focus', () => {
                component.state.hasAddress1Focus = false;
                component.handleAddress1KeyDown(event);
                expect(handleAddress1FocusStub).not.toHaveBeenCalled();
            });
        });

        describe('on UP pressed', () => {
            beforeEach(() => {
                event.key = keyConsts.UP;
            });

            it('should call preventDefault', () => {
                component.handleAddress1KeyDown(event);
                expect(preventDefaultStub).toHaveBeenCalled();
            });

            it('should decrease the highlighted index by 1', () => {
                // Arrange
                component.setHighlightedAddrIndex = setHighlightedAddrIndex;
                setHighlightedAddrIndexStub = spyOn(component, 'setHighlightedAddrIndex');
                const expectedIndex = 0;

                // Act
                component.state.highlightedAddrIndex = 1;
                component.handleAddress1KeyDown(event);

                // Assert
                expect(setHighlightedAddrIndexStub).toHaveBeenCalledWith(expectedIndex, any(Function));
            });

            it('should set the highlighted index to the last one if the index was 0', () => {
                // Arrange
                component.setHighlightedAddrIndex = setHighlightedAddrIndex;
                setHighlightedAddrIndexStub = spyOn(component, 'setHighlightedAddrIndex');
                const expectedIndex = component.state.loqateAddresses.length - 1;

                // Act
                component.state.highlightedAddrIndex = 0;
                component.handleAddress1KeyDown(event);

                // Assert
                expect(setHighlightedAddrIndexStub).toHaveBeenCalledWith(expectedIndex, any(Function));
            });
        });

        describe('on DOWN pressed', () => {
            beforeEach(() => {
                event.key = keyConsts.DOWN;
            });

            it('should call preventDefault', () => {
                component.handleAddress1KeyDown(event);
                expect(preventDefaultStub).toHaveBeenCalled();
            });

            it('should increase the highlighted index by 1', () => {
                // Arrange
                component.setHighlightedAddrIndex = setHighlightedAddrIndex;
                setHighlightedAddrIndexStub = spyOn(component, 'setHighlightedAddrIndex');
                const expectedIndex = 2;

                // Act
                component.state.highlightedAddrIndex = 1;
                component.handleAddress1KeyDown(event);

                // Assert
                expect(setHighlightedAddrIndexStub).toHaveBeenCalledWith(expectedIndex, any(Function));
            });

            it('should set the highlighted index to the first one if the index was the last one', () => {
                // Arrange
                component.setHighlightedAddrIndex = setHighlightedAddrIndex;
                setHighlightedAddrIndexStub = spyOn(component, 'setHighlightedAddrIndex');
                const expectedIndex = 0;

                // Act
                component.state.highlightedAddrIndex = 2;
                component.handleAddress1KeyDown(event);

                // Assert
                expect(setHighlightedAddrIndexStub).toHaveBeenCalledWith(expectedIndex, any(Function));
            });
        });

        describe('on ENTER pressed', () => {
            let handleLoqateAddressClickStub;

            beforeEach(() => {
                event.key = keyConsts.ENTER;
                handleLoqateAddressClickStub = spyOn(component, 'handleLoqateAddressClick');
            });

            it('should call handleLoqateAddressClick', () => {
                component.state.highlightedAddrIndex = 1;
                component.handleAddress1KeyDown(event);
                expect(handleLoqateAddressClickStub).toHaveBeenCalledWith(loqateAddresses[1]);
            });

            it('should call preventDefault', () => {
                component.state.highlightedAddrIndex = 1;
                component.handleAddress1KeyDown(event);
                expect(preventDefaultStub).toHaveBeenCalled();
            });

            it('should not call handleLoqateAddressClick if address do not exist', () => {
                component.state.loqateAddresses = [];
                component.handleAddress1KeyDown(event);
                expect(handleLoqateAddressClickStub).not.toHaveBeenCalled();
            });

            it('should not call handleAddress1Focus', () => {
                component.state.hasAddress1Focus = false;
                component.handleAddress1KeyDown(event);
                expect(handleAddress1FocusStub).not.toHaveBeenCalled();
            });
        });
    });

    describe('handleLoqateAddressClick', () => {
        let getLoqateAddressesStub;
        let verifyLoqateAddressStub;
        let addressValueStub;
        let loqateAddressObjStub;
        let idStub;
        let processStub;

        beforeEach(() => {
            addressValueStub = '525 Market St';
            idStub = 'id';
            loqateAddressObjStub = {
                Text: addressValueStub,
                Id: idStub,
                Type: 'Address'
            };
            getLoqateAddressesStub = spyOn(component, 'getLoqateAddresses');
            verifyLoqateAddressStub = spyOn(component, 'verifyLoqateAddress');
            processStub = spyOn(processEvent, 'process');
        });

        it('should call verifyLoqateAddressStub with correct args', () => {
            component.handleLoqateAddressClick(loqateAddressObjStub);
            expect(verifyLoqateAddressStub).toHaveBeenCalledWith(idStub);
        });

        it('should call processStub with correct args', () => {
            const data = {
                data: {
                    linkName: 'D=c55',
                    actionInfo: 'address verification:use recommended address:drop-down',
                    eventStrings: ['event71', 'event230']
                }
            };

            component.handleLoqateAddressClick(loqateAddressObjStub);
            expect(processStub).toHaveBeenCalledWith('linkTrackingEvent', data);
        });

        describe('when the Loqate object Type is not address', () => {
            let setFieldFocusStub;
            let setHighlightTextsStub;

            beforeEach(() => {
                loqateAddressObjStub.Type = 'Building';
                setFieldFocusStub = spyOn(component, 'setFieldFocus');
                setHighlightTextsStub = spyOn(component, 'setHighlightTexts');
            });

            it('should call getLoqateAddressesStub with correct args when type is not address', () => {
                component.handleLoqateAddressClick(loqateAddressObjStub);
                expect(getLoqateAddressesStub).toHaveBeenCalledWith(addressValueStub, idStub);
            });

            it('should call setAddress1FocusStub', () => {
                component.handleLoqateAddressClick(loqateAddressObjStub);
                expect(setFieldFocusStub).toHaveBeenCalled();
            });
        });
    });

    describe('getLoqateAddresses', () => {
        let findAddressesStub;
        let LoqateApi;
        let fakePromise;
        let loqateResults;
        let addressValueStub;
        let containerStub;
        let countryStub;

        beforeEach(() => {
            containerStub = 'container';
            countryStub = 'US';
            addressValueStub = '525 Market St';
            loqateResults = { Items: ['a', 'b', 'c'] };
            fakePromise = {
                then: resolve => {
                    resolve(loqateResults);

                    return fakePromise;
                },
                catch: () => {
                    return () => {};
                }
            };
            LoqateApi = require('services/api/thirdparty/Loqate').default;
            findAddressesStub = spyOn(LoqateApi, 'findAddresses');
            findAddressesStub.and.returnValue(fakePromise);
            component.state.address.country = countryStub;
        });

        it('should call Loqate.findAddresses API with correct args', () => {
            component.getLoqateAddresses(addressValueStub, containerStub);
            expect(findAddressesStub).toHaveBeenCalledWith(addressValueStub, countryStub, containerStub);
        });

        it('should return early if the promise term is old', () => {
            spyOn(component, 'loqateWaitingFor').and.returnValue('525 market');
            component.getLoqateAddresses(addressValueStub, '');
            expect(setStateStub).not.toHaveBeenCalled();
        });

        it('should call setState with correct args when there are results', () => {
            component.getLoqateAddresses(addressValueStub, containerStub);
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    loqateAddresses: loqateResults.Items
                },
                any(Function)
            );
        });

        it('should call setState with correct args when there are no results', () => {
            loqateResults = { Items: [] };
            fakePromise = {
                then: resolve => {
                    resolve(loqateResults);

                    return fakePromise;
                },
                catch: () => {
                    return () => {};
                }
            };
            findAddressesStub.and.returnValue(fakePromise);
            component.getLoqateAddresses(addressValueStub, containerStub);
            expect(setStateStub).toHaveBeenCalledWith({ loqateAddresses: [] });
        });
    });

    describe('verifyLoqateAddress', () => {
        let LoqateApi;
        let retrieveAddressStub;
        let fakePromise;
        let loqateResult;
        let idStub;

        beforeEach(() => {
            idStub = 'id';
            loqateResult = {
                Items: [
                    {
                        BuildingNumber: '525',
                        Street: 'Market St',
                        SubBuilding: 'Floor 32',
                        Line1: '525 Market St Floor 32',
                        City: 'city',
                        PostalCode: 'postal code',
                        Province: 'state',
                        Language: 'ENG',
                        Type: 'Residential',
                        POBoxNumber: '500'
                    }
                ]
            };
            fakePromise = {
                then: resolve => {
                    resolve(loqateResult);

                    return fakePromise;
                },
                catch: () => {
                    return () => {};
                }
            };
            LoqateApi = require('services/api/thirdparty/Loqate').default;
            retrieveAddressStub = spyOn(LoqateApi, 'retrieveAddress');
            retrieveAddressStub.and.returnValue(fakePromise);
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            component.verifyLoqateAddress(idStub);
        });

        it('should call Loqate.findAddresses API with correct args', () => {
            expect(retrieveAddressStub).toHaveBeenCalledWith(idStub);
        });

        it('should call setState with correct args', () => {
            expect(setStateStub).toHaveBeenCalledWith({
                displayCityStateInputs: true,
                isAddressVerified: true,
                zipCodeInvalid: false,
                cityStateZipInvalid: false
            });
        });

        it('should call updateEditStore with correct args for each field', () => {
            const { BuildingNumber, Street, SubBuilding, City, PostalCode, Province, POBoxNumber, Type } = loqateResult.Items[0];
            const fields = {
                address1: `${BuildingNumber} ${Street}`,
                address2: SubBuilding,
                city: City,
                postalCode: PostalCode,
                state: Province,
                isPOBoxAddress: !!POBoxNumber,
                addressType: Type
            };
            const allFields = Object.keys(fields);
            allFields.forEach(field => {
                expect(updateEditStoreStub).toHaveBeenCalledWith(field, fields[field]);
            });
        });

        it('should display address2 when the result address has a Line2', () => {
            expect(setStateStub).toHaveBeenCalledWith({ showAddress2Input: true });
        });
    });

    describe('highlightAVSTerm', () => {
        it('should return a string with highlighted term', () => {
            const string = 'Only this should be highlighted';
            const expectedString = 'Only <b>this</b> should be highlighted';
            const actualString = component.highlightAVSSearchTerm(string, '5-9');
            expect(actualString).toEqual(expectedString);
        });

        it('should return a string with several highlighted terms', () => {
            const string = 'This and this should be highlighted';
            const expectedString = '<b>This</b> and <b>this</b> should be highlighted';
            const actualString = component.highlightAVSSearchTerm(string, '0-4,9-13');
            expect(actualString).toEqual(expectedString);
        });
    });

    describe('highlightAVSUnits', () => {
        it('should return a string with correct highlighted units', () => {
            const string = '123 Address - 100 Addresses';
            const expectedString = '123 Address - <b>100 Addresses</b>';
            const actualString = component.highlightAVSUnits(string);
            expect(actualString).toEqual(expectedString);
        });
    });

    describe('setHighlightedAddrIndex', () => {
        it('should call setState with correct args', () => {
            component.setHighlightedAddrIndex(5);
            expect(setStateStub).toHaveBeenCalledWith({ highlightedAddrIndex: 5 }, any(Function));
        });

        it('should call the callback if it exists', () => {
            const callbackStub = createSpy();
            component.setHighlightedAddrIndex(5, callbackStub);
            setStateStub.calls.argsFor(0)[1]();
            expect(callbackStub).toHaveBeenCalled();
        });
    });

    describe('handleAddress2SectionClick', () => {
        it('should call setState with correct args', () => {
            component.handleAddress2SectionClick();
            expect(setStateStub).toHaveBeenCalledWith({ showAddress2Input: true }, any(Function));
        });

        it('should call setFocusField', () => {
            const setFieldFocusStub = spyOn(component, 'setFieldFocus');
            component.handleAddress2SectionClick();
            setStateStub.calls.argsFor(0)[1]();
            expect(setFieldFocusStub).toHaveBeenCalled();
        });
    });

    describe('hasAVS', () => {
        beforeEach(() => {
            // Arragnge
            Sephora.configurationSettings.enableAddressValidation = true;
            const newProps = {
                ...props,
                isBillingAddress: false
            };

            // Act
            wrapper = shallow(<AddressForm {...newProps} />);
            wrapper.setState({ isInternational: false });
            wrapper.setProps({ isBillingAddress: false });
            component = wrapper.instance();
        });

        it('should return true if flag is enabled and it is not international/billing address', () => {
            expect(component.hasAVS()).toEqual(true);
        });

        it('should return false if flag is disabled', () => {
            Sephora.configurationSettings.enableAddressValidation = false;
            expect(component.hasAVS()).toEqual(false);
        });

        it('should return false if it is international', () => {
            component.state.isInternational = true;
            expect(component.hasAVS()).toEqual(false);
        });

        it('should return false if it is billing address', () => {
            wrapper.setProps({ isBillingAddress: true });
            component = wrapper.instance();
            expect(component.hasAVS()).toEqual(false);
        });

        it('should return false if the prop hasAVS is false', () => {
            wrapper.setProps({ hasAVS: false });
            component = wrapper.instance();
            expect(component.hasAVS()).toEqual(false);
        });
    });
});
