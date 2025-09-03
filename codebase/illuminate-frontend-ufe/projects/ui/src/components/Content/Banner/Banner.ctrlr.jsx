import React from 'react';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import constants from 'constants/content';
import { Box, Flex } from 'components/ui';
import Action from 'components/Content/Action';
import {
    colors, fontSizes, mediaQueries, space, lineHeights
} from 'style/config';
import bannerLayout from 'components/Content/BannerLayout';

import userUtils from 'utils/User';
import replaceTextPersonalization from 'utils/replaceTextPersonalization';
import Location from 'utils/Location';

const { BannerFlush, BannerIcon } = bannerLayout;
const { CONTEXTS, COMPONENT_SPACING, BANNER_TYPES } = constants;
const RECOGNIZED_CLASS = '.isRecognized &';
const FlexAction = Action(Flex);
import anaConsts from 'analytics/constants';

const PLACEMENTS = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
};

const VARIANTS = {
    Flush: BannerFlush,
    Icon: BannerIcon
};

function getSizeOrWidth(width, size) {
    return width > size ? size : width;
}

function isHorizontal(placement) {
    return placement === PLACEMENTS.LEFT || placement === PLACEMENTS.RIGHT;
}

function getMediaSize(width, size, largeWidth) {
    return Array.isArray(size) || largeWidth
        ? [getSizeOrWidth(width, size[0] || size), getSizeOrWidth(largeWidth || width, size[1] || size)]
        : getSizeOrWidth(width, size);
}

function getWrapperComponent(media, isMultiLink, action) {
    if (media?.videoSource) {
        return Flex;
    }

    if (isMultiLink || !action) {
        return Flex;
    }

    return FlexAction;
}

const getContext = type => {
    switch (type) {
        case BANNER_TYPES.PDP:
            return CONTEXTS.GRID;
        default:
            return CONTEXTS.CONTAINER;
    }
};

