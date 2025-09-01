import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Text } from 'components/ui';

import RmnEvents from 'analytics/utils/rmnEvents';

import localeUtils from 'utils/LanguageLocale';
const { getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/Rmn/locales', 'RmnBanner');
import RMN_BANNER_TYPES from 'components/Rmn/constants';
const { TYPES } = RMN_BANNER_TYPES;
import uiUtils from 'utils/UI';
const { SKELETON_ANIMATION } = uiUtils;
const PLACEHOLDER_IMG = '/img/ufe/placeholder_grey.svg';
import RmnAndPlaUtils from 'utils/rmnAndPla';
import isRmnCombinedCallFeatureEnabled from 'components/Rmn/utils';

/**
 * RmnSiderailBanner component
 * @param slot {string} - The slot name for the banner
 * Definitions:
 * - DESKTOP
 * - 2502124 - Siderail Desktop / RMN_BANNER_TYPES.TYPES.WIDE_SIDESCRAPER.NAME
 */
class RmnSiderailBanner extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showSkeleton: true
        };

        this.bannerRef = React.createRef();

        this.breakpointCheck = null;
    }

    componentDidMount() {
        this.tracker = new RmnEvents();
        const { showSMNEnabled, rmnBannerPayload } = this.props;

        if (showSMNEnabled && Sephora.configurationSettings.RMNEnableDisplay) {
            if (rmnBannerPayload) {
                this.setState({ showSkeleton: false });
            }
        } else {
            this.setState({ showSkeleton: false });
        }
    }

    componentWillUnmount() {
        this.tracker.destroy();

        if (this.breakpointCheck) {
            this.breakpointCheck.cleanup();
        }
    }

    componentDidUpdate(prevProps) {
        const { showSMNEnabled, rmnBannerPayload } = this.props;

        if (showSMNEnabled && Sephora.configurationSettings.RMNEnableDisplay) {
            // hide skeleton when combined payload or banner data becomes available
            if (prevProps.rmnBannerPayload !== rmnBannerPayload && rmnBannerPayload) {
                this.setState({ showSkeleton: false });
            }

            if (rmnBannerPayload && !this.tracker.isInitialized()) {
                this.tracker.observe(this.bannerRef.current);
                this.tracker.setCallback(this.fireImpressionEvent);
            }
        } else {
            this.setState({ showSkeleton: false });
        }
    }

    fireImpressionEvent = () => {
        const { rmnBannerPayload, bannerProps } = this.props;
        const unifiedBannerData = this.processBannerPayload();
        const bannerDataToSend = isRmnCombinedCallFeatureEnabled() ? unifiedBannerData : rmnBannerPayload;

        RmnAndPlaUtils.fireViewableImpressionEvent({ bannerData: bannerDataToSend, bannerProps });
    };

    handleBannerClick = event => {
        event.preventDefault();
        event.stopPropagation();
        const unifiedBannerData = this.processBannerPayload();
        const { bannerData, bannerProps } = this.props;

        const bannerPropsToSend = bannerProps;
        let bannerDataToSend = bannerData;
        bannerDataToSend = unifiedBannerData;

        RmnAndPlaUtils.handleBannerClick({ event, bannerData: bannerDataToSend, bannerProps: bannerPropsToSend });
    };

    processBannerPayload() {
        let unifiedBannerData = null;

        const { rmnBannerPayload = {}, fallbackBannerPayload } = this.props;

        unifiedBannerData = Object.keys(rmnBannerPayload)?.length > 0 ? rmnBannerPayload : null;

        if (!unifiedBannerData) {
            return fallbackBannerPayload;
        }

        return unifiedBannerData;
    }

    render() {
        const { bannerProps, showSMNEnabled } = this.props;

        if (!showSMNEnabled) {
            return null;
        }

        const { showSkeleton } = this.state;
        const unifiedBannerData = this.processBannerPayload();

        const bannerPayload = unifiedBannerData;
        const hasBannerData = bannerPayload && Object.keys(bannerPayload).length !== 0;
        // Get the right props based on viewport
        const defaultProps = bannerProps;

        const type = TYPES.WIDE_SIDESCRAPER.NAME;
        const slot = bannerPayload?.slot || defaultProps?.slot || TYPES[type].SLOT[this.props.pageType];

        return bannerPayload || showSkeleton ? (
            <Box
                display={TYPES[type].DISPLAY}
                marginX={defaultProps?.isCentered || this.props?.isCentered ? 'auto' : undefined}
                marginTop={defaultProps?.marginTop || this.props?.marginTop}
                marginBottom={defaultProps?.marginBottom || this.props?.marginBottom}
                width='100%'
                maxWidth={TYPES[type].WIDTH}
                ref={this.bannerRef}
                id={`${slot}-${defaultProps?.position || this.props.position}`}
                className='rmn-banner'
            >
                <div css={styles.container(type, hasBannerData)}>
                    <a
                        onClick={hasBannerData ? this.handleBannerClick : undefined}
                        css={styles.anchor}
                    >
                        <img
                            src={hasBannerData ? bannerPayload['asset_url'] : PLACEHOLDER_IMG}
                            width={TYPES[type].WIDTH}
                            height={TYPES[type].HEIGHT}
                            css={styles.img}
                            alt={getText('alt')}
                        />
                    </a>
                </div>
                <Text
                    is='p'
                    color='gray'
                    fontSize='sm'
                    lineHeight='tight'
                    marginTop={2}
                    children={getText('sponsored')}
                    style={!hasBannerData ? { visibility: 'hidden' } : null}
                />
            </Box>
        ) : null;
    }
}

const styles = {
    container: (type, hasBannerData) => [
        {
            position: 'relative',
            overflow: 'visible', // Changed this property to fix LCP selection
            paddingBottom: `${Math.round((TYPES[type].HEIGHT / TYPES[type].WIDTH) * 100)}%`
        },
        !hasBannerData && SKELETON_ANIMATION
    ],
    anchor: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'pointer'
    },
    img: {
        display: 'block',
        objectFit: 'cover',
        width: '100%',
        height: '100%'
    }
};

RmnSiderailBanner.propTypes = {
    type: PropTypes.oneOf([TYPES.SUPER_LEADERBOARD.NAME, TYPES.MOBILE_LEADERBOARD.NAME, TYPES.WIDE_SIDESCRAPER.NAME]),
    bannerData: PropTypes.shape({
        //eslint-disable-next-line camelcase
        asset_url: PropTypes.string
    }),
    position: PropTypes.string,
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    isCentered: PropTypes.bool,
    hasFallback: PropTypes.bool,
    showSkeleton: PropTypes.bool,
    isSearchPage: PropTypes.bool,
    node: PropTypes.string,
    keyword: PropTypes.string,
    showSMNEnabled: PropTypes.bool
};

RmnSiderailBanner.defaultProps = {
    marginTop: null,
    marginBottom: null,
    isCentered: false,
    hasFallback: false,
    showSkeleton: false,
    rmnObj: { impressionFired: false },
    showSMNEnabled: true
};

export default wrapComponent(RmnSiderailBanner, 'RmnSiderailBanner', true);
