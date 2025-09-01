import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import CalendarWeek from 'components/Calendar/CalendarWeek/CalendarWeek';
import dateUtils from 'utils/Date';

const CalendarMonth = props => {
    const {
        enablePastDays, isWeekView, selectedDay, nextAvailableDate, month
    } = props;
    let weeks = dateUtils.getWeekArray(month.date);

    if (isWeekView) {
        const weekNumber = dateUtils.getWeekNumberInMonth(selectedDay || nextAvailableDate);
        weeks = weeks.filter((week, index) => index === weekNumber);
    }

    const dataAttribute = month.calendarPos === 0 ? 'current_month' : 'next_month';

    return (
        <div
            role='rowgroup'
            data-at={Sephora.debug.dataAt(dataAttribute)}
        >
            {weeks.map(week => (
                <CalendarWeek
                    enablePastDays={enablePastDays}
                    key={week[0].getTime()}
                    week={week}
                    {...props}
                />
            ))}
        </div>
    );
};

export default wrapFunctionalComponent(CalendarMonth, 'CalendarMonth');
