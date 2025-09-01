import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex } from 'components/ui';
import dateUtils from 'utils/Date';
import CalendarDay from 'components/Calendar/CalendarDay/CalendarDay';
import { isWithinCalendarRange } from 'utils/happening';

const CalendarWeek = props => {
    const { week, closedCalendarDates } = props;

    const isDisabledDay = day => {
        const {
            enableAllMonths,
            disabledDays = [],
            availableDays = [],
            nextAvailableDate,
            isLastMonth,
            lastAvailableDay,
            month,
            isV2BookingFlow
        } = props;
        const isBeyondNumberOfMonths = isLastMonth && day.getMonth() > month.index;

        if (isV2BookingFlow) {
            return !dateUtils.isDayInArray(day, availableDays) || dateUtils.isPastDay(day) || isBeyondNumberOfMonths;
        }

        return (
            // A day will appear in the calendar as disabled when:
            // it doesn't belong to the availableDays array and ...
            !dateUtils.isDayInArray(day, availableDays) &&
            // --> it's part of the disabledDays array
            ((disabledDays && dateUtils.isDayInArray(day, disabledDays)) ||
                (!enableAllMonths &&
                    // --> it's before the next available date (useful for week mode view)
                    ((nextAvailableDate && dateUtils.isDayBefore(day, nextAvailableDate)) ||
                        // --> it's a day in the past
                        dateUtils.isPastDay(day) ||
                        // --> it's a day beyond the max calendar month
                        isBeyondNumberOfMonths ||
                        // --> it's day beyond the max date range specified
                        (lastAvailableDay && dateUtils.isDayAfter(day, lastAvailableDay)))))
        );
    };

    const isClosedOnDay = day => {
        return closedCalendarDates.some(closedDate => dateUtils.isSameDay(day, closedDate));
    };

    /* eslint-disable-next-line complexity */
    const renderDay = day => {
        const {
            selectedDay, selectedRange, month, isWeekView, isV2BookingFlow, allowClickOnNext90ValidDays = false
        } = props;
        const isOutside = day.getMonth() !== month.index;
        let isStartRange = false;
        let isEndRange = false;
        let isInRange = false;

        if (selectedRange && selectedRange.start && selectedRange.end) {
            isStartRange = dateUtils.isSameDay(day, selectedRange.start);
            isEndRange = dateUtils.isSameDay(day, selectedRange.end);
            isInRange = dateUtils.isDayBetween(day, selectedRange.start, selectedRange.end) || isStartRange || isEndRange;
        }

        const isSelectedDay = dateUtils.isSameDay(day, selectedDay) || isStartRange || isEndRange;
        const isToday = dateUtils.isSameDay(day, new Date());
        const isDisabledDayValue = isDisabledDay(day);
        const isTodayActive = isToday && !isDisabledDayValue;
        const isTodayInactive = isToday && isDisabledDayValue;
        const isClosed = isClosedOnDay(day);
        const isTodayWithinNext90Days = isWithinCalendarRange(day);

        let tabIndex = -1;

        // Focus on the selected day
        if (!isOutside && isSelectedDay) {
            tabIndex = 0;
        }

        const modifiers = {
            startrange: isStartRange,
            endrange: isEndRange,
            inrange: isInRange,
            selected: isSelectedDay,
            disabled: allowClickOnNext90ValidDays ? isClosed || !isTodayWithinNext90Days : isDisabledDayValue,
            today: isToday
        };

        for (const key in modifiers) {
            if (modifiers[key] === false) {
                delete modifiers[key];
            }
        }

        const key = `${day.getFullYear()}${day.getMonth()}${day.getDate()}`;

        return (
            <CalendarDay
                key={`${isOutside ? 'outside-' : ''}${key}`}
                day={day}
                isWeekView={isWeekView}
                isEmpty={isOutside && !isWeekView}
                tabIndex={tabIndex}
                modifiers={modifiers}
                onClick={props.onDayClick}
                onFocus={props.onDayFocus}
                onKeyDown={props.onDayKeyDown}
                disabled={isDisabledDayValue || isClosed || (isOutside && !isWeekView)}
                selected={allowClickOnNext90ValidDays ? isSelectedDay : isSelectedDay && !isDisabledDayValue}
                isTodayActive={isTodayActive}
                isTodayInactive={isTodayInactive}
                isClosed={isClosed}
                isV2BookingFlow={isV2BookingFlow}
                allowTodayClickIfValidWithin90Days={allowClickOnNext90ValidDays && isTodayWithinNext90Days}
            />
        );
    };

    return (
        <Flex
            role='row'
            fontSize='sm'
        >
            {week.map(day => renderDay(day))}
        </Flex>
    );
};

export default wrapFunctionalComponent(CalendarWeek, 'CalendarWeek');
