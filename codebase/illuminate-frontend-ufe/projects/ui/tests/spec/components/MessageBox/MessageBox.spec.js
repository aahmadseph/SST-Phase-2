const React = require('react');
const { shallow } = require('enzyme');
const MessageBox = require('components/MessageBox').default;

describe('MessageBox component', () => {
    const props = { children: 'Message' };

    it('should render with a message', () => {
        // Arrange
        const component = shallow(<MessageBox {...props} />, { disableLifecycleMethods: true });

        // Act
        const message = component.findWhere(n => n.prop('children') === props.children);

        // Assert
        expect(message.exists()).toBeTruthy();
    });
});
