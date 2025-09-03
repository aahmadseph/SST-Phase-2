/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const ErrorMessage = require('components/Reward/LoyaltyPromo/ErrorMessage').default;

describe('ErrorMessage component', () => {
    it('should not render using default props', () => {
        // Arrange
        const props = {};

        // Act
        const wrapper = shallow(<ErrorMessage {...props} />);

        // Assert
        expect(wrapper.isEmptyRender()).toEqual(true);
    });

    it('should render error message', () => {
        // Arrange
        const props = {
            couponCode: 'morepoints',
            errorMessage: 'some error message',
            errorPromoCode: 'morepoints'
        };

        // Act
        const wrapper = shallow(<ErrorMessage {...props} />);

        // Assert
        expect(wrapper.find('ErrorMsg').prop('children')).toEqual(props.errorMessage);
    });

    it('should not render when "couponCode" does not equal "errorPromoCode"', () => {
        // Arrange
        const props = {
            couponCode: 'morepoints',
            errorMessage: 'some error message',
            errorPromoCode: 'morepoints2'
        };

        // Act
        const wrapper = shallow(<ErrorMessage {...props} />);

        // Assert
        expect(wrapper.isEmptyRender()).toEqual(true);
    });

    it('should render error message regardless "couponCode" is in upper case or not', () => {
        // Arrange
        const props = {
            couponCode: 'MOREPOINTS',
            errorMessage: 'some error message',
            errorPromoCode: 'morepoints'
        };

        // Act
        const wrapper = shallow(<ErrorMessage {...props} />);

        // Assert
        expect(wrapper.find('ErrorMsg').prop('children')).toEqual(props.errorMessage);
    });

    it('should render error message when only "errorMessage" was provided', () => {
        // Arrange
        const props = { errorMessage: 'some error message' };

        // Act
        const wrapper = shallow(<ErrorMessage {...props} />);

        // Assert
        expect(wrapper.find('ErrorMsg').prop('children')).toEqual(props.errorMessage);
    });

    it('should render data-at attribute set to "sample_data_at', () => {
        // Arrange
        const props = {
            errorMessage: 'some error message',
            'data-at': 'sample_data_at'
        };

        // Act
        const wrapper = shallow(<ErrorMessage {...props} />);

        // Assert
        expect(wrapper.find('ErrorMsg').prop('data-at')).toEqual(props['data-at']);
    });
});
