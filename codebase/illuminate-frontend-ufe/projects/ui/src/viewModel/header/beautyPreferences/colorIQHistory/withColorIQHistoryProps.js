import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { beautyInsiderAccountSelector } from 'selectors/user/beautyInsiderAccount/beautyInsiderAccountSelector';
import Empty from 'constants/empty';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Header/BeautyPreferences/ColorIQHistory/locales', 'ColorIQHistory');

const localization = createStructuredSelector({
    colorIQHistoryTitle: getTextFromResource(getText, 'colorIQHistoryTitle'),
    gotIt: getTextFromResource(getText, 'gotIt'),
    captured: getTextFromResource(getText, 'captured'),
    latest: getTextFromResource(getText, 'latest'),
    viewAll: getTextFromResource(getText, 'viewAll')
});

const fields = createSelector(beautyInsiderAccountSelector, localization, (beautyInsiderAccount, textResources) => {
    const biAccount = beautyInsiderAccount || Empty.Object;

    return { biAccount, ...textResources };
});

const withColorIQHistoryProps = wrapHOC(connect(fields));

export {
    fields, localization, withColorIQHistoryProps
};
