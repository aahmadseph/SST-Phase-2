import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import { Image } from 'components/ui';

import analyticsConstants from 'analytics/constants';
const { MEDIA_TYPE } = analyticsConstants;

import { breakpoints } from 'style/config';
import skuUtils from 'utils/Sku';

import imageUtils from 'utils/Image';
const { getImageSrc } = imageUtils;

import urlUtils from 'utils/Url';
const { removeParam } = urlUtils;

import EDPImage from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPImage';

import { EDP_IMG_SIZES, SHADOW, THUMB_COUNT } from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/constants';
const {
    SMUI_CAROUSEL_WIDTH, SMUI_CAROUSEL_HEIGHT, LGUI_CAROUSEL_WIDTH, LGUI_CAROUSEL_HEIGHT, THUMBNAIL_MEDIA_ITEM, ZOOM
} = EDP_IMG_SIZES;

import { buildEDPHeroImageSrc } from 'utils/happening';

function MediaItem({
    item,
    index,
    isFullWidth,
    onClick,
    isThumbnail,
    preventPageRenderReport,
    // maskSize,
    enableZoom
}) {
    let includePerfMark;
    const isLazy = isThumbnail ? index >= THUMB_COUNT : isFullWidth ? index > 1 : index > 0;

    switch (item.type) {
        case MEDIA_TYPE.IMAGE: {
            const src = skuUtils.getImgSrc(ZOOM, item.media);
            const thumbSrc = removeParam(src, 'pb');

            includePerfMark = index === 0 && !preventPageRenderReport;

            return (
                <>
                    {isThumbnail ? (
                        <picture css={styles.picture}>
                            <source
                                media={breakpoints.mdMin}
                                srcSet={getImageSrc(thumbSrc, THUMBNAIL_MEDIA_ITEM, true)}
                            />
                            <Image
                                src='/img/ufe/placeholder.png'
                                width={THUMBNAIL_MEDIA_ITEM}
                                height={THUMBNAIL_MEDIA_ITEM}
                                disableLazyLoad={!isLazy}
                                alt={item.altText}
                                overflow='hidden'
                                display={'block'}
                                borderRadius={'full'}
                                css={{ objectFit: 'cover' }}
                            />
                        </picture>
                    ) : isFullWidth ? (
                        <EDPImage
                            src={src}
                            size={SMUI_CAROUSEL_WIDTH}
                            witdh={SMUI_CAROUSEL_WIDTH}
                            height={SMUI_CAROUSEL_HEIGHT}
                            onClick={onClick(index)}
                            isPageRenderImg={includePerfMark}
                            disableLazyLoad={!isLazy}
                            alt={item.altText}
                            borderRadius={2}
                            overflow='hidden'
                            boxShadow={SHADOW}
                            objectFit={'cover'}
                            maxWidth={'100%'}
                        />
                    ) : (
                        <button onClick={onClick(index)}>
                            {getSvgForLargeView({
                                item,
                                isFullWidth,
                                enableZoom,
                                includePerfMark,
                                isLazy
                            })}
                        </button>
                    )}
                </>
            );
        }

        // ToDo - to be worked on when services videos gets activated
        // case MEDIA_TYPE.VIDEO: {
        //     return (
        //         <Flex
        //             flexDirection='column'
        //             justifyContent='center'
        //             borderRadius={isThumbnail ? 'full' : 2}
        //             overflow='hidden'
        //             onClick={!isThumbnail ? () => onClick(index) : null}
        //             boxShadow={isThumbnail || SHADOW}
        //         >
        //             <BccVideo
        //                 isContained={false}
        //                 videoId={item.media.filePath}
        //                 name={item.media.name}
        //                 startImagePath={item.media.startImagePath}
        //                 thumbnailWidth={isThumbnail ? THUMBNAIL_MEDIA_ITEM : isFullWidth ? SMUI_CAROUSEL_WIDTH : maskSize}
        //                 thumbnailRatio={isThumbnail ? 1 : 9 / 16}
        //                 overlayFlag={true}
        //                 isButton={false}
        //                 isSmallThumb={isThumbnail}
        //                 disableLazyLoad={!isLazy}
        //                 hideDescription={true}
        //             />
        //         </Flex>
        //     );
        // }

        default:
            return null;
    }
}

const getSvgForLargeView = ({
    item, isFullWidth, enableZoom, includePerfMark, isLazy
}) => {
    const imageSizes = {
        width: isFullWidth ? SMUI_CAROUSEL_WIDTH : LGUI_CAROUSEL_WIDTH,
        height: isFullWidth ? SMUI_CAROUSEL_HEIGHT : LGUI_CAROUSEL_HEIGHT
    };
    const [imageSource, imageSourceX2] = buildEDPHeroImageSrc(item);
    const onLoadPerfMark = includePerfMark
        ? 'onload=\'' + 'Sephora.Util.Perf.markPageRenderDedup("' + imageSource + '", arguments[0].target.currentSrc || arguments[0].target.src);\''
        : '';
    const inPagePerfMark = '';

    if (includePerfMark) {
        Sephora.Util.Perf.imageExpectedDedup(imageSource);
    }

    // <img> needs to be set with dangerouslySetInnerHTML so that image onload event
    return (
        <svg
            width={imageSizes.width}
            height={imageSizes.height}
            css={{
                display: 'block',
                pointerEvents: 'none'
            }}
            dangerouslySetInnerHTML={{
                __html: `
                    <foreignObject 
                        x="0"
                        y="0" 
                        width="${imageSizes.width}"
                        height="${imageSizes.height}" 
                        style="${enableZoom ? 'mask: url(#heroHoverMediaMask)' : ''}"
                    >
                        <img 
                            alt="${item.media.altText}"
                            width="${imageSizes.width}" 
                            height="${imageSizes.height}" 
                            src="${imageSource}" 
                            srcset="${imageSource} 1x, ${imageSourceX2} 2x"
                            style="object-fit: cover"
                            ${isLazy ? ' loading="lazy" ' : ''}
                            ${onLoadPerfMark}
                        />
                    </foreignObject>
                    ${inPagePerfMark}
                    `
            }}
        />
    );
};

const styles = {
    picture: {
        display: 'block',
        width: '100%',
        height: '100%'
    }
};

export default wrapFunctionalComponent(MediaItem, 'MediaItem');
