// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { shallow } = require('enzyme');

// describe('ShopModal JSX file', () => {
//     let wrapper;
//     let ShopModal;
//     const firstCategory = 'FIRST: MAKEUP';
//     const secondCategory = 'FIRST: MAKEUP -> SECOND: FACE';
//     const thirdCategory = 'FIRST: MAKEUP -> SECOND: FACE -> THIRD';
//     const makeUpCategory = {
//         componentList: [
//             {
//                 componentList: [
//                     {
//                         componentName: 'Sephora RWD Link Component',
//                         name: 'Foundation',
//                         targetUrl: '/shop/foundation-makeup',
//                         targetWindow: 0,
//                         titleText: thirdCategory
//                     },
//                     {
//                         componentName: 'Sephora RWD Link Component',
//                         componentType: 92,
//                         targetUrl: '/shop/makeup-primer-face-primer',
//                         targetWindow: 0,
//                         titleText: 'Face Primer'
//                     }
//                 ],
//                 componentName: 'Sephora RWD Link Component',
//                 componentType: 92,
//                 targetUrl: '/shop/face-makeup',
//                 targetWindow: 0,
//                 titleText: secondCategory
//             }
//         ],
//         componentName: 'Sephora RWD Link Component',
//         componentType: 92,
//         imageHeight: '80',
//         imageSource: '/contentimages/meganav/icons/shop_makeup_alt.svg',
//         imageWidth: '80',
//         targetUrl: '/shop/makeup-cosmetics',
//         targetWindow: 0,
//         titleText: firstCategory
//     };
//     const items = [
//         makeUpCategory,
//         {
//             componentList: [
//                 {
//                     componentName: 'Sephora RWD Link Component',
//                     componentType: 92,
//                     targetUrl: '/brands-list',
//                     titleText: 'Brands A-Z'
//                 },
//                 {
//                     componentName: 'Sephora RWD Link Component',
//                     enableTesting: false,
//                     targetUrl: '/brand/sephora-collection',
//                     titleText: 'Sephora Collection'
//                 },
//                 {
//                     componentName: 'Sephora RWD Link Component',
//                     componentType: 92,
//                     targetUrl: '/beauty/gifts-for-her-under-25',
//                     titleText: 'Sephora Collection Under $25'
//                 },
//                 {
//                     componentList: [
//                         {
//                             componentName: 'Sephora RWD Link Component',
//                             componentType: 92,
//                             targetUrl: '/brand/heretic',
//                             titleText: 'Heretic'
//                         },
//                         {
//                             componentName: 'Sephora RWD Link Component',
//                             componentType: 92,
//                             targetUrl: '/brand/pureology',
//                             titleText: 'Pureology'
//                         },
//                         {
//                             componentName: 'Sephora RWD Link Component',
//                             componentType: 92,
//                             targetUrl: '/brand/iconic-london',
//                             targetWindow: 0,
//                             titleText: 'Iconic London'
//                         }
//                     ],
//                     componentName: 'Sephora RWD Link Component',
//                     name: 'New Brands',
//                     targetWindow: 0,
//                     titleText: 'New Brands'
//                 }
//             ],
//             componentName: 'Sephora RWD Link Component',
//             componentType: 92,
//             imageHeight: '80',
//             imageSource: '/contentimages/meganav/icons/shop_brands_alt.svg',
//             imageWidth: '80',
//             targetUrl: '/brands-list',
//             titleText: 'Brands'
//         },
//         {
//             componentList: [
//                 {
//                     componentName: 'Sephora RWD Link Component',
//                     componentType: 92,
//                     targetUrl: '/shop/makeup-cosmetics',

//                     titleText: 'All Makeup'
//                 },
//                 {
//                     componentName: 'Sephora RWD Link Component',
//                     componentType: 92,
//                     targetUrl: '/beauty/new-makeup',
//                     titleText: 'New in Makeup'
//                 }
//             ],
//             componentName: 'Sephora RWD Link Component',
//             componentType: 92,
//             imageHeight: '80',
//             imageSource: '/contentimages/meganav/icons/shop_makeup_alt.svg',
//             imageWidth: '80',
//             name: 'Makeup',
//             targetUrl: '/shop/makeup-cosmetics',
//             titleText: 'Makeup'
//         }
//     ];

//     beforeEach(() => {
//         ShopModal = require('components/Header/ShopModal/ShopModal').default;
//     });

//     describe('render', () => {
//         beforeEach(() => {
//             wrapper = shallow(<ShopModal />);
//         });

//         it('should render Modal component', () => {
//             expect(wrapper.find('Modal').length).toEqual(1);
//         });

//         it('should render ModalHeader component', () => {
//             expect(wrapper.find('ModalHeader').length).toEqual(1);
//         });

//         it('should render ModalTitle component', () => {
//             expect(wrapper.find('ModalTitle').length).toEqual(1);
//         });

//         it('should render ModalBody component', () => {
//             expect(wrapper.find('ModalBody').length).toEqual(1);
//         });
//     });

//     describe('render first category group', () => {
//         const title = 'Shop';
//         beforeEach(() => {
//             const props = {
//                 title,
//                 items
//             };

//             wrapper = shallow(<ShopModal {...props} />);
//         });

//         it('should render 3 main categories if props.items has 3 categories', () => {
//             expect(wrapper.find('button').length).toEqual(3);
//         });

//         it('should render the first category name properly if showing all categories', () => {
//             const categoryText = wrapper.find('button').at(0).find('span').text();
//             expect(categoryText).toEqual(firstCategory);
//         });

//         it('should render ModalTitle component', () => {
//             expect(wrapper.find('ModalTitle').children(0).text()).toEqual(title);
//         });
//     });

//     describe('render second category group', () => {
//         const title = 'Shop';

//         beforeEach(() => {
//             const props = {
//                 title,
//                 items
//             };

//             wrapper = shallow(<ShopModal {...props} />).setState({ active: makeUpCategory });
//         });

//         it('should render 3 categories if active item has 3 subcategories', () => {
//             expect(wrapper.find('li').length).toEqual(0);
//         });
//     });
// });
