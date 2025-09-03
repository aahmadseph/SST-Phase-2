const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('EditMyProfileModal component', () => {
    let EditMyProfileModal;
    let component;

    beforeEach(() => {
        EditMyProfileModal = require('components/RichProfile/EditMyProfile/Modals/EditMyProfileModal/EditMyProfileModal').default;
    });

    describe('Ctrlr', () => {
        let store;
        let setAndWatchSpy;

        beforeEach(() => {
            store = require('store/Store').default;
            setAndWatchSpy = spyOn(store, 'setAndWatch');

            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
        });

        it('should call setAndWatch with correct arguments', () => {
            expect(setAndWatchSpy).toHaveBeenCalledTimes(2);
            expect(setAndWatchSpy).toHaveBeenCalledWith(
                [
                    { 'user.profileId': 'profileId' },
                    { 'user.nickName': 'nickname' },
                    { 'user.beautyInsiderAccount': 'biAccount' },
                    { 'socialInfo.socialProfile': 'socialProfile' },
                    { 'socialInfo.isLithiumSuccessful': 'isLithiumSuccessful' }
                ],
                component,
                null,
                true
            );
        });
    });

    describe('Request Close', () => {
        let store;
        let dispatchSpy;
        let ProfileActions;
        let showEditMyProfileModalStub;

        beforeEach(() => {
            store = require('store/Store').default;
            dispatchSpy = spyOn(store, 'dispatch');
            ProfileActions = require('actions/ProfileActions').default;
            showEditMyProfileModalStub = spyOn(ProfileActions, 'showEditMyProfileModal').and.returnValue('showEditMyProfileModal');

            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
            component.requestClose();
        });

        it('should dispatch showEditMyProfileModal with argument false to close modal', () => {
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith('showEditMyProfileModal');
            expect(showEditMyProfileModalStub).toHaveBeenCalledWith(false);
        });
    });

    describe('Should Show Interstice', () => {
        let store;
        let dispatchSpy;
        let getStateStub;
        let actions;
        let showIntersticeStub;

        beforeEach(() => {
            store = require('store/Store').default;
            dispatchSpy = spyOn(store, 'dispatch');
            getStateStub = spyOn(store, 'getState');
            actions = require('Actions').default;
            showIntersticeStub = spyOn(actions, 'showInterstice').and.returnValue('showInterstice');

            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
        });

        it('should not dispatch action to show interstice', () => {
            getStateStub.and.returnValue({ interstice: { isVisible: true } });
            component.shouldShowInterstice();

            expect(getStateStub).toHaveBeenCalled();
            expect(dispatchSpy).not.toHaveBeenCalled();
        });

        it('should dispatch action to show interstice', () => {
            getStateStub.and.returnValue({ interstice: { isVisible: false } });
            component.shouldShowInterstice();

            expect(getStateStub).toHaveBeenCalled();
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith('showInterstice');
            expect(showIntersticeStub).toHaveBeenCalledWith(true);
        });
    });

    xdescribe('Update Lithium Images', () => {
        let createImageFormDataStub;
        let shouldShowIntersticeSpy;
        let getAlbumSpy;
        let lithiumApi;
        let getUserAlbumsStub;
        let uploadImageToAlbumSpy;
        let fakePromise1;
        let fakePromise2;
        let fakePromise3;
        let fakePromise4;

        beforeEach(() => {
            lithiumApi = require('services/api/thirdparty/Lithium').default;
            getUserAlbumsStub = spyOn(lithiumApi, 'getUserAlbums');
            uploadImageToAlbumSpy = spyOn(lithiumApi, 'uploadImageToAlbum');

            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
            createImageFormDataStub = spyOn(component, 'createImageFormData');
            shouldShowIntersticeSpy = spyOn(component, 'shouldShowInterstice');
            getAlbumSpy = spyOn(component, 'getAlbum');
        });

        describe('Update Avatar', () => {
            let setAvatarFileSpy;
            let updateUserSocialAvatarSpy;

            beforeEach(() => {
                updateUserSocialAvatarSpy = spyOn(lithiumApi, 'updateUserSocialAvatar');
            });

            it('should return lithium api promise and execute code within the "thens"', done => {
                fakePromise1 = {
                    then: function (resolve) {
                        resolve(['album1', 'album2']);
                        expect(getAlbumSpy).toHaveBeenCalledTimes(1);
                        expect(getAlbumSpy).toHaveBeenCalledWith(['album1', 'album2'], 'ProfilePicture');

                        return fakePromise2;
                    },
                    catch: () => {
                        return () => {};
                    }
                };

                fakePromise2 = {
                    then: function (resolve) {
                        resolve({ album: { id: { $: 12345 } } });
                        expect(uploadImageToAlbumSpy).toHaveBeenCalledTimes(1);
                        expect(uploadImageToAlbumSpy).toHaveBeenCalledWith(12345, 'newImage');

                        return fakePromise3;
                    },
                    catch: () => {
                        return () => {};
                    }
                };

                fakePromise3 = {
                    then: function (resolve) {
                        resolve({ image: { url: { $: 'https://www.sephora.com' } } });
                        expect(updateUserSocialAvatarSpy).toHaveBeenCalledTimes(1);
                        expect(updateUserSocialAvatarSpy).toHaveBeenCalledWith('https://www.sephora.com', 'nickname');

                        return fakePromise4;
                    },
                    catch: () => {
                        return () => {};
                    }
                };

                fakePromise4 = {
                    then: () => {
                        expect(setAvatarFileSpy).toHaveBeenCalledTimes(1);
                        expect(setAvatarFileSpy).toHaveBeenCalledWith('avatarFile');
                        done();

                        return fakePromise4;
                    },
                    catch: () => {
                        return () => {};
                    }
                };

                setAvatarFileSpy = spyOn(component, 'setAvatarFile');

                getUserAlbumsStub.and.returnValue(fakePromise1);
                createImageFormDataStub.and.returnValue('newImage');

                component.updateAvatar({ avatarFile: 'avatarFile' }, 'nickname');

                expect(createImageFormDataStub).toHaveBeenCalledTimes(1);
                expect(createImageFormDataStub).toHaveBeenCalledWith('avatarFile');
                expect(shouldShowIntersticeSpy).toHaveBeenCalledTimes(1);
                expect(getUserAlbumsStub).toHaveBeenCalledTimes(1);
                expect(getUserAlbumsStub).toHaveBeenCalledWith('nickname');
            });

            it('should return promise that just resolves since its not updating avatar', () => {
                component.setAvatarFile('avatarFile');
                const updateAvatar = component.updateAvatar({ avatarFile: 'avatarFile' }, 'nickname');
                expect(updateAvatar).toEqual(new Promise(resolve => resolve(false)));
            });

            it('should return promise that just resolves if no image data is created', () => {
                createImageFormDataStub.and.returnValue(null);
                const updateAvatar = component.updateAvatar({ avatarFile: 'avatarFile' }, 'nickname');
                expect(updateAvatar).toEqual(new Promise(resolve => resolve(false)));
            });
        });

        describe('Update Background', () => {
            let setBackgroundFileSpy;
            let updateUserSocialBackgroundSpy;

            beforeEach(() => {
                updateUserSocialBackgroundSpy = spyOn(lithiumApi, 'updateUserSocialBackground');
            });

            it('should return lithium api promise and execute code within the "thens"', done => {
                fakePromise1 = {
                    then: function (resolve) {
                        resolve(['album1', 'album2']);
                        expect(getAlbumSpy).toHaveBeenCalledTimes(1);
                        expect(getAlbumSpy).toHaveBeenCalledWith(['album1', 'album2'], 'Background');

                        return fakePromise2;
                    },
                    catch: () => {
                        return () => {};
                    }
                };

                fakePromise2 = {
                    then: function (resolve) {
                        resolve({ album: { id: { $: 12345 } } });
                        expect(uploadImageToAlbumSpy).toHaveBeenCalledTimes(1);
                        expect(uploadImageToAlbumSpy).toHaveBeenCalledWith(12345, 'newImage');

                        return fakePromise3;
                    },
                    catch: () => {
                        return () => {};
                    }
                };

                fakePromise3 = {
                    then: function (resolve) {
                        resolve({ image: { url: { $: 'https://www.sephora.com' } } });
                        expect(updateUserSocialBackgroundSpy).toHaveBeenCalledTimes(1);
                        expect(updateUserSocialBackgroundSpy).toHaveBeenCalledWith('https://www.sephora.com', 'nickname');

                        return fakePromise4;
                    },
                    catch: () => {
                        return () => {};
                    }
                };

                fakePromise4 = {
                    then: () => {
                        expect(setBackgroundFileSpy).toHaveBeenCalledTimes(1);
                        expect(setBackgroundFileSpy).toHaveBeenCalledWith('backgroundFile');
                        done();

                        return fakePromise4;
                    },
                    catch: () => {
                        return () => {};
                    }
                };

                setBackgroundFileSpy = spyOn(component, 'setBackgroundFile');

                getUserAlbumsStub.and.returnValue(fakePromise1);
                createImageFormDataStub.and.returnValue('newImage');

                component.updateBackground({ backgroundFile: 'backgroundFile' }, 'nickname');

                expect(createImageFormDataStub).toHaveBeenCalledTimes(1);
                expect(createImageFormDataStub).toHaveBeenCalledWith('backgroundFile');
                expect(shouldShowIntersticeSpy).toHaveBeenCalledTimes(1);
                expect(getUserAlbumsStub).toHaveBeenCalledTimes(1);
                expect(getUserAlbumsStub).toHaveBeenCalledWith('nickname');
            });

            it('should return promise that just resolves since its not updating avatar', () => {
                component.setBackgroundFile('backgroundFile');
                const updateBackground = component.updateBackground({ backgroundFile: 'backgroundFile' }, 'nickname');
                expect(updateBackground).toEqual(new Promise(resolve => resolve(false)));
            });

            it('should return promise that just resolves if no image data is created', () => {
                createImageFormDataStub.and.returnValue(null);
                const updateBackground = component.updateBackground({ backgroundFile: 'backgroundFile' }, 'nickname');
                expect(updateBackground).toEqual(new Promise(resolve => resolve(false)));
            });
        });
    });

    xdescribe('Update Bio', () => {
        let updateBio;
        let shouldShowIntersticeSpy;
        let lithiumApi;
        let updateUserSocialBioSpy;

        beforeEach(() => {
            lithiumApi = require('services/api/thirdparty/Lithium').default;
            updateUserSocialBioSpy = spyOn(lithiumApi, 'updateUserSocialBio');

            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
            component.state = { socialProfile: { aboutMe: 'aboutMe' } };
            shouldShowIntersticeSpy = spyOn(component, 'shouldShowInterstice');
        });

        it('should return lithium api call to updateUserSocialBio', () => {
            updateBio = component.updateBio({ aboutMe: 'newAboutMe' }, 'nickname');
            expect(shouldShowIntersticeSpy).toHaveBeenCalledTimes(1);
            expect(updateBio).toEqual(updateUserSocialBioSpy('newAboutMe', 'nickname'));
        });

        it('should return empty promise that resolves since there is nothing to update', () => {
            updateBio = component.updateBio({ aboutMe: 'aboutMe' }, 'nickname');
            expect(updateBio).toEqual(new Promise(resolve => resolve(false)));
        });
    });

    describe('Update Instagram', () => {
        let lithiumApi;
        let updateInstagram;
        let shouldShowIntersticeSpy;
        let updateUserSocialInstagramSpy;

        beforeEach(() => {
            lithiumApi = require('services/api/thirdparty/Lithium').default;
            updateUserSocialInstagramSpy = spyOn(lithiumApi, 'updateUserSocialInstagram');
            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
            component.state = { socialProfile: { instagram: 'https://currentInstaLink' } };
            shouldShowIntersticeSpy = spyOn(component, 'shouldShowInterstice');
        });

        it('should add https:// to link and return updateUserSocialInstagram api promise', () => {
            updateInstagram = component.updateInstagram({ instagram: 'newInstaLink' }, 'nickname');
            expect(shouldShowIntersticeSpy).toHaveBeenCalledTimes(1);
            expect(updateInstagram).toEqual(updateUserSocialInstagramSpy('https://newInstaLink', 'nickname'));
        });

        it('should update link to https and return updateUserSocialInstagram api promise', () => {
            updateInstagram = component.updateInstagram({ instagram: 'http://newInstaLink' }, 'nickname');
            expect(shouldShowIntersticeSpy).toHaveBeenCalledTimes(1);
            expect(updateInstagram).toEqual(updateUserSocialInstagramSpy('https://newInstaLink', 'nickname'));
        });

        it('should return updateUserSocialInstagram api promise', () => {
            updateInstagram = component.updateInstagram({ instagram: 'https://newInstaLink' }, 'nickname');
            expect(shouldShowIntersticeSpy).toHaveBeenCalledTimes(1);
            expect(updateInstagram).toEqual(updateUserSocialInstagramSpy('https://newInstaLink', 'nickname'));
        });

        xit('should return empty promise that automatically resolves', () => {
            updateInstagram = component.updateInstagram({ instagram: 'https://currentInstaLink' }, 'nickname');
            expect(updateInstagram).toEqual(new Promise(resolve => resolve(false)));
        });
    });

    describe('Update Youtube', () => {
        let lithiumApi;
        let updateYoutube;
        let shouldShowIntersticeSpy;
        let updateUserSocialYoutubeSpy;

        beforeEach(() => {
            lithiumApi = require('services/api/thirdparty/Lithium').default;
            updateUserSocialYoutubeSpy = spyOn(lithiumApi, 'updateUserSocialYoutube');
            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
            component.state = { socialProfile: { youtube: 'https://currentYoutubeLink' } };
            shouldShowIntersticeSpy = spyOn(component, 'shouldShowInterstice');
        });

        it('should add https:// to link and return updateUserSocialYoutube api promise', () => {
            updateYoutube = component.updateYoutube({ youtube: 'newYoutubeLink' }, 'nickname');
            expect(shouldShowIntersticeSpy).toHaveBeenCalledTimes(1);
            expect(updateYoutube).toEqual(updateUserSocialYoutubeSpy('https://newYoutubeLink', 'nickname'));
        });

        it('should update link to https and return updateUserSocialYoutube api promise', () => {
            updateYoutube = component.updateYoutube({ youtube: 'http://newYoutubeLink' }, 'nickname');
            expect(shouldShowIntersticeSpy).toHaveBeenCalledTimes(1);
            expect(updateYoutube).toEqual(updateUserSocialYoutubeSpy('https://newYoutubeLink', 'nickname'));
        });

        it('should return updateUserSocialYoutube api promise', () => {
            updateYoutube = component.updateYoutube({ youtube: 'https://newYoutubeLink' }, 'nickname');
            expect(shouldShowIntersticeSpy).toHaveBeenCalledTimes(1);
            expect(updateYoutube).toEqual(updateUserSocialYoutubeSpy('https://newYoutubeLink', 'nickname'));
        });

        xit('should return empty promise that automatically resolves', () => {
            updateYoutube = component.updateYoutube({ youtube: 'https://currentYoutubeLink' }, 'nickname');
            expect(updateYoutube).toEqual(new Promise(resolve => resolve(false)));
        });
    });

    xdescribe('Update Lithium', () => {
        let lithiumApi;
        let getAuthenticatedUserSocialInfoStub;
        let store;
        let dispatchSpy;
        let getStateStub;
        let socialInfoActions;
        let setUserSocialInfoStub;
        let actions;
        let showIntersticeStub;
        let fakePromise;
        let fakePromiseAll;
        let processEvent;
        let processSpy;
        let analyticsConsts;

        beforeEach(() => {
            store = require('store/Store').default;
            dispatchSpy = spyOn(store, 'dispatch');
            getStateStub = spyOn(store, 'getState');

            actions = require('Actions').default;
            showIntersticeStub = spyOn(actions, 'showInterstice').and.returnValue('showInterstice');

            socialInfoActions = require('actions/SocialInfoActions').default;
            setUserSocialInfoStub = spyOn(socialInfoActions, 'setUserSocialInfo').and.returnValue('setUserSocialInfo');

            lithiumApi = require('services/api/thirdparty/Lithium').default;
            getAuthenticatedUserSocialInfoStub = spyOn(lithiumApi, 'getAuthenticatedUserSocialInfo');

            processEvent = require('analytics/processEvent').default;
            processSpy = spyOn(processEvent, 'process');
            analyticsConsts = require('analytics/constants').default;

            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
            spyOn(component, 'updateAvatar');
            spyOn(component, 'updateBackground');
            spyOn(component, 'updateInstagram');
            spyOn(component, 'updateYoutube');
            spyOn(component, 'updateBio');
            component.state = { nickname: 'nickname' };
        });

        it('should execute successful promise.all for updating lithium data', done => {
            fakePromiseAll = {
                then: function (resolve) {
                    resolve([false, true, false, true, true]);
                    expect(getAuthenticatedUserSocialInfoStub).toHaveBeenCalledTimes(1);
                    expect(getAuthenticatedUserSocialInfoStub).toHaveBeenCalledWith('nickname');
                    done();

                    return fakePromiseAll;
                },
                catch: () => {
                    return fakePromiseAll;
                }
            };
            const callback = createSpy();
            spyOn(Promise, 'all').and.returnValue(fakePromiseAll);
            getAuthenticatedUserSocialInfoStub.and.returnValue(Promise.resolve());

            component.updateLithium({}, 'nickname', callback);
        });

        it('should successfully run getAuthenticatedUserSocialInfo promise', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve({ data: { socialInfo: 'socialInfo' } });
                    expect(dispatchSpy).toHaveBeenCalledTimes(2);
                    expect(dispatchSpy).toHaveBeenCalledWith('setUserSocialInfo');
                    expect(setUserSocialInfoStub).toHaveBeenCalledWith({
                        isLithiumSuccessful: true,
                        data: { socialInfo: 'socialInfo' }
                    });
                    expect(dispatchSpy).toHaveBeenCalledWith('showInterstice');
                    expect(showIntersticeStub).toHaveBeenCalledWith(false);
                    expect(callback).toHaveBeenCalledTimes(1);
                    done();

                    return fakePromise;
                },
                catch: () => {
                    return fakePromise;
                }
            };
            const callback = createSpy();
            spyOn(Promise, 'all').and.returnValue(Promise.resolve([false, true, false, true, true]));
            getAuthenticatedUserSocialInfoStub.and.returnValue(fakePromise);

            component.updateLithium({}, 'nickname', callback);
        });

        it('should process analytics for update avatar', done => {
            fakePromiseAll = {
                then: function (resolve) {
                    resolve([true, true, false, true, true]);
                    expect(processSpy).toHaveBeenCalledTimes(1);
                    expect(processSpy).toHaveBeenCalledWith(analyticsConsts.LINK_TRACKING_EVENT, {
                        data: {
                            actionInfo: 'pageType:pageName:upload profile photo',
                            linkName: 'pageType:pageName:upload profile photo',
                            eventStrings: [analyticsConsts.Event.EVENT_71, analyticsConsts.Event.UPLOAD_PROFILE_PHOTO],
                            usePreviousPageName: true
                        }
                    });
                    done();

                    return fakePromiseAll;
                },
                catch: () => {
                    return fakePromiseAll;
                }
            };
            digitalData = {
                page: {
                    category: { pageType: 'pageType' },
                    pageInfo: { pageName: 'pageName' }
                }
            };
            spyOn(Promise, 'all').and.returnValue(fakePromiseAll);
            getAuthenticatedUserSocialInfoStub.and.returnValue(Promise.resolve());

            component.updateLithium({}, 'nickname');
        });

        it('should process analytics for updating bio', done => {
            fakePromiseAll = {
                then: function (resolve) {
                    resolve([false, true, true, true, true]);
                    expect(processSpy).toHaveBeenCalledTimes(1);
                    expect(processSpy).toHaveBeenCalledWith(analyticsConsts.LINK_TRACKING_EVENT, {
                        data: {
                            actionInfo: 'pageType:pageName:edit about me text',
                            linkName: 'pageType:pageName:edit about me text',
                            eventStrings: [analyticsConsts.Event.EVENT_71, analyticsConsts.Event.EDIT_ABOUT_ME_TEXT],
                            usePreviousPageName: true
                        }
                    });
                    done();

                    return fakePromiseAll;
                },
                catch: () => {
                    return fakePromiseAll;
                }
            };
            digitalData = {
                page: {
                    category: { pageType: 'pageType' },
                    pageInfo: { pageName: 'pageName' }
                }
            };
            spyOn(Promise, 'all').and.returnValue(fakePromiseAll);
            getAuthenticatedUserSocialInfoStub.and.returnValue(Promise.resolve());

            component.updateLithium({}, 'nickname');
        });

        it('should execute failure of promise.all when interstice is showing', done => {
            fakePromiseAll = {
                then: () => {
                    return fakePromiseAll;
                },
                catch: function (reject) {
                    reject();
                    expect(getStateStub).toHaveBeenCalled();
                    expect(dispatchSpy).toHaveBeenCalledWith('showInterstice');
                    expect(showIntersticeStub).toHaveBeenCalledWith(false);
                    done();

                    return fakePromiseAll;
                }
            };

            spyOn(Promise, 'all').and.returnValue(fakePromiseAll);
            getStateStub.and.returnValue({ interstice: { isVisible: true } });

            component.updateLithium({}, 'nickname');
        });

        it('should execute failure of promise.all when interstice is not showing', done => {
            fakePromiseAll = {
                then: function () {
                    return fakePromiseAll;
                },
                catch: function (reject) {
                    reject();
                    expect(getStateStub).toHaveBeenCalled();
                    expect(dispatchSpy).not.toHaveBeenCalled();
                    done();

                    return fakePromiseAll;
                }
            };

            spyOn(Promise, 'all').and.returnValue(fakePromiseAll);
            getStateStub.and.returnValue({ interstice: { isVisible: false } });

            component.updateLithium({}, 'nickname');
        });
    });

    xdescribe('setAvatarFile', () => {
        it('should update component.avatarFile to new avatarFile', done => {
            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
            const setAvatarFileSpy = component.setAvatarFile('newAvatarFile');
            expect(setAvatarFileSpy).toEqual(new Promise(resolve => resolve()));
            setAvatarFileSpy.then(() => {
                expect(component.avatarFile).toEqual('newAvatarFile');
                done();
            });
        });
    });

    xdescribe('setBackgroundFile', () => {
        it('should update component.backgroundFile to new backgroundFile', done => {
            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
            const setBackgroundFileSpy = component.setBackgroundFile('newBackgroundFile');
            expect(setBackgroundFileSpy).toEqual(new Promise(resolve => resolve()));
            setBackgroundFileSpy.then(() => {
                expect(component.backgroundFile).toEqual('newBackgroundFile');
                done();
            });
        });
    });

    describe('getAlbum', () => {
        let dataStub;
        let lithiumApi;
        let createAlbumSpy;

        beforeEach(() => {
            dataStub = { albums: { album: [{ title: { $: 'ALBUMTITLE' } }] } };

            lithiumApi = require('services/api/thirdparty/Lithium').default;
            createAlbumSpy = spyOn(lithiumApi, 'createAlbum');

            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
        });

        it('should return promise function that resolves existing album data', done => {
            component.getAlbum(dataStub, 'ALBUMTITLE').then(result => {
                expect(result.album.title.$).toEqual('ALBUMTITLE');
                done();
            });
        });

        it('should return the correct album data if promise is used', done => {
            component.getAlbum(dataStub, 'ALBUMTITLE').then(album => {
                expect(album).toEqual({ album: { title: { $: 'ALBUMTITLE' } } });
                done();
            });
        });

        it('should create a new ablum when album title does not exist', () => {
            component.getAlbum(dataStub, 'NEWALBUMTITLE');
            expect(createAlbumSpy).toHaveBeenCalledTimes(1);
            expect(createAlbumSpy).toHaveBeenCalledWith('NEWALBUMTITLE');
        });
    });

    describe('createImageFormData', () => {
        let createImageFormDataStub;

        beforeEach(() => {
            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
        });

        it('should return false if no image data', () => {
            createImageFormDataStub = component.createImageFormData();
            expect(createImageFormDataStub).toEqual(false);
        });

        it('should return false if image does not match regex defined', () => {
            createImageFormDataStub = component.createImageFormData({ type: 'incorrectImageType' });
            expect(createImageFormDataStub).toEqual(false);
        });

        it('should return formdata with image content', () => {
            const imageContent = {
                type: 'image/jpeg',
                imageContent: 'imageContent'
            };
            const formStub = new FormData();
            formStub.append('image.content', imageContent);
            createImageFormDataStub = component.createImageFormData(imageContent);
            expect(createImageFormDataStub).toEqual(formStub);
        });
    });

    describe('saveProfileCallback', () => {
        let profileData;
        let callback;
        let isLithiumUpdate;
        let ProfileActions;
        let updateBiAccountStub;
        let Store;
        let dispatchSpy;
        let biUtils;
        let completeProfileObjectStub;

        beforeEach(() => {
            ProfileActions = require('actions/ProfileActions').default;
            updateBiAccountStub = spyOn(ProfileActions, 'updateBiAccount').and.returnValue('updateBiAccount');

            Store = require('store/Store').default;
            dispatchSpy = spyOn(Store, 'dispatch');

            biUtils = require('utils/BiProfile').default;
            completeProfileObjectStub = spyOn(biUtils, 'completeProfileObject');

            const wrapper = shallow(<EditMyProfileModal />);
            component = wrapper.instance();
            component.state = {
                profileId: '12345',
                nickname: 'nickname',
                biAccount: { personalizedInformation: 'personalizedInformationObject' }
            };
            callback = createSpy('callback');
        });

        describe('isLithiumUpdate', () => {
            let updateLithiumSpy;

            beforeEach(() => {
                profileData = { profileData: 'profileData' };
                isLithiumUpdate = true;
                updateLithiumSpy = spyOn(component, 'updateLithium');
            });

            it('isMobile', () => {
                spyOn(Sephora, 'isMobile').and.returnValue(true);
                component.saveProfileCallback(profileData, callback, isLithiumUpdate);
                expect(updateLithiumSpy).toHaveBeenCalledTimes(1);
                expect(updateLithiumSpy).toHaveBeenCalledWith(profileData, 'nickname', callback, true);
            });

            it('isDesktop', () => {
                spyOn(Sephora, 'isMobile').and.returnValue(false);
                component.saveProfileCallback(profileData, callback, isLithiumUpdate);
                expect(updateLithiumSpy).toHaveBeenCalledTimes(1);
                expect(updateLithiumSpy).toHaveBeenCalledWith(profileData, 'nickname', callback, true);
            });
        });

        it('profileData && profileData.biPrivate', () => {
            profileData = {
                biPrivate: true,
                profileData: 'profileData'
            };
            isLithiumUpdate = false;
            component.saveProfileCallback(profileData, callback, isLithiumUpdate);
            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith('updateBiAccount');
            expect(updateBiAccountStub).toHaveBeenCalledWith(true, callback);
        });

        it('else', () => {
            profileData = { biAccount: { personalizedInformation: 'newPersonalizedInformationObject' } };
            isLithiumUpdate = false;

            completeProfileObjectStub.and.returnValue('newPersonalizedInformationObject');

            component.saveProfileCallback(profileData, callback, isLithiumUpdate);

            expect(completeProfileObjectStub).toHaveBeenCalledTimes(1);
            expect(completeProfileObjectStub).toHaveBeenCalledWith('newPersonalizedInformationObject', 'personalizedInformationObject');

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).toHaveBeenCalledWith('updateBiAccount');
            expect(updateBiAccountStub).toHaveBeenCalledWith(
                {
                    profileId: '12345',
                    biAccount: { personalizedInformation: 'newPersonalizedInformationObject' }
                },
                callback
            );
        });
    });
});
