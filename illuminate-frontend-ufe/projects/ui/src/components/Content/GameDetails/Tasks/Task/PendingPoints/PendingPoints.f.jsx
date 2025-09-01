import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import InfoButton from 'components/InfoButton/InfoButton';

const PendingPoints = ({ showInfoModal, pendingInfoTitle, pendingInfoDescription, fireLinkTrackingAnalytics }) => {
    const handleOnClick = event => {
        event.stopPropagation();
        showInfoModal({
            isOpen: true,
            title: pendingInfoTitle,
            message: pendingInfoDescription,
            footerDisplay: 'none'
        });

        fireLinkTrackingAnalytics();
    };

    return <InfoButton onClick={handleOnClick} />;
};

PendingPoints.propTypes = {
    showInfoModal: PropTypes.func.isRequired,
    pendingInfoTitle: PropTypes.string,
    pendingInfoDescription: PropTypes.string,
    fireLinkTrackingAnalytics: PropTypes.func.isRequired
};

PendingPoints.defaultProps = {
    pendingInfoTitle: '',
    pendingInfoDescription: ''
};

export default wrapFunctionalComponent(PendingPoints, 'Task');
