/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';

import {
    Text, Flex, Box, Link
} from 'components/ui';

import BaseClass from 'components/BaseClass';
import DetailsWrapper from 'components/Content/Happening/ReservationDetails/DetailsWrapper';
import ActionButtons from 'components/Content/Happening/ActionButtons';
import { SERVICE_BUTTONS } from 'components/Content/Happening/ActionButtons/constants';
import PaymentMethodsInfo from 'components/Content/Happening/ReservationDetails/PaymentMethodsInfo';

import FormValidator from 'utils/FormValidator';
import localeUtils from 'utils/LanguageLocale';
import dayUtils from 'utils/Date';
import urlUtils from 'utils/Url';
import { ensureSephoraPrefix } from 'utils/happening';
import {
    isUpcoming, isPast, isCancelled, mergePropsWithItems
} from 'utils/happeningReservation';

import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';

import { mediaQueries } from 'style/config';

import profileApi from 'services/api/profile';

import { EXPERIENCES } from 'components/Content/Happening/ReservationDetails/constants';

const { getLocaleResourceFile } = localeUtils;

// we are using this const for this scenario since payment service sends a different type for cards
const CREDIT_CARD_TYPES = {
    SEPHORA: 'SEPHORA',
    VISA: 'VISA',
    MASTERCARD: 'MASTERCARD',
    DISCOVER: 'DISCOVER',
    AMERICANEXPRESS: 'AMERICAN_EXPRESS'
};

const CLIENT_STATE_TYPES = {
    GUEST: 'GUEST',
    REGISTERED_USER: 'REGISTERED_USER'
};

