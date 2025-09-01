const React = require('react');
const { shallow } = require('enzyme');

xdescribe('<PleaseSignIn /> component', () => {
    let PleaseSigning;
    let shallowedComponent;

    beforeEach(() => {
        PleaseSigning = require('components/RichProfile/MyAccount/PleaseSignIn').default;
        shallowedComponent = shallow(<PleaseSigning />);
    });

    it('should render text', () => {
        expect(shallowedComponent.find('Text').length).toBe(1);
    });

    it('should render sign link in text', () => {
        expect(shallowedComponent.find('Text > Link').length).toBe(1);
    });

    it('should render sign link in text with data at attribute', () => {
        expect(shallowedComponent.find('Text[data-at="myaccount_sign_in_message"]').length).toBe(1);
    });

    it('should call signInHandler', () => {
        const component = shallowedComponent.instance();
        const signInHandlerStub = spyOn(component, 'signInHandler');
        component.forceUpdate();
        shallowedComponent.update();
        shallowedComponent.find('Text > Link').simulate('click');
        expect(signInHandlerStub).toHaveBeenCalled();
    });
});
