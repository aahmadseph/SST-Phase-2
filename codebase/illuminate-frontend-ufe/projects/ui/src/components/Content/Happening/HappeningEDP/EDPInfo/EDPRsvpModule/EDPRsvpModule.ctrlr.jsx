import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;

import BaseClass from 'components/BaseClass';
import {
    Box, Button, Flex, Grid, Image, Link, Text
} from 'components/ui';
import GoogleMap from 'components/GoogleMap/GoogleMap';

import Location from 'utils/Location';
import experienceDetailsUtils from 'utils/ExperienceDetails';
import calendarUtils from 'utils/Calendar';
import urlUtils from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';
import {
    getIsEventInProgress, ensureSephoraPrefix, showSignInModal, getEventFormattedDate
} from 'utils/happening';

import {
    colors, mediaQueries, radii, space
} from 'style/config';

const { getLocaleResourceFile, isCanada } = localeUtils;

const MARKERS = {
    outline: '/img/ufe/happening/map-marker-outline.svg',
    solid: '/img/ufe/happening/map-marker-solid.svg'
};

const ICON_WIDTH = 17;
const ICON_HEIGHT = 25;

const STORES_LIST_MAX_HEIGHT = 312;
const INITIAL_STORES_TO_DISPLAY = 1;
const STORES_LIST_GAP_PADDING_Y = 2;

class EDPRsvpModule extends BaseClass {
    constructor(props) {
        super(props);

        this.mappedStoreAvailabilities = this.mappedStoresDisplayName(props.storeAvailabilities);
        const storesToDisplay = this.mappedStoreAvailabilities.slice(0, INITIAL_STORES_TO_DISPLAY);

        this.state = {
            selectedStoreId: null,
            storesToDisplay,
            edpConfirmRsvpModalProps: { isOpen: false },
            upcomingReservations: null,
            isStoresContainerScrollHeight: false
        };

        this.storesListRef = React.createRef();
        this.storeCardRefs = [];

        this.buildStoreCardRefs(storesToDisplay);
    }

    mappedStoresDisplayName = storeAvailabilities => {
        return storeAvailabilities.map(store => {
            const newStore = {
                ...store,
                displayName: store.storeDisplayName
            };

            delete newStore.storeDisplayName;

            return newStore;
        });
    };

    setStoresToDisplay = ({ showMore, showLess, isComponentUpdated }) => {
        return () => {
            let nextState;
            let counter = 1;

            if (showMore) {
                const remainingStoresList = this.mappedStoreAvailabilities.slice(this.state.storesToDisplay.length);
                nextState = { storesToDisplay: [...this.state.storesToDisplay] };

                while (counter <= 5 && remainingStoresList.length >= 1) {
                    counter++;
                    nextState.storesToDisplay.push(remainingStoresList.shift());
                }
            }

            if (showLess || isComponentUpdated) {
                nextState = {
                    storesToDisplay: this.mappedStoreAvailabilities.slice(0, 1),
                    isStoresContainerScrollHeight: false
                };

                this.expectedSize = false;
            }

            // Reset selected store card
            nextState.selectedStoreId = null;

            this.buildStoreCardRefs(nextState.storesToDisplay).then(() => this.setState(nextState));
        };
    };

    setSelectedStoreId = selectedStoreId => this.setState({ selectedStoreId });

    handleAdToCalendar = ({ displayName, timeSlot }) => {
        const { displayName: eventDisplayName, description } = this.props.edpInfo;
        const { startDateTime, durationMin } = timeSlot;

        const icsUrl = calendarUtils.buildCalendarUrl(startDateTime, durationMin, eventDisplayName, {
            description,
            location: 'Sephora ' + displayName,
            url: experienceDetailsUtils.getEdpPageUrl('events')
        });

        icsUrl && urlUtils.redirectTo(icsUrl);
    };

    openEDPConfirmRsvpModalWithProps = timeSlotProps => {
        const { edpInfo, user } = this.props;

        if (user.isSignedIn) {
            this.props.showEDPConfirmRsvpModal({
                isOpen: true,
                edpInfo,
                user,
                ...timeSlotProps
            });
        } else {
            showSignInModal(() => this.openEDPConfirmRsvpModalWithProps(timeSlotProps));
        }
    };

