import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import OrderStatusProgressionDetail from 'components/OrderConfirmation/FulfillmentStatus/OrderStatusProgressionDetail';

const FulfillmentStatus = ({
    pickupOrderStates = [],
    isCheckout,
    address,
    hrefForFaq,
    storeDetails,
    isReadyToPickUp,
    isProcessing,
    isBopisOrder,
    openCurbsideModal,
    showCurbsidePickupIndicator,
    canceledItems,
    isInStorePickup,
    isCurbsideConciergePickup,
    isSameDayOrder,
    isSDDOrderDelivered,
    trackingUrl,
    showModal,
    smsNotificationFlag,
    ...props
}) => {
    return (
        <Box
            borderRadius={2}
            paddingX={4}
            paddingY={5}
            backgroundColor='nearWhite'
            lineHeight='tight'
            {...props}
        >
            {pickupOrderStates.map((orderState, index) => (
                <OrderStatusProgressionDetail
                    isInStorePickup={isInStorePickup}
                    isCurbsideConciergePickup={isCurbsideConciergePickup}
                    storeDetails={storeDetails}
                    key={orderState.state}
                    isReadyToPickUp={isReadyToPickUp}
                    isProcessing={isProcessing}
                    isCheckout={isCheckout}
                    hrefForFaq={hrefForFaq}
                    address={address}
                    index={index}
                    isLast={index === pickupOrderStates.length - 1}
                    isBopisOrder={isBopisOrder}
                    openCurbsideModal={openCurbsideModal}
                    showCurbsidePickupIndicator={showCurbsidePickupIndicator}
                    canceledItems={canceledItems}
                    isSameDayOrder={isSameDayOrder}
                    isSDDOrderDelivered={isSDDOrderDelivered}
                    trackingUrl={trackingUrl}
                    showModal={showModal}
                    smsNotificationFlag={smsNotificationFlag}
                    {...orderState}
                />
            ))}
        </Box>
    );
};

export default wrapFunctionalComponent(FulfillmentStatus, 'FulfillmentStatus');
