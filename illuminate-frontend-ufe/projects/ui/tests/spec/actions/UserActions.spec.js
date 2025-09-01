// TODO: inject-loader is not supported anymore
// const { any, createSpy } = jasmine;

// describe('UserActions', () => {
//     let ufeApi;
//     let localeUtils;
//     let Location;
//     let LOCAL_STORAGE;
//     let ASYNC_PAGE_LOAD;
//     let REGISTRATION_WITH_BI;
//     let REGISTRATION_SUCCESSFUL;
//     let anaUtils;
//     let Storage;
//     let mockedUserActionsInjector;
//     let processEvent;
//     let mockedUserActions, stubbedSwitchCountry, stubbedActions;
//     let basketActions, errorsActions, basketUtils, targetedPromotionActions;
//     let productActions, userUtils, loveActions, dispatchStub;
//     let UtilActions,
//         welcomePopupActions,
//         userData = null;
//     let store;
//     let redirectToStub;

//     beforeEach(() => {
//         const obj = require('analytics/constants').default;
//         ASYNC_PAGE_LOAD = obj.ASYNC_PAGE_LOAD;
//         REGISTRATION_WITH_BI = obj.Event.REGISTRATION_WITH_BI;
//         REGISTRATION_SUCCESSFUL = obj.Event.REGISTRATION_SUCCESSFUL;
//         ufeApi = require('services/api/ufeApi').default;
//         localeUtils = require('utils/LanguageLocale').default;
//         Location = require('utils/Location').default;
//         LOCAL_STORAGE = require('utils/localStorage/Constants').default;
//         anaUtils = require('analytics/utils').default;
//         Storage = require('utils/localStorage/Storage').default;
//         mockedUserActionsInjector = require('inject-loader!actions/UserActions');

//         const urlUtils = require('utils/Url').default;
//         redirectToStub = spyOn(urlUtils, 'redirectTo');
//         stubbedSwitchCountry = createSpy().and.returnValue(
//             Promise.resolve({
//                 profileLocale: '',
//                 profileLanguage: '',
//                 profileWarnings: [{ messages: [''] }]
//             })
//         );
//         stubbedActions = {
//             showInfoModal: createSpy(),
//             showCountrySwitcherModal: () => {},
//             showInterstice: () => ({})
//         };
//         processEvent = { process: createSpy('process') };

//         mockedUserActions = mockedUserActionsInjector({
//             'services/api/profile/switchCountry': stubbedSwitchCountry,
//             Actions: stubbedActions,
//             'analytics/processEvent': processEvent
//         });

//         store = require('Store').default;
//         basketActions = require('actions/AddToBasketActions').default;
//         targetedPromotionActions = require('actions/TargetedPromotionActions');
//         errorsActions = require('actions/ErrorsActions').default;
//         basketUtils = require('utils/Basket').default;
//         userUtils = require('utils/User').default;
//         UtilActions = require('utils/redux/Actions').default;
//         welcomePopupActions = require('actions/WelcomePopupActions');
//         loveActions = require('actions/LoveActions').default;
//         productActions = require('actions/ProductActions').default;
//         dispatchStub = spyOn(store, 'dispatch').and.callFake(function (callback) {
//             if (typeof callback === 'function') {
//                 return callback(dispatchStub);
//             }

//             return callback;
//         });

//         userData = {
//             profile: {
//                 profileStatus: userUtils.PROFILE_STATUS.RECOGNIZED,
//                 nickName: 'TestingUser',
//                 lithiumSsoToken: 'lithiumSsoToken'
//             },
//             basket: {},
//             targetedPromotion: {}
//         };
//         spyOn(Location, 'setLocation');
//         spyOn(Location, 'reload');
//     });

//     describe('signOut action', () => {
//         it('should remove "jStorage" key from window.localStorage', () => {
//             // Arrange
//             const resolvedApiCall = Promise.resolve();
//             spyOn(require('services/api/authentication'), 'logout').and.returnValue(resolvedApiCall);
//             const { signOut } = require('actions/UserActions').default;
//             const { local } = Storage;
//             local.setItem('jStorage', 'jStorage');

