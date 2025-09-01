import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors, site, space } from 'style/config';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import BccBase from 'components/Bcc/BccBase/BccBase';
import { Box } from 'components/ui';

const BccSlideshow = ({
    isContained,
    children,
    delay,
    enableCarouselCircle,
    disableLazyLoad = false,
    enablePageRenderTracking = false,
    width,
    ...props
}) => {
    const isMobile = Sephora.isMobile();

    const autoStart = props.autoStart ? props.autoStart : null;
    const carouselMaxItems = props.images.length;
    const images = props.images.map((image, index) => {
        image.disableLazyLoad = disableLazyLoad;

        return (
            <BccComponentList
                key={image.imageId}
                items={[image]}
                isContained={false}
                enablePageRenderTracking={enablePageRenderTracking && index === 0}
            />
        );
    });

    if (enableCarouselCircle) {
        images.push(images[0]);
    }

    return (
        <BccBase
            {...props}
            data-lload={props.lazyLoad}
            baseCss={
                isContained && [
                    {
                        marginLeft: -space.container,
                        marginRight: -space.container
                    },
                    !isMobile &&
                        width > site.MIN_WIDTH_FS && {
                        [`@media (min-width: ${site.MIN_WIDTH_FS}px)`]: {
                            width: '100vw',
                            position: 'relative',
                            left: '50%',
                            marginLeft: '-50vw',
                            marginRight: 'auto'
                        }
                    }
                ]
            }
        >
            <Box
                maxWidth='100%'
                marginX='auto'
                style={{ width }}
            >
                <LegacyCarousel
                    isSlideshow={true}
                    autoStart={isMobile ? 1 : autoStart}
                    displayCount={1}
                    isEnableCircle={enableCarouselCircle}
                    totalItems={carouselMaxItems}
                    delay={parseInt(delay)}
                    controlHeight='auto'
                    isCenteredControls={true}
                    // Due to hidden overflow, we need to set a focus style
                    // that is visible inside the slide viewport
                    customStyle={{
                        inner: {
                            '& .BccImage-inner:focus': {
                                '&:after, &:before': {
                                    content: '""',
                                    boxSizing: 'border-box',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 1
                                },
                                '&:before': {
                                    boxShadow: `inset 0 0 0 1px ${colors.white}`
                                },
                                '&:after': {
                                    border: `1px dashed ${colors.black}`
                                }
                            }
                        }
                    }}
                    {...props}
                >
                    {images}
                </LegacyCarousel>
            </Box>
        </BccBase>
    );
};

export default wrapFunctionalComponent(BccSlideshow, 'BccSlideshow');
