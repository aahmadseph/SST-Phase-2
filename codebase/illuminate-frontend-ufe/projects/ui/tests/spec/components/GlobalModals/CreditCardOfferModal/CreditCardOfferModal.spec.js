const React = require('react');
const { shallow } = require('enzyme');
const CreditCardOfferModal = require('components/GlobalModals/CreditCardOfferModal/CreditCardOfferModal').default;
const store = require('Store').default;
const actions = require('Actions').default;

describe('CreditCardOfferModal component', () => {
    let component;
    let showCreditCardOfferModalStub;
    let dispatchStub;
    let wrapper;

    beforeEach(() => {
        dispatchStub = spyOn(store, 'dispatch');
        wrapper = shallow(<CreditCardOfferModal />);
        component = wrapper.instance();
    });

    describe('requestClose method', () => {
        beforeEach(() => {
            showCreditCardOfferModalStub = spyOn(actions, 'showCreditCardOfferModal');
            component.requestClose();
        });

        it('should call dispatch method', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method with params', () => {
            expect(dispatchStub).toHaveBeenCalledWith(showCreditCardOfferModalStub());
        });

        it('should call showCreditCardOfferModalStub', () => {
            expect(showCreditCardOfferModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showCreditCardOfferModalStub with params', () => {
            expect(showCreditCardOfferModalStub).toHaveBeenCalledWith({ isOpen: false });
        });
    });

    describe('modal render', () => {
        it('should render a CreditCardOfferModal', () => {
            const creditCardOfferModal = wrapper.find('Modal');
            expect(creditCardOfferModal.length).toBe(1);
        });

        it('should render with the hard coded title', () => {
            const title = wrapper.find('ModalTitle').children(0);
            expect(title.text()).toEqual('The Sephora Credit Card Program');
        });
    });
});
