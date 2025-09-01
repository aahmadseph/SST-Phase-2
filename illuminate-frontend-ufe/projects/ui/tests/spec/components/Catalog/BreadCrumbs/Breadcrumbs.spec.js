// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { shallow } = require('enzyme');

// describe('BreadCrumbs component', () => {
//     let props;
//     let BreadCrumbs;
//     let wrapper;

//     beforeEach(() => {
//         BreadCrumbs = require('components/Catalog/BreadCrumbs/BreadCrumbs').default;
//         props = {
//             categoryId: '121',
//             categories: [
//                 {
//                     displayName: 'Makeup',
//                     level: 0,
//                     categoryId: '1',
//                     subCategories: [
//                         {
//                             displayName: 'Face',
//                             categoryId: '12',
//                             level: 1,
//                             subCategories: [
//                                 {
//                                     displayName: 'Foundation',
//                                     categoryId: '121',
//                                     isSelected: true,
//                                     level: 2
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ]
//         };
//     });

//     /*     describe('onClick', () => {
//         let navClickBindings;
//         let trackNavClick;

//         beforeEach(() => {
//             navClickBindings = require('analytics/bindingMethods/pages/all/navClickBindings');
//             trackNavClick = spyOn(navClickBindings, 'trackNavClick');
//         });

//         it('should call trackNavClick with the correct data', () => {
//             wrapper = shallow(<BreadCrumbs {...props} />);

//             const button = wrapper.findWhere(x => x.name() === 'Link' && x.prop('children') === 'Face');
//             button.simulate('click');

//             expect(trackNavClick).toHaveBeenCalledWith(['breadcrumb nav', 'makeup', 'face']);
//         });

//         it('should call trackNavClick with the correct data if bottom breadcrumb', () => {
//             props.isBottom = true;
//             wrapper = shallow(<BreadCrumbs {...props} />);

//             const button = wrapper.findWhere(x => x.name() === 'Link' && x.prop('children') === 'Face');
//             button.simulate('click');

//             expect(trackNavClick).toHaveBeenCalledWith(['breadcrumb nav bottom', 'makeup', 'face']);
//         });
//     }); */
// });
