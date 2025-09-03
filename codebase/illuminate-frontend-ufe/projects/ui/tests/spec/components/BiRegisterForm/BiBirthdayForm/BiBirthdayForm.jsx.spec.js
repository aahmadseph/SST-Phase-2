describe('<BiBirthdayForm /> component', () => {
    let React;
    let BiBirthdayForm;
    let shallowedComponent;

    beforeEach(() => {
        React = require('react');
        BiBirthdayForm = require('components/BiRegisterForm/BiBirthdayForm/BiBirthdayForm').default;
        shallowedComponent = enzyme.shallow(<BiBirthdayForm />);
    });

    it('should render month select/dropdown', () => {
        expect(shallowedComponent.find({ name: 'biRegMonth' }).length).toBe(1);
    });

    it('should render day select/dropdown', () => {
        expect(shallowedComponent.find({ name: 'biRegDay' }).length).toBe(1);
    });
});
