import React, { Fragment } from 'react';
import { wrapComponent } from 'utils/framework';

import BaseClass from 'components/BaseClass';
import {
    Box, Button, Divider, Flex, Icon, Link, Text
} from 'components/ui';
import HorizontalCalendar from 'components/HorizontalCalendar';
import StepsCTA from 'components/HappeningNonContent/ServiceBooking/StepsCTA';
import Tooltip from 'components/Tooltip';
import Calendar from 'components/Calendar/Calendar';
import Modal from 'components/Modal/Modal';
import CalendarWeekdays from 'components/Calendar/CalendarHeader/CalendarWeekdays/CalendarWeekdays';

import {
    colors, mediaQueries, radii, shadows, space
} from 'style/config';
import { renderModal } from 'utils/globalModals';

import resourceWrapper from 'utils/framework/resourceWrapper';
import dateUtils from 'utils/Date';
import {
    formatArtistName,
    getArtistsAvailabilityDates,
    getArtistsAvailabilitySlots,
    getFormattedTimeSlot,
    getTimeSlotFormattedHours,
    ensureSephoraPrefix,
    buildCalendarDates,
    getDateFromYMD,
    getStoreClosedDates,
    getHoursDifference,
    showYouFoundAnotherTimeModal,
    showSignInModal,
    showSignInModalWithContextOptions
} from 'utils/happening';
import localeUtils from 'utils/LanguageLocale';
import MediaUtils from 'utils/Media';

import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings.js';
import anaUtils from 'analytics/utils';

import Empty from 'constants/empty';
import {
    ANY_ARTIST_ID,
    DAY_PERIOD,
    STORE_LOCATOR_URL,
    PERIOD_START_HOUR,
    MINIMUM_HOURS
} from 'components/HappeningNonContent/ServiceBooking/PickArtistDateTime/constants';
import { BOOKING_PAGE_WIDTH } from 'components/HappeningNonContent/ServiceBooking/constants';

const { getLocaleResourceFile, isCanada } = localeUtils;
const { Media } = MediaUtils;
const { MORNING, AFTERNOON, EVENING } = DAY_PERIOD;

const isAnyArtistSelected = selectedArtistId => selectedArtistId === ANY_ARTIST_ID;

class PickArtistDateTime extends BaseClass {
    constructor(props) {
        super(props);

        const { timeZone } = props.selectedStore;
        const startDate = new Date();

        this.state = {
            dates: null,
            artists: [],
            selectedArtistId: null,
            selectedDate: null,
            selectedTimeSlot: null,
            timeZone,
            isCalendarModalOpen: false,
            startDate,
            activeCalendarDates: [],
            closedCalendarDates: [],
            isInitialized: false,
            isArtistsContainerScrollWidth: false,
            artistTimeSlots: [],
            isJoinWaitList: false,
            showFullyBookedError: false
        };

        this.getText = getLocaleResourceFile('components/HappeningNonContent/ServiceBooking/PickArtistDateTime/locales', 'PickArtistDateTime');

        this.artistContainer = React.createRef();

        this.caledarDates = buildCalendarDates(null, startDate);
    }

    getInitialDatesAndTimeSlots = async () => {
        const {
            rebookingArtistId, selectedStore, selectedDate, selectedArtist, selectedTimeSlot
        } = this.props;

        const dates = await getArtistsAvailabilityDates(selectedStore);
        const artists = this.getAvailableArtists(dates);

        const timeZone = selectedStore.timeZone;

        const prevArtistId = selectedArtist?.employeeNumber || rebookingArtistId;
        const initialArtistId = artists.find(artist => artist.employeeNumber === prevArtistId)?.resourceId || ANY_ARTIST_ID;

        const storeClosedDates = getStoreClosedDates(this.caledarDates, selectedStore);

        const availableArtistDates = this.getAvailableArtistDates(dates, initialArtistId, storeClosedDates);
        const preSelectedDate = selectedDate ? selectedDate : availableArtistDates[0];

        let artistTimeSlots = [];
        let preSelectedTimeSlot;

        if (preSelectedDate) {
            artistTimeSlots = await this.getArtistTimeSlots(selectedStore, preSelectedDate, initialArtistId, false);
            preSelectedTimeSlot = selectedTimeSlot ? selectedTimeSlot : artistTimeSlots[0];
        }

        this.setState({
            dates,
            artists,
            selectedArtistId: initialArtistId,
            selectedDate: preSelectedDate,
            selectedTimeSlot: preSelectedTimeSlot,
            timeZone,
            activeCalendarDates: availableArtistDates,
            closedCalendarDates: storeClosedDates,
            artistTimeSlots,
            isInitialized: true
        });
    };

