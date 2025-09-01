/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import { Flex } from 'components/ui';
import { mediaQueries } from 'style/config';
import GalleryLightBoxCarousel from 'components/Community/GalleryLightBoxCarousel';
import GalleryLightBoxData from 'components/Community/GalleryLightBoxData';
import GalleryLightBoxContent from 'components/Community/GalleryLightBoxContent/GalleryLightBoxContent';

class GalleryLightBoxModal extends BaseClass {
    componentDidMount() {
        this.sampleRef.current?.scrollTo(this.props.activeItem);
    }
    sampleRef = React.createRef();

    openZoomModal = item => {
        const mediaItems = [
            {
                type: item.content_type?.toUpperCase(),
                source: item?.source,
                media: {
                    altText: item.alt_text,
                    imageUrl: item.pixlee_cdn_photos.original_url || item.thumbnail_url,
                    id: item.media_id
                }
            }
        ];
        this.props.showItemZoomModal(mediaItems);
    };

    handleDismiss = () => {
        const { toggleGalleryLightBox } = this.props;
        toggleGalleryLightBox({ display: false });
    };

    openZoomModal = () => {
        const { sharedItem } = this.props;
        this.openZoomModal(sharedItem);
    };

    render() {
        const {
            isOpen, activeGallery, activeIndex, isGalleryCarousel, sharedItem
        } = this.props;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.handleDismiss}
                width={5}
                showDismiss={true}
                isGalleryLightBox={true}
            >
                <Modal.Header isGalleryLightBox={true}>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body css={styles.modalBody}>
                    <Flex css={styles.lightBox}>
                        {this.props.sharedItem ? (
                            <div
                                css={{ flexBasis: '40%', marginLeft: 'auto', marginRight: 'auto' }}
                                width='100%'
                            >
                                <GalleryLightBoxContent
                                    item={sharedItem}
                                    onClick={this.openZoomModal}
                                />
                            </div>
                        ) : (
                            <GalleryLightBoxCarousel
                                ref={this.sampleRef}
                                items={activeGallery}
                                activeItem={activeIndex}
                                sharedItem={sharedItem}
                            />
                        )}

                        <GalleryLightBoxData
                            items={activeGallery}
                            activeItem={activeIndex}
                            isGalleryCarousel={isGalleryCarousel}
                            sharedItem={sharedItem}
                        />
                    </Flex>
                </Modal.Body>
            </Modal>
        );
    }
}

const styles = {
    lightBox: {
        flexDirection: 'column',
        [mediaQueries.sm]: {
            flexDirection: 'row'
        }
    },
    modalBody: {
        paddingLeft: '0',
        paddingRight: '0'
    }
};

export default wrapComponent(GalleryLightBoxModal, 'GalleryLightBoxModal', true);
