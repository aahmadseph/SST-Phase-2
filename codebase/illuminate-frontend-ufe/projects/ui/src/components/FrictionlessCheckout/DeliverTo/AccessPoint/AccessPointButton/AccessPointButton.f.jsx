import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Link, Text } from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import { globalModals, renderModal } from 'utils/globalModals';
const { FEDEX_PICKUP_LOCATION_INFO } = globalModals;
import bccUtils from 'utils/BCC';
const { ACCESS_POINT_INFO_MODAL } = bccUtils.MEDIA_IDS;

const infoModalOptions = {
    isOpen: true,
    mediaId: ACCESS_POINT_INFO_MODAL,
    titleDataAt: 'accessPointInfoModalTitle'
};

function AccessPointButton({
    label,
    title,
    accessPointHandler,
    infoModalTitle,
    showMediaModal,
    globalModalsProp,
    moreInfoLabel,
    fireInfoModalAnalytics,
    hiddeInfoButton = false
}) {
    const modalData = {
        ...globalModalsProp[FEDEX_PICKUP_LOCATION_INFO],
        title: infoModalTitle
    };

    const showInfoModal = () => {
        renderModal(modalData, () => {
            showMediaModal(infoModalOptions);
            fireInfoModalAnalytics();
        });
    };

    return (
        <Box marginTop={4}>
            {title && (
                <Box>
                    <Text
                        key='title'
                        fontWeight='bold'
                        children={title}
                        marginRight={1}
                    />{' '}
                    <InfoButton
                        aria-label={moreInfoLabel}
                        size={16}
                        onClick={showInfoModal}
                    />
                </Box>
            )}
            <Link
                color='blue'
                display='inline'
                marginRight={1}
                children={label}
                onClick={accessPointHandler}
            />
            {!hiddeInfoButton && !title && (
                <InfoButton
                    aria-label={moreInfoLabel}
                    size={16}
                    onClick={showInfoModal}
                />
            )}
        </Box>
    );
}

export default wrapFunctionalComponent(AccessPointButton, 'AccessPointButton');
//'Or Ship to FedEx Pickup Location'
