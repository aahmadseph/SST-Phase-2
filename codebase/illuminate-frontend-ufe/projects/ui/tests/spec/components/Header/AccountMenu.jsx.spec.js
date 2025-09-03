// /* eslint-disable no-unused-vars */
// const { shallow } = require('enzyme');
// const AccountMenu = require('components/Header/AccountMenu/AccountMenu').default;
// const anaUtils = require('analytics/utils').default;
// const Avatar = require('components/Avatar').default;
// const AccountGreeting = require('components/Header/AccountGreeting').default;
// const localeUtils = require('utils/LanguageLocale').default;
// const React = require('react');
// const userUtils = require('utils/User').default;
// const Location = require('utils/Location').default;

// describe('AccountMenu component', () => {
//     let wrapper;
//     let getText;
//     let component;

//     beforeEach(() => {
//         getText = localeUtils.getLocaleResourceFile('components/Header/AccountMenu/locales', 'AccountMenu');
//     });

//     describe('for anonymous', () => {
//         describe('Main Elements', () => {
//             beforeEach(() => {
//                 const user = {
//                     profileStatus: 0,
//                     isInitialized: false
//                 };
//                 wrapper = shallow(
//                     <AccountMenu
//                         dropWidth='someWidth'
//                         user={user}
//                         signOut={null}
//                         localization={{ greeting: 'Hi' }}
//                         beautyPreferences={true}
//                         showSignInModal={true}
//                         showBiRegisterModal={true}
//                     />
//                 );
//                 wrapper.setState({ isAnonymous: true });
//             });

//             it('should render Dropdown component', () => {
//                 expect(wrapper.find('Dropdown').length).toEqual(1);
//             });

//             it('should render DropdownTrigger component', () => {
//                 expect(wrapper.find('DropdownTrigger').length).toEqual(1);
//             });

//             it('should render Avatar component', () => {
//                 expect(wrapper.find(Avatar).length).toEqual(1);
//             });

//             it('should render custom avatar', () => {
//                 expect(wrapper.find(Avatar).prop('src')).toBeTruthy();
//             });

//             it('should render DropdownMenu component', () => {
//                 expect(wrapper.find('DropdownMenu').length).toEqual(1);
//             });

//             it('should render AccountGreeting component', () => {
//                 expect(wrapper.find(AccountGreeting).length).toEqual(1);
//             });

//             it('should render "Sign In" as username', () => {
//                 const signIn = wrapper.find('[data-at="sign_in_header"]');

//                 expect(signIn.length).toEqual(1);
//             });

//             it('should render inactive Avatar image', () => {
//                 const avatarImage = wrapper.find('[src="/img/ufe/icons/me32.svg"]');

//                 expect(avatarImage.length).toEqual(1);
//             });

//             it('should render active Avatar image', () => {
//                 wrapper.setState({ isDropOpen: true });

//                 const avatarImage = wrapper.find('[src="/img/ufe/icons/me-active.svg"]');

//                 expect(avatarImage.length).toEqual(1);
//             });

//             it('should render proper Beauty Insider description for anonymous non Bi users', () => {
//                 wrapper.setProps({
//                     user: {
//                         profileStatus: 0,
//                         isInitialized: true
//                     }
//                 });

//                 const biDesc = wrapper.findWhere(n => n.prop('children') === getText('biDesc'));

//                 expect(biDesc.length).toEqual(0);
//             });
//         });

//         describe('Actions within elements', () => {
//             const signInSpy = jasmine.createSpy();

//             beforeEach(() => {
//                 const user = {
//                     profileStatus: 0,
//                     isInitialized: true
//                 };

//                 wrapper = shallow(
//                     <AccountMenu
//                         dropWidth='someWidth'
//                         user={user}
//                         showSignInModal={signInSpy}
//                         signOut={null}
//                         localization={{ greeting: 'Hi' }}
//                         beautyPreferences={true}
//                         showBiRegisterModal={null}
//                     />
//                 );
//             });

//             it('should call signIn method with value', () => {
//                 const element = wrapper.find('DropdownTrigger');
//                 element.simulate('click');
//                 expect(signInSpy).toHaveBeenCalledWith({
//                     isOpen: true,
//                     analyticsData: { navigationInfo: 'top nav:account:sign-in:sign-in:sign-in' },
//                     source: 'account-greeting'
//                 });
//             });
//         });
//     });

