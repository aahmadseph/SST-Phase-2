const React = require('react');
const { shallow } = require('enzyme');
const HeadTitle = require('components/Reward/LoyaltyPromo/HeadTitle').default;
const basketUtils = require('utils/Basket').default;

describe('HeadTitle component', () => {
    it('should not render when "isCheckout" === false', () => {
        // Arrange
        spyOn(basketUtils, 'getAvailableBiPoints');
        const props = { getText: arg => arg };

        // Act
        const wrapper = shallow(<HeadTitle {...props} />);

        // Assert
        expect(wrapper.isEmptyRender()).toEqual(true);
    });

    it('should render available points with "data-at" attribute', () => {
        // Arrange
        const dataAtValue = 'you_now_have_points_label';
        const props = {
            getText: () => dataAtValue,
            isCheckout: true,
            availableBiPoints: 2000
        };

        // Act
        const wrapper = shallow(<HeadTitle {...props} />);
        wrapper.setState({ netBeautyBankPointsAvailable: 2000 });

        // Assert
        expect(wrapper.find(`[data-at="${dataAtValue}"]`).exists()).toEqual(true);
    });

    it('should render error message', () => {
        // Arrange
        spyOn(basketUtils, 'getAvailableBiPoints').and.returnValue(-1);
        const props = {
            getText: arg => arg,
            isCheckout: true
        };

        // Act
        const wrapper = shallow(<HeadTitle {...props} />);

        // Assert
        expect(wrapper.find('Markdown').props().color).toEqual('error');
    });
});
