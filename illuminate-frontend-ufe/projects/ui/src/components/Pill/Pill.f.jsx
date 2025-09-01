import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text } from 'components/ui';
import { colors } from 'style/config';
import Chevron from 'components/Chevron';

function Pill({
    isActive, hasArrow, useActiveArrow, children, maxWidth, color, backgroundColor, isThemeSelection = false, arrowSize, ...props
}) {
    return (
        <Box
            data-state={isActive ? 'active' : 'inactive'}
            baseCss={[
                {
                    transition: 'background-color .2s, color .2s',
                    textTransform: 'none'
                },
                isThemeSelection || {
                    ':focus, button:focus > &': {
                        boxShadow: `${colors.white} 0 0 0 2px,
                        ${colors.black} 0 0 0 3px`
                    }
                },
                isActive || {
                    '.no-touch &:hover, .no-touch button:hover > &': {
                        backgroundColor: colors.nearWhite
                    }
                }
            ]}
            color={isActive ? color || 'white' : color || 'black'}
            backgroundColor={isActive ? backgroundColor || 'black' : backgroundColor || 'lightGray'}
            {...props}
        >
            {maxWidth ? (
                <Text
                    numberOfLines={1}
                    maxWidth={maxWidth}
                    children={children}
                />
            ) : (
                children
            )}
            {hasArrow && (
                <Chevron
                    size={arrowSize}
                    direction={isActive && useActiveArrow ? 'up' : 'down'}
                    marginLeft='.5em'
                />
            )}
        </Box>
    );
}

Pill.defaultProps = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 'base',
    lineHeight: 'none',
    paddingX: 4,
    minHeight: 36,
    borderRadius: 'full',
    useActiveArrow: true,
    arrowSize: '1em'
};

Pill.propTypes = {
    isActive: PropTypes.bool,
    hasArrow: PropTypes.bool,
    /* arrow flips when active */
    useActiveArrow: PropTypes.bool
};

export default wrapFunctionalComponent(Pill, 'Pill');
