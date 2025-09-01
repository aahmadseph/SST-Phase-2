import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import Chevron from 'components/Chevron/Chevron';

const CalendarNavButton = props => {
    const { direction, disabled, ...propsData } = props;

    return (
        <Box
            {...propsData}
            fontSize='md'
            lineHeight='0'
            padding={4}
            marginY={-4}
            css={{
                cursor: disabled ? 'not-allowed' : 'pointer'
            }}
        >
            <Chevron
                color={disabled ? '#888' : ''}
                direction={direction}
            />
        </Box>
    );
};

export default wrapFunctionalComponent(CalendarNavButton, 'CalendarNavButton');
