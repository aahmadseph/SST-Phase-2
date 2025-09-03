const React = require('react');
const { shallow } = require('enzyme');

describe('<OrderStatusLookup /> component', () => {
    let OrderStatusLookup;
    let shallowedComponent;
    let component;
    let props;

    beforeEach(() => {
        props = {
            validateUserStatusAndGetProfileSettings: () => {}
        };
        OrderStatusLookup = require('components/RichProfile/MyAccount/OrderStatusLookup/OrderStatusLookup').default;
        shallowedComponent = shallow(<OrderStatusLookup {...props} />);
        component = shallowedComponent.instance();
        component.componentDidMount();
    });

    describe('when isReady is set to false', () => {
        beforeEach(() => {
            shallowedComponent.setState({
                isReady: false
            });
        });

        it('should not render the component if profile settings data is not ready', () => {
            component.forceUpdate();
            shallowedComponent.update();
            expect(shallowedComponent.html()).toEqual(null);
        });
    });

    describe('when isReady is set to true', () => {
        beforeEach(() => {
            shallowedComponent.setState({
                isReady: true
            });
        });

        it('should render main Box', () => {
            expect(shallowedComponent.find('Box').length).toBe(1);
        });

        it('should render look up text', () => {
            const lookupText = shallowedComponent.find('Box > Text').at(0);
            expect(lookupText.prop('children')).toBe('Look up your order');
        });

        it('should render error msg element if there is an error', () => {
            shallowedComponent.setState({ error: 'error msg' });
            expect(shallowedComponent.find('ErrorMsg').length).toBe(1);
        });
    });

    describe('find my order form', () => {
        let findMyOrderForm;

        beforeEach(() => {
            shallowedComponent.setState({ isReady: true });
            findMyOrderForm = shallowedComponent.find('form');
        });

        it('should render find order form', () => {
            expect(findMyOrderForm.length).toBe(1);
        });

        it('should render order number field', () => {
            expect(findMyOrderForm.find('TextInput').at(0).prop('label')).toBe('Order Number');
        });

        it('should render email field', () => {
            expect(findMyOrderForm.find('TextInput').at(1).prop('label')).toBe('Email Address');
        });

        it('should search button', () => {
            expect(findMyOrderForm.find('Button').prop('children')).toBe('Find my Order');
        });
    });

    it('should not render sign in text link if user is signed in', () => {
        shallowedComponent.setState({ showSignInText: false, isReady: true });
        expect(shallowedComponent.find('Box > Text').length).toBe(1);
    });
});
