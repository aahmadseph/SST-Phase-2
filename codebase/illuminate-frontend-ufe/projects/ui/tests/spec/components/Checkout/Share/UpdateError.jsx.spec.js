const React = require('react');
const { shallow } = require('enzyme');
const UpdateError = require('components/Checkout/Shared/UpdateError').default;
const localeUtils = require('utils/LanguageLocale').default;

describe('UpdateError component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<UpdateError />);
    });

    it('should display an error message', () => {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Shared/locales', 'UpdateError');
        const errorMessage = wrapper
            .findWhere(n => n.prop('data-at') === 'collapsed_accordion_error')
            .children()
            .text();
        expect(errorMessage).toEqual(getText('pleaseUpdateInfoMessage'));
    });
});
