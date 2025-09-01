const { shallow } = require('enzyme');
const OrderSummary = require('components/Checkout/OrderSummary/OrderSummary').default;
const orderUtils = require('utils/Order').default;
const React = require('react');
const store = require('Store').default;

const defaultState = {
    priceInfo: { orderTotal: '$8.00' },
    items: {
        itemCount: 3,
        items: [{}, {}, {}]
    }
};

describe('OrderSummary component', () => {
    beforeEach(() => {
        require('react-dom/test-utils');

        spyOn(orderUtils, 'isZeroCheckout');
        spyOn(store, 'setAndWatch');
    });

    it('Items in Order should render proper amount of items', () => {
        // Arrange
        const wrapper = shallow(<OrderSummary />);

        // Act
        wrapper.setState(defaultState);

        // Assert
        expect(wrapper.find('ItemsInOrder').length).toBe(3);
    });

    it('Items in Order should render link to basket', () => {
        // Arrange
        const wrapper = shallow(<OrderSummary />);

        // Act
        wrapper.setState(defaultState);

        // Assert
        const basketLinkElem = wrapper.find('Link').get(1);
        expect(basketLinkElem.props.href).toEqual('/basket?icid2=checkout:view-basket-link');
    });

    it('Items in Order should render the proper label for link to basket', () => {
        // Arrange
        const wrapper = shallow(<OrderSummary />);

        // Act
        wrapper.setState(defaultState);

        // Assert
        const basketLinkElem = wrapper.find('Link').get(1);
        expect(basketLinkElem.props.children).toEqual('View basket');
    });
});
