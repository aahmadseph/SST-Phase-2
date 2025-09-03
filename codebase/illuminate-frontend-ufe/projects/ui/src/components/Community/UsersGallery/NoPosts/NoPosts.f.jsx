/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Flex, Text, Image, Button
} from 'components/ui';
import { lineHeights, fontWeights } from 'style/config';
import urlUtils from 'utils/Url';
import Location from 'utils/Location';

const { getLink } = urlUtils;

const NoPosts = ({ locale, isUserPublicGallery, handleUploadToGallery }) => {
    const backToGallery = e => {
        const targetUrl = getLink('/community/gallery');
        Location.navigateTo(e, targetUrl);
    };

    return (
        <Flex
            flexDirection='column'
            justifyContent='flex-start'
            alignItems='flex-start'
            px={4}
            gap={5}
        >
            <Image
                width='80px'
                height='80px'
                src='/img/ufe/gallery/no-photos.svg'
            />
            <Flex
                gap={2}
                flexDirection='column'
            >
                {!isUserPublicGallery && (
                    <Text
                        is='h4'
                        fontSize='lg'
                        lineHeight={lineHeights.tigh}
                        fontWeight={fontWeights.bold}
                        children={locale.myGalleryNoPhotosTitle}
                    />
                )}

                <Text
                    fontSize='sm'
                    children={isUserPublicGallery ? locale.publicUserGalleryNoPhotosText : locale.myGalleryNoPhotosText}
                />
            </Flex>

            <Button
                variant='primary'
                children={isUserPublicGallery ? locale.publicUserGalleryNoPhotosCTA : locale.myGalleryNoPhotosCTA}
                onClick={isUserPublicGallery ? backToGallery : handleUploadToGallery}
            />
        </Flex>
    );
};

export default wrapFunctionalComponent(NoPosts, 'NoPosts');
