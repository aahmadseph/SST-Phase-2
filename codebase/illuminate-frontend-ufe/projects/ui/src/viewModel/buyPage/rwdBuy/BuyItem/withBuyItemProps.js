import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/BuyPage/RwdBuy/BuyItem/locales', 'BuyItem');

const fields = createStructuredSelector({
    text: createStructuredSelector({
        size: getTextFromResource(getText, 'size'),
        item: getTextFromResource(getText, 'item'),
        moreColors: getTextFromResource(getText, 'moreColors'),
        review: getTextFromResource(getText, 'review'),
        buyNow: getTextFromResource(getText, 'buyNow'),
        less: getTextFromResource(getText, 'less'),
        more: getTextFromResource(getText, 'more')
    })
});

const withBuyItemProps = wrapHOC(connect(fields));

export {
    withBuyItemProps, fields
};