//             // Act
//             signOut('')();

//             // Assert
//             resolvedApiCall.then(() => {
//                 expect(local.getItem('jStorage')).toBeNull();
//             });
//         });

//         it('should remove "jStorage_update" key from window.localStorage', () => {
//             // Arrange
//             const resolvedApiCall = Promise.resolve();
//             spyOn(require('services/api/authentication'), 'logout').and.returnValue(resolvedApiCall);
//             const { signOut } = require('actions/UserActions').default;
//             const { local } = Storage;
//             local.setItem('jStorage_update', 'jStorage_update');

//             // Act
//             signOut('')();

//             // Assert
//             resolvedApiCall.then(() => {
//                 expect(local.getItem('jStorage_update')).toBeNull();
//             });
//         });

//         it('should invoke the redirectTo method', done => {
//             // Arrange
//             const resolvedApiCall = Promise.resolve();
//             spyOn(require('services/api/authentication'), 'logout').and.returnValue(resolvedApiCall);
//             const { signOut } = require('actions/UserActions').default;

//             // Act
//             signOut('')(dispatchStub);

//             // Assert
//             resolvedApiCall.then(() => {
//                 expect(redirectToStub).toHaveBeenCalledTimes(1);
//                 done();
//             });
//         });
//     });

//     describe('switch country', () => {
//         it('does switchCountry with defaults', () => {
//             mockedUserActions.switchCountry()(dispatchStub);

//             expect(stubbedSwitchCountry).toHaveBeenCalledWith(localeUtils.COUNTRIES.US, localeUtils.LANGUAGES.EN);
//         });

//         it('does switchCountry with US and default lang (EN) arguments', () => {
//             mockedUserActions.switchCountry(localeUtils.COUNTRIES.US)(dispatchStub);

//             expect(stubbedSwitchCountry).toHaveBeenCalledWith(localeUtils.COUNTRIES.US, localeUtils.LANGUAGES.EN);
//         });

//         it('does switchCountry with CA and default lang (EN) arguments', () => {
//             mockedUserActions.switchCountry(localeUtils.COUNTRIES.CA)(dispatchStub);

//             expect(stubbedSwitchCountry).toHaveBeenCalledWith(localeUtils.COUNTRIES.CA, localeUtils.LANGUAGES.EN);
//         });

//         it('does switchCountry with CA and FR arguments', () => {
//             mockedUserActions.switchCountry(localeUtils.COUNTRIES.CA, localeUtils.LANGUAGES.FR)(dispatchStub);

//             expect(stubbedSwitchCountry).toHaveBeenCalledWith(localeUtils.COUNTRIES.CA, localeUtils.LANGUAGES.FR);
//         });
//     });

//     describe('show warnings', () => {
//         let showErrorSpy, showInfoModalSpy;

//         beforeEach(function () {
//             showErrorSpy = spyOn(basketActions, 'showError');
//             spyOn(errorsActions, 'addError');
//             showInfoModalSpy = stubbedActions.showInfoModal;
//         });

//         it('does not show anything if there are no warnings', () => {
//             mockedUserActions.showWarnings({}, dispatchStub);

//             expect(dispatchStub).not.toHaveBeenCalled();
//         });

//         it('only shows info modal for a generic message', () => {
//             const message = 'test1';

//             mockedUserActions.showWarnings(
//                 {
//                     profileWarnings: [
//                         {
//                             messageContext: message,
//                             messages: [message]
//                         }
//                     ],
//                     warnings: [message]
//                 },
//                 dispatchStub
//             );

//             expect(showInfoModalSpy.calls.argsFor(0)[0]).toEqual({
//                 isOpen: true,
//                 title: 'Warning',
//                 message: message
//             });
//             expect(dispatchStub).toHaveBeenCalled();
//         });

//         it('shows error for merge basket warning', () => {
//             const message = 'test2';

//             spyOn(basketUtils, 'isMergeBasketWarning').and.returnValue(true);
//             const refreshShippingCountrySpy = spyOn(userUtils, 'refreshShippingCountry');

