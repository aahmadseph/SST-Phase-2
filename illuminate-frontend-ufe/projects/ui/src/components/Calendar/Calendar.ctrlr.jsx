/* eslint-disable class-methods-use-this */
import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import calendarUtils from 'utils/Calendar';
import keyConsts from 'utils/KeyConstants';
import dateUtils from 'utils/Date';
import * as calendarConstants from 'constants/Calendar';
import { Box, Flex } from 'components/ui';
import CalendarMonth from 'components/Calendar/CalendarMonth/CalendarMonth';
import CalendarHeader from 'components/Calendar/CalendarHeader/CalendarHeader';

const TRANSITION_DURATION = 300;
const MONTH_GUTTER = 5;
const TOTAL_MONTHS = 3;

class Calendar extends BaseClass {
    static defaultProps = {
        /**
         * If calendar is infinite (maxMonths:Infinity) or need a slider in the week view
         * we might need to consider removing the sliding animation
         * or refactor so we have max 3 months/weeks at a time:
         * previous|current|next and recalculate months/weeks accordingly
         * when each transition ends (setTimeout) as seen on Airbnb-ReactDates
         */
        defaultDate: new Date(),
        monthsInView: 2,
        maxMonths: 2,
        isSmallView: false,
        isV2BookingFlow: false
    };

    constructor(props) {
        super(props);

        const {
            enableAllMonths, selectedDay, maxMonths, isSmallView, isV2BookingFlow
        } = props;

        const defaultDate = props.defaultDate || new Date();

        const months = [];
        let totalMonths = maxMonths;
        let startDate = enableAllMonths ? selectedDay || defaultDate : defaultDate;

        /* When enableAllMonths is true we only show one month at a time */
        const monthsInView = enableAllMonths ? 1 : props.monthsInView;

        if (enableAllMonths) {
            startDate = dateUtils.clone(startDate);
            startDate.setMonth(startDate.getMonth() - 1);
            totalMonths = TOTAL_MONTHS;
        }

        for (let i = 0; i < totalMonths; i++) {
            const monthDate = dateUtils.addMonths(startDate, i);
            const monthIndex = monthDate.getMonth();
            months.push({
                name: dateUtils.getMonthArray()[monthIndex],
                date: monthDate,
                calendarPos: i,
                index: monthIndex
            });
        }

        this.state = {
            currentMonthGridIndex: 0,
            isMonthTransitioning: false,
            months,
            hasNavigation: isSmallView && isV2BookingFlow ? false : enableAllMonths ? true : monthsInView < maxMonths
        };

        this.transitionDuration = TRANSITION_DURATION;
    }

    componentDidMount() {
        const { isWeekView, selectedDay, enableAllMonths } = this.props;
        const { hasNavigation } = this.state;

        this.domNode = ReactDOM.findDOMNode(this);

        if ((selectedDay && hasNavigation && !isWeekView) || enableAllMonths) {
            this.scrollSelectedDayIntoView();
        }
    }

    componentDidUpdate(prevProps) {
        const { isWeekView, selectedDay, availableDays } = this.props;

        const isFirstAvailableDay = dateUtils.isSameDay(selectedDay, availableDays[0]);

        if (prevProps.selectedDay !== selectedDay && isFirstAvailableDay && !isWeekView) {
            this.setState(prevState => {
                return {
                    isMonthTransitioning: prevState.hasNavigation,
                    currentMonthGridIndex: 0
                };
            });
        }
    }

    handleDayClick = (day, modifiers, e) => {
        let newStart;
        let newEnd;

        if (modifiers.disabled) {
            e.currentTarget.blur();

            return;
        }

        if (this.props.isRangeDate) {
            const { start, end } = this.props.selectedRange;
            newStart = start;
            newEnd = end;

            if (!start || !dateUtils.isSameDay(start, end)) {
                newStart = day;
                newEnd = day;
            } else {
                if (dateUtils.isDayBefore(day, end)) {
                    newEnd = start;
                    newStart = day;
                } else {
                    newEnd = day;
                }
            }
        }

        this.setState({ isMonthTransitioning: false });

        if (this.props.onDayClick) {
            this.props.onDayClick(
                day,
                {
                    start: newStart,
                    end: newEnd
                },
                e
            );
        }
    };