class Banner extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            personalizationSkeleton: true
        };
    }

    componentDidMount() {
        const { triggerImpression, shouldTriggerImpression } = this.props;

        if (shouldTriggerImpression) {
            const mergedProps = this.props?.personalizedComponent?.variationData || this.props;

            triggerImpression(mergedProps);
        }

        if (Sephora.configurationSettings?.isBirthdayLandingPageP13NEnabled && Location.isBirthdayGiftPage()) {
            setTimeout(() => {
                this.setState({ personalizationSkeleton: false });
            }, [500]);
        } else {
            this.setState({ personalizationSkeleton: false });
        }

        window.addEventListener(anaConsts.Event.SIGN_IN_RELOAD, () => {
            if (triggerImpression && shouldTriggerImpression) {
                triggerImpression();
            }
        });
    }

    isLink() {
        const { isSkeleton, ...bannerProps } = this.props;

        const mergedProps = this.props?.personalizedComponent?.variationData || bannerProps;

        const { action, media, items } = mergedProps;

        const isMultiLink = Boolean(items?.length > 0 && action);

        if (media?.videoSource || isMultiLink || !action || isSkeleton) {
            return false;
        }

        return true;
    }

    analyticsClick = async () => {
        const { fireClickTracking, fireBannerListEvent, triggerClick, fireClickTrackingEvent } = this.props;
        const mergedProps = this.props?.personalizedComponent?.variationData || this.props;

        const { sid } = mergedProps;

        if (fireClickTrackingEvent === false) {
            if (this.props.delegateClick) {
                await this.props.delegateClick();
            }
        } else {
            if (fireBannerListEvent) {
                await fireBannerListEvent({ sid, variationData: mergedProps || null }, this?.props?.position);
            } else if (triggerClick) {
                await triggerClick({
                    sid,
                    variationData: mergedProps || null
                });
            }

            // Analytics click tracking function.
            if (fireClickTracking) {
                fireClickTracking(mergedProps);
            }
        }
    };

    eventClick = async () => {
        const hasLink = this.isLink();

        if (!hasLink) {
            return;
        }

        await this.analyticsClick();
    };

    handleOnClick = async () => {
        const hasLink = this.isLink();

        if (hasLink) {
            return;
        }

        await this.analyticsClick();
    };

    // eslint-disable-next-line complexity
    render() {
        const {
            bannerType,
            context,
            ignoreRecognizedStatus = false,
            isSkeleton,
            isRootComponent,
            p13n,
            personalization,
            personalizedComponent,
            triggerImpression,
            enablePageRenderTracking,
            alignLeft,
            customButton,
            referer,
            useMediaHeight,
            isNBCEnabled,
            customPaddingX,
            customPaddingY,
            mediaAllignSelf,
            ...bannerProps
        } = this.props;

        const mergedProps =
            this.props.nonTargettedPreviewIndex > -1
                ? this.props.nonTargettedVariations[this.props.nonTargettedPreviewIndex - 1]
                : this.props?.personalizedComponent?.variationData || bannerProps;

        const {
            sid,
            action,
            media,
            largeMedia,
            items,
            size,
            backgroundColor,
            color,
            marginTop,
            variant = 'Flush',
            mediaPlacement,
            largeMediaPlacement
        } = mergedProps;

        let { text, marginBottom } = mergedProps;

        if (Sephora.configurationSettings?.isBirthdayLandingPageP13NEnabled && text) {
            marginBottom = this.props.marginBottom;
            text = replaceTextPersonalization(text, '[Name]', userUtils.getProfileFirstName());
        }

        const showSkeleton = isSkeleton || (personalization?.isEnabled && !p13n.isInitialized);

        if (!media?.src && !text) {
            return null;
        }

        let typeContext = context || this.props.context;

        if (bannerType && bannerType !== BANNER_TYPES.DEFAULT) {
            //override context based on type
            typeContext = getContext(bannerType);
        }

        const isPersistentBanner = bannerType === BANNER_TYPES.PERSISTENT || bannerType === BANNER_TYPES.NOTIFICATION;
        const isNotificationBanner = bannerType === BANNER_TYPES.NOTIFICATION;
        const isHeroBanner = bannerType === BANNER_TYPES.HERO;
        const isPDPBanner = bannerType === BANNER_TYPES.PDP;
        const isPDPSampleBanner = bannerType === BANNER_TYPES.PDP_SAMPLE;

        const isContained = typeContext === CONTEXTS.CONTAINER;
        const isBannerList = typeContext === CONTEXTS.BANNER_LIST;
        const isMultiLink = Boolean(items?.length > 0 && action);
        const WrapperComp = getWrapperComponent(media, isMultiLink, action);
        const TextWrapComp = isMultiLink ? FlexAction : Flex;

        const LinkProps = {
            sid,
            action,
            referer: sid,
            css: action && styles.link,
            eventClick: this.eventClick,
            onClick: this.handleOnClick
        };

        const isWhiteBackground =
            backgroundColor?.toLowerCase() === '#fff' || backgroundColor?.toLowerCase() === 'white' || backgroundColor?.toLowerCase() === '#ffffff';
        const mediaSize = media?.width && size ? getMediaSize(media.width, size, largeMedia?.width) : null;
        const shouldCenterText = !alignLeft && !media && !(!media && isBannerList);
        const imagePadding = media ? (mediaPlacement === PLACEMENTS.LEFT ? `0 ${space[4]}px 0 0` : `0 0 0 ${space[4]}px`) : `0 ${space[4]}px`;

        const BannerLayout = VARIANTS[variant];
        const wrapperProps = media?.videoSource ? { ...LinkProps } : { ...(isMultiLink || LinkProps) };
        const { personalizationSkeleton } = this.state;

        return (
            <Box
                id={sid}
                backgroundColor={backgroundColor}
                color={color}
                marginTop={marginTop}
                marginBottom={marginBottom}
                {...(text && {
                    borderRadius: 2,
                    overflow: 'hidden'
                })}
                {...(!isPersistentBanner &&
                    backgroundColor &&
                    !isWhiteBackground &&
                    isContained && {
                    marginX: ['-container', 0],
                    borderRadius: [null, 2]
                })}
                {...(isWhiteBackground &&
                    text && {
                    borderWidth: 1,
                    borderColor: 'midGray'
                })}
                width={size}
                height={'100% !important'}
                css={[
                    (showSkeleton || personalizationSkeleton) && {
                        [RECOGNIZED_CLASS]: {
                            pointerEvents: 'none',
                            boxShadow: `inset 0 0 0 1px ${colors.lightGray}`,
                            backgroundColor: 'white',
                            borderWidth: 0
                        }
                    },
                    (showSkeleton || personalizationSkeleton) && ignoreRecognizedStatus && styles.skeleton,
                    styles.default,
                    isHeroBanner && styles.heroBanner,
                    isNotificationBanner && styles.notificationBanner,
                    isPDPBanner && styles.pdpBanner,
                    isBannerList && styles.bannerList,
                    isPersistentBanner && styles.persistentBanner,
                    isPersistentBanner && {
                        padding: imagePadding,
                        [mediaQueries.sm]: {
                            padding: `0 ${space[4]}px`
                        }
                    },
                    isPDPSampleBanner && styles.pdpSampleBanner
                ]}
            >
                <WrapperComp
                    {...wrapperProps}
                    position='relative'
                    width={isPersistentBanner ? (isNotificationBanner ? 'auto' : '1248px') : '100%'}
                    justifyContent={shouldCenterText ? 'center' : 'left'}
                    css={!action && styles.noAction}
                >
                    <BannerLayout
                        sid={sid}
                        nonTargettedPreviewIndex={this.props.nonTargettedPreviewIndex}
                        bannerType={bannerType}
                        text={text}
                        media={media}
                        isMultiLink={isMultiLink}
                        LinkProps={LinkProps}
                        largeMediaPlacement={largeMediaPlacement}
                        showSkeleton={showSkeleton || personalizationSkeleton}
                        isContained={isContained}
                        isBannerList={isBannerList}
                        items={items}
                        mediaSize={mediaSize}
                        enablePageRenderTracking={enablePageRenderTracking}
                        largeMedia={largeMedia}
                        color={color}
                        TextWrapComp={TextWrapComp}
                        FlexAction={FlexAction}
                        mediaPlacement={mediaPlacement}
                        isRootComponent={isRootComponent}
                        shouldCenterText={shouldCenterText}
                        ignoreRecognizedStatus={ignoreRecognizedStatus}
                        styles={styles}
                        noBackgroundColor={!backgroundColor}
                        customButton={customButton}
                        personalizedComponent={personalizedComponent}
                        shouldTriggerImpression={mergedProps?.shouldTriggerImpression}
                        triggerImpression={triggerImpression}
                        useMediaHeight={useMediaHeight}
                        customPaddingX={customPaddingX}
                        customPaddingY={customPaddingY}
                        mediaAllignSelf={mediaAllignSelf}
                    />
                </WrapperComp>
            </Box>
        );
    }
}

