describe('<SocialRegistrationModal /> component', () => {
    let React;
    let SocialRegistrationModal;
    let shallowComponent;
    let localeUtils;
    let userUtils;

    beforeEach(() => {
        React = require('react');
        SocialRegistrationModal = require('components/GlobalModals/SocialRegistrationModal/SocialRegistrationModal').default;
        userUtils = require('utils/User').default;
        shallowComponent = enzyme.shallow(<SocialRegistrationModal />);
    });

    it('should render the Modal', () => {
        expect(shallowComponent.find('Modal').length).toEqual(1);
    });

    describe('when isUserBI is set to false', () => {
        beforeEach(() => {
            spyOn(userUtils, 'isBI').and.returnValue(false);
            shallowComponent = enzyme.shallow(<SocialRegistrationModal />);
        });

        it('BiBirthdayForm should render once', () => {
            expect(shallowComponent.find('BiBirthdayForm').length).toEqual(1);
        });

        it('Modal.Footer should render two Links', () => {
            expect(shallowComponent.find('Link').length).toEqual(2);
        });
    });

    describe('when isUserBI is set to true', () => {
        beforeEach(() => {
            spyOn(userUtils, 'isBI').and.returnValue(true);
            shallowComponent = enzyme.shallow(<SocialRegistrationModal />);
        });

        it('BiRegisterForm should not render', () => {
            expect(shallowComponent.find('BiRegisterForm').length).toEqual(0);
        });

        it('Modal.Footer should render one Link component', () => {
            expect(shallowComponent.find('Link').length).toEqual(1);
        });
    });

    describe('when country is set to Canada', () => {
        beforeEach(() => {
            localeUtils = require('utils/LanguageLocale').default;
            spyOn(localeUtils, 'isCanada').and.returnValue(true);

            shallowComponent.setState({ displayJoinBIError: true });
        });

        it('should render the SubscribeEmail', () => {
            expect(shallowComponent.find('SubscribeEmail').length).toEqual(1);
        });

        it('should render a Checkbox', () => {
            expect(shallowComponent.find('Checkbox').length).toEqual(1);
        });

        it('should render an ErrorMsg when displayJoinBIError is set to true', () => {
            expect(shallowComponent.find('ErrorMsg').length).toEqual(1);
        });
    });

    describe('when country is not Canada', () => {
        beforeEach(() => {
            localeUtils = require('utils/LanguageLocale').default;
            spyOn(localeUtils, 'isCanada').and.returnValue(false);

            shallowComponent.setState({ displayJoinBIError: true });
        });

        it('should not render a BiRegisterForm component', () => {
            expect(shallowComponent.find('SubscribeEmail').length).toEqual(0);
        });

        it('should not render a Checkbox component', () => {
            expect(shallowComponent.find('Checkbox').length).toEqual(0);
        });

        it('should not render an ErrorMsg component when displayJoinBIError is set to true', () => {
            expect(shallowComponent.find('ErrorMsg').length).toEqual(0);
        });
    });
});
