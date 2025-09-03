import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import GalleryLightBoxContent from 'components/Community/GalleryLightBoxContent/GalleryLightBoxContent';
import Carousel from 'components/Carousel/Carousel';
import { Box } from 'components/ui';
import galleryUtils from 'utils/Gallery';

const { videoEventListener } = galleryUtils;
class GalleryLightBoxCarousel extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isCarouselLoading: true,
            selectedIndex: 0
        };
    }

    carouselRef = React.createRef();

    componentDidMount() {
        if (this.carouselRef && this.props.activeItem >= 0) {
            this.carouselRef.current.scrollTo(this.props.activeItem);
            this.setState(
                {
                    isCarouselLoading: false
                },
                () => {
                    this.updateSelectedItem(this.props.activeItem, true)();
                }
            );
        }
    }

    updateSelectedItem =
        (itemIndex, isFromCards = false) =>
            () => {
                if (this.carouselRef && this.carouselRef.current) {
                    this.carouselRef.current.scrollTo(itemIndex);

                    if (!isFromCards) {
                        const clickedItem = this.props.items[itemIndex];
                        const mediaItems = [
                            {
                                type: clickedItem.content_type?.toUpperCase(),
                                source: clickedItem?.source,
                                media: {
                                    altText: clickedItem.alt_text,
                                    imageUrl: clickedItem.pixlee_cdn_photos.original_url || clickedItem.thumbnail_url,
                                    id: clickedItem.media_id
                                }
                            }
                        ];
                        this.props.showItemZoomModal(mediaItems);
                    }
                }
            };

    getItemsList = items => {
        return items.map((item, index) => {
            return (
                <GalleryLightBoxContent
                    item={item}
                    onClick={this.updateSelectedItem(index)}
                />
            );
        });
    };

    scrollTo = index => {
        this.carouselRef.current.scrollTo(index);
        this.setState({
            isCarouselLoading: false
        });
    };

    handleScroll = (index, isArrowClickFromGallery = false) => {
        const videos = document.getElementsByClassName('video-container');

        this.props.ugcNext();

        if (videos && videos.length > 0) {
            Array.from(videos).forEach(video => video.pause());
        }

        if (!isNaN(index) && (index === this.props.activeItem || isArrowClickFromGallery)) {
            const activeItem = this.props.items?.[index];
            videoEventListener(activeItem);
            this.setState({
                selectedIndex: index
            });
            this.props.setActiveGalleryItemIndex(index);
        }
    };

    render() {
        const { items } = this.props;

        return (
            <Box
                marginX='auto'
                css={{ flexBasis: '40%' }}
                width='100%'
            >
                <Carousel
                    ref={this.carouselRef}
                    arrowVariant='circle'
                    showArrowOnHover={true}
                    onScroll={(index, isArrowClickFromGallery) => this.handleScroll(index, isArrowClickFromGallery)}
                    items={this.getItemsList(items)}
                    isLoading={this.state.isCarouselLoading}
                    isGalleryCarousel={true}
                />
            </Box>
        );
    }
}

export default wrapComponent(GalleryLightBoxCarousel, 'GalleryLightBoxCarousel', true);
