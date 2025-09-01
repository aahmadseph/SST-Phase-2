import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import { Link, Grid, Text } from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import { globalModals, renderModal } from 'utils/globalModals';

const { RETAIL_DELIVERY_FEE_INFO } = globalModals;

const { wrapFunctionalComponent } = FrameworkUtils;

function RetailDeliveryFeeItem({
    defaultText,
    qty,
    visible,
    mediaModalTitle,
    showMediaModal,
    RETAIL_DELIVERY_FEE_MODAL,
    globalModals: globalModalsData
}) {
    const showModal = () => {
        renderModal(globalModalsData[RETAIL_DELIVERY_FEE_INFO], () => {
            showMediaModal({
                isOpen: true,
                mediaId: RETAIL_DELIVERY_FEE_MODAL,
                title: mediaModalTitle,
                titleDataAt: 'retailDeliveryFeeItemModalTitle'
            });
        });
    };

    return visible ? (
        <Grid
            gap={2}
            columns='1fr auto'
        >
            <Link
                padding={1}
                margin={-1}
                data-at={Sephora.debug.dataAt('retail_delivery_fee_label')}
                onClick={showModal}
            >
                {defaultText} <InfoButton marginLeft={-1} />
            </Link>
            <Text data-at={Sephora.debug.dataAt('retail_delivery_fee')}>{qty}</Text>
        </Grid>
    ) : null;
}

RetailDeliveryFeeItem.defaultProps = {
    visible: false
};

RetailDeliveryFeeItem.propTypes = {
    defaultText: PropTypes.string.isRequired,
    qty: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    showModal: PropTypes.func
};

export default wrapFunctionalComponent(RetailDeliveryFeeItem, 'RetailDeliveryFeeItem');
