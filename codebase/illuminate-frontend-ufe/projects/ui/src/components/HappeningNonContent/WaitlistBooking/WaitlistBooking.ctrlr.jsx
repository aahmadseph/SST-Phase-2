import React from 'react';

import BaseClass from 'components/BaseClass';
import { Box, Button } from 'components/ui';
import BookingInfo from 'components/HappeningNonContent/ServiceBooking/BookingInfo';
import AppointmentDetails from 'components/HappeningNonContent/ServiceBooking/AppointmentDetails';
import AppointmentOptionalFields from 'components/HappeningNonContent/ServiceBooking/AppointmentOptionalFields';
import ReviewAndPay from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay';

import { wrapComponent } from 'utils/framework';
import { showSignInModal } from 'utils/happening';
import locationUtils from 'utils/Location';

import { BOOKING_PAGE_WIDTH } from 'components/HappeningNonContent/ServiceBooking/constants';

class WaitlistBooking extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            selectedFeature: null,
            specialRequests: null
        };
    }

    handleGoToBookingFlow = e => {
        locationUtils.navigateTo(e, `/happening/services/booking/${this.props.content?.serviceInfo?.activityId}`);
    };

    setSelectedFeature = selectedFeature => this.setState({ selectedFeature });

    setSpecialRequests = specialRequests => this.setState({ specialRequests });

    componentDidMount() {
        if (!this.props.user.isSignedIn){
            showSignInModal();
        }
    }

    componentDidUpdate(prevProps) {
        const { content, user, getWaitlistBookingCSC } = this.props;

        if (user.isSignedIn && user.email !== prevProps.user.email && content.isDefaultData) {
            getWaitlistBookingCSC();
        }
    }

    render() {
        const { content, showInfoModal, user } = this.props;

        if (!user.isSignedIn || content?.isDefaultData) {
            return (
                <Button
                    variant={'secondary'}
                    width={235}
                    children={'Sign In'}
                    onClick={showSignInModal}
                />
            );
        }

        const {
            confirmationNumber,
            startDateTime,
            store,
            artist,
            serviceInfo,
            expirationDateTime
        } = content;

        const { selectedFeature, specialRequests } = this.state;

        return (
            <Box maxWidth={BOOKING_PAGE_WIDTH}>
                {/* booking info */}
                <BookingInfo
                    expirationDateTime={expirationDateTime}
                    timeZone={store?.timeZone}
                    serviceInfo={serviceInfo}
                    appointmentDetails={
                        <AppointmentDetails
                            key='appointment_details'
                            serviceInfo={serviceInfo}
                            selectedStore={store}
                            selectedTimeSlot={{ startDateTime }}
                            selectedArtist={artist}
                        />
                    }
                    appointmentOptionalFields={
                        <AppointmentOptionalFields
                            key='appointment_optional_fields'
                            serviceInfo={serviceInfo}
                            setSelectedFeature={this.setSelectedFeature}
                            setSpecialRequests={this.setSpecialRequests}
                        />
                    }
                    isWaitlistSpot
                />

                {/* review and pay */}
                <ReviewAndPay
                    serviceInfo={serviceInfo}
                    selectedStore={store}
                    selectedTimeSlot={{ startDateTime }}
                    selectedArtist={artist}
                    selectedFeature={selectedFeature}
                    specialRequests={specialRequests}
                    showInfoModal={showInfoModal}
                    user={user}
                    onClickEditAppointment={this.handleGoToBookingFlow}
                    isWaitlistSpot
                    waitlistConfirmationNumber={confirmationNumber}
                />
            </Box>
        );
    }
}

WaitlistBooking.defaultProps = {
    content: {
        store: {},
        artist: {},
        serviceInfo: {}
    },
    getWaitlistBookingCSC: () => {},
    showInfoModal: () => {},
    user: {}
};

export default wrapComponent(WaitlistBooking, 'WaitlistBooking', true);
