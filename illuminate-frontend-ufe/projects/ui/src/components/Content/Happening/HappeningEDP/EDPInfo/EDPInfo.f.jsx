import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import { Divider, Grid } from 'components/ui';
import EDPMedia from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia';
import EDPDescription from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPDescription';
import EDPRsvpModule from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPRsvpModule';
import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';

import { EDP_IMG_SIZES, PHOTOS_COL_LGUI_WIDTH } from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/constants';
const {
    SMUI_CAROUSEL_HEIGHT, SMUI_SINGLE_HEIGHT, LGUI_CAROUSEL_HEIGHT, LGUI_SINGLE_HEIGHT, SMUI_EVENTS_SINGLE_HEIGHT, LGUI_EVENTS_SINGLE_HEIGHT
} =
    EDP_IMG_SIZES;

import { ACTIVITY_TYPES } from 'components/Content/Happening/HappeningEDP/EDPInfo/constants';

function EDPInfo({ serviceInfo, eventInfo, storeAvailabilities, storeId }) {
    const edpInfo = serviceInfo || eventInfo;

    if (!edpInfo) {
        return null;
    }

    const isSingleImage = edpInfo.images.length === 1;
    const minHeightSMUI = isSingleImage ? SMUI_SINGLE_HEIGHT : SMUI_CAROUSEL_HEIGHT;
    const minHeightLGUI = isSingleImage ? LGUI_SINGLE_HEIGHT : LGUI_CAROUSEL_HEIGHT;

    const isEventOnlyFeature = ACTIVITY_TYPES.EVENT === edpInfo.type;

    const edpMediaHeightLGUI = isEventOnlyFeature ? LGUI_EVENTS_SINGLE_HEIGHT : minHeightLGUI;
    const edpMediaHeightSMUI = isEventOnlyFeature ? SMUI_EVENTS_SINGLE_HEIGHT : minHeightSMUI;

    if (typeof window !== 'undefined') {
        if (isEventOnlyFeature) {
            HappeningBindings.eventDetailsPageLoadAnalytics(eventInfo.displayName, storeId);
        } else {
            HappeningBindings.serviceDetailsPageLoadAnalytics(serviceInfo.displayName, storeId);
        }
    }

    return (
        <>
            <Grid
                gridTemplateColumns={[null, null, `${PHOTOS_COL_LGUI_WIDTH}px 1fr`]}
                gap={[4, null, 0]}
                css={{ position: 'relative' }}
            >
                <EDPMedia
                    isSingleImage={isSingleImage}
                    minHeight={[edpMediaHeightSMUI, null, edpMediaHeightLGUI]}
                    edpInfo={edpInfo}
                />
                <EDPDescription
                    minHeight={[null, null, edpMediaHeightLGUI]}
                    edpInfo={edpInfo}
                />
            </Grid>
            {isEventOnlyFeature && (
                <>
                    <Divider marginY={[5, null, 6]} />
                    <EDPRsvpModule
                        edpInfo={edpInfo}
                        storeAvailabilities={storeAvailabilities}
                    />
                </>
            )}
        </>
    );
}

export default wrapFunctionalComponent(EDPInfo, 'EDPInfo');
