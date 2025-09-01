import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import UrlUtils from 'utils/Url';
import BccBase from 'components/Bcc/BccBase/BccBase';
import { Link } from 'components/ui';
import BCCUtils from 'utils/BCC';
import store from 'Store';
import actions from 'Actions';
import analyticsUtils from 'analytics/utils';

const { setTargetWindow } = BCCUtils;
const { addInternalTracking } = UrlUtils;

const BccLink = props => {
    const {
        url,
        target,
        title,
        text,
        anaNavPath,
        icid2,
        isTrackByName,
        name,
        componentName,
        modalTemplate,
        modalComponentTemplate,
        enableTesting,
        trackNavClick,
        targetScreen,
        displayTitle,
        disableLazyLoad,
        enablePageRenderTracking,
        isBccStyleWrapperApplied,
        altText,
        componentType,
        origin,
        ...remainingProps
    } = props;

    const targetWindow = setTargetWindow(target);

    let targetUrl;

    if (icid2 && url && url.indexOf('icid2') === -1) {
        targetUrl = addInternalTracking(url, [icid2]);
    } else if ((isTrackByName && name) || origin) {
        targetUrl = addInternalTracking(url, [name]);
    } else {
        targetUrl = url;
    }

    const toggleOpen = e => {
        const TARGET_TYPES = {
            SAME: 0,
            NEW: 1,
            OVERLAY: 2
        };
        const { bannerCallback } = props;

        if (target === TARGET_TYPES.OVERLAY && e) {
            e.preventDefault();
        }

        if (target === TARGET_TYPES.OVERLAY && targetScreen && targetScreen.ufeModalId) {
            store.dispatch(
                actions.showUFEModal({
                    isOpen: true,
                    ufeModalId: targetScreen.ufeModalId
                })
            );
        } else if (target === TARGET_TYPES.OVERLAY && modalTemplate) {
            // dispatch BCC modal
            store.dispatch(
                actions.showBccModal({
                    isOpen: true,
                    bccModalTemplate: modalTemplate,
                    bccParentComponentName: componentName
                })
            );
        } else if (target === TARGET_TYPES.OVERLAY && targetScreen && targetScreen.mediaId) {
            // dispatch media modal
            store.dispatch(
                actions.showMediaModal({
                    isOpen: true,
                    mediaId: targetScreen.mediaId
                })
            );
        } else if (bannerCallback && typeof bannerCallback === 'function') {
            // Only dismiss the banner if the CTA does not open a modal
            bannerCallback(text);
        }
    };

    const trackNavigationClick = path => {
        analyticsUtils.setNextPageData({ navigationInfo: analyticsUtils.buildNavPath(path) });
    };

    const linkProps = {
        ...remainingProps,
        is: 'a',
        href: targetUrl,
        target: targetWindow,
        title: title,
        onClick: props.onClick
            ? props.onClick
            : e => {
                toggleOpen(e);

                if (anaNavPath) {
                    trackNavigationClick(anaNavPath);
                }
            }
    };

    return (
        <BccBase {...props}>
            <Link
                display='block'
                children={text}
                {...linkProps}
            />
        </BccBase>
    );
};

export default wrapFunctionalComponent(BccLink, 'BccLink');