//             mockedUserActions.showWarnings(
//                 {
//                     profileWarnings: [
//                         {
//                             messageContext: message,
//                             messages: [message]
//                         }
//                     ],
//                     warnings: [message]
//                 },
//                 dispatchStub
//             );

//             expect(refreshShippingCountrySpy).toHaveBeenCalled();
//             expect(showErrorSpy.calls.argsFor(0)[0]).toEqual({ orderMergedMsg: message });
//             expect(dispatchStub).toHaveBeenCalled();
//         });

//         it('shows error for already subscribed to flash warning', () => {
//             const message = 'test3';

//             spyOn(basketUtils, 'isAlreadySubscribedToFlashWarning').and.returnValue(true);

//             mockedUserActions.showWarnings(
//                 {
//                     profileWarnings: [
//                         {
//                             messageContext: message,
//                             messages: [message]
//                         }
//                     ],
//                     warnings: [message]
//                 },
//                 dispatchStub
//             );

//             expect(showInfoModalSpy.calls.argsFor(0)[0]).toEqual({
//                 isOpen: true,
//                 title: 'Warning',
//                 message: message,
//                 callback: any(Function),
//                 showCancelButton: false,
//                 isHtml: false,
//                 cancelCallback: any(Function)
//             });
//             expect(dispatchStub).toHaveBeenCalled();
//         });
//     });

//     describe('getLithiumUserData', () => {
//         let getAuthenticatedUserSocialInfoStub, lithiumApi, getLithiumUserData;
//         let fakePromise;
//         let TYPES;
//         beforeEach(() => {
//             TYPES = require('reducers/socialInfo').ACTION_TYPES;
//             fakePromise = {
//                 then: resolve => {
//                     resolve({});

//                     return fakePromise;
//                 },
//                 catch: () => {
//                     return fakePromise;
//                 }
//             };
//             lithiumApi = require('services/api/thirdparty/Lithium').default;
//             getLithiumUserData = mockedUserActions.getLithiumUserData;
//             getAuthenticatedUserSocialInfoStub = spyOn(lithiumApi, 'getAuthenticatedUserSocialInfo').and.returnValue(fakePromise);
//         });

//         it('should cache lithiumSsoToken', function () {
//             getLithiumUserData(userData)(dispatchStub);
//             const cachedApiToken = Storage.local.getItem(LOCAL_STORAGE.LITHIUM_API_TOKEN);
//             expect(cachedApiToken).not.toBeNull();
//         });

//         it('should dispatch setUserSocialInfo if lithium cache exists', function () {
//             Storage.local.setItem(LOCAL_STORAGE.LITHIUM_DATA, { x: 'x' });
//             getLithiumUserData(userData)(dispatchStub);
//             expect(dispatchStub.calls.argsFor(0)[0].type).toBe(TYPES.SET_USER_SOCIAL_INFO);
//         });

//         it('should call getAuthenticatedUserSocialInfo if there is not lithium cache', function () {
//             getLithiumUserData(userData)(dispatchStub);
//             expect(getAuthenticatedUserSocialInfoStub).toHaveBeenCalled();
//         });

//         describe('when calls getAuthenticatedUserSocialInfo', () => {
//             describe('if the response is ok', () => {
//                 it('should cache the lithium data if the response is right', function () {
//                     getLithiumUserData(userData)(dispatchStub);
//                     const cache = Storage.local.getItem(LOCAL_STORAGE.LITHIUM_DATA);
//                     expect(cache instanceof Object).toBeTruthy();
//                 });

//                 it('should setUserSocialInfo if the response is right', function () {
//                     getLithiumUserData(userData)(dispatchStub);
//                     expect(dispatchStub.calls.argsFor(0)[0].type).toBe(TYPES.SET_USER_SOCIAL_INFO);
//                 });
//             });
//         });
//     });

