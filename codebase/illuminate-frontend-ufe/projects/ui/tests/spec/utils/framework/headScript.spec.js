// require('jasmine-ajax');
// // eslint-disable-next-line object-curly-newline
// const { Ajax, objectContaining } = jasmine;
// const LOCAL_STORAGE = require('utils/localStorage/Constants').default;
// const Storage = require('utils/localStorage/Storage').default;

// describe('headScript', () => {
//     const USER_FULL_URL = '/api/users/profiles/current/full';
//     const writeCookie = (name, value, days) => {
//         var expires;

//         if (days) {
//             var date = new Date();
//             date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//             expires = '; expires=' + date.toGMTString();
//         } else {
//             expires = '';
//         }

//         document.cookie = name + '=' + value + expires + '; path=/';
//     };
//     const deleteCookie = name => {
//         document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//     };
//     const mockValidUserCache = () => {
//         Storage.local.setItem(LOCAL_STORAGE.USER_DATA, { profile: {} }, Storage.HOURS * 1);
//     };
//     const mockValidBasketCache = () => {
//         Storage.local.setItem(LOCAL_STORAGE.BASKET, { itemCount: 2 }, Storage.MINUTES * 15);
//     };

//     beforeEach(() => {
//         Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished = true;
//         Sephora.rwdPersistentBanner1 = [{ componentType: 93 }, { componentType: 95 }];
//         Sephora.targetersToInclude =
//             '?includeTargeters=%2Fatg%2Fregistry%2FRepositoryTargeters%2FSephora%2FAB%20testing,%2Fatg%2Fregistry%2FRepositoryTargeters%2FSephora%2Fhp_slide_test_panda_sloth_control,%2Fatg%2Fregistry%2FRepositoryTargeters%2Ftest%20dz%20targ%201%20web,%2Fatg%2Fregistry%2FRepositoryTargeters%2Ftest%20dz%20targ%202%20mweb,%2Fatg%2Fregistry%2FRepositoryTargeters%2FSephora%2Fmeganav_test_panda_sloth_control,%2Fatg%2Fregistry%2FRepositoryTargeters%2FTest%20targeter_AB2';
//         Ajax.install();
//     });

//     afterEach(() => {
//         Ajax.uninstall();
//     });

//     describe('localStorage', () => {
//         let getItemStub;

//         beforeEach(() => {
//             getItemStub = spyOn(window.localStorage, 'getItem');
//         });

//         it('should call getItem initially to check for basket data cache', () => {
//             require('components/Head/main.headScript.js');
//             expect(getItemStub).toHaveBeenCalledWith('basket');
//         });

//         it('should call getItem initially to check for user data cache', () => {
//             require('components/Head/main.headScript.js');
//             expect(getItemStub).toHaveBeenCalledWith('UserData');
//         });
//     });

//     describe('fetching data', () => {
//         describe('if user has user cookie and does not need welcome mats', () => {
//             beforeEach(() => {
//                 writeCookie('DYN_USER_ID', '123123', 1);
//                 writeCookie('current_country', 'US', 1);
//                 Sephora.renderQueryParams.country = 'US';
//             });

//             afterEach(() => {
//                 deleteCookie('DYN_USER_ID');
//                 deleteCookie('current_country', 'US', 1);
//                 Sephora.renderQueryParams.country = '';
//                 Storage.local.removeItem(LOCAL_STORAGE.BASKET);
//                 Storage.local.removeItem(LOCAL_STORAGE.USER_DATA);
//             });

//             it('should call user/full api if there is no cache', () => {
//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 const { url } = Ajax.requests.mostRecent();
//                 expect(url).toContain(USER_FULL_URL);
//             });

//             describe('and if user has basket cache and there are no targeters', () => {
//                 beforeEach(() => {
//                     Sephora.targetersToInclude = '?';
//                 });

//                 it('should not call user/full if there is available user info cache', () => {
//                     // Arrange
//                     mockValidUserCache();
//                     mockValidBasketCache();

//                     // Act
//                     require('components/Head/main.headScript.js');

//                     // Assert
//                     expect(Ajax.requests.count()).toBe(0);
//                 });

//                 it('should set dataIsFromCache property to true if there is available user info cache', () => {
//                     // Arrange
//                     mockValidUserCache();
//                     mockValidBasketCache();

//                     // Act
//                     require('components/Head/main.headScript.js');

