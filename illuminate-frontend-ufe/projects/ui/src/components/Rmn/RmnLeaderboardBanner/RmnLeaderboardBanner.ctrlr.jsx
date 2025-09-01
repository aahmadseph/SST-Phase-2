import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Text } from 'components/ui';
import RmnEvents from 'analytics/utils/rmnEvents';
import localeUtils from 'utils/LanguageLocale';
import RMN_BANNER_TYPES from 'components/Rmn/constants';
import uiUtils from 'utils/UI';
import RmnAndPlaUtils from 'utils/rmnAndPla';
import isRmnCombinedCallFeatureEnabled from 'components/Rmn/utils';
import mediaUtils from 'utils/Media';
import { mediaQueries } from 'style/config';

const { getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/Rmn/locales', 'RmnBanner');
const { SKELETON_ANIMATION } = uiUtils;
const { Media, isMobileView } = mediaUtils;
const { TYPES } = RMN_BANNER_TYPES;
const PLACEHOLDER_IMG = '/img/ufe/placeholder_grey.svg';

/**
 * RmnLeaderboardBanner component
 * @param slot {string} - The slot name for the banner
 * Definitions:
 * - DESKTOP
 * - 2502123 - Top and middle of the page / RMN_BANNER_TYPES.TYPES.MOBILE_LEADERBOARD.NAME
 * - MOBILE
 * - 2502223 - Top/mid/footer of the page / RMN_BANNER_TYPES.TYPES.MOBILE_LEADERBOARD.NAME
 */
class RmnLeaderboardBanner extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showSkeleton: true
        };

        this.bannerRef = React.createRef();
        this.bannerMobileRef = React.createRef();
    }

    componentDidMount() {
        this.tracker = new RmnEvents();
        this.trackerMobile = new RmnEvents();
        const { bannerData, bannerMobileData, rmnBannerPayload, showSMNEnabled } = this.props;

        if (showSMNEnabled && Sephora.configurationSettings.RMNEnableDisplay) {
            if (isRmnCombinedCallFeatureEnabled()) {
                if (rmnBannerPayload) {
                    this.setState({ showSkeleton: false });
                }
            } else {
                if (bannerData || bannerMobileData) {
                    this.setState({ showSkeleton: false });
                }
            }
        } else {
            this.setState({ showSkeleton: false });
        }
    }

    componentWillUnmount() {
        this.tracker.destroy();
        this.trackerMobile.destroy();
    }

    componentDidUpdate(prevProps) {
        const { rmnBannerPayload, bannerProps, bannerMobileProps, showSMNEnabled } = this.props;

        if (showSMNEnabled && Sephora.configurationSettings.RMNEnableDisplay) {
            const isMobile = isMobileView();

            if (isRmnCombinedCallFeatureEnabled()) {
                this.tracker = new RmnEvents();
                this.trackerMobile = new RmnEvents();

                if (prevProps.rmnBannerPayload !== rmnBannerPayload && rmnBannerPayload) {
                    this.setState({ showSkeleton: false });

                    if (isMobile) {
                        this.setupTracker(this.trackerMobile, this.bannerMobileRef, rmnBannerPayload, bannerMobileProps);
                    } else {
                        this.setupTracker(this.tracker, this.bannerRef, rmnBannerPayload, bannerProps);
                    }
                }
            }
        } else {
            this.setState({ showSkeleton: false });
        }
    }

    setupTracker = (tracker, ref, payload, props) => {
        if (!tracker.isInitialized() && payload) {
            tracker.observe(ref.current);
            tracker.setCallback(this.fireImpressionEvent(payload, props));
        }
    };

    fireImpressionEvent = (bannerData, bannerProps) => () => {
        const unifiedBannerData = this.processBannerPayload();
        const bannerDataToSend = isRmnCombinedCallFeatureEnabled() ? unifiedBannerData : bannerData;

        RmnAndPlaUtils.fireViewableImpressionEvent({ bannerData: bannerDataToSend, bannerProps });
    };

    handleBannerClick = (hasBannerData, bannerData, bannerProps) => event => {
        if (!hasBannerData) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        const unifiedBannerData = this.processBannerPayload();
        const bannerDataToSend = !isRmnCombinedCallFeatureEnabled() ? bannerData : unifiedBannerData;

        RmnAndPlaUtils.handleBannerClick({ event, bannerData: bannerDataToSend, bannerProps });
    };

    processBannerPayload() {
        let unifiedBannerData = null;

        if (isRmnCombinedCallFeatureEnabled()) {
            const { rmnBannerPayload = {}, fallbackBannerPayload } = this.props;
            unifiedBannerData = Object.keys(rmnBannerPayload)?.length > 0 ? rmnBannerPayload : null;

            if (!unifiedBannerData) {
                return fallbackBannerPayload;
            }
        }

        return unifiedBannerData;
    }

    renderBanner({
        type, bannerPayload, bannerProps, style, ref, mediaProps
    }) {
        const { showSkeleton } = this.state;
        const slot = bannerPayload?.slot || bannerProps?.slot || TYPES[type].SLOT[this.props.pageType];
        const hasBannerData = bannerPayload && Object.keys(bannerPayload).length !== 0;
        const viewportStyle = {
            paddingBottom: `${Math.round((TYPES[type].HEIGHT / TYPES[type].WIDTH) * 100)}%`,
            ...style
        };

        return bannerPayload || showSkeleton ? (
            <Media {...mediaProps}>
                <Box
                    display={TYPES[type].DISPLAY}
                    marginX='auto'
                    marginTop={bannerProps?.marginTop || this.props?.marginTop}
                    marginBottom={bannerProps?.marginBottom}
                    width='100%'
                    maxWidth={TYPES[type].WIDTH}
                    ref={ref}
                    id={`${slot}-${bannerProps?.position || this.props.position}`}
                    className='rmn-banner'
                    css={styles.container}
                >
                    <div css={[styles.wrapper, viewportStyle, !hasBannerData && SKELETON_ANIMATION]}>
                        <a
                            onClick={this.handleBannerClick(hasBannerData, bannerPayload, bannerProps)}
                            css={styles.anchor}
                        >
                            <img
                                src={hasBannerData ? bannerPayload.asset_url : PLACEHOLDER_IMG}
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
                        textAlign='left'
                        width='100%'
                        children={getText('sponsored')}
                        style={!hasBannerData ? { visibility: 'hidden' } : null}
                    />
                </Box>
            </Media>
        ) : null;
    }

    render() {
        if (!this.props.showSMNEnabled) {
            return null;
        }

        const { bannerProps, bannerMobileProps } = this.props;
        const unifiedBannerData = this.processBannerPayload();

        return (
            <>
                {this.renderBanner({
                    mediaProps: {
                        lessThan: 'md'
                    },
                    type: TYPES.MOBILE_LEADERBOARD.NAME,
                    bannerProps: bannerMobileProps,
                    bannerPayload: isRmnCombinedCallFeatureEnabled() ? unifiedBannerData : {},
                    ref: this.bannerMobileRef,
                    style: {
                        width: TYPES[TYPES.MOBILE_LEADERBOARD.NAME].WIDTH,
                        maxWidth: '100%'
                    }
                })}
                {this.renderBanner({
                    mediaProps: {
                        greaterThan: 'lg'
                    },
                    type: TYPES.SUPER_LEADERBOARD.NAME,
                    bannerProps,
                    bannerPayload: isRmnCombinedCallFeatureEnabled() ? unifiedBannerData : {},
                    ref: this.bannerRef,
                    style: {
                        width: '100%',
                        maxWidth: TYPES[TYPES.SUPER_LEADERBOARD.NAME].WIDTH
                    }
                })}
            </>
        );
    }
}

const styles = {
    container: {
        textAlign: 'center',
        marginTop: '4px',
        marginBottom: '4px',
        [mediaQueries.sm]: {
            marginLeft: 0,
            marginRight: 0,
            marginTop: 0,
            marginBottom: '32px'
        }
    },
    wrapper: {
        position: 'relative',
        overflow: 'visible' // Changed this property to fix LCP selection
    },
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

RmnLeaderboardBanner.propTypes = {
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

RmnLeaderboardBanner.defaultProps = {
    marginTop: null,
    marginBottom: null,
    isCentered: false,
    hasFallback: false,
    showSkeleton: false,
    rmnObj: { impressionFired: false },
    showSMNEnable: true
};

export default wrapComponent(RmnLeaderboardBanner, 'RmnLeaderboardBanner', true);
