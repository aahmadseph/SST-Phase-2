/* eslint-disable class-methods-use-this */
import React, { Fragment } from 'react';
import BaseClass from 'components/BaseClass';
import {
    Text, Flex, Box, Link
} from 'components/ui';
import DetailsWrapper from 'components/Content/Happening/ReservationDetails/DetailsWrapper';
import ActionButtons from 'components/Content/Happening/ActionButtons';
import { EXPERIENCES } from 'components/Content/Happening/ReservationDetails/constants';
import { WAITLIST_BUTTONS } from 'components/Content/Happening/ActionButtons/constants';

import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import { wrapComponent } from 'utils/framework';
import { ensureSephoraPrefix, getWaitListTimeOfTheDay } from 'utils/happening';
import {
    isWaitlistStatus, isWaitlistHold, isWaitlistExpired, isWaitlistCanceled, isWaitlist, mergePropsWithItems
} from 'utils/happeningReservation';
import FormValidator from 'utils/FormValidator';
import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';

import { mediaQueries } from 'style/config';

const { getLocaleResourceFile } = localeUtils;

class WaitlistDetails extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {};
    }

    getText = getLocaleResourceFile('components/Content/Happening/ReservationDetails/ServiceDetails/locales', 'ServiceDetails');

    redirectToStoreLocation = () => {
        const { waitlistDetails } = this.props;
        const { address } = waitlistDetails.store;

        urlUtils.openLinkInNewTab(urlUtils.getDirectionsUrl(address));

        return false;
    };

    getWrapperProps = () => ({
        flexWrap: 'wrap',
        width: ['100%', '100%', 'auto']
    });

    getCommonButtonProps = () => ({
        width: 'auto',
        minWidth: 'auto',
        css: styles.button
    });

    renderButtons = () => {
        const { waitlistDetails } = this.props;
        const { subStatus } = waitlistDetails;

        const expiredOrCanceledButtonProps = {
            maxWidth: ['100%', '100%', 284]
        };

        if (isWaitlistStatus(subStatus)) {
            return WAITLIST_BUTTONS.WAITLIST;
        }

        if (isWaitlistHold(subStatus)) {
            return WAITLIST_BUTTONS.WAITLIST_HOLD;
        }

        if (isWaitlistExpired(subStatus)) {
            return mergePropsWithItems(WAITLIST_BUTTONS.WAITLIST_EXPIRED, expiredOrCanceledButtonProps);
        }

        if (isWaitlistCanceled(subStatus)) {
            return mergePropsWithItems(WAITLIST_BUTTONS.WAITLIST_CANCELED, expiredOrCanceledButtonProps);
        }

        return [];
    };

    getAppointmentTime = () => {
        const { waitlistDetails } = this.props;
        const { type, subStatus, dayPeriod } = waitlistDetails;

        if (isWaitlist(type) && (isWaitlistStatus(subStatus) || isWaitlistCanceled(subStatus))) {
            return dayPeriod ? getWaitListTimeOfTheDay(dayPeriod) : null;
        }

        return null;
    };

    fireAnalytics = () => {
        const { waitlistDetails } = this.props;
        const { subStatus, serviceInfo, store } = waitlistDetails;

        HappeningBindings.waitlistPageLoadAnalytics(subStatus, serviceInfo.displayName, store.storeId);
    };

    componentDidMount() {
        this.fireAnalytics();
    }

    render() {
        const { waitlistDetails, user } = this.props;
        const {
            status, type, startDateTime, statusDisplayName, store, subStatus, serviceInfo, artist, confirmationNumber
        } = waitlistDetails;

        if (!user.isSignedIn) {
            return null;
        }

        return (
            <DetailsWrapper
                details={{
                    status,
                    type: type || EXPERIENCES.WAITLIST,
                    serviceFees: {},
                    startDateTime,
                    statusDisplayName,
                    store,
                    subStatus,
                    duration: serviceInfo.durationInt,
                    imageUrl: serviceInfo.imageUrl,
                    description: serviceInfo.description,
                    experienceType: 'service',
                    appointmentTime: this.getAppointmentTime()
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
                                children={this.getText('service')}
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
                                {`${this.getText('artist')} ${artist?.displayName ?? this.getText('noArtist')}`}
                            </Text>
                            <Text is={'p'}>
                                <Text
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
                    <Flex
                        gap={4}
                        marginBottom={3}
                    >
                        <Box width={105}>
                            <Text
                                is={'p'}
                                fontWeight={'bold'}
                                lineHeight={'18px'}
                                children={this.getText('location')}
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
                                marginTop={1}
                                lineHeight={'18px'}
                                onClick={this.redirectToStoreLocation}
                                children={this.getText('getDirections')}
                            />
                        </Box>
                    </Flex>
                    <Flex
                        gap={4}
                        marginBottom={3}
                    >
                        <Box width={105}>
                            <Text
                                is={'p'}
                                fontWeight={'bold'}
                                lineHeight={'18px'}
                                children={this.getText('confirmationNumber')}
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
                    {user && (
                        <Flex
                            alignItems={'center'}
                            marginBottom={4}
                            flexWrap={'wrap'}
                            gap={2}
                        >
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={`${user.firstName} ${user.lastName}`}
                                css={{
                                    textTransform: 'capitalize'
                                }}
                            />
                            {!!user?.phoneNumber && (
                                <Fragment>
                                    <Text
                                        is={'p'}
                                        lineHeight={'18px'}
                                        children={'•'}
                                    />
                                    <Text
                                        is={'p'}
                                        lineHeight={'18px'}
                                        children={`${FormValidator.getFormattedPhoneNumber(user.phoneNumber)}`}
                                    />
                                </Fragment>
                            )}
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={'•'}
                            />
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={`${user.email}`}
                            />
                        </Flex>
                    )}
                    <ActionButtons
                        reservationDetails={waitlistDetails}
                        buttons={this.renderButtons()}
                        wrapperProps={this.getWrapperProps()}
                        commonButtonProps={this.getCommonButtonProps()}
                    />
                </>
            </DetailsWrapper>
        );
    }
}

const styles = {
    button: {
        flex: 0.5,
        [mediaQueries.smMax]: {
            flex: 1
        }
    }
};

WaitlistDetails.defaultProps = {
    waitlistDetails: {}
};

export default wrapComponent(WaitlistDetails, 'WaitlistDetails');
