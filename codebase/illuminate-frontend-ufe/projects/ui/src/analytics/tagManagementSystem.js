import { adobeLaunchEnvironments } from 'config/tagManagerConfig.js';
import cookieUtils from 'utils/Cookies';

const appMeasurementReady = () => {
    // This promise is fulfilled when Adobe Analytics script loads.
    Sephora.analytics.promises.appMeasurementReady.then(appManagement => {
        appManagement.registerPostTrackCallback(trackingURL => {
            // called after each sucessfull tracking call
            Sephora.analytics.processEvent.eventFinished(trackingURL);
        });
    });
};

const initialPageLoadFired = () => {
    Sephora.analytics.promises.initialPageLoadFired.then(() => {
        // When CCPA is present the event processing library is blocked on the page load event.
        // This helps unblocking the processing flow.
        Sephora.analytics.processEvent.eventFinished();
    });
};

const loadAdobeLaunch = () => {
    // Checks the killswitch
    if (Sephora.configurationSettings.adobeLaunchContainerLoading) {
        const { adobeLaunchConfig } = Sephora.configurationSettings;

        initialPageLoadFired();
        appMeasurementReady();

        // By Default, it loads the QA Testing Environment.
        let adobeLaunchEnvironmentURL = adobeLaunchEnvironments.QATesting;

        // On Production, BCC will not be applicable. Prod takes priority.
        if (Sephora.UFE_ENV && Sephora.UFE_ENV === 'PROD') {
            if (Sephora.isCanaryRelease) {
                adobeLaunchEnvironmentURL = adobeLaunchEnvironments.Staging;
            } else {
                adobeLaunchEnvironmentURL = adobeLaunchEnvironments.Production;
            }
        } else {
            // Checks if there is a BCC configuration available.
            // The BCC Configuration should come as string with a value that exists
            // on public_ufe/js/config/tagManagerConfig.js adobeLaunchEnvironments object.
            if (adobeLaunchConfig) {
                const bccAdobeLaunchConfig = adobeLaunchEnvironments[adobeLaunchConfig];

                // Verifies the BCC Config matches with a stored configuration URL.
                if (bccAdobeLaunchConfig) {
                    adobeLaunchEnvironmentURL = bccAdobeLaunchConfig;
                }
            }
        }

        const tagjs = document.createElement('script');
        const s = document.getElementsByTagName('script')[0];
        const tmsUrl = adobeLaunchEnvironmentURL;
        tagjs.async = false;
        tagjs.src = tmsUrl;

        s.parentNode.insertBefore(tagjs, s);
    }
};

const loadTMS = () => {
    // Checks the TMS Adobe Launch killswitch
    if (Sephora.configurationSettings.adobeLaunchContainerLoading) {
        // Load Adobe Launch TMS
        loadAdobeLaunch();
    }

    // When TMS is ready, evaluates the CCPA/GPC and loads Adobe Launch.
    // Adobe Launch should make sure to fufill this promise.
    Sephora.analytics.promises.tagManagementSystemReady.then(() => {
        if (cookieUtils.isCCPAEnabled()) {
            initialPageLoadFired();

            // When CCPA is enabled, the TMS is not fulfilling this promise affecting other events.
            // The promise was fulfilled on adobeAnalytics_pageLoadTracking tag on Adobe Launch.
            Sephora.analytics.resolvePromises.initialPageLoadFired();
        }
    });
};

export default { loadAdobeLaunch, loadTMS };
