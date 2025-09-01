const { createSpy } = jasmine;

describe('SocialRegistrationModal', () => {
    let React;
    let shallow;
    let wrapper;
    let store;
    let dispatchStub;
    let SocialRegistrationModal;
    let component;
    let processEvent;
    let processStub;
    let anaConsts;
    let userActions;
    let getUserFull;
    let profileActions;
    let showSocialRegistrationModal;
    let socialInfoActions;
    let setLithiumSuccessStatus;
    let Storage;
    let anaUtils;
    let fireEventForTagManagerStub;
    let EditDataActions;

    beforeEach(() => {
        React = require('react');
        store = require('store/Store').default;
        dispatchStub = spyOn(store, 'dispatch');
        SocialRegistrationModal = require('components/GlobalModals/SocialRegistrationModal/SocialRegistrationModal').default;
        shallow = enzyme.shallow;
        wrapper = shallow(<SocialRegistrationModal />);
        component = wrapper.instance();
        processEvent = require('analytics/processEvent').default;
        processStub = spyOn(processEvent, 'process');
        anaConsts = require('analytics/constants').default;
        userActions = require('actions/UserActions').default;
        getUserFull = spyOn(userActions, 'getUserFull');
        profileActions = require('actions/ProfileActions').default;
        showSocialRegistrationModal = spyOn(profileActions, 'showSocialRegistrationModal');
        socialInfoActions = require('actions/SocialInfoActions').default;
        setLithiumSuccessStatus = spyOn(socialInfoActions, 'setLithiumSuccessStatus');
        Storage = require('utils/localStorage/Storage').default;
        anaUtils = require('analytics/utils').default;
        EditDataActions = require('actions/EditDataActions').default;
    });

    describe('openTermsAndConditions method', () => {
        let isOpen;
        let title;

        beforeEach(() => {
            isOpen = true;
            title = 'Terms & Conditions';
        });

        it('should call dispatch with correct object values when param is true', () => {
            component.openTermsAndConditions(true);
            expect(dispatchStub).toHaveBeenCalledWith({
                type: 'SHOW_TERMS_CONDITIONS_MODAL',
                isOpen,
                mediaId: 28100020,
                title
            });
        });

        it('should call dispatch with correct object values without param', () => {
            component.openTermsAndConditions();
            expect(dispatchStub).toHaveBeenCalledWith({
                type: 'SHOW_TERMS_CONDITIONS_MODAL',
                isOpen,
                mediaId: 43900056,
                title
            });
        });
    });

    describe('registrationSuccess method', () => {
        let pageDetail;
        let eventStrings;
        beforeEach(() => {
            spyOn(Storage.local, 'getItem').and.returnValue({
                subtotal: '0',
                itemCount: 0
            });
            pageDetail = 'nickname';
            eventStrings = [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_244];
            component.registrationSuccess();
        });

        it('should call dispatch', () => {
            expect(dispatchStub).toHaveBeenCalled();
        });

        it('should call processEvent.process with the correct params the 1st time', () => {
            expect(processStub.calls.argsFor(0)).toEqual(['communityProfileCreationSuccess']);
        });

        it('should call processEvent.process with the correct params the 2nd time', () => {
            expect(processStub.calls.argsFor(1)).toEqual([
                anaConsts.LINK_TRACKING_EVENT,
                {
                    data: {
                        linkName: 'social registration:' + pageDetail + ':success',
                        actionInfo: 'social registration:' + pageDetail + ':success',
                        eventStrings: eventStrings
                    }
                }
            ]);
        });

        it('should call processEvent.process with the correct params the 3rd time', () => {
            expect(processStub.calls.argsFor(2)).toEqual(['communityProfileCreationWithData']);
        });
    });

    describe('close method', () => {
        it('should call dispatch with getUserFull() param when isUserBi is true', () => {
            component.state = { isUserBI: true };
            component.close();
            expect(dispatchStub).toHaveBeenCalledWith(getUserFull());
        });

        it('should call dispatch with showSocialRegistrationModal() param', () => {
            component.close();
            expect(dispatchStub).toHaveBeenCalledWith(showSocialRegistrationModal());
        });

        it('should call dispatch with setLithiumSuccessStatus() param', () => {
            component.close();
            expect(dispatchStub).toHaveBeenCalledWith(setLithiumSuccessStatus());
        });
    });

    describe('handleJoinClick method', () => {
        beforeEach(() => {
            component.birthdayForm = {
                validateForm: createSpy(),
                getBirthday: createSpy().and.returnValue({
                    birthMonth: 'someMonth',
                    birthDay: 'someDay',
                    birthYear: 'someYear'
                })
            };
            component.nicknameInput = { getValue: createSpy() };
            fireEventForTagManagerStub = spyOn(anaUtils, 'fireEventForTagManager');
            component.handleJoinClick();
        });

        it('should call fireEventForTagManager method', () => {
            expect(fireEventForTagManagerStub).toHaveBeenCalledTimes(1);
        });

        it('should call fireEventForTagManager method with the correct params', () => {
            expect(fireEventForTagManagerStub).toHaveBeenCalledWith('joinCommunityButtonClick');
        });
    });

    describe('Nickname text input', () => {
        let nicknameText;

        beforeEach(() => {
            // Assuming 'wrapper' is your shallow rendered component
            nicknameText = wrapper.findWhere(node => node.props().name === 'nickname');
        });

        it('should have the right translated label for the placeholder', () => {
            // Assert directly on the props of the found component
            expect(nicknameText.props().label).toBe('Create Nickname');
        });
    });

    describe('getRegistrationSource method', () => {
        describe('when Location.isMyProfilePage() is true', () => {
            let Location;

            beforeEach(() => {
                Location = require('utils/Location').default;
                spyOn(Location, 'isMyProfilePage').and.returnValue(true);
            });

            it('should return profile', () => {
                expect(component.getRegistrationSource()).toBe('profile');
            });
        });

        describe('when Location.isMyProfilePage() is not true', () => {
            const Community = require('utils/Community').default;
            const sources = Object.values(Community.PROVIDER_TYPES);

            sources.forEach(source => {
                switch (source) {
                    case Community.PROVIDER_TYPES.bv:
                        it('should return reviews', () => {
                            expect(component.getRegistrationSource(source)).toBe('reviews');
                        });

                        break;
                    case Community.PROVIDER_TYPES.lithium:
                        it('should return groups', () => {
                            expect(component.getRegistrationSource(source)).toBe('groups');
                        });

                        break;
                    default:
                }
            });
        });
    });

    describe('Component will unmount', () => {
        let clearEditDataStub;

        beforeEach(() => {
            clearEditDataStub = spyOn(EditDataActions, 'clearEditData');
            component = wrapper.instance();
            component.componentWillUnmount();
        });

        it('should call dispatch', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should dispatch editDataActions.clearEditData', () => {
            expect(clearEditDataStub).toHaveBeenCalledTimes(1);
        });
    });
});
