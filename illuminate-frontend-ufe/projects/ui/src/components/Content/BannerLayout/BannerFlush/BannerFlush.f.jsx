/* eslint-disable complexity */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import contentConstants from 'constants/content';
import uiUtils from 'utils/UI';
import { space, mediaQueries } from 'style/config';
import RichText from 'components/Content/RichText';
import { Box, Flex, Text } from 'components/ui';
import Media from 'components/Content/Media';
import PropTypes from 'prop-types';

const { BANNER_TYPES } = contentConstants;
const { SKELETON_COPY, SKELETON_OVERLAY } = uiUtils;
const RECOGNIZED_CLASS = '.isRecognized &';

const PLACEMENTS = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
};

function isHorizontal(placement) {
    return placement === PLACEMENTS.LEFT || placement === PLACEMENTS.RIGHT;
}

function isRowOrColumn(placement) {
    return isHorizontal(placement) ? 'row' : 'column';
}

function getMediaOrder(placement) {
    return placement === PLACEMENTS.LEFT || placement === PLACEMENTS.TOP ? -1 : 0;
}

function getMediaMax(placement) {
    return isHorizontal(placement) ? '50%' : '100%';
}

function getTextJustify(placement) {
    return isHorizontal(placement) ? 'center' : 'normal';
}

function getMargin(placement) {
    return placement === PLACEMENTS.LEFT ? `0 ${space[2]}px 0 0` : `0 0 0 ${space[2]}px`;
}

function getNoBackgroundPadding(placement, isSMUI) {
    switch (placement) {
        case PLACEMENTS.LEFT:
            return isSMUI ? `0 0 0 ${space[4]}px` : `0 0 0 ${space[7]}px`;
        case PLACEMENTS.RIGHT:
            return isSMUI ? `0 ${space[4]}px 0 0` : `0 ${space[7]}px 0 0`;
        case PLACEMENTS.TOP:
            return `${space[4]}px 0 0 0`;
        default:
            return `0 0 ${space[4]}px 0`;
    }
}

const BannerFlush = ({
    sid,
    bannerType,
    text,
    media,
    isMultiLink,
    isBannerList,
    largeMediaPlacement,
    showSkeleton,
    items,
    mediaSize,
    enablePageRenderTracking,
    largeMedia,
    color,
    LinkProps,
    mediaPlacement,
    TextWrapComp,
    FlexAction,
    isRootComponent,
    shouldCenterText,
    ignoreRecognizedStatus,
    styles,
    noBackgroundColor,
    customButton,
    useMediaHeight
}) => {
    const isPersistentBanner = bannerType === BANNER_TYPES.PERSISTENT || bannerType === BANNER_TYPES.NOTIFICATION;
    const isHeroBanner = bannerType === BANNER_TYPES.HERO;
    const isPDPBanner = bannerType === BANNER_TYPES.PDP;

    const rowOrCol = isRowOrColumn(mediaPlacement);
    const mediaOrder = getMediaOrder(mediaPlacement);
    const mediaMax = getMediaMax(mediaPlacement);
    const textJustify = getTextJustify(mediaPlacement);
    const margin = getMargin(mediaPlacement);
    const video = media?.videoSource;
    let customMediaSize = mediaSize;

    const BannerActionLabel = (label, index) => {
        if (!label) {
            return null;
        }

        return (
            <Text
                color='black'
                css={{
                    position: 'absolute',
                    top: '80%'
                }}
                fontWeight='bold'
                is='p'
                lineHeight='none'
                numberOfLines={2}
                paddingLeft={index === 0 ? 2 : 1}
                paddingRight={index === items.length - 1 ? 2 : 1}
                textAlign='center'
                width='100%'
            >
                {label}
            </Text>
        );
    };

    const BannerActionOpacity = (
        <Flex
            backgroundColor='white'
            css={{
                transition: 'opacity .2s',
                '.no-touch &:hover': {
                    opacity: 0.3
                }
            }}
            flex={1}
            opacity={0}
            position='relative'
            zIndex={1}
        />
    );

    if (video) {
        customMediaSize = isRootComponent && !text ? ['100%', '50%'] : '100%';
    }

    return (
        <Flex
            width={video ? '100%' : 'auto'}
            flexDirection={largeMediaPlacement ? [rowOrCol, isRowOrColumn(largeMediaPlacement)] : rowOrCol}
            flexGrow={1}
        >
            {text && (
                <TextWrapComp
                    {...(isMultiLink && LinkProps)}
                    flexDirection='column'
                    flex={1}
                    textAlign={shouldCenterText && 'center'}
                    justifyContent={largeMediaPlacement ? [textJustify, getTextJustify(largeMediaPlacement)] : textJustify}
                    css={[
                        styles.default.textWrap(largeMediaPlacement ? largeMediaPlacement : mediaPlacement, media),
                        isHeroBanner && styles.heroBanner.textWrap,
                        isPersistentBanner && styles.persistentBanner.textWrap,
                        isPDPBanner && media && styles.pdpBanner.textWrap,
                        isPDPBanner && !media && styles.pdpBanner.textWrapNoMedia,
                        isBannerList && styles.bannerList.textWrap,
                        noBackgroundColor &&
                            (largeMediaPlacement
                                ? {
                                    [mediaQueries.smMax]: { padding: getNoBackgroundPadding(mediaPlacement, true) },
                                    [mediaQueries.sm]: { padding: getNoBackgroundPadding(largeMediaPlacement) }
                                }
                                : {
                                    [mediaQueries.smMax]: { padding: getNoBackgroundPadding(mediaPlacement, true) },
                                    [mediaQueries.sm]: { padding: getNoBackgroundPadding(mediaPlacement) }
                                })
                    ]}
                >
                    <RichText
                        content={text}
                        style={[
                            showSkeleton && !ignoreRecognizedStatus && { [RECOGNIZED_CLASS]: SKELETON_COPY },
                            showSkeleton && ignoreRecognizedStatus && SKELETON_COPY,
                            styles.default.copy
                        ]}
                        linkColor={color}
                    />
                    {customButton && customButton()}
                </TextWrapComp>
            )}
            {media && (
                <Box
                    position='relative'
                    maxWidth={isPersistentBanner ? '612px' : largeMediaPlacement ? [mediaMax, getMediaMax(largeMediaPlacement)] : mediaMax}
                    marginX={!text && 'auto'}
                    margin={isPersistentBanner && [margin, largeMediaPlacement ? getMargin(largeMediaPlacement) : margin]}
                    width={customMediaSize}
                    useMediaHeight={useMediaHeight}
                    flexShrink={0}
                    order={largeMediaPlacement ? [mediaOrder, getMediaOrder(largeMediaPlacement)] : mediaOrder}
                >
                    <Media
                        {...media}
                        largeMedia={largeMedia}
                        size={mediaSize}
                        isPageRenderImg={enablePageRenderTracking}
                        disableLazyLoad={enablePageRenderTracking}
                        isPersistentBanner={isPersistentBanner}
                    />
                    {items?.length > 0 && !showSkeleton && (
                        <Flex
                            position='absolute'
                            inset={0}
                        >
                            {items.map((item, index) => {
                                // [ECS-4072] Action with custom label
                                const newItem = item.type === 'Link' ? item.action : item;

                                return (
                                    <FlexAction
                                        key={`banner_link_${newItem.sid}`}
                                        action={newItem}
                                        children={[BannerActionOpacity, BannerActionLabel(item.label, index)]}
                                        flex='1'
                                        position='relative'
                                        sid={newItem.sid || sid}
                                    />
                                );
                            })}
                        </Flex>
                    )}
                    {showSkeleton && <div css={ignoreRecognizedStatus ? SKELETON_OVERLAY : { [RECOGNIZED_CLASS]: SKELETON_OVERLAY }} />}
                </Box>
            )}
        </Flex>
    );
};