//     describe('for logged users', () => {
//         const signOutSpy = jasmine.createSpy();
//         beforeEach(() => {
//             const user = {
//                 profileStatus: 4,
//                 isInitialized: true,
//                 firstName: 'Fn',
//                 lastName: 'Ln'
//             };

//             wrapper = shallow(
//                 <AccountMenu
//                     dropWidth='someWidth'
//                     user={user}
//                     signOut={signOutSpy}
//                     localization={{ greeting: 'Hi' }}
//                     beautyPreferences={true}
//                     showSignInModal={null}
//                     showBiRegisterModal={null}
//                 />
//             );
//         });

//         it('should render default avatar', () => {
//             expect(wrapper.find(Avatar).prop('src')).toBeFalsy();
//         });

//         it('should not have onclick handler', () => {
//             const trigger = wrapper.find('DropdownTrigger');
//             expect(trigger.prop('onClick')).toEqual(null);
//         });

//         it('should render username as user\'s firstname if it is short', () => {
//             expect(wrapper.find('span').at(0).text()).toEqual(`${getText('greeting')}, Fn`);
//         });

//         it('should render username as user\'s initials if firstname is long', () => {
//             wrapper.setProps({
//                 user: {
//                     profileStatus: 4,
//                     isInitialized: true,
//                     firstName: 'Barabarabara',
//                     lastName: 'Ln'
//                 }
//             });
//             expect(wrapper.find('span').at(0).text()).toEqual(`${getText('greeting')}, B.L.`);
//         });

//         it('should render sign out link', () => {
//             const signOutLink = wrapper.find('[data-at="sign_out_button"]');

//             expect(signOutLink.length).toEqual(1);
//         });
//     });

//     describe('Analytics Tracking', () => {
//         let setNextPageDataStub;
//         let isSignedInStub;
//         const store = require('store/Store').default;
//         const signOutSpy = jasmine.createSpy();
//         const showBiRegisterModalSpy = jasmine.createSpy();
//         const preventDefaultSpy = jasmine.createSpy();

//         beforeEach(() => {
//             const user = {
//                 profileStatus: 4,
//                 isInitialized: true,
//                 firstName: 'Fn',
//                 lastName: 'Ln',
//                 userSubscriptions: [
//                     {
//                         type: 'SDU',
//                         status: 'ACTIVE'
//                     }
//                 ],
//                 beautyInsiderAccount: true
//             };
//             isSignedInStub = spyOn(userUtils, 'isSignedIn').and.returnValue(true);

//             wrapper = shallow(
//                 <AccountMenu
//                     dropWidth='someWidth'
//                     user={user}
//                     signOut={signOutSpy}
//                     showSignInModal={null}
//                     localization={{ greeting: 'Hi' }}
//                     beautyPreferences={true}
//                     showBiRegisterModal={showBiRegisterModalSpy}
//                 />
//             );
//             component = wrapper.instance();
//             setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
//             spyOn(store, 'dispatch').and.returnValue(null);
//         });

//         it('should track click on Beauty Insider link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/BeautyInsider');
//             const event = { preventDefault: preventDefaultSpy };

//             element.simulate('click', event);

//             const path = ['top nav', 'account', 'Beauty Insider'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Rewards Bazaar link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/rewards');
//             element.simulate('click');
//             const path = ['top nav', 'account', 'rewards bazaar'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Purchase History link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/purchase-history');
//             element.simulate('click');
//             const path = ['top nav', 'account', 'purchase history'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Orders link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/MyAccount/Orders');
//             element.simulate('click');
//             const path = ['top nav', 'account', 'orders'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on auto-replenish link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/MyAccount/AutoReplenishment');
//             element.simulate('click');
//             const path = ['top nav', 'account', 'auto-replenish'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on same day unlimited link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/MyAccount/SameDayUnlimited');
//             element.simulate('click');
//             const path = ['top nav', 'account', 'same-day-unlimited'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Loves link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/shopping-list');
//             element.simulate('click');
//             const path = ['top nav', 'account', 'loves'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Account Settings link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/MyAccount');
//             element.simulate('click');
//             const path = ['top nav', 'account', 'account settings'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Reservations link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Image' && n.prop('src') === '/img/ufe/icons/reservations.svg').parent();
//             const navigateToSpy = spyOn(Location, 'navigateTo');
//             element.simulate('click');
//             const path = ['top nav', 'account', 'reservations'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//             expect(navigateToSpy).toHaveBeenCalled();
//         });

