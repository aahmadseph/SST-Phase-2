import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    radii, colors, fontSizes, lineHeights, space, shadows
} from 'style/config';
import { Box } from 'components/ui';
import IconCross from 'components/LegacyIcon/IconCross';
import keyConsts from 'utils/KeyConstants';
import FocusTrap from 'focus-trap-react';
import UIUtils from 'utils/UI';

const ARROW_WIDTH = 10;
const ARROW_OUTER_WIDTH = ARROW_WIDTH + 1;
const ARROW_OUTER_COLOR = 'rgba(0,0,0,.125) !important';
const BG_COLOR = colors.white;
const INVERT_BG_COLOR = colors.black;

class Popover extends BaseClass {
    state = {
        isOpen: false,
        triggerWidth: 0
    };

    static defaultProps = {
        width: 276,
        offset: -space[5],
        padding: '1em',
        shouldDisplayPopover: function () {
            return true;
        }
    };

    componentDidMount() {
        const el = ReactDOM.findDOMNode(this);

        if (el && el.offsetWidth) {
            this.setState({ triggerWidth: el.offsetWidth });
        }
    }

    render() {
        const {
            id,
            role,
            isBlock,
            isRelative = true,
            invertColor,
            content,
            children,
            shouldDisplayPopover,
            showImmediately,
            onDismiss,
            dataAt,
            width,
            placementStyle,
            showX,
            offset,
            yOffset,
            rootCss,
            ...props
        } = this.props;

        return shouldDisplayPopover() ? (
            <FocusTrap
                active={Boolean(showImmediately && onDismiss)}
                css={[
                    {
                        position: isRelative ? 'relative' : null,
                        display: isBlock ? 'block' : 'inline-block',
                        outline: 0,
                        flexShrink: 0
                    },
                    rootCss
                ]}
                {...(!showImmediately
                    ? {
                        onMouseEnter: this.showPopover,
                        onFocus: this.showPopover,
                        onMouseLeave: this.closePopover,
                        onBlur: this.closePopover,
                        tabIndex: 0
                    }
                    : null)}
            >
                <Box position='relative'>
                    {showImmediately && onDismiss && (
                        <div
                            onClick={onDismiss}
                            css={styles.backdrop}
                        />
                    )}
                    <div
                        className='Popover'
                        {...(onDismiss && {
                            tabIndex: 0,
                            onKeyDown: e => {
                                if (e.key === keyConsts.ESC) {
                                    e.stopPropagation();
                                    onDismiss(e);
                                }
                            }
                        })}
                        css={[
                            styles.popover,
                            { width },
                            (this.state.isOpen || showImmediately) && { display: 'block' },
                            this.popoverPlacementStyle(),
                            placementStyle
                        ]}
                        data-at={dataAt ? Sephora.debug.dataAt(dataAt) : null}
                    >
                        <div
                            id={id}
                            role={role}
                            css={[styles.inner, invertColor && styles.innerInvert]}
                        >
                            <Box {...props}>
                                {typeof content === 'object' ? (
                                    content
                                ) : (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: content
                                        }}
                                    />
                                )}
                            </Box>
                            <span css={[styles.arrow, this.arrowPlacementStyle()]} />
                        </div>
                        {onDismiss && showX && (
                            <Box
                                aria-label='Close popup'
                                padding={4}
                                lineHeight='0'
                                fontSize={18}
                                position='absolute'
                                top={0}
                                right={0}
                                zIndex={3}
                                onClick={e => onDismiss(e)}
                            >
                                <IconCross x={true} />
                            </Box>
                        )}
                    </div>
                    {children}
                </Box>
            </FocusTrap>
        ) : (
            children
        );
    }

    showPopover = () => {
        // https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile
        if (UIUtils.isIOS()) {
            document.body.style.cursor = 'pointer';
        }

        this.setState({
            isOpen: true
        });
    };

    closePopover = () => {
        if (UIUtils.isIOS()) {
            document.body.style.cursor = '';
        }

        this.setState({
            isOpen: false
        });
    };

    popoverPlacementStyle = () => {
        const { placement, yOffset } = this.props;

        switch (placement) {
            case 'right':
                return {
                    paddingLeft: ARROW_WIDTH,
                    top: '50%',
                    left: '100%',
                    transform: 'translate(0, -50%)'
                };
            case 'bottom':
                return [
                    {
                        paddingTop: ARROW_WIDTH,
                        top: yOffset ? `calc(100% + ${yOffset}px)` : '100%'
                    },
                    this.popoverAlignmentStyle()
                ];
            case 'left':
                return {
                    paddingRight: ARROW_WIDTH,
                    top: '50%',
                    right: '100%',
                    transform: 'translate(0, -50%)'
                };
            case 'top':
            default:
                return [
                    {
                        paddingBottom: ARROW_WIDTH,
                        bottom: yOffset ? `calc(100% + ${yOffset}px)` : '100%'
                    },
                    this.popoverAlignmentStyle()
                ];
        }
    };

    popoverAlignmentStyle = () => {
        const { align, offset, width } = this.props;

        switch (align) {
            case 'right':
                return { right: offset };
            case 'left':
                return { left: offset };
            case 'center':
            default:
                return {
                    left: '50%',
                    marginLeft: -(width / 2)
                };
        }
    };

    arrowPlacementStyle = () => {
        const { placement, invertColor } = this.props;
        const arrowColor = invertColor ? INVERT_BG_COLOR : BG_COLOR;

        switch (placement) {
            case 'right':
                return {
                    top: '50%',
                    left: 0,
                    marginTop: -ARROW_OUTER_WIDTH,
                    borderLeftWidth: 0,
                    borderRightColor: ARROW_OUTER_COLOR,
                    '&:after': {
                        left: 1,
                        bottom: -ARROW_WIDTH,
                        borderLeftWidth: 0,
                        borderRightColor: arrowColor
                    }
                };
            case 'bottom':
                return [
                    {
                        top: 0,
                        borderTopWidth: 0,
                        borderBottomColor: ARROW_OUTER_COLOR,
                        '&:after': {
                            top: 1,
                            marginLeft: -ARROW_WIDTH,
                            borderTopWidth: 0,
                            borderBottomColor: arrowColor
                        }
                    },
                    this.arrowAlignmentStyle()
                ];
            case 'left':
                return {
                    top: '50%',
                    right: 0,
                    marginTop: -ARROW_OUTER_WIDTH,
                    borderRightWidth: 0,
                    borderLeftColor: ARROW_OUTER_COLOR,
                    '&:after': {
                        right: 1,
                        bottom: -ARROW_WIDTH,
                        borderRightWidth: 0,
                        borderLeftColor: arrowColor
                    }
                };
            case 'top':
            default:
                return [
                    {
                        bottom: 0,
                        borderBottomWidth: 0,
                        borderTopColor: ARROW_OUTER_COLOR,
                        '&:after': {
                            bottom: 1,
                            marginLeft: -ARROW_WIDTH,
                            borderBottomWidth: 0,
                            borderTopColor: arrowColor
                        }
                    },
                    this.arrowAlignmentStyle()
                ];
        }
    };

    arrowAlignmentStyle = () => {
        const { align, offset } = this.props;
        const { triggerWidth } = this.state;
        let arrowOffset;

        if (triggerWidth) {
            arrowOffset = triggerWidth / 2 - offset - ARROW_OUTER_WIDTH;
        }

        switch (align) {
            case 'right':
                return { right: arrowOffset };
            case 'left':
                return { left: arrowOffset };
            case 'center':
            default:
                return {
                    left: '50%',
                    marginLeft: -ARROW_OUTER_WIDTH
                };
        }
    };
}

const styles = {
    popover: {
        display: 'none',
        position: 'absolute',
        outline: 0,
        zIndex: 2
    },
    inner: {
        color: colors.base,
        fontSize: fontSizes.base,
        lineHeight: lineHeights.tight,
        fontWeight: 'var(--font-weight-normal)',
        padding: 1,
        textAlign: 'left',
        borderRadius: radii[2],
        backgroundColor: BG_COLOR,
        backgroundClip: 'padding-box',
        borderWidth: 1,
        borderColor: colors.darken2,
        boxShadow: shadows.medium,
        whiteSpace: 'normal'
    },
    innerInvert: {
        color: colors.white,
        backgroundColor: INVERT_BG_COLOR
    },
    arrow: {
        borderWidth: ARROW_OUTER_WIDTH,
        '&, &:after': {
            position: 'absolute',
            display: 'block',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderColor: 'transparent'
        },
        '&:after': {
            borderWidth: ARROW_WIDTH,
            content: '""'
        }
    },
    backdrop: {
        position: 'fixed',
        inset: 0,
        zIndex: 1
    }
};

export default wrapComponent(Popover, 'Popover', true);
