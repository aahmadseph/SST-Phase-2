import React from 'react';

import EDPImage from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPImage';
import { EDP_IMG_SIZES } from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/constants';

import { mediaQueries, radii, colors } from 'style/config';

import { wrapFunctionalComponent } from 'utils/framework';
import skuUtils from 'utils/Sku';

const THUMB_SIZE = [44, 52];
const { THUMBNAIL_MEDIA_ITEM, ZOOM } = EDP_IMG_SIZES;

const MediaZoomItem = ({
    isThumbnail, mediaItem, mediaItemIndex, selectedItemIndex, onClick
}) => {
    const item = mediaItem.media;

    return (
        <button
            key={mediaItemIndex.toString()}
            type='button'
            css={[
                isThumbnail && styles.thumbListItem,
                mediaItemIndex === selectedItemIndex ? styles.thumbListItemActive : styles.thumbListItemInactive
            ]}
            onClick={onClick}
        >
            <EDPImage
                alt={item.altText}
                width={isThumbnail ? THUMBNAIL_MEDIA_ITEM : [375, null, 624]}
                height={isThumbnail ? THUMBNAIL_MEDIA_ITEM : [250, null, 416]}
                src={skuUtils.getImgSrc(ZOOM, item)}
                disableLazyLoad={true}
                display={'block'}
                isThumbnail={isThumbnail}
                {...(isThumbnail && {
                    objectFit: 'cover',
                    borderRadius: 'full',
                    overflow: 'hidden'
                })}
            />
        </button>
    );
};

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

export default wrapFunctionalComponent(MediaZoomItem, 'MediaZoomItem');
