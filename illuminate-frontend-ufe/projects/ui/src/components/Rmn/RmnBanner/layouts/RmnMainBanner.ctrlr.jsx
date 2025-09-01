/* eslint-disable camelcase */
/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { RmnBannerStyle } from 'components/Rmn/RmnBanner';
import RmnEvents from 'analytics/utils/rmnEvents';
import withRmnBanners from 'viewModel/rmn/rmnBanner/withRmnBanner';
import ComponentResponsiveChangeCheck from 'utils/ComponentResponsiveChangeCheck';
import RMN_BANNER_TYPES_CONSTANTS from 'components/Rmn/constants';

const { MOBILE_VIEW } = RMN_BANNER_TYPES_CONSTANTS;
/**
 * RmnBanner component
 * @param slot {string} - The slot name for the banner
 * Definitions:
 * - DESKTOP
 * - 2502123 - Top and middle of the page / RMN_BANNER_TYPES.TYPES.MOBILE_LEADERBOARD.NAME
 * - MOBILE
 * - 2502223 - Top/mid/footer of the page / RMN_BANNER_TYPES.TYPES.MOBILE_LEADERBOARD.NAME
 */
class RmnMainBanner extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showSkeleton: true,
            currentView: props.isMobile ? 'mobile' : 'desktop'
        };
        this.tracker = new RmnEvents();
        this.trackerMobile = new RmnEvents();

        this.bannerRef = React.createRef();
        this.bannerMobileRef = React.createRef();

        this.breakpointCheck = null;
    }

    handleViewportChange = isMobile => {
        const newView = isMobile ? 'mobile' : 'desktop';

        if (newView !== this.state.currentView) {
            this.setState({
                currentView: newView,
                showSkeleton: false
            });
        }
    };

    componentDidMount() {
        this.breakpointCheck = new ComponentResponsiveChangeCheck(MOBILE_VIEW, this.handleViewportChange, 0);

        if (Sephora.configurationSettings.RMNEnableDisplay) {
            const { bannerData, bannerMobileData } = this.props;

            if (bannerData || bannerMobileData) {
                this.setState({ showSkeleton: false });
            }
        }
    }

    componentWillUnmount() {
        this.tracker.destroy();
        this.trackerMobile.destroy();

        if (this.breakpointCheck) {
            this.breakpointCheck.cleanup();
        }
    }

    componentDidUpdate(prevProps) {
        if (Sephora.configurationSettings.RMNEnableDisplay) {
            const { bannerMobileData, bannerData, isMobile } = this.props;

            if (prevProps.isMobile !== isMobile) {
                this.setState({
                    currentView: isMobile ? 'mobile' : 'desktop',
                    showSkeleton: false
                });
            }

            if (this.state.currentView === 'mobile' && bannerMobileData && !this.trackerMobile.isInitialized()) {
                this.trackerMobile.observe(this.bannerMobileRef.current);
                this.trackerMobile.setCallback(this.props.triggerImpressionMobile);
            }

            if (this.state.currentView === 'desktop' && bannerData && !this.tracker.isInitialized()) {
                this.tracker.observe(this.bannerRef.current);
                this.tracker.setCallback(this.props.triggerImpression);
            }
        }
    }

    render() {
        const { showSkeleton } = this.state;

        const {
            bannerProps, bannerMobileProps, bannerData, bannerMobileData, useFallback
        } = this.props;

        if (this.state.currentView === 'desktop' && !bannerProps?.position !== 2) {
            return (
                <RmnBannerStyle
                    bannerData={bannerData}
                    showSkeleton={showSkeleton}
                    ref={this.bannerRef}
                    {...bannerProps}
                    useFallback={useFallback}
                />
            );
        }

        return (
            <RmnBannerStyle
                bannerData={bannerMobileData}
                showSkeleton={showSkeleton}
                ref={this.bannerMobileRef}
                {...bannerMobileProps}
                useFallback={useFallback}
            />
        );
    }
}

RmnMainBanner.propTypes = {
    position: PropTypes.number,
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    isCentered: PropTypes.bool,
    hasFallback: PropTypes.bool,
    showSkeleton: PropTypes.bool,
    isSearchPage: PropTypes.bool,
    node: PropTypes.string,
    keyword: PropTypes.string
};

RmnMainBanner.defaultProps = {
    marginTop: null,
    marginBottom: null,
    isCentered: false,
    hasFallback: false,
    showSkeleton: false,
    rmnObj: { impressionFired: false }
};

const Banner = wrapComponent(RmnMainBanner, 'RmnMainBanner', true);

export default withRmnBanners(Banner, 'main');
