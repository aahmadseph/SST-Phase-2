import { createSelector } from 'reselect';
import modalsSelector from 'selectors/modals/modalsSelector';

const selectedDeliveryOptionSelector = createSelector(modalsSelector, modals => modals.selectedChooseOptionsDeliveryOption);

export default selectedDeliveryOptionSelector;
