/* eslint-disable prefer-const */
const helper = require('./utils/jasmineHelper.js');
helper.initialize();

// const tests = require.context('./spec', true, /.*.spec.js$/);
// tests.keys().forEach(tests);
let tests;

// tests = require.context('./spec/components', true, /.*.spec.js$/);
// tests.keys().forEach(tests);
tests = require.context('./spec/actions', true, /.*.spec.js$/);
tests.keys().forEach(tests);
tests = require.context('./spec/analytics', true, /.*.spec.js$/);
tests.keys().forEach(tests);
tests = require.context('./spec/locales', true, /.*.spec.js$/);
tests.keys().forEach(tests);
// tests = require.context('./spec/pages', true, /.*.spec.js$/);
// tests.keys().forEach(tests);
tests = require.context('./spec/reducers', true, /.*.spec.js$/);
tests.keys().forEach(tests);
tests = require.context('./spec/services', true, /.*.spec.js$/);
tests.keys().forEach(tests);
tests = require.context('./spec/store', true, /.*.spec.js$/);
tests.keys().forEach(tests);
tests = require.context('./spec/utils', true, /.*.spec.js$/);
tests.keys().forEach(tests);
tests = require.context('./spec/viewModel', true, /.*.spec.js$/);
tests.keys().forEach(tests);

// error examples:
//
// test/spec/actions/HomePageActions.spec.js
// 'should call getContent with correct arguments'
// false positive test
//
// test/spec/actions/AddToBasketActions.spec.js
// 'when addToCart resolves'
// 'Add Multiple Skus To Basket'
// false positive tests
//
// test/spec/components/GlobalModals/PromoModal/PromoModal.spec.js
// 'submitMsgPromos happy path'
// in beforeEach not all required code was stubbed
//
// test/spec/components/OnlineReservation/ExperienceDetailPage/ExperienceSubnav/ExperienceSubnav.jsx.spec.js
// 'should set the correct "prop55" for each link'
// test overrides global variable 'links'
//
// test/spec/components/LandingPage/PhoneSubscriber/PhoneSubscriber.spec.js
// 'should call services/api/notifications/smsSubscribe on valid phone number'
// 'beforeAll' was used instead of 'beforeEach' what caused tests initialization to fire only once instead of before each test!
//
// test/spec/components/MediaPopup/MediaPopup.spec.js
// 'MediaPopup component'
// beforeEach should use .returnValue({ then: () => {} }) instead of .returnValue(Promise.resolve())
//
// test/spec/components/OnlineReservation/ExperienceDetailPage/Confirmation.jsx.spec.js
// 'should NOT display store information'
// mutation of global state by some test: reservation.isVirtual = true;
//
// test/spec/components/GlobalModals/EDP/SignInWithAuthenticateModal/PhoneNumberModal/PhoneNumberModal.spec.js
// 'PhoneNumberModal component'
// mutation of global state by some tests. When const initialization code was moved into beforeEach, tests started to pass
//
// test/spec/components/OnlineReservation/ExperienceDetailPage/BookWidget/BookWidget.spec.js
// 'should call launchPhoneNumberModal with activityDetails'
// async function was called in beforeEach() and test itself wasn't marked as async
//
// test/spec/components/OrderConfirmation/GuestCheckoutSection/GuestCheckoutSection.spec.js
// 'for pos users'
// disabling of lifecycle methods { disableLifecycleMethods: true } allows to mock less methods
//
// test/spec/services/api/thirdparty/BazaarVoice.spec.js
// 'should include the correct params in the querystring'
// async test was implemented without using done() callback or async/await syntax
//
// test/spec/utils/Sku.spec.js
// 'should return false if sku is either a welcome unit, or a birthday gift, or a gwp, or a sample, OOS or a gift card'
// test doesn't initialize global variable 'sku'
//
// test/spec/utils/ExtraProductDetailsUtils.spec.js
// 'should return false if the product hasn\'t been updated with ROPIS data'
// mutation of global state by some test
//
// test/spec/utils/javascript.spec.js
// 'should return a flattened array to depth 1 by default'
// global state used in multiple tests was initialized only in one test
//
// test/spec/components/ProductPage/QuestionsAndAnswers/QuestionsAndAnswers.spec.js
// 'should display 4 questions if Show more CTA has been clicked'
// proper use of Enzyme API - wrapper.find('Button').simulate('click');
//
// test/spec/components/RichProfile/Lists/ListsStoreServices/ListStoreServices.spec.js
// 'should call getProfileSamplesByDSG'
// spyOn(profileApi, 'getProfileSamplesByDSG') wasn't called as component was initialized before spy was set
//
// test/spec/components/RichProfile/Lists/ListsStoreServices/ListStoreServices.spec.js
// 'should update state if there are skus available'
// how to test setState call in componentDidMount without using enzyme API
//
// test/spec/components/RichProfile/PurchaseHistoryList/PurchaseHistoryList.spec.js
// '#handleButtonClick method'
// No need to use Enzyme API to test functions in class components
//
// test/spec/components/ProductPage/ProductMediaCarousel/ProductMediaZoomModal/ProductMediaZoomModal.jsx.spec.js
// 'should autoplay video on Zoom Modal if it’s selected'
// Example how to test some code been called from within the second argument of the setState function
//
// test/spec/components/ProductPage/GalleryCardCarousel/SeeMoreCard/SeeMoreCard.jsx.spec.js
// 'should redirect to a proper gallery link using productId for filtering'
// Test did full page reload instead of mocking Location.navigateTo
//
// test/spec/components/Header/StoreSwitcher/StoreSwithcer.jsx.spec.js
// ''StoreSwitcher''
// Updated beforeEach now uses standard approach to test component wrapped with a HOC
//
// test/spec/utils/UserLocation/Strategies/GeoLocationStrategy.spec.js
// 'if permissions are not supported'
// How to spy on property of an object
//
