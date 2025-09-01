import { createSelector } from 'reselect';
import Empty from 'constants/empty';

const creatorProfileSelector = createSelector(
    state => state.creatorStoreFront?.creatorStoreFrontData || Empty.Object,
    data => data.creatorProfileData || Empty.Object
);

export { creatorProfileSelector };
