import { connect } from 'react-redux';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;

const { showConsumerPrivacyModal } = Actions;

const fields = null;

const functions = dispatch => ({
    requestClose: () => dispatch(showConsumerPrivacyModal({ isOpen: false }))
});

const withConsumerPrivacyModalProps = wrapHOC(connect(fields, functions));

export {
    withConsumerPrivacyModalProps, fields, functions
};
