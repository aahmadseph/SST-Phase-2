describe('UserInfo Service', () => {
    const { any } = jasmine;
    let InflatorComps;
    let onLastLoadEventStub;
    let location;
    let Storage;

    beforeEach(() => {
        Sephora.rwdPersistentBanner1 = [{ componentType: 93 }, { componentType: 95 }];
        location = require('utils/Location').default;

        InflatorComps = require('utils/framework/InflateComponents').default;
        const { Application } = require('utils/framework').default;
        onLastLoadEventStub = spyOn(Application.events, 'onLastLoadEvent');

        Storage = require('utils/localStorage/Storage').default;
        const localStorageConstants = require('utils/localStorage/Constants').default;
        const LOCAL_STORAGE_SIGN_IN_SEEN = localStorageConstants.SIGN_IN_SEEN;

        spyOn(Sephora, 'isDesktop').and.returnValue(true);
        spyOn(location, 'isRichProfilePage').and.returnValue(false);
        spyOn(location, 'isVendorLoginPage').and.returnValue(false);
        spyOn(location, 'isPreviewSettings').and.returnValue(false);
        Storage.local.setItem(LOCAL_STORAGE_SIGN_IN_SEEN, false);

        InflatorComps.services = {
            UserInfo: {
                data: {
                    profile: {
                        profileStatus: 0
                    },
                    basket: {}
                }
            },
            loadEvents: {}
        };
    });

    describe('initialization', () => {
        it('should call onLastLoadEvent', () => {
            require('services/UserInfo.js');

            expect(onLastLoadEventStub).toHaveBeenCalledWith(window, ['HydrationFinished', 'UserInfoLoaded'], any(Function));
        });
    });
});