//                     // Assert
//                     expect(Sephora.Util.InflatorComps.services.UserInfo.dataIsFromCache).toBe(true);
//                 });

//                 it('should load cached user data into user info service if there is available user info cache', () => {
//                     // Arrange
//                     mockValidUserCache();
//                     mockValidBasketCache();
//                     const data = Storage.local.getItem(LOCAL_STORAGE.USER_DATA);
//                     data.basket = Storage.local.getItem(LOCAL_STORAGE.BASKET);

//                     // Act
//                     require('components/Head/main.headScript.js');

//                     // Assert
//                     expect(Sephora.Util.InflatorComps.services.UserInfo.data).toEqual(data);
//                 });

//                 it('should call user/full if there is no available user info cache', () => {
//                     // Arrange
//                     mockValidBasketCache();

//                     // Act
//                     require('components/Head/main.headScript.js');

//                     // Assert
//                     expect(Ajax.requests.count()).toBe(1);
//                 });

//                 it('should set dataIsFromCache property to false if there is no available user info cache', () => {
//                     // Arrange
//                     mockValidBasketCache();

//                     // Act
//                     require('components/Head/main.headScript.js');
//                     Ajax.requests.mostRecent().respondWith({
//                         status: 200,
//                         responseText: JSON.stringify({})
//                     });

//                     // Assert
//                     expect(Sephora.Util.InflatorComps.services.UserInfo.dataIsFromCache).toBe(false);
//                 });
//             });

//             describe('and if user has no basket cache and there are no targeters', () => {
//                 it('should call user/full if there is no user info cache', () => {
//                     // Arrange
//                     Sephora.targetersToInclude = '?';

//                     // Act
//                     require('components/Head/main.headScript.js');

//                     // Assert
//                     expect(Ajax.requests.count()).toBe(1);
//                 });

//                 it('should set dataIsFromCache property to false if there is no user info cache', () => {
//                     // Arrange
//                     Sephora.targetersToInclude = '?';

//                     // Act
//                     require('components/Head/main.headScript.js');
//                     Ajax.requests.mostRecent().respondWith({
//                         status: 200,
//                         responseText: JSON.stringify({})
//                     });

//                     // Assert
//                     expect(Sephora.Util.InflatorComps.services.UserInfo.dataIsFromCache).toBe(false);
//                 });
//             });
//         });

//         describe('if user is anonymous and does not need welcome mats', () => {
//             beforeEach(() => {
//                 writeCookie('current_country', 'US', 1);
//                 Sephora.renderQueryParams.country = 'US';
//             });

//             afterEach(() => {
//                 deleteCookie('current_country');
//                 deleteCookie('ATG_ORDER_CONTENT');
//                 Storage.local.removeItem(LOCAL_STORAGE.BASKET);
//             });

//             it('should make xhr call once if no basket cache available yet', () => {
//                 // Arrange
//                 Sephora.targetersToInclude = '?';

//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 expect(Ajax.requests.count()).toEqual(1);
//             });

//             it('should make no xhr calls if it has no basket cookie and no targeters and basket cache is available', () => {
//                 // Arrange
//                 Sephora.targetersToInclude = '?';
//                 mockValidBasketCache();

//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 expect(Ajax.requests.count()).toEqual(0);
//             });

//             it('should set dataIsFromCache property to true if it has no basket cookie and no targeters', () => {
//                 // Arrange
//                 Sephora.targetersToInclude = '?';
//                 mockValidBasketCache();

//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 expect(Sephora.Util.InflatorComps.services.UserInfo.dataIsFromCache).toBe(true);
//             });

//             it('should call user/full if it has basket cookie and there is no basket cache', () => {
//                 // Arrange
//                 writeCookie('ATG_ORDER_CONTENT', '123532', 1);
//                 spyOn(window.localStorage, 'getItem').and.callFake(arg => arg === 'basket' && null);

//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 const { url } = Ajax.requests.mostRecent();
//                 expect(url).toContain(USER_FULL_URL);
//             });

//             it('should set dataIsFromCache property to false if it has basket cookie and there is no basket cache', () => {
//                 // Arrange
//                 writeCookie('ATG_ORDER_CONTENT', '123532', 1);
//                 spyOn(window.localStorage, 'getItem').and.callFake(arg => arg === 'basket' && null);

//                 // Act
//                 require('components/Head/main.headScript.js');
//                 Ajax.requests.mostRecent().respondWith({
//                     status: 200,
//                     responseText: JSON.stringify({})
//                 });

