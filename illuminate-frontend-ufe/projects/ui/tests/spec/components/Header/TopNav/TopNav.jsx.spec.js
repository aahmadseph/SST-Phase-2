// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { shallow } = require('enzyme');

// describe('TopNav component', () => {
//     let TopNav;
//     let shallowComponent;
//     let props;
//     let state;

//     beforeEach(() => {
//         TopNav = require('components/Header/TopNav/TopNav').default;
//         props = [
//             {
//                 componentList: [
//                     {
//                         componentName: 'Sephora RWD Link Component',
//                         componentType: 92,
//                         enableTesting: false,
//                         name: 'All Just Arrived',
//                         targetUrl: '/beauty/new-beauty-products',
//                         targetWindow: 0,
//                         titleText: 'All Just Arrived'
//                     },
//                     {
//                         componentName: 'Sephora RWD Link Component',
//                         componentType: 92,
//                         enableTesting: false,
//                         name: 'New Makeup',
//                         targetUrl: '/beauty/new-makeup',
//                         targetWindow: 0,
//                         titleText: 'New Makeup'
//                     },
//                     {
//                         componentName: 'Sephora RWD Link Component',
//                         componentType: 92,
//                         enableTesting: false,
//                         name: 'New Skincare',
//                         targetUrl: '/beauty/new-skin-care-products',
//                         targetWindow: 0,
//                         titleText: 'New Skincare'
//                     }
//                 ],
//                 componentName: 'Sephora RWD Link Component',
//                 componentType: 92,
//                 enableTesting: false,
//                 imageHeight: '40',
//                 imageSource: '/contentimages/meganav/icons/shop_new.svg',
//                 imageWidth: '40',
//                 name: 'New',
//                 targetUrl: '/beauty/new-beauty-products',
//                 targetWindow: 0,
//                 titleText: 'TOP NAV ITEM 1'
//             },
//             {
//                 componentList: [
//                     {
//                         componentName: 'Sephora RWD Link Component',
//                         componentType: 92,
//                         enableTesting: false,
//                         name: 'Brands A-Z',
//                         targetUrl: '/brands-list',
//                         targetWindow: 0,
//                         titleText: 'Brands A-Z'
//                     },
//                     {
//                         componentName: 'Sephora RWD Link Component',
//                         componentType: 92,
//                         enableTesting: false,
//                         name: 'Sephora Collection Brand',
//                         targetUrl: '/brand/sephora-collection',
//                         targetWindow: 0,
//                         titleText: 'Sephora Collection'
//                     },
//                     {
//                         componentName: 'Sephora RWD Link Component',
//                         componentType: 92,
//                         enableTesting: false,
//                         name: 'Sephora Collection Under $25',
//                         targetUrl: '/beauty/gifts-for-her-under-25',
//                         targetWindow: 0,
//                         titleText: 'Sephora Collection Under $25'
//                     },
//                     {
//                         componentList: [
//                             {
//                                 componentName: 'Sephora RWD Link Component',
//                                 componentType: 92,
//                                 enableTesting: false,
//                                 name: 'ONE/SIZE by Patrick Starrr',
//                                 targetUrl: '/brand/one-size-by-patrick-starrr',
//                                 targetWindow: 0,
//                                 titleText: 'ONE/SIZE by Patrick Starrr'
//                             },
//                             {
//                                 componentName: 'Sephora RWD Link Component',
//                                 componentType: 92,
//                                 enableTesting: false,
//                                 name: 'Shani Darden Skin Care',
//                                 targetUrl: '/brand/shani-darden',
//                                 targetWindow: 0,
//                                 titleText: 'Shani Darden Skin Care'
//                             },
//                             {
//                                 componentName: 'Sephora RWD Link Component',
//                                 componentType: 92,
//                                 enableTesting: false,
//                                 name: 'Heretic',
//                                 targetUrl: '/brand/heretic',
//                                 targetWindow: 0,
//                                 titleText: 'Heretic'
//                             },
//                             {
//                                 componentName: 'Sephora RWD Link Component',
//                                 componentType: 92,
//                                 enableTesting: false,
//                                 name: 'Pureology',
//                                 targetUrl: '/brand/pureology',
//                                 targetWindow: 0,
//                                 titleText: 'Pureology'
//                             },
//                             {
//                                 componentName: 'Sephora RWD Link Component',
//                                 componentType: 92,
//                                 enableTesting: false,
//                                 name: 'Iconic London',
//                                 targetUrl: '/brand/iconic-london',
//                                 targetWindow: 0,
//                                 titleText: 'Iconic London'
//                             }
//                         ],
//                         componentName: 'Sephora RWD Link Component',
//                         componentType: 92,
//                         enableTesting: false,
//                         name: 'New Brands',
//                         targetWindow: 0,
//                         titleText: 'New Brands'
//                     }
//                 ],
//                 componentName: 'Sephora RWD Link Component',
//                 componentType: 92,
//                 enableTesting: false,
//                 imageHeight: '40',
//                 imageSource: '/contentimages/meganav/icons/shop_brands.svg',
//                 imageWidth: '40',
//                 name: 'Brands',
//                 targetUrl: '/brands-list',
//                 targetWindow: 0,
//                 titleText: 'TOP NAV ITEM 2'
//             },
//             {
//                 componentList: [
//                     {
//                         componentName: 'Sephora RWD Link Component',
//                         componentType: 92,
//                         enableTesting: false,
//                         name: 'All Tools & Brushes',
//                         targetUrl: '/shop/makeup-tools',
//                         targetWindow: 0,
//                         titleText: 'All Tools & Brushes'
//                     },
//                     {
//                         altText:
//                             'New Pro Brushes 100% vegan brushes at a way-nice price. Shop now. New & Only at Sephora hands with light and medium-deep skintones holding Sephora Collection Brushes.',
//                         componentName: 'Sephora RWD Link Component',
//                         componentType: 92,
//                         enableTesting: false,
//                         imageHeight: '294',
//                         imageSource: '/contentimages/meganav/large/2020-07-29-pro-brushes-site-desktop-global-navigation-button.jpg',
//                         imageWidth: '294',
//                         name: 'SC Brush Banner 1',
//                         targetUrl: '/beauty/makeup-brush-guide',
//                         targetWindow: 0
//                     }
//                 ],
//                 componentName: 'Sephora RWD Link Component',
//                 componentType: 92,
//                 enableTesting: false,
//                 imageHeight: '40',
//                 imageSource: '/contentimages/meganav/icons/shop_tools.svg',
//                 imageWidth: '40',
//                 name: 'Tools & Brushes',
//                 targetUrl: '/shop/makeup-tools',
//                 targetWindow: 0,
//                 titleText: 'TOP NAV ITEM 3'
//             }
//         ];
//         state = {
//             openIndex: null,
//             hasDelay: true,
//             experience: 'new',
//             navItems: [{}]
//         };
//     });

//     describe('render', () => {
//         beforeEach(() => {
//             props = { items: [{}, {}, {}] };
//             shallowComponent = shallow(<TopNav {...props} />);
//         });

//         it('should render a nav element for the top navigation', () => {
//             const dataAt = shallowComponent.findWhere(n => n.name() === 'nav' && n.prop('data-at') === 'cat_nav');

//             expect(dataAt.length).toEqual(0);
//         });

//         it('should render the amount of TopNavItems passed as items on props', () => {
//             expect(shallowComponent.find('TopNavItem').length).toEqual(0);
//         });
//     });
// });
