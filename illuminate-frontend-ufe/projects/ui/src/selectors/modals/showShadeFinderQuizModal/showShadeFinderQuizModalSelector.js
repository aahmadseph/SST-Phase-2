import { createSelector } from 'reselect';
import modalsSelector from 'selectors/modals/modalsSelector';

const showShadeFinderQuizModalSelector = createSelector(modalsSelector, modals => ({
    showShadeFinderQuizModal: modals.showShadeFinderQuizModal
}));

export default { showShadeFinderQuizModalSelector };
