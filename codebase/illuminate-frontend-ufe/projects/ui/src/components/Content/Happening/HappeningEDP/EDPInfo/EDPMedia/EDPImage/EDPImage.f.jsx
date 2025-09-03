import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import { Box } from 'components/ui';
import HappeningImg from 'components/SharedComponents/HappeningImg';

import { breakpoints } from 'style/config';

import UI from 'utils/UI';

function EDPImage({
    alt, src, size, display, width, height, isPageRenderImg, disableLazyLoad, objectFit, isSingleImage, isThumbnail, ...props
}) {
    return (
        <Box
            width={isThumbnail ? '100%' : [isSingleImage ? '100vw' : width || size, null, width || size]}
            height={!isThumbnail && height}
            {...(isSingleImage && {
                position: ['relative', null, 'inherit'],
                left: ['calc(-50vw + 50%)', null, 'auto']
            })}
            {...props}
        >
            <picture css={isSingleImage ? {} : styles.picture}>
                <source
                    media={breakpoints.mdMin}
                    srcSet={UI.getSrcSet(src)}
                />
                <HappeningImg
                    alt={alt}
                    src={src}
                    srcSet={UI.getSrcSet(src)}
                    display={display}
                    size={size}
                    width={width}
                    height={height}
                    disableLazyLoad={disableLazyLoad}
                    isPageRenderImg={isPageRenderImg}
                    css={[
                        {
                            position: 'absolute',
                            top: 0,
                            left: 0
                        },
                        { objectFit }
                    ]}
                />
            </picture>
        </Box>
    );
}

const styles = {
    picture: {
        position: 'relative',
        display: 'block',
        paddingBottom: '100%'
    }
};

EDPImage.defaultProps = {
    objectFit: 'contain'
};

export default wrapFunctionalComponent(EDPImage, 'EDPImage');
