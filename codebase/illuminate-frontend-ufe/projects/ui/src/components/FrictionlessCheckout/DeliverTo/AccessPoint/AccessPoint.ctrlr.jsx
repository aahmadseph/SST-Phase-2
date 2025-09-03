import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import AccessPointButton from 'components/FrictionlessCheckout/DeliverTo/AccessPoint/AccessPointButton/AccessPointButton';
import AccessPointModal from 'components/FrictionlessCheckout/DeliverTo/AccessPoint/AccessPointModal';
import orderUtils from 'utils/Order';

export class AccessPoint extends BaseClass {
    state = { showAccessPointModal: false };

    toggleShowAccesPointModal = () => {
        this.setState({ showAccessPointModal: !this.state.showAccessPointModal });
    };

    setAccessPoint = accessPoint => {
        const { orderDetails } = this.props;
        const shippingGroupId = orderUtils.getHardGoodShippingGroup(orderDetails)?.shippingGroupId;

        const address = {
            addressType: orderUtils.SHIPPING_METHOD_TYPES.HAL,
            address1: accessPoint?.addressLine1,
            city: accessPoint?.city,
            state: accessPoint?.state,
            postalCode: accessPoint?.zipCode,
            country: accessPoint?.country,
            altPickLocationID: accessPoint?.locationId,
            altPickLocationType: accessPoint?.pickupLocationType,
            altPickLocationPartner: accessPoint?.carrierFixed,
            altLocationPhone: accessPoint?.phoneNumber,
            halCompany: accessPoint?.companyName
        };

        const halOperatingHours = accessPoint?.operatingHours;
        this.props.createDraftHalAddress(address, shippingGroupId, halOperatingHours);
        this.props.accessPointCallback(true);
    };

    render() {
        const { showAccessPointModal } = this.state;
        const {
            localization,
            isHal,
            full,
            fullTitle,
            holdAtLocation,
            alternateLocation,
            infoModalTitle,
            showMediaModal,
            globalModals,
            moreInfoLabel,
            fireInfoModalAnalytics
        } = this.props;

        const label = !isHal ? (!full ? holdAtLocation : localization.selectLocationNearYou) : alternateLocation;

        return (
            <>
                {showAccessPointModal && (
                    <AccessPointModal
                        isOpen={showAccessPointModal}
                        onDismiss={this.toggleShowAccesPointModal}
                        callback={this.setAccessPoint}
                    />
                )}
                <AccessPointButton
                    label={label}
                    accessPointHandler={this.toggleShowAccesPointModal}
                    hiddeInfoButton={isHal}
                    infoModalTitle={infoModalTitle}
                    showMediaModal={showMediaModal}
                    globalModalsProp={globalModals}
                    moreInfoLabel={moreInfoLabel}
                    fireInfoModalAnalytics={fireInfoModalAnalytics}
                    {...(full && { title: fullTitle })}
                />
            </>
        );
    }
}

export default wrapComponent(AccessPoint, 'AccessPoint');
