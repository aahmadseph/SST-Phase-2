import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import { personalizationSelector } from 'viewModel/selectors/personalization/personalizationSelector';
import { isBirthdayGiftEligibleSelector } from 'viewModel/selectors/user/isBirthdayGiftEligibleSelector';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;
const { openRewardsBazaarModal } = RwdBasketActions;

const fields = createSelector(
    personalizationSelector,
    coreUserDataSelector,
    isBirthdayGiftEligibleSelector,
    (personalization, { isInitialized }, isBirthdayGiftEligible) => {
        const { personalizedComponent, isPersonalizationInitializing } = personalization;

        return {
            personalizedComponent,
            isPersonalizationInitializing,
            showSkeleton: !isInitialized || isPersonalizationInitializing,
            isBirthdayGiftEligible
        };
    }
);

const functions = {
    openRewardsBazaarModal
};

const withBirthdayMessageProps = wrapHOC(connect(fields, functions));

export {
    withBirthdayMessageProps, fields, functions
};
