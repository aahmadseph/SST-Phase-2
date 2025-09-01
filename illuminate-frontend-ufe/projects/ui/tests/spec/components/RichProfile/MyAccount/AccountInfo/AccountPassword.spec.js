const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const React = require('react');

describe('AccountPassword component', () => {
    let store;
    let updateUserFragmentSpy;
    let component;
    let AccountPassword;
    let event;
    let preventDefaultStub;
    let setStateSpy;
    let dispatchSpy;
    let optionParams;
    let commonProps;
    let userActions;
    let triggerErrorTrackingSpy;

    beforeEach(() => {
        store = require('Store').default;
        AccountPassword = require('components/RichProfile/MyAccount/AccountInfo/AccountPassword/AccountPassword').default;
        userActions = require('actions/UserActions').default;

        dispatchSpy = spyOn(store, 'dispatch');
        const FRAGMENT_FOR_UPDATE = userActions.FRAGMENT_FOR_UPDATE;
        optionParams = {
            fragmentForUpdate: FRAGMENT_FOR_UPDATE.PASSWORD,
            password: '123456',
            confirmPassword: '123456'
        };
        commonProps = {
            user: {},
            isEditMode: false,
            setEditSection: () => {}
        };
        preventDefaultStub = createSpy();
        event = { preventDefault: preventDefaultStub };
    });

    describe('submit password edit form', () => {
        beforeEach(() => {
            updateUserFragmentSpy = spyOn(userActions, 'updateUserFragment');
            const wrapper = shallow(<AccountPassword {...commonProps} />);
            component = wrapper.instance();
            spyOn(component, 'getOptionParams').and.returnValue(optionParams);
            spyOn(component, 'validateForm').and.returnValue({ hasError: false });
            component.submitForm(event);
        });

        it('should dispatch action to submit edit password data', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
        });

        it('should update user password', () => {
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
            const wrapper = shallow(<AccountPassword {...commonProps} />);
            component = wrapper.instance();
            triggerErrorTrackingSpy = spyOn(component, 'triggerErrorTracking');
            component.passwordInput = {
                props: { name: 'password' },
                getValue: function () {},
                validateError: function () {
                    return 'error message';
                }
            };
            component.confirmPasswordInput = {
                getValue: function () {},
                validateError: function () {}
            };
            setStateSpy = spyOn(component, 'setState');
        });

        describe('error state check', () => {
            beforeEach(() => {
                spyOn(component, 'validateForm').and.returnValue({
                    hasError: true,
                    errors: { error: 'someError' }
                });
                component.submitForm(event);
            });

            it('should expect store.dispatch to not be called if validateForm returns errors', () => {
                expect(dispatchSpy).not.toHaveBeenCalled();
            });

            it('should call triggerErrorTracking with object', () => {
                expect(triggerErrorTrackingSpy).toHaveBeenCalledWith({ error: 'someError' });
            });

            it('should call setStateSpy with and object', () => {
                expect(setStateSpy).toHaveBeenCalledWith({ errorMessages: null });
            });
        });

        it('password input should display an error', () => {
            const result = component.validateForm();
            expect(result.hasError).toBeTruthy();
        });
    });

    describe('failure callback', () => {
        beforeEach(() => {
            const wrapper = shallow(<AccountPassword {...commonProps} />);
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
            const wrapper = shallow(<AccountPassword {...commonProps} />);
            component = wrapper.instance();
            setStateSpy = spyOn(component, 'setState');
        });

        it('should switch edit form to display only', () => {
            component.editSuccess();
        });
    });

    it('should render "edit" link with "data-at" attribute', () => {
        // Arrange
        const props = {
            user: {},
            isEditMode: false
        };

        // Act
        const wrapper = shallow(<AccountPassword {...props} />);

        // Assert
        expect(wrapper.find('[data-at="myaccount_edit_button"]').exists()).toBe(true);
    });

    it('should render in edit mode "Cancel" button with "data-at" attribute', () => {
        // Arrange
        const props = {
            user: {},
            isEditMode: true
        };

        // Act
        const wrapper = shallow(<AccountPassword {...props} />);

        // Assert
        expect(wrapper.find('Button[data-at="myaccount_cancel_button"]').exists()).toBe(true);
    });

    it('should render in edit mode "Update" button with "data-at" attribute', () => {
        // Arrange
        const props = {
            user: {},
            isEditMode: true
        };

        // Act
        const wrapper = shallow(<AccountPassword {...props} />);

        // Assert
        expect(wrapper.find('Button[data-at="myaccount_update_button"]').exists()).toBe(true);
    });

    it('should LegacyGrid with "data-at" attribute', () => {
        // Arrange
        const props = {
            user: {},
            isEditMode: false
        };

        // Act
        const wrapper = shallow(<AccountPassword {...props} />);

        // Assert
        expect(wrapper.find('LegacyGrid[data-at="account_password_field"]').exists()).toBe(true);
    });
});
