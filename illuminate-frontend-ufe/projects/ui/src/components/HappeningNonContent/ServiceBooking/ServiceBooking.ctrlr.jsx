import React from 'react';
import { wrapComponent } from 'utils/framework';

import { getRebookingInfo, showSignInModal } from 'utils/happening';
import UI from 'utils/UI';

import BaseClass from 'components/BaseClass';
import { Box } from 'components/ui';
import BookingInfo from 'components/HappeningNonContent/ServiceBooking/BookingInfo';
import PickStore from 'components/HappeningNonContent/ServiceBooking/PickStore';
import PickArtistDateTime from 'components/HappeningNonContent/ServiceBooking/PickArtistDateTime';
import AppointmentDetails from 'components/HappeningNonContent/ServiceBooking/AppointmentDetails';
import AppointmentOptionalFields from 'components/HappeningNonContent/ServiceBooking/AppointmentOptionalFields';
import ReviewAndPay from 'components/HappeningNonContent/ServiceBooking/ReviewAndPay';

import { BOOKING_PAGE_WIDTH } from 'components/HappeningNonContent/ServiceBooking/constants';

const STEPS = {
    PICK_STORE: 1,
    PICK_ARTIST_DATE_TIME: 2,
    REVIEW_AND_PAY: 3
};

class ServiceBooking extends BaseClass {
    constructor(props) {
        super(props);

        const storesList = props.content.stores;
        const selectedStore = storesList[0];

        this.state = {
            step: STEPS.PICK_STORE,
            storesList,
            selectedStore,
            preferredStore: selectedStore,
            updateStoresList: false,
            selectedDate: null,
            selectedTimeSlot: null,
            selectedArtist: null,
            selectedFeature: null,
            specialRequests: null,
            isReschedule: false,
            rebookingZipCode: null,
            rebookingStoreId: null,
            rebookingArtistId: null,
            rescheduleConfirmationNumber: null,
            isGuestBooking: false
        };
    }

    handleGoToStep = (step, setCompactHeaderAndFooter) => () => {
        this.setState({ step });
        UI.scrollToTop();
        setCompactHeaderAndFooter && this.props.setCompactHeaderAndFooter(false);
    };

    handleGoToPickArtistDateTimeStep = (selectedStore, newstoresList) => {
        const updateStoresList = selectedStore.storeId !== newstoresList[0].storeId;

        this.setState({
            step: STEPS.PICK_ARTIST_DATE_TIME,
            selectedStore,
            storesList: newstoresList,
            updateStoresList
        });

        UI.scrollToTop();
    };

    handleGoToReviewAndPayStep = (selectedDate, selectedTimeSlot, selectedArtist, isGuestBooking = false, potentialBIPoints = null) => {
        const { user, setCompactHeaderAndFooter } = this.props;

        if (user.isSignedIn || isGuestBooking) {
            this.setState({
                step: STEPS.REVIEW_AND_PAY,
                selectedDate,
                selectedTimeSlot,
                selectedArtist,
                isGuestBooking,
                potentialBIPoints
            });
            UI.scrollToTop();
            setCompactHeaderAndFooter(true);
        } else {
            showSignInModal(() => this.handleGoToReviewAndPayStep(selectedDate, selectedTimeSlot, selectedArtist));
        }
    };

    setSelectedFeature = selectedFeature => this.setState({ selectedFeature });

    setSpecialRequests = specialRequests => this.setState({ specialRequests });

    setRebookingInfo = () => {
        const {
            rebookingStoreId, rebookingZipCode, rebookingArtistId, rescheduleConfirmationNumber, waitlistInfo
        } = getRebookingInfo();

        if (rebookingStoreId) {
            const { storesList, selectedStore } = this.state;

            this.setState({
                isReschedule: rescheduleConfirmationNumber,
                step: STEPS.PICK_ARTIST_DATE_TIME,
                selectedStore: storesList.find(store => store.storeId === rebookingStoreId) || selectedStore,
                rebookingZipCode,
                rebookingStoreId,
                rebookingArtistId,
                rescheduleConfirmationNumber,
                waitlistInfo
            });
        }
    };

