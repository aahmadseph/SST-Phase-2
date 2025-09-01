import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import dateUtils from 'utils/Date';
import { Box, Flex } from 'components/ui';

const CalendarWeekdays = props => {
    const days = dateUtils.getWeekdaysArray();

    return (
        <Flex
            role='row'
            fontSize='sm'
            marginTop={4}
            marginBottom={props.isWeekView ? 1 : 3}
        >
            {days.map(day => (
                <Box
                    key={day}
                    role='columnheader'
                    aria-label={day}
                    flex={1}
                    children={day.substr(0, 3).toUpperCase()}
                />
            ))}
        </Flex>
    );
};

export default wrapFunctionalComponent(CalendarWeekdays, 'CalendarWeekdays');
