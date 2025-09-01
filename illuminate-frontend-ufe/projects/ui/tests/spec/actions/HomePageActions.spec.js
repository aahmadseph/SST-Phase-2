const { createSpy } = jasmine;

describe('HomePageActions', () => {
    beforeEach(() => {
        Sephora.renderQueryParams = {
            country: 'US',
            channel: 'rwd',
            language: 'en'
        };
    });

    describe('render isNewPage', () => {
        const HomepageActions = require('actions/HomepageActions').default;

        const newLocation = {
            newPath: 'https://local.sephora.com'
        };
        let previousLocation, newPage;

        it('should return true if its a new page', () => {
            previousLocation = {
                prevPath: 'https://local.sephora.com/buy/touch-up-sticks'
            };

            newPage = HomepageActions.isNewPage({
                newLocation,
                previousLocation
            });

            expect(newPage).toBeTruthy();
        });

        it('should return false if its not a new page', () => {
            previousLocation = {
                prevPath: 'https://local.sephora.com'
            };

            newPage = HomepageActions.isNewPage({
                newLocation,
                previousLocation
            });

            expect(newPage).toBeFalsy();
        });
    });

    // TODO: inject-loader is not supported anymore
    // describe('render openPage', () => {
    //     let getContent, homepageActions, load, dispatch;

    //     beforeEach(() => {
    //         dispatch = createSpy();
    //         load = require('inject-loader!actions/HomepageActions');
    //     });

    //     const response = {
    //         data: 'test response'
    //     };
    //     const failureReponse = {
    //         data: 'failed api call'
    //     };

    //     it('should call getContent with correct arguments', () => {
    //         getContent = createSpy().and.returnValue(Promise.resolve(response));
    //         homepageActions = load({ 'services/api/Content/getContent': { getContent } });

    //         homepageActions.openPage({
    //             events: {
    //                 onDataLoaded: () => {},
    //                 onPageUpdated: () => {}
    //             }
    //         })(dispatch);

    //         expect(getContent).toHaveBeenCalledWith({
    //             country: 'US',
    //             language: 'en',
    //             path: '/home'
    //         });
    //     });

    //     it('should return error on API failure', () => {
    //         getContent = createSpy().and.returnValue(Promise.reject(failureReponse));
    //         homepageActions = load({ 'services/api/Content/getContent': { getContent } });

    //         const apiResponse = homepageActions.openPage({ events: {} })(dispatch);

    //         apiResponse.catch(error => {
    //             expect(error).toEqual(failureReponse);
    //         });
    //     });
    // });

    describe('fetch P13N data function', () => {
        let homepageActions;
        let getP13nDataStub;
        let getP13nNbcDataStub;
        let getContextIdsToUpdateStub;

        beforeEach(() => {
            const p13nAPI = require('services/api/p13n').default;
            getP13nDataStub = spyOn(p13nAPI, 'getP13nData');
            getP13nNbcDataStub = spyOn(p13nAPI, 'getP13nNbcData');
            const p13nUtils = require('utils/localStorage/P13n').default;
            getContextIdsToUpdateStub = spyOn(p13nUtils, 'getContextIdsToUpdate');
            homepageActions = require('actions/HomepageActions').default;
        });

        it('should call getP13nData', () => {
            // Arrange
            getP13nDataStub.and.callFake(() => ({ then: () => ({ catch: () => {} }) }));
            getContextIdsToUpdateStub.and.returnValue({ p13nContextIds: ['123'] });
            const {
                PROFILE_STATUS: { LOGGED_IN }
            } = require('utils/User').default;
            Sephora.renderQueryParams = {
                country: 'US',
                channel: 'rwd',
                language: 'en'
            };
            const { channel, country, language } = Sephora.renderQueryParams;
            const getP13nDataParams = {
                channel,
                country,
                language,
                atgId: '123',
                biId: undefined,
                contextEntryIds: ['123'],
                zipCode: ''
            };
            const state = {
                user: {
                    profileId: getP13nDataParams.atgId,
                    isInitialized: true
                },
                auth: {
                    profileStatus: LOGGED_IN
                },
                p13n: { isInitialized: false }
            };
            const dispatchStub = createSpy('dispatch');
            const getStateStub = createSpy('getState').and.returnValue(state);

            // Act
            homepageActions.getPersonalizedEnabledComponents()(dispatchStub, getStateStub);

            // Assert
            expect(getP13nDataStub).toHaveBeenCalledWith(getP13nDataParams);
        });

        it('should mark p13n as initialized when contextEntryIds is empty array', async () => {
            // Arrange
            getContextIdsToUpdateStub.and.returnValue(getContextIdsToUpdateStub.and.returnValue({ p13nContextIds: [] }));
            const {
                PROFILE_STATUS: { LOGGED_IN }
            } = require('utils/User').default;
            const state = {
                user: {
                    atgId: '123',
                    isInitialized: true
                },
                auth: {
                    profileStatus: LOGGED_IN
                },
                p13n: { isInitialized: false }
            };
            const dispatchStub = createSpy('dispatch');
            const getStateStub = createSpy('getState').and.returnValue(state);
            const actionStub = homepageActions.setP13NInitialization(true);

            // Act
            await homepageActions.getPersonalizedEnabledComponents()(dispatchStub, getStateStub);

            // Assert
            expect(dispatchStub).toHaveBeenCalledWith(actionStub);
        });

        it('should return undefined if atgId is null', async () => {
            // Arrange
            getContextIdsToUpdateStub.and.returnValue({ p13nContextIds: ['123'] });
            const {
                PROFILE_STATUS: { LOGGED_IN }
            } = require('utils/User').default;
            const state = {
                user: {
                    isInitialized: true
                },
                auth: {
                    profileStatus: LOGGED_IN
                },
                p13n: { isInitialized: false }
            };
            const dispatchStub = createSpy('dispatch');
            const getStateStub = createSpy('getState').and.returnValue(state);

            // Act
            const result = await homepageActions.getPersonalizedEnabledComponents()(dispatchStub, getStateStub);

            // Assert
            expect(result).toEqual(undefined);
        });

        it('should call getP13nNbcData', () => {
            // Arrange
            getP13nNbcDataStub.and.callFake(() => ({ then: () => ({ catch: () => {} }) }));
            getContextIdsToUpdateStub.and.returnValue({ nbcContextIds: ['123_NBC'] });
            const {
                PROFILE_STATUS: { LOGGED_IN }
            } = require('utils/User').default;
            Sephora.renderQueryParams = {
                country: 'US',
                channel: 'rwd',
                language: 'en'
            };
            const { channel, country, language } = Sephora.renderQueryParams;
            const getP13nNbcDataParams = {
                channel,
                country,
                language,
                atgId: '123',
                contextEntryIds: ['123_NBC'],
                zipCode: ''
            };
            const state = {
                user: {
                    profileId: getP13nNbcDataParams.atgId,
                    isInitialized: true
                },
                auth: {
                    profileStatus: LOGGED_IN
                },
                p13n: { isInitialized: false }
            };
            const dispatchStub = createSpy('dispatch');
            const getStateStub = createSpy('getState').and.returnValue(state);

            // Act
            homepageActions.getPersonalizedEnabledComponents()(dispatchStub, getStateStub);

            // Assert
            expect(getP13nNbcDataStub).toHaveBeenCalledWith(getP13nNbcDataParams);
        });
    });
});
