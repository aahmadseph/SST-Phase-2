const React = require('react');
const { shallow } = require('enzyme');

xdescribe('PleaseSignIn component', () => {
    let PleaseSigning;
    let auth;
    let component;

    beforeEach(() => {
        PleaseSigning = require('components/RichProfile/MyAccount/PleaseSignIn').default;
        auth = require('utils/Authentication').default;
    });

    describe('signInHandler', () => {
        it('should call auth requireAuthentication', () => {
            // Arrange
            const requireAuthenticationStub = spyOn(auth, 'requireAuthentication').and.returnValue({ catch: () => {} });
            const wrapper = shallow(<PleaseSigning />);
            component = wrapper.instance();

            // Act
            component.signInHandler();

            // Assert
            expect(requireAuthenticationStub).toHaveBeenCalled();
        });
    });
});
