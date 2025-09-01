import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Image } from 'components/ui';
import { breakpoints, mediaQueries } from 'style/config';
import imageUtils from 'utils/Image';
import Video from 'components/Content/Media/Video';
import UI from 'utils/UI';
import UrlUtils from 'utils/Url';
import ExperienceDetailsUtils from 'utils/ExperienceDetails';
import Location from 'utils/Location';

const { getImageSrc } = imageUtils;

const MEDIA_SM = 'sm';

/* eslint-disable-next-line complexity */
const Media = ({
    altText,
    isPageRenderImg,
    height,
    size,
    largeMedia,
    src,
    width,
    disableLazyLoad,
    isContained,
    imageProps,
    videoSource,
    videoThumbnail,
    isPersistentBanner,
    useMediaHeight
}) => {
    if (!src || !width || !height) {
        return null;
    }

    const largeSrc = largeMedia?.src;
    const largeWidth = largeMedia?.width;
    const largeHeight = largeMedia?.height;

    const sizeOrWidth = size?.[0] || size || width;
    const largeSizeOrLargeWidth = size?.[1] || largeWidth;
    const isSvg = src.includes('.svg');
    const isLargeSvg = largeSrc?.includes('.svg');

    const handleImageError = e => {
        const defaultSrc = ExperienceDetailsUtils.EXPERIENCE_DEFAULT_IMAGES[2];
        e.target.onerror = null;
        e.target.src = UrlUtils.getImagePath(defaultSrc);
        e.target.srcset = UI.getSrcSet(defaultSrc);

        // Remove the <source> tag from parent <picture>
        const pictureElement = e.target.parentElement;
        const sourceElement = pictureElement.querySelector('source');

        if (sourceElement) {
            pictureElement.removeChild(sourceElement);
        }
    };

    if (videoSource) {
        return (
            <div
                css={[
                    {
                        width: '100%',
                        [mediaQueries[MEDIA_SM]]: largeSizeOrLargeWidth && {
                            width: largeSizeOrLargeWidth
                        }
                    }
                ]}
            >
                <Video
                    isContained={isContained}
                    videoId={videoSource}
                    startImagePath={videoThumbnail}
                    overlayFlag={!!videoThumbnail}
                />
            </div>
        );
    }

    return (
        <picture
            css={[
                styles.picture,
                {
                    width: sizeOrWidth,
                    [mediaQueries[MEDIA_SM]]: largeSizeOrLargeWidth && {
                        width: largeSizeOrLargeWidth
                    }
                },
                isPersistentBanner && {
                    height: '100%'
                },
                useMediaHeight && {
                    [mediaQueries.smMax]: {
                        height: height
                    },
                    [mediaQueries[MEDIA_SM]]: {
                        height: largeHeight
                    }
                }
            ]}
        >
            <div
                css={{
                    paddingBottom: `${(height / width) * 100}%`,
                    [mediaQueries[MEDIA_SM]]: largeHeight &&
                        largeWidth && {
                        paddingBottom: `${(largeHeight / largeWidth) * 100}%`
                    }
                }}
            />
            {(largeSizeOrLargeWidth || largeSrc) &&
                (isSvg && !largeSrc ? null : (
                    <source
                        media={breakpoints.smMin}
                        src={isLargeSvg ? largeSrc : null}
                        srcSet={isLargeSvg ? null : getImageSrc(largeSrc || src, largeSizeOrLargeWidth || sizeOrWidth, true)}
                    />
                ))}
            <Image
                isPageRenderImg={isPageRenderImg}
                src={isSvg ? src : getImageSrc(src, sizeOrWidth)}
                srcSet={isSvg ? null : getImageSrc(src, sizeOrWidth, true)}
                alt={altText}
                css={[styles.img, { objectFit: isContained ? 'contain' : 'cover' }]}
                disableLazyLoad={disableLazyLoad}
                onError={Location.isExperienceDetailsPage && handleImageError}
                {...imageProps}
            />
        </picture>
    );
};

const styles = {
    picture: {
        display: 'block',
        position: 'relative',
        maxWidth: '100%'
    },
    img: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }
};

Media.propTypes = {
    altText: PropTypes.string,
    disableLazyLoad: PropTypes.bool,
    height: PropTypes.number.isRequired,
    isPageRenderImg: PropTypes.bool,
    // override width properties
    size: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    src: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    largeMedia: PropTypes.shape({
        src: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number
    }),
    isContained: PropTypes.bool,
    imageProps: PropTypes.object,
    isPersistentBanner: PropTypes.bool
};

Media.defaultProps = {
    altText: null,
    disableLazyLoad: null,
    isPageRenderImg: null,
    size: null,
    largeMedia: null,
    isContained: null,
    imageProps: {},
    isPersistentBanner: false
};

export default wrapFunctionalComponent(Media, 'Media');
