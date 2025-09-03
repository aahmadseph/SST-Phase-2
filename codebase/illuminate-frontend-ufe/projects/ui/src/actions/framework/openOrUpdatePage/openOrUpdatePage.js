import { isUfeEnvLocal, isUfeEnvQA } from 'utils/Env';
import {
    OPEN_SPA_PAGE,
    OPEN_SPA_PAGE_API_LOADED,
    OPEN_SPA_PAGE_DOM_UPDATED,
    OPEN_SPA_PAGE_IMAGES_PRELOADED,
    OPEN_SPA_PAGE_IMAGES_PRELOADING,
    OPEN_SPA_PAGE_START,
    PAGE,
    PAGE_RENDERED
} from 'constants/performance/marks';
import actionInfo from './actionInfo';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import preloadImages from './preloadImages';
import { SHOW_SPA_PAGE_LOAD_PROGRESS } from 'constants/actionTypes/page';
import JsUtils from 'utils/javascript';
import LazyLoad from 'utils/framework/LazyLoad';
const { LazyLoaderInstance: LazyLoadService } = LazyLoad;
import { Pages } from 'constants/Pages';
import PageTemplateType from 'constants/PageTemplateType';
import Perf from 'utils/framework/Perf';
import ProcessEvent from 'analytics/processEvent';
import PromisesUtils from 'analytics/promisesUtils';
import skuUtils from 'utils/Sku';
import SpaUtils from 'utils/Spa';
import TestTargetUtils from 'utils/TestTarget';
import UI from 'utils/UI';
import UrlUtils from 'utils/Url';
import helpersUtils from 'utils/Helpers';
import PostLoad from 'services/PostLoad';
import targeterActions from 'actions/targetersActions';
import homePageActions from 'actions/HomepageActions';

let _shouldScrollPageToTop;
let delayedSwitchPageActionsTimer;
let openPageAbortController;
const eventsToExclude = [OPEN_SPA_PAGE, PAGE];
const { deferTaskExecution } = helpersUtils;

const resetPerformanceMeasures = () => {
    Sephora.performance.clear();
    Perf.loadEvents = Perf.loadEvents.filter(({ data }) => {
        if (typeof data === 'string') {
            const eventPrefix = data.split(' ')[0];
            const result = !eventsToExclude.includes(eventPrefix);

            return result;
        } else {
            return true;
        }
    });

    performance.clearMarks(OPEN_SPA_PAGE_START);
    performance.clearMarks(OPEN_SPA_PAGE_DOM_UPDATED);
    performance.clearMarks(OPEN_SPA_PAGE_IMAGES_PRELOADED);
    performance.clearMarks(OPEN_SPA_PAGE_IMAGES_PRELOADING);
    performance.clearMeasures(OPEN_SPA_PAGE);
    performance.clearMeasures(PAGE_RENDERED);
    Perf.report(OPEN_SPA_PAGE_START);
};

const spaPageLoadAnalytics = () => {
    const shouldTriggerPageLoadEvent = anaUtils.shouldTriggerPageLoadEventForCurrentPage();

    if (shouldTriggerPageLoadEvent) {
        ProcessEvent.process(anaConsts.PAGE_LOAD, { pageType: Sephora.analytics.backendData.pageType });
    }
};

const openOrUpdatePage =
    (newLocation, previousLocation, shouldScrollPageToTop = false) =>
        dispatch => {
            _shouldScrollPageToTop = shouldScrollPageToTop;
            const newQueryString = UrlUtils.buildQuery(JsUtils.buildMap(newLocation.queryParams));
            const newPageUrl = newLocation.path + newQueryString;
            const previousQueryString = UrlUtils.buildQuery(JsUtils.buildMap(previousLocation.queryParams));
            const previousPageUrl = previousLocation.path + previousQueryString;

            if (newPageUrl === previousPageUrl) {
                return;
            }

            // eslint-disable-next-line no-console
            console.log('|****** SPA Load Started ******|');
            resetPerformanceMeasures();

            if (openPageAbortController) {
                openPageAbortController.abort();
            }

            ProcessEvent.forceFireAllAnalytics();
            SpaUtils.resetDigitalData();
            PromisesUtils.resetPromises(Sephora.analytics);

            // Remove old page render deduping images on spa load
            if (Sephora.Util.Perf.resetImageDedup) {
                Sephora.Util.Perf.resetImageDedup();
            }

            const pageContext = {
                events: {
                    onDataLoaded: (newData, imagesToPreload) => {
                        dispatch(onDataLoaded(newData, imagesToPreload));
                    },
                    onError: (error, newPageTemplate, doHardReload) => {
                        dispatch(onError(error, newPageTemplate || pageContext.newPageTemplate, doHardReload));
                    },
                    onPageUpdated: (data, callback) => {
                        dispatch(onPageUpdated(data, pageContext.newLocation, callback));
                    }
                },
                newLocation,
                previousLocation,
                requestConfig: { abortable: true },
                newPageTemplate: SpaUtils.getSpaTemplateInfoByUrl(newLocation.path)?.template
            };
            const [newPage, openOrUpdatePageAction] = actionInfo.createPageActionTuple(pageContext);

            if (pageContext.requestConfig.abortController) {
                openPageAbortController = pageContext.requestConfig.abortController;
            }

            if (newPage) {
                dispatch({
                    type: SHOW_SPA_PAGE_LOAD_PROGRESS,
                    payload: true
                });
            }

            if (pageContext.newPageTemplate) {
            // Maintain pageTemplate logic for Location.js logic
                Sephora.pagePath = pageContext.newPageTemplate;
                Sephora.template = pageContext.newPageTemplate;
                Sephora.renderedData.template = pageContext.newPageTemplate;
                Sephora.analytics.backendData.pageType = pageContext.newPageTemplate;
                SpaUtils.setChannelForSpaLoad(pageContext.newPageTemplate);
            }

            if (openOrUpdatePageAction) {
                SpaUtils.tryToForceSignIn();
                dispatch(openOrUpdatePageAction);
            }
        };

