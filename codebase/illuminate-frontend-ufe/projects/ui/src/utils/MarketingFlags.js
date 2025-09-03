import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';

const {
    biExclusiveLevels: { NONE, BI, VIB, ROUGE }
} = skuUtils;

// marketing flags in display order
const MARKETING_FLAGS_ORDERED_MAP = [
    {
        key: 'isAppExclusive',
        text: 'appExclusive'
    },
    {
        key: 'isLimitedTimeOffer',
        text: 'limitedTimeOffer'
    },
    {
        key: 'isFirstAccess',
        text: 'firstAccess'
    },
    {
        key: 'isLimitedEdition',
        text: 'limitedEdition'
    },
    {
        key: 'isSephoraExclusive',
        text: 'onlyAtSephora'
    },
    {
        key: 'isOnlineOnly',
        text: 'onlineOnly'
    },
    {
        key: 'isOnlyFewLeft',
        text: 'onlyFewLeft'
    }
];

const ABOUT_THE_PRODUCT_FLAGS = [
    {
        key: 'isNew',
        text: 'new',
        activeColor: false
    },
    {
        key: 'isComingSoonTreatment',
        text: 'comingSoon',
        activeColor: false
    },
    {
        key: 'isFirstAccess',
        text: 'firstAccess',
        activeColor: false
    },
    {
        key: 'isLimitedEdition',
        text: 'limitedEdition',
        activeColor: false
    },
    {
        key: 'isSephoraExclusive',
        text: 'onlyAtSephora',
        activeColor: false
    }
];

const PRODUCT_TILE_FLAGS = [
    {
        key: 'isNew',
        text: 'new'
    },
    {
        key: 'isComingSoonTreatment',
        text: 'comingSoon'
    },
    {
        key: 'isFirstAccess',
        text: 'firstAccess'
    },
    {
        key: 'isLimitedEdition',
        text: 'limitedEdition'
    },
    {
        key: 'isLimitedTimeOffer',
        text: 'limitedTimeOffer'
    },
    {
        key: 'isAppExclusive',
        text: 'appExclusive'
    },
    {
        key: 'isOnlineOnly',
        text: 'onlineOnly'
    }
];

const SHADE_FILTER_FLAGS = [
    {
        key: 'isOutOfStock',
        text: 'outOfStock',
        backgroundColor: 'black'
    },
    {
        key: 'salePrice',
        text: 'salePrice',
        backgroundColor: 'red'
    },
    {
        key: 'match',
        text: 'match',
        backgroundColor: 'black'
    },
    {
        key: 'isNew',
        text: 'new',
        backgroundColor: 'black'
    },
    {
        key: 'isOnlyFewLeft',
        text: 'onlyFewLeft',
        backgroundColor: 'red'
    },
    {
        key: 'isLimitedTimeOffer',
        text: 'limitedTimeOffer',
        backgroundColor: 'red'
    },
    {
        key: 'isFirstAccess',
        text: 'firstAccess',
        backgroundColor: 'black'
    },
    {
        key: 'isLimitedEdition',
        text: 'limitedEdition',
        backgroundColor: 'black'
    },
    {
        key: 'isAppExclusive',
        text: 'appExclusive',
        backgroundColor: 'black'
    }
];

export default {
    MARKETING_FLAGS_ORDERED_MAP,

    // lazy invocation for getText
    getLocaleResourceFile: function () {
        return localeUtils.getLocaleResourceFile('utils/locales', 'MarketingFlags');
    },

    getFirstValidFlagText: function (obj) {
        const getText = this.getLocaleResourceFile();
        const object = obj || {};
        let textToDisplay = null;

        for (const { key, text } of MARKETING_FLAGS_ORDERED_MAP) {
            if (object[key]) {
                textToDisplay = getText(text);

                break;
            }
        }

        return textToDisplay;
    },

    getAllValidFlagsArray(obj) {
        const getText = this.getLocaleResourceFile();
        const object = obj || {};

        return MARKETING_FLAGS_ORDERED_MAP.filter(item => object[item.key] === true).map(item => getText(item.text));
    },

    getAboutTheProductFlags(obj) {
        const getText = this.getLocaleResourceFile();
        const object = obj || {};

        return ABOUT_THE_PRODUCT_FLAGS.filter(item => !!object[item.key]).map(item => ({
            name: getText(item.text),
            activeColor: item.activeColor
        }));
    },

    getProductTileFlags(obj) {
        const getText = this.getLocaleResourceFile();
        const object = obj || {};
        const { biExclusiveLevel } = object;

        const flags = PRODUCT_TILE_FLAGS.filter(item => !!object[item.key]).map(item => getText(item.text));

        if (biExclusiveLevel === ROUGE) {
            flags.push('Rouge');
        }

        if (biExclusiveLevel === VIB) {
            flags.push('VIB');
        }

        if (biExclusiveLevel === BI) {
            flags.push('Insider');
        }

        return flags.slice(0, 3);
    },

    getShadeFilterFlags(obj) {
        const getText = this.getLocaleResourceFile();
        const sku = obj || {};
        const flags = SHADE_FILTER_FLAGS.filter(({ key }) => !!sku[key]).map(({ text, backgroundColor }) => ({
            text: getText(text),
            backgroundColor
        }));
        const { biExclusiveLevel } = sku;

        if (biExclusiveLevel !== NONE) {
            if (biExclusiveLevel === ROUGE || biExclusiveLevel === VIB || biExclusiveLevel === BI) {
                flags.push({
                    text: 'Rouge',
                    backgroundColor: 'black'
                });
            }

            if (biExclusiveLevel === VIB || biExclusiveLevel === BI) {
                flags.push({
                    text: 'VIB',
                    backgroundColor: 'black'
                });
            }

            if (biExclusiveLevel === BI) {
                flags.push({
                    text: 'Insider',
                    backgroundColor: 'black'
                });
            }
        }

        return flags;
    }
};
