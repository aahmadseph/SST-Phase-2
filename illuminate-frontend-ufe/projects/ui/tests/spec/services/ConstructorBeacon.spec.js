// /* eslint-disable no-unused-vars */
// const { createSpy } = jasmine;

// describe('Constructor service', () => {
//     let ConstructorBeacon;
//     let Events;
//     let onLastLoadEventStub;
//     let servicesUtils;
//     let store;
//     let dispatchStub;
//     let InflateSPA;
//     let InflatorComps;
//     let locationUtils;
//     let localeUtils;
//     let renderPostLoadRootComponentsStub;

//     beforeEach(() => {
//         jasmine.clock().install();
//         ConstructorBeacon = require('services/ConstructorBeacon');

//         Sephora.analytics.initialLoadDependencies = [];
//         Sephora.analytics.backendData.pageType = 'Homepage/Homepage';
//         digitalData.page.category.pageType = 'home page';

//         // Explicitly requiring these in beforeEach or else they are not found.
//         servicesUtils = require('utils/Services').default;
//         InflatorComps = require('utils/framework/InflateComponents').default;
//         InflateSPA = require('utils/framework/InflateSPA').default;
//         renderPostLoadRootComponentsStub = spyOn(InflateSPA, 'renderPostLoadRootComponents');
//         store = require('store/Store').default;
//         dispatchStub = spyOn(store, 'dispatch');
//         Events = require('utils/framework/Events').default;
//         onLastLoadEventStub = spyOn(Events, 'onLastLoadEvent');
//         localeUtils = require('utils/LanguageLocale').default;
//         locationUtils = require('utils/Location').default;
//     });

//     afterEach(() => {
//         jasmine.clock().uninstall();
//     });

//     describe('initialization', () => {
//         let windowConstructorSpy;

//         beforeEach(() => {
//             windowConstructorSpy = createSpy();
//             window.ConstructorioTracker = {
//                 setClientOptions: windowConstructorSpy
//             };
//         });

//         describe('when kill switch is enabled', () => {
//             let userTestData;

//             beforeEach(() => {
//                 userTestData = { user: { userId: 'userId' } };
//                 Sephora.configurationSettings = {
//                     isNLPInstrumentationEnabled: true,
//                     constructorApiKey: 'apikey'
//                 };
//                 Sephora.renderQueryParams.language = localeUtils.LANGUAGES.EN;
//             });

//             it('should not startup library on Checkout pages', () => {
//                 spyOn(locationUtils, 'isCheckout').and.returnValue(true);
//                 Sephora.pagePath = 'Checkout/Checkout';
//                 ConstructorBeacon.initializeConstructorBeacon();

//                 expect(windowConstructorSpy).toHaveBeenCalledTimes(0);
//             });

//             it('should startup library on not Checkout pages', () => {
//                 spyOn(locationUtils, 'isCheckout').and.returnValue(false);
//                 ConstructorBeacon.initializeConstructorBeacon();

//                 expect(windowConstructorSpy).toHaveBeenCalledTimes(1);
//             });
//         });

//         describe('when kill switch is disabled', () => {
//             it('should not startup library', () => {
//                 spyOn(locationUtils, 'isCheckout').and.returnValue(false);
//                 Sephora.configurationSettings = {
//                     isNLPInstrumentationEnabled: false,
//                     constructorApiKey: 'apikey'
//                 };
//                 ConstructorBeacon.initializeConstructorBeacon();

//                 expect(windowConstructorSpy).toHaveBeenCalledTimes(0);
//             });
//         });
//     });
// });