    setSelectedArtistAndInitialTimeSlot = (selectedArtistId, dates, closedCalendarDates) => async () => {
        const availableArtistDates = this.getAvailableArtistDates(dates, selectedArtistId, closedCalendarDates);

        const preSelectedDate = availableArtistDates[0];
        const artistTimeSlots = await this.getArtistTimeSlots(this.props.selectedStore, preSelectedDate, selectedArtistId);
        const preSelectedTimeSlot = artistTimeSlots[0];

        this.setState({
            selectedArtistId,
            selectedDate: preSelectedDate,
            selectedTimeSlot: preSelectedTimeSlot,
            activeCalendarDates: availableArtistDates,
            artistTimeSlots,
            isJoinWaitList: false
        });
    };

    setSelectedDate = async selectedDate => {
        const { selectedArtistId } = this.state;

        const artistTimeSlots = await this.getArtistTimeSlots(this.props.selectedStore, selectedDate, selectedArtistId);
        const selectedTimeSlot = artistTimeSlots[0];

        this.setState({
            selectedDate,
            selectedTimeSlot,
            artistTimeSlots,
            isJoinWaitList: false,
            showFullyBookedError: false
        });
    };

    setSelectedTimeSlot = selectedTimeSlot => () => {
        this.setState({ selectedTimeSlot, isJoinWaitList: false, showFullyBookedError: false });
    };

    handleJoinWaitlist = name => () => {
        this.setState({ selectedTimeSlot: { selectedWaitListButton: name }, isJoinWaitList: true, showFullyBookedError: false });
    };

    getAvailableArtists = dates => {
        const artistsAtoZList = (dates?.resources || Empty.Array)
            .map(({ preferredName, resourceId, employeeNumber }) => ({
                employeeNumber,
                resourceId,
                displayName: formatArtistName(preferredName)
            }))
            .sort((a, b) => a.displayName.localeCompare(b.displayName));

        const artists = [
            {
                resourceId: 'any',
                displayName: this.getText('anyAvailableArtist')
            },
            ...artistsAtoZList
        ];

        return artists;
    };

    getAvailableArtistDates = (dates, selectedArtistId, storeClosedDates) => {
        let availableDates = [];

        if (!dates) {
            return availableDates;
        }

        // Get all date strings available
        if (isAnyArtistSelected(selectedArtistId)) {
            if (Array.isArray(dates?.allAvailableDates) && dates?.allAvailableDates.length) {
                availableDates = dates.allAvailableDates;
            } else {
                // fallback to loop all resources availableDates
                dates?.resources?.forEach(resource => {
                    availableDates = availableDates.concat(resource?.availableDates);
                });

                availableDates = [...new Set(availableDates)]; // Unique date strings as dates maybe duplicated
                availableDates = availableDates.sort((a, b) => a.localeCompare(b)); // Date strings in asc order
            }
        } else {
            // Get only date strings belonging to the selectedArtistId
            availableDates = dates?.resources?.find(({ resourceId }) => resourceId === selectedArtistId)?.availableDates;
        }

        availableDates = availableDates.map(getDateFromYMD); // Date strings converted into Date objects

        // While BE fixes the dates response, on FE we must exclude availableDates falling on the same storeClosedDates
        availableDates = availableDates.filter(availableDate => !storeClosedDates.some(date => dateUtils.isSameDay(date, availableDate)));

        const availableArtistDates = [];

        for (const date of this.caledarDates) {
            const isActiveCalendarDate = availableDates.some(artistDate => dateUtils.isSameDay(date, artistDate));

            if (isActiveCalendarDate) {
                availableArtistDates.push(date);
            }
        }

        return availableArtistDates;
    };

    getArtistTimeSlots = async (selectedStore, selectedDate, resourceId, showLoader) => {
        const resourceIdParam = isAnyArtistSelected(resourceId) ? null : resourceId;
        const slots = await getArtistsAvailabilitySlots(selectedStore, selectedDate, resourceIdParam, showLoader);

        return slots?.timeSlots || Empty.Array;
    };