class ServiceReservationDetails extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            paymentCreditCardInfo: {},
            clientInfo: {}
        };
        this.isBI = props?.reservationDetails?.clientInfo?.isBI;
        this.isGuest = props?.reservationDetails?.clientInfo?.isGuest;
        this.isGuestEventServicesEnabled = Sephora.configurationSettings.isGuestEventServicesEnabled;
        this.showBiRegisterModal = props.showBiRegisterModal;
        this.showSignInModal = props.showSignInModal;
        this.isGuestInURLParams = urlUtils.getIsGuestParamValue();
        this.guestBookingDetails = props.guestBookingDetails;
        this.reservationSensitiveDetails = props.reservationSensitiveDetails;
        this.confirmationNumber = props?.reservationDetails?.confirmationNumber;
        this.isSignedIn = props?.user?.isSignedIn;
    }

    getPaymentInfo() {
        const {
            reservationDetails: {
                paymentInfo: { authPaymentMethodId, authPaymentMethodDetails }
            },
            user: { profileId }
        } = this.props;

        if (authPaymentMethodDetails) {
            this.setState({
                paymentCreditCardInfo: {
                    cardType: CREDIT_CARD_TYPES[authPaymentMethodDetails?.brand?.toUpperCase()],
                    cardNumber: authPaymentMethodDetails?.lastFour
                }
            });
        } else {
            profileApi.getCreditCardsFromProfile(profileId).then(response => {
                const creditCard = response.creditCards.find(card => card.creditCardId === authPaymentMethodId);

                if (creditCard) {
                    this.setState({ paymentCreditCardInfo: creditCard });
                }
            });
        }
    }

    getCalendarInfo = () => {
        const { reservationDetails } = this.props;

        const {
            confirmationNumber,
            startDateTime,
            serviceInfo: { duration, displayName: activityName, type },
            store: { displayName: storeName }
        } = reservationDetails;

        return {
            activityName,
            storeName,
            confirmationNumber,
            startDateTime,
            duration,
            type
        };
    };

    renderButtons = () => {
        const { reservationDetails } = this.props;

        if (isUpcoming(reservationDetails.status)) {
            return SERVICE_BUTTONS.UPCOMING;
        }

        if (isPast(reservationDetails.status)) {
            return SERVICE_BUTTONS.PAST;
        }

        if (
            dayUtils.isDayAfter(new Date(), new Date(reservationDetails.startDateTime.replace('[UTC]', ''))) &&
            !isCancelled(reservationDetails.status)
        ) {
            return SERVICE_BUTTONS.IS_DAY_AFTER;
        }

        if (isCancelled(reservationDetails.status)) {
            return mergePropsWithItems(SERVICE_BUTTONS.CANCELLED, { css: styles.singleButton });
        }

        return [];
    };

    redirectToStoreLocation = () => {
        const { reservationDetails } = this.props;
        const { address } = reservationDetails.store;

        urlUtils.openLinkInNewTab(urlUtils.getDirectionsUrl(address));

        return false;
    };

    getWrapperProps = () => ({
        flexWrap: 'wrap',
        width: ['100%']
    });

    componentDidMount() {
        const { reservationDetails } = this.props;
        const { status, store, serviceInfo } = reservationDetails;

        if (this.isGuestEventServicesEnabled && this.isGuestInURLParams) {
            const guestBookingDetailsPromise = this.guestBookingDetails(this.confirmationNumber);
            guestBookingDetailsPromise.then(data => {
                if (data?.clientState === CLIENT_STATE_TYPES.REGISTERED_USER || data?.clientState === null) {
                    this.showSignInModal({ isOpen: true });
                }
            });
        }

        if (this.isGuestEventServicesEnabled && this.isSignedIn && this.isGuest) {
            const reservationSensitiveDetailsPromise = this.reservationSensitiveDetails(this.confirmationNumber);
            reservationSensitiveDetailsPromise.then(data => {
                this.props.reservationDetails.clientInfo.email = data?.clientDetails.email;
                this.props.reservationDetails.clientInfo.phoneNumber = data?.clientDetails.phone;
                this.setState({
                    clientInfo: {
                        email: data?.clientDetails.email,
                        phoneNumber: data?.clientDetails.phone,
                        name: this.props.reservationDetails.clientInfo.name,
                        isBI: this.props.reservationDetails.clientInfo.isBI,
                        isGuest: this.props.reservationDetails.clientInfo.isGuest
                    }
                });
            });
        }

        if (!isPast(status)) {
            this.getPaymentInfo();
        }

        HappeningBindings.serviceReservationDetailsPageLoadAnalytics(
            serviceInfo.displayName,
            store.storeId,
            isCancelled(status),
            this.isGuest && this.isGuestEventServicesEnabled
        );
    }

    isShowingCCInforForGuestFlow = () => {
        return (this.isGuestInURLParams || this.isGuest) && this.isGuestEventServicesEnabled;
    };

    isShowingClientNameForGuestFlow = () => {
        return this.isGuestEventServicesEnabled && this.isGuest && !this.isSignedIn;
    };

    render() {
        const { reservationDetails, user } = this.props;
        const {
            status,
            startDateTime,
            store,
            confirmationNumber,
            statusDisplayName,
            serviceInfo,
            clientInfo,
            subStatus,
            paymentInfo = {},
            specialRequests,
            selectedFeature,
            artist
        } = reservationDetails;
        const getText = getLocaleResourceFile('components/Content/Happening/ReservationDetails/ServiceDetails/locales', 'ServiceDetails');
        const specialRequestLabel = specialRequests ? 'specialRequests' : 'notProvided';
        const { paymentCreditCardInfo } = this.state;
        const showPaymentInfo = paymentCreditCardInfo?.cardType || isPast(status) || paymentInfo?.refund;

        if (!user.isSignedIn && !this.isGuestInURLParams) {
            return null;
        }

        return (
            <DetailsWrapper
                details={{
                    status,
                    type: serviceInfo?.type || EXPERIENCES.SERVICES,
                    serviceFees: paymentInfo?.serviceFees,
                    startDateTime,
                    statusDisplayName,
                    store,
                    subStatus,
                    duration: serviceInfo.durationInt,
                    imageUrl: serviceInfo.imageUrl,
                    description: serviceInfo.description,
                    experienceType: 'service',
                    price: serviceInfo.price,
                    isGuest: this.isGuest,
                    isBI: this.isBI,
                    isGuestEventServicesEnabled: this.isGuestEventServicesEnabled,
                    showBiRegisterModal: this.showBiRegisterModal,
                    showSignInModal: this.showSignInModal,
                    clientInfo: clientInfo,
                    isSignedIn: this.isSignedIn
                }}
            >
                <>
                    <Flex
                        gap={4}
                        marginBottom={3}
                    >
                        <Box width={105}>
                            <Text
                                is={'p'}
                                fontWeight={'bold'}
                                lineHeight={'18px'}
                                children={getText('service')}
                            />
                        </Box>
                        <Box width={[215, null, null]}>
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={serviceInfo.displayName}
                            />
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                            >
                                <Text
                                    lineHeight={'18px'}
                                    children={getText('artist')}
                                />
                                <Text
                                    lineHeight={'18px'}
                                    children={artist?.displayName ?? getText('noArtist')}
                                />
                            </Text>
                            <Text is={'p'}>
                                <Text
                                    is={'span'}
                                    fontWeight={'bold'}
                                    lineHeight={'18px'}
                                >
                                    {serviceInfo.price}
                                </Text>
                                <Text
                                    lineHeight={'18px'}
                                    children={` / ${serviceInfo.duration}`}
                                />
                            </Text>
                        </Box>
                    </Flex>
                    {this.isGuestEventServicesEnabled && (!this.isGuest || this.isSignedIn) && (
                        <Flex
                            gap={4}
                            marginBottom={3}
                        >
                            <Box width={105}>
                                <Text
                                    is={'p'}
                                    fontWeight={'bold'}
                                    lineHeight={'18px'}
                                    children={getText('details')}
                                />
                            </Box>
                            <Box width={[215, null, null]}>
                                {selectedFeature && (
                                    <Text
                                        is={'p'}
                                        lineHeight={'18px'}
                                        children={getText('selectedFeature', [selectedFeature])}
                                    />
                                )}
                                <Text
                                    is={'p'}
                                    lineHeight={'18px'}
                                    children={getText(specialRequestLabel, [specialRequests])}
                                />
                            </Box>
                        </Flex>
                    )}
                    <Flex
                        gap={4}
                        marginBottom={3}
                    >
                        <Box width={105}>
                            <Text
                                is={'p'}
                                fontWeight={'bold'}
                                lineHeight={'18px'}
                                children={getText('location')}
                            />
                        </Box>
                        <Box>
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={ensureSephoraPrefix(store.displayName)}
                            />
                            <Link
                                color='blue'
                                onClick={this.redirectToStoreLocation}
                            >
                                <Text
                                    display='block'
                                    marginTop={1}
                                    lineHeight={'18px'}
                                    children={getText('getDirections')}
                                />
                            </Link>
                        </Box>
                    </Flex>
                    {this.isShowingCCInforForGuestFlow() ? (
                        <PaymentMethodsInfo
                            paymentInfo={paymentInfo}
                            status={status}
                            subStatus={subStatus}
                            paymentCreditCardInfo={paymentCreditCardInfo}
                            isGuest={this.isGuestInURLParams || this.isGuest}
                            isGuestEventServicesEnabled={this.isGuestEventServicesEnabled}
                        />
                    ) : (
                        showPaymentInfo && (
                            <PaymentMethodsInfo
                                paymentInfo={paymentInfo}
                                status={status}
                                subStatus={subStatus}
                                paymentCreditCardInfo={paymentCreditCardInfo}
                                isGuest={this.isGuest}
                                isGuestEventServicesEnabled={this.isGuestEventServicesEnabled}
                            />
                        )
                    )}
                    <Flex
                        gap={4}
                        marginBottom={3}
                    >
                        <Box width={105}>
                            <Text
                                is={'p'}
                                fontWeight={'bold'}
                                lineHeight={'18px'}
                                children={getText('confirmationNumber')}
                            />
                        </Box>
                        <Box width={[215, null, null]}>
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={confirmationNumber}
                            />
                        </Box>
                    </Flex>
                    {clientInfo && (!this.isGuest || this.isSignedIn) && (
                        <Flex
                            alignItems={'center'}
                            marginBottom={4}
                            flexWrap={'wrap'}
                            gap={2}
                        >
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={`${clientInfo.name}`}
                                css={{
                                    textTransform: 'capitalize'
                                }}
                            />
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={'•'}
                            />
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={`${FormValidator.getFormattedPhoneNumber(clientInfo.phoneNumber)}`}
                            />
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={'•'}
                            />
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={`${clientInfo.email}`}
                            />
                        </Flex>
                    )}
                    {this.isShowingClientNameForGuestFlow() && (
                        <Flex
                            alignItems={'center'}
                            marginBottom={4}
                            flexWrap={'wrap'}
                            gap={2}
                        >
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={`${clientInfo.name}`}
                                css={{
                                    textTransform: 'capitalize'
                                }}
                            />
                        </Flex>
                    )}
                    <ActionButtons
                        calendarInfo={this.getCalendarInfo()}
                        reservationDetails={{ ...reservationDetails, serviceFees: paymentInfo?.serviceFees || {} }}
                        buttons={this.renderButtons()}
                        commonButtonProps={{
                            width: [175, null, null],
                            minWidth: [175, null, null]
                        }}
                        wrapperProps={this.getWrapperProps()}
                    />
                </>
            </DetailsWrapper>
        );
    }
}

const styles = {
    singleButton: {
        flex: 0.5,
        [mediaQueries.smMax]: {
            flex: 1
        }
    }
};

ServiceReservationDetails.defaultProps = {
    reservationDetails: {}
};

export default wrapComponent(ServiceReservationDetails, 'ServiceReservationDetails');
