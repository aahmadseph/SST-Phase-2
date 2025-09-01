const localeUtils = require('utils/LanguageLocale').default;
const React = require('react');
const MarketingFlags = require('components/Product/MarketingFlags/MarketingFlags').default;
const marketingFlagsUtil = require('utils/MarketingFlags').default;

describe('<MarketingFlags /> component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = enzyme.mount(<MarketingFlags />);
    });

    it('should NOT render a marketing flags box if no flags were passed', () => {
        wrapper.setProps({}, () => {
            expect(wrapper.find('Box').length).toEqual(0);
        });
    });

    it('should render a box containing flags in correct order', () => {
        wrapper = enzyme.mount(<MarketingFlags />);
        const sku = { skuId: 1 };
        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'MarketingFlags');
        // fill sku with all the marketing flags
        marketingFlagsUtil.MARKETING_FLAGS_ORDERED_MAP.forEach(flag => {
            sku[flag.key] = true;
        });

        wrapper.setProps({ sku }, () => {
            const content = wrapper.find('Box').first().text();
            // search the flags text one-by-one
            let fromIndex = 0;

            for (const flag of marketingFlagsUtil.MARKETING_FLAGS_ORDERED_MAP) {
                const flagTextFoundPosition = content.indexOf(getText(flag.text).toLowerCase(), fromIndex);
                expect(flagTextFoundPosition).not.toEqual(-1);
                fromIndex = flagTextFoundPosition + flag.text.length;
            }
        });
    });
});
