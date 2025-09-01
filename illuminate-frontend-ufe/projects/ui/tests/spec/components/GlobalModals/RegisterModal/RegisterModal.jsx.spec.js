describe('Register Modal', function () {
    let React;
    let component;
    let RegisterModal;

    beforeEach(() => {
        React = require('react');
        RegisterModal = require('components/GlobalModals/RegisterModal/RegisterModal').default;
        component = enzyme.shallow(<RegisterModal />);
    });

    it('should render main modal component', () => {
        expect(component.find('Modal').length).toBe(1);
    });

    it('should show the modal title', () => {
        const modalHeaderTitle = component.find('Modal > ModalHeader > ModalTitle');
        expect(modalHeaderTitle.prop('children')).toBe('Create An Account');
    });

    it('should send isRegisterModal prop to RegisterForm', () => {
        const registerForm = component.find('Modal > ModalBody > RegisterForm');
        expect(registerForm.prop('isRegisterModal')).toBeTruthy();
    });

    // describe('Deactivate the FocusTrap for Google ReCaptcha', () => {
    //     beforeEach(function () {
    //         component = enzyme.mount(<RegisterModal />);
    //         component.setState({ isHidden: true });
    //         component.setProps({ isOpen: true });
    //     });

    //     it('should render the Modal with the isHidden prop set to true', () => {
    //         expect(component.find('Modal').props().isHidden).toBe(true);
    //     });

    //     it('should render the FocusTrap with the active prop set to false', () => {
    //         expect(component.find('Modal').children().props().active).toBe(false);
    //     });
    // });
});
