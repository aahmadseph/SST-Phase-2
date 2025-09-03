import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import signinModulePhaseSelector from 'viewModel/bcc/bccRwdRewardsList/signinModulePhaseSelector';
import languageLocale from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile } = languageLocale;
const getText = getLocaleResourceFile('components/Bcc/BccRwdRewardsList/locales', 'BccRwdRewardsList');

const RewardsListConnect = connect(
    createSelector(
        coreUserDataSelector,
        signinModulePhaseSelector,
        createStructuredSelector({
            beautyInsiderRewards: getTextFromResource(getText, 'beautyInsiderRewards'),
            add: getTextFromResource(getText, 'add'),
            viewAll: getTextFromResource(getText, 'viewAll'),
            signInToAccess: getTextFromResource(getText, 'signInToAccess'),
            rougeBadgeText: getTextFromResource(getText, 'rougeBadge')
        }),
        ({ isAnonymous, isInitialized: userIsInitialized }, biSigninModulePhase, translations) => {
            return {
                translations,
                isAnonymous,
                showSkeleton: !userIsInitialized && isAnonymous,
                biSigninModulePhase
            };
        }
    )
);

export default RewardsListConnect;
