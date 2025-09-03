/* eslint-disable object-curly-newline */
const React = require('react');
const { mount, shallow } = require('enzyme');

describe('CreditCardBanner component', () => {
    let CreditCardBanner;
    let wrapper;
    let localeUtils = require('utils/LanguageLocale').default;

    const TestTargetDataStub = {
        CreditCardBannerOffer: {
            text: 'some text',
            title: 'Card Title',
            imagePath: 'some/image/path',
            buttonUrl: 'some/button/url',
            buttonText: 'some button text',
            tcText: 'some Terms and Conditions text'
        }
    };

    const TestTargetDataInvisibleButtonStub = {
        CreditCardBannerOffer: {
            text: 'some text',
            title: 'Card Title'
        }
    };

    beforeEach(() => {
        localeUtils = require('utils/LanguageLocale').default;
        CreditCardBanner = require('components/CreditCard/CreditCardBanner/CreditCardBanner').default;
        window.Sephora.fantasticPlasticConfigurations.isGlobalEnabled = true;
        window.Sephora.fantasticPlasticConfigurations.isMarketingEnabled = true;
    });

    it('renders null without bannerData provided', () => {
        wrapper = mount(<CreditCardBanner />);
        expect(wrapper.html()).toEqual(null);
    });

    it('renders null if TestTarget doesnt contain campaign needed', () => {
        wrapper = mount(<CreditCardBanner testTarget={{ SomeOtherCampaign: {} }} />);
        expect(wrapper.html()).toEqual(null);
    });

    it('renders null if TestTarget contains campaign without text provided', () => {
        wrapper = mount(<CreditCardBanner testTarget={{ CreditCardBannerOffer: {} }} />);
        expect(wrapper.html()).toEqual(null);
    });

    it('renders component if TestTarget contains campaign needed', () => {
        wrapper = mount(<CreditCardBanner testTarget={TestTargetDataStub} />);
        wrapper.setState({ offers: { CreditCardBannerOffer: {} } });
        expect(wrapper.html()).not.toEqual(null);
    });

    it('doesn\'t render the component if global flag disabled', () => {
        window.Sephora.fantasticPlasticConfigurations.isGlobalEnabled = false;
        wrapper = mount(<CreditCardBanner testTarget={TestTargetDataStub} />);
        expect(wrapper.html()).toEqual(null);
    });

    it('doesn\'t render the component if marketing flag disabled', () => {
        window.Sephora.fantasticPlasticConfigurations.isMarketingEnabled = false;
        wrapper = mount(<CreditCardBanner testTarget={TestTargetDataStub} />);
        expect(wrapper.html()).toEqual(null);
    });

    it('doesn\'t render the component if current locale is not US', () => {
        spyOn(localeUtils, 'isUS').and.returnValue(false);
        wrapper = mount(<CreditCardBanner testTarget={TestTargetDataStub} />);
        expect(wrapper.html()).toEqual(null);
    });

    xit('renders image with path provided from Test&Target', () => {
        wrapper = mount(<CreditCardBanner testTarget={TestTargetDataStub} />);
        wrapper.setState({ offers: { CreditCardBannerOffer: {} } });
        expect(wrapper.find('img').get(0).props.src).toEqual(TestTargetDataStub.CreditCardBannerOffer.imagePath);
    });

    xit('renders link with url provided from Test&Target', () => {
        wrapper = mount(<CreditCardBanner testTarget={TestTargetDataStub} />);
        wrapper.setState({ offers: { CreditCardBannerOffer: {} } });
        expect(wrapper.find('a').get(0).props.href).toEqual(TestTargetDataStub.CreditCardBannerOffer.buttonUrl);
    });

    xit('renders link with text provided from Test&Target', () => {
        wrapper = mount(<CreditCardBanner testTarget={TestTargetDataStub} />);
        wrapper.setState({ offers: { CreditCardBannerOffer: {} } });
        expect(wrapper.find('a').get(0).props.children).toEqual(TestTargetDataStub.CreditCardBannerOffer.buttonText);
    });

    xit('renders the Terms and Conditions text provided from Test&Target', () => {
        wrapper = mount(<CreditCardBanner testTarget={TestTargetDataStub} />);
        wrapper.setState({ offers: { CreditCardBannerOffer: {} } });
        expect(wrapper.html()).toContain(TestTargetDataStub.CreditCardBannerOffer.tcText);
    });

    it('doesn\'t render the link if button info is not provided from Test&Target', () => {
        wrapper = mount(<CreditCardBanner testTarget={TestTargetDataInvisibleButtonStub} />);
        expect(wrapper.find('a').length).toBe(0);
    });

    it('Should render cc-outline.svg if isBopis', () => {
        wrapper = shallow(
            <CreditCardBanner
                isBopis={true}
                testTarget={TestTargetDataStub}
            />
        );

        const imageSrc = wrapper.find('Image').prop('src');
        expect(imageSrc).toEqual('/img/ufe/icons/cc-outline.svg');
    });
});
