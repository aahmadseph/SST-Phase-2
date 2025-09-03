import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Flex, Text, Link } from 'components/ui';
import Carousel from 'components/Carousel';
import pixleeUtils from 'utils/pixlee';
import GalleryCard from 'components/Community/GalleryCard';

const { getApprovedContentFromAlbum } = pixleeUtils;

class TrendingSection extends BaseClass {
    state = {
        dataFromAlbum: [],
        showSkeleton: true,
        openPixleeUploader: false
    };

    componentDidMount() {
        this.getPhotosFromAlbum();
    }

    getPhotosFromAlbum = () => {
        const options = {
            page: 1,
            photosPerPage: 30
        };

        getApprovedContentFromAlbum(Sephora.configurationSettings.curatedGalleryAlbumId, options)
            .then(data => {
                this.props.setCarouselGallery(data.data);
                this.setState(() => ({
                    dataFromAlbum: data.data,
                    showSkeleton: false
                }));
            })
            .catch(() => {
                this.props.setCarouselGallery([]);
                this.setState(() => ({
                    dataFromAlbum: [],
                    showSkeleton: false
                }));
            });
    };

    render() {
        const galleryItems = this.state.showSkeleton ? new Array(4).fill(undefined) : this.props.galleryItems;
        const carouselGalleryCards = galleryItems?.map((card, index) => (
            <GalleryCard
                showSkeleton={this.state.showSkeleton}
                inCarousel={true}
                index={index}
                {...card}
            />
        ));

        const {
            localization: { trending, uploadPhotoOrVideo1, uploadPhotoOrVideo2 }
        } = this.props;

        return (
            <Flex
                width='100%'
                flexDirection='column'
                paddingY='20px'
                overflow='hidden'
                data-at={Sephora.debug.dataAt('trending_section')}
            >
                <Flex
                    justifyContent='space-between'
                    paddingX={2}
                    paddingBottom={4}
                    alignItems='center'
                >
                    <Flex
                        flexBasis='50%'
                        alignItems='center'
                    >
                        <Text
                            is='h2'
                            fontWeight='bold'
                            fontSize='md'
                            lineHeight='20px'
                        >
                            {trending}
                        </Text>
                    </Flex>
                </Flex>
                <Carousel
                    isLoading={this.state.showSkeleton}
                    marginX='-container'
                    scrollPadding={[2, 'container']}
                    paddingBottom={4}
                    items={carouselGalleryCards}
                    itemWidth='315px'
                    gap='8px'
                />

                <Text
                    is='p'
                    padding={2}
                    fontSize='12px'
                >
                    <Link
                        onClick={this.props.togglePixleeUploader}
                        color='blue'
                    >
                        {uploadPhotoOrVideo1}
                    </Link>{' '}
                    {uploadPhotoOrVideo2}
                </Text>
            </Flex>
        );
    }
}

export default wrapComponent(TrendingSection, 'TrendingSection', true);
