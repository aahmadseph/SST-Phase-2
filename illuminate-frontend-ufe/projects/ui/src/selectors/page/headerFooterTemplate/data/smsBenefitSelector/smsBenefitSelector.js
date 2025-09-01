import { createSelector } from 'reselect';
import { dataSelector } from 'selectors/page/headerFooterTemplate/data/dataSelector';

const smsBenefitSelector = createSelector(dataSelector, data => data.smsBenefit || null);

export { smsBenefitSelector };
