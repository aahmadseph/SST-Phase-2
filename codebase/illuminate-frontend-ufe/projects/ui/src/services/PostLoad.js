/* eslint-disable no-console */
import { InPageCompsServiceCtrlrsApplied } from 'constants/events';
import { site } from 'style/config';
import store from 'store/Store';
import Events from 'utils/framework/Events';
import servicesUtils from 'utils/Services';
import Location from 'utils/Location';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import anaUtils from 'analytics/utils';
import localStorageConstants from 'utils/localStorage/Constants';
import Actions from 'actions/Actions';
import urlUtils from 'utils/Url';
import InflateSPA from 'utils/framework/InflateSPA';
import { isUfeEnvLocal, isUfeEnvQA } from 'utils/Env';
import { globalModals, renderModal } from 'utils/globalModals';
import profileApi from 'services/api/profile';
import RCPSCookies from 'utils/RCPSCookies';
import { globalModalsSelector } from 'selectors/page/headerFooterTemplate/data/globalModals/globalModalsSelector';
import { isPriorityPage } from 'utils/bundlerChunkLoader';
import { SEPHORA_CARD_TYPES } from 'constants/CreditCard';
const { CREDIT_CARD_PRESCREEN_CBCC, CREDIT_CARD_PRESCREEN_PLCC } = globalModals;
const { CREDIT_CARD_REALTIME_PRESCREEN } = localStorageConstants;
const { renderPostLoadRootComponents } = InflateSPA;
const shouldServiceRun = servicesUtils.shouldServiceRun;
const TIMEOUT = servicesUtils.POST_LOAD_TIMEOUT;
const LocalOrQAEnvironment = isUfeEnvQA || isUfeEnvLocal;

const getGlobalModals = () => globalModalsSelector(store.getState());

const postLoadModule = {};

// TODO: move to another file so it can be lazy-loaded and bundled inside "postload"
postLoadModule.scrollAnchorLinkIntoView = function scrollAnchorLinkIntoView() {
    const hash = Location.getLocation().hash;
    const element = typeof hash === 'string' && document.getElementById(hash.replace('#', ''));

    if (element) {
        element.scrollIntoView();

        if (Sephora.isMobile()) {
            window.scroll(0, window.scrollY - site.headerHeight);
        }
    }
};

postLoadModule.showCreditCardPrescreenModal = function showCreditCardPrescreenModal(isSpaLoad) {
    const { isRealtimePrescreenEnabled } = Sephora.fantasticPlasticConfigurations;
    const hideRTPSPopup = Location.isCreditCardMarketingPage() && urlUtils.getParamsByName('hideRTPS');
    const hideRTPSByLocation = Location.isCheckout() || Location.isBasketPage();

    // For US clients, skipping Checkout pages, also skip cc marketing if hideRTPS param
    if (isRealtimePrescreenEnabled && localeUtils.isUS() && !hideRTPSByLocation && !hideRTPSPopup) {
        const storage = Storage.local.getItem(CREDIT_CARD_REALTIME_PRESCREEN);

        // If there was a realtime prescreen call and still no user response
        // and there is a BCC region with content in the response
        if (storage && !storage.userResponse && !storage.inProgress) {
            if (RCPSCookies.isRCPSCCAP() && !storage.response?.cardType) {
                return;
            } else if (
                !RCPSCookies.isRCPSCCAP() &&
                (!storage.response.content || !storage.response.content.regions || !storage.response.content.regions.content)
            ) {
                return;
            } else if (Sephora.isAgent) {
                return;
            } else if (isSpaLoad && RCPSCookies.isRCPSCCAP()) {
                this.renderPrescreenModal(storage);

                return;
            }

            Events.onLastLoadEvent(window, [Events.UserInfoReady], () => {
                store.setAndWatch('user', null, () => {
                    this.renderPrescreenModal(storage);
                });
            });
        }
    }
};

postLoadModule.renderPrescreenModal = storage => {
    // If the user is signed in
    if (userUtils.isSignedIn()) {
        if (RCPSCookies.isRCPSCCAP()) {
            const cardType = storage.response?.cardType;

            if (cardType) {
                let modalToRender;

                if (cardType === SEPHORA_CARD_TYPES.PRIVATE_LABEL) {
                    modalToRender = CREDIT_CARD_PRESCREEN_PLCC;
                }

                if (cardType === SEPHORA_CARD_TYPES.CO_BRANDED) {
                    modalToRender = CREDIT_CARD_PRESCREEN_CBCC;
                }

                renderModal(
                    getGlobalModals()[modalToRender],
                    () => {
                        store.dispatch(Actions.showCreditCardPrescreenModal(true, storage?.response));
                    },
                    true
                );
            }
        } else {
            const { profileId } = userUtils.getProfileId();

            return profileApi
                .getPreScreenDetails(profileId)
                .then(data => {
                    let modalToRender;

                    if (data.cardType && data.cardType === SEPHORA_CARD_TYPES.PRIVATE_LABEL) {
                        modalToRender = CREDIT_CARD_PRESCREEN_PLCC;
                    }

                    if (data.cardType && data.cardType === SEPHORA_CARD_TYPES.CO_BRANDED) {
                        modalToRender = CREDIT_CARD_PRESCREEN_CBCC;
                    }

                    if (modalToRender) {
                        store.dispatch(Actions.showCreditCardPrescreenModal(true, storage?.response));
                    }
                })
                .catch(() => {});
        }
    }

    return true;
};