//         it('should track click on Beauty Advisor Recommendation link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/in-store-services');
//             element.simulate('click');
//             const path = ['top nav', 'account', 'beauty advisor recommendations'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Sign out link', () => {
//             const element = wrapper.find('[data-at="sign_out_button"]');
//             element.simulate('click');
//             const path = ['top nav', 'account', 'sign out'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });
//     });

//     describe('Analytics Tracking for Bottom Nav', () => {
//         let setNextPageDataStub;
//         let isSignedInStub;
//         const store = require('store/Store').default;
//         const signOutSpy = jasmine.createSpy();
//         const showBiRegisterModalSpy = jasmine.createSpy();
//         const preventDefaultSpy = jasmine.createSpy();

//         beforeEach(() => {
//             const user = {
//                 profileStatus: 4,
//                 isInitialized: true,
//                 firstName: 'Fn',
//                 lastName: 'Ln',
//                 userSubscriptions: [
//                     {
//                         type: 'SDU',
//                         status: 'ACTIVE'
//                     }
//                 ],
//                 beautyInsiderAccount: true
//             };
//             isSignedInStub = spyOn(userUtils, 'isSignedIn').and.returnValue(true);

//             wrapper = shallow(
//                 <AccountMenu
//                     dropWidth='someWidth'
//                     isBottomNav
//                     user={user}
//                     signOut={signOutSpy}
//                     showSignInModal={null}
//                     localization={{ greeting: 'Hi' }}
//                     beautyPreferences={true}
//                     showBiRegisterModal={showBiRegisterModalSpy}
//                 />
//             );
//             component = wrapper.instance();
//             setNextPageDataStub = spyOn(anaUtils, 'setNextPageData');
//             spyOn(store, 'dispatch').and.returnValue(null);
//         });

//         it('should track click on Beauty Insider link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/BeautyInsider');
//             const event = { preventDefault: preventDefaultSpy };
//             element.simulate('click', event);
//             const path = ['bottom nav', 'account', 'Beauty Insider'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Rewards Bazaar link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/rewards');
//             element.simulate('click');
//             const path = ['bottom nav', 'account', 'rewards bazaar'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Purchase History link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/purchase-history');
//             element.simulate('click');
//             const path = ['bottom nav', 'account', 'purchase history'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Orders link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/MyAccount/Orders');
//             element.simulate('click');
//             const path = ['bottom nav', 'account', 'orders'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Auto-Replenish link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/MyAccount/AutoReplenishment');
//             element.simulate('click');
//             const path = ['bottom nav', 'account', 'auto-replenish'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on same day unlimited link', () => {
//             isSignedInStub.and.returnValue(true);
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/MyAccount/SameDayUnlimited');
//             element.simulate('click');
//             const path = ['bottom nav', 'account', 'same-day-unlimited'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Loves link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/shopping-list');
//             element.simulate('click');
//             const path = ['bottom nav', 'account', 'loves'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Account Settings link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/MyAccount');
//             element.simulate('click');
//             const path = ['bottom nav', 'account', 'account settings'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Reservations link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Image' && n.prop('src') === '/img/ufe/icons/reservations.svg').parent();
//             const navigateToSpy = spyOn(Location, 'navigateTo');
//             element.simulate('click');
//             const path = ['bottom nav', 'account', 'reservations'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//             expect(navigateToSpy).toHaveBeenCalled();
//         });

//         it('should track click on Beauty Advisor Recommendation link', () => {
//             const element = wrapper.findWhere(n => n.name() === 'Link' && n.prop('href') === '/in-store-services');
//             element.simulate('click');
//             const path = ['bottom nav', 'account', 'beauty advisor recommendations'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });

//         it('should track click on Sign out link', () => {
//             const element = wrapper.find('[data-at="sign_out_button"]');
//             element.simulate('click');
//             const path = ['bottom nav', 'account', 'sign out'];
//             expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: anaUtils.buildNavPath(path) });
//         });
//     });

//     function getARElement(_wrapper) {
//         return _wrapper
//             .findWhere(n => n.name() === 'Link' && n.prop('href') === '/profile/MyAccount/AutoReplenishment')
//             .render()
//             .find('[data-at="auto-replenish-description"]');
//     }

//     describe('Dynamic Auto-Replenish copy', () => {
//         const autoReplenishDescWithSubs = 'View and manage your subscriptions';
//         const autoReplenishDesc = 'Never run out of your go-tos with subscription delivery';
//         let isSignedInStub;
//         const store = require('Store').default;
//         const signOutSpy = jasmine.createSpy();
//         const showBiRegisterModalSpy = jasmine.createSpy();

