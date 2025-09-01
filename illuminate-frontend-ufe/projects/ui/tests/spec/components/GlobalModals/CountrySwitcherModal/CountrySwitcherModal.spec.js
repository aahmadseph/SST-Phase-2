// const React = require('react');
// const { shallow } = require('enzyme');

// describe('CountrySwitcherModal component', () => {
//     let store;
//     let Actions;
//     let UserActions;
//     let CountrySwitcherModal;
//     let component;
//     let getStateStub;
//     let setStateStub;
//     let dispatchStub;
//     let showCountrySwitcherModalStub;
//     let switchCountryStub;

//     beforeEach(() => {
//         store = require('store/Store').default;
//         getStateStub = spyOn(store, 'getState').and.returnValue({ basket: { items: [{ productId: 'someProductId' }] } });
//         Actions = require('Actions').default;
//         UserActions = require('actions/UserActions').default;
//         CountrySwitcherModal = require('components/GlobalModals/CountrySwitcherModal/CountrySwitcherModal').default;
//     });

//     describe('componentDidMount method', () => {
//         beforeEach(() => {
//             const wrapper = shallow(<CountrySwitcherModal />);
//             component = wrapper.instance();
//             setStateStub = spyOn(component, 'setState');
//         });

//         it('should call getState method', () => {
//             expect(getStateStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call setState method', () => {
//             component.componentDidMount();
//             expect(setStateStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call setState method with params', () => {
//             component.componentDidMount();
//             expect(setStateStub).toHaveBeenCalledWith({ hasCommerceItems: true });
//         });
//     });

//     describe('close method', () => {
//         beforeEach(() => {
//             dispatchStub = spyOn(store, 'dispatch');
//             showCountrySwitcherModalStub = spyOn(Actions, 'showCountrySwitcherModal');
//             const wrapper = shallow(<CountrySwitcherModal />);
//             component = wrapper.instance();
//             component.close();
//         });

//         it('should call dispatch method', () => {
//             expect(dispatchStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call dispatch method params', () => {
//             expect(dispatchStub).toHaveBeenCalledWith(showCountrySwitcherModalStub());
//         });

//         it('should call showCountrySwitcher method', () => {
//             expect(showCountrySwitcherModalStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call showCountrySwitcher method params', () => {
//             expect(showCountrySwitcherModalStub).toHaveBeenCalledWith(false);
//         });
//     });

//     describe('switchCountry method', () => {
//         beforeEach(() => {
//             dispatchStub = spyOn(store, 'dispatch');
//             switchCountryStub = spyOn(UserActions, 'switchCountry');
//             const wrapper = shallow(<CountrySwitcherModal />);
//             component = wrapper.instance();
//             component.switchCountry('SomeCountry', 'SomeLanguage')();
//         });

//         it('should call dispatch method', () => {
//             expect(dispatchStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call dispatch method params', () => {
//             expect(dispatchStub).toHaveBeenCalledWith(switchCountryStub());
//         });

//         it('should call switchCountry method', () => {
//             expect(switchCountryStub).toHaveBeenCalledTimes(1);
//         });

//         it('should call switchCountry method params', () => {
//             expect(switchCountryStub).toHaveBeenCalledWith('SomeCountry', 'SomeLanguage');
//         });
//     });
// });
