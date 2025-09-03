describe('<SignInModal />', () => {
    let React;
    let SignInModal;
    let shallowComponent;
    let ModalComp;

    beforeEach(() => {
        React = require('react');
        SignInModal = require('components/GlobalModals/SignInModal/SignInModal').default;
        shallowComponent = enzyme.shallow(<SignInModal />);
    });

    it('should render a modal instance', () => {
        ModalComp = shallowComponent.find('Modal');
        expect(ModalComp.length).toBe(1);
    });

    it('should render a Sign In Form', () => {
        expect(shallowComponent.find('SignInFormNew').length).toBe(1);
    });
});