//     describe('processUserFull', () => {
//         let updateWelcomeSpy, processUserFull;
//         let updateBasketStub, setLovesListSpy, updateTargetedPromotionStub;
//         let updateCurrentUserSpecificProductSpy;
//         beforeEach(function () {
//             updateWelcomeSpy = spyOn(welcomePopupActions, 'updateWelcome');
//             updateBasketStub = spyOn(basketActions, 'updateBasket');
//             updateTargetedPromotionStub = spyOn(targetedPromotionActions, 'updateTargetedPromotion');
//             setLovesListSpy = spyOn(loveActions, 'setLovesList');
//             updateCurrentUserSpecificProductSpy = spyOn(productActions, 'updateCurrentUserSpecificProduct');
//             processUserFull = mockedUserActions.processUserFull;
//         });

//         it(`should be able to cache user data only when data
//         comes from userFullCall`, () => {
//             processUserFull(userData, false)(dispatchStub);
//             const cachedUserData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA);
//             expect(cachedUserData).not.toBeNull();
//             expect(cachedUserData instanceof Object).toBeTruthy();
//         });

//         it('should not cache user data when dataIsFromCache is true', () => {
//             store.dispatch(processUserFull(userData, false, true));
//             const cachedUserData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA);
//             expect(cachedUserData).toBeNull();
//         });

//         it('should update user in the store with the profile data', () => {
//             const { UPDATE } = require('constants/actionTypes/user');
//             processUserFull(userData, false)(dispatchStub);
//             expect(dispatchStub.calls.argsFor(1)[0].type).toBe(UPDATE);
//         });

//         it('should update user\'s basket', () => {
//             processUserFull(userData, false)(dispatchStub);
//             expect(updateBasketStub).toHaveBeenCalledTimes(1);
//         });

//         it('should update user\'s targetedPromotion', () => {
//             processUserFull(userData, false)(dispatchStub);
//             expect(updateTargetedPromotionStub).toHaveBeenCalledTimes(1);
//         });

//         it('should not try to set targeter result if there are not any available', () => {
//             userData.profile.profileStatus = userUtils.PROFILE_STATUS.LOGGED_IN;
//             const mergeStub = spyOn(UtilActions, 'merge');
//             dispatchStub(processUserFull(userData, false));
//             expect(mergeStub).not.toHaveBeenCalled();
//         });

//         it('should set love list when there is a shoppingList within the user data', () => {
//             userData.shoppingList = {};
//             processUserFull(userData, false)(dispatchStub);
//             expect(setLovesListSpy).toHaveBeenCalledTimes(1);
//         });

//         it('should set love list when there is an cached shoppingList and dataIsFromCache = true', () => {
//             Storage.local.setItem(LOCAL_STORAGE.LOVES_DATA, {});
//             processUserFull(userData, false, true)(dispatchStub);
//             expect(setLovesListSpy).toHaveBeenCalledTimes(1);
//         });

//         it('should not set love list when there is an cached shoppingList but dataIsFromCache = false', () => {
//             Storage.local.setItem(LOCAL_STORAGE.LOVES_DATA, {});
//             store.dispatch(processUserFull(userData, false));
//             expect(setLovesListSpy).not.toHaveBeenCalled();
//         });

//         it('should not set love list when there isn\'t an cached shoppingList nor within the user data', () => {
//             store.dispatch(processUserFull(userData, false));
//             expect(setLovesListSpy).not.toHaveBeenCalled();
//         });

//         it('should update current user specific product when there is a product on user data and data is not from cache', () => {
//             userData.product = {};
//             processUserFull(userData, false)(dispatchStub);
//             expect(updateCurrentUserSpecificProductSpy).toHaveBeenCalledTimes(1);
//         });

//         it('should not update current user specific product when there is not a product on user data', () => {
//             store.dispatch(processUserFull(userData, false));
//             expect(updateCurrentUserSpecificProductSpy).not.toHaveBeenCalled();
//         });

//         it('should not update current user specific product when data is from cache', () => {
//             userData.product = {};
//             store.dispatch(processUserFull(userData, false, true));
//             expect(updateCurrentUserSpecificProductSpy).not.toHaveBeenCalled();
//         });

//         it('should call welcome update if `showWelcome` is true', () => {
//             processUserFull(userData, true, true)(dispatchStub);
//             expect(updateWelcomeSpy).toHaveBeenCalledTimes(1);
//         });

