import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { getLocaleResourceFile, getTextFromResource } from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const getText = getLocaleResourceFile('components/ProductPage/BeautyMatchTooltip/locales', 'BeautyMatchTooltip');

const fields = createSelector(
    createStructuredSelector({
        beautyMatchesPopupText: getTextFromResource(getText, 'beautyMatchesPopupText'),
        beautyMatchesPopupLink: getTextFromResource(getText, 'beautyMatchesPopupLink')
    }),
    textResources => {
        const { beautyMatchesPopupText, ...restTextResources } = textResources;
        const beautyMatchesPopupTextValue = `${beautyMatchesPopupText} `;

        return {
            ...restTextResources,
            beautyMatchesPopupTextValue
        };
    }
);

const withBeautyMatchTooltipProps = wrapHOC(connect(fields));

export {
    fields, withBeautyMatchTooltipProps
};
