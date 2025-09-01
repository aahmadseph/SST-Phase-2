import React, { createRef } from 'react';
import { wrapComponent } from 'utils/framework';

import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';

import analyticsConstants from 'analytics/constants';
import BccUtils from 'utils/BCC';

import PanZoom from 'components/PanZoom/PanZoom';
import EDPImage from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPImage';

import skuUtils from 'utils/Sku';
import {
    space, modal, breakpoints, mediaQueries
} from 'style/config';

import Carousel from 'components/Carousel/Carousel';
import { Box } from 'components/ui';

const THUMB_MARGIN = space[1];
const { IMAGE_SIZES } = BccUtils;

import MediaZoomItem from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPMediaCarousel/MediaZoomItem';
import { DebouncedResize } from 'constants/events';

const {
    MEDIA_TYPE,
    COMPONENT_TITLE: { ALT_IMAGE_CAROUSEL }
} = analyticsConstants;

class MediaZoomModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            selectedItemIndex: 0,
            mediaListComps: [],
            showZoom: null,
            mediaList: props.mediaItems,
            isCarouselReady: false,
            isListLoading: true,
            isCarouselLoaded: false
        };

        this.carouselRef = createRef();
    }

    isSmallView = () => {
        return window.matchMedia(breakpoints.xsMax).matches;
    };

    handleResize = () => {
        const isSmallView = this.isSmallView();
        const { showZoom, mediaList, selectedItemIndex } = this.state;

        if (mediaList[selectedItemIndex].type !== MEDIA_TYPE.VIDEO) {
            if (isSmallView && !showZoom) {
                this.setState({ showZoom: true });
            } else if (!isSmallView && showZoom) {
                this.setState({ showZoom: false }, () => {
                    if (this.carouselRef && this.carouselRef.current) {
                        this.carouselRef.current.scrollTo(selectedItemIndex);
                    }
                });
            }
        }
    };

    handleScroll = index => {
        const { mediaListComps, showZoom, isCarouselLoaded } = this.state;

        if (!isCarouselLoaded) {
            this.updateSelectedItem(this.props.index)();
        } else if (showZoom === false) {
            this.setState({ selectedItemIndex: index });

            if (mediaListComps.length) {
                mediaListComps.map(video => video && video.pause());
            }

            if (mediaListComps[index] && mediaListComps[index].onVideoSelect) {
                mediaListComps[index].onVideoSelect();
            }
        }
    };

    updateSelectedItem = itemIndex => () => {
        this.setState(
            {
                selectedItemIndex: itemIndex,
                showZoom: this.isSmallView(),
                isCarouselLoaded: true
            },
            () => {
                if (this.state.showZoom) {
                    if (this.state.mediaListComps[itemIndex] && this.state.mediaListComps[itemIndex].onVideoSelect) {
                        this.state.mediaListComps[itemIndex].onVideoSelect();
                    }
                } else if (this.carouselRef && this.carouselRef.current) {
                    this.carouselRef.current.scrollTo(itemIndex);
                }
            }
        );
    };

    getItemsList = (isThumbnail, mediaItems) => {
        return mediaItems.map((mediaItem, mediaItemIndex) => {
            return (
                <MediaZoomItem
                    key={`thumb-${mediaItemIndex}`}
                    isThumbnail={isThumbnail}
                    mediaItem={mediaItem}
                    mediaItemIndex={mediaItemIndex}
                    selectedItemIndex={this.state.selectedItemIndex}
                    onClick={this.updateSelectedItem(mediaItemIndex)}
                />
            );
        });
    };

    componentDidMount() {
        if (this.carouselRef && !this.state.isCarouselReady) {
            this.setState({
                isCarouselReady: true,
                isListLoading: false
            });
        }

        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    render() {
        const { isOpen, edpInfo } = this.props;
        const { selectedItemIndex, showZoom, mediaList } = this.state;
        const thumbnailItemList = this.getItemsList(true, mediaList);

        return (
            <Modal
                width={5}
                isOpen={isOpen}
                noScroll={showZoom}
                onDismiss={this.props.onDismiss}
            >
                <Modal.Header>
                    <Modal.Title numberOfLines={1}>{edpInfo.displayName}</Modal.Title>
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
                            {/* ToDo - to be worked on when services videos gets activated */}
                            {/* {mediaList[selectedItemIndex].type === MEDIA_TYPE.VIDEO && mediaList[selectedItemIndex].source !== 'tiktok' && (
                                <BccVideo
                                    key={mediaList[selectedItemIndex].media.filePath}
                                    name={mediaList[selectedItemIndex].media.name}
                                    ref={ref => (this.state.mediaListComps[selectedItemIndex] = ref)}
                                    isContained={false}
                                    videoId={mediaList[selectedItemIndex].media.filePath}
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
                            )} */}
                            {mediaList[selectedItemIndex].type !== MEDIA_TYPE.VIDEO && (
                                <PanZoom
                                    width='100%'
                                    height='100%'
                                    showMsg={true}
                                    showPinchBottom={true}
                                    disableButtons={true}
                                >
                                    {/* <Loader isShown={true} /> */}
                                    <EDPImage
                                        alt={mediaList[selectedItemIndex].media.altText}
                                        src={skuUtils.getImgSrc(IMAGE_SIZES[1500], mediaList[selectedItemIndex].media)}
                                        size={IMAGE_SIZES[1500]}
                                        width='100%'
                                        disableLazyLoad={true}
                                    />
                                </PanZoom>
                            )}
                        </>
                    ) : (
                        <Box
                            width={624}
                            marginX='auto'
                        >
                            <Carousel
                                ref={this.carouselRef}
                                arrowVariant='simple'
                                showArrowOnHover={false}
                                onScroll={index => this.handleScroll(index)}
                                items={this.getItemsList(false, mediaList)}
                                title={ALT_IMAGE_CAROUSEL}
                                isLoading={this.state.isListLoading}
                            />
                        </Box>
                    )}
                </Modal.Body>
                {thumbnailItemList && (
                    <Modal.Footer
                        hasBorder={true}
                        css={styles.thumbList}
                        children={thumbnailItemList}
                    />
                )}
            </Modal>
        );
    }
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

export default wrapComponent(MediaZoomModal, 'MediaZoomModal', true);
