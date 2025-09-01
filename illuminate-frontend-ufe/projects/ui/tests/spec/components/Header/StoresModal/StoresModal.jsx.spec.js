const React = require('react');
const StoresModal = require('components/Header/StoresModal/StoresModal').default;

describe('<StoresModal> component', () => {
    let shallowComponent;
    let props;

    beforeEach(() => {
        props = {
            title: 'Stores Modal',
            items: {
                item1: 'item1',
                item2: 'item2'
            }
        };
        shallowComponent = enzyme.shallow(<StoresModal {...props} />);
    });

    it('should render the <StoresModal /> component', () => {
        expect(shallowComponent.find('Modal').length).toEqual(1);
    });

    it('should render the Modal header', () => {
        expect(shallowComponent.find('ModalHeader').length).toEqual(1);
    });

    it('should render the Modal body', () => {
        expect(shallowComponent.find('ModalBody').length).toEqual(1);
    });

    it('should render the Modal title', () => {
        expect(shallowComponent.find('ModalTitle').length).toEqual(1);
    });

    it('should render the correct text in the Modal title', () => {
        expect(shallowComponent.find('ModalTitle').prop('children')).toBe('Stores Modal');
    });
});
