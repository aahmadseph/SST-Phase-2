import getPageTypeFromPath from 'components/CreatorStoreFront/helpers/getPageTypeFromPath';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';
import CreatorStoreFrontActions from 'actions/CreatorStoreFrontActions';
import UI from 'utils/UI';
import { initializeInstagramEmbeds, isPostsPath } from 'components/CreatorStoreFront/helpers/socialMediaEmbed';
import ProcessEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import helpersUtils from 'utils/Helpers';
import { setDigitalDataPageInfo } from 'components/CreatorStoreFront/helpers/csfAnalytics';

const { deferTaskExecution } = helpersUtils;

/**
 * Navigate to a new path within the Creator Store Front using Redux dispatch
 * @param {string} path - The path to navigate to
 * @param {function} dispatch - Redux dispatch function
 * @param {boolean} dispatchPopState - Whether to dispatch a popstate event
 * @param {boolean} shouldScrollPageToTop - Whether to scroll to top after navigation (defaults to true)
 */
export const navigateTo = async (path, dispatch, dispatchPopState = false, shouldScrollPageToTop = true) => {
    // SSR guard
    if (typeof window === 'undefined') {
        return;
    }

    // Signal CSF navigation is starting - allows components to cleanup
    // https://jira.sephora.com/browse/CSF-446
    window.dispatchEvent(new CustomEvent('csfNavigationStarted'));

    window.history.pushState({}, '', path);

    // Only dispatch popstate event if explicitly requested
    if (dispatchPopState) {
        window.dispatchEvent(new PopStateEvent('popstate'));
    }

    // Failsafe: Initialize Instagram embeds when navigating to posts
    if (isPostsPath(path)) {
        Sephora.logger.verbose('Navigation to posts detected, ensuring Instagram embeds are initialized');
        initializeInstagramEmbeds();
    }

    // Get the page type from the path
    const pageType = getPageTypeFromPath(path) || CSF_PAGE_TYPES.FEATURED;

    try {
        // Check if it's a Redux dispatch function (standard case)
        if (typeof dispatch === 'function' && dispatch.toString().includes('dispatch')) {
            await dispatch(CreatorStoreFrontActions.initializeCSFPageData(pageType, path));
        } else if (typeof dispatch === 'function') {
            // Invoke the callback with navigation info
            await dispatch({ pageType, path });
        } else {
            // Legacy fallback - no function provided
            Sephora.logger.warn('Warning: navigateTo called without a valid function. Using basic navigation.');
            // Basic navigation already happened with pushState above
        }

        // Track CSF page view analytics
        deferTaskExecution(() => {
            setDigitalDataPageInfo(pageType);
        });

        // Track page view event for CSF navigation
        deferTaskExecution(() => {
            // Set the pageType for analytics tracking
            if (Sephora.analytics && Sephora.analytics.backendData) {
                Sephora.analytics.backendData.pageType = pageType;
            }

            // Process page load analytics event
            ProcessEvent.process(anaConsts.PAGE_LOAD, {
                data: {
                    pageType
                }
            });
        });

        // Always trigger the navigation complete event after data is loaded
        // This will cause the controller to update the component being rendered
        window.dispatchEvent(new CustomEvent('csfNavigationComplete', { detail: { path } }));
    } catch (error) {
        Sephora.logger.error('Error during navigation:', error);
    } finally {
        // Always scroll to top unless explicitly disabled
        if (shouldScrollPageToTop !== false) {
            UI.scrollTo({ elementId: 'csf_page_wrapper' });
        }
    }
};

/**
 * Hook for navigating within Creator Store Front using Redux.
 *
 * This should be used in React components instead of calling navigateTo directly
 * because:
 * - It automatically gives navigateTo access to Redux dispatch
 * - It keeps your component code cleaner
 * - It ensures navigation works consistently across the app
 */
export const useNavigateTo = dispatch => {
    return {
        navigateTo: (path, dispatchPopState = false, shouldScrollPageToTop = true) =>
            navigateTo(path, dispatch, dispatchPopState, shouldScrollPageToTop)
    };
};
