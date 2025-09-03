import React from 'react';
import PropTypes from 'prop-types';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import CookieUtils from 'utils/Cookies';
import userUtils from 'utils/User';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import bindingMethods from 'analytics/bindingMethods/pages/all/generalBindings';
import WelcomeMatModal from 'components/GlobalModals/WelcomeMatModal';

const THIRTY_MINUTES_IN_MILLISECONDS = 1800000;

function hasSephoraInUrl(url) {
    const sephoraStr = 'sephora';

    return url.indexOf(sephoraStr) !== -1;
}

const getTimeoutDelay = (lastTimeSeen = 0) => {
    const diff = Date.now() - lastTimeSeen;

    if (diff > THIRTY_MINUTES_IN_MILLISECONDS) {
        return 0;
    }

    return THIRTY_MINUTES_IN_MILLISECONDS - diff;
};

// (INFL-1321) - Do Not Remove this component as it is required for legal purposes.
class WelcomePopup extends BaseClass {
    static propTypes = {
        getLastTimeSeen: PropTypes.func.isRequired,
        updateWelcomeMatLastTimeSeen: PropTypes.func.isRequired,
        removeLastTimeSeen: PropTypes.func.isRequired
    };

    state = {
        showWelcomePopup: false
    };

    componentDidMount() {
        this.initializeWelcomeMat();
    }

    clearModalTimeout = () => {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    };

    initializeWelcomeMat = () => {
        const newCountryCode = CookieUtils.read('current_country');
        const isCountryCAorUS = ['US', 'CA'].includes(newCountryCode);

        // if no country coke from Akamai or if it is CA or US.
        if (!newCountryCode || isCountryCAorUS) {
            return;
        }

        // If country code is anything other than if above.
        if (newCountryCode) {
            this.clearModalTimeout();

            this.timeoutId = setTimeout(() => {
                this.handleStateChange();
            }, getTimeoutDelay(this.props.getLastTimeSeen()));
        }
    };

    showWelcomePopup = () => {
        this.setState({ showWelcomePopup: true }, () => {
            if (this.state.showWelcomePopup) {
                this.setCookies();
                this.trackWelcomePopup();
            }
        });
    };

    handleStateChange = () => {
        // If referrer doesnt have sephora then show welcome mat
        if (!hasSephoraInUrl(document.referrer)) {
            this.showWelcomePopup();
        } else {
            this.clearModalTimeout();

            setTimeout(() => this.showWelcomePopup(), getTimeoutDelay(this.props.getLastTimeSeen()));
        }
    };

    trackWelcomePopup = () => {
        Sephora.analytics.promises.initialPageLoadFired.then(function () {
            const currentCountry = CookieUtils.read('current_country');
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [anaConsts.Event.EVENT_71],
                    linkName: 'welcomemat:impression:' + currentCountry,
                    actionInfo: 'welcomemat:impression:' + currentCountry,
                    internalCampaign: bindingMethods.getInternalCampaign(),
                    previousPage: digitalData.page.attributes.sephoraPageInfo.pageName
                }
            });
        });
    };

    fireWelcomePopupEveryNMinutes = () => {
        const newCountryCode = CookieUtils.read('current_country');
        const isCountryCAorUS = ['US', 'CA'].includes(newCountryCode);

        if (isCountryCAorUS) {
            // clearing firing modal every 30 mins timeout
            //removing welcomematlastseen session storage item.
            this.clearModalTimeout();
            this.props.removeLastTimeSeen();

            return;
        }

        this.setState({ showWelcomePopup: true });
        this.trackWelcomePopup();
    };

    setCookies = () => {
        const EXPIRES = {
            IN_ONE_DAY: 1
        };

        CookieUtils.write('trackIntlPopup', true, EXPIRES.IN_ONE_DAY, true);
    };

    requestClose = () => {
        this.setState({ showWelcomePopup: false }, function () {
            // Analytics
            const currentCountry = CookieUtils.read('current_country');
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings: [anaConsts.Event.EVENT_71],
                    linkName: 'welcomemat:close:icon:' + currentCountry,
                    actionInfo: 'welcomemat:close:icon:' + currentCountry,
                    internalCampaign: bindingMethods.getInternalCampaign(),
                    previousPage: digitalData.page.attributes.sephoraPageInfo.pageName
                }
            });

            userUtils.forceSignIn();
        });

        this.setTimeoutOnClose();
    };

    setTimeoutOnClose = () => {
        this.clearModalTimeout();

        this.timeoutId = setTimeout(this.fireWelcomePopupEveryNMinutes, THIRTY_MINUTES_IN_MILLISECONDS);
        this.props.updateWelcomeMatLastTimeSeen(Date.now());
    };

    render() {
        return (
            <WelcomeMatModal
                isOpen={this.state.showWelcomePopup}
                onDismiss={this.requestClose}
            />
        );
    }
}

export default wrapComponent(WelcomePopup, 'WelcomePopup', true);
