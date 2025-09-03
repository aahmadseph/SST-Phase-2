describe('InfoModal JSX', () => {
    let React;
    let InfoModal;
    let shallowComponent;
    let props;
    let buttonComp;

    beforeEach(() => {
        React = require('react');
        InfoModal = require('components/GlobalModals/InfoModal/InfoModal').default;
        props = {
            isOpen: true,
            title: 'SomeTitle',
            buttonText: 'someButtonText',
            cancelText: 'someCancelText',
            showCloseButton: true,
            message: 'Some Message',
            showCancelButton: true,
            dataAt: 'some DataAt',
            dataAtTitle: 'some DataAt Title',
            dataAtMessage: 'some DataAt Message',
            dataAtMessageContext: 'basket.restrictedItemsRemoved'
        };

        shallowComponent = enzyme.shallow(<InfoModal {...props} />);
        buttonComp = shallowComponent.find('Button');
    });

    it('should render a modal instance', () => {
        expect(shallowComponent.find('Modal').length).toBe(1);
    });

    it('should render the correct modal title', () => {
        expect(shallowComponent.find('ModalTitle').children(0).text()).toBe('SomeTitle');
    });

    it('should render the correct message', () => {
        expect(shallowComponent.find('ModalBody > div').text()).toBe('Some Message');
    });

    it('should render Button component', () => {
        expect(buttonComp.length).toBe(2);
    });

    it('should render cancel button text', () => {
        expect(buttonComp.at(1).prop('children')).toBe('someCancelText');
    });

    it('should render close button text', () => {
        expect(buttonComp.at(0).prop('children')).toBe('someButtonText');
    });

    it('should render element with data-at attribute when dataAtMessageContext is provided', () => {
        expect(buttonComp.find(`Button[data-at="${Sephora.debug.dataAt('restricted_items_close')}"]`).exists()).toEqual(true);
    });

    it('should render element with data-at attribute when dataAtTitle is provided', () => {
        const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('some DataAt Title')}`);
        expect(element.exists()).toBeTruthy();
    });
    it('should render element with data-at attribute when dataAtMessage is provided', () => {
        const element = shallowComponent.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('some DataAt Message')}`);
        expect(element.exists()).toBeTruthy();
    });
});