const styles = {
    default: {
        borderRadius: 2,
        overflow: 'hidden',
        textWrap: (mediaPlacement, media) => ({
            padding: space[4],
            [mediaQueries.sm]: {
                padding: media ? (isHorizontal(mediaPlacement) ? `${space[4]}px ${space[7]}px` : space[5]) : space[4]
            }
        }),
        copy: {
            '& :where(h2, h3)': {
                marginBottom: space[1],
                marginTop: space[1]
            }
        }
    },
    persistentBanner: {
        fontSize: fontSizes.sm,
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '0px',
        borderWidth: '0px',
        minHeight: '48px',
        [mediaQueries.sm]: {
            fontSize: fontSizes.base,
            minHeight: '60px'
        },
        textWrap: {
            padding: `${space[1]}px 0`,
            justifyContent: 'center',
            [mediaQueries.smMax]: {
                height: 'auto !important'
            },
            [mediaQueries.sm]: {
                padding: `${space[1]}px 0`
            }
        }
    },
    notificationBanner: {
        [mediaQueries.sm]: {
            minHeight: '48px !important'
        }
    },
    heroBanner: {
        marginLeft: 0,
        marginRight: 0,
        textWrap: {
            fontSize: fontSizes['md-bg'],
            padding: space[4],
            [mediaQueries.sm]: {
                fontSize: fontSizes['xl-bg'],
                padding: `${space[6]}px ${space[7]}px`
            },
            'p.seo-header, h2': {
                fontSize: fontSizes['3xl-bg'],
                [mediaQueries.sm]: {
                    fontSize: fontSizes['2xl']
                }
            }
        }
    },
    pdpBanner: {
        textWrap: {
            padding: `0 ${space[4]}px`,
            lineHeight: lineHeights.tight,
            fontSize: fontSizes.sm,
            // make sure margin is 0, and not negative, for PDP Banners that have a background
            //  color,which makes isContained to be true and thus sets ['-container', 0] for marginX,
            // causing overflowing of the component and thus looks uncentered
            marginX: 0,
            [mediaQueries.sm]: {
                padding: `0 ${space[4]}px`,
                fontSize: fontSizes.base
            }
        },
        textWrapNoMedia: {
            padding: `${space[3]}px ${space[4]}px`
        }
    },
    pdpSampleBanner: {
        borderColor: '#EEEEEE',
        borderWidth: 1,
        borderRadius: 4
    },
    bannerList: {
        display: 'flex',
        lineHeight: lineHeights.tight,
        borderRadius: 4,
        textWrap: {
            padding: space[4],
            [mediaQueries.sm]: {
                padding: `${space[5]}px`
            }
        }
    },
    link: {
        '.no-touch button&:hover, .no-touch a&:hover': {
            '& p, & p span': {
                textDecoration: 'underline'
            }
        },
        '&:focus-visible': {
            outlineOffset: 0
        }
    },
    noAction: {
        cursor: 'auto'
    },
    skeleton: {
        pointerEvents: 'none',
        boxShadow: `inset 0 0 0 1px ${colors.lightGray}`,
        backgroundColor: 'white',
        borderWidth: 0
    }
};

