describe('User utils', () => {
    const store = require('Store').default;
    const userUtils = require('utils/User').default;

    let storeGetStateStub;

    const nonBiUser = { user: {} };

    const biUser = { user: { beautyInsiderAccount: { vibSegment: userUtils.types.BI } } };

    const rougeUser = { user: { beautyInsiderAccount: { vibSegment: userUtils.types.ROUGE } } };

    const vibUser = {
        user: {
            beautyInsiderAccount: {
                vibSegment: userUtils.types.VIB,
                realTimeVIBStatus: userUtils.types.VIB
            }
        }
    };

    const skuFree = { biType: 'free' };
    const sku100 = { biType: '100 points' };
    const skuBi100 = {
        biExclusiveLevel: 'bi',
        biType: '100 points'
    };

    const skuBi500 = {
        biExclusiveLevel: 'bi',
        biType: '500 points'
    };
    const skuVib100 = {
        biExclusiveLevel: 'vib',
        biType: '100 points'
    };
    const skuRouge100 = {
        biExclusiveLevel: 'rouge',
        biType: '100 points'
    };

    const biUserWithRewards = {
        user: {
            beautyInsiderAccount: { vibSegment: userUtils.types.BI },
            bankRewards: {
                currentLevelName: '8105546571',
                currentLevelNumber: '9152770575',
                expiredRewardsTotal: 0,
                numberOfRewardsAvailable: 10,
                rewardCertificates: [
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW5459384491',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        rewardAmount: 81,
                        startDate: '2018-06-01'
                    },
                    {
                        available: true,
                        barcodeIndicator: '39',
                        certificateNumber: 'RW3177257594',
                        expireDate: '2020-01-01',
                        fulfilDate: '2018-06-01',
                        pinCode: '100',
                        rewardAmount: 14,
                        startDate: '2018-06-01'
                    }
                ],
                rewardsTotal: 95,
                upcomingRewardsTotal: 0
            }
        }
    };

    beforeEach(() => {
        storeGetStateStub = spyOn(store, 'getState').and.returnValue({ testTarget: { readyState: 2 } });
    });

    describe('biStatus', () => {
        it('should return NON_BI for non-BI user', () => {
            storeGetStateStub.and.returnValue(nonBiUser);

            expect(userUtils.getBiStatus()).toEqual(userUtils.types.NON_BI);
        });

        it('should return the user\'s BI type if a BI user', () => {
            storeGetStateStub.and.returnValue(vibUser);

            expect(userUtils.getBiStatus()).toEqual(userUtils.types.VIB);
        });
    });

    describe('realTimeBiStatus', () => {
        it('should return NON_BI for non-BI user', () => {
            storeGetStateStub.and.returnValue(nonBiUser);

            expect(userUtils.getRealTimeBiStatus()).toEqual(userUtils.types.NON_BI);
        });

        it('should return the user\'s BI type if a BI user', () => {
            storeGetStateStub.and.returnValue(vibUser);

            expect(userUtils.getRealTimeBiStatus()).toEqual(userUtils.types.VIB);
        });
    });

    describe('getBiStatusText', () => {
        it('should return NON_BI for non-BI user', () => {
            storeGetStateStub.and.returnValue(nonBiUser);

            expect(userUtils.getBiStatusText()).toEqual(userUtils.types.NON_BI);
        });

        it('should return "VIB" if a VIB user', () => {
            storeGetStateStub.and.returnValue(vibUser);

            expect(userUtils.getBiStatusText()).toEqual('VIB');
        });

        it('should return "Rouge" if a rouge user', () => {
            storeGetStateStub.and.returnValue(rougeUser);

            expect(userUtils.getBiStatusText()).toEqual('Rouge');
        });

        it('should return "Beauty Insider" if a BI user', () => {
            storeGetStateStub.and.returnValue(biUser);

            expect(userUtils.getBiStatusText()).toEqual('Insider');
        });
    });

    describe('isBI', () => {
        it('should return false for non-BI user', () => {
            storeGetStateStub.and.returnValue(nonBiUser);

            expect(userUtils.isBI()).toBeFalsy();
        });

        it('should return true if a BI user', () => {
            storeGetStateStub.and.returnValue(vibUser);

            expect(userUtils.isBI()).toBeTruthy();
        });
    });

    describe('isBiLevelQualifiedFor', () => {
        describe('non-BI user', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue(nonBiUser);
            });

            it('should qualify for sku with level none', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuFree)).toBeTruthy();
            });

            it('should not qualify for sku with level BI', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuBi100)).toBeFalsy();
            });
        });

        describe('BI user', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue(biUser);
            });

            it('should qualify for sku with level none', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuFree)).toBeTruthy();
            });

            it('should qualify for sku with level BI', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuBi100)).toBeTruthy();
            });

            it('should not qualify for sku with level rouge', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuRouge100)).toBeFalsy();
            });
        });

        describe('VIB user', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue(vibUser);
            });

            it('should qualify for sku with level none', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuFree)).toBeTruthy();
            });

            it('should qualify for sku with level BI', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuBi100)).toBeTruthy();
            });

            it('should qualify for sku with level VIB', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuVib100)).toBeTruthy();
            });

            it('should not qualify for sku with level rouge', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuRouge100)).toBeFalsy();
            });
        });

        describe('Rouge user', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue(rougeUser);
            });

            it('should qualify for sku with level none', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuFree)).toBeTruthy();
            });

            it('should qualify for sku with level BI', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuBi100)).toBeTruthy();
            });

            it('should qualify for sku with level VIB', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuVib100)).toBeTruthy();
            });

            it('should qualify for sku with level rouge', () => {
                expect(userUtils.isBiLevelQualifiedFor(skuRouge100)).toBeTruthy();
            });
        });
    });

    describe('isBiLevelQualifiedFor', () => {
        describe('user with no points', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue({
                    basket: {
                        availableBiPoints: 0,
                        redeemedBiPoints: 0
                    }
                });
            });

            it('should qualify for free sku', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(skuFree)).toBeTruthy();
            });

            it('should not qualify for sku worth 100 points', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(sku100)).toBeFalsy();
            });
        });

        describe('user with 99 points', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue({
                    basket: {
                        availableBiPoints: 99,
                        redeemedBiPoints: 0
                    }
                });
            });

            it('should qualify for free sku', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(skuFree)).toBeTruthy();
            });

            it('should not qualify for sku worth 100 points', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(sku100)).toBeFalsy();
            });
        });

        describe('user with 100 available points', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue({
                    basket: {
                        availableBiPoints: 200,
                        redeemedBiPoints: 100
                    }
                });
            });

            it('should qualify for free sku', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(skuFree)).toBeTruthy();
            });

            it('should qualify for sku worth 100 points', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(sku100)).toBeTruthy();
            });

            it('should not qualify for sku worth 500 points', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(skuBi500)).toBeFalsy();
            });
        });

        describe('user with 0 available points', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue({
                    basket: {
                        availableBiPoints: 200,
                        redeemedBiPoints: 200
                    }
                });
            });

            it('should qualify for free sku', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(skuFree)).toBeTruthy();
            });

            it('should not qualify for sku worth 100 points', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(sku100)).toBeFalsy();
            });
        });

        describe('user with 99 available points', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue({
                    basket: {
                        availableBiPoints: 199,
                        redeemedBiPoints: 100
                    }
                });
            });

            it('should qualify for free sku', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(skuFree)).toBeTruthy();
            });

            it('should not qualify for sku worth 100 points', () => {
                expect(userUtils.isBiPointsBiQualifiedFor(sku100)).toBeFalsy();
            });
        });
    });

    describe('isRewardEligible', () => {
        describe('non-BI user with no points', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue(nonBiUser);
            });

            it('should be true for free sku', () => {
                expect(userUtils.isRewardEligible(skuFree)).toBeTruthy();
            });
        });
    });

    describe('getRewardsAmount method', () => {
        it('should return reward amount', () => {
            expect(userUtils.getRewardsAmount(biUserWithRewards.user.bankRewards)).toEqual(95);
        });

        it('should return 0 amount if rewards are not presented', () => {
            expect(userUtils.getRewardsAmount(biUser.user.bankRewards)).toEqual(0);
        });
    });

    describe('isRouge Function Suite', () => {
        it('should return true if user is a rouge user', () => {
            storeGetStateStub.and.returnValue(rougeUser);
            expect(userUtils.isRouge()).toBeTruthy();
        });
        it('should return false if user is a bi user', () => {
            storeGetStateStub.and.returnValue(biUser);
            expect(userUtils.isRouge()).toBeFalsy();
        });
        it('should return fakse if user is a vib user', () => {
            storeGetStateStub.and.returnValue(vibUser);
            expect(userUtils.isRouge()).toBeFalsy();
        });
        it('should return false if user is a non bi or anonymous user', () => {
            storeGetStateStub.and.returnValue(nonBiUser);
            expect(userUtils.isRouge()).toBeFalsy();
        });
    });

    describe('isEligibleForRRC', () => {
        let rrcEligibleUser;

        beforeEach(() => {
            rrcEligibleUser = { user: { beautyInsiderAccount: { isEligibleForRRC: true } } };
        });

        it('should return true if the user is eligible for RRC', () => {
            storeGetStateStub.and.returnValue(rrcEligibleUser);
            expect(userUtils.isEligibleForRRC()).toBeTruthy();
        });

        it('should return false if the user is not eligible for RRC', () => {
            rrcEligibleUser.user.beautyInsiderAccount.isEligibleForRRC = false;
            storeGetStateStub.and.returnValue(rrcEligibleUser);
            expect(userUtils.isEligibleForRRC()).toBeFalsy();
        });

        it('should return false if the user is vib', () => {
            storeGetStateStub.and.returnValue(vibUser);
            expect(userUtils.isEligibleForRRC()).toBeFalsy();
        });

        it('should return false if the user is not BI', () => {
            storeGetStateStub.and.returnValue(nonBiUser);
            expect(userUtils.isEligibleForRRC()).toBeFalsy();
        });
    });

    describe('isDefaultBIBirthday', () => {
        let biAccount;

        it('should return true if birtday passed in is default', () => {
            biAccount = {
                birthMonth: '1',
                birthDay: '1',
                birthYear: '1804'
            };
            expect(userUtils.isDefaultBIBirthDay(biAccount)).toBe(true);
        });

        it('should return false if birthday passed in is not default', () => {
            biAccount = {
                birthMonth: '10',
                birthDay: '30',
                birthYear: '1992'
            };
            expect(userUtils.isDefaultBIBirthDay(biAccount)).toBe(false);
        });

        it('should return true if store returns default birthday', () => {
            storeGetStateStub.and.returnValue({
                user: {
                    beautyInsiderAccount: {
                        birthMonth: '1',
                        birthDay: '1',
                        birthYear: '1804'
                    }
                }
            });
            expect(userUtils.isDefaultBIBirthDay()).toBe(true);
        });

        it('should return false if store returns non default birthday', () => {
            storeGetStateStub.and.returnValue({
                user: {
                    beautyInsiderAccount: {
                        birthMonth: '10',
                        birthDay: '30',
                        birthYear: '1992'
                    }
                }
            });
            expect(userUtils.isDefaultBIBirthDay()).toBe(false);
        });
    });

    describe('isUserAtleastRecognized', () => {
        it('should return true if the user is logged in', () => {
            storeGetStateStub.and.returnValue({ auth: { profileStatus: userUtils.PROFILE_STATUS.LOGGED_IN } });
            expect(userUtils.isUserAtleastRecognized()).toBe(true);
        });

        it('should return true if the user is recognized in', () => {
            storeGetStateStub.and.returnValue({ auth: { profileStatus: userUtils.PROFILE_STATUS.RECOGNIZED } });
            expect(userUtils.isUserAtleastRecognized()).toBe(true);
        });

        it('should return false if the user is anonymous', () => {
            storeGetStateStub.and.returnValue({ auth: { profileStatus: userUtils.PROFILE_STATUS.ANONYMOUS } });
            expect(userUtils.isUserAtleastRecognized()).toBe(false);
        });
    });

    describe('isCelebrationEligible', () => {
        let originalConfigurationSettings;

        beforeEach(() => {
            originalConfigurationSettings = window.Sephora.configurationSettings;
        });

        afterEach(() => {
            window.Sephora.configurationSettings = originalConfigurationSettings;
        });

        it('should return true if the user is elegible for celebration gift', () => {
            storeGetStateStub.and.returnValue(rougeUser);
            const beautyInsiderAccount = { eligibleForCelebrationGift: true };
            expect(userUtils.isCelebrationEligible(beautyInsiderAccount)).toBeTruthy();
        });

        it('should return false if the user is not elegible for celebration gift', () => {
            storeGetStateStub.and.returnValue(rougeUser);
            const beautyInsiderAccount = { eligibleForCelebrationGift: false };
            expect(userUtils.isCelebrationEligible(beautyInsiderAccount)).toBeFalsy();
        });

        it('should return true if the user VIB and is elegible for celebration gift', () => {
            storeGetStateStub.and.returnValue(vibUser);
            const beautyInsiderAccount = { eligibleForCelebrationGift: true };
            Sephora.configurationSettings = { VIBCelebrationFlag: true };
            expect(userUtils.isCelebrationEligible(beautyInsiderAccount)).toBeTruthy();
        });

        it('should return false if the user VIB and is not elegible for celebration gift', () => {
            storeGetStateStub.and.returnValue(vibUser);
            const beautyInsiderAccount = { eligibleForCelebrationGift: false };
            Sephora.configurationSettings = { VIBCelebrationFlag: false };
            expect(userUtils.isCelebrationEligible(beautyInsiderAccount)).toBeFalsy();
        });
    });

    describe('isAnonymous', () => {
        it('should return true if the user doesn\'t exist', () => {
            storeGetStateStub.and.returnValue({ auth: {} });
            expect(userUtils.isAnonymous()).toBeTruthy();
        });

        it('should return true if the user is anonymous', () => {
            storeGetStateStub.and.returnValue({ auth: { profileStatus: userUtils.PROFILE_STATUS.ANONYMOUS } });
            expect(userUtils.isAnonymous()).toBeTruthy();
        });
    });

    describe('isBirthdayGiftEligible', () => {
        it('should return true if the user is eligible for a birthday gift', () => {
            storeGetStateStub.and.returnValue({ user: { beautyInsiderAccount: { eligibleForBirthdayGift: true } } });
            expect(userUtils.isBirthdayGiftEligible()).toBeTruthy();
        });

        it('should return false if the user is not eligible for a birthday gift', () => {
            storeGetStateStub.and.returnValue({ user: { beautyInsiderAccount: { eligibleForBirthdayGift: false } } });
            expect(userUtils.isBirthdayGiftEligible()).toBeFalsy();
        });
    });

    describe('forceSignIn', () => {
        const Storage = require('utils/localStorage/Storage').default;
        const locationUtils = require('utils/Location').default;
        const Authentication = require('utils/Authentication').default;
        const LOCAL_STORAGE = require('utils/localStorage/Constants').default;
        let requireAuthenticationSpy;
        let storageItems;
        let isDesktopStub;
        let isAnonymousStub;
        let isRichProfilePageStub;
        let isPreviewSettingsStub;
        let isVendorLoginPageStub;
        let isVendorGenericLogin;
        let setItemStub;

        beforeEach(() => {
            storageItems = {
                [LOCAL_STORAGE.SIGN_IN_SEEN]: false,
                [LOCAL_STORAGE.PAGE_DISPLAY_COUNT]: undefined
            };
            isAnonymousStub = spyOn(userUtils, 'isAnonymous').and.returnValue(true);
            isDesktopStub = spyOn(Sephora, 'isDesktop').and.returnValue(true);
            isRichProfilePageStub = spyOn(locationUtils, 'isRichProfilePage').and.returnValue(false);
            isPreviewSettingsStub = spyOn(locationUtils, 'isPreviewSettings').and.returnValue(false);
            isVendorLoginPageStub = spyOn(locationUtils, 'isVendorLoginPage').and.returnValue(false);
            isVendorGenericLogin = spyOn(locationUtils, 'isVendorGenericLogin').and.returnValue(false);
            setItemStub = spyOn(Storage.local, 'setItem');
            spyOn(Storage.local, 'getItem').and.callFake(key => storageItems[key]);

            requireAuthenticationSpy = spyOn(Authentication, 'requireAuthentication').and.returnValue({ catch: () => {} });
        });

        it('should show sign in modal for 1st page load', () => {
            userUtils.forceSignIn();
            expect(requireAuthenticationSpy).toHaveBeenCalled();
        });

        it('should increase the pageDisplayCount to 1 for 2nd SPA page load', () => {
            userUtils.forceSignIn();
            expect(setItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.PAGE_DISPLAY_COUNT, 1);
        });

        it('should not show sign in modal for 1+ page load', () => {
            storageItems[LOCAL_STORAGE.PAGE_DISPLAY_COUNT] = 1;
            userUtils.forceSignIn();
            expect(requireAuthenticationSpy).not.toHaveBeenCalled();
        });

        it('should not show sign in if the user has seen the modal already', () => {
            storageItems[LOCAL_STORAGE.SIGN_IN_SEEN] = true;
            userUtils.forceSignIn();
            expect(requireAuthenticationSpy).not.toHaveBeenCalled();
        });

        it('should not show sign in modal for Mobile', () => {
            isDesktopStub.and.returnValue(false);
            userUtils.forceSignIn();
            expect(requireAuthenticationSpy).not.toHaveBeenCalled();
        });

        it('should not show sign in for logged in or recognized users', () => {
            isAnonymousStub.and.returnValue(false);
            userUtils.forceSignIn();
            expect(requireAuthenticationSpy).not.toHaveBeenCalled();
        });

        it('should not show sign in on Rich Profile Page', () => {
            isRichProfilePageStub.and.returnValue(true);
            userUtils.forceSignIn();
            expect(requireAuthenticationSpy).not.toHaveBeenCalled();
        });

        it('should not show sign in on Preview Settings Page', () => {
            isPreviewSettingsStub.and.returnValue(true);
            userUtils.forceSignIn();
            expect(requireAuthenticationSpy).not.toHaveBeenCalled();
        });

        it('should not show sign in on Vendor Login Page', () => {
            isVendorLoginPageStub.and.returnValue(true);
            userUtils.forceSignIn();
            expect(requireAuthenticationSpy).not.toHaveBeenCalled();
        });

        it('should not show sign in for Vendor Generic Logins', () => {
            isVendorGenericLogin.and.returnValue(true);
            userUtils.forceSignIn();
            expect(requireAuthenticationSpy).not.toHaveBeenCalled();
        });

        describe('for 1st page load', () => {
            beforeEach(() => {
                storageItems[LOCAL_STORAGE.PAGE_DISPLAY_COUNT] = 0;
            });

            it('should show sign in modal', () => {
                userUtils.forceSignIn();
                expect(requireAuthenticationSpy).toHaveBeenCalled();
            });

            it('should increase the pageDisplayCount to 1', () => {
                userUtils.forceSignIn();
                expect(setItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.PAGE_DISPLAY_COUNT, 1);
            });
        });
    });
});