    getDayPeriodTimeSlots = (artistTimeSlots, timeZone) => {
        const availableTimeslots = {
            [MORNING]: [],
            [AFTERNOON]: [],
            [EVENING]: []
        };

        const { isRequestAppointmentEnabled } = Sephora.configurationSettings;

        if (!artistTimeSlots.length) {
            if (isRequestAppointmentEnabled) {
                return this.getTimeslotsWithWaitlistButtons(availableTimeslots, timeZone);
            }

            return { availableTimeslots, isWaitListAvailable: false };
        }

        const getDayPeriod = hour => {
            const hourNum = typeof hour === 'string' ? Number(hour) : hour;

            const isMorning = hourNum >= 8 && hourNum < 12;
            const isAfternoon = hourNum >= 12 && hourNum < 17;
            const isEvening = hourNum >= 17 && hourNum < 21;

            return isMorning ? MORNING : isAfternoon ? AFTERNOON : isEvening ? EVENING : undefined;
        };

        for (const slot of artistTimeSlots) {
            const { startDateTime, startTimeLocal } = slot;
            const hour = startTimeLocal?.split(':')[0];
            const dayPeriod = getDayPeriod(hour);
            const displayTime = getTimeSlotFormattedHours(startDateTime, timeZone);

            availableTimeslots[dayPeriod]?.push({ ...slot, startDateTime, displayTime });
        }

        if (isRequestAppointmentEnabled) {
            return this.getTimeslotsWithWaitlistButtons(availableTimeslots, timeZone);
        }

        return { availableTimeslots, isWaitListAvailable: false };
    };

    getTimeslotsWithWaitlistButtons = (timeslots, timeZone) => {
        let isWaitListAvailable = false;

        const joinWaitlistButton = {
            displayTime: this.getText('joinWaitlist'),
            isJoinWaitlistButton: true
        };

        const updatedTimeslots = Object.entries(timeslots).reduce((acc, [dayPeriodName, slots]) => {
            if (slots?.length === 0 && this.shouldShowJoinWaitlistButton(dayPeriodName, timeZone)) {
                isWaitListAvailable = true;

                return {
                    ...acc,
                    [dayPeriodName]: [joinWaitlistButton]
                };
            }

            return { ...acc, [dayPeriodName]: slots };
        }, {});

        return { availableTimeslots: updatedTimeslots, isWaitListAvailable };
    };

    toggleShowCalendar = () => this.setState(prevState => ({ isCalendarModalOpen: !prevState.isCalendarModalOpen }));

    shouldShowJoinWaitlistButton = (name, timeZone) => {
        const { startDate, selectedDate } = this.state;
        const selectedDatePeriod = new Date(selectedDate);
        selectedDatePeriod.setHours(PERIOD_START_HOUR[name], 0, 0, 0);

        const periodISODate = (selectedDate || startDate)?.toISOString();

        return !!periodISODate && getHoursDifference(periodISODate, timeZone) >= MINIMUM_HOURS;
    };

    renderDayPeriodButton = (selected, content, onChange, selectedClass = '', boxProps = {}) => {
        return (
            <Box
                key={content}
                is='label'
                aria-selected={selected}
                flexShrink={0}
                paddingY={2}
                borderRadius={2}
                borderWidth={1}
                borderColor={'midGray'}
                position={'relative'}
                textAlign={'center'}
                width='fit-content'
                css={[styles.label, selectedClass]}
                {...boxProps}
            >
                <input
                    type='radio'
                    checked={selected}
                    onChange={onChange}
                    css={styles.dayPeriodInput}
                />
                {content}
            </Box>
        );
    };

    renderArtistsButtons = (artists, selectedArtistId, dates, isArtistsContainerScrollWidth, closedCalendarDates) => {
        return (
            <Flex
                ref={this.artistContainer}
                is='fieldset'
                alignItems={'center'}
                gap={2}
                lineHeight={'tight'}
                marginX={[-4, null, 0]}
                paddingX={[4, null, 0]}
                overflowX={['auto']}
                position={'relative'}
                width={[null, null, 'fit-content']}
                css={{
                    ...styles.artistContainerSmallView,
                    ...(isArtistsContainerScrollWidth && styles.artistContainerLargeView)
                }}
            >
                {artists.map(({ resourceId, displayName }) => {
                    const selected = selectedArtistId === resourceId;
                    const selectedClass = selected ? styles.labelActive : styles.labelInactive;

                    return this.renderDayPeriodButton(
                        selected,
                        displayName,
                        this.setSelectedArtistAndInitialTimeSlot(resourceId, dates, closedCalendarDates),
                        selectedClass,
                        {
                            key: resourceId,
                            paddingX: '10px'
                        }
                    );
                })}
            </Flex>
        );
    };

