// const React = require('react');
// const { shallow } = require('enzyme');
// const DropdownMW = require('components/ContentPage/DropdownMW/DropdownMW').default;
// const urlUtils = require('utils/Url').default;

// describe('DropdownMW component', () => {
//     let wrapper;
//     let component;

//     beforeEach(() => {
//         spyOn(urlUtils, 'redirectTo');
//         wrapper = shallow(<DropdownMW />);
//         component = wrapper.instance();
//     });

//     describe('#toggleModal function', () => {
//         let setState;

//         beforeEach(() => {
//             setState = spyOn(component, 'setState');
//             component.toggleModal();
//         });
//         it('should call setState', () => {
//             expect(setState).toHaveBeenCalledTimes(1);
//         });

//         it('should toggle isActive flag to true', () => {
//             component.toggleModal();
//             expect(setState).toHaveBeenCalledWith({ isActive: true });
//         });

//         it('should toggle isActive flag to false', () => {
//             expect(component.state.isActive).toBeFalsy();
//         });
//     });

//     describe('#navigateTo function', () => {
//         it('should redirect to the url clicked', () => {
//             component.navigateTo('/new-skin-care-products');
//             expect(urlUtils.redirectTo).toHaveBeenCalledWith('/new-skin-care-products');
//         });
//     });
// });
