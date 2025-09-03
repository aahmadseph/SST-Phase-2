import { connect } from 'react-redux';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;
const { showBccModal } = Actions;

const fields = null;

const functions = dispatch => ({
    toggleFromParent: () => dispatch(showBccModal({ isOpen: false }))
});

const withBccModalProps = wrapHOC(connect(fields, functions));

export {
    withBccModalProps, fields, functions
};
