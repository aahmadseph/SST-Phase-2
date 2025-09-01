import TopContentMessage from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopContentMessage/TopContentMessage';
import { createStructuredSelector, createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/TopContentMessages/locales', 'TopContentFreeReturns');

const localization = createStructuredSelector({
    infoIcon: getTextFromResource(getText, 'infoIcon')
});

const fields = createSelector(localization, locale => {
    return {
        localization: locale
    };
});

const withTopContentMessageProps = wrapHOC(connect(fields, null));

export default withTopContentMessageProps(TopContentMessage);
