import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'components/ui';
import { colors, fontSizes } from 'style/config';
import Button from 'components/Button';

const RatingScale = ({
    question, scaleLabel, options, selectedRating, onRatingSelect
}) => {
    const handleRatingClick = rating => {
        if (onRatingSelect) {
            onRatingSelect(rating);
        }
    };

    return (
        <Box css={styles.ratingContainer}>
            <Box css={styles.question}>{question}</Box>
            <Box>
                <Box css={styles.ratingNumbers}>
                    {options.map(rating => {
                        const isSelected = selectedRating === rating;

                        return (
                            <Box
                                css={styles.ratingWrapper}
                                onClick={() => handleRatingClick(rating)}
                            >
                                <Button
                                    key={rating}
                                    variant={isSelected ? 'primary' : 'secondary'}
                                    size='sm'
                                    css={styles.ratingButton(isSelected)}
                                >
                                    {rating}
                                </Button>
                            </Box>
                        );
                    })}
                </Box>

                <Box css={styles.scaleLabels}>
                    <span style={{ ...styles.scaleLabel, ...styles.scaleLabelMin }}>{scaleLabel.min}</span>
                    <span style={{ ...styles.scaleLabel, ...styles.scaleLabelMax }}>{scaleLabel.max}</span>
                </Box>
            </Box>
        </Box>
    );
};

const styles = {
    ratingContainer: {
        position: 'relative'
    },
    ratingWrapper: {
        display: 'flex',
        alignItems: 'center',
        height: 40,
        width: 40,
        cursor: 'pointer'
    },
    ratingButton: isSelected => ({
        width: 40,
        height: 28,
        borderRadius: 18,
        fontSize: fontSizes.xs,
        fontWeight: 'normal',
        minWidth: 'auto',
        borderWidth: 1,
        color: isSelected ? 'white' : 'inherit'
    }),
    question: {
        fontSize: fontSizes.sm,
        marginBottom: 8,
        lineHeight: '14px'
    },
    scaleLabels: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    scaleLabel: {
        fontSize: fontSizes.xs,
        color: colors.gray,
        flex: 1
    },
    scaleLabelMin: {
        textAlign: 'left'
    },
    scaleLabelMax: {
        textAlign: 'right'
    },
    ratingNumbers: {
        display: 'flex',
        gap: 11,
        '@media (max-width: 375px)': {
            gap: 7
        }
    }
};

RatingScale.propTypes = {
    question: PropTypes.string.isRequired,
    scaleLabel: PropTypes.shape({
        min: PropTypes.string.isRequired,
        max: PropTypes.string.isRequired
    }).isRequired,
    options: PropTypes.arrayOf(PropTypes.number),
    selectedRating: PropTypes.number,
    disabled: PropTypes.bool,
    onRatingSelect: PropTypes.func
};

RatingScale.defaultProps = {
    options: [],
    selectedRating: null,
    disabled: false,
    onRatingSelect: () => {}
};

export default RatingScale;
