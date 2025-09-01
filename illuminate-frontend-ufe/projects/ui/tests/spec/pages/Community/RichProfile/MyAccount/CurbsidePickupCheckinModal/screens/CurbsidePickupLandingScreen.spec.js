const React = require('react');
const { shallow } = require('enzyme');

const Modal = require('components/Modal/Modal').default;
const CurbsidePickupLandingScreen =
    require('pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/screens/CurbsidePickupLandingScreen').default;

describe('CurbsidePickupLandingScreen', () => {
    const renderComponent = (overrideProps = {}) => {
        const defaultProps = {
            storeDetails: {
                address: { phone: '(409) 523 5823' },
                displayName: 'Some store'
            },
            hasBodyScroll: false,
            goToNextScreen: jasmine.createSpy()
        };
        const props = {
            ...defaultProps,
            ...overrideProps
        };
        const component = shallow(<CurbsidePickupLandingScreen {...props} />);

        return {
            component,
            props
        };
    };

    it('should should render a 1 modal body', () => {
        const { component } = renderComponent();

        expect(component.find(Modal.Body).exists()).toBeTruthy();
    });

    it('should render 3 text blocks inside a modal body', () => {
        const { component } = renderComponent();

        const modalBody = component.find(Modal.Body).first();

        expect(modalBody.find('Text').length).toBe(3);
    });

    it('should render 1 button inside a modal body', () => {
        const { component } = renderComponent();

        const modalBody = component.find(Modal.Body).first();

        expect(modalBody.find('Button').exists()).toBeTruthy();
    });

    it('should render 1 image inside a modal body', () => {
        const { component } = renderComponent();

        const modalBody = component.find(Modal.Body).first();

        expect(modalBody.find('Image').exists()).toBeTruthy();
    });

    it('should pass hasBodyScroll to the Modal Body', () => {
        const { component } = renderComponent({ hasBodyScroll: true });

        expect(component.find(Modal.Body).first().props().hasBodyScroll).toBeTrue();
    });

    it('should not render phone block if phone is absent', () => {
        const { component } = renderComponent({ storeDetails: { displayName: 'Some store' } });

        expect(component.find('Text').length).toBe(2);
    });

    it('should render a link', () => {
        const { component } = renderComponent();

        const link = component.find('Link').first();

        expect(link).toBeTruthy();
    });

    it('should render a link with the phone href', () => {
        const { component } = renderComponent();

        const link = component.find('Link').first();

        expect(link.props().href).toBe('tel:1-409-523-5823');
    });

    it('should render a link with the phone text', () => {
        const { component } = renderComponent();

        const link = component.find('Link').first();

        expect(link.props().children).toBe('(409) 523 5823');
    });

    it('should render a store name with Sephora prefix', () => {
        const { component } = renderComponent();

        const text = component.find('Text').last();

        // NOTE: there's no space between call and Sephora due to a <br /> tag, it's not a bug
        // just a way text() function works
        expect(text.text()).toBe('If you have any questions, please callSephora Some store (409) 523 5823');
    });

    it('should call goToNextScreen function on Button click', () => {
        const { component, props } = renderComponent();

        const button = component.find('Button').first();
        button.simulate('click');

        expect(props.goToNextScreen).toHaveBeenCalledTimes(1);
    });
});
