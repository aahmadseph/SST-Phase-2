import { connect } from 'react-redux';
import Actions from 'actions/Actions';
import { createSelector } from 'reselect';
import enhancedContentPageBindings from 'analytics/bindingMethods/pages/enhancedContent/enhancedContentPageBindings';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;

const { showInfoModal } = Actions;

const fields = createSelector(() => {
    return {
        fireLinkTrackingAnalytics: () => {
            enhancedContentPageBindings.fireLinkTrackingAnalytics({ actionInfo: 'gamification:pending-points' });
        }
    };
});

const functions = {
    showInfoModal
};

const withPendingPointsProps = wrapHOC(connect(fields, functions));

export {
    withPendingPointsProps, fields, functions
};
