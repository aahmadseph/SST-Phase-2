import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import ProductImage from 'components/Product/ProductImage';
import { mediaQueries } from 'style/config';

const GalleryLightBoxContent = ({ item, onClick }) => {
    let listItem;

    const posterUrl = item.content_type === 'video' && item.video_settings?.thumbnail_url ? item.video_settings?.thumbnail_url : item.thumbnail_url;

    if (item.content_type === 'video' && item.source !== 'tiktok') {
        listItem = (
            <div css={styles.video}>
                <video
                    className='video-container'
                    id={item.album_photo_id}
                    poster={posterUrl}
                    controls
                >
                    <source
                        src={item.source_url}
                        type='video/mp4'
                    />
                </video>
            </div>
        );
    } else {
        const imageSrc = item.source === 'tiktok' ? posterUrl : item.pixlee_cdn_photos.original_url;
        listItem = (
            <ProductImage
                hideBadge={true}
                width={null}
                size={['100vw', 370]}
                src={imageSrc}
                disableLazyLoad={true}
                isPlayIconPresent={item.content_type === 'video' && item.source === 'tiktok'}
            />
        );
    }

    return (
        <>
            <button
                key={item.id?.toString()}
                type='button'
                children={listItem}
                onClick={item.content_type === 'video' && item.source !== 'tiktok' ? null : onClick}
            />
        </>
    );
};

const styles = {
    video: {
        width: '100vw',
        height: '100%',
        position: 'relative',
        paddingBottom: '100%',
        '.video-container': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'black'
        },
        [mediaQueries.lg]: {
            width: '370px',
            '.video-container': {
                height: 'inherit',
                width: 'inherit'
            }
        }
    }
};

export default wrapFunctionalComponent(GalleryLightBoxContent, 'GalleryLightBoxContent');
