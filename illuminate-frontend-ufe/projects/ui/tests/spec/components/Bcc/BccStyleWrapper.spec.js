const { shallow } = require('enzyme');
const React = require('react');

describe('BccStyleWrapper component', () => {
    let BccStyleWrapper;
    // These tests are all about the render method.  If we want to be able to use these, then
    // we'll need to actually render the component.

    beforeEach(() => {
        BccStyleWrapper = require('components/Bcc/BccStyleWrapper/BccStyleWrapper').default;
    });

    describe('BccStyleWrapper Edge Cases', () => {
        it('should properly render empty component with empty input', () => {
            // Arrange
            const props = {
                children: [],
                customStyle: {}
            };

            // Act
            const wrapper = shallow(<BccStyleWrapper {...props} />);

            // Assert
            const innerHTML = wrapper
                .children()
                .map(element => element.html())
                .join('');
            expect(innerHTML).toBe('');
        });

        it('should properly render empty component with undefined', () => {
            // Arrange
            const props = {
                children: [],
                customStyle: undefined
            };

            // Act
            const wrapper = shallow(<BccStyleWrapper {...props} />);

            // Assert
            const innerHTML = wrapper
                .children()
                .map(element => element.html())
                .join('');
            expect(innerHTML).toBe('');
        });
    });
});