//                 // Assert
//                 expect(Sephora.Util.InflatorComps.services.UserInfo.dataIsFromCache).toBe(false);
//             });

//             it('should make no xhr calls if it has basket cookie and there is valid basket cache and no targeters', () => {
//                 // Arrange
//                 Sephora.targetersToInclude = '?';
//                 mockValidBasketCache();
//                 writeCookie('ATG_ORDER_CONTENT', '123532', 1);

//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 expect(Ajax.requests.count()).toEqual(0);
//             });

//             it('should set dataIsFromCache property to true if it has basket cookie and there is valid basket cache and no targeters', () => {
//                 // Arrange
//                 Sephora.targetersToInclude = '?';
//                 mockValidBasketCache();
//                 writeCookie('ATG_ORDER_CONTENT', '123532', 1);

//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 expect(Sephora.Util.InflatorComps.services.UserInfo.dataIsFromCache).toBe(true);
//             });

//             it('should load cached basket data into user info services if it has a basket basket cookie and there is valid basket cache and no targeters', () => {
//                 // Arrange
//                 Sephora.targetersToInclude = '?';
//                 mockValidBasketCache();
//                 writeCookie('ATG_ORDER_CONTENT', '123532', 1);

//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 expect(Sephora.Util.InflatorComps.services.UserInfo.data.basket).toEqual(Storage.local.getItem(LOCAL_STORAGE.BASKET));
//             });
//         });

//         describe('if user is anonymous and needs welcome mats', () => {
//             afterEach(() => {
//                 deleteCookie('ATG_ORDER_CONTENT');
//                 deleteCookie('current_country');
//                 Sephora.renderQueryParams.country = '';
//                 Storage.local.removeItem('basket');
//             });

//             it('should call user/full regardless of basket cache and cookie', () => {
//                 // Arrange
//                 Sephora.renderQueryParams.country = 'US';
//                 writeCookie('current_country', 'DE', 1);
//                 writeCookie('ATG_ORDER_CONTENT', '123532', 1);
//                 mockValidBasketCache();

//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 const { url } = Ajax.requests.mostRecent();
//                 expect(url).toContain(USER_FULL_URL);
//             });
//         });

//         describe('if user/full should not be called and should not get welcome mats', () => {
//             it('should call user full with targeter api if Sephora.targetersToInclude exists', () => {
//                 // Arrange
//                 writeCookie('current_country', 'US', 1);
//                 Sephora.renderQueryParams.country = 'US';

//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 const { url } = Ajax.requests.mostRecent();
//                 expect(url).toContain(USER_FULL_URL);
//             });

//             it('should make no call at all if Sephora.targetersToInclude is falsy', () => {
//                 // Arrange
//                 Sephora.targetersToInclude = null;
//                 Sephora.renderQueryParams.country = 'US';
//                 writeCookie('current_country', 'US', 1);
//                 mockValidBasketCache();

//                 // Act
//                 require('components/Head/main.headScript.js');

//                 // Assert
//                 expect(Ajax.requests.count()).toEqual(0);
//             });
//         });
//     });

//     describe('ajax request', () => {
//         afterEach(() => {
//             deleteCookie('DYN_USER_ID');
//         });

//         it('should have a GET method', () => {
//             // Arrange
//             writeCookie('DYN_USER_ID', '123123', 1);

//             // Act
//             require('components/Head/main.headScript.js');

//             // Assert
//             const { method } = Ajax.requests.mostRecent();
//             expect(method).toEqual('GET');
//         });

//         it('should retry call if first call had an error', () => {
//             // Arrange
//             writeCookie('DYN_USER_ID', '123123', 1);

//             // Act
//             require('components/Head/main.headScript.js');
//             Ajax.requests.mostRecent().respondWith({
//                 status: 500,
//                 responseText: JSON.stringify({})
//             });

//             // Assert
//             expect(Ajax.requests.count()).toBe(2);
//         });

//         it('should retry call if second call had an error', () => {
//             // Arrange
//             writeCookie('DYN_USER_ID', '123123', 1);

//             // Act
//             require('components/Head/main.headScript.js');
//             Ajax.requests.mostRecent().respondWith({
//                 status: 500,
//                 responseText: JSON.stringify({})
//             });
//             Ajax.requests.mostRecent().respondWith({
//                 status: 500,
//                 responseText: JSON.stringify({})
//             });

//             // Assert
//             expect(Ajax.requests.count()).toBe(3);
//         });