    renderWaitlistButton = ({
        key, displayTime, isSelected, selectedClass, onJoinWaitlist
    }) => (
        <Flex
            key={key}
            flexDirection='column'
            gap={2}
        >
            <Text is='p'>{this.getText('noAvailableTimes')}</Text>
            {this.renderDayPeriodButton(isSelected, displayTime, onJoinWaitlist, selectedClass, { paddingX: '10px' })}
        </Flex>
    );

    renderTimeSlotButton = ({ displayTime, isSelected, selectedClass, onSelect }) =>
        this.renderDayPeriodButton(isSelected, displayTime, onSelect, selectedClass, { width: 80 });

    renderTimeSlotsButtons = (artistTimeSlots, timeZone) => {
        const { availableTimeslots, isWaitListAvailable } = this.getDayPeriodTimeSlots(artistTimeSlots, timeZone);
        const { morning, afternoon, evening } = availableTimeslots;

        const dayPeriod = [
            {
                name: MORNING,
                timeSlots: morning,
                timePeriodName: this.getText(MORNING),
                timePeriodDesc: `(${this.getText('before')} 11:45 AM)`,
                toolTipContent: this.getText('timeSlotsTooltip')
            },
            {
                name: AFTERNOON,
                timeSlots: afternoon,
                timePeriodName: this.getText(AFTERNOON),
                timePeriodDesc: '(12:00 PM - 4:45 PM)'
            },
            {
                name: EVENING,
                timeSlots: evening,
                timePeriodName: this.getText(EVENING),
                timePeriodDesc: `(${this.getText('after')} 5:00 PM)`
            }
        ];

        const renderDayPeriods = dayPeriod.map(({
            name, timeSlots, timePeriodName, timePeriodDesc, toolTipContent
        }, index) => {
            const showDivider = index > 0 && index < dayPeriod.length;
            const isNoAvailableTimes = timeSlots.length === 0;

            return (
                <Fragment key={name}>
                    {showDivider && <Divider />}
                    <Flex
                        flexDirection={'column'}
                        gap={2}
                        paddingX={[null, null, 4]}
                    >
                        {/* day period /icon */}
                        <Flex
                            alignItems={'center'}
                            gap={2}
                        >
                            <Icon
                                name={name}
                                size={24}
                            />
                            <Text
                                display={'inline-block'}
                                fontWeight={'bold'}
                            >
                                {`${timePeriodName} `}
                                <Text
                                    color={'#888'}
                                    fontWeight={'normal'}
                                    children={timePeriodDesc}
                                />
                            </Text>
                            {toolTipContent && (
                                <Tooltip
                                    dataAt='popover_text'
                                    content={
                                        <Text
                                            display={'inline-block'}
                                            width={136}
                                            children={toolTipContent}
                                        />
                                    }
                                >
                                    <Link
                                        color={'#888'}
                                        marginLeft={'auto'}
                                    >
                                        <Icon
                                            name={'infoOutline'}
                                            size={16}
                                        />
                                    </Link>
                                </Tooltip>
                            )}
                        </Flex>

                        {/* time chicklets */}
                        {isNoAvailableTimes ? (
                            <Text
                                is={'p'}
                                children={this.getText('noAvailableTimes')}
                            />
                        ) : (
                            <Flex
                                key={name}
                                is='fieldset'
                                flexWrap={'wrap'}
                                gap={2}
                                lineHeight={'tight'}
                                position={'relative'}
                            >
                                {timeSlots.map(timeSlot => {
                                    const { startDateTime, displayTime, isJoinWaitlistButton = false } = timeSlot;
                                    const selected = isJoinWaitlistButton
                                        ? this.state.selectedTimeSlot?.selectedWaitListButton === name
                                        : this.state.selectedTimeSlot?.startDateTime === startDateTime;
                                    const selectedClass = selected ? styles.labelActive : styles.labelInactive;

                                    const buttonProps = {
                                        key: isJoinWaitlistButton ? `waitlist-${name}` : startDateTime,
                                        displayTime,
                                        isSelected: selected,
                                        selectedClass
                                    };

                                    const buttonAction = isJoinWaitlistButton
                                        ? { onJoinWaitlist: this.handleJoinWaitlist(name) }
                                        : { onSelect: this.setSelectedTimeSlot(timeSlot) };

                                    return isJoinWaitlistButton
                                        ? this.renderWaitlistButton({ ...buttonProps, ...buttonAction })
                                        : this.renderTimeSlotButton({ ...buttonProps, ...buttonAction });
                                })}
                            </Flex>
                        )}
                    </Flex>
                </Fragment>
            );
        });

        return (
            <>
                {renderDayPeriods}
                {/* Waitlist info */}
                {isWaitListAvailable && (
                    <>
                        <Divider />
                        <div>
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                wordWrap={'break-word'}
                                marginBottom={['14px']}
                                children={this.getText('timeSlotsNotShown')}
                            />
                            <Text
                                is={'h3'}
                                lineHeight={'18px'}
                                fontWeight={'bold'}
                                wordWrap={'break-word'}
                                children={`${this.getText('aboutTheWaitlist')}:`}
                            />
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                display={'inline'}
                            >
                                {this.getText('waitlistHoldInfo')}{' '}
                                <Link
                                    color={'blue'}
                                    lineHeight={'18px'}
                                    wordWrap={'break-word'}
                                    textDecoration={'underline'}
                                    onClick={this.showWaitlistLearnMoreModal}
                                    children={this.getText('waitlistLearnMore')}
                                />
                            </Text>
                        </div>
                    </>
                )}
            </>
        );
    };

