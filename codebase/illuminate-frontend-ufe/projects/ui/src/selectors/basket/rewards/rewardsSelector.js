import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';
import Empty from 'constants/empty';

const rewardsSelector = createSelector(basketSelector, basket => basket.rewards || Empty.Array);

export default rewardsSelector;
