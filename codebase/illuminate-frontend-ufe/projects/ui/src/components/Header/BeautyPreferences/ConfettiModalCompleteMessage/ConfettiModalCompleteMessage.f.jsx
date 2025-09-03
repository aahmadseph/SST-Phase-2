import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text, Box } from 'components/ui';
import { keyframes } from '@emotion/react';
import { CONFETTI_MOMENT_TWO_WAIT_MS } from 'constants/beautyPreferences';

const animationDurationSeconds = CONFETTI_MOMENT_TWO_WAIT_MS / 1000;

function ConfettiModalCompleteMessage({ confettiModalMessageComplete }) {
    return (
        <>
            <Text
                is='p'
                lineHeight='tight'
                marginBottom={3}
                children={confettiModalMessageComplete}
            />
            <Box
                backgroundColor='lightGray'
                borderRadius='full'
                overflow='hidden'
                position='relative'
                width={130}
                height={9}
                marginX='auto'
                css={PROGRESS_BAR_ANIMATION}
            />
        </>
    );
}

const ANIMATE_WIDTH = keyframes`
    from { width: 0%; }
    to { width: 100%; }
`;

const ANIMATE_PROGRESS_BAR = {
    animationName: ANIMATE_WIDTH,
    animationDuration: `${animationDurationSeconds}s`
};

const PROGRESS_BAR_ANIMATION = {
    '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        width: '100%',
        background: 'green',
        ...ANIMATE_PROGRESS_BAR
    }
};

ConfettiModalCompleteMessage.propTypes = {
    confettiModalMessageComplete: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(ConfettiModalCompleteMessage, 'ConfettiModalCompleteMessage');
