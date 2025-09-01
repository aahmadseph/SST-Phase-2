/* eslint-disable max-len */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Hammer from 'react-hammerjs';
import localeUtils from 'utils/LanguageLocale';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import {
    radii, fontSizes, lineHeights, space, colors
} from 'style/config';

const ICON_SIZE = 24;
const ZOOM = 0.5;

class PanZoom extends BaseClass {
    constructor(props) {
        super(props);
        this._startX = 0;
        this._startY = 0;
        this.state = {
            scale: props.scale || 1,
            pinchScale: 1,
            translate: {
                x: 0,
                y: 0
            },
            showMsg: this.props.showMsg
        };
        // Bind 'this' to the methods
        this.onPanStart = this.onPanStart.bind(this);
        this.onPan = this.onPan.bind(this);
        this.onPinch = this.onPinch.bind(this);
        this.onPinchStart = this.onPinchStart.bind(this);
        this.onPinchEnd = this.onPinchEnd.bind(this);
        this.updateCoords = this.updateCoords.bind(this);
        this.onDoubleTap = this.onDoubleTap.bind(this);
        this.zoom = this.zoom.bind(this);
    }

    onPanStart = () => {
        this._startX = this.state.translate.x;
        this._startY = this.state.translate.y;
    };

    onPanEnd = () => {};

    onPan = event => {
        event.preventDefault();

        // Bug in Hammer with Chrome: https://github.com/hammerjs/hammer.js/issues/1050
        if (event.srcEvent.type !== 'pointercancel') {
            this.setState({
                translate: {
                    x: this._startX + event.deltaX,
                    y: this._startY + event.deltaY
                }
            });
        } else {
            this.setState({
                translate: {
                    x: this._startX,
                    y: this._startY
                }
            });
        }
    };

    onPinch = event => {
        if (this.state.showMsg) {
            this.setState({ showMsg: false });
        }

        this.setState({ pinchScale: event.scale }, () => this.onPan(event));
    };

    onPinchEnd = event => {
        this.setState(prevState => ({
            scale: prevState.scale * event.scale,
            pinchScale: 1
        }));
    };

    onPinchStart = event => {
        this.onPanStart(event);
    };

    updateCoords = coord => {
        this.setState({
            translate: {
                x: coord.x,
                y: coord.y
            }
        });
    };

    onDoubleTap = () => {
        this.zoom(true);
    };

    zoom = isZoomIn => {
        if (this.state.showMsg) {
            this.setState({ showMsg: false });
        }

        // eslint-disable-next-line prefer-const
        let intervalId, scale, zoomStep;
        const animateScale = () => {
            const zoomFactor = isZoomIn ? this.state.scale + zoomStep : this.state.scale - zoomStep;

            if (zoomFactor > 0.1) {
                if (Math.abs(this.state.scale - scale) < 0.01) {
                    cancelAnimationFrame(intervalId);
                } else {
                    this.setState({ scale: zoomFactor });
                    requestAnimationFrame(animateScale);
                }
            }
        };
        scale = isZoomIn ? this.state.scale + ZOOM : this.state.scale - ZOOM;
        const zoomTime = 100;
        zoomStep = isZoomIn ? scale - this.state.scale : this.state.scale - scale;
        zoomStep /= zoomTime;
        intervalId = requestAnimationFrame(animateScale);
        this.fireZoomAnalytics();
    };

    fireZoomAnalytics = () => {
        const actionInfo = 'product:alt-image:zoom';
        const linkName = 'product:alt-image:zoom';
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo,
                linkName,
                eventStrings: [anaConsts.Event.EVENT_71]
            }
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/PanZoom/locales', 'PanZoom');

        const x = this.state.translate.x;
        const y = this.state.translate.y;
        const scale = this.props.scale || this.state.scale;
        const { showPinchBottom } = this.props;

        return (
            <React.Fragment>
                <Hammer
                    direction={Hammer.DIRECTION_ALL}
                    onPan={this.onPan}
                    onPanStart={this.onPanStart}
                    onPanEnd={this.onPanEnd}
                    onPinch={this.onPinch}
                    onPinchStart={this.onPinchStart}
                    onPinchEnd={this.onPinchEnd}
                    onDoubleTap={this.onDoubleTap}
                    options={{
                        recognizers: {
                            swipe: {
                                enable: false
                            },
                            pinch: {
                                enable: true
                            },
                            press: {
                                enable: false
                            },
                            pan: {
                                enable: true
                            },
                            tap: {
                                enable: true
                            }
                        }
                    }}
                >
                    <div
                        css={styles.container}
                        style={{
                            width: this.props.width,
                            height: this.props.height
                        }}
                    >
                        <div
                            css={styles.inner}
                            style={{
                                transform: `translate(${x}px, ${y}px) ` + `scale(${scale * this.state.pinchScale})`
                            }}
                        >
                            {this.props.children}
                        </div>
                        {this.state.showMsg && (
                            <div
                                css={showPinchBottom ? styles.pinchBottom : styles.msg}
                                children={showPinchBottom ? getText('pinchToZoom') : getText('pinchAndZoom')}
                            />
                        )}
                    </div>
                </Hammer>
                {this.props.disableButtons || (
                    <div css={styles.zoomControls}>
                        <button
                            type='button'
                            css={styles.zoomControlsBtn}
                            onClick={() => this.zoom(true)}
                        >
                            <svg
                                width={ICON_SIZE}
                                height={ICON_SIZE}
                                viewBox='0 0 24 24'
                            >
                                <path d='M12.8 3h-1.6v8.2H3v1.6h8.2V21h1.6v-8.2H21v-1.6h-8.2z' />
                            </svg>
                        </button>
                        <button
                            type='button'
                            css={styles.zoomControlsBtn}
                            onClick={() => this.zoom(false)}
                        >
                            <svg
                                width={ICON_SIZE}
                                height={ICON_SIZE}
                                viewBox='0 0 24 24'
                            >
                                <path d='M2 12.9h20v-1.8H2z' />
                            </svg>
                        </button>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const styles = {
    container: {
        position: 'relative',
        overflow: 'hidden'
    },
    inner: {
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    msg: {
        pointerEvents: 'none',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: radii[2],
        fontSize: fontSizes.md,
        lineHeight: lineHeights.tight,
        padding: `${space[3]}px ${space[5]}px`
    },
    pinchBottom: {
        pointerEvents: 'none',
        position: 'absolute',
        bottom: '18%',
        right: space.container,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: radii[2],
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.tight,
        fontWeight: 'var(--font-weight-bold)',
        padding: '.5em 1em',
        color: colors.white
    },
    zoomControls: {
        display: 'flex',
        justifyContent: 'center',
        flexShrink: 0
    },
    zoomControlsBtn: {
        lineHeight: 0,
        height: ICON_SIZE + space[4] * 2,
        padding: `0 ${space[2]}px`
    }
};

export default wrapComponent(PanZoom, 'PanZoom', true);
