import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Image } from 'components/ui';
import { breakpoints } from 'style/config';
import productUtils from 'utils/product';
import imageUtils from 'utils/Image';
import mediaUtils from 'utils/Media';
import UI from 'utils/UI';
import UrlUtils from 'utils/Url';

const { buildProductImageSrc } = productUtils;
const { getImageSrc } = imageUtils;
const { isMobileView } = mediaUtils;

function ProductImage(fullProps) {
    const {
        id,
        src,
        width,
        size,
        skuImages,
        badge,
        hideBadge,
        disableLazyLoad,
        isPageRenderImg,
        altText,
        objectFit,
        isPlayIconPresent = false,
        increaseImageSizeGrid = false,
        showPlaceholderOnError = false,
        ariaHidden = false,
        ...props
    } = fullProps;

    const [imageSrc, sizes] = buildProductImageSrc({
        skuImages,
        src,
        badge,
        hideBadge,
        id,
        size
    });

    const handleImageError = e => {
        const defaultSrc = '/img/ufe/image-error.svg';
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

    return (
        <Box
            width={increaseImageSizeGrid && isMobileView() ? undefined : width || size}
            {...props}
        >
            <picture css={styles.picture}>
                {sizes &&
                    sizes
                        .map((sourceSize, i) =>
                            !sourceSize ? null : (
                                <source
                                    key={`sources-${i}`}
                                    media={`(min-width: ${breakpoints[i]})`}
                                    srcSet={getImageSrc(imageSrc, sourceSize, true)}
                                />
                            )
                        )
                        .reverse()}
                <Image
                    src={getImageSrc(imageSrc, sizes ? size[0] : size, false)}
                    srcSet={getImageSrc(imageSrc, sizes ? size[0] : size, true)}
                    disableLazyLoad={disableLazyLoad}
                    size='100%'
                    isPageRenderImg={isPageRenderImg}
                    pageRenderImageIdentifier={getImageSrc(imageSrc, sizes ? size[size.length - 1] : size, false)}
                    alt={altText}
                    css={[styles.img, { objectFit }]}
                    onError={showPlaceholderOnError ? handleImageError : undefined}
                    aria-hidden={ariaHidden}
                />
                {isPlayIconPresent && (
                    <div
                        css={[styles.playIcon, !isPlayIconPresent && { visibility: 'hidden' }]}
                        tabIndex={0}
                        role='button'
                    >
                        <Image
                            src='/img/ufe/icons/play.svg'
                            color='white'
                            size={32}
                        />
                    </div>
                )}
            </picture>
        </Box>
    );
}

const styles = {
    picture: {
        position: 'relative',
        display: 'block',
        paddingBottom: '100%'
    },
    img: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    playIcon: {
        position: 'absolute',
        left: '46%',
        top: '46%'
    }
};

ProductImage.shouldUpdatePropsOn = ['id', 'src', 'size', 'increaseImageSizeGrid'];

ProductImage.propTypes = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.array]).isRequired,
    objectFit: PropTypes.oneOf(['contain', 'cover']),
    increaseImageSizeGrid: PropTypes.bool
};

ProductImage.defaultProps = {
    maxWidth: '100%',
    disableLazyLoad: false,
    objectFit: 'contain'
};

export default wrapFunctionalComponent(ProductImage, 'ProductImage');
