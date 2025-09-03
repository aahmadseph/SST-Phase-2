import { createSelector } from 'reselect';

import { authSelector } from 'selectors/auth/authSelector';
import { userSelector } from 'selectors/user/userSelector';

import userUtils from 'utils/User';

const happeningUserDataSelector = createSelector(authSelector, userSelector, (authData, user) => {
    return {
        isSignedIn: userUtils.isSignedIn(authData),
        clientExternalId: user.login,
        email: user.login,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        smsEnabled: user.smsStatus?.isSMSOptInAvailable,
        profileId: user.profileId,
        preferredStoreInfo: user.preferredStoreInfo
    };
});

export { happeningUserDataSelector };
