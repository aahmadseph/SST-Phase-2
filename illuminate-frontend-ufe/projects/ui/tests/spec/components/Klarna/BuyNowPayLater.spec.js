// /* eslint-disable no-unused-vars */
// const React = require('react');
// const { shallow } = require('enzyme');
// const BuyNowPayLater = require('components/GlobalModals/BuyNowPayLaterModal/BuyNowPayLater').default;
// const { getLocaleResourceFile } = require('utils/LanguageLocale').default;
// const getText = (text, vars) => getLocaleResourceFile('components/GlobalModals/BuyNowPayLaterModal/locales', 'BuyNowPayLater')(text, vars);

// describe('BuyNowPayLater', () => {
//     let wrapper;
//     let props;

//     beforeEach(() => {
//         wrapper = require('components/GlobalModals/BuyNowPayLaterModal/BuyNowPayLater').default;
//         props = {
//             isOpen: true,
//             installmentValue: Math.random(),
//             showAfterpay: true,
//             showKlarna: true,
//             showPaypal: true,
//             requestClose: () => {},
//             getText
//         };
//         wrapper = shallow(<BuyNowPayLater {...props} />);
//     });

//     describe('render', () => {
//         it('should select Klarna as the default payment method', () => {
//             expect(wrapper.state('selectedPaymentMethod')).toBe('klarna');
//         });

//         it('should render three tabs when all payments are enabled', () => {
//             const tabsContainer = wrapper.find('Flex');
//             expect(tabsContainer.children().length).toBe(3);
//         });

//         it('should render two tabs when Paypal is not enabled', () => {
//             const newProps = {
//                 ...props,
//                 showPaypal: false
//             };
//             wrapper = shallow(<BuyNowPayLater {...newProps} />);
//             const tabsContainer = wrapper.find('Flex');
//             expect(tabsContainer.children().length).toBe(2);
//         });

//         it('should change the selected payment method to Afterpay when the Afterpay chiclet is clicked', () => {
//             wrapper
//                 .find('Chiclet')
//                 .filterWhere(node => node.key() === 'afterpay')
//                 .simulate('click');
//             expect(wrapper.state('selectedPaymentMethod')).toBe('afterpay');
//             const afterpayChiclet = wrapper.find('Chiclet').filterWhere(node => node.key() === 'afterpay');
//             expect(afterpayChiclet.prop('isActive')).toBe(true);
//         });

//         it('should update the modal body content when the payment method chiclet is clicked', () => {
//             wrapper
//                 .find('Chiclet')
//                 .filterWhere(node => node.key() === 'afterpay')
//                 .simulate('click');
//             const content = wrapper.find('BuyNowPayLaterContent');

//             expect(content.props().title).toBe('Shop now. Choose how you pay.');
//             expect(content.props().description).toBe('');
//         });

//         it('should open a payment method selected when is not the default', () => {
//             const newProps = {
//                 ...props,
//                 selectedPaymentMethod: 'klarna'
//             };
//             wrapper = shallow(<BuyNowPayLater {...newProps} />);
//             const klarnaChiclet = wrapper.find('Chiclet').filterWhere(node => node.key() === 'klarna');
//             expect(klarnaChiclet.prop('isActive')).toBe(true);
//         });
//     });
// });