//         beforeEach(() => {
//             const user = {
//                 profileStatus: 4,
//                 isInitialized: true,
//                 firstName: 'Fn',
//                 lastName: 'Ln',
//                 userSubscriptions: [
//                     {
//                         type: 'SDU',
//                         status: 'ACTIVE'
//                     }
//                 ],
//                 beautyInsiderAccount: true
//             };

//             wrapper = shallow(
//                 <AccountMenu
//                     dropWidth='someWidth'
//                     user={user}
//                     signOut={signOutSpy}
//                     showSignInModal={null}
//                     localization={{
//                         autoReplenishDescWithSubs,
//                         autoReplenishDesc
//                     }}
//                     beautyPreferences={true}
//                     showBiRegisterModal={showBiRegisterModalSpy}
//                 />
//             );
//             component = wrapper.instance();
//             spyOn(store, 'dispatch').and.returnValue(null);
//         });

//         it('should show "View and manage your subscriptions" when the user is logged in and isAutoReplenishEmptyHubEnabled KS is false', () => {
//             Sephora.configurationSettings.isAutoReplenishEmptyHubEnabled = false;
//             isSignedInStub = spyOn(userUtils, 'isSignedIn').and.returnValue(true);

//             const element = getARElement(wrapper);

//             expect(element.text()).toEqual(autoReplenishDescWithSubs);
//         });

//         it('should show "View and manage your subscriptions" when the user is logged out and isAutoReplenishEmptyHubEnabled KS is false', () => {
//             Sephora.configurationSettings.isAutoReplenishEmptyHubEnabled = false;
//             isSignedInStub = spyOn(userUtils, 'isSignedIn').and.returnValue(false);

//             const element = getARElement(wrapper);

//             expect(element.text()).toEqual(autoReplenishDescWithSubs);
//         });

//         it('should show "View and manage your subscriptions" when the user is logged in and has #active subscriptions', () => {
//             Sephora.configurationSettings.isAutoReplenishEmptyHubEnabled = true;
//             isSignedInStub = spyOn(userUtils, 'isSignedIn').and.returnValue(true);
//             wrapper.setProps({
//                 user: {
//                     subscriptionSummary: [
//                         {
//                             type: 'REPLENISHMENT',
//                             active: 1
//                         }
//                     ]
//                 }
//             });
//             const element = getARElement(wrapper);

//             expect(element.text()).toEqual(autoReplenishDescWithSubs);
//         });

//         it('should show "View and manage your subscriptions" when the user is logged in and has #paused subscriptions', () => {
//             Sephora.configurationSettings.isAutoReplenishEmptyHubEnabled = true;
//             isSignedInStub = spyOn(userUtils, 'isSignedIn').and.returnValue(true);
//             wrapper.setProps({
//                 user: {
//                     subscriptionSummary: [
//                         {
//                             type: 'REPLENISHMENT',
//                             paused: 1
//                         }
//                     ]
//                 }
//             });
//             const element = getARElement(wrapper);

//             expect(element.text()).toEqual(autoReplenishDescWithSubs);
//         });

//         it('should return the "Never run out of your go-tos with subscription delivery" when the user is logged in and only cancelled subscriptions', () => {
//             Sephora.configurationSettings.isAutoReplenishEmptyHubEnabled = true;
//             isSignedInStub = spyOn(userUtils, 'isSignedIn').and.returnValue(true);
//             wrapper.setProps({
//                 user: {
//                     subscriptionSummary: [
//                         {
//                             type: 'REPLENISHMENT',
//                             cancelled: 1
//                         }
//                     ]
//                 }
//             });
//             const element = getARElement(wrapper);

//             expect(element.text()).toEqual(autoReplenishDesc);
//         });

//         it('should return the "Never run out of your go-tos with subscription delivery" when the user is logged out', () => {
//             Sephora.configurationSettings.isAutoReplenishEmptyHubEnabled = true;
//             isSignedInStub = spyOn(userUtils, 'isSignedIn').and.returnValue(false);
//             wrapper.setProps({
//                 user: {
//                     subscriptionSummary: [
//                         {
//                             type: 'REPLENISHMENT',
//                             active: 1
//                         }
//                     ]
//                 }
//             });
//             const element = getARElement(wrapper);

//             expect(element.text()).toEqual(autoReplenishDesc);
//         });
//     });
// });
