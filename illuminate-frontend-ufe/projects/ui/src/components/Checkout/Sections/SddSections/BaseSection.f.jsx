import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import {
    borders, colors, fontSizes, fontWeights, mediaQueries, space
} from 'style/config';

const BaseSection = ({ children, isDisabled, isError, title }) => (
    <Box css={isDisabled ? styles.rootBoxMidGray : isError ? styles.rootBoxError : styles.rootBoxBlack}>
        <Text
            data-at={Sephora.debug.dataAt('delivery_gift_options_title')}
            is='h2'
            css={isDisabled ? styles.titleMidGray : styles.titleBlack}
        >
            {title}
        </Text>
        {!isDisabled && children}
    </Box>
);

const styles = {
    rootBoxMidGray: {
        borderColor: colors.midGray,
        borderTop: borders[2],
        padding: `${space[5]}px 0`
    },
    rootBoxError: {
        borderColor: colors.error,
        borderTop: borders[2],
        padding: `${space[5]}px 0`
    },
    rootBoxBlack: {
        borderColor: colors.black,
        borderTop: borders[2],
        padding: `${space[5]}px 0`
    },
    titleMidGray: {
        color: colors.midGray,
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        lineHeight: '20px',
        [mediaQueries.md]: {
            fontSize: fontSizes.xl,
            lineHeight: '29px'
        }
    },
    titleBlack: {
        color: colors.black,
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        lineHeight: '20px',
        [mediaQueries.md]: {
            fontSize: fontSizes.xl,
            lineHeight: '29px'
        }
    }
};

BaseSection.propTypes = {
    children: PropTypes.any.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(BaseSection, 'BaseSection');
