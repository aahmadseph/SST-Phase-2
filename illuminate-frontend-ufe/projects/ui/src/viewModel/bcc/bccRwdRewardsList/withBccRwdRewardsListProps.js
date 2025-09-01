import { createStructuredSelector, createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import signinModulePhaseSelector from 'viewModel/bcc/bccRwdRewardsList/signinModulePhaseSelector';

import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Bcc/BccRwdRewardsList/locales', 'BccRwdRewardsList');

const fields = createSelector(
    coreUserDataSelector,
    signinModulePhaseSelector,
    createStructuredSelector({
        add: getTextFromResource(getText, 'add'),
        viewAll: getTextFromResource(getText, 'viewAll'),
        signInToAccess: getTextFromResource(getText, 'signInToAccess')
    }),
    ({ isAnonymous, isInitialized: userIsInitialized }, biSigninModulePhase, translations) => {
        return {
            translations,
            isAnonymous,
            showSkeleton: !userIsInitialized && isAnonymous,
            biSigninModulePhase
        };
    }
);

const functions = null;

const withBccRwdRewardsListProps = wrapHOC(connect(fields, functions));

export {
    withBccRwdRewardsListProps, fields, functions
};