    renderStep = ({
        serviceInfo,
        step,
        selectedStore,
        storesList,
        selectedFeature,
        specialRequests,
        user,
        openInfoWindow,
        showInfoModal,
        selectedDate,
        rebookingStoreId,
        rebookingArtistId,
        selectedTimeSlot,
        selectedArtist,
        rescheduleConfirmationNumber,
        isReschedule,
        updateStoresList,
        showInterstice,
        preferredStore,
        waitlistInfo,
        isGuestBooking,
        potentialBIPoints
    }) => {
        switch (step) {
            case STEPS.PICK_ARTIST_DATE_TIME: {
                // step 2: Pick an artist / date / time
                return (
                    <PickArtistDateTime
                        selectedStore={selectedStore}
                        selectedArtist={selectedArtist}
                        selectedDate={selectedDate}
                        selectedTimeSlot={selectedTimeSlot}
                        serviceInfo={serviceInfo}
                        rebookingStoreId={rebookingStoreId}
                        rebookingArtistId={rebookingArtistId}
                        onClickEditStore={this.handleGoToStep(STEPS.PICK_STORE)}
                        onClickCTA={this.handleGoToReviewAndPayStep}
                        isReschedule={isReschedule}
                        user={user}
                        waitlistInfo={waitlistInfo}
                    />
                );
            }

            case STEPS.REVIEW_AND_PAY: {
                // step 3: Review and pay
                return (
                    <ReviewAndPay
                        selectedTimeSlot={selectedTimeSlot}
                        selectedStore={selectedStore}
                        selectedArtist={selectedArtist}
                        selectedFeature={selectedFeature}
                        specialRequests={specialRequests}
                        rescheduleConfirmationNumber={rescheduleConfirmationNumber}
                        showInfoModal={showInfoModal}
                        serviceInfo={serviceInfo}
                        user={user}
                        onClickEditAppointment={this.handleGoToStep(STEPS.PICK_ARTIST_DATE_TIME, true)}
                        waitlistInfo={waitlistInfo}
                        isGuestBooking={isGuestBooking}
                        potentialBIPoints={potentialBIPoints}
                    />
                );
            }

            default:
                // default step 1: Pick a Store
                return (
                    <PickStore
                        serviceInfo={serviceInfo}
                        stores={storesList}
                        openInfoWindow={openInfoWindow}
                        showInfoModal={showInfoModal}
                        selectedStore={selectedStore}
                        updateStoresList={updateStoresList}
                        onClickCTA={this.handleGoToPickArtistDateTimeStep}
                        showInterstice={showInterstice}
                        preferredStore={preferredStore}
                        rebookingStoreId={rebookingStoreId}
                    />
                );
        }
    };

    componentDidMount() {
        this.setRebookingInfo();
    }

    render() {
        const { step, selectedStore, selectedTimeSlot, selectedArtist } = this.state;
        const { content, ...props } = this.props;
        const { serviceInfo } = content;
        const isReviewAndPayStep = step === STEPS.REVIEW_AND_PAY;

        return (
            <Box maxWidth={BOOKING_PAGE_WIDTH}>
                {/* booking info */}
                <BookingInfo
                    serviceInfo={serviceInfo}
                    appointmentDetails={
                        isReviewAndPayStep && (
                            <AppointmentDetails
                                key='appointment_details'
                                serviceInfo={serviceInfo}
                                selectedStore={selectedStore}
                                selectedTimeSlot={selectedTimeSlot}
                                selectedArtist={selectedArtist}
                                onClickEditAppointment={this.handleGoToStep(STEPS.PICK_ARTIST_DATE_TIME, true)}
                            />
                        )
                    }
                    appointmentOptionalFields={
                        isReviewAndPayStep && (
                            <AppointmentOptionalFields
                                key='appointment_optional_fields'
                                serviceInfo={serviceInfo}
                                setSelectedFeature={this.setSelectedFeature}
                                setSpecialRequests={this.setSpecialRequests}
                            />
                        )
                    }
                />

                {/* steps */}
                {this.renderStep({ ...this.state, ...props, serviceInfo })}
            </Box>
        );
    }
}

ServiceBooking.defaultProps = {
    content: {
        serviceInfo: {},
        stores: []
    }
};

export default wrapComponent(ServiceBooking, 'ServiceBooking', true);
