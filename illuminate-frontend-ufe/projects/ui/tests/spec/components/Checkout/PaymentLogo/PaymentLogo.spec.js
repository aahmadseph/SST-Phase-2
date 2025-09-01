/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const { any } = jasmine;
const PaymentLogo = require('components/Checkout/PaymentLogo/PaymentLogo').default;
const OrderActions = require('actions/OrderActions').default;
const OrderUtils = require('utils/Order').default;
const store = require('Store').default;
const { PAYMENT_CARD_NUMBER_CHANGED } = require('constants/actionTypes/order');

let component;
let wrapper;
let props;
let paymentCardsDetectedStub;
let watchAction;
let watchActionStub;

describe('PaymentLogo component', () => {
    beforeEach(() => {
        paymentCardsDetectedStub = spyOn(OrderActions, 'paymentCardsDetected');
        watchAction = store.watchAction;
        watchActionStub = spyOn(store, 'watchAction');
        spyOn(store, 'dispatch');
        props = {
            paymentGroupType: OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD
        };
        wrapper = shallow(<PaymentLogo {...props} />);
        component = wrapper.instance();
    });

    it('should watch for card number change', () => {
        // Arrange
        store.watchAction = watchAction;
        watchActionStub = spyOn(store, 'watchAction');

        // Act
        component.componentDidMount();

        // Assert
        expect(watchActionStub).toHaveBeenCalledWith(PAYMENT_CARD_NUMBER_CHANGED, any(Function));
    });

    describe('On Number Change', () => {
        let numberHandler, detectCardTypesStub, setStateStub;

        beforeEach(() => {
            detectCardTypesStub = spyOn(component, 'detectCardTypes');
            setStateStub = spyOn(component, 'setState');
            component.componentDidMount();
            numberHandler = watchActionStub.calls.first().args[1];
        });

        it('should detect card types', () => {
            numberHandler({
                cardNumber: '4455'
            });
            expect(detectCardTypesStub).toHaveBeenCalledWith('4455', component.props.paymentGroupType);
        });

        it('should dispatch card types via action', () => {
            const cardTypes = ['blblblblb', 'sdfgsdfgqwe'];
            detectCardTypesStub.and.returnValue(cardTypes);
            numberHandler({
                cardNumber: '4455'
            });
            setStateStub.calls.mostRecent().args[1]();
            expect(paymentCardsDetectedStub).toHaveBeenCalledWith(cardTypes);
        });
    });

    describe('detectCardTypes', () => {
        let detectSephoraCardStub;
        let result;

        describe('for a Sephora credit card', () => {
            beforeEach(() => {
                detectSephoraCardStub = spyOn(OrderUtils, 'detectSephoraCard').and.returnValue('sephora');
                result = component.detectCardTypes('417601', OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD);
            });

            it('should call detectSephoraCard', () => {
                expect(detectSephoraCardStub).toHaveBeenCalledWith('417601');
            });

            it('should detect a Sephora credit card', () => {
                expect(result).toEqual(['sephora']);
            });
        });

        describe('for a non-Sephora credit card', () => {
            beforeEach(() => {
                detectSephoraCardStub = spyOn(OrderUtils, 'detectSephoraCard').and.returnValue(undefined);
                result = component.detectCardTypes('4111', OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD);
            });

            it('should call detectSephoraCard', () => {
                expect(detectSephoraCardStub).toHaveBeenCalledWith('4111');
            });

            it('should detect a visa credit card', () => {
                expect(result).toEqual(['visa']);
            });
        });

        describe('for a different payment group type', () => {
            beforeEach(() => {
                result = component.detectCardTypes('12345', OrderUtils.PAYMENT_GROUP_TYPE.PAYPAL);
            });

            it('should detect a paypal credit card', () => {
                expect(result).toEqual(['payPal']);
            });
        });
    });
});
