import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import { Link } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
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
        <LegacyGrid
            gutter={2}
            marginBottom={2}
        >
            <LegacyGrid.Cell width='fill'>
                <Link
                    padding={1}
                    margin={-1}
                    data-at={Sephora.debug.dataAt('retail_delivery_fee_label')}
                    onClick={showModal}
                >
                    {defaultText} <InfoButton marginLeft={-1} />
                </Link>
            </LegacyGrid.Cell>
            <LegacyGrid.Cell
                width='fit'
                fontWeight='bold'
                data-at={Sephora.debug.dataAt('retail_delivery_fee')}
                key='retail_delivery_fee'
            >
                {qty}
            </LegacyGrid.Cell>
        </LegacyGrid>
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
