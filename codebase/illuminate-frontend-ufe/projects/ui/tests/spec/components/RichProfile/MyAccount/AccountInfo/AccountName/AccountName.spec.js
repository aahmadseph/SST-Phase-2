const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const React = require('react');

describe('AccountName component', () => {
    let store;
    let updateUserFragmentSpy;
    let component;
    let AccountName;
    let event;
    let preventDefaultSpy;
    let setStateSpy;
    let dispatchSpy;
    let optionParams;
    let commonProps;
    let userActions;
    let processEvent;
    let anaConsts;
    let triggerErrorTrackingSpy;

    beforeEach(() => {
        store = require('Store').default;
        AccountName = require('components/RichProfile/MyAccount/AccountInfo/AccountName/AccountName').default;
        userActions = require('actions/UserActions').default;
        processEvent = require('analytics/processEvent').default;
        anaConsts = require('analytics/constants').default;

        dispatchSpy = spyOn(store, 'dispatch');
        const FRAGMENT_FOR_UPDATE = userActions.FRAGMENT_FOR_UPDATE;
        optionParams = {
            fragmentForUpdate: FRAGMENT_FOR_UPDATE.NAME,
            firstName: 'Seph',
            lastName: 'Ora'
        };
        commonProps = {
            user: {},
            isEditMode: false,
            setEditSection: createSpy()
        };
        preventDefaultSpy = createSpy();
        event = { preventDefault: preventDefaultSpy };
    });

    describe('submit name edit form', () => {
        beforeEach(() => {
            updateUserFragmentSpy = spyOn(userActions, 'updateUserFragment');
            const wrapper = shallow(<AccountName {...commonProps} />);
            component = wrapper.instance();
            spyOn(component, 'getOptionParams').and.returnValue(optionParams);
            spyOn(component, 'validateForm').and.returnValue({ hasError: false });
            component.submitForm(event);
        });

        it('should dispatch action to submit edit name data', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
        });

        it('should update user name', () => {
            expect(updateUserFragmentSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('invalid input pre-api submit form call', () => {
        beforeEach(() => {
            commonProps = {
                user: {},
                isEditMode: true,
                setEditSection: createSpy()
            };
            const wrapper = shallow(<AccountName {...commonProps} />);
            component = wrapper.instance();
            triggerErrorTrackingSpy = spyOn(component, 'triggerErrorTracking');
            component.firstNameInput = {
                props: { name: 'name' },
                getValue: () => {},
                validateError: () => 'error message'
            };
            component.lastNameInput = {
                getValue: () => {},
                validateError: () => {}
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
            const wrapper = shallow(<AccountName {...commonProps} />);
            component = wrapper.instance();
        });

        it('should display error message from api', () => {
            const apiResponse = { errorMessages: ['error message'] };
            component.editFailure(apiResponse);
            expect(component.state.errorMessages).toEqual(apiResponse.errorMessages);
        });
    });

    describe('success callback', () => {
        let processSpy;

        beforeEach(() => {
            processSpy = spyOn(processEvent, 'process');
            const wrapper = shallow(<AccountName {...commonProps} />);
            component = wrapper.instance();
            component.editSuccess();
        });

        it('should trigger the link tracking event with correct data', () => {
            const prop55 = 'user profile:my account:name:update';
            const data = {
                actionInfo: prop55,
                eventStrings: [anaConsts.Event.EVENT_71],
                linkName: prop55
            };
            expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data });
        });

        it('should switch edit form to display only', () => {
            expect(component.props.setEditSection).toHaveBeenCalledWith('');
        });
    });

    it('should render "edit" link with "data-at" attribute', () => {
        // Arrange
        const props = {
            user: {},
            isEditMode: false
        };

        // Act
        const wrapper = shallow(<AccountName {...props} />);

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
        const wrapper = shallow(<AccountName {...props} />);

        // Assert
        expect(wrapper.find('[data-at="myaccount_cancel_button"]').exists()).toBe(true);
    });

    it('should render in edit mode "Update" button with "data-at" attribute', () => {
        // Arrange
        const props = {
            user: {},
            isEditMode: true
        };

        // Act
        const wrapper = shallow(<AccountName {...props} />);

        // Assert
        expect(wrapper.find('[data-at="myaccount_update_button"]').exists()).toBe(true);
    });
});
