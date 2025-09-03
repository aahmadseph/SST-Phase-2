import { createSelector } from 'reselect';
import { showSelector } from 'selectors/testTarget/offers/showItemSubstitution/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showItemSubstitutionSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showItemSubstitutionSelector };
