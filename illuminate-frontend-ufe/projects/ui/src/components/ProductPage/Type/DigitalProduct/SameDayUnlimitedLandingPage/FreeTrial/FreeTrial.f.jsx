import React from 'react';
import { Flex, Text, Box } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';
import PropTypes from 'prop-types';
import {
    fontWeights, colors, radii, lineHeights, space
} from 'style/config';

const FreeTrial = ({
    freeTrial, then, annually, joinFor, isUserTrialEligible
}) => {
    return isUserTrialEligible ? (
        <Flex css={styles.container}>
            <Text
                is='span'
                css={styles.trial}
            >
                {freeTrial}
            </Text>
            <Text is='span'>{then} </Text>
            <Text
                is='span'
                css={{ ...styles.annually, ...styles.bold }}
            >
                {annually}
                <sup>*</sup>
            </Text>
        </Flex>
    ) : (
        <Box css={styles.container}>
            <Text is='span'>{joinFor} </Text>
            <Text
                is='span'
                css={styles.annuallyFor}
            >
                {annually}
            </Text>
            <sup>*</sup>
        </Box>
    );
};

const styles = {
    container: {
        alignItems: 'center',
        marginTop: space[4]
    },
    trial: {
        color: colors.white,
        borderRadius: `${radii[2]}px`,
        backgroundColor: colors.brightRed,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.none,
        padding: '4px 6px',
        marginRight: space[2]
    },
    bold: {
        fontWeight: fontWeights.bold
    },
    annually: {
        lineHeight: lineHeights.none
    },
    annuallyFor: {
        lineHeight: lineHeights.none,
        fontWeight: fontWeights.bold,
        color: colors.red
    }
};

FreeTrial.defaultProps = {};

FreeTrial.propTypes = {
    freeTrial: PropTypes.string.isRequired,
    then: PropTypes.string.isRequired,
    annually: PropTypes.string.isRequired,
    joinFor: PropTypes.string.isRequired,
    isUserTrialEligible: PropTypes.bool.isRequired
};

export default wrapFunctionalComponent(FreeTrial, 'FreeTrial');