//         it('should not call welcome update if `showWelcome` is false', () => {
//             store.dispatch(processUserFull(userData, false, true));
//             expect(updateWelcomeSpy).not.toHaveBeenCalled();
//         });
//     });

//     describe('getCommonAnalytics', () => {
//         let analyticsData;
//         let isBIPageStub;
//         let setNextPageDataStub;
//         const getCommonAnalytics = require('actions/UserActions').default.getCommonAnalytics;

//         beforeEach(function () {
//             analyticsData = { nextPageContext: 'context' };
//             digitalData.page.attributes.sephoraPageInfo.pageName = 'original pageName';
//             digitalData.page.pageInfo.pageName = 'original pageDetail';
//             const modalDataMock = {
//                 pageName: 'pageName',
//                 previousPage: 'previousPage',
//                 pageType: 'pageType'
//             };
//             spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue(modalDataMock);
//             setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
//             isBIPageStub = spyOn(Location, 'isBIPage');
//         });

//         it('should should return correct data', () => {
//             expect(getCommonAnalytics(analyticsData)).toEqual({
//                 pageName: 'pageName',
//                 pageType: 'pageType',
//                 pageDetail: 'original pageDetail'
//             });
//         });

//         describe('on BI Page', () => {
//             const userStatus = [
//                 {
//                     status: 'BI',
//                     value: 'signed in',
//                     isBI: true
//                 },
//                 {
//                     status: 'non-BI',
//                     value: 'benefits',
//                     isBI: false
//                 }
//             ];

//             beforeEach(() => {
//                 isBIPageStub.and.returnValue(true);
//             });

//             userStatus.forEach(user => {
//                 const expectedPageDetail = `my beauty insider-${user.value}`;
//                 const expectedPageName = `pageType:${expectedPageDetail}:n/a:*`;

//                 it(`for ${user.status} users should set digitalData with correct pageDetail`, () => {
//                     getCommonAnalytics(analyticsData, user.isBI);
//                     expect(digitalData.page.pageInfo.pageName).toEqual(expectedPageDetail);
//                 });

//                 it(`for ${user.status} users should set digitalData with correct pageName`, () => {
//                     getCommonAnalytics(analyticsData, user.isBI);
//                     expect(digitalData.page.attributes.sephoraPageInfo.pageName).toEqual(expectedPageName);
//                 });

//                 it(`for ${user.status} users should call nextPageData with correct pageName`, () => {
//                     getCommonAnalytics(analyticsData, user.isBI);
//                     expect(setNextPageDataStub).toHaveBeenCalledWith({ pageName: expectedPageName });
//                 });

//                 it(`for ${user.status} users should return correct data`, () => {
//                     expect(getCommonAnalytics(analyticsData, user.isBI)).toEqual({
//                         pageName: expectedPageName,
//                         pageType: 'pageType',
//                         pageDetail: expectedPageDetail
//                     });
//                 });
//             });
//         });
//     });

//     it('biRegister action should send analytics', done => {
//         // Arrange
//         const makeRequest = Promise.resolve({});
//         spyOn(ufeApi, 'makeRequest').and.returnValue(makeRequest);
//         const getUserFull = Promise.resolve({});
//         spyOn(mockedUserActions, 'getUserFull').and.callFake(() => () => getUserFull);
//         const event = {
//             data: {
//                 pageName: '',
//                 pageType: '',
//                 pageDetail: '',
//                 eventStrings: [REGISTRATION_WITH_BI, REGISTRATION_SUCCESSFUL],
//                 previousPageName: undefined
//             }
//         };
//         const onSuccess = () => {};
//         const onFailure = () => {};
//         const analyticsData = () => {};
//         const user = {
//             status: 'BI',
//             value: 'signed in',
//             isBI: true
//         };

//         // Act
//         const asyncAction = mockedUserActions.biRegister(user, onSuccess, onFailure, analyticsData);
//         const asyncActionResult = asyncAction(dispatchStub);

//         // Assert
//         asyncActionResult.then(() => {
//             getUserFull.then(() => {
//                 expect(processEvent.process).toHaveBeenCalledWith(ASYNC_PAGE_LOAD, event);
//                 done();
//             });
//         });
//     });
// });
