/* eslint-disable object-curly-newline */
const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('AcctAddressForm component', () => {
    let AcctAddressForm;
    let AddressActions;
    let component;
    let props;
    let eventStub;
    let setStateSpy;
    let dispatchSpy;
    let store;
    let wrapper;

    beforeEach(() => {
        store = require('Store').default;
        AcctAddressForm = require('components/RichProfile/MyAccount/Addresses/AcctAddressForm/AcctAddressForm').default;
        AddressActions = require('actions/AddressActions').default;

        eventStub = { preventDefault: createSpy() };
        props = {
            isEditMode: false,
            address: {},
            addAddressCallback: createSpy(),
            updateAddressCallback: createSpy()
        };
        wrapper = shallow(<AcctAddressForm {...props} />);
        component = wrapper.instance();
        component.addressForm = {
            validateForm: createSpy().and.returnValue(true),
            getData: createSpy().and.returnValue({}),
            hasAVS: createSpy().and.returnValue(false),
            isAddressVerified: createSpy().and.returnValue(true),
            isAddressModified: createSpy().and.returnValue(true),
            handleResponseError: createSpy().and.returnValue(false)
        };
        setStateSpy = spyOn(component, 'setState');
        dispatchSpy = spyOn(store, 'dispatch');
    });

    describe('ctrlr', () => {
        it('should mark it as default when editing it and it is default', () => {
            wrapper.setProps({
                isEditMode: true,
                address: {
                    isDefault: true
                }
            });
            component.componentDidMount();
            expect(setStateSpy).toHaveBeenCalledWith({ isDefault: true });
        });
    });

    describe('showDeleteAddressModal', () => {
        let showInfoModalSpy;
        let Actions;

        beforeEach(() => {
            Actions = require('Actions').default;
            showInfoModalSpy = spyOn(Actions, 'showInfoModal');
        });

        it('should call preventDefault', () => {
            component.showDeleteAddressModal(eventStub);
            expect(eventStub.preventDefault).toHaveBeenCalled();
        });

        it('should call dispatch', () => {
            component.showDeleteAddressModal(eventStub);
            expect(dispatchSpy).toHaveBeenCalled();
        });

        it('should dispatch showInfoModal with correct args', () => {
            const title = 'Delete address';
            const message = 'Are you sure you would like to permanently delete your address?';
            const confirmButtonText = 'Yes';
            const hasCancelButton = true;
            const hasCloseButton = true;
            const cancelButtonText = 'No';
            const deleteAddressModalCallbackSpy = spyOn(component, 'deleteAddressModalCallback');
            component.showDeleteAddressModal(eventStub);
            expect(showInfoModalSpy).toHaveBeenCalledWith({
                isOpen: true,
                title: title,
                message: message,
                buttonText: confirmButtonText,
                callback: deleteAddressModalCallbackSpy,
                showCancelButton: hasCancelButton,
                cancelText: cancelButtonText,
                showCloseButton: hasCloseButton
            });
        });
    });

    describe('validateAddressForm', () => {
        let createAddressSpy;

        beforeEach(() => {
            createAddressSpy = spyOn(component, 'createAddress');
        });

        it('should call setState with correct args', () => {
            component.validateAddressForm(eventStub);
            expect(setStateSpy).toHaveBeenCalledWith({ errorMessages: '' });
        });

        it('should call createAddress when the form is valid', () => {
            component.validateAddressForm(eventStub);
            expect(createAddressSpy).toHaveBeenCalled();
        });

        it('should not call createAddress when the form is invalid', () => {
            component.addressForm.validateForm = createSpy().and.returnValue(false);
            component.validateAddressForm(eventStub);
            expect(createAddressSpy).not.toHaveBeenCalled();
        });
    });

    describe('handleResponseError', () => {
        let errorUtils;
        let collectAndValidateBackEndErrorsSpy;
        let errorDataStub;

        beforeEach(() => {
            errorDataStub = 'error data';
            errorUtils = require('utils/Errors').default;
            collectAndValidateBackEndErrorsSpy = spyOn(errorUtils, 'collectAndValidateBackEndErrors');
            component.handleResponseError(errorDataStub);
        });

        it('should call collectAndValidateBackEndErrors with correct arg', () => {
            expect(collectAndValidateBackEndErrorsSpy).toHaveBeenCalledWith(errorDataStub, component);
        });
    });

    describe('showError', () => {
        let errorStub;
        beforeEach(() => {
            errorStub = {
                message: 'error message',
                value: 'error value',
                key: 'error Key'
            };
        });
        it('should call setState with correct args if address form does not handle the error', () => {
            component.showError(errorStub.message, errorStub.value, errorStub.key);
            expect(setStateSpy).toHaveBeenCalledWith({ errorMessages: [errorStub.message] });
        });

        it('should not call setState if address form can handle the error', () => {
            component.addressForm.handleResponseError = createSpy().and.returnValue(true);
            component.showError(errorStub.message, errorStub.value, errorStub.key);
            expect(setStateSpy).not.toHaveBeenCalled();
        });
    });

    describe('create address', () => {
        let addNewAddressSpy;
        let updateAddressSpy;

        beforeEach(() => {
            updateAddressSpy = spyOn(AddressActions, 'updateAddress');
            addNewAddressSpy = spyOn(AddressActions, 'addNewAddress');
            component.state.isDefault = true;
            component.createAddress();
        });

        it('should call addAddress with correct args', () => {
            expect(addNewAddressSpy).toHaveBeenCalledWith(
                {
                    addressValidated: undefined,
                    isDefaultAddress: true
                },
                any(Function),
                any(Function)
            );
        });

        it('should call updateAddress with correct args when in edit mode', () => {
            wrapper.setProps({ isEditMode: true });
            component.createAddress();
            expect(updateAddressSpy).toHaveBeenCalledWith(
                {
                    addressValidated: undefined,
                    isDefaultAddress: true
                },
                any(Function),
                any(Function)
            );
        });

        describe('for AVS', () => {
            beforeEach(() => {
                Sephora.configurationSettings.enableAddressValidation = true;
                component.addressForm.hasAVS.and.returnValue(true);
                component.createAddress();
            });

            it('should call addAddress with correct args', () => {
                expect(addNewAddressSpy).toHaveBeenCalledWith(
                    {
                        addressValidated: true,
                        isDefaultAddress: true
                    },
                    any(Function),
                    any(Function)
                );
            });

            it('should call updateAddress with correct args when in edit mode', () => {
                wrapper.setProps({ isEditMode: true });
                component.createAddress();
                expect(updateAddressSpy).toHaveBeenCalledWith(
                    {
                        addressValidated: true,
                        isDefaultAddress: true
                    },
                    any(Function),
                    any(Function)
                );
            });
        });
    });

    xit('should render "Cancel" button with "data-at" attribute', () => {
        // Arrange/Act
        wrapper = shallow(<AcctAddressForm />);

        // Assert
        expect(wrapper.find('Button [data-at="saved_addresses_cancel_button"]').exists()).toBe(true);
    });

    xit('should render "Save" button with "data-at" attribute', () => {
        // Arrange/Act
        wrapper = shallow(<AcctAddressForm />);

        // Assert
        expect(wrapper.find('Button [data-at="saved_addresses_save_button"]').exists()).toBe(true);
    });

    xit('should render "Update" button with "data-at" attribute', () => {
        // Arrange
        const formProps = {
            isEditMode: true,
            address: {}
        };

        // Act
        wrapper = shallow(<AcctAddressForm {...formProps} />);

        // Assert
        expect(wrapper.find('Button [data-at="saved_addresses_update_button"]').exists()).toBe(true);
    });
});
