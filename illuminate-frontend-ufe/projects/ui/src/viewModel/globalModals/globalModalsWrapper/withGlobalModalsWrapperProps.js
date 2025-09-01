import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import modalActions from 'actions/modals';
import FrameworkUtils from 'utils/framework';
import modalsSelector from 'selectors/modals/modalsSelector';

const { wrapHOC } = FrameworkUtils;
const { enableModals } = modalActions;
const fields = createSelector(modalsSelector, modals => ({ ...modals }));

const functions = { enableModals };

const withGlobalModalsWrapperProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withGlobalModalsWrapperProps
};
