import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import framework from 'utils/framework';
import { cmsRMNBannerSelector } from 'selectors/rmnBanners';
const { wrapHOC } = framework;
import RMN_BANNER_TYPES_CONSTANTS from 'components/Rmn/constants';

import RmnUtils from 'utils/rmn';
import { breakpoints } from 'style/config';

const { POSITIONS, SECTIONS } = RMN_BANNER_TYPES_CONSTANTS;

const isSmallView = () => window.matchMedia(breakpoints.smMax).matches;

const { bannerPositions, bannerCommonProps } = RmnUtils;

const mountFallback = (slot, position, state, useFallback) => {
    if (!slot) {
        return null;
    }

    const banner = state[slot];

    if (!banner) {
        return null;
    }

    if (banner?.banners[position]) {
        return banner.banners[position];
    }

    if (useFallback && banner?.fallback) {
        return banner.fallback;
    }

    return {};
};

const functions = {};

const withRmnBanners = (Component, defaultSection = SECTIONS.SIDEBAR) => {
    const fields = createSelector(
        cmsRMNBannerSelector,
        (_state, ownProps) => ownProps,
        (rmnBannersState, ownProps) => {
            const pageSection = defaultSection;
            const bannerPosition = bannerPositions[ownProps?.position] || 0;
            const bannerProps =
                pageSection === SECTIONS.MAIN
                    ? bannerCommonProps[ownProps.pageType]?.mainBannerProps
                    : bannerCommonProps[ownProps.pageType]?.sideBannerProps;
            const bannerMobileProps = pageSection === SECTIONS.MAIN ? bannerCommonProps[ownProps.pageType]?.mainBannerMobileProps : null;

            const isMobile = isSmallView();

            const useFallback = pageSection === SECTIONS.MAIN && ownProps?.position === POSITIONS.TOP;

            const bannerData = pageSection === SECTIONS.MAIN ? mountFallback(bannerProps?.slot, bannerPosition, rmnBannersState, useFallback) : null;
            const bannerMobileData =
                pageSection === SECTIONS.MAIN ? mountFallback(bannerMobileProps?.slot, bannerPosition, rmnBannersState, useFallback) : null;

            const handleClick = args => RmnUtils.handleBannerClick({ ...args, bannerProps });

            const triggerImpression = () => {
                RmnUtils.fireViewableImpressionEvent({ bannerData, bannerProps });
            };

            const triggerImpressionMobile = () => {
                RmnUtils.fireViewableImpressionEvent({ bannerData: bannerMobileData, bannerProps: bannerMobileProps });
            };

            return {
                ...ownProps,
                isMobile,
                pageSection,
                contextId: rmnBannersState?.contextId,
                bannerData,
                bannerMobileData,
                triggerImpression,
                triggerImpressionMobile,
                bannerMobileProps: {
                    ...bannerMobileProps,
                    position: ownProps?.position || POSITIONS.TOP,
                    handleClick
                },
                bannerProps: {
                    ...bannerProps,
                    position: ownProps?.position || POSITIONS.TOP,
                    handleClick
                },
                slot: bannerProps?.slot,
                position: bannerPosition,
                rmnBanners: rmnBannersState,
                useFallback
            };
        }
    );

    return wrapHOC(connect(fields, functions))(Component);
};

export default withRmnBanners;
