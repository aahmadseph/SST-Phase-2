const Location = require('utils/Location').default;
const PageTemplateType = require('constants/PageTemplateType').default;
const {
    ACTION_TYPES: { UPDATE_CURRENT_LOCATION }
} = require('reducers/framework/historyLocation').default;
const { createSpy, objectContaining } = jasmine;

describe('Location', () => {
    let originalLocation;
    const locationVersions = ['frontend', 'backend'];

    describe('getLocation', () => {
        beforeEach(() => {
            Sephora.location = { pathname: '/ca/en/basket' };
        });

        it('should not sanitizePathname by default', () => {
            expect(Location.getLocation()).toEqual({ pathname: '/ca/en/basket' });
        });

        it('should sanitizePathname if passed true', () => {
            expect(Location.getLocation(true)).toEqual({ pathname: '/basket' });
        });
    });

    const setLocation = (version, value) => {
        if (version !== 'frontend') {
            originalLocation = Sephora.location;
            Sephora.location = value;
        }

        spyOn(Location, 'getLocation').and.returnValue(value);
    };

    const restoreLocation = version => {
        if (version !== 'frontend') {
            Sephora.location = originalLocation;
        }
    };

    using('Version', locationVersions, version => {
        describe('Basket', function () {
            using(
                'Path',
                [
                    {
                        type: 'old full site',
                        location: { pathname: '/basket' }
                    },
                    {
                        type: 'current ufe',
                        location: { pathname: '/basket' }
                    },
                    {
                        type: 'old mobile web',
                        location: { pathname: '/basket' }
                    }
                ],
                config => {
                    it('should check if the page is basket on ' + version + ' if basket is ' + config.type, function () {
                        setLocation(version, config.location);
                        expect(Location.isBasketPage()).toBeTruthy();
                    });
                }
            );

            afterEach(function () {
                restoreLocation(version);
            });
        });

        describe('isGalleryPage function', function () {
            it('should return true if the page is a Gallery page', () => {
                Sephora.pagePath = PageTemplateType.Gallery;
                expect(Location.isGalleryPage()).toBeTruthy();
            });

            it('should return false if the page is not a Gallery page', () => {
                Sephora.pagePath = 'other path';
                expect(Location.isGalleryPage()).toBeFalsy();
            });

            it('should return true if the page is the new rwd gallery page', () => {
                Sephora.pagePath = PageTemplateType.GalleryPage;
                expect(Location.isGalleryPage()).toBeTruthy();
            });
        });
    });

    using(
        'Rich Profile Path',
        [
            {
                message: 'My Profile',
                location: { pathname: '/profile/me' }
            },
            {
                message: 'Beauty Insider',
                location: { pathname: '/profile/BeautyInsider' }
            },
            {
                message: 'My account information',
                location: { pathname: '/profile/MyAccount/Subscriptions' }
            },
            {
                message: 'Lists',
                location: { pathname: '/profile/Lists' }
            }
        ],
        ({ message, location }) => {
            it(`should check if the page is rich profile and page is ${message}`, () => {
                // Arrange
                spyOn(Location, 'getLocation').and.returnValue(location);

                // Act
                const result = Location.isRichProfilePage();

                // Assert
                expect(result).toBeTruthy();
            });
        }
    );

    using('My Profile Path', [{ location: { pathname: '/profile/me' } }], ({ location }) => {
        it('should check if the page is my profile', () => {
            // Arrange
            spyOn(Location, 'getLocation').and.returnValue(location);

            // Act
            const result = Location.isMyProfilePage();

            // Assert
            expect(result).toBeTruthy();
        });
    });

    using(
        'Gallery Album Path',
        [
            {
                message: 'simple',
                location: { pathname: '/gallery/album/' }
            },
            {
                message: 'full with id',
                location: { pathname: 'dfgh/gallery/album/wefgsdfg' }
            }
        ],
        ({ message, location }) => {
            it(`should check if the page is gallery album and album is ${message}`, () => {
                // Arrange
                spyOn(Location, 'getLocation').and.returnValue(location);

                // Act
                const result = Location.isGalleryAlbumPage();

                // Assert
                expect(result).toBeTruthy();
            });
        }
    );

    using(
        'My Profile Gallery Path',
        [
            {
                type: 'simple',
                location: { pathname: '/myprofile' }
            },
            {
                type: 'photos',
                location: { pathname: '/myprofile/photos' }
            },
            {
                type: 'relative photos',
                location: { pathname: '/gallery/myprofile/photos' }
            },
            {
                type: 'loved',
                location: { pathname: '/gallery/myprofile/loved' }
            }
        ],
        ({ message, location }) => {
            it(`should check if the profile is on if profile is ${message}`, () => {
                // Arrange
                spyOn(Location, 'getLocation').and.returnValue(location);

                // Act
                const result = Location.isGalleryProfilePage();

                // Assert
                expect(result).toBeTruthy();
            });
        }
    );

    it('isProd should return false for non-production locations', () => {
        // Arrange
        spyOn(Location, 'getLocation').and.returnValue({ href: 'true-qts11-preview.sephora.com' });

        // Act
        const result = Location.isProd();

        // Assert
        expect(result).toBeFalsy();
    });

    it('isProd should return true for production locations', () => {
        // Arrange
        spyOn(Location, 'getLocation').and.returnValue({ href: 'www.sephora.com' });

        // Act
        const result = Location.isProd();

        // Assert
        expect(result).toBeTruthy();
    });

    it('isProd should return true for mweb production locations', () => {
        // Arrange
        spyOn(Location, 'getLocation').and.returnValue({ href: 'm.sephora.com' });

        // Act
        const result = Location.isProd();

        // Assert
        expect(result).toBeTruthy();
    });

    describe('is beauty insider', () => {
        it('should return true if the page is beauty insider', () => {
            Sephora.pagePath = PageTemplateType.BeautyInsider;
            expect(Location.isBIPage()).toBeTruthy();
        });

        it('should return false if the page is not beauty insider', () => {
            Sephora.pagePath = 'other path';
            expect(Location.isBIPage()).toBeFalsy();
        });
    });

    describe('isReferrerPage method', () => {
        it('should return true if the page is a referrer page', () => {
            Sephora.location = { pathname: '/share/123/abc' };
            expect(Location.isReferrerPage()).toBeTruthy();
        });

        it('should return true if the page is a referrer page', () => {
            Sephora.location = { pathname: '/share/abc' };
            expect(Location.isReferrerPage()).toBeTruthy();
        });

        it('should return false if the page is not referrer page', () => {
            Sephora.location = { pathname: '/other' };
            expect(Location.isReferrerPage()).toBeFalsy();
        });

        it('should return false if the page is not referrer page', () => {
            Sephora.location = { pathname: '/shar/share' };
            expect(Location.isReferrerPage()).toBeFalsy();
        });
    });

    describe('navigateTo', () => {
        let LocaleUtils;
        let SpaUtils;
        let HistoryActions;
        let Store;

        beforeEach(() => {
            Store = require('store/Store').default;
            LocaleUtils = require('utils/LanguageLocale').default;
            SpaUtils = require('utils/Spa').default;
            HistoryActions = require('actions/framework/HistoryLocationActions').default;
        });

        it('should not invoke preventDefault for none SPA navigation and call setLocation', () => {
            // Arrange
            spyOn(SpaUtils, 'isSpaNavigation').and.returnValue(false);
            spyOn(Location, 'setLocation').and.callFake(() => {});
            const event = { preventDefault: createSpy('preventDefault') };
            const location = { path: '' };

            // Act
            Location.navigateTo(event, location);

            // Assert
            expect(event.preventDefault).not.toHaveBeenCalled();
            expect(Location.setLocation).toHaveBeenCalled();
        });

        it('should invoke preventDefault when SPA navigation', () => {
            // Arrange
            spyOn(SpaUtils, 'isSpaNavigation').and.returnValue(true);
            spyOn(HistoryActions, 'goTo').and.returnValue({});
            spyOn(Store, 'dispatch');
            const event = { preventDefault: createSpy('preventDefault') };
            const location = { path: 'path' };

            // Act
            Location.navigateTo(event, location);

            // Assert
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should dispatch "goTo" action', () => {
            // Arrange
            spyOn(SpaUtils, 'isSpaNavigation').and.returnValue(true);
            const event = { preventDefault: () => {} };
            const location = { path: '/path' };
            const dispatch = spyOn(Store, 'dispatch');
            const goToAction = {
                type: UPDATE_CURRENT_LOCATION,
                location: objectContaining({ path: `${location.path}` })
            };
            spyOn(HistoryActions, 'goTo').and.returnValue(goToAction);

            // Act
            Location.navigateTo(event, location);

            // Assert
            expect(dispatch).toHaveBeenCalledWith(goToAction);
        });

        it('should prepend URL with "/ca/en" prefix for "Canada - English" locale', () => {
            // Arrange
            Sephora.isSEOForCanadaEnabled = true;
            spyOn(SpaUtils, 'isSpaNavigation').and.returnValue(true);
            spyOn(LocaleUtils, 'isCanada').and.returnValue(true);
            spyOn(LocaleUtils, 'isFrench').and.returnValue(false);
            const event = { preventDefault: () => {} };
            const location = { path: '/product/' };
            const dispatch = spyOn(Store, 'dispatch');
            const goToAction = {
                type: UPDATE_CURRENT_LOCATION,
                location: objectContaining({ path: `/ca/en${location.path}` })
            };
            spyOn(HistoryActions, 'goTo').and.returnValue(goToAction);

            // Act
            Location.navigateTo(event, location);

            // Assert
            expect(dispatch).toHaveBeenCalledWith(goToAction);
        });

        it('should prepend URL with "/ca/fr" prefix for "Canada - Français" locale', () => {
            // Arrange
            Sephora.isSEOForCanadaEnabled = true;
            spyOn(SpaUtils, 'isSpaNavigation').and.returnValue(true);
            spyOn(LocaleUtils, 'isCanada').and.returnValue(true);
            spyOn(LocaleUtils, 'isFrench').and.returnValue(true);
            const event = { preventDefault: () => {} };
            const location = { path: '/brand/' };
            const dispatch = spyOn(Store, 'dispatch');
            const goToAction = {
                type: UPDATE_CURRENT_LOCATION,
                location: objectContaining({ path: `/ca/fr${location.path}` })
            };
            spyOn(HistoryActions, 'goTo').and.returnValue(goToAction);

            // Act
            Location.navigateTo(event, location);

            // Assert
            expect(dispatch).toHaveBeenCalledWith(goToAction);
        });
    });
});