    handleChangeStoreId = storeId => () => {
        this.setSelectedStoreId(storeId);
        this.props.openInfoWindow(storeId);
    };

    handleAddToCalendarClick = (storeId, displayName, timeSlot) => () => {
        this.handleChangeStoreId(storeId)();
        this.handleAdToCalendar({ displayName, timeSlot });
    };

    setupStoresContainerObserver = () => {
        const storesListContainer = this.storesListRef.current;

        if (storesListContainer) {
            const callback = ([entry]) => {
                const containerSize = entry.contentRect;

                if (containerSize) {
                    const isStoresContainerScrollHeight = containerSize.height >= STORES_LIST_MAX_HEIGHT;
                    const shouldSetState = !this.expectedSize && isStoresContainerScrollHeight;

                    // condition needed to stop the ResizeObserver loop
                    shouldSetState && this.setState({ isStoresContainerScrollHeight }, () => (this.expectedSize = true));
                }
            };

            this.observer = new ResizeObserver(callback);
            this.observer.observe(storesListContainer);
        }
    };

    buildStoreCardRefs = storesToDisplay => {
        if (storesToDisplay.length) {
            this.storeCardRefs = storesToDisplay.map(() => React.createRef());
        }

        return Promise.resolve();
    };

    setNextStoresLisScrollHeight = (prevState, currentState) => {
        const prevStoresToDisplayLength = prevState.storesToDisplay.length;
        const currentStoresToDisplayLength = currentState.storesToDisplay.length;

        // Are we adding new items to the list?
        if (prevStoresToDisplayLength < currentStoresToDisplayLength) {
            const nextElementInList = this.storeCardRefs[prevStoresToDisplayLength]?.current;
            const containerPaddingTopSpace = prevStoresToDisplayLength <= INITIAL_STORES_TO_DISPLAY ? 0 : space[STORES_LIST_GAP_PADDING_Y];

            const nextScrollHeight = nextElementInList ? nextElementInList.offsetTop - containerPaddingTopSpace : 0;

            // Adjust scrollTop to the new list so the next item is pushed into view.
            const list = this.storesListRef.current;

            list && nextScrollHeight && (list.scrollTop = nextScrollHeight);
        }
    };

    componentDidMount() {
        this.setupStoresContainerObserver();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.storeAvailabilities !== this.props.storeAvailabilities) {
            this.mappedStoreAvailabilities = this.mappedStoresDisplayName(this.props.storeAvailabilities);

            this.setStoresToDisplay({ isComponentUpdated: true })();
        }

