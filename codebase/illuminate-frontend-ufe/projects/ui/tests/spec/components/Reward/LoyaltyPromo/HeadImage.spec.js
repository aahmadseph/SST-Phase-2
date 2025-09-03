const React = require('react');
const { shallow } = require('enzyme');
const HeadImage = require('components/Reward/LoyaltyPromo/HeadImage').default;

describe('HeadImage component', () => {
    it('should render whith default image', () => {
        // Arrange
        const defaultImage = '/img/ufe/icons/points.svg';
        const props = {};

        // Act
        const wrapper = shallow(<HeadImage {...props} />);

        // Assert
        expect(wrapper.prop('src')).toEqual(defaultImage);
    });

    it('should render custom image when provided', () => {
        // Arrange
        const customImage = 'customImage.svg';
        const props = { src: customImage };

        // Act
        const wrapper = shallow(<HeadImage {...props} />);

        // Assert
        expect(wrapper.prop('src')).toEqual(customImage);
    });

    it('should set width to 40px when "isModal" flag set to true', () => {
        // Arrange
        const width = 40;
        const props = { isModal: true };

        // Act
        const wrapper = shallow(<HeadImage {...props} />);

        // Assert
        expect(wrapper.find(`Image[width=${width}]`).exists()).toEqual(true);
    });

    it('should set width to 32px when "isModal" flag not provided or false', () => {
        // Arrange
        const width = 32;
        const props = {};

        // Act
        const wrapper = shallow(<HeadImage {...props} />);

        // Assert
        expect(wrapper.find(`Image[width=${width}]`).exists()).toEqual(true);
    });

    it('should set height to 40px when "isModal" flag set to true', () => {
        // Arrange
        const height = 40;
        const props = { isModal: true };

        // Act
        const wrapper = shallow(<HeadImage {...props} />);

        // Assert
        expect(wrapper.find(`Image[height=${height}]`).exists()).toEqual(true);
    });

    it('should set height to 32px when "isModal" flag not provided or false', () => {
        // Arrange
        const height = 32;
        const props = {};

        // Act
        const wrapper = shallow(<HeadImage {...props} />);

        // Assert
        expect(wrapper.find(`Image[height=${height}]`).exists()).toEqual(true);
    });
});
