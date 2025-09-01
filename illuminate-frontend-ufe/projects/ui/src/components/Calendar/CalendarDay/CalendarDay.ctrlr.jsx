/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { colors, fontWeights } from 'style/config';
import { Box, Flex } from 'components/ui';
import dateUtils from 'utils/Date';

const DAY_PADDING = '2px';
const ITEM_CIRCLE_SIZE = 32;

class CalendarDay extends BaseClass {
    shouldComponentUpdate(nextProps) {
        const propNames = Object.keys(this.props);
        const nextPropNames = Object.keys(nextProps);

        if (propNames.length !== nextPropNames.length) {
            return true;
        }

        return propNames.some(name => {
            if (name === 'modifiers') {
                const prop = this.props[name];
                const nextProp = nextProps[name];
                const modifiers = Object.keys(prop);
                const nextModifiers = Object.keys(nextProp);

                if (modifiers.length !== nextModifiers.length) {
                    return true;
                }

                return modifiers.some(mod => !Object.prototype.hasOwnProperty.call(nextProp, mod) || prop[mod] !== nextProp[mod]);
            }

            if (name === 'day') {
                return !dateUtils.isSameDay(this.props[name], nextProps[name]);
            }

            return !Object.prototype.hasOwnProperty.call(nextProps, name) || this.props[name] !== nextProps[name];
        });
    }

    handleClick = e => {
        this.props.onClick(this.props.day, this.props.modifiers, e);
    };

    handleKeyDown = e => {
        this.props.onKeyDown(this.props.day, this.props.modifiers, e);
    };

    getDateStyles = ({
        selected, isClosed, isTodayActive, isTodayInactive, isActive
    }) => {
        if (selected) {
            return styles.selected;
        } else if (isClosed) {
            return styles.closed;
        } else if (isTodayActive) {
            return styles.todayActive;
        } else if (isTodayInactive) {
            return styles.todayInactive;
        } else if (isActive) {
            return styles.activeDate;
        } else {
            return null;
        }
    };

    render() {
        const {
            day,
            isEmpty,
            modifiers,
            disabled,
            selected,
            tabIndex,
            isV2BookingFlow,
            isTodayActive,
            isTodayInactive,
            isClosed,
            allowTodayClickIfValidWithin90Days
        } = this.props;

        return isEmpty ? (
            <Box flex={1} />
        ) : (
            <Box
                is='div'
                color={disabled && 'gray'}
                position='relative'
                flex={1}
                lineHeight='none'
                paddingY={DAY_PADDING}
                data-calendar={`day ${Object.keys(modifiers).join(' ')}`}
                role='gridcell'
                tabIndex={tabIndex}
                aria-label={day.toDateString()}
                aria-selected={selected}
                onClick={this.handleClick}
                onKeyDown={this.handleKeyDown}
                css={[
                    {
                        cursor: (allowTodayClickIfValidWithin90Days ? !(allowTodayClickIfValidWithin90Days && !isClosed) : disabled)
                            ? 'not-allowed'
                            : 'pointer',
                        outline: 0
                    },
                    styles,
                    selected || isTodayActive || isTodayInactive
                        ? {
                            ...(!isV2BookingFlow && {
                                ':focus > *': {
                                    boxShadow: `${colors.white} 0 0 0 2px,
                            ${colors.black} 0 0 0 3px`
                                }
                            })
                        }
                        : {
                            ':hover > *, :focus > *': {
                                background: isV2BookingFlow && disabled ? 'none' : colors.lightGray
                            }
                        }
                ]}
            >
                <Flex
                    justifyContent='center'
                    alignItems='center'
                    borderRadius='full'
                    width={ITEM_CIRCLE_SIZE}
                    height={ITEM_CIRCLE_SIZE}
                    marginX='auto'
                    css={[
                        { transition: 'background .2s' },
                        this.getDateStyles({
                            selected: allowTodayClickIfValidWithin90Days ? selected && !isClosed : selected,
                            isClosed,
                            isTodayActive,
                            isTodayInactive,
                            isActive: !disabled
                        })
                    ]}
                    position='relative'
                    zIndex={1}
                    children={day.getDate()}
                />
            </Box>
        );
    }
}

const styles = {
    '&[data-calendar*="today"]': {
        fontWeight: 'bold'
    },
    '&[data-calendar*="inrange"]:after': {
        content: '""',
        position: 'absolute',
        zIndex: 0,
        top: DAY_PADDING,
        right: 0,
        bottom: DAY_PADDING,
        left: 0,
        backgroundColor: colors.lightGray
    },
    '&[data-calendar*="startrange"]:after': {
        left: '50%'
    },
    '&[data-calendar*="endrange"]:after': {
        right: '50%'
    },
    selected: {
        color: colors.white,
        background: colors.black,
        fontWeight: fontWeights.bold
    },
    todayActive: {
        color: colors.black,
        background: colors.nearWhite,
        fontWeight: fontWeights.bold
    },
    todayInactive: {
        color: '#888',
        background: colors.nearWhite,
        fontWeight: fontWeights.normal
    },
    activeDate: {
        fontWeight: fontWeights.bold
    },
    closed: {
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 11,
            left: 12,
            width: ITEM_CIRCLE_SIZE,
            height: ITEM_CIRCLE_SIZE,
            borderTop: `1px solid ${colors.midGray}`,
            transform: 'rotate(-45deg)',
            transformOrigin: 'center',
            pointerEvents: 'none'
        }
    }
};

export default wrapComponent(CalendarDay, 'CalendarDay');
