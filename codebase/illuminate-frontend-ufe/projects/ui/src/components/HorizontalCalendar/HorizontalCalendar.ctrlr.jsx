/* eslint-disable class-methods-use-this */
/**
 *
 * Horizontal date calendar with date selection
 * @param {Date[]} dates (otional) List of consecutive date objects whitin a custom range
 * @param {number} daysLength (otional) The lenght in days to construct the calendar starting from today. Default value is 90 days
 * @param {string[]} activeCalendarDates The list of dates that are available/selectable on the calendar in format e.g: ['2023-11-22', '2023-12-03']
 * @param {function} onSelectDate callback that returns the selected date as in activeCalendarDates
 * @param {boolean} showOnHover display prev/next calendar arrows on hover on LGUI only
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Text, Image, Flex
} from 'components/ui';

import {
    colors, fontWeights, radii, space
} from 'style/config';

import dateUtils from 'utils/Date';
import { buildCalendarDates } from 'utils/happening';

const ITEM_HEIGHT = 70;
const ITEM_WIDTH = 40;
const ITEM_CIRCLE_SIZE = 32;
const ARROW_SIZE = 24;
const PREV = 'prev';
const NEXT = 'next';

const getDateCircle = backgroundColor => ({
    '&::before': {
        content: '""',
        position: 'absolute',
        backgroundColor,
        borderRadius: radii.full,
        height: ITEM_CIRCLE_SIZE,
        width: ITEM_CIRCLE_SIZE,
        top: '-28%',
        left: `${(ITEM_WIDTH - ITEM_CIRCLE_SIZE) / 2}px`,
        zIndex: -1,
        display: 'inline-block'
    }
});

const styles = {
    list: {
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
        overscrollBehaviorX: 'none',
        scrollBehavior: 'smooth',
        scrollSnapType: 'x mandatory',
        '&::-webkit-scrollbar': { display: 'none' }
    },
    hover: {
        ' &:hover .Carousel-arrow': {
            opacity: 1
        }
    },
    arrowsHover: {
        cursor: 'pointer',
        transition: 'opacity .2s'
    },
    inactiveDate: {
        color: '#888',
        cursor: 'not-allowed'
    },
    validDate: {
        color: '#888'
    },
    activeDate: {
        color: colors.black,
        fontWeight: fontWeights.bold,
        '&:hover': {
            position: 'relative',
            display: 'inline-block',
            ...getDateCircle(colors.lightGray)
        }
    },
    selectedDate: {
        position: 'relative',
        display: 'inline-block',
        color: colors.white,
        fontWeight: fontWeights.bold,
        ...getDateCircle(colors.black)
    },
    todayDateActive: {
        position: 'relative',
        display: 'inline-block',
        color: colors.black,
        fontWeight: fontWeights.bold,
        ...getDateCircle(colors.nearWhite)
    },
    todayDateInactive: {
        position: 'relative',
        display: 'inline-block',
        color: '#888',
        ...getDateCircle(colors.nearWhite)
    },
    closedDate: {
        position: 'relative',
        display: 'inline-block',
        color: '#888',
        cursor: 'not-allowed',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 6,
            left: 16,
            width: ITEM_CIRCLE_SIZE,
            height: ITEM_CIRCLE_SIZE,
            borderTop: `1px solid ${colors.midGray}`,
            transform: 'rotate(-45deg)',
            transformOrigin: 'center',
            pointerEvents: 'none'
        }
    },
    disabled: {
        opacity: '.25'
    },
    next: {
        '> img': {
            transform: 'scaleX(-1)'
        }
    },
    divider: {
        backgroundColor: colors.midGray,
        height: ITEM_HEIGHT,
        width: 1,
        position: 'absolute',
        top: 0
    }
};

const CalendarArrow = ({ direction, onClick, showOnHover }) => {
    const isPrev = direction === PREV;
    const isNext = direction === NEXT ?? !isPrev;

    return (
        <Box
            css={
                isPrev
                    ? [styles.arrowsHover, showOnHover && { opacity: 0 }]
                    : isNext && [styles.next, styles.arrowsHover, showOnHover && { opacity: 0 }]
            }
            className={'Carousel-arrow'}
            right={isNext && -space[3]}
            bottom={1}
            left={isPrev && -space[3]}
            display={['none', null, 'block']}
            position={'absolute'}
            height={ARROW_SIZE}
            width={ARROW_SIZE}
            zIndex={10}
            onClick={onClick}
        >
            <Image
                alt={'chevron carousel'}
                src={'/img/ufe/chevron-carousel.svg'}
                size={ARROW_SIZE}
                css={isNext && styles.hover}
                display={'block'}
                marginX={'auto'}
                maxWidth={null}
            />
        </Box>
    );
};

class HorizontalCalendar extends BaseClass {
    constructor(props) {
        super(props);

        this.calendarDates = props.dates ? props.dates : buildCalendarDates(props.daysLength, props.startDate);

        this.state = {
            selectedDate: this.getFirstSelectedDate(props.activeCalendarDates[0]),
            intersectedMonthLabel: ''
        };

        this.rootRef = React.createRef();
        this.listRef = React.createRef();
        this.labelRef = React.createRef();

        this.observers = [];
    }

    getShortDayName = date => {
        const shortenedWeekdaysArray = dateUtils.getShortenedWeekdaysArray();
        const shortDayName = shortenedWeekdaysArray[date.getDay()];

        return shortDayName;
    };

    handleOnSelectDate = selectedDate => () => {
        this.setState({ selectedDate }, () => this.props.onSelectDate(selectedDate));
    };

    scroll = direction => {
        const list = this.listRef.current;
        const scrollAmount = this.rootRef.current.offsetWidth - space[4];
        const scrollDiff = direction === NEXT ? scrollAmount : -scrollAmount;

        list.scrollBy(scrollDiff, 0);
    };

    getFirstSelectedDate = firstActiveDate => {
        if (!firstActiveDate) {
            return null;
        }

        return this.calendarDates.find(date => dateUtils.isSameDay(date, firstActiveDate));
    };

    getIsActiveDate = calendarDate => {
        return this.props.activeCalendarDates.some(activeDate => dateUtils.isSameDay(calendarDate, activeDate));
    };

    getIsStoreClosedOnDate = calendarDate => {
        return this.props.closedCalendarDates.some(closedDate => dateUtils.isSameDay(calendarDate, closedDate));
    };

    getDateStyles = ({
        isSelected, isClosed, isTodayActive, isTodayInactive, isActive, validDate
    }) => {
        if (isSelected) {
            return styles.selectedDate;
        } else if (isClosed) {
            return styles.closedDate;
        } else if (isTodayActive) {
            return styles.todayDateActive;
        } else if (isTodayInactive) {
            return styles.todayDateInactive;
        } else if (isActive) {
            return styles.activeDate;
        } else if (validDate) {
            return styles.validDate;
        } else {
            return styles.inactiveDate;
        }
    };

    setupObservers = () => {
        const root = this.rootRef.current;
        const list = this.listRef.current;
        const label = this.labelRef.current;

        if (root && list && label) {
            const callback = ([entry]) => {
                if (entry.isIntersecting) {
                    this.setState({
                        intersectedMonthLabel: entry.target.getAttribute('data-month-label')
                    });
                }
            };

            const rootMarginRight = root.offsetWidth - label.offsetLeft - label.offsetWidth;
            const rootMarginLeft = label.offsetLeft;

            const options = {
                root,
                rootMargin: `0px -${rootMarginRight}px 0px -${rootMarginLeft}px`,
                threshold: 0
            };

            const elementsToObserve = Array.from(list.children);

            elementsToObserve.forEach((element, index) => {
                this.observers[index] = new IntersectionObserver(callback, options);
                this.observers[index].observe(element);
            });
        }
    };

    scrollSelectedDayIntoView = selectedDate => {
        const root = this.rootRef.current;
        const list = this.listRef.current;

        if (root && list && selectedDate) {
            const dateElements = Array.from(list.children);

            const element = dateElements.find(el => dateUtils.isSameDay(new Date(el.getAttribute('data-month-date')), selectedDate));

            if (element) {
                const { right: parentRight, left: parentLeft, width: parentWidth } = root.getBoundingClientRect();
                const { right, left, width } = element.getBoundingClientRect();

                const isVisible =
                    (left >= parentLeft && left + width < parentWidth) ||
                    (right <= parentRight && right + width >= parentLeft && right - width < parentWidth);

                !isVisible &&
                    list.scrollTo({
                        left: element.offsetLeft,
                        behavior: 'smooth'
                    });
            }
        }
    };

    scrollPrev = () => this.scroll(PREV);

    scrollNext = () => this.scroll(NEXT);

    componentDidMount() {
        this.setupObservers();
    }

    componentDidUpdate(prevProps) {
        const { selectedDate } = this.props;

        if (prevProps.selectedDate !== selectedDate) {
            this.scrollSelectedDayIntoView(selectedDate);

            this.setState({
                selectedDate: this.getFirstSelectedDate(selectedDate)
            });
        }
    }

    componentWillUnmount() {
        if (this.observers.length) {
            this.observers.forEach(observer => {
                observer.disconnect();
            });
        }
    }

    render() {
        const calendar = this.calendarDates;

        const { selectedDate, intersectedMonthLabel } = this.state;
        const { showOnHover, allowClickOnNext90ValidDays } = this.props;

        return (
            <Flex
                ref={this.rootRef}
                position={'relative'}
                css={[showOnHover && styles.hover]}
                marginX={[-4, 0]}
            >
                <Box
                    ref={this.labelRef}
                    is={'span'}
                    position={'absolute'}
                    top={0}
                    left={4}
                    zIndex={10}
                    backgroundColor={colors.white}
                    fontSize={'10px'}
                    fontWeight={'bold'}
                    lineHeight={'none'}
                    textAlign={'center'}
                    paddingX={'2px'}
                    children={intersectedMonthLabel}
                />
                <Box
                    overflowX={'hidden'}
                    position={'relative'}
                >
                    <Flex
                        ref={this.listRef}
                        is={'ul'}
                        height={ITEM_HEIGHT}
                        paddingX={2}
                        gap={2}
                        css={[styles.list]}
                    >
                        {calendar.map((date, index) => {
                            const dateIsoString = date.toISOString();

                            const isActive = !!this.getIsActiveDate(date);
                            const isInactive = !isActive;
                            const isSelected = dateUtils.isSameDay(date, selectedDate);
                            const isToday = dateUtils.isToday(dateIsoString);
                            const isTodayActive = isToday && isActive;
                            const isTodayInactive = isToday && isInactive;
                            const isClosed = this.getIsStoreClosedOnDate(date);

                            const disabled = allowClickOnNext90ValidDays ? isClosed : isClosed || isInactive;
                            const validDate = !disabled && allowClickOnNext90ValidDays;

                            const showMonthLabel = index > 0 && date.getMonth() !== calendar[index - 1].getMonth();
                            const showDivider = showMonthLabel && index !== 0;
                            const monthLabel = dateUtils.getShortenedMonth(date.getMonth() + 1).toUpperCase();
                            const dayNameColor = isActive ? colors.black : '#888';

                            return (
                                <Fragment key={dateIsoString}>
                                    {showDivider && (
                                        <Box
                                            is={'li'}
                                            data-month={monthLabel}
                                            flexShrink={0}
                                            height={ITEM_HEIGHT}
                                            position={'relative'}
                                        >
                                            <Box css={[styles.divider]} />
                                        </Box>
                                    )}
                                    <Flex
                                        is={'li'}
                                        data-month-label={monthLabel}
                                        data-month-date={isActive && dateIsoString}
                                        alignItems={'center'}
                                        justifyContent={'center'}
                                        flexDirection={'column'}
                                        flexShrink={0}
                                        gap={'10px'}
                                        height={ITEM_HEIGHT}
                                        width={ITEM_WIDTH}
                                        position={'relative'}
                                        disabled={disabled}
                                        aria-label={`${dateUtils.getDateInMMDDYYYY(date)} `}
                                        aria-selected={isSelected}
                                        {...(disabled && { 'aria-disabled': true })}
                                        onClick={this.handleOnSelectDate(date)}
                                    >
                                        {showMonthLabel && (
                                            <Box
                                                is={'span'}
                                                width={ITEM_WIDTH}
                                                position={'absolute'}
                                                top={0}
                                                left={0}
                                                fontSize={'10px'}
                                                fontWeight={'bold'}
                                                lineHeight={'none'}
                                                textAlign={'center'}
                                                children={monthLabel}
                                            />
                                        )}
                                        <Text
                                            marginTop={2}
                                            fontSize={'sm'}
                                            color={dayNameColor}
                                            children={this.getShortDayName(date).toUpperCase()}
                                        />
                                        <Text
                                            display={'inline-block'}
                                            width={ITEM_WIDTH}
                                            textAlign={'center'}
                                            css={[
                                                this.getDateStyles({
                                                    isSelected,
                                                    isClosed,
                                                    isTodayActive,
                                                    isTodayInactive,
                                                    isActive,
                                                    validDate
                                                })
                                            ]}
                                            children={date.getDate()}
                                        />
                                    </Flex>
                                </Fragment>
                            );
                        })}
                    </Flex>
                </Box>
                <CalendarArrow
                    direction={PREV}
                    onClick={this.scrollPrev}
                    showOnHover={showOnHover}
                />
                <CalendarArrow
                    direction={NEXT}
                    onClick={this.scrollNext}
                    showOnHover={showOnHover}
                />
            </Flex>
        );
    }
}

HorizontalCalendar.propTypes = {
    daysLength: PropTypes.number,
    showOnHover: PropTypes.bool,
    onSelectDate: PropTypes.func,
    activeCalendarDates: PropTypes.arrayOf(Date),
    closedCalendarDates: PropTypes.arrayOf(Date),
    dates: PropTypes.arrayOf(Date),
    allowClickOnNext90ValidDays: PropTypes.bool
};

HorizontalCalendar.defaultProps = {
    onSelectDate: () => {},
    activeCalendarDates: [],
    closedCalendarDates: [],
    allowClickOnNext90ValidDays: false
};

export default wrapComponent(HorizontalCalendar, 'HorizontalCalendar', true);
