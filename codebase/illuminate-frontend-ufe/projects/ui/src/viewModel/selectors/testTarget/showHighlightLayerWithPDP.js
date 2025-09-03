import { createSelector } from 'reselect';
import { experienceSelector } from 'selectors/testTarget/offers/highlightLayerWithPDP/experience/experienceSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { SHOW_HIGHLIGHT_LAYER_WITH_PDP } from 'constants/TestTarget';

const showHighlightLayerWithPDP = createSelector(isTestTargetReadySelector, experienceSelector, (testReady, experience) => ({
    challengerOne: testReady && experience === SHOW_HIGHLIGHT_LAYER_WITH_PDP.CHALLENGER_ONE
}));

export { showHighlightLayerWithPDP };
