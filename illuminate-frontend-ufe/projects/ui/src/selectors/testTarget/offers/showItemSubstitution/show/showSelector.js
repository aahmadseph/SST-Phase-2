import { createSelector } from 'reselect';
import { showItemSubstitutionSelector } from 'selectors/testTarget/offers/showItemSubstitution/showItemSubstitutionSelector';

const showSelector = createSelector(showItemSubstitutionSelector, showItemSubstitution => !!showItemSubstitution.show);

export { showSelector };