postLoadModule.loadScript = function loadScript() {
    import(/* webpackMode: "eager" */ 'thirdparty/frt');
};

postLoadModule.loadFrt = function loadFrt() {
    // Add Frt JS File to the Page
    if (Location.isBasketPage() || Location.isCheckout() || Location.isHomepage() || Location.isAccountPage() || Location.isOrderConfirmationPage()) {
        postLoadModule.loadScript();
    }
};

postLoadModule.initialize = function initialize() {
    let postLoadFired = false;
    const priorityPage = isPriorityPage();

    /* Initialize analytics
     ** Important: We need to do this before the load event to avoid errors in other files that
     ** trigger analytics events and depend on objects that are expected to be defined.*/
    require('analytics/loadAnalytics');

    // Set page type for soasta and analytics tracking
    const sharedBindingMethods = require('analytics/bindingMethods/pages/all/bindingsSharedWithSoasta').default;
    digitalData.page.attributes.path = Sephora.analytics.backendData.pageType.toLowerCase().split('/');

    if (!digitalData.page.category.pageType) {
        digitalData.page.category.pageType = sharedBindingMethods.getPageType(digitalData.page.attributes.path);
    }

    /* Last Load Operations */
    const lastLoadOps = function lastLoadOps() {
        //Put deferred scripts here
        const analyticsConsts = require('analytics/constants').default;
        const processEvent = require('analytics/processEvent').default;

        // Load Tag Management System
        require('analytics/tagManagementSystem').default.loadTMS();

        const shouldTriggerPageLoadEvent = anaUtils.shouldTriggerPageLoadEventForCurrentPage();

        if (shouldTriggerPageLoadEvent) {
            processEvent.process(analyticsConsts.PAGE_LOAD, { pageType: Sephora.analytics.backendData.pageType });
        }

        // -- New event to handle TMS Post Load --
    };

    Events.onLastLoadEvent(window, [Events.load], lastLoadOps);

    const loadDependencies = (function () {
        const dependencies = [];
        dependencies.push(Events.UserInfoCtrlrsApplied);

        if (shouldServiceRun.testTarget()) {
            dependencies.push(Events.TestTargetCtrlrsApplied);
        }

        dependencies.push(InPageCompsServiceCtrlrsApplied);
        dependencies.push(Events.load);

        return dependencies;
    }());

    const preloadScriptChunk = href => {
        const linkTag = document.createElement('link');
        linkTag.rel = 'preload';
        linkTag.as = 'script';
        linkTag.href = href;
        document.head.appendChild(linkTag);
    };

    /* Post Load Service */
    const firePostLoad = function firePostLoad() {
        /**
         * This require.ensure needs to be inside the ensure for components.chunk
         * so that its components aren't duplicated in both chunks.
         */
        if (!postLoadFired) {
            require.ensure(
                [],
                function () {
                    postLoadFired = true;
                    renderPostLoadRootComponents();

                    if (!Sephora.isNodeRender && LocalOrQAEnvironment) {
                        setTimeout(() => {
                            Sephora.Util.Perf.getMeasurements();
                            Sephora.Util.Perf.logRenderPerf();
                        }, 1000);
                    }

                    // After PostLoad events and services
                    postLoadModule.scrollAnchorLinkIntoView();

                    // Preload script chunks for components or priority pages
                    preloadScriptChunk(priorityPage ? Sephora.componentsChunkPath : Sephora.priorityChunkPath);
                },
                'postload'
            );
        }
    };

    /* Set a timeout in case dependencies don't fire */
    setTimeout(function () {
        // Execute Last Load Events when running UFE in Local Frontend Development
        Sephora.UFE_ENV && Sephora.UFE_ENV === 'LOCAL' && Sephora.buildMode && Sephora.buildMode === 'frontend' && lastLoadOps();
        firePostLoad();
    }, TIMEOUT);

    Events.onLastLoadEvent(window, loadDependencies, firePostLoad);

    // Before PostLoad events and services
    postLoadModule.showCreditCardPrescreenModal();
    postLoadModule.loadFrt();
};

export default postLoadModule;
