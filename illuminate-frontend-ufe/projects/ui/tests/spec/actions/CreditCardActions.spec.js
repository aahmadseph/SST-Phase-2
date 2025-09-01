const { clock /*, createSpy*/ } = jasmine;
const Locale = require('utils/LanguageLocale').default;
const Storage = require('utils/localStorage/Storage').default;
const userUtils = require('utils/User').default;
const { CREDIT_CARD_REALTIME_PRESCREEN, CREDIT_CARD_TARGETERS } = require('utils/localStorage/Constants').default;
const { PRESCREEN_USER_RESPONSES } = require('constants/CreditCard');
const CreditCardActions = require('actions/CreditCardActions').default;
const CREDIT_CARD_TARGETERS_CACHE_TIME = Storage.MINUTES * 10;
const config = {};
config.cache = {
    key: CREDIT_CARD_TARGETERS,
    expiry: CREDIT_CARD_TARGETERS_CACHE_TIME
};

describe('CreditCardActions', () => {
    describe('handleRealtimePrescreen', () => {
        const profileId = '123';

        it('does nothing when not US', () => {
            // Arrange
            spyOn(Locale, 'isUS').and.returnValues(false);
            spyOn(Storage.local, 'getItem').and.returnValues(null);
            spyOn(CreditCardActions, 'makeRealtimePrescreenCall');

            // Act
            CreditCardActions.handleRealtimePrescreen(profileId, {}, false);

            // Assert
            expect(CreditCardActions.makeRealtimePrescreenCall).not.toHaveBeenCalled();
        });

        describe('when in US', () => {
            beforeEach(() => {
                spyOn(Locale, 'isUS').and.returnValues(true);
            });

            describe('when initiating the process', () => {
                let updateStorageSpy;

                beforeEach(() => {
                    spyOn(Storage.local, 'getItem').and.returnValues(null);
                    updateStorageSpy = spyOn(CreditCardActions, 'updateStorage');
                });

                it('does nothing when ccAccountandPrescreenInfo is empty', () => {
                    CreditCardActions.handleRealtimePrescreen(profileId, {});

                    expect(updateStorageSpy).not.toHaveBeenCalled();
                });

                it('does nothing when realTimePrescreenInProgress is false', () => {
                    CreditCardActions.handleRealtimePrescreen(profileId, { realTimePrescreenInProgress: false });

                    expect(updateStorageSpy).not.toHaveBeenCalled();
                });

                it('calls updateStorage when realTimePrescreenInProgress is true', () => {
                    CreditCardActions.handleRealtimePrescreen(profileId, { realTimePrescreenInProgress: true });

                    expect(updateStorageSpy).toHaveBeenCalledWith(CREDIT_CARD_REALTIME_PRESCREEN, {
                        count: 0,
                        inProgress: true
                    });
                });
            });

            it('when process has been initiated but userResponse exists does not call makeRealtimePrescreenCall', () => {
                // Arrange
                spyOn(Storage.local, 'getItem').and.returnValues({
                    userResponse: PRESCREEN_USER_RESPONSES.ACCEPTED,
                    inProgress: true
                });
                spyOn(CreditCardActions, 'makeRealtimePrescreenCall');

                // Act
                CreditCardActions.handleRealtimePrescreen(profileId);

                // Assert
                expect(CreditCardActions.makeRealtimePrescreenCall).not.toHaveBeenCalled();
            });

            it('when process has been initiated but inProgress is false does not call makeRealtimePrescreenCall', () => {
                // Arrange
                spyOn(Storage.local, 'getItem').and.returnValues({ inProgress: false });
                spyOn(CreditCardActions, 'makeRealtimePrescreenCall');

                // Act
                CreditCardActions.handleRealtimePrescreen(profileId);

                // Assert
                expect(CreditCardActions.makeRealtimePrescreenCall).not.toHaveBeenCalled();
            });

            it('when process has been initiated and it is the first call does not call makeRealtimePrescreenCall', () => {
                // Arrange
                spyOn(Storage.local, 'getItem').and.returnValues({
                    inProgress: true,
                    count: 0
                });
                spyOn(CreditCardActions, 'makeRealtimePrescreenCall');

                // Act
                CreditCardActions.handleRealtimePrescreen(profileId);

                // Assert
                expect(CreditCardActions.makeRealtimePrescreenCall).toHaveBeenCalledWith(profileId, 1);
            });

            describe('when process has been initiated and it is the second call', () => {
                beforeEach(() => {
                    clock().install();
                });

                afterEach(() => {
                    clock().uninstall();
                });

                it('but interval is not met calls makeRealtimePrescreenCall', () => {
                    // Arrange
                    const timestamp = 1234567890;
                    clock().mockDate(new Date(1234567890));
                    spyOn(Storage.local, 'getItem').and.returnValues({
                        inProgress: true,
                        count: 1,
                        timestamp: timestamp + 15000 // 15 seconds later
                    });
                    spyOn(CreditCardActions, 'makeRealtimePrescreenCall');

                    // Act
                    CreditCardActions.handleRealtimePrescreen(profileId, {}, true);

                    // Assert
                    expect(CreditCardActions.makeRealtimePrescreenCall).not.toHaveBeenCalled();
                });

                it('but call count is exceeded calls makeRealtimePrescreenCall', () => {
                    // Arrange
                    const timestamp = 1234567890;
                    clock().mockDate(new Date(1234567890));
                    spyOn(Storage.local, 'getItem').and.returnValues({
                        inProgress: true,
                        count: 3,
                        timestamp: timestamp + 35000 // 35 seconds later
                    });
                    spyOn(CreditCardActions, 'makeRealtimePrescreenCall');

                    // Act
                    CreditCardActions.handleRealtimePrescreen(profileId);

                    // Assert
                    expect(CreditCardActions.makeRealtimePrescreenCall).not.toHaveBeenCalled();
                });

                it('and we can make another call calls makeRealtimePrescreenCall', () => {
                    // Arrange
                    const timestamp = 1234567890;
                    clock().mockDate(new Date(1234567890));
                    spyOn(Storage.local, 'getItem').and.returnValues({
                        inProgress: true,
                        count: 1,
                        timestamp: timestamp + 35000 // 35 seconds later
                    });
                    spyOn(CreditCardActions, 'makeRealtimePrescreenCall');

                    // Act
                    CreditCardActions.handleRealtimePrescreen(profileId, {}, true);

                    // Assert
                    expect(CreditCardActions.makeRealtimePrescreenCall).toHaveBeenCalledWith(profileId, 2);
                });
            });
        });
    });

    // TODO: inject-loader is not supported anymore
    // describe('makeRealtimePrescreenCall and succeeds while in progress', () => {
    //     const profileId = '123';
    //     const response = {
    //         response: true,
    //         preScreenProcessStatus: 'In Progress'
    //     };
    //     let getRealtimePreScreenDetails, creditCardActions, updateLightweightCallDetailsSpy;

    //     beforeEach(() => {
    //         getRealtimePreScreenDetails = createSpy().and.returnValue(Promise.resolve(response));
    //         const load = require('inject-loader!actions/CreditCardActions');
    //         creditCardActions = load({ 'services/api/profile/getRealtimePreScreenDetails': getRealtimePreScreenDetails });

    //         updateLightweightCallDetailsSpy = spyOn(creditCardActions, 'updateLightweightCallDetails');
    //     });

    //     it('calls getRealtimePreScreenDetails', () => {
    //         creditCardActions.makeRealtimePrescreenCall(profileId);

    //         expect(getRealtimePreScreenDetails).toHaveBeenCalledWith(profileId);
    //     });

    //     it('calls updateLightweightCallDetails', done => {
    //         creditCardActions.makeRealtimePrescreenCall(profileId, 1).then(() => {
    //             expect(updateLightweightCallDetailsSpy).toHaveBeenCalledWith({
    //                 count: 1,
    //                 inProgress: true,
    //                 response
    //             });
    //             done();
    //         });
    //     });
    // });

    // TODO: inject-loader is not supported anymore
    // it('makeRealtimePrescreenCall and succeeds while not in progress calls updateLightweightCallDetails', done => {
    //     // Arrange
    //     const response = {
    //         response: true,
    //         preScreenProcessStatus: 'Completed'
    //     };
    //     const getRealtimePreScreenDetails = createSpy().and.returnValue(Promise.resolve(response));
    //     const load = require('inject-loader!actions/CreditCardActions');
    //     const creditCardActions = load({ 'services/api/profile/getRealtimePreScreenDetails': getRealtimePreScreenDetails });
    //     const updateLightweightCallDetailsSpy = spyOn(creditCardActions, 'updateLightweightCallDetails');

    //     // Act
    //     const apiCall = creditCardActions.makeRealtimePrescreenCall('123', 1);

    //     // Assert
    //     apiCall.then(() => {
    //         expect(updateLightweightCallDetailsSpy).toHaveBeenCalledWith({
    //             count: 1,
    //             inProgress: false,
    //             response
    //         });
    //         done();
    //     });
    // });

    // TODO: inject-loader is not supported anymore
    // it('makeRealtimePrescreenCall and fails calls updateLightweightCallDetails', done => {
    //     // Arrange
    //     // eslint-disable-next-line prefer-promise-reject-errors
    //     const getRealtimePreScreenDetails = createSpy().and.returnValue(Promise.reject({}));
    //     const load = require('inject-loader!actions/CreditCardActions');
    //     const creditCardActions = load({ 'services/api/profile/getRealtimePreScreenDetails': getRealtimePreScreenDetails });
    //     const updateLightweightCallDetailsSpy = spyOn(creditCardActions, 'updateLightweightCallDetails');

    //     // Act
    //     const apiCall = creditCardActions.makeRealtimePrescreenCall('123', 1);

    //     // Assert
    //     apiCall.finally(() => {
    //         expect(updateLightweightCallDetailsSpy).toHaveBeenCalledWith({ count: 1 });
    //         done();
    //     });
    // });

    describe('updateLightweightCallDetails', () => {
        const timestamp = 1234567890;

        beforeEach(() => {
            clock().install();
        });

        afterEach(() => {
            clock().uninstall();
        });

        it('calls updateStorage', () => {
            // Arrange
            clock().mockDate(new Date(timestamp));
            const updateStorageSpy = spyOn(CreditCardActions, 'updateStorage');

            // Act
            CreditCardActions.updateLightweightCallDetails({ count: 1 });

            // Assert
            expect(updateStorageSpy).toHaveBeenCalledWith(CREDIT_CARD_REALTIME_PRESCREEN, {
                count: 1,
                timestamp
            });
        });
    });

    // TODO: inject-loader is not supported anymore
    // describe('captureRealtimePrescreenUserResponse', () => {
    //     const profileId = '123';
    //     const userResponse = PRESCREEN_USER_RESPONSES.ACCEPTED;
    //     let stubbedUserUtils, stubbedUpdateBiAccount, creditCardActions;

    //     beforeEach(() => {
    //         stubbedUserUtils = { getProfileId: createSpy().and.returnValue(profileId) };
    //     });

    //     it('when making the call calls updateBiAccount', () => {
    //         // Arrange
    //         stubbedUpdateBiAccount = createSpy().and.returnValue(Promise.resolve({ responseStatus: 200 }));
    //         const load = require('inject-loader!actions/CreditCardActions');
    //         creditCardActions = load({
    //             'services/api/beautyInsider/updateBiAccount': stubbedUpdateBiAccount,
    //             'utils/User': stubbedUserUtils
    //         });

    //         // Act
    //         creditCardActions.captureRealtimePrescreenUserResponse(userResponse);

    //         // Assert
    //         expect(stubbedUpdateBiAccount).toHaveBeenCalledWith({
    //             profileId,
    //             biAccount: { prescreenCustomerResponse: userResponse }
    //         });
    //     });

    //     it('when the response is successful calls updateStorage if updateBiAccount is successful', done => {
    //         // Arrange
    //         stubbedUpdateBiAccount = createSpy().and.returnValue(Promise.resolve({ responseStatus: 200 }));
    //         const load = require('inject-loader!actions/CreditCardActions');
    //         creditCardActions = load({
    //             'services/api/beautyInsider/updateBiAccount': stubbedUpdateBiAccount,
    //             'utils/User': stubbedUserUtils
    //         });
    //         const updateStorageSpy = spyOn(creditCardActions, 'updateStorage');

    //         // Act
    //         const apiCall = creditCardActions.captureRealtimePrescreenUserResponse(userResponse);

    //         // Assert
    //         apiCall.then(() => {
    //             expect(updateStorageSpy).toHaveBeenCalledWith(CREDIT_CARD_REALTIME_PRESCREEN, { userResponse });
    //             done();
    //         });
    //     });

    //     it('when the response is not successful calls updateStorage if updateBiAccount is successful', done => {
    //         // Arrange
    //         stubbedUpdateBiAccount = createSpy().and.returnValue(Promise.resolve({ responseStatus: 500 }));
    //         const load = require('inject-loader!actions/CreditCardActions');
    //         creditCardActions = load({
    //             'services/api/beautyInsider/updateBiAccount': stubbedUpdateBiAccount,
    //             'utils/User': stubbedUserUtils
    //         });
    //         spyOn(creditCardActions, 'updateStorage');

    //         // Act
    //         const apiCall = creditCardActions.captureRealtimePrescreenUserResponse(userResponse);

    //         // Assert
    //         apiCall.catch(() => {
    //             expect(creditCardActions.updateStorage).not.toHaveBeenCalled();
    //             done();
    //         });
    //     });
    // });

    it('updateStorage sets to the local storage', () => {
        // Arrange
        const userResponse = PRESCREEN_USER_RESPONSES.ACCEPTED;
        const response = { response: true };
        spyOn(Storage.local, 'getItem').and.returnValues(response);
        const setItem = spyOn(Storage.local, 'setItem');

        // Act
        CreditCardActions.updateStorage(CREDIT_CARD_REALTIME_PRESCREEN, { userResponse });

        // Assert
        expect(setItem).toHaveBeenCalledWith(
            CREDIT_CARD_REALTIME_PRESCREEN,
            {
                ...response,
                userResponse
            },
            userUtils.USER_DATA_EXPIRY
        );
    });

    // TODO: inject-loader is not supported anymore
    // describe('getCreditCardTargeters method', () => {
    //     let profileApi;
    //     let getTargetersContentStub;
    //     let stubbedStorage;
    //     let creditCardActions;
    //     let CC_BASKET_TARGETER;
    //     let CC_INLINE_BASKET_TARGETER;
    //     let CC_CHECKOUT_TARGETER;
    //     let successResponse;
    //     let storageResponse;
    //     let failureResponse;
    //     let dispatchMethod;
    //     let params;
    //     let load;

    //     beforeEach(() => {
    //         profileApi = require('services/api/profile/index');
    //         CC_BASKET_TARGETER = '/atg/registry/RepositoryTargeters/Sephora/CCDynamicMessagingBasketTargeter';
    //         CC_INLINE_BASKET_TARGETER = '/atg/registry/RepositoryTargeters/Sephora/CCDynamicMessagingInlineBasketTargeter';
    //         CC_CHECKOUT_TARGETER = '/atg/registry/RepositoryTargeters/Sephora/CCDynamicMessagingCheckoutTargeter';
    //         storageResponse = {};
    //         stubbedStorage = {
    //             local: {
    //                 getItem: createSpy().and.returnValue(storageResponse),
    //                 setItem: createSpy()
    //             }
    //         };
    //         successResponse = {
    //             responseStatus: 200,
    //             targeterResult: {
    //                 [CC_BASKET_TARGETER]: 'CC_BASKET_TARGETER',
    //                 [CC_INLINE_BASKET_TARGETER]: 'CC_INLINE_BASKET_TARGETER',
    //                 [CC_CHECKOUT_TARGETER]: 'CC_CHECKOUT_TARGETER'
    //             }
    //         };
    //         params = [CC_BASKET_TARGETER, CC_INLINE_BASKET_TARGETER, CC_CHECKOUT_TARGETER];
    //         failureResponse = {};
    //         dispatchMethod = e => e;
    //         load = require('inject-loader!actions/CreditCardActions');
    //         creditCardActions = load({ 'utils/localStorage/Storage': stubbedStorage });
    //     });

    //     it('should request CC Targeters from API', () => {
    //         getTargetersContentStub = spyOn(profileApi, 'getTargetersContent').and.returnValue(Promise.resolve(successResponse));
    //         creditCardActions.getCreditCardTargeters()(dispatchMethod);
    //         expect(getTargetersContentStub).toHaveBeenCalledWith(params, { ...config, cache: { ...config.cache, invalidate: false } });
    //     });

    //     it('should return API response even if it failed', () => {
    //         // Arrange
    //         getTargetersContentStub = spyOn(profileApi, 'getTargetersContent').and.returnValue(Promise.reject(failureResponse));

    //         // Act
    //         const apiCall = creditCardActions.getCreditCardTargeters()(dispatchMethod);

    //         // Assert
    //         apiCall.catch(response => {
    //             expect(response).toEqual(failureResponse);
    //         });
    //     });
    // });
});
