import { connect } from 'react-redux';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;

const functions = (dispatch, ownProps) => ({
    showBiRegisterModal: () => {
        if (ownProps.SOTTrackingEvent) {
            ownProps.SOTTrackingEvent();
        }

        dispatch(
            Actions.showBiRegisterModal({
                isOpen: true,
                analyticsData: {
                    linkData: 'BBQ promo join BI',
                    pageName: 'register:bi'
                }
            })
        );
    }
});

const withJoinBiEnhancerProps = wrapHOC(connect(null, functions));

export {
    functions, withJoinBiEnhancerProps
};
