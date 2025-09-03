import { connect } from 'react-redux';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;

const functions = (dispatch, ownProps) => ({
    showSignInModal: () => {
        if (ownProps.SOTTrackingEvent) {
            ownProps.SOTTrackingEvent();
        }

        dispatch(
            Actions.showSignInModal({
                isOpen: true,
                analyticsData: { linkData: 'BBQ promo sign in' }
            })
        );
    }
});

const withSignInEnhancerProps = wrapHOC(connect(null, functions));

export {
    functions, withSignInEnhancerProps
};
