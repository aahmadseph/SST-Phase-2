import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import productUtils from 'utils/product';
import { Flex, Image } from 'components/ui';
import { IMAGE_SIZES, SHADOW, THUMB_COUNT } from 'components/ProductPage/ProductMediaCarousel/constants';
import analyticsConstants from 'analytics/constants';
import { breakpoints, radii } from 'style/config';
import { THUMBNAIL_PRODUCT_MEDIA_ITEM } from 'style/imageSizes';
import BccVideo from 'components/Bcc/BccVideo/BccVideo';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import skuUtils from 'utils/Sku';
import imageUtils from 'utils/Image';
import urlUtils from 'utils/Url';

const { MEDIA_TYPE } = analyticsConstants;
const { buildProductHeroImageSrc } = productUtils;
const { removeParam } = urlUtils;
const { getImageSrc } = imageUtils;

const SvgImage = React.memo(({
    imgSize, enableZoom, item, isLazy, imageSource, imageSourceX2, onLoadPerfMark
}) => (
    // <img> needs to be set with dangerouslySetInnerHTML so that image onload event
    // will be triggered for product page render tracking
    // https://jira.sephora.com/browse/UA-604
    <svg
        width={imgSize}
        height={imgSize}
        css={styles.svgWrapper}
        dangerouslySetInnerHTML={{
            __html:
                '<foreignObject x="0" y="0" width="' +
                imgSize +
                '" height="' +
                imgSize +
                '" style="' +
                (enableZoom ? 'mask: url(#heroHoverMediaMask)' : '') +
                '"><img alt="' +
                item.media.altText +
                '" ' +
                'width="' +
                imgSize +
                '" height="' +
                imgSize +
                '" src="' +
                imageSource +
                '" srcset="' +
                imageSource +
                ' 1x, ' +
                imageSourceX2 +
                ' 2x" ' +
                ' style="object-fit: contain" ' +
                (isLazy ? ' loading="lazy" ' : '') +
                onLoadPerfMark +
                '/></foreignObject>'
        }}
    ></svg>
));

function ProductMediaItem({
    item, index, isFullWidth, onClick, isThumbnail, preventPageRenderReport, maskSize, isSingleItem, enableZoom, skuId
}) {
    let includePerfMark;
    const isLazy = isThumbnail ? index >= THUMB_COUNT : isFullWidth ? index > 1 : index > 0;

    switch (item.type) {
        case MEDIA_TYPE.IMAGE: {
            const src = skuUtils.getImgSrc(IMAGE_SIZES.ZOOM, item.media);
            const thumbSrc = removeParam(src, 'pb');

            includePerfMark = index === 0 && !preventPageRenderReport;

            return (
                <>
                    {isThumbnail ? (
                        <picture css={styles.picture}>
                            <source
                                media={breakpoints.mdMin}
                                srcSet={getImageSrc(thumbSrc, THUMBNAIL_PRODUCT_MEDIA_ITEM, true)}
                            />
                            <Image
                                src='/img/ufe/placeholder.png'
                                size={THUMBNAIL_PRODUCT_MEDIA_ITEM}
                                disableLazyLoad={!isLazy}
                                alt={item.altText}
                                borderRadius='full'
                                overflow='hidden'
                                css={styles.img}
                            />
                        </picture>
                    ) : isFullWidth ? (
                        <ProductImage
                            src={src}
                            hideBadge={true}
                            size={IMAGE_SIZES.SMALL}
                            onClick={onClick(index)}
                            disableLazyLoad={!isLazy}
                            altText={item.altText}
                            borderRadius={2}
                            overflow='hidden'
                            isPageRenderImg={includePerfMark}
                            boxShadow={!isSingleItem && SHADOW}
                        />
                    ) : (
                        <button onClick={onClick(index)}>
                            {getSvgForLargeView({
                                item,
                                imgSize: maskSize,
                                enableZoom,
                                includePerfMark,
                                isLazy
                            })}
                        </button>
                    )}
                </>
            );
        }
        case MEDIA_TYPE.VIDEO:
            return (
                <Flex
                    flexDirection='column'
                    justifyContent='center'
                    borderRadius={isThumbnail ? 'full' : 2}
                    overflow='hidden'
                    onClick={!isThumbnail ? onClick(index) : null}
                    boxShadow={isThumbnail || SHADOW}
                >
                    <BccVideo
                        isContained={false}
                        videoId={item.media.filePath}
                        name={item.media.name}
                        startImagePath={item.media.startImagePath}
                        thumbnailWidth={isThumbnail ? THUMBNAIL_PRODUCT_MEDIA_ITEM : isFullWidth ? IMAGE_SIZES.SMALL : maskSize}
                        thumbnailRatio={isThumbnail ? 1 : 9 / 16}
                        overlayFlag={true}
                        isButton={false}
                        isSmallThumb={isThumbnail}
                        disableLazyLoad={!isLazy}
                        hideDescription={true}
                        skuId={skuId}
                    />
                </Flex>
            );

        default:
            return <div></div>;
    }
}

const getSvgForLargeView = ({
    item, imgSize, enableZoom, includePerfMark, isLazy
}) => {
    const [imageSource, imageSourceX2] = buildProductHeroImageSrc(item);
    const onLoadPerfMark = includePerfMark
        ? 'onload=\'' +
          // "console.log('Onload Image Load Triggered'); " +
          'Sephora.Util.Perf.markPageRenderDedup("' +
          imageSource +
          '", arguments[0].target.currentSrc || arguments[0].target.src);\'}'
        : '';

    if (includePerfMark) {
        Sephora.Util.Perf.imageExpectedDedup(imageSource);
    }

    return (
        <SvgImage
            imgSize={imgSize}
            enableZoom={enableZoom}
            item={item}
            isLazy={isLazy}
            imageSource={imageSource}
            imageSourceX2={imageSourceX2}
            onLoadPerfMark={onLoadPerfMark}
        />
    );
};

const styles = {
    picture: {
        display: 'block',
        width: '100%',
        height: '100%'
    },
    svgWrapper: {
        display: 'block',
        pointerEvents: 'none',
        borderRadius: radii[2]
    },
    img: {
        objectFit: 'cover'
    }
};

export default wrapFunctionalComponent(ProductMediaItem, 'ProductMediaItem');
