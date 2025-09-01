describe('<SignInSignUp> component', () => {
    let React;
    let SignInSignUp;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        SignInSignUp = require('components/RichProfile/BeautyInsider/SignInSignUp/SignInSignUp').default;
        shallowComponent = enzyme.shallow(<SignInSignUp />);
    });

    it('should render Join Now button', () => {
        expect(shallowComponent.find('Button').at(0).prop('children')).toEqual('Join Now');
    });

    it('should render Sign In button', () => {
        expect(shallowComponent.find('Button').at(1).prop('children')).toEqual('Sign In');
    });
});
