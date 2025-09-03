/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import UI from 'utils/UI';
import ReCaptchaUtil from 'utils/ReCaptcha';
import ReCAPTCHA from 'react-google-recaptcha';

const CHALLENGER_IFRAME_SRC = 'google.com/recaptcha/api2/bframe';
let needToLockBack = false;

class ReCaptcha extends BaseClass {
    constructor(props) {
        super(props);
        this.challengerObserver = null;
    }

    execute = () => {
        if (Sephora.isMobile() && UI.isBackgroundLocked()) {
            UI.unlockBackgroundPosition();
            needToLockBack = true;
        }

        this.initChallengerObserver();
        ReCaptchaUtil.execute(this.props.onChange);
    };

    reset = () => {
        if (this.challengerObserver) {
            this.challengerObserver.disconnect();
        }

        ReCaptchaUtil.reset();
    };

    onChange = () => {
        if (needToLockBack) {
            UI.lockBackgroundPosition(true);
            needToLockBack = false;
        }

        this.props.onChange && this.props.onChange();
    };

    /**
     * Google Recaptcha doesn't have an API to observe the challenger behavior.
     * Known issue, the common workaround described here:
     * https://stackoverflow.com/questions/43488605/
     *  detect-when-challenge-window-is-closed-for-google-recaptcha
     */
    initChallengerObserver = () => {
        if (this.challengerObserver) {
            return;
        }

        const pageIframes = document.getElementsByTagName('iframe');
        const challengerIframe = Array.prototype.filter.call(pageIframes, iframe => iframe.src.indexOf(CHALLENGER_IFRAME_SRC) > -1)[0];

        if (challengerIframe) {
            const challengerWindow = challengerIframe.parentNode.parentNode;

            if (challengerWindow.style.opacity === '1') {
                this.props.hideModal && this.props.hideModal(true);
            }

            this.challengerObserver = this.createObserver(() => {
                if (challengerWindow.style.opacity === '1') {
                    this.props.onChallengerShow && this.props.onChallengerShow();
                } else {
                    this.props.onChallengerDismiss && this.props.onChallengerDismiss();
                }
            });

            this.challengerObserver.observe(challengerWindow, {
                attributes: true,
                attributeFilter: ['style']
            });
        }
    };

    createObserver = (...args) => {
        const CrossBrowserObserver = window.MutationObserver || window.WebKitMutationObserver;

        return new CrossBrowserObserver(...args);
    };

    componentWillUnmount() {
        if (this.challengerObserver) {
            this.challengerObserver.disconnect();
            this.challengerObserver = null;
        }
    }

    render() {
        if (ReCaptchaUtil.isPaused()) {
            return null;
        }

        return (
            <div style={{ display: 'none' }}>
                <ReCAPTCHA
                    ref={captchaLib => {
                        if (captchaLib !== null && !ReCaptchaUtil.getReCaptchaLibrary()) {
                            ReCaptchaUtil.setReCaptchaLibrary(captchaLib);
                        }
                    }}
                    sitekey={ReCaptchaUtil.getSiteKey()}
                    size='invisible'
                    badge='inline'
                    onChange={ReCaptchaUtil.tokenCallback}
                />
            </div>
        );
    }
}

export default wrapComponent(ReCaptcha, 'ReCaptcha');
