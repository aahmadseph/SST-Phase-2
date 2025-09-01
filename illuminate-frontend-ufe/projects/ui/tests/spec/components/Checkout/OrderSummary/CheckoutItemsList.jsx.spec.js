// const { shallow } = require('enzyme');
// const React = require('react');
// const CheckoutItemsList = require('components/Checkout/OrderSummary/CheckoutItemsList/CheckoutItemsList').default;

// describe('CheckoutItemsList component', () => {
//     let props;
//     let wrapper;

//     beforeEach(() => {
//         props = {
//             items: [
//                 {
//                     isReplenishment: false,
//                     sku: {
//                         brandName: 'Brand Name -',
//                         productName: 'Product Name',
//                         skuImages: {},
//                         skuId: '12345',
//                         isOnlyFewLeft: true
//                     },
//                     listPriceSubtotal: '$10.00',
//                     qty: 2
//                 },
//                 {
//                     isReplenishment: false,
//                     sku: {
//                         brandName: 'Brand Name -',
//                         productName: 'Product Name2',
//                         skuImages: {},
//                         skuId: '678910',
//                         isOnlyFewLeft: true
//                     },
//                     listPriceSubtotal: '$10.00',
//                     qty: 1
//                 },
//                 {
//                     isReplenishment: false,
//                     sku: {
//                         brandName: 'Brand Name -',
//                         productName: 'Product Name3',
//                         skuImages: {},
//                         skuId: '111213',
//                         isOnlyFewLeft: true
//                     },
//                     listPriceSubtotal: '$12.00',
//                     qty: 2
//                 }
//             ],
//             itemsVisibles: 3,
//             basketType: 'basket',
//             itemsCount: 4,
//             title: 'Shipped Items'
//         };

//         wrapper = shallow(<CheckoutItemsList {...props} />);
//     });

//     it('Should render the correct number of visible items', () => {
//         expect(wrapper.find('CheckoutItem').length).toBe(props.itemsVisibles);
//     });

//     it('Should render the "see all" link when there are more items than visible', () => {
//         props.itemsVisibles = 2;
//         wrapper = shallow(<CheckoutItemsList {...props} />);
//         expect(wrapper.find('Link').at(1).exists()).toBe(true);
//     });

//     it('Should does not render the "see all" link when all items are visible', () => {
//         expect(wrapper.find('Link').at(1).exists()).toBe(false);
//     });

//     it('Should render the correct title', () => {
//         expect(wrapper.find('Text').text()).toContain(props.title);
//     });

//     it('Should expand all items when "see all" link is clicked', () => {
//         props.itemsVisibles = 2;
//         wrapper = shallow(<CheckoutItemsList {...props} />);
//         const seeAllLink = wrapper.find('Link').at(1);
//         seeAllLink.simulate('click');
//         expect(wrapper.state('visiblesList').length).toBe(props.items.length);
//     });
// });
