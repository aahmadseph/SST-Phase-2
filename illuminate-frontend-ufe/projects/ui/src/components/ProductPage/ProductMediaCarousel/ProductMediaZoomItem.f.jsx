import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import ProductImage from 'components/Product/ProductImage';
import skuUtils from 'utils/Sku';
import { Flex } from 'components/ui';
import { mediaQueries, radii, colors } from 'style/config';
import analyticsConstants from 'analytics/constants';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import BccVideo from 'components/Bcc/BccVideo/BccVideo';
import { IMAGE_SIZES } from 'components/ProductPage/ProductMediaCarousel/constants';
import { THUMBNAIL_PRODUCT_MEDIA_ITEM } from 'style/imageSizes';

const { MEDIA_TYPE } = analyticsConstants;
const THUMB_SIZE = [44, 52];

const ProductMediaZoomItem = React.forwardRef(
    ({
        isThumbnail, product, mediaItem, mediaItemIndex, selectedItemIndex, onClick, isGalleryItem
    }, ref) => {
        const item = Object.assign({}, mediaItem.media);
        const skuId = product.currentSku?.skuId;
        let listItem,
            renderHeroVideo = false;

        switch (mediaItem.type) {
            case MEDIA_TYPE.VIDEO:
                if (mediaItem.source === 'tiktok') {
                    listItem = (
                        <iframe
                            src={`https://www.tiktok.com/embed/v2/${mediaItem.media?.id}`}
                            style={{
                                minHeight: '98vh',
                                width: '100%',
                                paddingTop: '20px'
                            }}
                        />
                    );
                } else {
                    listItem = (
                        <Flex
                            flexDirection='column'
                            justifyContent='center'
                            width='100%'
                            height='100%'
                            {...(isThumbnail && {
                                borderRadius: 'full',
                                overflow: 'hidden'
                            })}
                        >
                            <BccVideo
                                isContained={false}
                                videoId={item.filePath}
                                name={item.name}
                                ref={ref}
                                startImagePath={item.startImagePath}
                                thumbnailRatio={isThumbnail ? 1 : 9 / 16}
                                thumbnailWidth={isThumbnail ? THUMBNAIL_PRODUCT_MEDIA_ITEM : 612}
                                overlayFlag={!!isThumbnail}
                                isSmallThumb={isThumbnail}
                                isButton={false}
                                hideDescription={true}
                                skuId={skuId}
                            />
                        </Flex>
                    );
                }

                renderHeroVideo = !isThumbnail;

                break;
            default:
                listItem = (
                    <ProductImage
                        altText={isGalleryItem ? item.imageUrl : supplementAltTextWithProduct(product.currentSku, product)}
                        hideBadge={true}
                        width={isThumbnail ? '100%' : null}
                        size={isThumbnail ? THUMBNAIL_PRODUCT_MEDIA_ITEM : [375, 612]}
                        src={skuUtils.getImgSrc(IMAGE_SIZES.ZOOM, item)}
                        disableLazyLoad={true}
                        {...(isThumbnail && {
                            objectFit: 'cover',
                            borderRadius: 'full',
                            overflow: 'hidden'
                        })}
                    />
                );

                break;
        }

        return !listItem ? null : (
            <React.Fragment>
                {renderHeroVideo === true && (
                    <button
                        children={listItem}
                        onClick={onClick}
                    />
                )}
                {renderHeroVideo === false && (
                    <button
                        key={mediaItemIndex.toString()}
                        type='button'
                        css={[
                            isThumbnail && styles.thumbListItem,
                            mediaItemIndex === selectedItemIndex ? styles.thumbListItemActive : styles.thumbListItemInactive
                        ]}
                        onClick={onClick}
                        children={listItem}
                    />
                )}
            </React.Fragment>
        );
    }
);

const styles = {
    thumbListItem: {
        display: 'inline-flex',
        verticalAlign: 'top',
        width: THUMB_SIZE[0],
        height: THUMB_SIZE[0],
        borderRadius: radii.full,
        overflow: 'hidden',
        padding: 2,
        border: '2px solid transparent',
        transition: 'border-color .2s',
        [mediaQueries.sm]: {
            width: THUMB_SIZE[1],
            height: THUMB_SIZE[1]
        }
    },
    thumbListItemActive: {
        borderColor: colors.black
    },
    thumbListItemInactive: {
        '.no-touch &:hover, :focus': {
            borderColor: colors.midGray
        }
    }
};

export default wrapFunctionalComponent(ProductMediaZoomItem, 'ProductMediaZoomItem');
