import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Text } from 'components/ui';

import RmnEvents from 'analytics/utils/rmnEvents';
import RmnAndPlaUtils from 'utils/rmnAndPla';
import isRmnCombinedCallFeatureEnabled from 'components/Rmn/utils';

import localeUtils from 'utils/LanguageLocale';
const { getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/Rmn/locales', 'RmnBanner');
import RMN_BANNER_TYPES from 'components/Rmn/constants';
const { TYPES } = RMN_BANNER_TYPES;
import uiUtils from 'utils/UI';
const { SKELETON_ANIMATION } = uiUtils;
const PLACEHOLDER_IMG = '/img/ufe/placeholder_grey.svg';

/**
 * RmnBottomBanner component
 * @param slot {string} - The slot name for the banner (bottom)
 */
class RmnBottomBanner extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showSkeleton: true
        };
        this.bannerMobileRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.showSMNEnabled && Sephora.configurationSettings.RMNEnableDisplay) {
            this.setState({ showSkeleton: false });
            this.initializeTrackers();
            this.fireBannerTracking(this.props);
        } else {
            this.setState({ showSkeleton: false });
        }
    }

    componentWillUnmount() {
        this.resetTrackers();
    }

    componentDidUpdate(prevProps) {
        if (this.props.showSMNEnabled && Sephora.configurationSettings.RMNEnableDisplay) {
            if (prevProps.rmnBannerPayload !== this.props.rmnBannerPayload && this.props.rmnBannerPayload) {
                this.setState({ showSkeleton: false });
                this.initializeTrackers();
                this.fireBannerTracking(this.props);
            }
        } else {
            this.setState({ showSkeleton: false });
        }
    }

    initializeTrackers = () => {
        this.resetTrackers();
        this.trackerMobile = new RmnEvents();
    };

    resetTrackers = () => {
        this.trackerMobile?.destroy();
        this.trackerMobile = null;
    };

    fireBannerTracking = ({ rmnBannerPayload, bannerMobileProps }) => {
        if (isRmnCombinedCallFeatureEnabled() && rmnBannerPayload) {
            this.setupTracker(this.trackerMobile, this.bannerMobileRef, rmnBannerPayload, bannerMobileProps);
        }
    };

    setupTracker = (tracker, ref, payload, props) => {
        if (!tracker.isInitialized() && payload) {
            tracker.observe(ref.current);
            tracker.setCallback(this.fireImpressionEvent(payload, props));
        }
    };

    fireImpressionEvent = (bannerData, bannerProps) => () => {
        const unifiedBannerData = this.processBannerPayload();
        const bannerDataToSend = isRmnCombinedCallFeatureEnabled() ? unifiedBannerData : bannerData;

        RmnAndPlaUtils.fireViewableImpressionEvent({ bannerData: bannerDataToSend, bannerProps: bannerProps });
    };

    processBannerPayload() {
        const { rmnBannerPayload = {}, fallbackBannerPayload } = this.props;
        const unified = Object.keys(rmnBannerPayload)?.length > 0 ? rmnBannerPayload : null;

        if (!unified) {
            return fallbackBannerPayload;
        }

        return unified || null;
    }

    render() {
        if (!this.props.showSMNEnabled) {
            return null;
        }

        const { showSkeleton } = this.state;

        const bannerPayload = this.processBannerPayload();
        const type = TYPES.MOBILE_LEADERBOARD.NAME;

        const hasBannerData = bannerPayload && Object.keys(bannerPayload).length;
        const slot = bannerPayload?.slot || TYPES[type].SLOT[this.props.pageType];

        const handleClick = e => {
            e.preventDefault();
            e.stopPropagation();
        };

        return bannerPayload || showSkeleton ? (
            <Box
                display={['block', 'none', 'none']} // Show on mobile, hide on desktop
                marginX={'auto'}
                marginTop={this.props.marginTop}
                marginBottom={this.props.marginBottom}
                width='100%'
                maxWidth={TYPES[type].WIDTH}
                ref={this.bannerMobileRef}
                id={`${slot}-${this.props.position}`}
                className='rmn-banner'
            >
                <div css={styles.container(type, hasBannerData)}>
                    <a
                        onClick={hasBannerData ? handleClick : undefined}
                        css={styles.anchor}
                        ref={this.bannerRef}
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
                    width='100%'
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
            overflow: 'visible',
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

RmnBottomBanner.propTypes = {
    bannerData: PropTypes.shape({
        //eslint-disable-next-line camelcase
        asset_url: PropTypes.string
    }),
    position: PropTypes.string,
    pageType: PropTypes.string,
    isCentered: PropTypes.bool,
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    showSkeleton: PropTypes.bool,
    showSMNEnabled: PropTypes.bool
};

RmnBottomBanner.defaultProps = {
    isCentered: false,
    showSkeleton: false,
    rmnObj: { impressionFired: false },
    showSMNEnabled: true
};

export default wrapComponent(RmnBottomBanner, 'RmnBottomBanner', true);
