import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';

const { wrapHOC } = FrameworkUtils;
const fields = null;

const functions = dispatch => ({
    openModal: mediaId => dispatch(Actions.showMediaModal({ isOpen: true, mediaId: mediaId })),
    openContentfulModal: data => dispatch(Actions.showContentModal({ isOpen: true, data }))
});

const withActiveCampaignProps = wrapHOC(connect(fields, functions));

export {
    withActiveCampaignProps, fields, functions
};
