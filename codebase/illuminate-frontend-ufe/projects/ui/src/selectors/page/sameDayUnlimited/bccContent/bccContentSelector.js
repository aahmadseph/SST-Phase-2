import { createSelector } from 'reselect';
import sameDayUnlimitedSelector from 'selectors/page/sameDayUnlimited/sameDayUnlimitedSelector';
import Empty from 'constants/empty';

const bccContentSelector = createSelector(sameDayUnlimitedSelector, sameDayUnlimited => sameDayUnlimited.bccContent || Empty.Object);

export { bccContentSelector };
