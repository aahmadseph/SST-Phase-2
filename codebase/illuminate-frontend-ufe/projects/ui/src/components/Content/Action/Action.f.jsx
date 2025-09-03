import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import urlUtils from 'utils/Url';
import Location from 'utils/Location';
import UI from 'utils/UI';
import store from 'store/Store';
import actions from 'actions/Actions';
import communityUtils from 'utils/Community';
import analyticsUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import constants from 'constants/content';
import servicesBindings from 'analytics/bindingMethods/pages/happeningAtSephora/servicesBindings';
import SampleProductsUtils from 'utils/sampleProducts/SampleProducts';
import Empty from 'constants/empty';

const MULTISHADEFINDER = 'MULTISHADEFINDER';
const {
    PAGE_TYPES, PAGE_TYPE_PATHS, ACTION_TYPES, CUSTOM_ACTION_TYPES, COMPONENT_TYPES
} = constants;
const { getLink, addInternalTracking, openLinkInNewTab } = urlUtils;

const analyticsSetNextPageData = ({ analyticsNextPageData, isTargetUrlWithAnchorToSamePage }) => {
    if (isTargetUrlWithAnchorToSamePage) {
        const pageType = digitalData.page.category.pageType;
        const pageName = digitalData.page.pageInfo.pageName;
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${pageType}:${pageName}:n/a:*`,
                ...analyticsNextPageData
            }
        });
    } else {
        analyticsUtils.setNextPageData(analyticsNextPageData);
    }
};

const handleUrl = ({
    e, targetUrl, isTargetUrlWithAnchorToSamePage, anchorID, withCallbackNavigation, newWindow
}) => {
    const redirectToUrl = () => Location.setLocation(targetUrl);

    if (targetUrl.startsWith(communityUtils.getCommunityUrl())) {
        redirectToUrl();
    } else if (!newWindow) {
        if (isTargetUrlWithAnchorToSamePage && !withCallbackNavigation) {
            e.preventDefault();
            UI.getScrollSmooth(anchorID);
        } else {
            Location.navigateTo(e, targetUrl);
        }
    } else if (newWindow) {
        openLinkInNewTab(targetUrl);
    }
};

const handleServicesTracking = ({ targetValue, reservationName }) => {
    const parameters = new URLSearchParams(targetValue);
    const storeId = parameters.get('storeId');
    const activityType = parameters.get('experience-type');
    const activityId = parameters.get('experience-id');

    servicesBindings.itemClick({ storeId, activityType, activityId, reservationName });
};

const handleCustomAction = actionType => {
    switch (actionType) {
        case CUSTOM_ACTION_TYPES.PDP_SAMPLE: {
            const mainProductSample = store.getState().productSamples?.product;

            SampleProductsUtils.openSamplesModal(mainProductSample);

            break;
        }
        case CUSTOM_ACTION_TYPES.SIGN_IN: {
            store.dispatch(
                actions.showSignInModal({
                    isOpen: true
                })
            );

            break;
        }
        default:
    }
};

const getTargetUrl = ({ targetUrl, page, type, urlParameters }) => {
    let urlToReturn = targetUrl;
    const { type: pageType, slug, keyword, couponCode } = page || Empty.Object;

    if (pageType) {
        const mainPath = PAGE_TYPE_PATHS[page.type];
        let secondaryPath = '';

        if (slug || keyword || couponCode) {
            if (pageType === PAGE_TYPES.CREDITCARD && slug === '/') {
                secondaryPath = '';
            } else if (pageType === PAGE_TYPES.TLP && couponCode) {
                secondaryPath = page.couponCode;
            } else {
                secondaryPath = slug || keyword;
            }
        } else {
            secondaryPath = '';
        }

        urlToReturn = `${mainPath}${secondaryPath}`;
    }

    if (urlToReturn && urlParameters && type === ACTION_TYPES.INTERNAL) {
        let urlParamsToAdd = urlParameters;

        if (urlToReturn.includes('?')) {
            urlParamsToAdd = urlParameters.replace('?', '&');
        }

        urlToReturn += urlParamsToAdd;
    }

    return urlToReturn;
};

const defaultClickHandler = props => {
    const {
        e,
        action,
        analyticsNextPageData,
        isShadeFinder,
        isModal,
        targetUrl,
        newWindow,
        onClick,
        isModalType,
        withCallbackNavigation,
        reservationName
    } = props;

    const {
        type, modal, actionType, title, width, targetValue, sid
    } = action;
    const isCustomAction = type === ACTION_TYPES.ACTION_CUSTOM;

    const currentPage = targetUrl?.split('#')[0];
    const isAnchorInsidePage = Location.getLocation().pathname === currentPage;
    const isAnchorType = type === COMPONENT_TYPES.ANCHOR;
    const anchorID = targetUrl?.split('#')[1];
    const isTargetUrlWithAnchorToSamePage = targetUrl?.includes('#') && Location.getLocation().pathname === currentPage;

    // Only trigger analytics if this Action is a Service item in Happening at Sephora
    if (Location.isHappeningServices()) {
        handleServicesTracking({ targetValue, reservationName });
    }

    if (!analyticsNextPageData) {
        //reset internal campaign so that we consider icid2 value in generalBindings on pageLoad.
        digitalData.page.attributes.previousPageData.internalCampaign = '';
    }

    if (withCallbackNavigation && isAnchorInsidePage && onClick && anchorID) {
        e.preventDefault();
        onClick(e, () => UI.getScrollSmooth(anchorID));
    } else if (onClick) {
        onClick(e);
    }

    if (analyticsNextPageData) {
        analyticsSetNextPageData({ analyticsNextPageData, isTargetUrlWithAnchorToSamePage });
    }

    // The following conditions are set in order of presedence
    if (isShadeFinder) {
        store.dispatch(actions.showWizard(true, undefined, sid));
    } else if (isModal) {
        e.preventDefault();
        e.stopPropagation();

        store.dispatch(
            actions.showChildContentModal({
                isOpen: true,
                childData: isModalType
                    ? {
                        sid: sid,
                        title: title,
                        width: width
                    }
                    : modal
            })
        );
    } else if (targetUrl) {
        handleUrl({
            e,
            targetUrl,
            isTargetUrlWithAnchorToSamePage,
            anchorID,
            withCallbackNavigation,
            newWindow
        });
    } else if (isAnchorType) {
        UI.getScrollSmooth(action.sid);
    }

    if (isCustomAction) {
        handleCustomAction(actionType);
        //handleCustomAction('PDPSample');

        return;
    }
};

const Action = Component => {
    /* eslint-disable-next-line complexity */
    const ActionComp = ({
        sid,
        icid2,
        action,
        useRedirect,
        analyticsNextPageData,
        onClick,
        seoSource,
        dontUseInternalTracking,
        withCallbackNavigation,
        title,
        referer,
        eventClick,
        ...props
    }) => {
        if (!action) {
            return null;
        }

        const { newWindow, modal, type } = action;
        const isModalType = type === ACTION_TYPES.MODAL;
        const isModal = modal || isModalType;

        let targetUrl = getTargetUrl(action);

        const isShadeFinder = targetUrl === MULTISHADEFINDER;
        const hasClickHandler =
            (useRedirect && targetUrl) || eventClick || onClick || isShadeFinder || isModal || (targetUrl && !newWindow) || analyticsNextPageData;

        const location = Location.getLocation();
        const isDifferentHost =
            !Sephora.isNodeRender &&
            type === ACTION_TYPES.EXTERNAL &&
            targetUrl?.length &&
            location.hostname !== new URL(targetUrl, location.origin)?.hostname;

        if (Location.isBuyPage() && seoSource && targetUrl) {
            targetUrl = addInternalTracking(targetUrl, [`seop_${seoSource}`]);
        } else if ((sid || action.sid) && targetUrl && targetUrl.indexOf('icid2=') === -1 && !isDifferentHost && !dontUseInternalTracking) {
            targetUrl = addInternalTracking(targetUrl, [icid2 || sid || action.sid]);
        }

        const shouldHandleOnClick = useCallback(
            async e => {
                if (!hasClickHandler) {
                    return;
                }

                e.stopPropagation();
                e.preventDefault();
                try {
                    eventClick && (await eventClick(e));

                    await defaultClickHandler({
                        e,
                        action,
                        analyticsNextPageData,
                        isShadeFinder,
                        isModal,
                        targetUrl,
                        newWindow,
                        onClick,
                        sid,
                        isModalType,
                        withCallbackNavigation,
                        reservationName: title,
                        eventClick
                    });
                } catch (error) {
                    Sephora.logger.error(error);
                }

                return;
            },
            [hasClickHandler, eventClick, sid]
        );

        return (
            <Component
                target={newWindow ? '_blank' : null}
                href={!isShadeFinder && !useRedirect ? getLink(targetUrl) : null}
                onClick={shouldHandleOnClick}
                {...props}
            />
        );
    };

    ActionComp.propTypes = {
        sid: PropTypes.string,
        icid2: PropTypes.string,
        action: PropTypes.shape({
            sid: PropTypes.string,
            type: PropTypes.oneOf([
                ACTION_TYPES.EXTERNAL,
                ACTION_TYPES.INTERNAL,
                ACTION_TYPES.MODAL,
                ACTION_TYPES.ACTION,
                ACTION_TYPES.ANCHOR,
                ACTION_TYPES.ACTION_CUSTOM
            ]),
            // ACTION_TYPES.EXTERNAL
            targetUrl: PropTypes.string,
            newWindow: PropTypes.bool,
            // ACTION_TYPES.INTERNAL
            page: PropTypes.shape({
                type: PropTypes.oneOf([
                    PAGE_TYPES.BRAND,
                    PAGE_TYPES.CONTENT,
                    PAGE_TYPES.CATEGORY,
                    PAGE_TYPES.PRODUCT,
                    PAGE_TYPES.SEARCH,
                    PAGE_TYPES.HAPPENING,
                    PAGE_TYPES.CREDITCARD
                ]),
                slug: PropTypes.string
            }),
            // ACTION_TYPES.MODAL
            sys: PropTypes.shape({
                id: PropTypes.string
            }),
            title: PropTypes.string,
            width: PropTypes.number,
            // DEPRECATED
            modal: PropTypes.shape({
                sys: PropTypes.shape({
                    id: PropTypes.string
                }),
                title: PropTypes.string,
                width: PropTypes.number
            })
        }),
        onClick: PropTypes.func,
        seoSource: PropTypes.string,
        useRedirect: PropTypes.bool,
        analyticsNextPageData: PropTypes.object,
        withCallbackNavigation: PropTypes.bool,
        label: PropTypes.string
    };

    ActionComp.defaultProps = {
        icid2: '',
        action: {
            targetUrl: null,
            newWindow: null,
            modal: null,
            sid: null,
            type: null,
            page: null
        },
        onClick: null,
        seoSource: null,
        useRedirect: null,
        analyticsNextPageData: null,
        withCallbackNavigation: false
    };

    return wrapFunctionalComponent(ActionComp, 'ActionComp');
};

export default Action;