const onDataLoaded = (newData, imagesToPreload) => (_dispatch, getState) => {
    Perf.report(OPEN_SPA_PAGE_API_LOADED);
    preloadImages(imagesToPreload);
    document.activeElement.blur();

    if (_shouldScrollPageToTop) {
        UI.scrollToTop();
    }

    LazyLoadService.beginReset();

    // Flag page render tracking to trigger again. Must happen before any page updates
    Sephora.Util.Perf.firstSpaLoadRender = true;

    const { page } = getState();
    const { pageName } = SpaUtils.getSpaTemplateInfoByTemplate(page.templateInformation.template) || {};
    const currentData = page[pageName];
    SpaUtils.replaceContentAreaTargeters(currentData, newData);
    Sephora.mboxAttrs = TestTargetUtils.extractMboxParams(newData);
    Sephora.Util.firstSpaDataLoaded = true;
};

const onError =
    (error, newPageTemplate, doHardReload = false) =>
        dispatch => {
            openPageAbortController = null;
            LazyLoadService.endReset();
            dispatch({
                type: SHOW_SPA_PAGE_LOAD_PROGRESS,
                payload: false
            });

            if (error) {
                if (doHardReload) {
                    const path = SpaUtils.normalizePath(newPageTemplate.path);
                    UrlUtils.redirectTo(path);
                } else {
                    if (error.responseStatus === 404) {
                        const pageUrl = newPageTemplate === PageTemplateType.ProductPage ? Pages.ProductNotCarried : Pages.Error404;
                        UrlUtils.redirectTo(pageUrl);
                    } else if (error.errorCode === -2) {
                        UrlUtils.redirectTo(Pages.BrandsList);
                    } else if (error.errorCode === -3 || (error.errorCode !== -2 && newPageTemplate === PageTemplateType.BrandNthCategory)) {
                        UrlUtils.redirectTo(Pages.Error404);
                    }
                }

                // eslint-disable-next-line no-console
                console.error(error);
            }
        };

const onPageUpdated = (data, newLocation, callback) => (dispatch, getState) => {
    if (delayedSwitchPageActionsTimer) {
        clearTimeout(delayedSwitchPageActionsTimer);
    }

    const delayedSwitchPageActions = () => {
        openPageAbortController = null;

        if (callback) {
            callback();
        }

        const productPageData = skuUtils.getProductPageData(newLocation);
        const reduxState = getState();
        const { testTarget, user } = reduxState;

        SpaUtils.updateUserFull(data, productPageData, { hideLoader: true });

        if (newLocation.path !== '/basket') {
            SpaUtils.updateBasket();
        }

        SpaUtils.updateHeaderTags(data);
        SpaUtils.updatePreferredStoreDetails(user);

        SpaUtils.resetTestAndTarget(testTarget);
        PostLoad.showCreditCardPrescreenModal(true);

        dispatch(targeterActions.requestAndSetTargeters());
        dispatch(homePageActions.getPersonalizedEnabledComponents());

        //TODO: Wait for page rendered to fire before triggering signal
        // This is super hackey and should probably be addressed in signal by reporting
        // the URL ourselves rather than relying on the signal/adobe integration
        // digitalData.page.attributes.sephoraPageInfo.pageName = bindingMethods.getSephoraPageName();
        if (window.pageInfo) {
            digitalData.page.pageInfo.referringURL = window.pageInfo.pageURL;
        }

        Sephora.analytics.initialLoadDependencies = [];
        spaPageLoadAnalytics();
        LazyLoadService.endReset();

        dispatch({
            type: SHOW_SPA_PAGE_LOAD_PROGRESS,
            payload: false
        });
    };
    // By executing delayedSwitchPageActions func via setTimeout we say JS engine to create new task for it
    // Because of this MainComponent will be rendered earlier
    // Turn off page render tracking before user interaction retriggers it
    Sephora.Util.Perf.firstSpaLoadRender = false;

    // TODO: This is only needed during the SPA development phase and can be removed after
    if ((isUfeEnvQA || isUfeEnvLocal) && !Sephora.isNodeRender) {
        // Sephora.Util.Perf.logRenderPerf();
        setTimeout(Sephora.Util.Perf.logRenderPerf, 1000);
    }

    Perf.report(OPEN_SPA_PAGE_DOM_UPDATED);
    delayedSwitchPageActionsTimer = deferTaskExecution(() => delayedSwitchPageActions());
};

export default {
    onDataLoaded,
    onError,
    onPageUpdated,
    openOrUpdatePage
};
