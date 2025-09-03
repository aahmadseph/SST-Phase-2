// describe('Payments JSX', () => {
//     let React;
//     let Payments;
//     let shallowComponent;

//     beforeEach(() => {
//         React = require('react');
//         Payments = require('components/RichProfile/MyAccount/Payments/Payments.ctrlr').PaymentsComponent;
//         shallowComponent = enzyme.shallow(<Payments />);
//     });
//     it('should render Credit Card title data-at value', () => {
//         shallowComponent.setState({
//             creditCards: [],
//             storeCredits: [],
//             paypal: {},
//             isUserReady: true,
//             user: {
//                 login: 'testuser'
//             }
//         });
//         expect(shallowComponent.find(`Text[data-at="${Sephora.debug.dataAt('form_title')}"]`).exists()).toEqual(true);
//     });
// });
