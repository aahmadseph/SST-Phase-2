import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import constants from 'constants/content';
import Banner from 'components/Content/Banner';
import { setIntersectionObserver } from 'utils/intersectionObserver';
import BaseClass from 'components/BaseClass';
import bannerListLayout from 'components/Content/BannerListLayout';
import { UserInfoReady, DebouncedResize } from 'constants/events';
import {
    Text, Box, Button, Icon, Flex
} from 'components/ui';
import anaConsts from 'analytics/constants';
import { colors, zIndices, breakpoints } from 'style/config';
import MLActivatedDetailBox from 'components/Content/MLActivatedDetailBox';

const { SmallCarousel, LargeCarousel, GridLayout } = bannerListLayout;

const { CONTEXTS, COMPONENT_SPACING } = constants;

const GAPS = {
    SMALL: 'small',
    LARGE: 'large'
};

const VARIANTS = {
    'Small Carousel': SmallCarousel,
    'Large Carousel': LargeCarousel,
    '2-Column': GridLayout,
    '3-Column': GridLayout,
    '4-Column': GridLayout
};

class BannerList extends BaseClass {
    ref = React.createRef();
    constructor() {
        super();
        this.state = {
            inView: false,
            inViewObserver: null,
            error: null,
            isLoadingTrendingContent: false,
            trendingContent: null,
            isDetailBoxOpen: false,
            isMobile: false,
            nonTargettedPreviewIndex: -1
        };
    }

    checkIsMobile = () => {
        this.setState({
            isMobile: window.matchMedia(breakpoints.smMax).matches
        });
    };

    openDetailBox = () => {
        this.setState({
            isDetailBoxOpen: true
        });
    };

    closeDetailBox = () => {
        if (this.state.isDetailBoxOpen) {
            this.setState({ isDetailBoxOpen: false });
        }
    };

    nonTargettedClick = index => {
        this.setState({ nonTargettedPreviewIndex: index });
    };

    componentDidUpdate(prevProps) {
        // Wait until the personalization data has been initialized to make sure
        // we have all p13n contexts to compare our banners against

        if (!prevProps.p13n.isInitialized && this.props.p13n.isInitialized) {
            this.setUpViewableImpression();
        }
    }

    componentDidMount() {
        const {
            items, variant, triggerCMSImpression, isTrendingContentEnabled, getTrendingContent
        } = this.props;

        this.checkIsMobile();
        window.addEventListener(DebouncedResize, this.checkIsMobile);

        if (this.props.p13n.isInitialized) {
            this.setUpViewableImpression();
        }

        if (triggerCMSImpression && variant.indexOf('Carousel') === -1) {
            triggerCMSImpression && triggerCMSImpression(Array.from(Array(items.length).keys()));
        }

        if (isTrendingContentEnabled) {
            this.setState({ isLoadingTrendingContent: true });
            getTrendingContent()
                .then(trendingContent => {
                    if (trendingContent) {
                        this.setState({
                            trendingContent: trendingContent.variationData
                        });
                    }
                })
                .finally(() => {
                    this.setState({ isLoadingTrendingContent: false });
                });
        }
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.checkIsMobile);

