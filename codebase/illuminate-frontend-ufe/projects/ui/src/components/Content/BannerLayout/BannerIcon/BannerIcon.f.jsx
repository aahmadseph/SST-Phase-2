import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import uiUtils from 'utils/UI';
const RECOGNIZED_CLASS = '.isRecognized &';
import RichText from 'components/Content/RichText';
import { Box, Flex, Text } from 'components/ui';
import Media from 'components/Content/Media';
import PropTypes from 'prop-types';

const { SKELETON_COPY, SKELETON_OVERLAY } = uiUtils;

const PLACEMENTS = {
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
};

function getMediaSize(width, largeWidth) {
    return [width, largeWidth];
}

function getMediaOrder(placement) {
    return placement === PLACEMENTS.LEFT || placement === PLACEMENTS.TOP ? -1 : 0;
}

function isHorizontal(placement) {
    return placement === PLACEMENTS.LEFT || placement === PLACEMENTS.RIGHT;
}

function isRowOrColumn(placement) {
    return isHorizontal(placement) ? 'row' : 'column';
}

const BannerIcon = ({
    sid,
    text,
    media,
    isMultiLink,
    LinkProps,
    showSkeleton,
    items,
    enablePageRenderTracking,
    largeMedia,
    largeMediaPlacement,
    mediaPlacement,
    color,
    TextWrapComp,
    FlexAction,
    seoHeader,
    styles,
    noBackgroundColor,
    customButton,
    customPaddingX = null,
    customPaddingY = null,
    mediaAllignSelf = null
}) => {
    const mediaSize = media?.width ? getMediaSize(media.width, largeMedia?.width) : null;
    const mediaOrder = getMediaOrder(mediaPlacement);
    const rowOrCol = isRowOrColumn(mediaPlacement);
    const hasHeader1 = text?.json?.content.some(e => e.nodeType === 'heading-1');

    return (
        <Flex
            flexDirection={largeMediaPlacement ? [rowOrCol, isRowOrColumn(largeMediaPlacement)] : rowOrCol}
            gap={[3, 4]}
            paddingX={customPaddingX ? customPaddingX : noBackgroundColor ? 0 : [4, 5]}
            paddingY={customPaddingY ? customPaddingY : noBackgroundColor ? 0 : [4, 5]}
        >
            {text && (
                <TextWrapComp
                    {...(isMultiLink && LinkProps)}
                    flexDirection='column'
                    justifyContent='normal'
                    lineHeight='tight'
                    flex={1}
                >
                    {!hasHeader1 && seoHeader && (
                        <Text
                            is='p'
                            className='seo-header'
                        >
                            {seoHeader}
                        </Text>
                    )}
                    <RichText
                        content={text}
                        style={[showSkeleton && { [RECOGNIZED_CLASS]: SKELETON_COPY }, styles.default.copy]}
                        linkColor={color}
                    />
                    {customButton && customButton()}
                </TextWrapComp>
            )}
            {(media || largeMedia) && (
                <Box
                    position='relative'
                    {...(mediaAllignSelf ? { alignSelf: mediaAllignSelf } : {})}
                    order={largeMediaPlacement ? [mediaOrder, getMediaOrder(largeMediaPlacement)] : mediaOrder}
                >
                    <Media
                        {...media}
                        {...largeMedia}
                        largeMedia={largeMedia}
                        size={mediaSize}
                        isPageRenderImg={enablePageRenderTracking}
                        disableLazyLoad={enablePageRenderTracking}
                    />
                    {items?.length > 0 && !showSkeleton && (
                        <Flex
                            position='absolute'
                            inset={0}
                        >
                            {items.map(item => (
                                <FlexAction
                                    key={`banner_link_${item.sid}`}
                                    sid={sid}
                                    action={item}
                                    flex={1}
                                    opacity={0}
                                    backgroundColor='white'
                                    css={{
                                        transition: 'opacity .2s',
                                        '.no-touch &:hover': {
                                            opacity: 0.4
                                        }
                                    }}
                                />
                            ))}
                        </Flex>
                    )}
                    {showSkeleton && <div css={{ [RECOGNIZED_CLASS]: SKELETON_OVERLAY }} />}
                </Box>
            )}
        </Flex>
    );
};

BannerIcon.propTypes = {
    sid: PropTypes.string,
    enablePageRenderTracking: PropTypes.bool,
    text: PropTypes.object,
    media: PropTypes.object,
    largeMedia: PropTypes.object,
    items: PropTypes.array,
    color: PropTypes.string,
    LinkProps: PropTypes.object,
    TextWrapComp: PropTypes.object,
    FlexAction: PropTypes.object,
    isMultiLink: PropTypes.bool,
    showSkeleton: PropTypes.bool,
    mediaSize: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    seoHeader: PropTypes.string,
    customPaddingX: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    customPaddingY: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    mediaAllignSelf: PropTypes.string
};

BannerIcon.defaultProps = {
    sid: null,
    enablePageRenderTracking: null,
    text: null,
    media: null,
    largeMedia: null,
    items: null,
    color: 'base',
    LinkProps: null,
    TextWrapComp: Flex,
    FlexAction: Flex,
    isMultiLink: false,
    showSkeleton: false,
    mediaSize: null,
    customPaddingX: null,
    customPaddingY: null,
    mediaAllignSelf: null
};

export default wrapFunctionalComponent(BannerIcon, 'BannerIcon');
