import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import { Box } from 'components/ui';
import EDPImage from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPImage';
import EDPMediaCarousel from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/EDPMediaCarousel';

import { EDP_IMG_SIZES } from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/constants';
const {
    SMUI_SINGLE_WIDTH, SMUI_SINGLE_HEIGHT, LGUI_SINGLE_WIDTH, LGUI_SINGLE_HEIGHT, SMUI_EVENTS_SINGLE_HEIGHT, LGUI_EVENTS_SINGLE_HEIGHT
} =
    EDP_IMG_SIZES;

function EDPMedia({ isSingleImage, minHeight, edpInfo }) {
    const { displayName, images, type } = edpInfo;

    const LGUI_HEIGHT = type === 'event' ? LGUI_EVENTS_SINGLE_HEIGHT : LGUI_SINGLE_HEIGHT;
    const SMUI_HEIGHT = type === 'event' ? SMUI_EVENTS_SINGLE_HEIGHT : SMUI_SINGLE_HEIGHT;

    return (
        <Box minHeight={minHeight}>
            {isSingleImage ? (
                <EDPImage
                    alt={displayName}
                    src={images[0].imageUrl}
                    objectFit={'cover'}
                    display={'block'}
                    width={[SMUI_SINGLE_WIDTH, null, LGUI_SINGLE_WIDTH]}
                    height={[SMUI_HEIGHT, null, LGUI_HEIGHT]}
                    isPageRenderImg={true}
                    isSingleImage={isSingleImage}
                />
            ) : (
                <EDPMediaCarousel edpInfo={edpInfo} />
            )}
        </Box>
    );
}

export default wrapFunctionalComponent(EDPMedia, 'EDPMedia');