BannerFlush.propTypes = {
    sid: PropTypes.string,
    enablePageRenderTracking: PropTypes.bool,
    text: PropTypes.object,
    bannerType: PropTypes.oneOf([
        BANNER_TYPES.DEFAULT,
        BANNER_TYPES.PERSISTENT,
        BANNER_TYPES.NOTIFICATION,
        BANNER_TYPES.PDP,
        BANNER_TYPES.HERO,
        BANNER_TYPES.PDP_SAMPLE
    ]),
    media: PropTypes.object,
    mediaPlacement: PropTypes.oneOf([PLACEMENTS.TOP, PLACEMENTS.RIGHT, PLACEMENTS.BOTTOM, PLACEMENTS.LEFT]),
    largeMedia: PropTypes.object,
    largeMediaPlacement: PropTypes.oneOf([PLACEMENTS.TOP, PLACEMENTS.RIGHT, PLACEMENTS.BOTTOM, PLACEMENTS.LEFT]),
    items: PropTypes.array,
    color: PropTypes.string,
    LinkProps: PropTypes.object,
    TextWrapComp: PropTypes.object,
    FlexAction: PropTypes.object,
    isMultiLink: PropTypes.bool,
    showSkeleton: PropTypes.bool,
    isBannerList: PropTypes.bool,
    mediaSize: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    seoHeader: PropTypes.string,
    isRootComponent: PropTypes.bool,
    ignoreRecognizedStatus: PropTypes.bool,
    styles: PropTypes.object
};

BannerFlush.defaultProps = {
    sid: null,
    enablePageRenderTracking: null,
    text: null,
    media: null,
    mediaPlacement: PLACEMENTS.TOP,
    largeMedia: null,
    largeMediaPlacement: null,
    items: null,
    color: 'base',
    LinkProps: null,
    TextWrapComp: Flex,
    FlexAction: Flex,
    isMultiLink: false,
    showSkeleton: false,
    isBannerList: false,
    mediaSize: null,
    isRootComponent: true,
    ignoreRecognizedStatus: false
};

export default wrapFunctionalComponent(BannerFlush, 'BannerFlush');
