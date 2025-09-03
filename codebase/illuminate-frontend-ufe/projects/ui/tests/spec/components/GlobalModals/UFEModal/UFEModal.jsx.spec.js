describe('<UFEModal/ >', () => {
    let React;
    let UFEModal;
    let shallowedComponent;

    beforeEach(() => {
        React = require('react');
        UFEModal = require('components/GlobalModals/UFEModal/UFEModal').default;
        shallowedComponent = enzyme.shallow(<UFEModal />);
    });

    it('should render Modal component', () => {
        expect(shallowedComponent.find('Modal').length).toBe(1);
    });

    it('should render BccComponentList component', () => {
        expect(shallowedComponent.find('BccComponentList').length).toBe(1);
    });
});
