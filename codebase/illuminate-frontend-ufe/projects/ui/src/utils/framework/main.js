/**
 * Main application entry piont.
 * This function does application initialization and root components rendering.
 */
import 'utils/framework/Logger';
import Events from 'utils/framework/Events';
import { InPageCompsLoaded } from 'constants/events';
import { loadPriorityOrNonPriorityPages } from 'utils/bundlerChunkLoader';

const runApplication = async () => {
    await runPreContentLoadInitialization();

    // make sure DOM is ready
    if (Sephora.DOMContentLoadedFired) {
        renderApplication();
    } else {
        window.addEventListener('DOMContentLoaded', renderApplication);
    }

    await runServicesInitialization();
};

/**
 * App initialization step #1.
 *
 * Any pre-initialization code should be placed in here.
 */
const runPreContentLoadInitialization = async () => {
    // Analytics - This needs to run before any controllers do, so that the promise exists ahead of time
    /**
     * Wait for our initial page load tag to have fired before firing any subsequent tags.
     * All subsequent async page load tags depend on the vars set in this tag.
     * Resolve: Called from Signal tag "Global :: Page-load Tracking", Additional Configuration
     */
    Sephora.analytics.promises.initialPageLoadFired = new Promise(resolve => {
        Sephora.analytics.resolvePromises.initialPageLoadFired = resolve;
    });

    const Application = (await import(/* webpackMode: "eager" */ 'utils/framework/Application')).default;
    const { Immediate, EventType } = await import(/* webpackMode: "eager" */ 'constants/events');

    // The Immediate event fires once all priority code is loaded but prior to any third party or api dependencies.
    Application.events.dispatchServiceEvent(Immediate, EventType.Ready);
    Application.events.dispatchServiceEvent(Immediate, EventType.ServiceCtrlrsApplied, true);

    // Place all async rendered components in Sephora.Comps.
    // Initialize component inflation logic, e.g. ApplyCtrlr
    // await require.ensure inPageList.js which will add <script src="compnents.chunk.js"> to the page
    await import(/* webpackMode: "eager" */ 'utils/framework/InflateComponents');

    const Performance = (await import(/* webpackMode: "eager" */ 'utils/framework/performance/Performance')).default;
    Performance.initialize();
};

/**
 * App initialization step #2.
 */
const runPostContentLoadInitialization = async () => {
    const cookieUtils = (await import(/* webpackMode: "eager" */ 'utils/Cookies')).default;
    cookieUtils.initialize();

    const Store = (await import(/* webpackMode: "eager" */ 'store/Store')).default;
    Store.initialize();
};

/**
 * Render root components
 */
const renderApplication = async () => {
    try {
        await runPostContentLoadInitialization();

        await loadAndSetPages();

        const InflateSPA = (await import(/* webpackMode: "eager" */ 'utils/framework/InflateSPA')).default;
        await InflateSPA.renderRootComponents();
        await runPostHydrationInitialization();
    } catch (error) {
        if (error) {
            Sephora.logger.error(JSON.stringify(error));
        }
    }
};

/**
 * App initialization step #3.
 *
 * To avoid store mutations before hydration process has finished it's work we need to do all store updates only
 * after first render circle because it's mandatory to render same HTML markup as it was after SSR.
 * Do all initialization store mutations from here because this function is invoked right after hydration.
 */
const runPostHydrationInitialization = async () => {
    const Store = (await import(/* webpackMode: "eager" */ 'store/Store')).default;
    Store.onHydrationFinished();

    const History = (await import(/* webpackMode: "eager" */ 'services/History')).default;
    History.initFrontEndRouter();

    const CookieActions = (await import(/* webpackMode: "eager" */ 'actions/CookieActions')).default;
    Store.dispatch(CookieActions.setAllCookies(Sephora.Util.InflatorComps.pageLoadCookies));
};

/**
 * App initialization step #4.
 *
 * It may run before initialization step #2 (`runPostContentLoadInitialization`) when `DOMContentLoaded` event has not fired yet.
 * Initialize the third-party and internal services.
 * These are listed in order of priority.
 * Generally speaking each of these hooks up to any third party JS files needed and or requests expected data from the third party service.
 */
const runServicesInitialization = async () => {
    await import(/* webpackMode: "eager" */ 'services/UserInfo');
    await import(/* webpackMode: "eager" */ 'services/P13N');
    await import(/* webpackMode: "eager" */ 'services/LithiumHeaderImage');
    await import(/* webpackMode: "eager" */ 'services/Search');
    await import(/* webpackMode: "eager" */ 'services/Catalog');
    await import(/* webpackMode: "eager" */ 'services/RefreshBasket');

    (await import(/* webpackMode: "eager" */ 'services/exchangeRates')).default();
    (await import(/* webpackMode: "eager" */ 'services/TestTarget')).initialize();
    (await import(/* webpackMode: "eager" */ 'services/productInfo')).initialize();
    (await import(/* webpackMode: "eager" */ 'services/ConstructorRecs')).initialize();
    (await import(/* webpackMode: "eager" */ 'services/ConstructorBeacon')).initializeConstructorBeacon();

    // Listen for last load event - this prevents a race condition
    Events.onLastLoadEvent(window, [InPageCompsLoaded], async () => {
        await import(/* webpackMode: "eager" */ 'services/Location');
        await import(/* webpackMode: "eager" */ 'services/OrderInfo');
        (await import(/* webpackMode: "eager" */ 'services/PostLoad')).default.initialize();
        await import(/* webpackMode: "eager" */ 'services/ThirdParty');
        await import(/* webpackMode: "eager" */ 'services/Basket');
        await import(/* webpackMode: "eager" */ 'services/UserInteraction');
    });
};

const loadAndSetPages = async () => {
    // Only load the pages that are needed for the current page
    const pageChunk = await loadPriorityOrNonPriorityPages(Sephora.pagePath);
    Sephora.combinedPages = pageChunk?.default;
};

export default runApplication;
