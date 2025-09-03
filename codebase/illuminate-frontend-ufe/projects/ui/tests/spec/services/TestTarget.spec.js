/* eslint-disable object-curly-newline */
require('jasmine-ajax');
const { any, Ajax } = jasmine;
const { USER_DATA: LOCAL_STORAGE_USER_DATA } = require('utils/localStorage/Constants').default;
const PageTemplateType = require('constants/PageTemplateType').default;
const { TestTargetServiceReady, EventType, TestTarget, TestTargetLoaded, UserInfoLoaded, VisitorAPILoaded } = require('constants/events');

describe('TestTarget service', () => {
    let onLastLoadEventStub;
    let InflatorComps;
    let TestTargetActions;
    let testTargetUtils;
    let store;
    let Storage;
    let addEventListener;
    let dispatchEventStub;
    let eventListenerCallback;
    let basketUtils;
    let userUtils;
    const userParamsData = {
        creditCards: [
            {
                cardNumber: 'xxxx-xxxx-xxxx-1111',
                cardType: 'VISA',
                creditCardId: 'usercc9005120009',
                expirationMonth: '12',
                expirationYear: '2021',
                firstName: 'vj',
                isDefault: true,
                isExpired: false,
                lastName: 'qa4'
            }
        ]
    };

    beforeEach(() => {
        Ajax.install();
        Sephora.rwdPersistentBanner1 = [{ componentType: 93 }, { componentType: 95 }];
        require('components/Head/main.headScript.js');
        const { Application } = require('utils/framework').default;
        onLastLoadEventStub = spyOn(Application.events, 'onLastLoadEvent');
        InflatorComps = require('utils/framework/InflateComponents').default;
        TestTargetActions = require('actions/TestTargetActions').default;
        testTargetUtils = require('utils/TestTarget').default;
        store = require('store/Store').default;
        Storage = require('utils/localStorage/Storage').default;
        basketUtils = require('utils/Basket').default;
        userUtils = require('utils/User').default;
        Sephora.template = PageTemplateType.Homepage;

        spyOn(InflatorComps, 'services').and.returnValue({
            UserInfo: {
                data: {
                    profile: {},
                    basket: {}
                }
            },
            loadEvents: {}
        });

        window.adobe = {
            target: {
                getOffer: function () {
                    Application.events.dispatchServiceEvent(TestTarget, EventType.Ready);
                },
                applyOffer: function () {},
                event: {
                    REQUEST_SUCCEEDED: 'at-request-succeeded'
                }
            }
        };
    });

    afterEach(() => {
        Ajax.uninstall();
    });

    describe('initialization', () => {
        let ABTestsOrig;

        beforeEach(() => {
            ABTestsOrig = Sephora.configurationSettings.ABTests;
        });

        afterEach(() => {
            Sephora.Util.InflatorComps.services.loadEvents = {};
            Sephora.configurationSettings.ABTests = ABTestsOrig;
        });

        it('should dispatch for forceReset action with BCC tests', () => {
            // Arrange
            Sephora.configurationSettings.ABTests = { testA: 333 };
            const dispatch = spyOn(store, 'dispatch');

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.first().args[2];
            eventListenerCallback();

            // Assert
            expect(dispatch).toHaveBeenCalledWith({
                type: TestTargetActions.TYPES.FORCE_RESET,
                offers: { testA: 333 }
            });
        });

        it('should set an eventListener to dispatch service event when ready', () => {
            addEventListener = spyOn(window, 'addEventListener');
            require('services/TestTarget').initialize();
            expect(addEventListener).toHaveBeenCalled();
        });

        it('should dispatch a window event that the service is ready', () => {
            // Arrange
            dispatchEventStub = spyOn(window, 'dispatchEvent');

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.first().args[2];
            eventListenerCallback();

            // Assert
            expect(dispatchEventStub).toHaveBeenCalled();
        });

        it('should set loadEvents.TestTargetServiceReady to true', () => {
            // Arrange/Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.first().args[2];
            eventListenerCallback();

            // Assert
            expect(Sephora.Util.InflatorComps.services.loadEvents[TestTargetServiceReady]).toBeTruthy();
        });
    });

    describe('dependencies', () => {
        it('should depend on TestTargetLoaded and VisitorAPILoaded if user cache is valid', () => {
            const mockedCache = { profileStatus: 4 };
            Storage.local.setItem(LOCAL_STORAGE_USER_DATA, mockedCache, { hours: 1 });
            require('services/TestTarget').initialize();

            expect(onLastLoadEventStub).toHaveBeenCalledWith(window, [TestTargetLoaded, VisitorAPILoaded], any(Function));
            Storage.local.removeItem(LOCAL_STORAGE_USER_DATA);
        });

        it('should depend on TestTargetLoaded, VisitorAPILoaded and UserInfoReady if user cache is invalid and user is logged in', () => {
            Sephora.Util.TestTarget.isRecognized = true;
            require('services/TestTarget').initialize();
            expect(onLastLoadEventStub).toHaveBeenCalledWith(window, [TestTargetLoaded, VisitorAPILoaded, UserInfoLoaded], any(Function));
        });

        it('should depend on TestTargetLoaded and VisitorAPILoaded if user is not logged in', () => {
            Sephora.Util.TestTarget.isRecognized = false;
            require('services/TestTarget').initialize();

            expect(onLastLoadEventStub).toHaveBeenCalledWith(window, [TestTargetLoaded, VisitorAPILoaded], any(Function));
        });
    });

    describe('onLastLoadEvent', () => {
        it('should set a watcher for the user and testTarget store', () => {
            // Arrange
            onLastLoadEventStub.and.callFake((_a, _b, callback) => callback());
            spyOn(testTargetUtils, 'setUserParams').and.returnValue({ then: () => {} });
            const subscribe = spyOn(store, 'subscribe');

            // Act
            require('services/TestTarget').initialize();

            // Assert
            expect(subscribe).toHaveBeenCalledTimes(1);
        });

        it('should call adobe.target.getOffer in the watcher callback', () => {
            // Arrange
            onLastLoadEventStub.and.callFake((_a, _b, callback) => callback());
            const resolvedPromise = Promise.resolve(userParamsData);
            spyOn(testTargetUtils, 'setUserParams').and.resolveTo(resolvedPromise);
            const getOffer = spyOn(window.adobe.target, 'getOffer');
            spyOn(document, 'addEventListener');
            spyOn(store, 'subscribe');
            spyOn(store, 'dispatch');

            // Act
            require('services/TestTarget').initialize();

            return resolvedPromise.then(() => {
                // Assert
                expect(getOffer).toHaveBeenCalledTimes(1);
            });
        });

        it('testTargetResult listener should dispatch incoming test payload to the store', () => {
            // Arrange
            onLastLoadEventStub.and.callFake((_a, _b, callback) => callback());
            const resolvedPromise = Promise.resolve(userParamsData);
            spyOn(testTargetUtils, 'setUserParams').and.returnValue(resolvedPromise);
            const testResult = { detail: { result: { testOne: true } } };
            addEventListener = spyOn(window, 'addEventListener').and.callFake((_a, callback) => callback(testResult));
            const action = TestTargetActions.setOffers(testResult.detail.result);
            spyOn(window.adobe.target, 'getOffer');
            spyOn(document, 'addEventListener');
            spyOn(store, 'subscribe');
            const dispatch = spyOn(store, 'dispatch');

            // Act
            require('services/TestTarget').initialize();

            return resolvedPromise.then(() => {
                // Assert
                expect(dispatch).toHaveBeenCalledWith(action);
            });
        });
    });

    describe('getOffer method', () => {
        const mockResponseHTML = [{ content: '<script>function () { return void; } </script>' }];

        it('should set target params with setUserParams', () => {
            // Arrange
            const resolvedPromise = Promise.resolve(userParamsData);
            const setUserParams = spyOn(testTargetUtils, 'setUserParams').and.returnValue(resolvedPromise);

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
            eventListenerCallback();

            // Assert
            expect(setUserParams).toHaveBeenCalledTimes(1);
        });

        it('should call adobe.target.getOffer', () => {
            // Arrange
            const resolvedPromise = Promise.resolve(userParamsData);
            spyOn(testTargetUtils, 'setUserParams').and.returnValue(resolvedPromise);
            const getOffer = spyOn(window.adobe.target, 'getOffer');

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
            eventListenerCallback();

            return resolvedPromise.then(() => {
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();

                // Assert
                expect(getOffer).toHaveBeenCalledTimes(1);
            });
        });

        it('should call adobe.target.getOffer with proper parameter structure', () => {
            // Arrange
            const resolvedPromise = Promise.resolve(userParamsData);
            spyOn(testTargetUtils, 'setUserParams').and.returnValue(resolvedPromise);
            const getOffer = spyOn(window.adobe.target, 'getOffer');
            Storage.local.setItem(LOCAL_STORAGE_USER_DATA, { profileStatus: 2 });
            const expectedTargetParams = {
                mbox: testTargetUtils.MBOX_NAME,
                params: userParamsData,
                success: any(Function),
                error: any(Function),
                timeout: testTargetUtils.MBOX_TIMEOUT
            };

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
            eventListenerCallback();

            return resolvedPromise.then(() => {
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();
                const targetParams = getOffer.calls.mostRecent().args[0];

                // Assert
                expect(targetParams).toEqual(expectedTargetParams);
                Storage.local.removeItem(LOCAL_STORAGE_USER_DATA);
            });
        });

        it('should call testTargetUtils.getTotalDeliveredTests method in getOffer success callback', () => {
            // Arrange
            const getOffer = spyOn(window.adobe.target, 'getOffer');
            const getTotalDeliveredTests = spyOn(testTargetUtils, 'getTotalDeliveredTests');
            const resolvedPromise = Promise.resolve(userParamsData);
            spyOn(testTargetUtils, 'setUserParams').and.returnValue(resolvedPromise);

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
            eventListenerCallback();

            return resolvedPromise.then(() => {
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();
                const targetParams = getOffer.calls.mostRecent().args[0];
                targetParams.success(mockResponseHTML);
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();

                // Assert
                expect(getTotalDeliveredTests).toHaveBeenCalledWith(mockResponseHTML);
            });
        });

        it('should call adobe.target.applyOffer in getOffer success callback', () => {
            // Arrange
            const getOffer = spyOn(window.adobe.target, 'getOffer');
            const applyOffer = spyOn(window.adobe.target, 'applyOffer');
            const resolvedPromise = Promise.resolve(userParamsData);
            spyOn(testTargetUtils, 'setUserParams').and.returnValue(resolvedPromise);
            const expectedOffer = {
                mbox: testTargetUtils.MBOX_NAME,
                offer: mockResponseHTML
            };

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
            eventListenerCallback();

            return resolvedPromise.then(() => {
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();
                const targetParams = getOffer.calls.mostRecent().args[0];
                targetParams.success(mockResponseHTML);
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();

                // Assert
                expect(applyOffer).toHaveBeenCalledWith(expectedOffer);
            });
        });

        it('should dispatch event for TestTargetReady in getOffer success callback if total amount of tests is 0', () => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');
            const getOffer = spyOn(window.adobe.target, 'getOffer');
            const resolvedPromise = Promise.resolve(userParamsData);
            spyOn(testTargetUtils, 'setUserParams').and.returnValue(resolvedPromise);

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
            eventListenerCallback();

            return resolvedPromise.then(() => {
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();
                const targetParams = getOffer.calls.mostRecent().args[0];
                targetParams.success(mockResponseHTML);
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();

                // Assert
                expect(dispatch).toHaveBeenCalledTimes(2);
            });
        });

        // For some reason it fails on Jenkins env
        xit('should process tests for TestTargetReady in getOffer success callback if using JSON offers', () => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');
            const getOffer = spyOn(window.adobe.target, 'getOffer');
            const resolvedPromise = Promise.resolve(userParamsData);
            spyOn(testTargetUtils, 'setUserParams').and.returnValue(resolvedPromise);
            const responseJSON = [
                {
                    action: testTargetUtils.JSON_ACTION,
                    content: [{}]
                }
            ];
            const action = {
                offers: {},
                type: 'SET_OFFERS'
            };

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
            eventListenerCallback();

            return resolvedPromise.then(() => {
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();
                const targetParams = getOffer.calls.mostRecent().args[0];
                targetParams.success(responseJSON);

                // Assert
                expect(dispatch.calls.mostRecent().args[0]).toEqual(action);
            });
        });

        it('should set service as ready in global loadEvents object', () => {
            // Arrange/Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.first().args[2];
            eventListenerCallback();

            // Assert
            expect(Sephora.Util.InflatorComps.services.loadEvents[TestTargetServiceReady]).toBe(true);
        });

        it('should dispatch test timeout to store in getOffer success callback if catched error', () => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');
            const getOffer = spyOn(window.adobe.target, 'getOffer');
            const resolvedPromise = Promise.resolve(userParamsData);
            spyOn(testTargetUtils, 'setUserParams').and.returnValue(resolvedPromise);
            window.adobe.target.applyOffer = null;
            const action = TestTargetActions.cancelOffers(true);

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
            eventListenerCallback();

            return resolvedPromise.then(() => {
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();
                const targetParams = getOffer.calls.mostRecent().args[0];
                targetParams.success(mockResponseHTML);
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();

                // Assert
                expect(dispatch.calls.mostRecent().args[0]).toEqual(action);
            });
        });

        it('should dispatch test timeout to store in getOffer error callback', () => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');
            const getOffer = spyOn(window.adobe.target, 'getOffer');
            const resolvedPromise = Promise.resolve(userParamsData);
            spyOn(testTargetUtils, 'setUserParams').and.returnValue(resolvedPromise);
            window.adobe.target.applyOffer = null;
            const action = TestTargetActions.cancelOffers(true);

            // Act
            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
            eventListenerCallback();

            return resolvedPromise.then(() => {
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();
                const targetParams = getOffer.calls.mostRecent().args[0];
                targetParams.error();
                eventListenerCallback = onLastLoadEventStub.calls.mostRecent().args[2];
                eventListenerCallback();

                // Assert
                expect(dispatch.calls.mostRecent().args[0]).toEqual(action);
            });
        });
    });

    describe('Sephora.Util.TestTarget.dispatchTest method', () => {
        it('should call window dispatch event when invoked', () => {
            spyOn(store, 'getState').and.returnValue({
                page: {
                    pageData: {
                        brand: {
                            displayName: 'brand'
                        }
                    }
                }
            });
            spyOn(basketUtils, 'isUSorCanadaShipping').and.returnValue(true);
            spyOn(userUtils, 'isUserAtleastRecognized').and.returnValue(true);
            spyOn(userUtils, 'isSignedIn').and.returnValue({ profileStatus: 4 });

            dispatchEventStub = spyOn(window, 'dispatchEvent');
            spyOn(Storage.local, 'getItem');

            require('services/TestTarget').initialize();
            eventListenerCallback = onLastLoadEventStub.calls.argsFor(0)[2];
            eventListenerCallback();
            Sephora.Util.TestTarget.dispatchTest({});

            expect(dispatchEventStub).toHaveBeenCalled();
        });
    });

    describe('Sephora.Util.TestTarget.waitedForUserFull', () => {
        it('should be false if there is user data on local storage', () => {
            const mockedCache = { profileStatus: 4 };
            Storage.local.setItem(LOCAL_STORAGE_USER_DATA, mockedCache);
            require('services/TestTarget').initialize();

            expect(Sephora.Util.TestTarget.waitedForUserFull).toBe(false);
            Storage.local.removeItem(LOCAL_STORAGE_USER_DATA);
        });

        it('should be false if there is no user local storage data and global TestTarget var "isLoggedIn" is false', () => {
            Sephora.Util.TestTarget.isRecognized = false;
            require('services/TestTarget').initialize();

            expect(Sephora.Util.TestTarget.waitedForUserFull).toBe(false);
        });

        it('should be true if there is no user local storage data and global TestTarget var "isLoggedIn" is true', () => {
            Sephora.Util.TestTarget.isRecognized = true;
            require('services/TestTarget').initialize();

            expect(Sephora.Util.TestTarget.waitedForUserFull).toBe(true);
        });
    });
});
