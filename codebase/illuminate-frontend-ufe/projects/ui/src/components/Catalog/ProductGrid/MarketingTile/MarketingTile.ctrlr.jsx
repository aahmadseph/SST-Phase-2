import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Image } from 'components/ui';
import { radii } from 'style/config';
import BccRwdLinkHOC from 'components/Bcc/BccRwdLinkHOC';
import Banner from 'components/Content/Banner';
import contentConstants from 'constants/content';
import { getProductTileSize } from 'style/imageSizes';

import { PostLoad } from 'constants/events';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { CONTEXTS } = contentConstants;
const BccRwdLinkBox = BccRwdLinkHOC(Box);

class MarketingTile extends BaseClass {
    static propTypes = {
        content: PropTypes.object,
        isLazyLoaded: PropTypes.bool
    };

    fireTileTrackingEvent = (eventName, content) => {
        const locationId = `marketing-tile-${digitalData?.page?.pageInfo?.pageName || ''}`;

        const eventData = {
            actionInfo: eventName,
            promotionId: content?.sid || '',
            promotionName: content?.sid || '',
            creativeName: content?.media?.src || '',
            creativeSlot: content?.slot || '',
            locationId,
            specificEventName: eventName
        };
        processEvent.process(
            anaConsts.PROMO_LINK_TRACKING_EVENT,
            { data: { ...eventData, finishEventWithoutTimeout: true } },
            { specificEventName: eventName }
        );
    };

    handleViewableImpression = content => {
        const onLastLoadEvent = Sephora.Util.onLastLoadEvent;
        const eventName = 'viewableImpression';

        const self = this;

        // When the component is not lazy loaded and its a hard reload wait for the TMS to be ready.
        if (!content?.isLazyLoaded) {
            // When the tile is not lazy loaded, it needs to wait for the TMS to have the GA4 Library ready.
            // This Promise is fulfilled inside the tag "Pixel - Adobe Launch Script Loader".
            Sephora.analytics.promises.ga4Ready.then(() => {
                self.fireTileTrackingEvent(eventName, content);
            });
        } else {
            // Waits until the page is completely loaded to fire the event for Signal/TMS.
            onLastLoadEvent(window, [PostLoad], () => {
                self.fireTileTrackingEvent(eventName, content);
            });
        }
    };

    handleClickImpression = () => {
        const { content } = this.props;

        this.fireTileTrackingEvent('promotionClick', content);
    };

    componentDidMount() {
        const { content } = this.props;
        this.handleViewableImpression(content);
    }

    /* eslint-disable-next-line complexity */
    render() {
        const { content, isLazyLoaded } = this.props;

        const contentType = content.media;
        const TILE_IMAGE_SIZE = getProductTileSize(true);

        return (
            <>
                {contentType ? (
                    <Banner
                        enablePageRenderTracking={!isLazyLoaded}
                        context={CONTEXTS.GRID}
                        size={TILE_IMAGE_SIZE[1]}
                        {...content}
                        // rich text not supported in this context
                        text={null}
                        mediaPlacement={null}
                        largeMediaPlacement={null}
                        marginTop={null}
                        marginBottom={null}
                        fireClickTracking={this.handleClickImpression}
                    />
                ) : (
                    <BccRwdLinkBox
                        bccProps={content}
                        useInternalTracking={true}
                        width='100%'
                        position='relative'
                        style={{
                            paddingBottom: `${(content.imageHeight / content.imageWidth) * 100}%`
                        }}
                    >
                        <Image
                            src={content.imageSource}
                            alt={content.altText}
                            size={TILE_IMAGE_SIZE[1]}
                            isPageRenderImg={!isLazyLoaded}
                            disableLazyLoad={!isLazyLoaded}
                            css={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                objectFit: 'cover',
                                borderRadius: radii[2]
                            }}
                        />
                    </BccRwdLinkBox>
                )}
            </>
        );
    }
}

export default wrapComponent(MarketingTile, 'MarketingTile', true);
