import React from 'react';
import FrameworkUtils from 'utils/framework';
import { Flex, Box } from 'components/ui';
import { keyframes } from '@emotion/react';
import { colors } from 'style/config';

const { wrapFunctionalComponent } = FrameworkUtils;

const loadingDotsAnimation = keyframes`
    0%, 60%, 100% {
        opacity: 0.3;
    }
    30% {
        opacity: 1;
    }
`;

function LoadingDots() {
    return (
        <Flex>
            <Box css={[styles.message, styles.received]}>
                <Flex
                    alignItems='center'
                    gap={1}
                >
                    <Box css={[styles.dot, styles.dot1]} />
                    <Box css={[styles.dot, styles.dot2]} />
                    <Box css={[styles.dot, styles.dot3]} />
                </Flex>
            </Box>
        </Flex>
    );
}

const styles = {
    message: {
        padding: 18,
        borderRadius: 12,
        borderBottomLeftRadius: 0
    },
    received: {
        backgroundColor: colors.nearWhite,
        color: colors.black
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: colors.gray,
        animationName: loadingDotsAnimation,
        animationDuration: '1.2s',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'ease-in-out'
    },
    dot1: {
        animationDelay: '0s'
    },
    dot2: {
        animationDelay: '0.2s'
    },
    dot3: {
        animationDelay: '0.4s'
    }
};

export default wrapFunctionalComponent(LoadingDots, 'LoadingDots');
