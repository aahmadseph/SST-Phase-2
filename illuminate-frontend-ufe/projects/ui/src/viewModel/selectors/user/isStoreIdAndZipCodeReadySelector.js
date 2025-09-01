import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';

const isStoreIdAndZipCodeReadySelector = createSelector(userSelector, user => {
    const userHasOwnProperty = property => Object.prototype.hasOwnProperty.call(user, property);
    const isStoreIdAndZipCodeReady =
        userHasOwnProperty('preferredStore') && userHasOwnProperty('preferredZipCode') && userHasOwnProperty('encryptedStoreIds');

    return isStoreIdAndZipCodeReady;
});

export { isStoreIdAndZipCodeReadySelector };
