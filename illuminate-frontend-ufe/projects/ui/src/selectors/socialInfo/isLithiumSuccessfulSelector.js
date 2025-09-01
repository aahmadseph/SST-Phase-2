import { createSelector } from 'reselect';
import { socialInfoSelector } from 'selectors/socialInfo/socialInfoSelector';

const isLithiumSuccessfulSelector = createSelector(socialInfoSelector, socialInfo => socialInfo.isLithiumSuccessful);

export default { isLithiumSuccessfulSelector };
