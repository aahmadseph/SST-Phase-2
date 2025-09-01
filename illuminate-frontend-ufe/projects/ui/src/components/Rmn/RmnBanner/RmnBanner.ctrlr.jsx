/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import RMN_BANNER_TYPES from 'components/Rmn/constants';
import productUtils from 'utils/product';
import { PostLoad } from 'constants/events';
import { mountBannerEventData } from 'analytics/utils/eventName';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import Location from 'utils/Location';
import RmnUtils from 'utils/rmn';
import Empty from 'constants/empty';
import mediaUtils from 'utils/Media';
import { RmnBannerStyle } from 'components/Rmn/RmnBanner';
import anaUtils from 'analytics/utils';
import store from 'store/Store';

import { cmsRMNBannerSelector } from 'selectors/rmnBanners';

const { isMobileView } = mediaUtils;
const { TYPES } = RMN_BANNER_TYPES;

let Events;

/**
 * RmnBanner component
 * @param slot {string} - The slot name for the banner
 * Definitions:
 * - DESKTOP
 * - 2502123 - Top and middle of the page / RMN_BANNER_TYPES.TYPES.MOBILE_LEADERBOARD.NAME
 * - 2502124 - Siderall Desktop / RMN_BANNER_TYPES.TYPES.WIDE_SIDESCRAPER.NAME
 * - MOBILE
 * - 2502223 - Top and middle of the page / RMN_BANNER_TYPES.TYPES.MOBILE_LEADERBOARD.NAME
 * - 2502224 - Siderall Desktop / RMN_BANNER_TYPES.TYPES.WIDE_SIDESCRAPER.NAME
 */
