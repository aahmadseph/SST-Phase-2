import { connect } from 'react-redux';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;

const { showStoreSwitcherModal } = Actions;

const functions = (dispatch, ownProps) => {
    const newFunctions = {};

    if (!ownProps.onDismiss) {
        newFunctions.onDismiss = () => dispatch(showStoreSwitcherModal({ isOpen: false }));
    }

    return newFunctions;
};

const withStoreSwitcherProps = wrapHOC(connect(undefined, functions));

export {
    withStoreSwitcherProps, functions
};
