describe('<CreditCardPrescreenModal />', () => {
    let React;
    let CreditCardPrescreenModal;

    beforeEach(() => {
        React = require('react');
        CreditCardPrescreenModal = require('components/GlobalModals/CreditCardPrescreenModal/CreditCardPrescreenModal').default;
    });

    describe('with content prop', () => {
        let shallowComponent;
        const content = {
            title: 'Creditcard Prescreen',
            regions: { content: {} }
        };

        beforeEach(() => {
            shallowComponent = enzyme.shallow(<CreditCardPrescreenModal content={content} />);
        });

        it('should render a Modal', () => {
            const ModalComp = shallowComponent.find('Modal');
            expect(ModalComp.length).toBe(1);
        });

        it('should render with a custom title from content.title', () => {
            const title = shallowComponent.find('ModalTitle').children(0);
            expect(title.text()).toEqual(content.title);
        });

        it('should render with a BCCComponentList on Body', () => {
            const body = shallowComponent.find('ModalBody').at(0);
            expect(body.childAt(0).name()).toEqual('BccComponentList');
        });

        it('should render the BCCComponentList from content.regions.content', () => {
            const body = shallowComponent.find('ModalBody').at(0);
            expect(body.childAt(0).prop('items')).toEqual(content.regions.content);
        });
    });

    it('should render with a default title', () => {
        const content = { regions: { content: {} } };

        const shallowComponent = enzyme.shallow(<CreditCardPrescreenModal content={content} />);

        const title = shallowComponent.find('ModalTitle').children(0);
        expect(title.text()).toEqual('Sephora Credit Card');
    });
});