class RmnBanner extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            bannerData: null,
            showSkeleton: true,
            viewport: null,
            rmnBanners: cmsRMNBannerSelector(store.getState())
        };
        this.displayRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        const {
            contextId, isSearchPage, node, keyword, onUpdate, position = 0
        } = this.props;

        if (Sephora.configurationSettings.RMNEnableDisplay) {
            const prevContextId = prevProps?.contextId || '';
            const prevPosition = prevProps?.position || 0;

            if (isSearchPage) {
                if ((node || keyword) && (prevProps.keyword !== keyword || prevProps.node !== node)) {
                    this.setState({ bannerData: null, showSkeleton: true }, this.handleResize);
                    onUpdate?.();
                }
            } else if (prevContextId === contextId && prevPosition !== position) {
                this.handleResize();
                onUpdate?.();
            } else if (prevContextId !== contextId) {
                const requestParams = RmnUtils.mountRequestParams(this.props);

                RmnUtils.initializeBanners(requestParams).then(() => {
                    this.setState({ bannerData: null, showSkeleton: true }, this.handleResize);
                    onUpdate?.();
                });
            }
        }
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            const rmnBanners = cmsRMNBannerSelector(store.getState());
            this.setState({ rmnBanners });
        });
        const { rmnBanners } = this.state;

        const { slot } = this.props;

        if (Sephora.configurationSettings.RMNEnableDisplay) {
            const inViewport = this.isInViewport();

            if (inViewport) {
                const requestParams = RmnUtils.mountRequestParams(this.props);

                if (!rmnBanners[slot]) {
                    RmnUtils.initializeBanners(requestParams).then(() => {
                        this.handleResize();
                    });
                } else {
                    this.handleResize();
                }
            } else {
                this.setState({ showSkeleton: true });
            }

            import('utils/framework/Events').then(module => {
                Events = module.default;
                window.addEventListener(Events.DebouncedResize, this.handleResize);
            });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }

        if (Sephora.configurationSettings.RMNEnableDisplay) {
            window.removeEventListener(Events.DebouncedResize, this.handleResize);
        }

        RmnUtils.resetBanners();
    }

    isInViewport = () => {
        const current = this.displayRef.current;

        if (!current || current.offsetParent === null) {
            return false;
        }

        const rect = current.getBoundingClientRect();
        const container = current.parentElement;

        if (container === document.body || container === document.documentElement) {
            return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
        }

        const containerRect = container.getBoundingClientRect();

        return (
            rect.top >= containerRect.top &&
            rect.left >= containerRect.left &&
            rect.bottom <= containerRect.bottom &&
            rect.right <= containerRect.right
        );
    };

    setFallback = () => {
        const { position, slot } = this.props;
        const { rmnBanners } = this.state;
        const bannerData = rmnBanners[slot]?.banners?.[position] || rmnBanners[slot]?.fallback?.[position] || Empty.Object;

        this.setState({
            bannerData: {
                ...bannerData
            },
            showSkeleton: false
        });
    };

    handleFallback = () => {
        const { hasFallback = true } = this.props;

        if (hasFallback) {
            this.setFallback();
        } else {
            this.setState({ showSkeleton: false, bannerData: {} });
        }
    };

    triggerTracking = banner => {
        if (!banner) {
            return;
        }

        const { type, slot, section, handleRmnBanner } = this.props;

        const sponsorBannerProduct = {
            ...banner,
            slot,
            type,
            section
        };

        if (sponsorBannerProduct?.slot) {
            const bannerTrackingInfo = this.getBannerTrackingInfo(sponsorBannerProduct);

            if (handleRmnBanner) {
                handleRmnBanner(bannerTrackingInfo);
            }

            if (this.checkTrackingShouldFire()) {
                this.fireViewableImpressionEvent();
            }
        }
    };

    handleResize = () => {
        const { slot, position = 0 } = this.props;
        const rmnBanners = cmsRMNBannerSelector(store.getState());

        const inViewport = this.isInViewport();
        const bannersSlotData = rmnBanners[slot];

        const viewport = this.state.viewport;
        const currentView = isMobileView() ? viewport === 'mobile' : 'desktop';

        if (currentView === viewport) {
            return;
        }

        if (bannersSlotData) {
            const bannerData = bannersSlotData?.banners?.[position];

            if (bannerData) {
                this.setState(
                    {
                        bannerData,
                        showSkeleton: false
                    },
                    () => {
                        this.triggerTracking(bannerData);
                    }
                );
            } else {
                this.handleFallback();
            }
        } else if (inViewport) {
            const requestParams = RmnUtils.mountRequestParams(this.props);

            RmnUtils.initializeBanners(requestParams)
                .then(response => {
                    if (response[position]) {
                        this.setState(
                            {
                                bannerData: response[position],
                                showSkeleton: false
                            },
                            () => {
                                this.triggerTracking(response[position]);
                            }
                        );
                    } else {
                        this.handleFallback();
                    }
                })
                .catch(() => {
                    this.handleFallback();
                });
        }
    };

    // This is the information used in the Page View event. SOT extracts the information directly from the digitalData
    getBannerTrackingInfo = sponsorBannerProduct => {
        // Extracts the click tracking info from the RMN sponsor product
        const clickTrackerInfo = productUtils.getClickTrackerInformation(sponsorBannerProduct);
        const { slot, section, type } = this.props;
        const sponsorBannerProductData = {
            ...sponsorBannerProduct,
            ...clickTrackerInfo
        };

        // Builds the tracking information object
        return {
            slot,
            section,
            type,
            skuId: '',
            clickTrackerId: sponsorBannerProductData?.clickTrackerId || '',
            impressionTrackerId: sponsorBannerProductData?.impression_id || '',
            impressionPayload: sponsorBannerProductData?.impression_payload || '',
            clickPayload: sponsorBannerProductData?.clickPayload || '',
            onloadPayload: sponsorBannerProductData?.onload_payload || '',
            wishlistPayload: sponsorBannerProductData?.wishlist_payload || '',
            basketPayload: sponsorBannerProductData?.basket_payload || '',
            viewableImpressionPayload: sponsorBannerProductData?.viewable_impression_payload || ''
        };
    };

    // This is the tracking information that is sent when events like click and viewable impression are fired
    getBannerEventTrackinfo = bannerData => {
        const bannerTrackingData = this.getBannerTrackingInfo(bannerData);

        return {
            sku: '',
            sponsored: true,
            clickTrackerId: bannerTrackingData?.clickTrackerId || '',
            impressionTrackerId: bannerTrackingData?.impressionTrackerId || '',
            impressionPayload: bannerTrackingData?.impressionPayload || '',
            clickPayload: bannerTrackingData?.clickPayload || '',
            isSponsoredProduct: true,
            onloadPayload: bannerTrackingData?.onloadPayload || '',
            wishlistPayload: bannerTrackingData?.wishlistPayload || '',
            basketPayload: bannerTrackingData?.basketPayload || '',
            viewableImpressionPayload: bannerTrackingData?.viewableImpressionPayload || ''
        };
    };

    // Verifies if tracking information should be added. When its mobile or desktop
    checkTrackingShouldFire = () => {
        const { type } = this.props;
        const isMobile = isMobileView();
        let addBannerTrackingInfo = true;

        // Checks if the desktop version is showing to add the right tracking data
        if (!isMobile && type === TYPES.MOBILE_LEADERBOARD.NAME) {
            addBannerTrackingInfo = false;
        }

        // Checks if the mobile version is showing to add the right tracking data
        if (isMobile && type !== TYPES.MOBILE_LEADERBOARD.NAME) {
            addBannerTrackingInfo = false;
        }

        return addBannerTrackingInfo;
    };

    handleEventName = type => {
        const { section } = this.props;

        const sotEvent = mountBannerEventData({
            section,
            type
        });

        return sotEvent;
    };

    handleFallbackClickthru = event => {
        const { bannerData } = this.state;
        event.preventDefault();
        window.location.href = bannerData.clickthru;
    };

    // Called when the user clicks on the banner
    handleClick = event => {
        // Handle Viewable Impression Code.
        const { source, slot, section, contextId } = this.props;
        const { bannerData } = this.state;

        digitalData.page.attributes.previousPageData.pageType = source;
        // reset internalCampaign so `getInternalCampaign` in generalBindings will set it
        // to the icid2 queryParam in the pPage URL
        digitalData.page.attributes.previousPageData.internalCampaign = '';
        const trackingInformation = this.getBannerEventTrackinfo(bannerData);
        let sotType;

        switch (contextId) {
            case RmnUtils.RMN_SOURCES.HOMEPAGE:
                sotType = anaConsts.EVENT_NAMES.PLA_HOME_SPONSORED_BANNER_CLICK;

                break;
            default:
                sotType = this.handleEventName(anaConsts.EVENTS_TYPES_NAME.CLICK);
        }

        // Verifies the sponsored product information is available and that the product is a sponsored one.
        if (trackingInformation && trackingInformation.isSponsoredProduct) {
            anaUtils.fireEventForTagManager(anaConsts.SOT_LINK_TRACKING_EVENT, {
                detail: {
                    data: {
                        linkName: sotType,
                        actionInfo: sotType,
                        specificEventName: sotType,
                        sponsoredProductInformation: trackingInformation,
                        eventStrings: anaConsts.Event.EVENT_254,
                        internalCampaign: anaConsts.CAMPAIGN_STRINGS.RMN_BANNER,
                        productStrings: `;non-product click;;;${anaConsts.Event.EVENT_254};eVar124=[${slot}]:[${section}]:[${bannerData.campaign_id}]`
                    },
                    specificEventName: sotType
                }
            });
        }

        // This code makes sure the tracking event for the click action is fired before navigating to the banner url
        Location.navigateTo(event?.event, bannerData.clickthru);
    };

    // Fired from componentDidMount, this method dispatches the event that indicates the banner has been shown to the client
    fireViewableImpressionEvent = () => {
        const { contextId } = this.props;
        const { flagViewableImpression, rmnObj } = this.props;

        import('utils/framework/Events').then(module => {
            Events = module.default;

            if (rmnObj && !rmnObj?.impressionFired) {
                // Waits until the page is completely loaded to fire the event for Signal/TMS.
                Events.onLastLoadEvent(window, [PostLoad], () => {
                    const { bannerData } = this.state;

                    // Extras the viewable tracking information from the sponsored product
                    const {
                        sku, sponsored, impressionTrackerId, impressionPayload, isSponsoredProduct
                    } = this.getBannerEventTrackinfo(bannerData);

                    let sotType;

                    switch (contextId) {
                        case RmnUtils.RMN_SOURCES.HOMEPAGE:
                            sotType = anaConsts.EVENT_NAMES.PLA_HOME_SPONSORED_BANNER_VIEWABLE_IMPR;

                            break;
                        default:
                            sotType = this.handleEventName(anaConsts.EVENTS_TYPES_NAME.VIEW);
                    }

                    // When firing the viewable impression, only the impression tracking id and payload are required
                    const trackingInformation = {
                        sku,
                        sponsored,
                        impressionTrackerId,
                        impressionPayload,
                        isSponsoredProduct
                    };

                    // Verifies the sponsored product information is available and that the product is a sponsored one.
                    if (trackingInformation && trackingInformation.isSponsoredProduct) {
                        if (flagViewableImpression) {
                            flagViewableImpression(rmnObj);
                        }

                        processEvent.process(
                            anaConsts.SOT_LINK_TRACKING_EVENT,
                            {
                                data: {
                                    linkName: sotType,
                                    actionInfo: sotType,
                                    specificEventName: sotType,
                                    sponsoredProductInformation: trackingInformation
                                }
                            },
                            { specificEventName: sotType }
                        );
                    }
                });
            }
        });
    };

    render() {
        const { type, position = 0 } = this.props;
        const { bannerData, showSkeleton } = this.state;

        if (!Sephora.configurationSettings.RMNEnableDisplay) {
            return null;
        }

        return (
            <RmnBannerStyle
                bannerData={bannerData}
                ref={this.displayRef}
                slot={this.props.slot}
                marginTop={this.props.marginTop}
                marginBottom={this.props.marginBottom}
                isCentered={this.props.isCentered}
                handleClick={this.handleClick}
                showSkeleton={showSkeleton}
                position={position}
                type={type}
            />
        );
    }
}

RmnBanner.propTypes = {
    type: PropTypes.oneOf([TYPES.SUPER_LEADERBOARD.NAME, TYPES.MOBILE_LEADERBOARD.NAME, TYPES.WIDE_SIDESCRAPER.NAME]).isRequired,
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    isCentered: PropTypes.bool,
    hasFallback: PropTypes.bool,
    showSkeleton: PropTypes.bool,
    isSearchPage: PropTypes.bool,
    node: PropTypes.string,
    keyword: PropTypes.string
};

RmnBanner.defaultProps = {
    marginTop: null,
    marginBottom: null,
    isCentered: false,
    hasFallback: false,
    showSkeleton: false,
    rmnObj: { impressionFired: false }
};

export default wrapComponent(RmnBanner, 'RmnBanner', true);
