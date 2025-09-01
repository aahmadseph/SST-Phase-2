import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    colors, radii, shadows, space
} from 'style/config';
import { Box, Icon } from 'components/ui';

const RADIUS = 2;

function Chiclet({
    radioProps, showX, clickOnX, isLarge, isActive, maxWidth, variant, customPaddingX, children, customCSS, onClick, ...props
}) {
    const IconWrapper = clickOnX ? Box : React.Fragment;

    return (
        <Box
            fontSize={isLarge ? 'base' : 'sm'}
            minHeight={isLarge ? 36 : 32}
            paddingX={customPaddingX || (isLarge ? 4 : 3)}
            lineHeight='tight'
            borderRadius={RADIUS}
            baseCss={[styles[variant], styles[variant][isActive || radioProps?.checked ? 'active' : 'inactive'], customCSS]}
            {...props}
            {...(radioProps && { is: 'label' })}
            {...(!clickOnX ? { onClick } : { paddingRight: 0 })}
        >
            {radioProps && (
                <input
                    type='radio'
                    {...radioProps}
                    css={styles.radioInput}
                />
            )}
            <span
                css={[styles[variant].label, maxWidth && [{ maxWidth }, styles.truncate]]}
                children={children}
            />
            {(showX || clickOnX) && (
                <IconWrapper
                    display='flex'
                    alignItems='center'
                    borderLeft={1}
                    borderColor='white'
                    marginLeft={2}
                    paddingRight={isLarge ? space[4] : space[3]}
                    paddingLeft={isLarge ? space[4] - 1 : space[3] - 1}
                    minHeight={isLarge ? 36 : 32}
                    {...(clickOnX && { onClick })}
                >
                    <Icon
                        className='x'
                        name='x'
                        marginLeft={clickOnX ? 0 : 2}
                        size='10px'
                        css={styles[variant].x}
                    />
                </IconWrapper>
            )}
        </Box>
    );
}

const styles = {
    fill: {
        color: colors.black,
        backgroundColor: colors.lightGray,
        transition: 'background-color .2s',
        '.no-touch &:hover': {
            backgroundColor: colors.nearWhite
        }
    },
    outline: {
        color: colors.midGray,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: 'currentColor',
        transition: 'color .2s',
        '.no-touch &:hover .x': {
            color: colors.black
        },
        label: {
            color: colors.black
        },
        x: {
            color: colors.gray
        },
        '::before': {
            content: '""',
            position: 'absolute',
            inset: -1,
            border: '2px solid currentColor',
            borderRadius: radii[RADIUS],
            opacity: 0,
            transition: 'color .2s, opacity .2s'
        },
        active: {
            color: colors.black,
            '::before': {
                opacity: 1
            }
        },
        inactive: {
            '.no-touch &:hover::before, .no-touch button:hover > &::before': {
                opacity: 1
            }
        }
    },
    shadow: {
        color: colors.black,
        backgroundColor: colors.white,
        boxShadow: shadows.light,
        transition: 'color .2s',
        active: {
            '::before': {
                content: '""',
                position: 'absolute',
                inset: -2,
                border: '2px solid currentColor',
                borderRadius: radii[RADIUS]
            }
        },
        inactive: {
            '.no-touch &:hover': {
                color: colors.gray
            }
        }
    },
    truncate: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    radioInput: {
        position: 'absolute',
        opacity: 0
    }
};

Chiclet.propTypes = {
    isLarge: PropTypes.bool,
    showX: PropTypes.bool,
    clickOnX: PropTypes.bool,
    isActive: PropTypes.bool,
    maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    variant: PropTypes.oneOf(['outline', 'shadow', 'fill']),
    radioProps: PropTypes.object,
    customCSS: PropTypes.object,
    children: PropTypes.any.isRequired
};

Chiclet.defaultProps = {
    clickOnX: false,
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    variant: 'outline',
    customCSS: {}
};

export default wrapFunctionalComponent(Chiclet, 'Chiclet');
