import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';

import history from 'selectors/historyLocation/historyLocationSelector';
import BuySelector from 'selectors/page/buy/buySelector';

import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { buySelector } = BuySelector;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/BuyPage/RwdBuy/locales', 'BuyPage');

const fields = createStructuredSelector({
    history,
    buyData: buySelector,
    text: createStructuredSelector({
        relatedOn: getTextFromResource(getText, 'relatedOnText'),
        preferredProducts: getTextFromResource(getText, 'prefferedProducts'),
        productsRelated: getTextFromResource(getText, 'productsRelated')
    })
});

const withBuyPageProps = wrapHOC(connect(fields));

export {
    withBuyPageProps, fields
};
