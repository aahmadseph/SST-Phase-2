/* eslint-disable no-unused-vars */
const React = require('react');
const { objectContaining } = jasmine;
const { mount } = require('enzyme');

describe('PromotionalEmailsPrefs component', () => {
    let prefs;
    let profileApi;
    let component;
    let PromotionalEmailsPrefs;
    let props;

    beforeEach(() => {
        profileApi = require('services/api/profile').default;
        props = { onExpand: () => {} };
        PromotionalEmailsPrefs = require('components/RichProfile/MyAccount/MailingPrefs/PromotionalEmailsPrefs/PromotionalEmailsPrefs').default;
        prefs = {
            subscribed: true,
            frequency: 'DAILY',
            country: 'US',
            zipPostalCode: '90210'
        };
        const wrapper = mount(<PromotionalEmailsPrefs {...props} />);
        component = wrapper.instance();
    });

    describe('switchToEditMode', () => {
        it('should change edit mode to true', () => {
            component.switchToEditMode();
            expect(component.state.editMode).toEqual(true);
        });
    });

    describe('switchToViewMode', () => {
        beforeEach(() => {
            component.switchToViewMode();
        });

        it('should set edit mode to false', () => {
            expect(component.state.editMode).toEqual(false);
        });

        it('should reset editedPrefs to null', () => {
            expect(component.state.editedPrefs).toEqual(null);
        });
    });

    describe('handleCountryChange', () => {
        it('should change the country and reset the zipcode', () => {
            component.handleCountryChange({ currentTarget: { value: 'US' } });

            expect(component.state.editedPrefs).toEqual({
                country: 'US',
                zipPostalCode: ''
            });
        });
    });

    describe('handleStatusChange', () => {
        it('should subscribe the user and show the text input to add zip code', () => {
            component.state = { editedPrefs: { country: 'US' } };
            component.handleStatusChange({ currentTarget: { value: '1' } });

            expect(component.state).toEqual(
                objectContaining({
                    editedPrefs: {
                        country: 'US',
                        subscribed: true
                    },
                    shouldShowZipPostalCodeInput: true
                })
            );
        });
    });

    describe('switchToEditMode', () => {
        it('should change edit mode to true', () => {
            component.switchToEditMode();
            expect(component.state.editMode).toEqual(true);
        });
    });

    describe('handleSeeSampleEmailClick', () => {
        it('should change showSampleEmail to true', () => {
            component.handleSeeSampleEmailClick();
            expect(component.state.showSampleEmail).toEqual(true);
        });
    });

    describe('handleSeeSampleEmailDismiss', () => {
        it('should change showSampleEmail to false', () => {
            component.handleSeeSampleEmailDismiss();
            expect(component.state.showSampleEmail).toEqual(false);
        });
    });

    describe('handleUpdateClick', () => {
        it('should remove all editedPrefs', () => {
            const saveStub = spyOn(component, 'save');
            spyOn(component, 'validateForm').and.returnValue(true);
            component.handleUpdateClick();
            expect(saveStub).toHaveBeenCalled();
        });
    });

    describe('handleCancelClick', () => {
        it('should remove all editedPrefs', () => {
            component.handleCancelClick();
            expect(component.state.editedPrefs).toBeNull();
        });
    });
});
