const React = require('react');
const { shallow } = require('enzyme');
const BasketDesktop = require('components/InlineBasket/BasketDesktop/BasketDesktop').default;

describe('BasketDesktop component', () => {
    it('should render error message if any', () => {
        // Arrange
        const props = { basket: { error: { errorMessages: [''] } } };

        // Act
        const wrapper = shallow(<BasketDesktop {...props} />);

        // Assert
        expect(wrapper.find('ErrorMsg').exists()).toBe(true);
    });

    it('should render a TestTarget component', () => {
        // Arrange
        const props = { basket: { items: [] }, localization: {} };

        // Act
        const wrapper = shallow(<BasketDesktop {...props} />)
            .find('Footer')
            .dive();

        // Assert
        expect(wrapper.find('TestTarget').exists()).toBeTruthy();
    });

    it('should render error message using Markdown component', () => {
        // Arrange
        const props = { basket: { error: { errorMessages: [''] } } };

        // Act
        const wrapper = shallow(<BasketDesktop {...props} />);

        // Assert
        expect(wrapper.find('ErrorMsg > Markdown').exists()).toBe(true);
    });

    it('should render error message provided in "basket.error.errorMessages[0]"', () => {
        // Arrange
        const props = { basket: { error: { errorMessages: ['error text'] } } };

        // Act
        const wrapper = shallow(<BasketDesktop {...props} />);

        // Assert
        expect(wrapper.find('ErrorMsg > Markdown').prop('content')).toBe(props.basket.error.errorMessages[0]);
    });
});
