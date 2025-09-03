/* eslint-disable object-curly-newline */

import React, { createRef, Fragment } from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;

import BaseClass from 'components/BaseClass';
import ThumbnailCarousel from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPMediaCarousel/ThumbnailCarousel';
import MediaItem from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPMediaCarousel/MediaItem';
import Carousel from 'components/Carousel/Carousel';

import { mediaQueries, breakpoints, space } from 'style/config';
import { Grid, Box } from 'components/ui';

// import Loader from 'components/Loader/Loader';
import UI from 'utils/UI';

import analyticsConstants from 'analytics/constants';
const {
    COMPONENT_TITLE: { ALT_IMAGE_CAROUSEL }
} = analyticsConstants;

import skuUtils from 'utils/Sku';
import PanZoom from 'components/PanZoom/PanZoom';

import EDPImage from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPImage';
import MediaZoomModal from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPMediaCarousel/MediaZoomModal';

import { EDP_IMG_SIZES } from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/constants';
const { SMUI_CAROUSEL_WIDTH, LGUI_CAROUSEL_WIDTH, ZOOM } = EDP_IMG_SIZES;

import { getMediaItems } from 'utils/happening';
import { DebouncedResize } from 'constants/events';

const SHADOW_OFFSET = space[4];

class EDPMediaCarousel extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isFullWidth: null,
            enableZoom: false,
            imageSize: null,
            imgSizes: null,
            isOpen: false,
            zoomModalImage: {
                edpInfo: {},
                index: null,
                mediaItems: []
            }
        };

        this.carouselRef = createRef();
        this.thumbnailRef = createRef();
        this.loopSizeRef = createRef();
        this.heroHoverMask = createRef();
        this.imageSizeRef = createRef();
        this.imgContainer = createRef();
        this.mediaItems = getMediaItems(this.props.edpInfo);
    }

    openMediaZoomModal = index => () => {
        const { edpInfo } = this.props;

        this.setState({
            isOpen: true,
            zoomModalImage: {
                edpInfo,
                index,
                mediaItems: this.mediaItems
            }
        });
    };

    setIsOpen = () => this.setState(prevState => ({ isOpen: !prevState.isOpen }));

    isSmallView = () => {
        return window.matchMedia(breakpoints.smMax).matches;
    };

    handleResize = () => {
        const { isFullWidth } = this.state;
        const isSmallView = this.isSmallView();

        if (isSmallView && !isFullWidth) {
            this.setState({
                isFullWidth: true
            });
        } else if (!isSmallView && isFullWidth) {
            this.setState({
                isFullWidth: false
            });
        }

        if (!isSmallView) {
            this.setState({
                imageSize: this.getImageSize()
            });
        }
    };

    handleZoom = (enableZoom, event) => {
        const { isFullWidth } = this.state;
        const zoomStateHasChanged = this.state.enableZoom !== enableZoom;

        if (!isFullWidth && zoomStateHasChanged) {
            const simulateMouseMoveEvent = !this.state.enableZoom && enableZoom;

            // After showing zoomed image we need to perform initial rendering
            // by raising Carousel's component onMouseMove event.
            // Otherwise it can lead to different bugs if onMouseMove event is
            // not fired and this.moveZoom(...) function not invoked.
            if (simulateMouseMoveEvent) {
                this.carouselRef.current?.mouseMove(event);
            }

            this.setState({ enableZoom });
        }
    };

    moveZoom = (coordinates, index, mediaItems) => {
        const { isFullWidth } = this.state;

        if (!isFullWidth) {
            const { type, media } = mediaItems[index] || {};

            if (type === 'IMAGE') {
                this.setState({
                    isZoomLoopOpen: true,
                    zoomLoopImage: media
                });
                this.renderSvgHeroImageMask(coordinates);
            }
        }
    };

    renderSvgHeroImageMask = coordinates => {
        const loopThumbSize = this.getLoopThumbSize();
        const imageSize = this.getImageSize();
        const minCoord = loopThumbSize / 2;
        const maxCoord = imageSize - loopThumbSize / 2;
        let { x, y } = coordinates;
        x = x < minCoord ? minCoord : x > maxCoord ? maxCoord : x;
        y = y < minCoord ? minCoord : y > maxCoord ? maxCoord : y;

        const svgMarkup = `<svg style='position: absolute'>
            <defs>
                <mask id='heroHoverMediaMask'>
                    <rect
                        x='0' y='0'
                        width=${this.state.imageSize}
                        height=${this.state.imageSize}
                        fill='#4d4d4d' />
                    <rect
                        x=${x - loopThumbSize / 2}
                        y=${y - loopThumbSize / 2}
                        width=${loopThumbSize}
                        height=${loopThumbSize}
                        fill='white' stroke='black' />
                </mask>
            </defs>
        </svg>`;
        UI.requestFrame(() => {
            if (this.heroHoverMask && this.heroHoverMask.current) {
                this.heroHoverMask.current.innerHTML = svgMarkup;
            }

            if (this.heroHoverZoom) {
                this.heroHoverZoom.updateCoords(this.getLoopCoords(x, y));
            }
        });
    };

    getLoopCoords = (x, y) => {
        if (this.state.isZoomLoopOpen) {
            const imgSize = this.state.imageSize;
            const loopThumbSize = this.getLoopThumbSize();
            const smallX = x - loopThumbSize / 2;
            const smallY = y - loopThumbSize / 2;
            const bigY = -((smallY / imgSize) * ZOOM - imgSize);
            const bigX = -((smallX / imgSize) * ZOOM - imgSize);

            return {
                x: bigX,
                y: bigY
            };
        }

        return {
            x: 0,
            y: 0
        };
    };

    getLoopSize = () => {
        return this.loopSizeRef.current.offsetWidth;
    };

    getLoopThumbSize = () => {
        return (this.getLoopSize() * this.getImageSize()) / ZOOM;
    };

    getImageSize = () => {
        return this.imageSizeRef.current.offsetWidth;
    };

    componentDidMount() {
        this.setState({
            imageSize: this.getImageSize(),
            imgSizes: this.getImageSize(),
            isFullWidth: this.isSmallView()
        });

        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillReceiveProps(newProps) {
        const { edpInfo: prevEdpInfo } = this.props;
        const { edpInfo } = newProps;

        if (edpInfo.activityId !== prevEdpInfo.activityId) {
            this.mediaItems = getMediaItems(edpInfo);
            this.carouselRef.current.initialize();
        }
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    render() {
        const { preventPageRenderReport, edpInfo } = this.props;

        const { isFullWidth } = this.state;

        const edpMediaItems = this.mediaItems.map((item, index) => (
            <MediaItem
                key={`mediaItem_${edpInfo.activityId}_${index}`}
                maskSize={this.state.imageSize}
                item={item}
                index={index}
                isFullWidth={isFullWidth}
                preventPageRenderReport={preventPageRenderReport}
                enableZoom={this.state.enableZoom}
                onClick={this.openMediaZoomModal}
            />
        ));

        return (
            <Fragment>
                <Grid
                    alignItems={[null, null, 'flex-start']}
                    justifyContent={[null, null, 'space-between']}
                    gap={[null, null, 5]}
                    columns={[null, null, `minmax(40px, 56px) minmax(360px, ${LGUI_CAROUSEL_WIDTH}px)`]}
                >
                    <div>
                        <div ref={this.imageSizeRef} />
                        {this.state.isFullWidth != null ? (
                            <Carousel
                                ref={this.carouselRef}
                                shouldCenterItems={true}
                                {...(isFullWidth
                                    ? {
                                        paddingY: SHADOW_OFFSET,
                                        itemWidth: SMUI_CAROUSEL_WIDTH,
                                        gap: 2,
                                        marginX: '-container',
                                        scrollPadding: 2
                                    }
                                    : {
                                        arrowVariant: 'simple',
                                        showArrowOnHover: false
                                    })}
                                dotsShown={isFullWidth ? 5 : null}
                                dotsStyle={{
                                    top: SHADOW_OFFSET + space[2],
                                    left: SMUI_CAROUSEL_WIDTH,
                                    transform: 'translateX(-100%)'
                                }}
                                onMouseEnter={this.handleZoom}
                                onMouseLeave={this.handleZoom}
                                onMouseMove={(cor, index) => this.moveZoom(cor, index, this.mediaItems)}
                                onScroll={index => this.thumbnailRef.current && this.thumbnailRef.current.scrollTo(index)}
                                items={edpMediaItems}
                                title={ALT_IMAGE_CAROUSEL}
                            />
                        ) : null}
                    </div>
                    <div
                        css={{
                            display: 'none',
                            [mediaQueries.md]: {
                                display: 'block',
                                order: -1
                            }
                        }}
                    >
                        <ThumbnailCarousel
                            activityId={edpInfo.activityId}
                            ref={this.thumbnailRef}
                            carouselRef={this.carouselRef}
                            seeAllClick={this.openMediaZoomModal}
                            items={edpMediaItems}
                        />
                    </div>
                </Grid>
                <div
                    ref={this.loopSizeRef}
                    style={{
                        position: 'absolute',
                        width: '50%'
                    }}
                />
                {this.state.enableZoom && (
                    <Fragment>
                        <Box
                            backgroundColor='white'
                            position='absolute'
                            zIndex='modal'
                            right={0}
                            top={-7}
                            width='50%'
                            overflow='hidden'
                            boxShadow='medium'
                        >
                            <div css={{ paddingBottom: '100%' }} />
                            {/* <Loader isShown={true} /> */}
                            <div
                                css={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%'
                                }}
                            >
                                <PanZoom
                                    ref={heroHoverZoom => (this.heroHoverZoom = heroHoverZoom)}
                                    width='100%'
                                    height='100%'
                                    disableButtons={true}
                                    scale={ZOOM / this.getLoopSize()}
                                >
                                    {this.state.isZoomLoopOpen && (
                                        <EDPImage
                                            src={skuUtils.getImgSrc(ZOOM, this.state.zoomLoopImage)}
                                            size={ZOOM}
                                            width={ZOOM}
                                            objectFit={'cover'}
                                            display={'block'}
                                        />
                                    )}
                                </PanZoom>
                            </div>
                        </Box>
                        <div ref={this.heroHoverMask} />
                    </Fragment>
                )}
                {/* ToDo - to be worked on when services videos gets activated */}
                {/* {edpInfo.videoSeoJsonLd && (
                    <script
                        type='application/ld+json'
                        dangerouslySetInnerHTML={{
                            __html: edpInfo.videoSeoJsonLd
                        }}
                    />
                )} */}
                {this.state.isOpen && (
                    <MediaZoomModal
                        isOpen={this.state.isOpen}
                        onDismiss={this.setIsOpen}
                        {...this.state.zoomModalImage}
                    />
                )}
            </Fragment>
        );
    }
}

export default wrapComponent(EDPMediaCarousel, 'EDPMediaCarousel', true);
