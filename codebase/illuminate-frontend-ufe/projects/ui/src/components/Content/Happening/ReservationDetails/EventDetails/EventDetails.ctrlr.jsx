/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
import {
    Text, Flex, Box, Link
} from 'components/ui';
import BaseClass from 'components/BaseClass';
import DetailsWrapper from 'components/Content/Happening/ReservationDetails/DetailsWrapper';
import ActionButtons from 'components/Content/Happening/ActionButtons';
import { EVENT_BUTTONS } from 'components/Content/Happening/ActionButtons/constants';
import { EXPERIENCES } from 'components/Content/Happening/ReservationDetails/constants';
import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings.js';

import urlUtils from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';
import { ensureSephoraPrefix } from 'utils/happening';
import { isPast, isCancelled, mergePropsWithItems } from 'utils/happeningReservation';
import { mediaQueries } from 'style/config';

const { wrapComponent } = framework;
const { getLocaleResourceFile } = localeUtils;
class EventReservationDetails extends BaseClass {
    getCalendarInfo = () => {
        const { reservationDetails } = this.props;

        const {
            confirmationNumber,
            startDateTime,
            eventInfo: { duration, displayName: activityName, type },
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

    redirectToStoreLocation = () => {
        const { reservationDetails } = this.props;
        const { address } = reservationDetails.store;

        urlUtils.openLinkInNewTab(urlUtils.getDirectionsUrl(address));

        return false;
    };

    getActionButtons = () => {
        const { reservationDetails } = this.props;
        const { status } = reservationDetails;

        if (isCancelled(status)) {
            return mergePropsWithItems(EVENT_BUTTONS.CANCELLED, { css: styles.singleButton });
        }

        return EVENT_BUTTONS.UPCOMING;
    };

    componentDidMount() {
        const { reservationDetails } = this.props;
        const { status, store, eventInfo } = reservationDetails;

        HappeningBindings.eventReservationDetailsPageLoadAnalytics(eventInfo.displayName, store.storeId, isCancelled(status));
    }

    render() {
        const { reservationDetails, user } = this.props;

        const {
            status, subStatus, startDateTime, store, confirmationNumber, statusDisplayName, eventInfo
        } = reservationDetails;
        const getText = getLocaleResourceFile('components/Content/Happening/ReservationDetails/EventDetails/locales', 'EventDetails');

        if (!user.isSignedIn) {
            return null;
        }

        return (
            <DetailsWrapper
                details={{
                    status,
                    type: eventInfo?.type || EXPERIENCES.EVENTS,
                    confirmationNumber,
                    startDateTime,
                    statusDisplayName,
                    store,
                    subStatus,
                    duration: eventInfo.durationInt,
                    imageUrl: eventInfo.image,
                    description: eventInfo.description,
                    experienceType: 'event'
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
                                children={getText('event')}
                            />
                        </Box>
                        <Box width={[215, null, null]}>
                            <Text
                                is={'p'}
                                children={eventInfo.displayName}
                            />
                            <Text
                                is={'p'}
                                marginBottom={1}
                                fontWeight={'bold'}
                                children={`${eventInfo?.price || getText('free')}`}
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
                                children={getText('location')}
                            />
                        </Box>
                        <Box width={[215, null, null]}>
                            <Text
                                is={'p'}
                                children={ensureSephoraPrefix(store.displayName)}
                                lineHeight={'18px'}
                            />
                            <Link
                                color='blue'
                                onClick={this.redirectToStoreLocation}
                                lineHeight={'18px'}
                            >
                                <Text
                                    display='block'
                                    children={getText('getDirections')}
                                />
                            </Link>
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
                                children={getText('confirmationNumber')}
                            />
                        </Box>
                        <Box width={[215, null, null]}>
                            <Text
                                is={'p'}
                                children={confirmationNumber}
                            />
                        </Box>
                    </Flex>
                    {!isPast(status) && (
                        <ActionButtons
                            calendarInfo={this.getCalendarInfo()}
                            reservationDetails={reservationDetails}
                            size='md'
                            width={221}
                            buttons={this.getActionButtons()}
                            commonButtonProps={{
                                width: [175, null, null],
                                minWidth: [175, null, null]
                            }}
                            wrapperProps={{
                                flexWrap: 'wrap',
                                width: ['100%', '100%', 'fit-content']
                            }}
                        />
                    )}
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

export default wrapComponent(EventReservationDetails, 'EventReservationDetails');
