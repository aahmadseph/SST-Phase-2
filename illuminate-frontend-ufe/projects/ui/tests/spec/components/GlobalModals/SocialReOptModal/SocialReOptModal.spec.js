/* eslint-disable object-curly-newline */
const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');
const store = require('Store').default;
const ProfileActions = require('actions/ProfileActions').default;
const userActions = require('actions/UserActions').default;
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;
const localeUtils = require('utils/LanguageLocale').default;
const termsAndConditionsActions = require('actions/TermsAndConditionsActions').default;
const SocialReOptModal = require('components/GlobalModals/SocialReOptModal/SocialReOptModal').default;

describe('SocialReOptModal component', () => {
    let component;
    let props;

    describe('close modal', () => {
        let showSocialReOptModalStub;
        let dispatchStub;

        beforeEach(() => {
            dispatchStub = spyOn(store, 'dispatch');
            showSocialReOptModalStub = spyOn(ProfileActions, 'showSocialReOptModal').and.returnValue('showSocialReOptModal');
            props = { cancellationCallback: createSpy('cancellationCallback') };
            component = shallow(<SocialReOptModal {...props} />).instance();
        });

        it('should dispatch showSocialReOptModal false', () => {
            component.close();
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(dispatchStub).toHaveBeenCalledWith('showSocialReOptModal');
            expect(showSocialReOptModalStub).toHaveBeenCalledWith(false);
        });

        it('should launch social action', () => {
            component.close();
            expect(props.cancellationCallback).toHaveBeenCalledTimes(1);
        });
    });

    describe('handle join now click', () => {
        let updateUserFragmentStub;
        let handleClickSuccessCallbackStub;
        let dispatchStub;
        let setStateStub;
        let isCanadaStub;

        beforeEach(() => {
            updateUserFragmentStub = spyOn(userActions, 'updateUserFragment').and.returnValue('updateUserFragment');
            isCanadaStub = spyOn(localeUtils, 'isCanada');
            component = shallow(<SocialReOptModal />).instance();
            handleClickSuccessCallbackStub = spyOn(component, 'handleClickSuccessCallback');
            setStateStub = spyOn(component, 'setState');
            dispatchStub = spyOn(store, 'dispatch');
        });

        it(`should dispatch update user fragment with fragementForUpdate=Social
            and isAcceptCommunity=true and callback`, () => {
            isCanadaStub.and.returnValue(false);
            component.handleClick();
            const dataStub = {
                fragmentForUpdate: 'SOCIAL',
                isAcceptCommunity: true
            };
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(dispatchStub).toHaveBeenCalledWith('updateUserFragment');
            expect(updateUserFragmentStub).toHaveBeenCalledWith(dataStub, handleClickSuccessCallbackStub);
        });

        it('should dispatch update user fragment if locale is CA and terms are accepted', () => {
            isCanadaStub.and.returnValue(true);
            component.state = {
                hasAcceptedTerms: true
            };
            component.handleClick();
            const dataStub = {
                fragmentForUpdate: 'SOCIAL',
                isAcceptCommunity: true
            };
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(dispatchStub).toHaveBeenCalledWith('updateUserFragment');
            expect(updateUserFragmentStub).toHaveBeenCalledWith(dataStub, handleClickSuccessCallbackStub);
        });

        it('should set state to display error message for CA', () => {
            isCanadaStub.and.returnValue(true);
            component.handleClick();
            expect(setStateStub).toHaveBeenCalledWith({
                displayErrorMessage: true
            });
        });
    });

    describe('handle click success callback', () => {
        let showSocialReOptModalStub;
        let dispatchStub;
        let getStateStub;
        let subscribeStub;
        let getUserFullStub;
        let processStub;

        beforeEach(() => {
            dispatchStub = spyOn(store, 'dispatch');
            getStateStub = spyOn(store, 'getState');
            subscribeStub = spyOn(store, 'subscribe');
            showSocialReOptModalStub = spyOn(ProfileActions, 'showSocialReOptModal').and.returnValue('showSocialReOptModal');
            getUserFullStub = spyOn(userActions, 'getUserFull').and.returnValue('getUserFull');
            processStub = spyOn(processEvent, 'process');

            props = { socialReOptCallback: createSpy('socialReOptCallback') };
            const wrapper = shallow(<SocialReOptModal {...props} />);
            component = wrapper.instance();
            component.handleClickSuccessCallback();
        });

        it('should close SocialReOptModal', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(2);
            expect(dispatchStub).toHaveBeenCalledWith('showSocialReOptModal');
            expect(showSocialReOptModalStub).toHaveBeenCalledWith(false);
        });

        it('should refresh the user data', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(2);
            expect(dispatchStub).toHaveBeenCalledWith('getUserFull');
            expect(getUserFullStub).toHaveBeenCalledTimes(1);
        });

        it('should call subscribe and socialReOptCallback', () => {
            // Arrange/Act
            shallow(<SocialReOptModal {...props} />)
                .instance()
                .handleClickSuccessCallback();

            // Assert
            expect(subscribeStub).toHaveBeenCalledTimes(2);
            expect(subscribeStub).toHaveBeenCalledWith(any(Function), component);
            getStateStub.and.returnValue({
                user: {
                    isSocialEnabled: true
                }
            });
            subscribeStub.calls.first().args[0]();
            expect(props.socialReOptCallback).toHaveBeenCalledTimes(1);
        });

        it('should process analytics correctly', () => {
            expect(processStub).toHaveBeenCalledTimes(1);
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    linkName: 'social registration:re-opt in:success',
                    actionInfo: 'social registration:re-opt in:success',
                    eventStrings: [anaConsts.Event.EVENT_71],
                    previousPage: 'social registration:re-opt in:n/a:*'
                }
            });
        });
    });

    describe('handle AcceptCommunity click', () => {
        let event;
        let setStateStub;

        beforeEach(() => {
            event = {
                target: { checked: true }
            };
            const wrapper = shallow(<SocialReOptModal />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            component.handleAcceptCommunityClick(event);
        });

        it('should set hasAcceptedTerms to true and displayErrorMessage to false', () => {
            expect(setStateStub).toHaveBeenCalledWith({
                hasAcceptedTerms: true,
                displayErrorMessage: false
            });
        });
    });

    it('open terms and conditions modal should dispatch terms and conditions modal', () => {
        // Arrange
        const dispatchStub = spyOn(store, 'dispatch');
        const showModalStub = spyOn(termsAndConditionsActions, 'showModal').and.returnValue('showModal');
        const mediaIdStub = 11300018;
        const titleStub = 'Terms & Conditions';

        // Act
        shallow(<SocialReOptModal globalModals={{}} />)
            .instance()
            .openTermsAndConditions();

        // Assert
        expect(dispatchStub).toHaveBeenCalledTimes(1);
        expect(dispatchStub).toHaveBeenCalledWith('showModal');
        expect(showModalStub).toHaveBeenCalledWith(true, mediaIdStub, titleStub);
    });
});
