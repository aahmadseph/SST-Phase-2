const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('FollowList component', () => {
    let store;
    let locationUtils;
    let userUtils;
    let communityUtils;
    let lithiumApi;
    let FollowList;
    let socialInfoActions;
    let component;

    beforeEach(() => {
        store = require('Store').default;
        locationUtils = require('utils/Location').default;
        userUtils = require('utils/User').default;
        communityUtils = require('utils/Community').default;
        lithiumApi = require('services/api/thirdparty/Lithium').default;
        socialInfoActions = require('actions/SocialInfoActions').default;
        FollowList = require('components/RichProfile/UserProfile/common/FollowList/FollowList').default;
    });

    describe('ctrl', () => {
        let setAndWatchStub;
        let isRichProfilePageStub;

        beforeEach(() => {
            setAndWatchStub = spyOn(store, 'setAndWatch');
            isRichProfilePageStub = spyOn(locationUtils, 'isRichProfilePage');
            spyOn(userUtils, 'getNickname').and.returnValue('user12');
        });

        it('should watch user', () => {
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            expect(setAndWatchStub).toHaveBeenCalledWith('user', component, any(Function));
        });

        it('should call signInHandler if user was initialized, has no profile name and it is user profile', () => {
            isRichProfilePageStub.and.returnValue(true);
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            const signInHandlerSpy = spyOn(component, 'signInHandler');
            setAndWatchStub.calls.first().args[2]({ user: { isInitialized: true } });
            expect(signInHandlerSpy).toHaveBeenCalled();
        });

        it('should call loadData if user was initialized, has no profile name and it is not user profile', () => {
            isRichProfilePageStub.and.returnValue(false);
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            const loadDataSpy = spyOn(component, 'loadData');
            setAndWatchStub.calls.first().args[2]({ user: { isInitialized: true } });
            expect(loadDataSpy).toHaveBeenCalled();
        });

        it('should addEventListener', () => {
            const addEventListenerSpy = spyOn(window, 'addEventListener');
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            expect(addEventListenerSpy).toHaveBeenCalled();
        });
    });

    describe('signInHandler', () => {
        it('it should call ensureUserIsReadyForSocialAction', () => {
            const ensureUserIsReadyForSocialActionStub = spyOn(communityUtils, 'ensureUserIsReadyForSocialAction').and.returnValue({
                then: createSpy().and.returnValue({ catch: () => {} })
            });
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            component.signInHandler();
            expect(ensureUserIsReadyForSocialActionStub).toHaveBeenCalledWith(communityUtils.PROVIDER_TYPES.lithium);
        });
    });

    describe('setAnalyticsProps', () => {
        it('it should set analytics data for pageName when is not user profile', () => {
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            component.setAnalyticsProps();
            expect(digitalData.page.pageInfo.pageName).toBe('user-profile');
        });

        it('it should set analytics data pageName when is user profile', () => {
            spyOn(locationUtils, 'isRichProfilePage').and.returnValue(true);
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            component.setAnalyticsProps();
            expect(digitalData.page.pageInfo.pageName).toBe('my-profile');
        });

        it('it should set analytics data for additionalPageInfo when is not followers', () => {
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            component.setAnalyticsProps();
            expect(digitalData.page.attributes.additionalPageInfo).toBe('followers');
        });

        it('it should set analytics data additionalPageInfo when is followers', () => {
            const wrapper = shallow(<FollowList isFollowers={false} />);
            component = wrapper.instance();
            component.setAnalyticsProps();
            expect(digitalData.page.attributes.additionalPageInfo).toBe('following');
        });
    });

    describe('loadData', () => {
        it('should get nickname from util if there is an existing profile', () => {
            spyOn(locationUtils, 'isRichProfilePage').and.returnValue(true);
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            const getNicknameSpy = spyOn(userUtils, 'getNickname');
            component.loadData();
            expect(getNicknameSpy).toHaveBeenCalled();
        });

        it('should get nickname from window object if there is not an existing profile', () => {
            spyOn(locationUtils, 'isRichProfilePage').and.returnValue(false);
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            const getUserNicknameFromProfilePathSpy = spyOn(component, 'getUserNicknameFromProfilePath');
            component.loadData();
            expect(getUserNicknameFromProfilePathSpy).toHaveBeenCalled();
        });
    });

    describe('addFirstUserToFollowList', () => {
        let setUserSocialInfoSpy;

        beforeEach(() => {
            spyOn(store, 'dispatch');
            setUserSocialInfoSpy = spyOn(socialInfoActions, 'setUserSocialInfo');
        });

        it('should call getAuthenticatedUserSocialInfo', () => {
            const getAuthenticatedUserSocialInfoStub = spyOn(lithiumApi, 'getAuthenticatedUserSocialInfo').and.returnValue({ then: () => {} });
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            component.addFirstUserToFollowList();
            expect(getAuthenticatedUserSocialInfoStub).toHaveBeenCalled();
        });

        it('should update list of the followers with the current user as a follower', done => {
            const fakePromise = {
                then: function (resolve) {
                    resolve({
                        socialProfile: {
                            avatar: '',
                            biBadgeUrl: '',
                            engagementBadgeUrl: ''
                        }
                    });

                    expect(component.state.followList).toEqual([
                        {
                            isFollowedByRequester: true,
                            user: {
                                avatar: { url: '' },
                                badges: [{ icon: '' }, { icon: '' }],
                                login: undefined
                            }
                        }
                    ]);

                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            const getAuthenticatedUserSocialInfoStub = spyOn(lithiumApi, 'getAuthenticatedUserSocialInfo').and.returnValue(fakePromise);
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            component.addFirstUserToFollowList();
            expect(getAuthenticatedUserSocialInfoStub).toHaveBeenCalled();
        });

        it('should update user\'s social Info', done => {
            const fakePromise = {
                then: function (resolve) {
                    const data = {
                        socialProfile: {
                            avatar: '',
                            biBadgeUrl: '',
                            engagementBadgeUrl: ''
                        }
                    };
                    resolve(data);

                    expect(setUserSocialInfoSpy).toHaveBeenCalledWith(data);

                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            spyOn(lithiumApi, 'getAuthenticatedUserSocialInfo').and.returnValue(fakePromise);
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            component.addFirstUserToFollowList();
        });

        it('should set the flag of sucessfull lithium call', done => {
            const fakePromise = {
                then: function (resolve) {
                    const data = {
                        socialProfile: {
                            avatar: '',
                            biBadgeUrl: '',
                            engagementBadgeUrl: ''
                        }
                    };
                    resolve(data);

                    expect(data.isLithiumSuccessful).toBeTruthy();

                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };

            spyOn(lithiumApi, 'getAuthenticatedUserSocialInfo').and.returnValue(fakePromise);
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            component.addFirstUserToFollowList();
        });
    });

    describe('toggleFollowingStatus', () => {
        const event = {
            stopPropagation: () => {},
            preventDefault: () => {}
        };

        it('should call ensureUserIsReadyForSocialAction', () => {
            const ensureUserIsReadyForSocialActionStub = spyOn(communityUtils, 'ensureUserIsReadyForSocialAction').and.returnValue({
                then: () => {}
            });
            const wrapper = shallow(<FollowList isFollowers />);
            component = wrapper.instance();
            component.toggleFollowingStatus(event, {}, 0);
            expect(ensureUserIsReadyForSocialActionStub).toHaveBeenCalled();
        });

        describe('with existing index', () => {
            it('should call followUser is not an follower', done => {
                const followUser = { user: { id: 1 } };
                spyOn(userUtils, 'getNickname').and.returnValue('nickname');
                const followUserStub = spyOn(lithiumApi, 'followUser').and.returnValue({ then: () => {} });

                const fakePromise = {
                    then: function (resolve) {
                        resolve();
                        expect(followUserStub).toHaveBeenCalledWith('nickname', 1);
                        done();

                        return fakePromise;
                    },
                    catch: function () {
                        return function () {};
                    }
                };
                spyOn(communityUtils, 'ensureUserIsReadyForSocialAction').and.returnValue(fakePromise);
                const wrapper = shallow(<FollowList isFollowers />);
                component = wrapper.instance();
                component.setState({ followList: [{ isFollowedByRequester: false }] });
                component.toggleFollowingStatus(event, followUser, 0);
            });

            it('should call unfollowUser is an follower', done => {
                const followUser = { user: { id: 1 } };
                spyOn(userUtils, 'getNickname').and.returnValue('nickname');
                const unfollowUserUserStub = spyOn(lithiumApi, 'unfollowUser').and.returnValue({ then: () => {} });

                const fakePromise = {
                    then: function (resolve) {
                        resolve();
                        expect(unfollowUserUserStub).toHaveBeenCalledWith('nickname', 1);
                        done();

                        return fakePromise;
                    },
                    catch: function () {
                        return function () {};
                    }
                };
                spyOn(communityUtils, 'ensureUserIsReadyForSocialAction').and.returnValue(fakePromise);
                const wrapper = shallow(<FollowList isFollowers />);
                component = wrapper.instance();
                component.setState({ followList: [{ isFollowedByRequester: true }] });
                component.toggleFollowingStatus(event, followUser, 0);
            });
        });
    });
});
