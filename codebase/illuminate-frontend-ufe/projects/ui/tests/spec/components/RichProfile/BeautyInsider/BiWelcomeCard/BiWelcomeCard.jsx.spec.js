const React = require('react');
const { shallow } = require('enzyme');

describe('BiWelcomeCard component', function () {
    let wrapper;

    beforeEach(() => {
        const userUtils = require('utils/User').default;
        spyOn(userUtils, 'isAnonymous').and.returnValue(false);
        const BiWelcomeCard = require('components/RichProfile/BeautyInsider/BiWelcomeCard/BiWelcomeCard').default;
        wrapper = shallow(<BiWelcomeCard />, { disableLifecycleMethods: true });
    });

    it('should render BI welcome message', () => {
        // Act
        wrapper.setState({ biDown: false });

        // Assert
        const welcomeMessage = wrapper.find('BiBackground > Box > Box').props().children;
        expect(welcomeMessage).toEqual('Welcome to');
    });

    it('should render Image', () => {
        // Act
        wrapper.setState({ biDown: false });

        // Assert
        const imageSrc = wrapper.find('Image').at(0).prop('src');
        expect(imageSrc).toEqual('/img/ufe/bi/logo-beauty-insider.svg');
    });

    it('should render BI unavailable bar if BI is unavailable', () => {
        // Act
        wrapper.setState({ biDown: true });
        wrapper = wrapper.find('BiUnavailable').shallow();

        // Assert
        const iconAlert = wrapper.find('Icon[name="alert"]');
        expect(iconAlert.length).toBe(1);
    });
});
