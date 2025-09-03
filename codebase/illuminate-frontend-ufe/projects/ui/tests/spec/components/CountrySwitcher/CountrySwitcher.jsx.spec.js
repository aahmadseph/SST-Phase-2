// describe('<CountrySwitcher> component', () => {
//     let React;
//     let CountrySwitcher;
//     let localeUtils;
//     let getCurrentCountrySpy;
//     let getCurrentLanguageSpy;
//     let shallowComponent;

//     beforeEach(() => {
//         React = require('react');
//         CountrySwitcher = require('components/CountrySwitcher').default;
//         localeUtils = require('utils/LanguageLocale').default;
//         getCurrentCountrySpy = spyOn(localeUtils, 'getCurrentCountry').and.returnValue('us');
//         getCurrentLanguageSpy = spyOn(localeUtils, 'getCurrentLanguage').and.returnValue('en');
//     });

//     describe('initial state', () => {
//         beforeEach(() => {
//             getCurrentCountrySpy.and.returnValue('ONE');
//             getCurrentLanguageSpy.and.returnValue('TWO');
//             shallowComponent = enzyme.shallow(<CountrySwitcher />);
//         });

//         it('should call getCurrentCountry to set inital country', () => {
//             expect(shallowComponent.state('currCtry')).toEqual('ONE');
//         });

//         it('should call getCurrentLanguage to set inital language', () => {
//             expect(shallowComponent.state('currLang')).toEqual('TWO');
//         });
//     });

//     describe('seleced option', () => {
//         const getSelectedOption = comp => comp.findWhere(n => n.key() === 'US-EN').first();

//         beforeEach(() => {
//             spyOn(localeUtils, 'getCountryFlagImage').and.callFake(arg => 'image_for_' + arg);
//             shallowComponent = enzyme.shallow(<CountrySwitcher />);
//         });

//         it('should render Box', () => {
//             expect(getSelectedOption(shallowComponent).name()).toEqual('Box');
//         });

//         it('should render flag image', () => {
//             expect(getSelectedOption(shallowComponent).find('Image').first().prop('src')).toEqual('image_for_US');
//         });

//         it('should render Icon', () => {
//             expect(getSelectedOption(shallowComponent).find('Icon').length).toEqual(1);
//         });
//     });

//     describe('not seleced option', () => {
//         const getOption = (comp, key) => comp.findWhere(n => n.key() === key).first();

//         beforeEach(() => {
//             spyOn(localeUtils, 'getCountryFlagImage').and.callFake(arg => 'image_for_' + arg);
//             shallowComponent = enzyme.shallow(<CountrySwitcher />);
//         });

//         it('should render Link', () => {
//             ['CA-EN', 'CA-FR'].forEach(op => {
//                 expect(getOption(shallowComponent, op).name()).toEqual('Link');
//             });
//         });

//         it('should render flag image', () => {
//             ['CA-EN', 'CA-FR'].forEach(op => {
//                 expect(getOption(shallowComponent, op).find('Image').first().prop('src')).toEqual('image_for_CA');
//             });
//         });

//         it('should not render Icon', () => {
//             ['CA-EN', 'CA-FR'].forEach(op => {
//                 expect(getOption(shallowComponent, op).find('Icon').length).toEqual(0);
//             });
//         });
//     });

//     describe('onClick', () => {
//         let store;
//         let actions;
//         let userActions;
//         let dispatchSpy;

//         beforeEach(() => {
//             store = require('store/Store').default;
//             actions = require('Actions').default;
//             userActions = require('actions/UserActions').default;
//             spyOn(actions, 'showCountrySwitcherModal').and.callFake((...args) => {
//                 return {
//                     action: 'showCountrySwitcherModal',
//                     args
//                 };
//             });
//             spyOn(userActions, 'switchCountry').and.callFake((...args) => {
//                 return {
//                     action: 'switchCountry',
//                     args
//                 };
//             });
//             dispatchSpy = spyOn(store, 'dispatch');
//             shallowComponent = enzyme.shallow(<CountrySwitcher />);
//         });

//         it('should dispatch showCountrySwitcherModal if country changes', () => {
//             const caLink = shallowComponent.findWhere(n => n.key() === 'CA-EN').first();
//             caLink.simulate('click');
//             expect(dispatchSpy).toHaveBeenCalledWith({
//                 action: 'showCountrySwitcherModal',
//                 args: [true, 'CA', 'EN', 'Canada']
//             });
//         });

//         it('should dispatch switchCountry if country stays the same', () => {
//             shallowComponent.setState({
//                 currCtry: 'CA',
//                 currLang: 'EN'
//             });
//             const caFrLink = shallowComponent.findWhere(n => n.key() === 'CA-FR').first();
//             caFrLink.simulate('click');
//             expect(dispatchSpy).toHaveBeenCalledWith({
//                 action: 'switchCountry',
//                 args: ['CA', 'FR']
//             });
//         });
//     });
// });
