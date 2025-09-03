import { createSelector } from 'reselect';
import { bccContentSelector } from 'selectors/page/sameDayUnlimited/bccContent/bccContentSelector';
import Empty from 'constants/empty';

const contentSelector = createSelector(bccContentSelector, bccContent => bccContent.content || Empty.Array);

export default { contentSelector };