    renderCalendarModal = (isCalendarModalOpen, activeCalendarDates, startDate, selectedDate, closedCalendarDates) => {
        if (!isCalendarModalOpen) {
            return null;
        }

        const getTextWithLink = resourceWrapper(this.getText);

        const onDayClick = date => this.setSelectedDate(date);
        const onTodayClick = () => this.setSelectedDate(activeCalendarDates[0]);
        const { isRequestAppointmentEnabled } = Sephora.configurationSettings;
        HappeningBindings.serviceBookingShowCalendarPageLoadAnalytics(this.props.serviceInfo?.displayName);

        return (
            <Modal
                width={4}
                isOpen={isCalendarModalOpen}
                onDismiss={this.toggleShowCalendar}
            >
                <Modal.Header>
                    <Modal.Title>{this.getText('pickDate')}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    overflowY={['auto', null, 'hidden']}
                    overflowX={'hidden'}
                    css={[{ maxHeight: 'calc(100vmax - 114px)' }]}
                    paddingTop={4}
                    paddingBottom={[5, null, 6]}
                >
                    <Flex
                        justifyContent={['flex-end', null, 'center']}
                        marginBottom={[4, null, 5]}
                    >
                        <Link
                            color={'blue'}
                            onClick={onTodayClick}
                            children={this.getText('today')}
                        />
                    </Flex>
                    <Media
                        at='xs'
                        children={
                            <>
                                <Box textAlign={'center'}>
                                    <CalendarWeekdays />
                                </Box>
                                <Divider />
                                <Calendar
                                    monthsInView={3}
                                    maxMonths={4}
                                    defaultDate={startDate}
                                    selectedDay={selectedDate}
                                    availableDays={activeCalendarDates}
                                    closedCalendarDates={closedCalendarDates}
                                    onDayClick={onDayClick}
                                    isVertical={true}
                                    isSmallView={true}
                                    isV2BookingFlow={true}
                                    allowClickOnNext90ValidDays={isRequestAppointmentEnabled}
                                />
                            </>
                        }
                    />
                    <Media
                        greaterThan='xs'
                        children={
                            <Calendar
                                monthsInView={2}
                                maxMonths={4}
                                defaultDate={startDate}
                                selectedDay={selectedDate}
                                availableDays={activeCalendarDates}
                                closedCalendarDates={closedCalendarDates}
                                onDayClick={onDayClick}
                                isV2BookingFlow={true}
                                allowClickOnNext90ValidDays={isRequestAppointmentEnabled}
                            />
                        }
                    />
                    <Box
                        marginTop={[4, null, 6]}
                        paddingLeft={[null, null, 4]}
                    >
                        <Text
                            is={'p'}
                            fontSize={'sm'}
                            color={'gray'}
                            children={getTextWithLink(
                                'calendarMessage',
                                false,
                                <Link
                                    color='blue'
                                    underline
                                    target='_blank'
                                    href={STORE_LOCATOR_URL}
                                    children={this.getText('store')?.toLowerCase()}
                                />
                            )}
                        />
                    </Box>
                </Modal.Body>
                <Modal.Footer
                    display={[null, null, 'flex']}
                    justifyContent={[null, null, 'flex-end']}
                    paddingX={[4, null, 5]}
                    paddingY={[2, null, 2]}
                    boxShadow={shadows.light}
                >
                    <Button
                        variant='primary'
                        block={true}
                        width={['100%', null, 200]}
                        onClick={this.toggleShowCalendar}
                    >
                        {this.getText('done')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    renderError = errorText => (
        <Flex
            gap={3}
            padding={4}
            backgroundColor={'lightRed'}
            alignItems={'center'}
            borderRadius={2}
            marginTop={[4, null, 5]}
        >
            <Icon
                name='alert'
                color='red'
                size={16}
            />
            <Text
                is={'p'}
                color='red'
                children={errorText}
            />
        </Flex>
    );

    renderErrors = (noAvailableDates, noAvailableArtistTimes) => {
        const { showFullyBookedError, isJoinWaitList } = this.state;
        const { isRequestAppointmentEnabled } = Sephora.configurationSettings;

        if (isRequestAppointmentEnabled) {
            return showFullyBookedError && !isJoinWaitList ? this.renderError(this.getText('noAvailableArtistTimes')) : null;
        } else {
            return noAvailableDates
                ? this.renderError(this.getTextWithLink('noTimeSlotsIn90DaysErrorMessage', 'chooseAnotherLocation'))
                : noAvailableArtistTimes && this.renderError(this.getText('noArtistTimeSlotsErrorMessage'));
        }
    };

    showWaitlistLearnMoreModal = e => {
        e.preventDefault();

        return renderModal({
            sid: 'happening_about_the_waitlist_modal',
            title: this.getText('aboutTheWaitlist'),
            type: 'Modal',
            width: 560,
            showCloseButton: true,
            isDrawer: true,
            footerAlign: 'right',
            closeButtonText: this.getText('gotIt'),
            closeButtonWidth: 142
        });
    };

    getTextWithLink = (mainText, textToUnderline) => {
        const getFormattedText = resourceWrapper(this.getText);

        return getFormattedText(
            mainText,
            false,
            <Link
                underline
                color={colors.red}
                onClick={this.props.onClickEditStore}
                children={this.getText(textToUnderline)}
            />
        );
    };

    setupArtistsContainerObserver = () => {
        const artistsContainer = this.artistContainer.current;

        if (artistsContainer) {
            const callback = ([entry]) => {
                const containerSize = entry.contentRect;

                if (containerSize) {
                    const isArtistsContainerScrollWidth = containerSize.width >= BOOKING_PAGE_WIDTH;

                    this.setState({ isArtistsContainerScrollWidth });

                    isArtistsContainerScrollWidth && this.observer.unobserve(artistsContainer);
                }
            };

            this.observer = new ResizeObserver(callback);
            this.observer.observe(artistsContainer);
        }
    };

    fireAnalytics = () => {
        const { selectedStore, serviceInfo, rebookingStoreId, waitlistInfo } = this.props;
        const { startDateTime, dayPeriod } = waitlistInfo || Empty.Object;

        if (startDateTime && dayPeriod) {
            HappeningBindings.waitlistBookingFindAnotherTimePageLoadAnalytics(serviceInfo?.displayName, selectedStore?.storeId);
        } else if (rebookingStoreId) {
            // if rebookingStoreId exists, we are rescheduling or booking again, so we need to trigger appropriate booking analytics here
            HappeningBindings.serviceBookingReschedulePageLoadAnalytics(serviceInfo?.displayName, selectedStore?.storeId);
        } else {
            HappeningBindings.serviceBookingPickArtistDateTimePageLoadAnalytics(serviceInfo?.displayName);
        }
    };

    handleShowYouFoundAnotherTimeModal = callback => {
        const { waitlistInfo } = this.props;
        const { timeZone } = this.state;

        if (waitlistInfo) {
            showYouFoundAnotherTimeModal(waitlistInfo, timeZone, callback);
        } else {
            callback();
        }
    };

    getPotentialServiceBIPoints = () => {
        const price = this.props.serviceInfo?.price;
        const points = price ? anaUtils.removeCurrencySymbol(price) : 0;
        const roundedPoints = parseInt(Math.round(parseFloat(points)));

        return roundedPoints;
    };

    signInBeforeNextStep = callback => {
        if (this.props.user.isSignedIn) {
            this.handleShowYouFoundAnotherTimeModal(callback);
        } else {
            const { isGuestEventServicesEnabled } = Sephora.configurationSettings;
            const potentialServiceBIPoints = this.getPotentialServiceBIPoints();
            const modalCallback = () => this.signInBeforeNextStep(callback);

            if (isGuestEventServicesEnabled) {
                const storeId = this.props.selectedStore?.storeId;
                const bookingType = this.props.serviceInfo?.type;
                showSignInModalWithContextOptions({
                    contextOptions: {
                        guestEventServicesEnabled: true,
                        potentialServiceBIPoints,
                        keepMeSignedIn: true,
                        storeId,
                        bookingType,
                        onContinueAsAGuest: () => callback({ isGuestBooking: true, potentialBIPoints: potentialServiceBIPoints })
                    },
                    cb: modalCallback
                });
            } else {
                showSignInModal(modalCallback);
            }
        }
    };

    handleWaitlistConfirmation = () => {};

    goToReviewAndPayStep = ({ isGuestBooking, potentialBIPoints }) => {
        const {
            artists, selectedDate, selectedArtistId, selectedTimeSlot, isJoinWaitList
        } = this.state;

        if (Sephora.configurationSettings.isRequestAppointmentEnabled && !isJoinWaitList && !selectedTimeSlot) {
            return this.setState({ showFullyBookedError: true });
        }

        const selectedArtist = artists?.find(artist => artist.resourceId === selectedArtistId);

        return (
            selectedTimeSlot &&
            selectedArtist &&
            this.props.onClickCTA(selectedDate, selectedTimeSlot, selectedArtist, isGuestBooking, potentialBIPoints)
        );
    };

    ctaProps = isJoinWaitList => {
        const props = {
            ctaText: this.getText(isJoinWaitList ? 'joinWaitlistButton' : 'continueToReviewAndPay'),
            onClick: () =>
                this.signInBeforeNextStep(({ isGuestBooking, potentialBIPoints } = {}) => {
                    if (isJoinWaitList) {
                        this.handleWaitlistConfirmation();
                    } else {
                        this.goToReviewAndPayStep({ isGuestBooking, potentialBIPoints });
                    }
                })
        };

        return props;
    };

    componentDidMount() {
        this.getInitialDatesAndTimeSlots();
        this.setupArtistsContainerObserver();
        this.fireAnalytics();
    }

    componentWillUnmount() {
        this.observer.disconnect();
    }

    render() {
        const { selectedStore, onClickEditStore } = this.props;
        const {
            dates,
            artists,
            selectedArtistId,
            selectedDate,
            selectedTimeSlot,
            timeZone,
            isCalendarModalOpen,
            startDate,
            activeCalendarDates,
            closedCalendarDates,
            isInitialized,
            isArtistsContainerScrollWidth,
            artistTimeSlots,
            isJoinWaitList
        } = this.state;

        const noAvailableDates = isInitialized && (!dates || activeCalendarDates.length === 0) && isAnyArtistSelected(selectedArtistId);
        const noAvailableArtistTimes = isInitialized && Array.isArray(artistTimeSlots) && artistTimeSlots.length === 0;
        const { isRequestAppointmentEnabled } = Sephora.configurationSettings;

        return (
            <>
                {/* selected store */}
                <Flex
                    flexDirection={'column'}
                    gap={2}
                >
                    {/* header and edit link */}
                    <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Text
                            is={'h2'}
                            fontSize={['md', null, 'lg']}
                            fontWeight={'bold'}
                            lineHeight={['20px', null, '22px']}
                            children={this.getText('store')}
                        />
                        <Link
                            color={'blue'}
                            onClick={onClickEditStore}
                            children={this.getText('edit')}
                        />
                    </Flex>

                    {/* store name and address */}
                    <Text is={'p'}>
                        {ensureSephoraPrefix(selectedStore?.displayName)}
                        <br />
                        <Text>
                            {selectedStore?.address?.address1}
                            <Text
                                color={'#888'}
                                children={` • ${selectedStore?.distance} ${isCanada() ? 'km' : 'mi'}`}
                            />
                        </Text>
                    </Text>
                </Flex>

                <Divider
                    marginY={[5, null, 6]}
                    thick={true}
                    marginX={[-4, 0]}
                    color={'nearWhite'}
                />

                {/* pick an artist */}
                <Flex
                    flexDirection={'column'}
                    gap={4}
                >
                    <Text
                        is={'h2'}
                        fontSize={['md', null, 'lg']}
                        fontWeight={'bold'}
                        lineHeight={['20px', null, '22px']}
                        children={this.getText('pickAnArtist')}
                    />
                    {this.renderArtistsButtons(artists, selectedArtistId, dates, isArtistsContainerScrollWidth, closedCalendarDates)}
                    <Text
                        is={'p'}
                        fontSize={'sm'}
                        marginTop={[-1, 0]}
                        children={this.getText('artistAvailabilityNotice')}
                    />
                </Flex>

                {/* pick a date and time */}
                <Flex
                    marginTop={[5, null, 6]}
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                >
                    <Flex
                        flexDirection={'column'}
                        gap={2}
                    >
                        <Text
                            is={'h2'}
                            fontSize={['md', null, 'lg']}
                            fontWeight={'bold'}
                            lineHeight={['20px', null, '22px']}
                            children={this.getText('pickDateAndTime')}
                        />
                        {!noAvailableDates && (
                            <Text
                                children={
                                    selectedTimeSlot && !selectedTimeSlot?.selectedWaitListButton
                                        ? getFormattedTimeSlot(timeZone, selectedTimeSlot.startDateTime)
                                        : `${getFormattedTimeSlot(timeZone, (selectedDate || startDate)?.toISOString(), true)}, [${this.getText(
                                            'noAvailableTimes'
                                        )}]`
                                }
                            />
                        )}
                    </Flex>
                    <Link
                        textAlign={'right'}
                        lineHeight={'18px'}
                        color={noAvailableDates ? 'gray' : 'blue'}
                        onClick={noAvailableDates ? null : this.toggleShowCalendar}
                        children={this.getText('showCalendar')}
                    />
                </Flex>
                {/* errors */}
                {this.renderErrors(noAvailableDates, noAvailableArtistTimes)}

                {/* pick a date horizontal calendar */}
                <Box marginY={[4, null, 5]}>
                    <HorizontalCalendar
                        showOnHover
                        startDate={startDate}
                        activeCalendarDates={activeCalendarDates}
                        closedCalendarDates={closedCalendarDates}
                        onSelectDate={this.setSelectedDate}
                        selectedDate={selectedDate}
                        allowClickOnNext90ValidDays={isRequestAppointmentEnabled}
                    />
                </Box>
                <Divider marginBottom={4} />

                {/* pick a time day period  */}
                <Flex
                    flexDirection={'column'}
                    gap={4}
                >
                    {this.renderTimeSlotsButtons(artistTimeSlots, timeZone)}
                </Flex>

                {/* cta */}
                <StepsCTA {...this.ctaProps(isJoinWaitList)} />

                {this.renderCalendarModal(isCalendarModalOpen, activeCalendarDates, startDate, selectedDate, closedCalendarDates)}
            </>
        );
    }
}

const styles = {
    artistContainerSmallView: {
        [mediaQueries.xsMax]: {
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none'
            }
        }
    },
    artistContainerLargeView: {
        [mediaQueries.md]: {
            paddingBottom: space[2],
            scrollbarColor: 'auto',
            overflowX: 'scroll'
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
                borderColor: '#888'
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
    dayPeriodInput: {
        position: 'absolute',
        opacity: 0
    }
};

PickArtistDateTime.defaultProps = {
    selectedStore: {},
    onClickCTA: () => {}
};

export default wrapComponent(PickArtistDateTime, 'PickArtistDateTime', true);
