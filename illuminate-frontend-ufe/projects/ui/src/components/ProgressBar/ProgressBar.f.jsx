import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text, Flex } from 'components/ui';
import { radii, fontSizes, colors } from 'style/config';
import PropTypes from 'prop-types';

const ProgressBar = ({
    total, completed, minProgressPercentage, displayNumbers, label
}) => {
    let progressPercentage = Number.isSafeInteger(minProgressPercentage) ? minProgressPercentage : 0;

    if (Number.isSafeInteger(total) && Number.isSafeInteger(completed)) {
        const currentProgressPercentage = (completed / total) * 100;

        if (!Number.isNaN(currentProgressPercentage) && currentProgressPercentage > minProgressPercentage) {
            progressPercentage = currentProgressPercentage;
        }

        if (progressPercentage > 100) {
            progressPercentage = 100;
        }
    }

    const progressBarStyle = {
        width: `${progressPercentage}%`
    };

    return (
        <Flex
            alignItems='center'
            gap={1}
        >
            <Box
                role='progressbar'
                aria-valuenow={Math.round(progressPercentage)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={label}
                css={styles.progressBarContainer}
            >
                <Box style={{ ...styles.progressBarPercentage, ...progressBarStyle }} />
            </Box>
            {displayNumbers && Number.isFinite(completed) && Number.isFinite(total) && (
                <Text
                    children={`${completed}/${total}`}
                    css={styles.progressBarNumbers}
                />
            )}
        </Flex>
    );
};

const styles = {
    progressBarContainer: {
        backgroundColor: colors.lightGray,
        borderRadius: radii[5],
        overflow: 'hidden',
        height: 9,
        marginLeft: 'auto',
        flex: 1
    },
    progressBarPercentage: {
        borderRadius: radii[5],
        backgroundColor: colors.green,
        height: '100%'
    },
    progressBarNumbers: {
        fontSize: fontSizes.sm,
        color: colors.gray
    }
};

ProgressBar.propTypes = {
    total: PropTypes.number,
    completed: PropTypes.number,
    displayNumbers: PropTypes.bool,
    minProgressPercentage: PropTypes.number,
    label: PropTypes.string
};

ProgressBar.defaultProps = {
    minProgressPercentage: 5,
    displayNumbers: true,
    label: 'Progress'
};

export default wrapFunctionalComponent(ProgressBar, 'ProgressBar');
