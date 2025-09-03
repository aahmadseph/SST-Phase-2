const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const React = require('react');

describe('AccountEmail component', () => {
    let store;
    let updateUserFragmentSpy;
    let component;
    let AccountEmail;
    let event;
    let preventDefaultStub;
    let setStateSpy;
    let dispatchSpy;
    let optionParams;
    let commonProps;
    let userActions;

    beforeEach(() => {
        store = require('Store').default;
        AccountEmail = require('components/RichProfile/MyAccount/AccountInfo/AccountEmail/AccountEmail').default;
        userActions = require('actions/UserActions').default;

        dispatchSpy = spyOn(store, 'dispatch');
        const FRAGMENT_FOR_UPDATE = userActions.FRAGMENT_FOR_UPDATE;
        optionParams = {
            fragmentForUpdate: FRAGMENT_FOR_UPDATE.EMAIL,
            email: 'seph@sephora.com',
            confirmEmail: 'seph@sephora.com'
        };
        commonProps = {
            user: {},
            isEditMode: false,
            setEditSection: () => {}
        };
        preventDefaultStub = createSpy();
        event = { preventDefault: preventDefaultStub };
    });

    describe('submit email edit form', () => {
        beforeEach(() => {
            updateUserFragmentSpy = spyOn(userActions, 'updateUserFragment');
            const wrapper = shallow(<AccountEmail {...commonProps} />);
            component = wrapper.instance();
            spyOn(component, 'getOptionParams').and.returnValue(optionParams);
            spyOn(component, 'validateForm').and.returnValue({ hasError: false });
            component.submitForm(event);
        });

        it('should dispatch action to submit edit email data', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
        });

        it('should update user email', () => {
            expect(updateUserFragmentSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('invalid input pre-api submit form call', () => {
        beforeEach(() => {
            commonProps = {
                user: {},
                isEditMode: true,
                setEditSection: () => {}
            };
            const wrapper = shallow(<AccountEmail {...commonProps} />);
            component = wrapper.instance();
            component.emailInput = {
                props: { name: 'email' },
                getValue: function () {},
                validateError: function () {
                    return 'error message';
                }
            };
            component.confirmEmailInput = {
                getValue: function () {},
                validateError: function () {}
            };
            setStateSpy = spyOn(component, 'setState');
        });

        it('should expect store.dispatch to not be called if validateForm returns errors', () => {
            spyOn(component, 'validateForm').and.returnValue({ hasError: true });
            component.submitForm(event);
            expect(dispatchSpy).not.toHaveBeenCalled();
            expect(setStateSpy).toHaveBeenCalledWith({ errorMessages: null });
        });

        it('email input should display an error', () => {
            const result = component.validateForm();
            expect(result.hasError).toBeTruthy();
        });
    });

    describe('failure callback', () => {
        beforeEach(() => {
            const wrapper = shallow(<AccountEmail {...commonProps} />);
            component = wrapper.instance();
        });

        it('should display error message from api', () => {
            const apiResponse = { errorMessages: ['error message'] };
            component.editFailure(apiResponse);
            expect(component.state.errorMessages).toEqual(apiResponse.errorMessages);
        });
    });

    describe('success callback', () => {
        beforeEach(() => {
            const wrapper = shallow(<AccountEmail {...commonProps} />);
            component = wrapper.instance();
            setStateSpy = spyOn(component, 'setState');
        });

        it('should switch edit form to display only', () => {
            component.editSuccess();
        });
    });

    xit('should render "edit" link with "data-at" attribute', () => {
        // Arrange
        const props = {
            user: {},
            isEditMode: false
        };

        // Act
        const wrapper = shallow(<AccountEmail {...props} />);

        // Assert
        expect(wrapper.find('Link [data-at="myaccount_edit_button"]').exists()).toBe(true);
    });

    xit('should render in edit mode "Cancel" button with "data-at" attribute', () => {
        // Arrange
        const props = {
            user: {},
            isEditMode: true
        };

        // Act
        const wrapper = shallow(<AccountEmail {...props} />);

        // Assert
        expect(wrapper.find('Button [data-at="myaccount_cancel_button"]').exists()).toBe(true);
    });

    xit('should render in edit mode "Update" button with "data-at" attribute', () => {
        // Arrange
        const props = {
            user: {},
            isEditMode: true
        };

        // Act
        const wrapper = shallow(<AccountEmail {...props} />);

        // Assert
        expect(wrapper.find('Button [data-at="myaccount_update_button"]').exists()).toBe(true);
    });
});
