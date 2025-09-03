const React = require('react');
const { shallow } = require('enzyme');
const MobileConfirmModal = require('components/GlobalModals/MobileConfirmModal/MobileConfirmModal').default;

describe('MobileConfirmModal component', () => {
    let wrapper;

    beforeEach(() => {
        const props = {
            isOpen: true,
            mobileModalTitle: 'Send Me Sephora Text Alerts',
            mobileModalSubtitle: 'You’re so close. A text is on the way!',
            mobilePhone: '1234567890'
        };

        wrapper = enzyme.shallow(<MobileConfirmModal {...props} />);
    });

    it('should render component', () => {
        shallow(<MobileConfirmModal />);
    });
    it('should pass isOpen to Modal', () => {
        const modal = wrapper.find('Modal').get(0);
        expect(modal.props.isOpen).toEqual(true);
    });
    it('should render the correct modal title', () => {
        const modalTitle = wrapper.find('ModalTitle').children(0).text();
        expect(modalTitle).toBe('Send Me Sephora Text Alerts');
    });
    it('should render the correct modal subtitle', () => {
        const modalSubtitle = wrapper.find('Text').get(0);
        expect(modalSubtitle.props.children).toBe('You’re so close. A text is on the way!');
    });
    it('should render the Modal body', () => {
        const modalBody = wrapper.find('ModalBody');
        expect(modalBody.length).toEqual(1);
    });
    it('should display text in modal body', () => {
        const modalBodyText = wrapper.find('Text');
        expect(modalBodyText.length).toBe(2);
    });
    it('should display mobile phone number', () => {
        const mobilePhone = wrapper.find('strong').children(0).text();
        expect(mobilePhone).toBe('1234567890');
    });
    it('should render a button instance', () => {
        const continueShoppingButton = wrapper.find('Button');
        expect(continueShoppingButton.length).toBe(1);
    });
    it('should render a Button component containing the correct label', () => {
        const continueShoppingButton = wrapper.find('Button');
        expect(continueShoppingButton.props().children === 'Continue Shopping');
    });
});

describe('onDismiss method', () => {
    let wrapper;
    let redirectToHome;

    beforeEach(() => {
        const props = {
            redirectToHome: redirectToHome
        };

        wrapper = enzyme.shallow(<MobileConfirmModal {...props} />);
    });
    it('should call redirectToHome', () => {
        const modal = wrapper.find('Modal').get(0);
        expect(modal.props.OnDismiss).toBe(redirectToHome);
    });
});

describe('Continue Shopping button', () => {
    let wrapper;
    let redirectToHome;

    beforeEach(() => {
        const props = {
            redirectToHome: redirectToHome
        };

        wrapper = enzyme.shallow(<MobileConfirmModal {...props} />);
    });
    it('should call redirectToHome', () => {
        const buttonContinueShopping = wrapper.find('Button').get(0);
        expect(buttonContinueShopping.props.OnClick).toBe(redirectToHome);
    });
});
