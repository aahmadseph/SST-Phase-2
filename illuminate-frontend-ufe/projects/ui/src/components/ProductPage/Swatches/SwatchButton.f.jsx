import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors, radii } from 'style/config';
import swatchUtils from 'utils/Swatch';

const { SWATCH_BORDER, SQUARE_MARGIN } = swatchUtils;

const SwatchButton = React.forwardRef(
    (
        {
            isActive,
            type,
            isImage,
            // eslint-disable-next-line no-unused-vars
            comps, // TODO: look into why this is busted
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                css={[
                    styles.button,
                    isImage
                        ? [styles.buttonImage, styles.button[type], isActive ? styles.buttonImageActive : styles.buttonImageInactive]
                        : {
                            padding: SWATCH_BORDER
                        },
                    isActive && { cursor: 'default' }
                ]}
                {...props}
            />
        );
    }
);

SwatchButton.propTypes = {
    type: PropTypes.string.isRequired,
    isImage: PropTypes.bool,
    isActive: PropTypes.bool
};

const styles = {
    button: {
        display: 'inline-flex',
        flexShrink: 0,
        position: 'relative',
        justifyContent: 'center',
        scrollSnapAlign: 'start',
        circle: {
            borderRadius: radii.full
        },
        square: {
            borderRadius: radii[3] + 2,
            marginRight: SQUARE_MARGIN,
            marginTop: SQUARE_MARGIN
        },
        rectangle: {
            borderRadius: radii[3] + 4
        }
    },
    buttonImage: {
        borderWidth: SWATCH_BORDER / 2,
        padding: SWATCH_BORDER / 2,
        borderColor: colors.white,
        transition: 'border-color .2s'
    },
    buttonImageActive: {
        borderColor: colors.black
    },
    buttonImageInactive: {
        '.no-touch &:hover': {
            borderColor: colors.midGray
        }
    }
};

export default wrapFunctionalComponent(SwatchButton, 'SwatchButton');
