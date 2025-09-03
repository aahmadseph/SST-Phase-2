const React = require('react');
const { shallow } = require('enzyme');
const localeUtils = require('utils/LanguageLocale').default;

const ReviewLegalText = require('components/ProductPage/RatingsAndReviews/Legal/ReviewLegalText').default;
const GuidelinesModalLink = require('components/ProductPage/RatingsAndReviews/GuidelinesModalLink').default;

describe('ReviewLegalText component', () => {
    beforeEach(() => {
        spyOn(localeUtils, 'getLocaleResourceFile').and.returnValue(arg => arg);
    });

    it('should render legalMessage text', () => {
        // Prepare
        const wrapper = shallow(<ReviewLegalText />);
        // Assert
        expect(wrapper.children().at(0).text()).toBe('legalMessage');
    });

    it('should render GuidelinesModalLink component', () => {
        //Prepare
        const wrapper = shallow(<ReviewLegalText />);

        //Assert
        expect(wrapper.find(GuidelinesModalLink).length).toBe(1);
    });
});
