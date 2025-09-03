const React = require('react');
const { shallow } = require('enzyme');

describe('EditMyProfile component', () => {
    let store;
    let EditMyProfile;
    let userUtils;
    let authentication;
    let profileActions;
    let actions;
    let component;
    let dispatchSpy;

    const mockedBiData = {
        personalizedInformation: {
            eyeColor: [
                {
                    displayName: 'Hazel',
                    isSelected: true,
                    value: 'hazel'
                }
            ],
            gender: [
                {
                    displayName: 'Female',
                    isSelected: true,
                    value: 'female'
                }
            ],
            hairColor: [
                {
                    displayName: 'Blonde',
                    isSelected: true,
                    value: 'blonde'
                }
            ],
            hairConcerns: [],
            hairDescrible: [],
            skinConcerns: [],
            skinTone: [
                {
                    displayName: 'Light',
                    imageUrl: '/images/skintone/light.jpg',
                    isSelected: true,
                    value: 'light'
                }
            ],
            skinType: [
                {
                    displayName: 'Combination',
                    isSelected: true,
                    value: 'comboSk'
                }
            ]
        }
    };
    const componentProps = {
        biAccount: mockedBiData,
        isLithiumSuccessful: true,
        linksList: ['One', 'Two', 'Three'],
        socialProfile: {
            aboutMe: 'Hello World',
            id: '0'
        }
    };

    const event = {
        type: 'click',
        preventDefault: function () {}
    };

    beforeEach(() => {
        store = require('store/Store').default;
        EditMyProfile = require('components/RichProfile/EditMyProfile/EditMyProfile/EditMyProfile').default;
        userUtils = require('utils/User').default;
        authentication = require('utils/Authentication').default;
        profileActions = require('actions/ProfileActions').default;
        actions = require('Actions').default;
        const wrapper = shallow(<EditMyProfile {...componentProps} />);
        component = wrapper.instance();
        dispatchSpy = spyOn(store, 'dispatch');
    });

    describe('clickHandler', () => {
        describe('requires user sign in', () => {
            it('should dispatch community registration if there is no social profile', done => {
                const updatedProps = Object.assign({}, componentProps, { socialProfile: null });
                const showSocialRegistrationModalSpy = spyOn(profileActions, 'showSocialRegistrationModal');
                const fakePromise = {
                    then: function (resolve) {
                        resolve();
                        expect(dispatchSpy).toHaveBeenCalled();
                        expect(showSocialRegistrationModalSpy).toHaveBeenCalled();
                        done();

                        return fakePromise;
                    },
                    catch: function () {}
                };

                spyOn(authentication, 'requireLoggedInAuthentication').and.returnValue(fakePromise);
                const wrapper = shallow(<EditMyProfile {...updatedProps} />);
                component = wrapper.instance();
                component.clickHandler(event, 0);
            });

            it('should dispatch community opt in if does not have social profile', done => {
                const showSocialReOptModalSpy = spyOn(profileActions, 'showSocialReOptModal');
                const fakePromise = {
                    then: function (resolve) {
                        resolve();
                        expect(dispatchSpy).toHaveBeenCalled();
                        expect(showSocialReOptModalSpy).toHaveBeenCalled();
                        done();

                        return fakePromise;
                    },
                    catch: function () {}
                };

                spyOn(userUtils, 'needsSocialReOpt').and.returnValue(true);
                spyOn(authentication, 'requireLoggedInAuthentication').and.returnValue(fakePromise);
                const wrapper = shallow(<EditMyProfile {...componentProps} />);
                component = wrapper.instance();
                component.clickHandler(event, 0);
            });

            it('should dispatch BI registration if does not have social profile', done => {
                const showBiRegisterModalSpy = spyOn(actions, 'showBiRegisterModal');

                const fakePromise = {
                    then: function (resolve) {
                        resolve();
                        expect(dispatchSpy).toHaveBeenCalled();
                        expect(showBiRegisterModalSpy).toHaveBeenCalled();
                        done();

                        return fakePromise;
                    },
                    catch: function () {}
                };

                spyOn(userUtils, 'isBI').and.returnValue(false);
                spyOn(authentication, 'requireLoggedInAuthentication').and.returnValue(fakePromise);
                const wrapper = shallow(<EditMyProfile {...componentProps} />);
                component = wrapper.instance();
                component.clickHandler(event, 1);
            });
        });

        describe('when user is already signed in', () => {
            it('should dispatch showEditFlowModal', () => {
                const showEditFlowModalSpy = spyOn(profileActions, 'showEditFlowModal');

                spyOn(userUtils, 'isBI').and.returnValue(true);
                const wrapper = shallow(<EditMyProfile {...componentProps} />);
                component = wrapper.instance();
                component.clickHandler(event, 2);
                expect(dispatchSpy).toHaveBeenCalled();
                expect(showEditFlowModalSpy).toHaveBeenCalled();
            });
        });
    });
});
