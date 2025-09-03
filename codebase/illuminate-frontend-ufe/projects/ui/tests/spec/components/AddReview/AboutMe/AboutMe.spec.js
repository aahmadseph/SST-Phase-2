/* eslint-disable object-curly-newline */
const React = require('react');
const { any, anything, createSpy } = jasmine;
const { shallow } = require('enzyme');
const userUtils = require('utils/User').default;
const store = require('Store').default;
const ProfileActions = require('actions/ProfileActions').default;
const biUtils = require('utils/BiProfile').default;
const AboutMe = require('components/AddReview/AboutMe/AboutMe').default;

describe('AboutMe component', () => {
    let wrapper;
    let component;
    let getProfileIdStub;
    let completeProfileObjectStub;
    let getAboutMeDataStub;
    let props;
    let dispatchStub;
    let updateBiAccountStub;
    let setStateStub;

    beforeEach(() => {
        getProfileIdStub = spyOn(userUtils, 'getProfileId');
        completeProfileObjectStub = spyOn(biUtils, 'completeProfileObject');
        updateBiAccountStub = spyOn(ProfileActions, 'updateBiAccount');
        dispatchStub = spyOn(store, 'dispatch');
    });

    describe('submitData method', () => {
        beforeEach(() => {
            props = {
                onSubmit: createSpy('onSubmit'),
                biAccount: {
                    personalizedInformation: {}
                }
            };
            wrapper = shallow(<AboutMe {...props} />);
            component = wrapper.instance();
            getAboutMeDataStub = spyOn(component, 'getAboutMeData');
        });

        it('should call getProfileId method', () => {
            component.submitData();
            expect(getProfileIdStub).toHaveBeenCalledTimes(1);
        });

        it('should call getAboutMeData method', () => {
            component.submitData();
            expect(getAboutMeDataStub).toHaveBeenCalledTimes(1);
        });

        it('should call completeProfileObject method', () => {
            getAboutMeDataStub.and.returnValue('somevalue');
            component.submitData();
            expect(completeProfileObjectStub).toHaveBeenCalledTimes(1);
        });

        it('should call completeProfileObject method with value', () => {
            getAboutMeDataStub.and.returnValue('somevalue');
            component.submitData();
            expect(completeProfileObjectStub).toHaveBeenCalledWith('somevalue', {});
        });

        it('should call dispatch method', () => {
            getAboutMeDataStub.and.returnValue('somevalue');
            component.submitData();
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call updateBiAccount method', () => {
            getAboutMeDataStub.and.returnValue('somevalue');
            component.submitData();
            expect(updateBiAccountStub).toHaveBeenCalledTimes(1);
        });

        it('should call updateBiAccount method with value', () => {
            // Arrange/Act
            getAboutMeDataStub.and.returnValue('somevalue');
            component.submitData();

            // Assert
            expect(updateBiAccountStub).toHaveBeenCalledWith(anything(), any(Function));
        });

        it('should call else block', () => {
            getAboutMeDataStub.and.returnValue('');
            component.submitData();
            expect(component.props.onSubmit).toHaveBeenCalledTimes(1);
        });
    });

    describe('componentWillReceiveProps', () => {
        beforeEach(() => {
            wrapper = shallow(<AboutMe />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.componentWillReceiveProps('someprops');
        });

        it('should call setState method', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });

        it('should call setState method with value', () => {
            expect(setStateStub).toHaveBeenCalledWith('someprops');
        });
    });

    describe('getAboutMeData method', () => {
        beforeEach(() => {
            wrapper = shallow(<AboutMe />);
            component = wrapper.instance();
            component.skin = {
                getData: createSpy('getData').and.returnValue({
                    biAccount: {
                        personalizedInformation: {
                            skinValue: 'someSkinValue'
                        }
                    }
                })
            };
            component.hair = {
                getData: createSpy('getData').and.returnValue({
                    biAccount: {
                        personalizedInformation: {
                            hairValue: 'someHairValue'
                        }
                    }
                })
            };
            component.eyes = {
                getData: createSpy('getData').and.returnValue({
                    biAccount: {
                        personalizedInformation: {
                            eyesValue: 'someEyesValue'
                        }
                    }
                })
            };
        });

        it('should return some value', () => {
            expect(component.getAboutMeData()).toEqual({
                skinValue: 'someSkinValue',
                hairValue: 'someHairValue',
                eyesValue: 'someEyesValue'
            });
        });
    });
});
