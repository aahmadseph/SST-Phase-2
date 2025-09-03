const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;

describe('GlobalModalsWrapper component', () => {
    let GlobalModalsWrapper;
    let wrapper;

    beforeEach(() => {
        GlobalModalsWrapper = require('components/GlobalModals/GlobalModalsWrapper/GlobalModalsWrapper').default;
    });

    it('componentDidMount should invoke enableModals function', () => {
        // Arrange
        const props = { enableModals: createSpy('enableModals') };

        // Act
        wrapper = shallow(<GlobalModalsWrapper {...props} />);

        // Assert
        expect(props.enableModals).toHaveBeenCalledTimes(1);
    });

    it('render function should return null when renderModals undefined, null or false', () => {
        // Arrange
        const props = { renderModals: false, enableModals: () => {} };

        // Act
        wrapper = shallow(<GlobalModalsWrapper {...props} />);

        // Assert
        expect(wrapper.isEmptyRender()).toBe(true);
    });
});
