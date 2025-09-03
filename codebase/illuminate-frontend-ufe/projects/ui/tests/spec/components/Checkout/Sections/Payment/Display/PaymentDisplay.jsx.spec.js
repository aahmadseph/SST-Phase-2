const React = require('react');
const { shallow } = require('enzyme');

describe('<PaymentDisplay /> component', () => {
    let shallowComponent;
    let PaymentDisplay;
    let klarnaUtils;

    beforeEach(() => {
        klarnaUtils = require('utils/Klarna').default;
        PaymentDisplay = require('components/Checkout/Sections/Payment/Display/PaymentDisplay').default;
    });

    describe('with isZeroOrder set as true', () => {
        let klarnaMessage;
        beforeEach(() => {
            spyOn(klarnaUtils, 'useKlarna').and.returnValue(true);
            klarnaMessage =
                'Klarna cannot be used for Gift Cards, Subscription, or In-store Appointment purchases; with Sephora Credit Card Rewards; or on orders with a total of $1000 or more.';
        });
        it('should display No Shipping Address or Payment required if isShippable is false', () => {
            shallowComponent = shallow(<PaymentDisplay paymentName='payWithKlarna' />);
            expect(shallowComponent.find('[data-at="Klarna_info"]').children().at(2).text()).toEqual(klarnaMessage);
        });
    });
});
