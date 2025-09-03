import { createSelector } from 'reselect';
import modalsSelector from 'selectors/modals/modalsSelector';

const curbsideConciergeInfoModalSelector = createSelector(modalsSelector, modals => modals.curbsideConciergeInfoModal);

export default curbsideConciergeInfoModalSelector;
