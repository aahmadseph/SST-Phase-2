import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { DebouncedResize } from 'constants/events';

import { lineHeights, radii, space } from 'style/config';
import { css, Global } from '@emotion/react';

const { wrapComponent } = FrameworkUtils;

const X_SIZE = 13;
const X_PAD = 10;

let brazeShown;

function getMastheadOffset() {
    return document.getElementById('MastheadBottom')?.offsetTop;
}

class BrazeBanner extends BaseClass {
    state = {
        mastheadBottom: getMastheadOffset()
    };

    handleResize = () => {
        const brazeMsg = document.querySelector('.ab-in-app-message.ab-slideup');

        if (brazeMsg) {
            brazeShown = true;
            const mastheadOffset = getMastheadOffset();

            if (this.state.mastheadBottom !== mastheadOffset) {
                this.setState({ mastheadBottom: mastheadOffset });
            }
        } else if (brazeShown) {
            window.removeEventListener(DebouncedResize, this.handleResize);
        }
    };

    componentDidMount() {
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    render() {
        const { mastheadBottom } = this.state;

        const globalStyles = css`
            .ab-iam-root.v3 {
                position: absolute !important;
                z-index: calc(var(--layer-header) - 1) !important;
            }
            .ab-in-app-message.ab-slideup {
                font-weight: 400 !important;
                font-family: var(--font-family-base) !important;
                border-radius: ${radii[2]}px !important;
                box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2) !important;
                background-color: rgba(0, 0, 0, 0.8) !important;
                color: #fff !important;
                margin-top: 0 !important;
                top: ${mastheadBottom + space[2]}px !important;
                position: absolute !important;
            }
            .ab-in-app-message.ab-slideup .ab-close-button {
                display: block !important;
                pointer-events: auto !important;
                top: 0 !important;
                width: ${X_SIZE}px !important;
                height: ${X_SIZE}px !important;
                padding: ${X_PAD}px !important;
                transform: none !important;
            }
            .ab-in-app-message.ab-slideup .ab-close-button svg.ab-chevron {
                display: none !important;
            }
            .ab-in-app-message.ab-slideup .ab-close-button svg:not(.ab-chevron) {
                display: block !important;
                width: ${X_SIZE}px;
                height: ${X_SIZE}px;
            }
            .ab-in-app-message.ab-slideup .ab-close-button path {
                fill: #fff;
            }
            .ab-in-app-message.ab-slideup .ab-message-text {
                border-right-width: ${X_SIZE + X_PAD}px !important;
                line-height: ${lineHeights.tight} !important;
            }
        `;

        return (
            <Global styles={globalStyles} />
        );
    }
}

export default wrapComponent(BrazeBanner, 'BrazeBanner', true);
