import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import ArSkincareActions from 'actions/ArSkincareActions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { onClickCTA } = ArSkincareActions;
const getText = getLocaleResourceFile('components/SmartSkinScan/locales', 'SmartSkinScan');
const fields = createSelector(
    coreUserDataSelector,
    createStructuredSelector({
        getStarted: getTextFromResource(getText, 'getStarted'),
        signInToGetStarted: getTextFromResource(getText, 'signInToGetStarted')
    }),
    ({ isAnonymous, isInitialized }, { getStarted, signInToGetStarted }) => {
        const isUserSignedIn = !isAnonymous && isInitialized;
        const ctaText = isUserSignedIn ? getStarted : signInToGetStarted;

        return {
            ctaText
        };
    }
);

const functions = {
    onClickCTA
};

const withSmartSkinScanProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withSmartSkinScanProps
};
