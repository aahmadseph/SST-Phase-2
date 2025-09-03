import { createSelector } from 'reselect';
import { simplifyPickupSelector } from 'selectors/testTarget/offers/simplifyPickup/simplifyPickupSelector';

const experienceSelector = createSelector(simplifyPickupSelector, simplifyPickup => simplifyPickup.experience);

export { experienceSelector };
