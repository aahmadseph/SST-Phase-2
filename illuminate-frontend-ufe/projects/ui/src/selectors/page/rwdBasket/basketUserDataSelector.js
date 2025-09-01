import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

import userUtils from 'utils/User';
import rwdBasketUtils from 'utils/RwdBasket';

const { getUserSDUStatus } = rwdBasketUtils;

const basketUserDataSelector = createSelector(userSelector, user => {
    const { isUserSDUTrialEligible, isUserSDUMember } = getUserSDUStatus(user.userSubscriptions);

    return {
        isSDDRougeFreeShipEligible: user.isSDDRougeFreeShipEligible,
        isSDUFeatureDown: user.isSDUFeatureDown,
        isSignedIn: user.isInitialized && !userUtils.isAnonymous(),
        firstName: user.firstName,
        preferredStoreInfo: user.preferredStoreInfo,
        preferredZipCode: user.preferredZipCode,
        userId: user.profileId,
        isBIUser: user.beautyInsiderAccount?.vibSegment != null,
        isUserSDUTrialEligible,
        isUserSDUMember,
        biStatus: (user.beautyInsiderAccount?.vibSegment || 'non_bi').toLowerCase(),
        ccRewards: user.ccRewards,
        birthdayRewardDaysLeft: userUtils.birthdayRewardDaysLeft(user.beautyInsiderAccount?.bdGiftLastDateToRedeem)
    };
});

export default { basketUserDataSelector };
