import { createSelector } from 'reselect';
import Empty from 'constants/empty';
import { socialInfoSelector } from 'selectors/socialInfo/socialInfoSelector';

const socialProfileSelector = createSelector(socialInfoSelector, socialInfo => socialInfo.socialProfile || Empty.Object);

export default { socialProfileSelector };
