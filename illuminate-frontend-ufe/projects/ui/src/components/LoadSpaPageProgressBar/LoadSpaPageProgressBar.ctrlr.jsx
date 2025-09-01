import { createRef } from 'react';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import React from 'react';
import UI from 'utils/UI';
import { wrapComponent } from 'utils/framework';

class LoadSpaPageProgressBar extends BaseClass {
    constructor(props) {
        super(props);

        this.progressRef = createRef();
        this.animationFrameHandle = null;
    }

    componentDidMount() {
        const domElement = this.progressRef.current;

        if (domElement) {
            this.startProgressBarAnimation(domElement);
        }
    }

    componentDidUpdate() {
        const domElement = this.progressRef.current;

        if (!domElement) {
            if (this.animationFrameHandle) {
                UI.cancelFrame(this.animationFrameHandle);
            }

            return;
        }

        this.startProgressBarAnimation(domElement);
    }

    componentWillUnmount() {
        if (this.animationFrameHandle) {
            UI.cancelFrame(this.animationFrameHandle);
        }
    }

    render() {
        const { showProgress } = this.props;

        if (!showProgress) {
            if (this.animationFrameHandle) {
                UI.cancelFrame(this.animationFrameHandle);
            }

            return null;
        }

        return (
            <div css={styles.root}>
                <div
                    ref={this.progressRef}
                    css={styles.bar}
                />
            </div>
        );
    }

    startProgressBarAnimation = domElement => {
        let progressPosition = 0;
        let lastProgressPosition = progressPosition;
        const defaultFramesToSkip = 4;
        let skipFramesCounter = defaultFramesToSkip;

        const tryIncreaseProgressPosition = framesToSkip => {
            if (--skipFramesCounter < 0) {
                progressPosition++;
                skipFramesCounter = framesToSkip;
            }
        };

        const animateProgress = () => {
            if (progressPosition >= 85) {
                tryIncreaseProgressPosition(defaultFramesToSkip * 8);
            } else if (progressPosition >= 75) {
                tryIncreaseProgressPosition(defaultFramesToSkip * 4);
            } else if (progressPosition >= 50) {
                tryIncreaseProgressPosition(defaultFramesToSkip * 2);
            } else if (progressPosition >= 25) {
                tryIncreaseProgressPosition(defaultFramesToSkip);
            } else {
                progressPosition++;
            }

            if (lastProgressPosition !== progressPosition) {
                domElement.style.width = `${progressPosition}%`;
                lastProgressPosition = progressPosition;
            }

            // This progress bar component should never reach it end.
            // It was done intentionally to avoid users be confused when
            // progress has reached it end but page has not loaded yet.
            if (progressPosition <= 95) {
                this.animationFrameHandle = UI.requestFrame(animateProgress);
            }
        };

        this.animationFrameHandle = UI.requestFrame(animateProgress);
    };
}

const styles = {
    root: {
        background: 'rgba(255, 255, 255, 0.6)',
        height: 4,
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        zIndex: 'var(--layer-max)'
    },
    bar: {
        background: 'var(--color-black)',
        height: 3,
        transition: 'width .2s ease-in-out',
        width: 0
    }
};

LoadSpaPageProgressBar.defaultProps = { showProgress: false };
LoadSpaPageProgressBar.propTypes = { showProgress: PropTypes.bool };

export default wrapComponent(LoadSpaPageProgressBar, 'LoadSpaPageProgressBar', true);