        // Adjust scrollTop to the new list so the next item is pushed into view.
        this.setNextStoresLisScrollHeight(prevState, this.state);
    }

    componentWillUnmount() {
        this.observer.disconnect();
    }

    render() {
        const { openInfoWindow, edpInfo } = this.props;
        const { selectedStoreId, storesToDisplay, isStoresContainerScrollHeight } = this.state;

        const displayShowMoreLink = storesToDisplay.length < this.mappedStoreAvailabilities.length;
        const displayShowLessLink = storesToDisplay.length > 1;

        const showMap = storesToDisplay.length;

        const getText = getLocaleResourceFile('components/Content/Happening/HappeningEDP/EDPInfo/EDPRsvpModule/locales', 'EDPRsvpModule');

        return (
            <>
                <Text
                    is={'h2'}
                    fontSize={['md', null, 'lg']}
                    fontWeight={'bold'}
                    lineHeight={[null, null, '22px']}
                    marginBottom={4}
                    children={getText('rsvpTitle')}
                />

                <Grid
                    gridTemplateColumns={[null, null, '1fr 1fr']}
                    gap={[4, null, 5]}
                >
                    {/* RSVP Cards */}
                    <Flex
                        ref={this.storesListRef}
                        is='fieldset'
                        lineHeight={'tight'}
                        flexDirection={'column'}
                        gap={STORES_LIST_GAP_PADDING_Y}
                        height={[null, null, 'max-content']}
                        maxHeight={[null, null, STORES_LIST_MAX_HEIGHT]}
                        overflowY={[null, null, 'auto']}
                        overflowX={[null, null, 'hidden']}
                        position={'relative'}
                        css={isStoresContainerScrollHeight ? styles.scrollableStoresContainer : null}
                    >
                        {storesToDisplay.map(({
                            distance, storeId, displayName, timeslots = [], timeZone, address
                        }, index) => {
                            const selected = selectedStoreId === storeId;
                            const markerNumber = `${index + 1}`;
                            const { postalCode, country } = address;

                            return (
                                <Flex
                                    ref={this.storeCardRefs[index]}
                                    key={storeId}
                                    is='label'
                                    aria-selected={selected}
                                    gap={2}
                                    padding={2}
                                    borderRadius={2}
                                    borderWidth={1}
                                    borderColor={'midGray'}
                                    position={'relative'}
                                    css={[styles.label, selected ? styles.labelActive : styles.labelInactive]}
                                >
                                    <input
                                        type='radio'
                                        checked={selected}
                                        onChange={this.handleChangeStoreId(storeId)}
                                        css={{ position: 'absolute', opacity: 0 }}
                                    />
                                    <Box
                                        position={'relative'}
                                        width={ICON_WIDTH}
                                        height={ICON_HEIGHT}
                                    >
                                        <Image
                                            css={{ position: 'absolute', inset: 0 }}
                                            display={'block'}
                                            width={ICON_WIDTH}
                                            height={ICON_HEIGHT}
                                            src={selected ? MARKERS.solid : MARKERS.outline}
                                        />
                                        <Text
                                            css={{ position: 'absolute', top: 3, left: 0 }}
                                            display={'block'}
                                            width={ICON_WIDTH}
                                            height={ICON_HEIGHT}
                                            fontSize={'10px'}
                                            fontWeight={selected ? 'bold' : 'normal'}
                                            color={selected ? 'white' : 'black'}
                                            textAlign={'center'}
                                            children={markerNumber}
                                        />
                                    </Box>
                                    <Flex
                                        gap={4}
                                        flexDirection={'column'}
                                        flex={1}
                                    >
                                        {timeslots.map((timeSlot, idx) => {
                                            const { bookingId, durationMin, startDateTime, confirmationNumber } = timeSlot;
                                            const showStoreName = idx === 0;
                                            const isManageRsvp = !!confirmationNumber;
                                            const isEventInProgress = getIsEventInProgress(startDateTime, timeZone, durationMin);
                                            const eventDateFromTo = getEventFormattedDate(startDateTime, timeZone, durationMin, isEventInProgress);

                                            const handleRSVPClick = e => {
                                                if (isManageRsvp) {
                                                    Location.navigateTo(
                                                        e,
                                                        `/happening/reservations/confirmation?id=${confirmationNumber}&zipCode=${postalCode}&country=${country}`
                                                    );
                                                } else {
                                                    this.setSelectedStoreId(storeId);
                                                    openInfoWindow(storeId);

                                                    this.openEDPConfirmRsvpModalWithProps({
                                                        eventDisplayName: edpInfo.displayName,
                                                        storeDisplayName: displayName,
                                                        storeId,
                                                        timeSlot,
                                                        timeZone
                                                    });
                                                }
                                            };

                                            return (
                                                <Flex
                                                    key={bookingId}
                                                    gap={[2, null, 5]}
                                                    flexWrap={['wrap', null, 'nowrap']}
                                                    justifyContent={'space-between'}
                                                    alignItems={'center'}
                                                >
                                                    <Flex
                                                        flexDirection={'column'}
                                                        gap={1}
                                                        flex={[null, null, 1]}
                                                    >
                                                        {showStoreName && (
                                                            <Text
                                                                is={'h4'}
                                                                fontWeight={'bold'}
                                                            >
                                                                {ensureSephoraPrefix(displayName)}
                                                                <Text
                                                                    fontWeight={'normal'}
                                                                    color={'#888'}
                                                                    children={` • ${distance} ${isCanada() ? 'km' : 'mi'}`}
                                                                />
                                                            </Text>
                                                        )}
                                                        <Text
                                                            color={isEventInProgress ? colors.green : colors.black}
                                                            children={eventDateFromTo}
                                                        />
                                                    </Flex>
                                                    <Flex
                                                        gap={2}
                                                        justifyContent={'flex-end'}
                                                    >
                                                        <Button
                                                            variant='secondary'
                                                            width={140}
                                                            paddingX={3}
                                                            paddingY={0}
                                                            minHeight={32}
                                                            maxHeight={32}
                                                            onClick={this.handleAddToCalendarClick(storeId, displayName, timeSlot)}
                                                            children={getText('addToCalendar')}
                                                        />
                                                        <Button
                                                            variant='primary'
                                                            width={140}
                                                            paddingX={3}
                                                            paddingY={0}
                                                            minHeight={32}
                                                            maxHeight={32}
                                                            css={isEventInProgress && !isManageRsvp ? styles.invisibleButton : null}
                                                            onClick={handleRSVPClick}
                                                            children={isManageRsvp ? getText('manageRsvp') : getText('rsvp')}
                                                        />
                                                    </Flex>
                                                </Flex>
                                            );
                                        })}
                                    </Flex>
                                </Flex>
                            );
                        })}

                        {/* Show more/less blue links */}
                        <Flex
                            alignItems={'center'}
                            justifyContent={
                                displayShowMoreLink && displayShowLessLink
                                    ? 'space-between'
                                    : !displayShowMoreLink && displayShowLessLink && 'flex-end'
                            }
                        >
                            {displayShowMoreLink && (
                                <Link
                                    color={'blue'}
                                    onClick={this.setStoresToDisplay({ showMore: true })}
                                    children={getText('showMoreLocations')}
                                />
                            )}
                            {displayShowLessLink && (
                                <Link
                                    color={'blue'}
                                    onClick={this.setStoresToDisplay({ showLess: true })}
                                    children={getText('showLess')}
                                />
                            )}
                        </Flex>
                    </Flex>

                    {/* Map */}
                    <Box
                        borderRadius={2}
                        maxHeight={[null, null, STORES_LIST_MAX_HEIGHT]}
                        css={{ overflow: 'hidden' }}
                    >
                        {!!showMap && (
                            <GoogleMap
                                isZoomControlShown
                                ratio={9 / 16}
                                showFirstMarkerInfoBox={false}
                                selectedStore={storesToDisplay[0]}
                                stores={storesToDisplay}
                                isHappening
                                markerIcons={MARKERS}
                                setSelectedStoreId={this.setSelectedStoreId}
                                selectedStoreId={selectedStoreId}
                            />
                        )}
                    </Box>
                </Grid>
            </>
        );
    }
}

const styles = {
    scrollableStoresContainer: {
        [mediaQueries.md]: {
            paddingRight: space[2],
            paddingTop: space[STORES_LIST_GAP_PADDING_Y],
            paddingBottom: space[STORES_LIST_GAP_PADDING_Y],
            borderTop: `1px solid ${colors.midGray}`,
            borderBottom: `1px solid ${colors.midGray}`,
            scrollbarColor: 'auto'
        }
    },
    label: {
        '&::before': {
            content: '""',
            position: 'absolute',
            border: '2px solid',
            inset: -1,
            borderRadius: radii[2],
            opacity: 0,
            transition: 'opacity .2s',
            zIndex: 1,
            pointerEvents: 'none'
        },
        [mediaQueries.lg]: {
            '&:hover': {
                backgroundColor: colors.nearWhite
            }
        }
    },
    labelActive: {
        '&::before': {
            opacity: 1
        }
    },
    labelInactive: {
        cursor: 'pointer'
    },
    invisibleButton: {
        visibility: 'hidden'
    }
};

EDPRsvpModule.defaultProps = {
    storeAvailabilities: []
};

export default wrapComponent(EDPRsvpModule, 'EDPRsvpModule', true);
