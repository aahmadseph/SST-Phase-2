import { createSelector } from 'reselect';
import { creatorProfileSelector } from 'selectors/creatorStoreFront/creatorProfile/creatorProfileSelector';
import { textResourcesSelector } from 'selectors/creatorStoreFront/textResourcesSelector';
import Empty from 'constants/empty';

export const getProfileDisplaySelector = createSelector(creatorProfileSelector, textResourcesSelector, (creatorProfileData, textResources) => ({
    creatorProfileData: creatorProfileData || Empty.Object,
    textResources: textResources || Empty.Object
}));