//         it('should not retry call if third call had an error', () => {
//             // Arrange
//             writeCookie('DYN_USER_ID', '123123', 1);

//             // Act
//             require('components/Head/main.headScript.js');
//             Ajax.requests.mostRecent().respondWith({
//                 status: 500,
//                 responseText: JSON.stringify({})
//             });
//             Ajax.requests.mostRecent().respondWith({
//                 status: 500,
//                 responseText: JSON.stringify({})
//             });
//             Ajax.requests.mostRecent().respondWith({
//                 status: 500,
//                 responseText: JSON.stringify({})
//             });

//             // Assert
//             expect(Ajax.requests.count()).toBe(3);
//         });
//     });

//     describe('setting user data', () => {
//         beforeEach(() => {
//             Sephora.renderQueryParams.country = 'US';
//             writeCookie('DYN_USER_ID', '123123', 1);
//             writeCookie('current_country', 'DE', 1);
//         });

//         afterEach(() => {
//             deleteCookie('DYN_USER_ID');
//             deleteCookie('current_country');
//         });

//         it('should set a flag for user info been loaded', () => {
//             // Act
//             require('components/Head/main.headScript.js');
//             Ajax.requests.mostRecent().respondWith({
//                 status: 200,
//                 responseText: JSON.stringify({})
//             });

//             // Assert
//             expect(Sephora.Util.InflatorComps.services.loadEvents.UserInfoLoaded).toBe(true);
//         });

//         it('should fire event when user info is loaded', () => {
//             // Arrange
//             const dispatchEventStub = spyOn(window, 'dispatchEvent');

//             // Act
//             require('components/Head/main.headScript.js');
//             Ajax.requests.mostRecent().respondWith({
//                 status: 200,
//                 responseText: JSON.stringify({})
//             });

//             // Assert
//             expect(dispatchEventStub).toHaveBeenCalled();
//         });

//         it('should inject user data to services.UserInfo', () => {
//             // Act
//             require('components/Head/main.headScript.js');
//             Ajax.requests.mostRecent().respondWith({
//                 status: 200,
//                 responseText: JSON.stringify({})
//             });

//             // Assert
//             expect(Sephora.Util.InflatorComps.services.UserInfo.data).toBeTruthy();
//         });

//         it('Sephora.Util.InflatorComps.services.UserInfo.data should contain shoppingList field', () => {
//             // Arrange
//             const response = {
//                 shoppingList: {
//                     shoppingListItems: [],
//                     shoppingListItemsCount: 0
//                 }
//             };

//             // Act
//             require('components/Head/main.headScript.js');
//             Ajax.requests.mostRecent().respondWith({
//                 status: 200,
//                 responseText: JSON.stringify(response)
//             });

//             // Assert
//             expect(Sephora.Util.InflatorComps.services.UserInfo.data).toEqual(objectContaining(response));
//         });

//         it('URL query string should contain "shoppingList" in "includeApis" param', () => {
//             // Act
//             require('components/Head/main.headScript.js');

//             // Assert
//             const { url } = Ajax.requests.mostRecent();
//             const includeApis = url.split('&').find(item => item.startsWith('includeApis='));
//             expect(includeApis).toContain('shoppingList');
//         });

//         it('URL query string should contain "shoppingList" in "includeApis" param when includeTargeters === false', () => {
//             // Arrange
//             Sephora.targetersToInclude = '?';

//             // Act
//             require('components/Head/main.headScript.js');

//             // Assert
//             const { url } = Ajax.requests.mostRecent();
//             const includeApis = url.split('&').find(item => item.startsWith('includeApis='));
//             expect(includeApis).toContain('shoppingList');
//         });
//     });

//     describe('Sephora.Util.TestTarget.isRecognized', () => {
//         it('should be false if there is no user cookie', () => {
//             // Arrange
//             deleteCookie('DYN_USER_ID');

//             // Act
//             require('components/Head/main.headScript.js');

//             // Assert
//             expect(Sephora.Util.TestTarget.isRecognized).toBe(false);
//         });

//         it('should be true if user cookie is present', () => {
//             // Arrange
//             writeCookie('DYN_USER_ID', '123123', 1);

//             // Act
//             require('components/Head/main.headScript.js');

//             // Assert
//             expect(Sephora.Util.TestTarget.isRecognized).toBe(true);
//             deleteCookie('DYN_USER_ID');
//         });
//     });
// });
