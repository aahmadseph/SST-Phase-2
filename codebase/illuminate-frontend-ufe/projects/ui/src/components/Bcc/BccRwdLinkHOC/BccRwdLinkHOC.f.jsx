/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import BccUtils from 'utils/BCC';
import UrlUtils from 'utils/Url';
import UI from 'utils/UI';
import store from 'Store';
import actions from 'Actions';
import Location from 'utils/Location';
import SpaUtils from 'utils/Spa';
import communityUtils from 'utils/Community';

const { excludeForFrCA, setTargetWindow } = BccUtils;
const { getLink, addInternalTracking } = UrlUtils;

const MULTISHADEFINDER = 'MULTISHADEFINDER';

// Supports bcc props from RWD LINK + RWD BANNER components

const BccRwdLinkHOC = Component => {
    const BccRwdLink = ({
        bccProps, onClick, useInternalTracking, source, withCallbackNavigation, ...props
    }) => {
        const {
            targetWindow, modalComponent, componentName, name, style
        } = bccProps;
        let { targetUrl } = bccProps;

        if (excludeForFrCA(style)) {
            return null;
        }

        const target = targetUrl ? setTargetWindow(targetWindow) : null;
        const isShadeFinder = targetUrl === MULTISHADEFINDER;
        const hasClickHandler = onClick || isShadeFinder || modalComponent || (targetUrl && !target);
        const nameOrComponentName = name || componentName;

        if (useInternalTracking && targetUrl?.indexOf('icid2=') === -1) {
            targetUrl = addInternalTracking(targetUrl, [nameOrComponentName]);
        }

        const isAnchor = targetUrl?.includes('#');

        return (
            <Component
                target={target}
                href={isShadeFinder ? null : getLink(targetUrl)}
                onClick={
                    hasClickHandler
                        ? e => {
                            const page = targetUrl?.split('#')[0];
                            const isAnchorInsidePage = Location.getLocation().pathname === page;
                            const anchor = targetUrl?.split('#')[1];

                            if (withCallbackNavigation && isAnchorInsidePage && onClick && isAnchor) {
                                e.preventDefault();
                                onClick(e, () => {
                                    UI.getScrollSmooth(anchor);
                                });
                            } else {
                                onClick && onClick(e);
                            }

                            if (isShadeFinder) {
                                store.dispatch(actions.showWizard(true, undefined, nameOrComponentName));
                            } else if (modalComponent) {
                                store.dispatch(
                                    actions.showBccModal({
                                        isOpen: true,
                                        bccModalTemplate: modalComponent
                                    })
                                );
                            } else if (isAnchor) {
                                // if the user pathname and target URL are in the same page
                                if (isAnchorInsidePage && !withCallbackNavigation) {
                                    e.preventDefault();
                                    UI.getScrollSmooth(anchor);
                                } else {
                                    Location.setLocation(targetUrl);
                                }
                            } else if (targetUrl) {
                                const redirectToUrl = () => Location.setLocation(targetUrl);

                                if (Location.isBuyPage() && source) {
                                    e.preventDefault();
                                    targetUrl = addInternalTracking(targetUrl, [`seop_${source}`]);
                                }

                                if (SpaUtils.nextPageIsActiveSpaPage(targetUrl)) {
                                    Location.navigateTo(e, targetUrl);
                                }

                                if (targetUrl.startsWith(communityUtils.getCommunityUrl())) {
                                    redirectToUrl();
                                }
                            }
                        }
                        : null
                }
                {...props}
            />
        );
    };

    return wrapFunctionalComponent(BccRwdLink, 'BccRwdLinkHOC');
};

export default BccRwdLinkHOC;
