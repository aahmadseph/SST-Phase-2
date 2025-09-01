import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import BeautyPreferencesActions from 'actions/BeautyPreferencesActions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { setMultipleBeautyPreferences, openShadeFinderModal } = BeautyPreferencesActions;
const getText = getLocaleResourceFile('components/Header/BeautyPreferences/RedirectProfileContent/locales', 'RedirectProfileContent');

const fields = createSelector(
    (_state, ownProps) => ownProps.beautyPreferences,
    createStructuredSelector({
        colorIQDesc1: getTextFromResource(getText, 'colorIQDesc1'),
        shadeFinder: getTextFromResource(getText, 'shadeFinder'),
        colorIQDesc2: getTextFromResource(getText, 'colorIQDesc2', ['/happening/stores/sephora-near-me'])
    }),
    (beautyPreferences, textResources) => {
        const hasColorIQ = beautyPreferences.colorIQ?.length > 0;

        return {
            ...textResources,
            hasColorIQ
        };
    }
);

const functions = {
    setMultipleBeautyPreferences,
    openShadeFinderModal
};
const withRedirectProfileContentProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withRedirectProfileContentProps
};
