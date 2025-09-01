// const React = require('react');
// const { shallow } = require('enzyme');

// describe('Guest Checkout Section on Order Confirmation', function () {
//     let propsStub;
//     let shallowComponent;
//     let GuestCheckoutSection;

//     beforeEach(() => {
//         window.braze = {
//             getUser: () => ({
//                 setCustomUserAttribute: () => {},
//                 setEmail: () => {},
//                 setDateOfBirth: () => {}
//             })
//         };
//         GuestCheckoutSection = require('components/OrderConfirmation/GuestCheckoutSection/GuestCheckoutSection').default;
//     });

//     describe('for new users', () => {
//         beforeEach(() => {
//             GuestCheckoutSection = require('components/OrderConfirmation/GuestCheckoutSection/GuestCheckoutSection').default;
//             propsStub = {
//                 isExistingUser: false,
//                 isNonBIRegisteredUser: true,
//                 guestEmail: 'guest@email.com',
//                 biPoints: 250,
//                 editStore: 'GuestCheckoutSignIn',
//                 biFormTestType: 'default'
//             };
//             const wrapper = shallow(<GuestCheckoutSection {...propsStub} />);
//             shallowComponent = wrapper.setState({ showRestOfForm: true });
//         });

//         describe('Section Title', () => {
//             it('should have correct header text', () => {
//                 const title = shallowComponent.find('Text').get(0);
//                 expect(title.props.children).toEqual('Don’t forget to save your 250 points!');
//             });

//             it('should have correct sub header text', () => {
//                 const title = shallowComponent.find('Text').get(1);
//                 expect(title.props.children).toEqual('Enter a password to create your account.');
//             });
//         });

//         it('should not have forgot password link', () => {
//             const linkElem = shallowComponent.find('Link');
//             expect(linkElem.exists()).toEqual(false);
//         });

//         describe('BiRegisterForm', () => {
//             let BiRegisterForm;

//             beforeEach(() => {
//                 BiRegisterForm = shallowComponent.find('BiRegisterForm').get(0);
//             });

//             it('should exist', () => {
//                 expect(BiRegisterForm).not.toEqual(null);
//             });

//             it('should have isGuestCheckout set to true', () => {
//                 expect(BiRegisterForm.props.isGuestCheckout).toEqual(true);
//             });

//             it('should have isJoinBIChecked set to true', () => {
//                 expect(BiRegisterForm.props.isJoinBIChecked).toEqual(true);
//             });

//             it('should have correct uncheckJoinErrorMsg', () => {
//                 expect(BiRegisterForm.props.uncheckJoinErrorMsg).toEqual(
//                     'You must accept Beauty Insider Terms and Conditions in order to collect ' + '250 points from today\'s purchases.'
//                 );
//             });
//         });

//         it('should have correct text for save button', () => {
//             const Button = shallowComponent.find('Button').get(0);
//             expect(Button.props.children).toEqual('Create Account');
//         });
//     });

//     describe('for existing users', () => {
//         beforeAll(() => {
//             GuestCheckoutSection = require('components/OrderConfirmation/GuestCheckoutSection/GuestCheckoutSection').default;
//             propsStub = {
//                 isExistingUser: true,
//                 isNonBIRegisteredUser: false,
//                 guestEmail: 'guest@email.com',
//                 biPoints: 250,
//                 editStore: 'GuestCheckoutSignIn',
//                 biFormTestType: 'default'
//             };
//         });

//         beforeEach(() => {
//             const wrapper = shallow(<GuestCheckoutSection {...propsStub} />, { disableLifecycleMethods: true });
//             shallowComponent = wrapper.setState({ showRestOfForm: true });
//         });

//         it('should show immediately', () => {
//             const popoverElem = shallowComponent.find('Popover').get(0);
//             expect(popoverElem.props.showImmediately).toEqual(false);
//         });

//         describe('Section Title', () => {
//             it('should have correct header text', () => {
//                 const title = shallowComponent.find('Text').get(0);
//                 expect(title.props.children).toEqual('Don’t forget to save your 250 points!');
//             });
//         });

//         it('should have forgot password link', () => {
//             const linkElem = shallowComponent.find('Link').get(0);
//             expect(linkElem.props.children).toEqual('Forgot?');
//         });

//         it('should exist', () => {
//             const BiRegisterForm = shallowComponent.find('BiRegisterForm');
//             expect(BiRegisterForm.exists()).toEqual(false);
//         });

//         it('should have correct text for save button', () => {
//             const Button = shallowComponent.find('Button').get(0);
//             expect(Button.props.children).toEqual('Save Points');
//         });
//     });
// });