Banner.propTypes = {
    //Context only needs to be passed in if the bannerType is not set
    context: PropTypes.oneOf([CONTEXTS.BANNER_LIST, CONTEXTS.CONTAINER, CONTEXTS.GRID, CONTEXTS.MODAL, CONTEXTS.PERSISTENT_BANNER]),
    variant: PropTypes.string,
    bannerType: PropTypes.oneOf([
        BANNER_TYPES.DEFAULT,
        BANNER_TYPES.PERSISTENT,
        BANNER_TYPES.NOTIFICATION,
        BANNER_TYPES.PDP,
        BANNER_TYPES.HERO,
        BANNER_TYPES.PDP_SAMPLE
    ]),
    sid: PropTypes.string,
    enablePageRenderTracking: PropTypes.bool,
    nonTargettedVariations: PropTypes.array,
    nonTargettedClick: PropTypes.func,
    text: PropTypes.object,
    action: PropTypes.object,
    media: PropTypes.object,
    mediaPlacement: PropTypes.oneOf([PLACEMENTS.TOP, PLACEMENTS.RIGHT, PLACEMENTS.BOTTOM, PLACEMENTS.LEFT]),
    largeMedia: PropTypes.object,
    largeMediaPlacement: PropTypes.oneOf([PLACEMENTS.TOP, PLACEMENTS.RIGHT, PLACEMENTS.BOTTOM, PLACEMENTS.LEFT]),
    items: PropTypes.array,
    size: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.string]),
    personalization: PropTypes.object,
    p13n: PropTypes.object,
    user: PropTypes.object,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    marginTop: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    seoHeader: PropTypes.string,
    isRootComponent: PropTypes.bool,
    // Toggles text centralization if no media is present on the banner
    alignLeft: PropTypes.bool,
    ignoreRecognizedStatus: PropTypes.bool,
    customPaddingX: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    customPaddingY: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    mediaAllignSelf: PropTypes.string
};

Banner.defaultProps = {
    sid: null,
    enablePageRenderTracking: null,
    text: null,
    action: null,
    media: null,
    mediaPlacement: PLACEMENTS.TOP,
    largeMedia: null,
    largeMediaPlacement: null,
    items: null,
    size: null,
    personalization: null,
    p13n: null,
    user: {},
    backgroundColor: null,
    color: 'base',
    marginTop: COMPONENT_SPACING.XS,
    marginBottom: COMPONENT_SPACING.XS,
    variant: 'Flush',
    seoHeader: null,
    isRootComponent: true,
    alignLeft: false,
    context: CONTEXTS.CONTAINER,
    ignoreRecognizedStatus: false,
    bannerType: BANNER_TYPES.DEFAULT,
    customPaddingX: null,
    customPaddingY: null,
    mediaAllignSelf: null
};

export default wrapComponent(Banner, 'Banner', true);