    handleDayKeyDown = (day, modifiers, e) => {
        if (this.state.isMonthTransitioning && this.state.hasNavigation) {
            return;
        }

        const preventDefault = () => {
            e.preventDefault();
            e.stopPropagation();
        };

        switch (e.key) {
            case keyConsts.LEFT:
                preventDefault();
                this.focusDay(e.currentTarget, day, calendarConstants.FOCUS.PREV_DAY);

                break;
            case keyConsts.RIGHT:
                preventDefault();
                this.focusDay(e.currentTarget, day, calendarConstants.FOCUS.NEXT_DAY);

                break;
            case keyConsts.UP:
                preventDefault();
                this.focusDay(e.currentTarget, day, calendarConstants.FOCUS.PREV_WEEK);

                break;
            case keyConsts.DOWN:
                preventDefault();
                this.focusDay(e.currentTarget, day, calendarConstants.FOCUS.NEXT_WEEK);

                break;
            case keyConsts.ENTER:
            case keyConsts.SPACE:
                preventDefault();
                this.handleDayClick(day, modifiers, e);
                e.currentTarget.focus();

                break;
            default:
                break;
        }

        if (this.props.onDayKeyDown) {
            this.props.onDayKeyDown(day, modifiers, e);
        }
    };

    // Fix to prevent focusing on a day outside the visible area which breaks the css transition
    preventEarlyFocus = callback => {
        const { hasNavigation } = this.state;
        setTimeout(
            () => {
                this.setState({ isMonthTransitioning: false }, () => {
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            },
            hasNavigation ? this.transitionDuration : 0
        );
    };

    focusDay = (dayNode, day, dayDifference) => {
        const { currentMonthGridIndex, months } = this.state;
        const { monthsInView, isWeekView } = this.props;
        const dayNodes = calendarUtils.getDayNodes(this.domNode);
        const dayNodeIndex = calendarUtils.nodeListToArray(dayNodes).indexOf(dayNode);
        const destinationDate = dateUtils.addDays(day, dayDifference);
        const monthDiff = dateUtils.getMonthDiff(months[currentMonthGridIndex].date, destinationDate);
        let isTheMonthOutOfView;
        let callback;

        switch (dayDifference) {
            case calendarConstants.FOCUS.PREV_WEEK:
                if (dayNodeIndex <= calendarConstants.WEEKDAYS - 1) {
                    dayNodes[0] && dayNodes[0].focus();

                    return;
                }

                isTheMonthOutOfView = monthDiff < 0;
                callback = this.onPrevMonthClick;

                break;

            case calendarConstants.FOCUS.PREV_DAY:
                if (dayNodeIndex <= 0) {
                    return;
                }

                isTheMonthOutOfView = monthDiff < 0;
                callback = this.onPrevMonthClick;

                break;

            case calendarConstants.FOCUS.NEXT_DAY:
                if (dayNodeIndex >= dayNodes.length - 1) {
                    return;
                }

                isTheMonthOutOfView = monthDiff >= monthsInView;
                callback = this.onNextMonthClick;

                break;

            case calendarConstants.FOCUS.NEXT_WEEK:
                if (dayNodeIndex > dayNodes.length - (calendarConstants.WEEKDAYS + 1)) {
                    const node = dayNodes[dayNodes.length - 1];
                    node && node.focus();

                    return;
                }

                isTheMonthOutOfView = monthDiff >= monthsInView;
                callback = this.onNextMonthClick;

                break;

            default:
                break;
        }

        const setFocus = () => {
            const node = dayNodes[dayNodeIndex + dayDifference];
            node && node.focus();
        };

        if (isTheMonthOutOfView && !isWeekView) {
            callback(setFocus);
        } else {
            setFocus();
        }
    };

    focusSelectedDay = () => {
        const daySelectedNode = calendarUtils.getDaySelectedNode(this.domNode);
        daySelectedNode && daySelectedNode.focus();
    };

    onNextMonthClick = callback => {
        const { enableAllMonths, maxMonths, monthsInView } = this.props;
        const { currentMonthGridIndex } = this.state;

        if (currentMonthGridIndex < maxMonths - 1 && !(currentMonthGridIndex >= maxMonths - monthsInView)) {
            this.setState(prevState => {
                return {
                    isMonthTransitioning: prevState.hasNavigation,
                    currentMonthGridIndex: prevState.currentMonthGridIndex + 1
                };
            }, this.preventEarlyFocus(callback));
        } else {
            if (enableAllMonths) {
                this.handleInfiniteMonthsClick(false, callback);
            }
        }
    };

    onPrevMonthClick = callback => {
        if (this.state.currentMonthGridIndex > 0) {
            this.setState(prevState => {
                return {
                    isMonthTransitioning: prevState.hasNavigation,
                    currentMonthGridIndex: prevState.currentMonthGridIndex - 1
                };
            }, this.preventEarlyFocus(callback));
        } else {
            if (this.props.enableAllMonths) {
                this.handleInfiniteMonthsClick(true, callback);
            }
        }
    };

    handleInfiniteMonthsClick = (isPreviousMonth, callback) => {
        const { currentMonthGridIndex, months } = this.state;
        const currentMonth = months[currentMonthGridIndex];
        const newMonths = [];
        const firstDate = dateUtils.clone(currentMonth.date);

        if (isPreviousMonth) {
            firstDate.setMonth(currentMonth.date.getMonth() - 2);
        }

        for (let i = 0; i < TOTAL_MONTHS; i++) {
            const monthDate = dateUtils.addMonths(firstDate, i);
            const monthIndex = monthDate.getMonth();
            newMonths.push({
                name: dateUtils.getMonthArray()[monthIndex],
                date: monthDate,
                calendarPos: i,
                index: monthIndex
            });
        }

        this.setState(prevState => {
            return {
                months: newMonths,
                isMonthTransitioning: prevState.hasNavigation,
                currentMonthGridIndex: isPreviousMonth ? 1 : prevState.currentMonthGridIndex - 1
            };
        }, this.preventEarlyFocus(callback));
    };

    // this method analyzes if the selected day is out of view on the calendar,
    // if so we should scroll it into view
    scrollSelectedDayIntoView = () => {
        const { enableAllMonths, monthsInView, defaultDate, selectedDay } = this.props;

        if (enableAllMonths) {
            const pastDate = dateUtils.clone(defaultDate);
            pastDate.setMonth(defaultDate.getMonth() - 1);
            const monthDiff = dateUtils.getMonthDiff(pastDate, defaultDate);
            this.setState({ currentMonthGridIndex: monthDiff });
        } else {
            const monthDiff = dateUtils.getMonthDiff(defaultDate, selectedDay);

            if (monthDiff >= monthsInView) {
                for (let i = 0; i <= monthDiff - monthsInView; i++) {
                    this.onNextMonthClick();
                }
            }
        }
    };

    render() {
        const { currentMonthGridIndex, months, hasNavigation } = this.state;

        const {
            enableAllMonths,
            showAnimation = true,
            selectedDay,
            maxMonths,
            nextAvailableDate,
            isWeekView,
            defaultDate,
            isVertical,
            isSmallView,
            ...otherProps
        } = this.props;

        /* When enableAllMonths is true we only show one month at a time */
        const monthsInView = enableAllMonths ? 1 : this.props.monthsInView;

        const monthGrid = months.map(month => {
            const isLastMonth = month.calendarPos === months.length - 1;
            let isWeekViewMonth;

            if (selectedDay) {
                isWeekViewMonth = selectedDay.getMonth() === month.index;
            } else if (nextAvailableDate) {
                isWeekViewMonth = nextAvailableDate.getMonth() === month.index;
            } else {
                isWeekViewMonth = defaultDate.getMonth() === month.index;
            }

            return (
                ((month && isWeekView && isWeekViewMonth) || !isWeekView) && (
                    <Flex
                        key={month.name}
                        role='grid'
                        flexDirection='column'
                        paddingX={MONTH_GUTTER}
                        flex={hasNavigation || 1}
                        width={hasNavigation && `${100 / monthsInView}%`}
                        flexShrink={0}
                    >
                        {hasNavigation || (
                            <CalendarHeader
                                isWeekView={isWeekView}
                                hasNavigation={hasNavigation}
                                month={month}
                                selectedDay={selectedDay}
                                isSmallView={isSmallView}
                            />
                        )}
                        <CalendarMonth
                            {...otherProps}
                            enableAllMonths={enableAllMonths}
                            isWeekView={isWeekView}
                            isLastMonth={isLastMonth}
                            month={month}
                            hasNavigation={hasNavigation}
                            nextAvailableDate={nextAvailableDate}
                            selectedDay={selectedDay}
                            onDayKeyDown={this.handleDayKeyDown}
                            onDayClick={this.handleDayClick}
                        />
                    </Flex>
                )
            );
        });

        return hasNavigation ? (
            <Box overflow='hidden'>
                <Box marginX={-MONTH_GUTTER}>
                    <CalendarHeader
                        enableAllMonths={enableAllMonths}
                        gutter={MONTH_GUTTER}
                        months={months}
                        isWeekView={isWeekView}
                        currentMonthGridIndex={currentMonthGridIndex}
                        onPrevMonthClick={this.onPrevMonthClick}
                        onNextMonthClick={this.onNextMonthClick}
                        selectedDay={selectedDay}
                        maxMonths={maxMonths}
                        monthsInView={monthsInView}
                        hasNavigation={hasNavigation}
                    />
                    <div
                        css={[
                            {
                                display: 'flex',
                                transform: `translate3d(${this.state.currentMonthGridIndex * -(100 / monthsInView)}%, 0, 0)`
                            },
                            showAnimation && {
                                transition: `transform ${this.transitionDuration}ms ease-in-out`
                            }
                        ]}
                    >
                        {monthGrid}
                    </div>
                </Box>
            </Box>
        ) : (
            <Flex
                marginX={-MONTH_GUTTER}
                flexDirection={isVertical ? 'column' : 'row'}
                children={monthGrid}
            />
        );
    }
}

export default wrapComponent(Calendar, 'Calendar', true);
