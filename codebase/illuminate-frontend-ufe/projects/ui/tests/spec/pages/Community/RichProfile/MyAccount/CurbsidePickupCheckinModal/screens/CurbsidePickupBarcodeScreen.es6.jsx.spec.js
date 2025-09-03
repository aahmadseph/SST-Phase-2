const React = require('react');
const { shallow } = require('enzyme');

const Modal = require('components/Modal/Modal').default;
const CurbsidePickupBarcodeScreen =
    require('pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/screens/CurbsidePickupBarcodeScreen').default;

describe('CurbsidePickupBarcodeScreen', () => {
    const renderComponent = (overrideProps = {}) => {
        const defaultProps = {
            storeDetails: {
                address: { phone: '(409) 523 5823' },
                displayName: 'Some store'
            },
            hasBodyScroll: false,
            orderId: '256',
            dismissModal: jasmine.createSpy()
        };

        const props = {
            ...defaultProps,
            ...overrideProps
        };

        const component = shallow(<CurbsidePickupBarcodeScreen {...props} />);

        return {
            component,
            props
        };
    };

    it('should render 1 modal body', () => {
        const { component } = renderComponent();

        const modalBody = component.find(Modal.Body).first();

        expect(modalBody.exists()).toBeTruthy();
    });

    it('should render 1 image in the modal body', () => {
        const { component } = renderComponent();

        const modalBody = component.find(Modal.Body).first();

        expect(modalBody.find('Image').exists()).toBeTruthy();
    });

    it('should render 5 text blocks in the modal body', () => {
        const { component } = renderComponent();

        const modalBody = component.find(Modal.Body).first();

        expect(modalBody.find('Text').length).toBe(5);
    });

    it('should render 1 barcode in the modal body', () => {
        const { component } = renderComponent();

        const modalBody = component.find(Modal.Body).first();

        expect(modalBody.find('Barcode').exists()).toBeTruthy();
    });

    it('should render a modal footer', () => {
        const { component } = renderComponent();

        const modalFooter = component.find(Modal.Footer).first();

        expect(modalFooter.exists()).toBeTruthy();
    });

    it('should render 1 button in the modal footer', () => {
        const { component } = renderComponent();

        const modalFooter = component.find(Modal.Footer).first();

        expect(modalFooter.find('Button').exists()).toBeTruthy();
    });

    it('should pass hasBodyScroll to the Modal Body', () => {
        const { component } = renderComponent({ hasBodyScroll: true });

        expect(component.find(Modal.Body).first().props().hasBodyScroll).toBeTrue();
    });

    it('should not render phone block if phone is absent', () => {
        const { component } = renderComponent({ storeDetails: { displayName: 'Some store' } });

        expect(component.find('Text').length).toBe(4);
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

    it('should call dismissModal function on Button click', () => {
        const { component, props } = renderComponent();

        const button = component.find('Button').first();
        button.simulate('click');

        expect(props.dismissModal).toHaveBeenCalledTimes(1);
    });

    it('should pass an id to the barcode component', () => {
        const { component, props } = renderComponent();

        const barcode = component.find('Barcode').first();
        expect(barcode.props().id).toBe(`BP-${props.orderId}`);
    });

    it('should pass a code to the barcode component', () => {
        const { component } = renderComponent();

        const barcode = component.find('Barcode').first();
        expect(barcode.props().code).toBe('CODE128');
    });
});
