const React = require('react');
const { shallow } = require('enzyme');
const Link = require('components/Link/Link').default;

describe('Link component', () => {
    it('should render with "data-at" attribute when "data-at" property is provided in props object', () => {
        // Arrange
        const props = { ['data-at']: 'data-at-value' };

        // Act
        const wrapper = shallow(<Link {...props} />);

        // Assert
        expect(wrapper.find(`[data-at="${props['data-at']}"]`).exists()).toEqual(true);
    });
});
