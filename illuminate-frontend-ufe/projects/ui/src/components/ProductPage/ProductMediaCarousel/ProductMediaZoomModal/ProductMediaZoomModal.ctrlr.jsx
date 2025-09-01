import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import store from 'Store';
import Actions from 'Actions';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import bccUtils from 'utils/BCC';
import PanZoom from 'components/PanZoom/PanZoom';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import Loader from 'components/Loader/Loader';
import skuUtils from 'utils/Sku';
import {
    space, modal, breakpoints, mediaQueries
} from 'style/config';

import Carousel from 'components/Carousel/Carousel';
import { Box } from 'components/ui';
import BccVideo from 'components/Bcc/BccVideo/BccVideo';
import ProductMediaZoomItem from 'components/ProductPage/ProductMediaCarousel/ProductMediaZoomItem';
import analyticsConstants from 'analytics/constants';
import { DebouncedResize } from 'constants/events';

const {
    COMPONENT_TITLE: { ALT_IMAGE_CAROUSEL },
    MEDIA_TYPE
} = analyticsConstants;
const { IMAGE_SIZES } = bccUtils;
const THUMB_MARGIN = space[1];

const MemoizedFooter = React.memo(({ mediaList, product, selectedItemIndex, getItemsList }) => {
    const thumbnailItemList = getItemsList(true, mediaList, product, selectedItemIndex);

    return thumbnailItemList.length ? (
        <Modal.Footer
            hasBorder={true}
            css={styles.thumbList}
            children={thumbnailItemList}
        />
    ) : null;
});

class ProductMediaZoomModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            selectedItemIndex: this.props.index,
            showZoom: null,
            mediaList: this.props.mediaItems,
            isListLoading: true
        };
        this.mediaListCompsRefs = [];
    }

    carouselRef = React.createRef();

    setMediaCompRef = index => ref => {
        this.mediaListCompsRefs[index] = ref;
    };

    componentDidMount() {
        if (this.carouselRef && !this.state.carouselsReady) {
            if (this.state.selectedItemIndex) {
                this.carouselRef.current.scrollTo(this.state.selectedItemIndex);
            }

            this.setState({
                carouselsReady: true,
                isListLoading: false
            });
        }

        this.updateSelectedItem(this.props.index);
        this.setState({
            showZoom: this.isSmallView()
        });
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    requestClose = () => {
        store.dispatch(Actions.showProductMediaZoomModal(false));
    };

    isSmallView = () => {
        return window.matchMedia(breakpoints.xsMax).matches;
    };

    handleResize = () => {
        const isSmallView = this.isSmallView();
        const { showZoom, mediaList, selectedItemIndex } = this.state;

        if (mediaList[selectedItemIndex].type !== MEDIA_TYPE.VIDEO) {
            if (isSmallView && !showZoom) {
                this.setState({
                    showZoom: true
                });
            } else if (!isSmallView && showZoom) {
                this.setState(
                    {
                        showZoom: false
                    },
                    () => {
                        if (this.carouselRef && this.carouselRef.current) {
                            this.carouselRef.current.scrollTo(selectedItemIndex);
                        }
                    }
                );
            }
        }
    };

    handleScroll = index => {
        const { showZoom } = this.state;

        if (showZoom === false) {
            this.setState({
                selectedItemIndex: index
            });
        }

        if (this.mediaListCompsRefs.length) {
            this.mediaListCompsRefs.map(video => video?.pause());
        }

        if (this.mediaListCompsRefs[index]?.onVideoSelect) {
            this.mediaListCompsRefs[index].onVideoSelect();
        }
    };

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    render() {
        const { isOpen, isGalleryItem, product } = this.props;

        const { selectedItemIndex, showZoom, mediaList } = this.state;

        return (
            <Modal
                width={5}
                isOpen={isOpen}
                noScroll={showZoom}
                onDismiss={this.requestClose}
            >
                <Modal.Header>
                    <Modal.Title numberOfLines={1}>
                        {!isGalleryItem ? `${product.productDetails.brand.displayName} ${product.productDetails.displayName}` : ''}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    paddingX={null}
                    paddingTop={null}
                    paddingBottom={null}
                    overflow='hidden'
                >
                    {showZoom === true ? (
                        <>
                            {mediaList[selectedItemIndex].type === MEDIA_TYPE.VIDEO && mediaList[selectedItemIndex].source !== 'tiktok' && (
                                <BccVideo
                                    key={mediaList[selectedItemIndex].media.filePath}
                                    name={mediaList[selectedItemIndex].media.name}
                                    ref={this.setMediaCompRef(selectedItemIndex)}
                                    isContained={false}
                                    videoId={mediaList[selectedItemIndex].media.filePath}
                                    skuId={product.currentSku?.skuId}
                                />
                            )}
                            {mediaList[selectedItemIndex].type === MEDIA_TYPE.VIDEO && mediaList[selectedItemIndex].source === 'tiktok' && (
                                <iframe
                                    src={`https://www.tiktok.com/embed/v2/${mediaList[selectedItemIndex]?.media?.id}`}
                                    width='100%'
                                    height='100%'
                                    style={{
                                        paddingTop: '10px',
                                        paddingBottom: '10px'
                                    }}
                                />
                            )}
                            {mediaList[selectedItemIndex].type !== MEDIA_TYPE.VIDEO && (
                                <PanZoom
                                    width='100%'
                                    height='100%'
                                    showMsg={true}
                                    showPinchBottom={true}
                                    disableButtons={true}
                                >
                                    <Loader isShown={true} />
                                    <ProductImage
                                        altText={
                                            isGalleryItem
                                                ? mediaList[selectedItemIndex].media.altText
                                                : supplementAltTextWithProduct(product.currentSku, product)
                                        }
                                        disableLazyLoad={true}
                                        hideBadge={true}
                                        src={skuUtils.getImgSrc(IMAGE_SIZES[1500], mediaList[selectedItemIndex].media)}
                                        size={IMAGE_SIZES[1500]}
                                        width='100%'
                                    />
                                </PanZoom>
                            )}
                        </>
                    ) : (
                        <Box
                            width={612}
                            marginX='auto'
                        >
                            <Carousel
                                ref={this.carouselRef}
                                arrowVariant='simple'
                                showArrowOnHover={false}
                                onScroll={index => this.handleScroll(index)}
                                items={this.getItemsList(false, mediaList, product, selectedItemIndex, isGalleryItem)}
                                title={ALT_IMAGE_CAROUSEL}
                                isLoading={this.state.isListLoading}
                            />
                        </Box>
                    )}
                </Modal.Body>
                {isGalleryItem ? (
                    <Modal.Footer hasBorder={true} />
                ) : (
                    <MemoizedFooter
                        mediaList={mediaList}
                        product={product}
                        getItemsList={this.getItemsList}
                        selectedItemIndex={selectedItemIndex}
                    />
                )}
            </Modal>
        );
    }

    updateSelectedItem = itemIndex => {
        this.setState(
            {
                selectedItemIndex: itemIndex,
                showZoom: this.isSmallView()
            },
            () => {
                if (this.state.showZoom) {
                    if (this.mediaListCompsRefs[itemIndex]?.onVideoSelect) {
                        this.mediaListCompsRefs[itemIndex].onVideoSelect();
                    }
                } else if (this.carouselRef && this.carouselRef.current) {
                    this.carouselRef.current.scrollTo(itemIndex);
                }
            }
        );
    };

    getItemsList = (isThumbnail, mediaItems, product, selectedItemIndex, isGalleryItem = false) => {
        return mediaItems.map((mediaItem, mediaItemIndex) => {
            return (
                <ProductMediaZoomItem
                    isThumbnail={isThumbnail}
                    product={product}
                    mediaItem={mediaItem}
                    mediaItemIndex={mediaItemIndex}
                    ref={this.setMediaCompRef(mediaItemIndex)}
                    selectedItemIndex={selectedItemIndex}
                    onClick={() => {
                        this.updateSelectedItem(mediaItemIndex);
                    }}
                    isGalleryItem={isGalleryItem}
                />
            );
        });
    };
}

const styles = {
    thumbList: {
        whiteSpace: 'nowrap',
        overflow: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        textAlign: 'center',
        paddingLeft: modal.paddingX[0] - THUMB_MARGIN,
        paddingRight: modal.paddingX[0] - THUMB_MARGIN,
        [mediaQueries.sm]: {
            paddingLeft: modal.paddingX[1] - THUMB_MARGIN,
            paddingRight: modal.paddingX[1] - THUMB_MARGIN
        }
    }
};

export default wrapComponent(ProductMediaZoomModal, 'ProductMediaZoomModal', true);