        if (this.state.inViewObserver) {
            this.state.inViewObserver.disconnect();
        }
    }

    setUpViewableImpression = () => {
        // The impression event for SOT needs user data, so we need it to be ready before we trigger the impression.
        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            // The impression should only be triggered when the banner list is in the viewport.
            setIntersectionObserver(
                this.ref.current,
                (inView, observer) => {
                    if (inView) {
                        this.props.triggerImpression();
                    }

                    this.setState({
                        inViewObserver: observer
                    });
                },
                {},
                true
            );
        });

        window.addEventListener(anaConsts.Event.SIGN_IN_RELOAD, () => {
            const { triggerCMSImpression, triggerImpression } = this.props;

            if (triggerCMSImpression && triggerImpression) {
                triggerImpression();
            }
        });
    };

    normalizeMediaPlacement = banner => {
        let { mediaPlacement, largeMediaPlacement } = banner;

        if (banner.variant !== 'Icon') {
            if (mediaPlacement === 'left') {
                mediaPlacement = 'top';
            }

            if (largeMediaPlacement === 'left') {
                largeMediaPlacement = 'top';
            }

            if (mediaPlacement === 'right') {
                mediaPlacement = 'bottom';
            }

            if (largeMediaPlacement === 'right') {
                largeMediaPlacement = 'bottom';
            }
        }

        return { mediaPlacement, largeMediaPlacement };
    };

    getBannerListPropsAndSkeleton = () => {
        let bannerListProps = this.props.personalizedComponent?.variationData || this.props;
        const { isTrendingContentEnabled } = bannerListProps;
        const { isLoadingTrendingContent, trendingContent } = this.state;

        let isSkeleton = this.props.personalization?.isNBCEnabled && this.props.isPersonalizationInitializing;

        if (isTrendingContentEnabled) {
            isSkeleton = isLoadingTrendingContent;

            if (trendingContent) {
                bannerListProps = trendingContent;
            }
        }

        return { bannerListProps, isSkeleton };
    };

    renderTitle = (title, marginTop) => {
        const hasValidTitle = title && title !== this.props.sid && title !== this.props.type;

        if (!hasValidTitle) {
            return null;
        }

        return (
            <Text
                is='h2'
                fontSize={['md', 'lg']}
                fontWeight='bold'
                children={title}
                marginTop={marginTop}
            />
        );
    };

    renderSubtitle = subtitle => {
        if (!subtitle) {
            return null;
        }

        return (
            <Text
                is='p'
                lineHeight='tight'
                children={subtitle}
                marginTop={1}
            />
        );
    };

    render() {
        const { bannerListProps, isSkeleton } = this.getBannerListPropsAndSkeleton();
        const {
            items, width, largeWidth, enablePageRenderTracking, variant, page, subtitle, title, personalization = {}
        } = bannerListProps;

        if (!items || !width) {
            return null;
        }

        const itemWidth = width && largeWidth ? [width, largeWidth] : width;
        const LayoutBannerList = VARIANTS[variant];

        const banners = items
            .filter(item => item.media || item.text)
            .map((banner, index) => {
                const { mediaPlacement, largeMediaPlacement } = this.normalizeMediaPlacement(banner);

                return (
                    <Banner
                        {...banner}
                        nonTargettedPreviewIndex={this.state.nonTargettedPreviewIndex}
                        nonTargettedClick={this.nonTargettedClick}
                        isNBCEnabled={this.props.showPersonalizationOverlay}
                        position={index}
                        nonTargettedVariations={this.props.nonTargettedVariations}
                        key={banner.sid}
                        mediaPlacement={mediaPlacement}
                        largeMediaPlacement={largeMediaPlacement}
                        marginTop={null}
                        marginBottom={null}
                        size={LayoutBannerList === GridLayout ? '100%' : itemWidth}
                        context={CONTEXTS.BANNER_LIST}
                        enablePageRenderTracking={enablePageRenderTracking && index <= (Sephora.isMobile() ? 1 : 2)}
                        isRootComponent={false}
                        page={page}
                        fireBannerListEvent={async target => {
                            await this.props.triggerClick(target, index, personalization);
                        }}
                        inList={true}
                        isSkeleton={isSkeleton}
                        referer={this.props.sid}
                        ignoreRecognizedStatus={bannerListProps.isTrendingContentEnabled}
                    />
                );
            });

        return (
            <>
                {this.renderTitle(title, this.props.marginTop)}
                {this.renderSubtitle(subtitle)}

                <Flex
                    flexDirection='column'
                    alignItems='center'
                >
                    <Box
                        position='relative'
                        zIndex={1}
                        width={LayoutBannerList.displayName === LargeCarousel.displayName ? '100vw' : '100%'}
                        paddingX={this.props.showPersonalizationOverlay ? 4 : 0}
                        marginTop={(title || subtitle) && this.props.showPersonalizationOverlay ? 4 : 0}
                        css={this.props.showPersonalizationOverlay ? styles.personalizationOverlayContainer : {}}
                    >
                        {!this.state.isLoadingTrendingContent && banners?.length > 0 && (
                            <LayoutBannerList
                                {...this.props}
                                ref={this.ref}
                                banners={banners}
                                personalization={personalization}
                                onImpression={this.props.triggerCMSImpression}
                            />
                        )}

                        {this.props.showPersonalizationOverlay && (
                            <>
                                <Box
                                    position='absolute'
                                    left='0'
                                    right='0'
                                    margin='0 auto'
                                    display='flex'
                                    justifyContent='center'
                                    bottom='-24px'
                                >
                                    <Box
                                        position='relative'
                                        display='inline-block'
                                        zIndex={zIndices.header}
                                    >
                                        <Button
                                            display='flex'
                                            backgroundColor='#06E3FF'
                                            border='none'
                                            paddingX={[3, 2]}
                                            paddingY={2}
                                            fontSize={'11px'}
                                            style={{
                                                cursor: 'default',
                                                borderRadius: '20px',
                                                alignItems: 'center'
                                            }}
                                            onClick={this.openDetailBox}
                                        >
                                            <Icon name='personalizedInfoNoOutline' />
                                            <Text>ML ACTIVATED</Text>
                                        </Button>
                                        {!this.state.isMobile && this.state.isDetailBoxOpen && (
                                            <MLActivatedDetailBox
                                                personalization={this.props.personalization}
                                                metadata={{ cxsSD: this.props.cxsSD, cxsED: this.props.cxsED }}
                                                onClose={this.closeDetailBox}
                                                isOpen={this.state.isDetailBoxOpen}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </Flex>
                {this.props.showPersonalizationOverlay && this.state.isMobile && this.state.isDetailBoxOpen && (
                    <MLActivatedDetailBox
                        personalization={this.props.personalization}
                        metadata={{ cxsSD: this.props.cxsSD, cxsED: this.props.cxsED }}
                        onClose={this.closeDetailBox}
                        isOpen={this.state.isDetailBoxOpen}
                    />
                )}
            </>
        );
    }
}

const styles = {
    personalizationOverlayContainer: {
        '::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: `4px solid ${colors.red}`,
            pointerEvents: 'none',
            zIndex: zIndices.fixedBar
        }
    }
};

BannerList.propTypes = {
    context: PropTypes.oneOf([CONTEXTS.CONTAINER, CONTEXTS.MODAL]).isRequired,
    sid: PropTypes.string,
    enablePageRenderTracking: PropTypes.bool,
    gap: PropTypes.oneOf([GAPS.SMALL, GAPS.LARGE]),
    items: PropTypes.array,
    width: PropTypes.number.isRequired,
    largeWidth: PropTypes.number,
    marginTop: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    p13n: PropTypes.object.isRequired,
    variant: PropTypes.string,
    isPersonalizedPlacement: PropTypes.bool,
    getTrendingContent: PropTypes.func,
    triggerImpression: PropTypes.func,
    triggerClick: PropTypes.func,
    isPersonalizationInitializing: PropTypes.bool,
    personalization: PropTypes.object,
    personalizedComponent: PropTypes.object,
    isTrendingContentEnabled: PropTypes.bool,
    triggerCMSImpression: PropTypes.func
};

BannerList.defaultProps = {
    sid: null,
    enablePageRenderTracking: null,
    gap: GAPS.SMALL,
    items: null,
    largeWidth: null,
    marginTop: COMPONENT_SPACING.SM,
    marginBottom: COMPONENT_SPACING.LG,
    variant: 'Large Carousel',
    isPersonalizedPlacement: false,
    getTrendingContent: () => Promise.resolve(null),
    triggerImpression: () => {},
    triggerClick: () => {},
    isPersonalizationInitializing: false,
    personalization: {},
    personalizedComponent: null,
    isTrendingContentEnabled: false,
    triggerCMSImpression: () => {}
};

export default wrapComponent(BannerList);
