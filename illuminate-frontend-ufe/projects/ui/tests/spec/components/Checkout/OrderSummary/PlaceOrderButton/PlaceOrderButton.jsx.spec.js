const React = require('react');
const { shallow } = require('enzyme');

describe('PlaceOrderButton Component', () => {
    let PlaceOrderButton;
    let shallowComponent;
    let isKlarnaSelected;
    let isKlarnaReady;

    beforeEach(() => {
        PlaceOrderButton = require('components/Checkout/PlaceOrderButton/PlaceOrderButton').default;
        shallowComponent = shallow(<PlaceOrderButton />);
    });

    describe('should disable the PlaceOrderButton', () => {
        it('if the this.state.disabled is set to true', () => {
            shallowComponent.setState({ disabled: true });

            expect(shallowComponent.find('Button').prop('disabled')).toBe(true);
        });

        it('if the props.disabled is set to true', () => {
            shallowComponent = shallow(<PlaceOrderButton disabled={true} />);

            expect(shallowComponent.find('Button').prop('disabled')).toBe(true);
        });

        it('or when state.isKlarnaSelected is true and isKlarnaReady is false', () => {
            isKlarnaSelected = true;
            isKlarnaReady = false;
            shallowComponent.setState({
                isKlarnaSelected,
                isKlarnaReady
            });
            expect(shallowComponent.find('Button').prop('disabled')).toBe(isKlarnaSelected && !isKlarnaReady);
        });
    });

    describe('data-at attribute', () => {
        beforeEach(() => {
            shallowComponent = shallow(<PlaceOrderButton />);
        });

        it('should render place order button with data-at attribute', () => {
            expect(shallowComponent.find('Button[data-at="place_order_btn"]').length).toBe(1);
        });
    });
});
