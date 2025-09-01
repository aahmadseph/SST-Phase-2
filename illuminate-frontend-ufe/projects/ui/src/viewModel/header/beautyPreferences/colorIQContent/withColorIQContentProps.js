import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import { localization } from 'viewModel/header/beautyPreferences/colorIQHistory/withColorIQHistoryProps';

const { wrapHOC } = FrameworkUtils;
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const colorIQHistoryTextResources = localization;

const fields = createSelector(colorIQHistoryTextResources, beautyPreferencesSelector, (textResources, beautyPrefsState) => {
    const colorIQ = beautyPrefsState.beautyPreferences.colorIQ;

    return {
        localization: textResources,
        colorIQ
    };
});

const withColorIQContentProps = wrapHOC(connect(fields));

export { withColorIQContentProps };
