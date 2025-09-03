/* eslint-disable object-curly-newline */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import ThumbnailCarousel from 'components/ProductPage/ProductMediaCarousel/ThumbnailCarousel/ThumbnailCarousel';
import ProductMediaItem from 'components/ProductPage/ProductMediaCarousel/ProductMediaItem';
import Carousel from 'components/Carousel/Carousel';
import { mediaQueries, breakpoints, space } from 'style/config';
import { Grid, Box } from 'components/ui';
import store from 'store/Store';
import Actions from 'actions/Actions';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import Loader from 'components/Loader/Loader';
import UI from 'utils/UI';
import { IMAGE_SIZES, SHADOW } from 'components/ProductPage/ProductMediaCarousel/constants';
import analyticsConstants from 'analytics/constants';
import productUtils from 'utils/product';
import skuUtils from 'utils/Sku';
import helpersUtils from 'utils/Helpers';
import PanZoom from 'components/PanZoom/PanZoom';
import { DebouncedResize } from 'constants/events';

const { deferTaskExecution } = helpersUtils;
const { getMediaItems } = productUtils;
const {
    COMPONENT_TITLE: { ALT_IMAGE_CAROUSEL }
} = analyticsConstants;
const SHADOW_OFFSET = space[4];

class ProductMediaCarousel extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isFullWidth: null,
            zoomModalImage: {},
            enableZoom: false,
            imageSize: null
        };

        this.carouselRef = React.createRef();
        this.thumbnailRef = React.createRef();
        this.loopSizeRef = React.createRef();
        this.heroHoverMask = React.createRef();
        this.imageSizeRef = React.createRef();
        this.mediaItems = getMediaItems(this.props.product);
    }

    componentDidMount() {
        this.setState({
            imageSize: this.getImageSize(),
            isFullWidth: this.isSmallView()
        });
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillReceiveProps(newProps) {
        const { sku: prevSku } = this.props;
        const { sku: newSku, product } = newProps;

        if (newSku.skuId !== prevSku.skuId) {
            this.mediaItems = getMediaItems(product);
            const maxValidIndex = this.mediaItems.length - 1;
            const index = this.carouselRef.current?.getCurrentIndex();

            if (index > maxValidIndex) {
                this.carouselRef?.current?.scrollTo(0);
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    launchProductZoomModal = index => () => {
        const { product } = this.props;
        const mediaItems = this.mediaItems;
        deferTaskExecution(() => store.dispatch(Actions.showProductMediaZoomModal(true, product, index, mediaItems)));
    };

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
            const bigY = -((smallY / imgSize) * IMAGE_SIZES.ZOOM - imgSize);
            const bigX = -((smallX / imgSize) * IMAGE_SIZES.ZOOM - imgSize);

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
        return (this.getLoopSize() * this.getImageSize()) / IMAGE_SIZES.ZOOM;
    };

    getImageSize = () => {
        // reduce the image size by 1px, since we increase the width of the grid by 1px
        return this.imageSizeRef.current?.getBoundingClientRect().width - 1;
    };

    getGridMaxWidth = () => {
        // [UA-1955] trick to fix LCP issue on the win Chrome
        return IMAGE_SIZES.LARGE + 1;
    };

    handleOnScroll = index => {
        this.thumbnailRef.current && this.thumbnailRef.current.scrollTo(index);
    };

    handleOnMouseMove = (cor, index) => {
        this.moveZoom(cor, index, this.mediaItems);
    };

    render() {
        const { sku, preventPageRenderReport, product } = this.props;

        const { isFullWidth } = this.state;

        const isSingleItem = this.mediaItems.length === 1;
        const productMediaItems = this.mediaItems.map((item, index) => (
            <ProductMediaItem
                key={`productMediaItem_${sku.skuId}_${index}`}
                maskSize={this.state.imageSize}
                item={item}
                index={index}
                isFullWidth={isFullWidth}
                isSingleItem={isSingleItem}
                preventPageRenderReport={preventPageRenderReport}
                enableZoom={this.state.enableZoom}
                onClick={this.launchProductZoomModal}
                skuId={sku.skuId}
            />
        ));

        return (
            <React.Fragment>
                <Grid
                    alignItems={[null, null, 'flex-start']}
                    justifyContent={[null, null, 'space-between']}
                    gap={[null, null, 6]}
                    columns={[null, null, `minmax(40px, 56px) minmax(360px, ${this.getGridMaxWidth()}px)`]}
                >
                    <div>
                        <div ref={this.imageSizeRef} />
                        {this.state.isFullWidth !== null ? (
                            <Carousel
                                ref={this.carouselRef}
                                shouldCenterItems={true}
                                {...(isFullWidth
                                    ? {
                                        paddingY: SHADOW_OFFSET,
                                        itemWidth: IMAGE_SIZES.SMALL,
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
                                    left: IMAGE_SIZES.SMALL,
                                    transform: 'translateX(-100%)'
                                }}
                                onMouseEnter={this.handleZoom}
                                onMouseLeave={this.handleZoom}
                                onMouseMove={this.handleOnMouseMove}
                                onScroll={this.handleOnScroll}
                                items={productMediaItems}
                                title={ALT_IMAGE_CAROUSEL}
                                sku={sku}
                            />
                        ) : (
                            <ProductImage
                                id={sku.skuId}
                                hideBadge={true}
                                size={[IMAGE_SIZES.SMALL, null, IMAGE_SIZES.LARGE]}
                                width={[IMAGE_SIZES.SMALL, null, '100%']}
                                borderRadius={2}
                                {...(isSingleItem
                                    ? {
                                        marginX: 'auto'
                                    }
                                    : {
                                        marginLeft: [-2, null, 0],
                                        boxShadow: SHADOW
                                    })}
                                isPageRenderImg={true}
                                disableLazyLoad={true}
                            />
                        )}
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
                        {isSingleItem || (
                            <ThumbnailCarousel
                                productId={product.productDetails?.productId}
                                ref={this.thumbnailRef}
                                carouselRef={this.carouselRef}
                                seeAllClick={this.launchProductZoomModal}
                                items={productMediaItems}
                            />
                        )}
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
                    <React.Fragment>
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
                            <Loader isShown={true} />
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
                                    scale={IMAGE_SIZES.ZOOM / this.getLoopSize()}
                                >
                                    {this.state.isZoomLoopOpen && (
                                        <ProductImage
                                            src={skuUtils.getImgSrc(IMAGE_SIZES.ZOOM, this.state.zoomLoopImage)}
                                            hideBadge={true}
                                            size={IMAGE_SIZES.ZOOM}
                                        />
                                    )}
                                </PanZoom>
                            </div>
                        </Box>
                        <div ref={this.heroHoverMask} />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }
}

ProductMediaCarousel.prototype.shouldUpdatePropsOn = ['product.currentSku', 'product.hoveredSku'];

export default wrapComponent(ProductMediaCarousel, 'ProductMediaCarousel', true);
