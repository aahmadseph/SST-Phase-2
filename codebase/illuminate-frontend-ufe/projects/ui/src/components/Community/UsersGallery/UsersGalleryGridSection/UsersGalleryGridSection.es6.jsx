/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { Flex, Text, Link } from 'components/ui';

import GalleryGridMasonry from 'components/Community/GalleryGridMasonry';
import NoPosts from 'components/Community/UsersGallery/NoPosts';
import PixleeUploader from 'components/Community/PixleeUploader';
import pixleeUtils from 'utils/pixlee';
import uiUtils from 'utils/UI';

const { checkUserBeforeActions } = pixleeUtils;
const { SKELETON_TEXT } = uiUtils;

class UsersGalleryGridSection extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            openPixleeUploader: false
        };
    }

    handleUploadToGallery = () => {
        checkUserBeforeActions().then(() => {
            this.setState({
                openPixleeUploader: true
            });
        });
    };

    removePixleeContainer = () => {
        this.setState({
            openPixleeUploader: false
        });
    };

    render() {
        const {
            locale, isUserPublicGallery, galleryItems, showSkeleton, showMoreButton, loadMorePhotos, user
        } = this.props;
        const hasItems = galleryItems?.length > 0;

        return (
            <Flex
                flexDirection='column'
                justifyContent='flex-start'
                alignItems='flex-start'
                width='100%'
            >
                <Flex
                    paddingX={2}
                    justifyContent='space-between'
                    alignItems='center'
                    py={5}
                    width='100%'
                >
                    <Text
                        is='h3'
                        fontWeight='bold'
                        fontSize={['md', 'lg']}
                        lineHeight={['normal', 'tight']}
                        css={showSkeleton && SKELETON_TEXT}
                    >
                        {isUserPublicGallery ? `${user.nickName}'s ${locale.photosVideos}` : locale.gridTitle}
                    </Text>

                    {!isUserPublicGallery && (
                        <Link
                            color='blue'
                            onClick={this.handleUploadToGallery}
                        >
                            {locale.gridTitleCTA}
                        </Link>
                    )}
                </Flex>

                {hasItems ? (
                    <GalleryGridMasonry
                        galleryItems={galleryItems}
                        showSkeleton={showSkeleton}
                        showMoreButton={showMoreButton}
                        loadMorePhotos={loadMorePhotos}
                    />
                ) : (
                    <NoPosts
                        isUserPublicGallery={isUserPublicGallery}
                        locale={locale}
                        handleUploadToGallery={this.handleUploadToGallery}
                    />
                )}

                {this.state.openPixleeUploader && (
                    <PixleeUploader
                        successCallback={this.props.getGalleryItems}
                        closeUploader={this.removePixleeContainer}
                    />
                )}
            </Flex>
        );
    }
}

export default wrapComponent(UsersGalleryGridSection, 'UsersGalleryGridSection', true);
