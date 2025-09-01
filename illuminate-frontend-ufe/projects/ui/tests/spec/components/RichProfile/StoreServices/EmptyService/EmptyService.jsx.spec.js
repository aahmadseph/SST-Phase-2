describe('<EmptyService /> component', () => {
    let React;
    let EmptyService;
    let shallowComponent;
    let localeUtils;
    let getText;

    beforeEach(() => {
        React = require('react');
        localeUtils = require('utils/LanguageLocale').default;
        getText = localeUtils.getLocaleResourceFile('components/RichProfile/StoreServices/EmptyService/locales', 'EmptyService');
        EmptyService = require('components/RichProfile/StoreServices/EmptyService/EmptyService').default;
        shallowComponent = enzyme.shallow(<EmptyService />);
    });

    describe('Main Section', () => {
        it('should render div', () => {
            expect(shallowComponent.exists('div')).toBeTruthy();
        });

        it('should render Text', () => {
            expect(shallowComponent.find('Text').length).toEqual(2);
        });

        it('should render Header Copy with correct text', () => {
            const buttonElem = shallowComponent.find('Text').get(0);
            expect(buttonElem.props.children).toEqual(getText('emptyServiceHeaderCopy'));
        });

        it('should render Header Copy with correct text', () => {
            const buttonElem = shallowComponent.find('Text').get(1);
            expect(buttonElem.props.children).toEqual(getText('emptyServiceHeaderBody'));
        });

        it('should render Image', () => {
            expect(shallowComponent.exists('Image')).toBeTruthy();
        });

        it('should render Button', () => {
            expect(shallowComponent.exists('Button')).toBeTruthy();
        });

        it('should render Button with correct text', () => {
            const buttonElem = shallowComponent.find('Button').get(0);
            expect(buttonElem.props.children).toEqual(getText('bookReservation'));
        });
    });
});
