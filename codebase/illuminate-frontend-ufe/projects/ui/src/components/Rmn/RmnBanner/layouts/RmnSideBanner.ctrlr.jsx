/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import RmnEvents from 'analytics/utils/rmnEvents';
import { RmnBannerStyle } from 'components/Rmn/RmnBanner';
import withRmnBanners from 'viewModel/rmn/rmnBanner/withRmnBanner';
import RmnUtils from 'utils/rmn';
const { bannerCommonProps } = RmnUtils;

import mediaUtils from 'utils/Media';

const { isMobileView } = mediaUtils;
/**
 * RmnBanner component
 * @param slot {string} - The slot name for the banner
 * Definitions:
 * - DESKTOP
 * - 2502124 - Siderall Desktop / RMN_BANNER_TYPES.TYPES.WIDE_SIDESCRAPER.NAME
 */
class RmnSideBanner extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            bannerData: null,
            showSkeleton: true
        };

        this.displayRef = React.createRef();
        this.bannerRef = React.createRef();
    }

    componentDidMount() {
        const rmnEventsOptions = this.props?.rootRef?.current ? { root: this.props?.rootRef?.current } : {};
        this.tracker = new RmnEvents(rmnEventsOptions);

        if (Sephora.configurationSettings.RMNEnableDisplay) {
            const { bannerData } = this.props;

            if (bannerData) {
                this.setState({ bannerData, showSkeleton: false });
            }

            this.tracker.observe(this.bannerRef.current);
            this.tracker.setCallback(this.getBannerData);
        }
    }

    componentDidUpdate() {
        if (Sephora.configurationSettings.RMNEnableDisplay) {
            const { bannerData } = this.props;

            if (bannerData && !this.state.bannerData) {
                this.setState({ bannerData, showSkeleton: false });
            }

            if (bannerData && !this.tracker.isInitialized()) {
                this.tracker.observe(this.bannerRef.current);
                this.tracker.setCallback(this.props.triggerImpression);
            }
        }
    }

    componentWillUnmount() {
        this.tracker.destroy();
    }

    getBannerData = () => {
        const isMobile = isMobileView();

        if (isMobile) {
            return;
        }

        const bannerTargets = this.props.rmnBanners.targets || this.props?.targets;
        const { contextId, pageType } = this.props;

        const requestParams = RmnUtils.mountRequestParams({
            ...this.props.bannerProps,
            targets: bannerTargets,
            hasFallback: false, // Side Rail should not show fallback banner.
            contextId,
            pageType
        });

        RmnUtils.getBannersData(requestParams)
            .then(response => {
                const bannerData = response?.data?.[0] || response?.fallback;

                if (bannerData) {
                    this.setState(
                        {
                            bannerData,
                            showSkeleton: false
                        },
                        () => {
                            const bannerProps = bannerCommonProps[this.props?.pageType]?.sideBannerProps;

                            RmnUtils.fireViewableImpressionEvent({ bannerData, bannerProps });
                        }
                    );
                }
            })
            .catch(() => {
                this.setState({ showSkeleton: false });
            });
    };

    render() {
        const { bannerData, showSkeleton } = this.state;
        const { bannerProps } = this.props;

        if (!Object.keys(bannerData || {}).length) {
            return <div ref={this.bannerRef}></div>;
        }

        return (
            <div ref={this.bannerRef}>
                <RmnBannerStyle
                    bannerData={bannerData}
                    showSkeleton={showSkeleton}
                    ref={this.displayRef}
                    {...bannerProps}
                />
            </div>
        );
    }
}

RmnSideBanner.propTypes = {
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    isCentered: PropTypes.bool,
    hasFallback: PropTypes.bool,
    showSkeleton: PropTypes.bool,
    isSearchPage: PropTypes.bool,
    node: PropTypes.string,
    keyword: PropTypes.string
};

RmnSideBanner.defaultProps = {
    marginTop: null,
    marginBottom: null,
    isCentered: false,
    hasFallback: false,
    showSkeleton: false,
    rmnObj: { impressionFired: false }
};

const Banner = wrapComponent(RmnSideBanner, 'RmnSideBanner', true);

export default withRmnBanners(Banner, 'side');
