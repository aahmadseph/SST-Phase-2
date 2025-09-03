import { connect } from 'react-redux';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;

const { showChildContentModal } = Actions;
const fields = null;

const functions = dispatch => ({
    onDismiss: () => dispatch(showChildContentModal({ isOpen: false }))
});

const withChildContentModalProps = wrapHOC(connect(fields, functions));

export {
    withChildContentModalProps, fields, functions
};
