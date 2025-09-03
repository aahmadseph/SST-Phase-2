import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import framework from 'utils/framework';
import CSFProductGrid from 'components/CreatorStoreFront/CSFProductGrid/CSFProductGrid';
import CollectionDetailsHeader from 'components/CreatorStoreFront/CollectionHeader/CollectionDetailsHeader';
import SocialFeaturedCarousel from 'components/CreatorStoreFront/SocialFeaturedCarousel';
import { Box, Container, Flex } from 'components/ui';
import { getSingleCollectionPageSelector } from 'selectors/creatorStoreFront/collectionsPageDataSelector';
import Empty from 'constants/empty';
import { useNavigateTo } from 'components/CreatorStoreFront/helpers/csfNavigation';
import {
    createHorizontalVisibilityTracker,
    createCSFEventPayload,
    createSOTOverrides,
    sendCSFTrackingEvent
} from 'components/CreatorStoreFront/helpers/csfEventHelpers';
import csfConstants from 'components/CreatorStoreFront/helpers/csfConstants';
import { useCSFPageLoadAnalytics } from 'components/CreatorStoreFront/helpers/csfEventHelpers';

const { wrapFunctionalComponent } = framework;

const CollectionDetails = props => {
    const {
        dispatch, handle, collectionId, fetchCollectionProductsData, creatorProfileData
    } = props;

    const { navigateTo } = useNavigateTo(dispatch);

    // Add tracking state and refs
    const [trackedCollections, setTrackedCollections] = useState({});
    const observerRef = useRef(null);
    const tileRefs = useRef({});

    // Create selector instance once per render
    const {
        creatorFirstName, products, moreFromCreatorContent, collectionContent, textResources, pageType
    } =
        useSelector(getSingleCollectionPageSelector);

    const {
        collectionTitle = Empty.String,
        collectionDescription = Empty.String,
        tileProductThumbnails = Empty.Array,
        totalProducts = 0
    } = collectionContent;

    // View event handler for collection impressions
    const sendViewEvent = tileId => {
        // Prevent duplicate tracking of the same collection
        if (trackedCollections[tileId]) {
            return;
        }

        const eventName = csfConstants.COLLECTION_TILE_VIEW_EVENT;
        const csfPayload = createCSFEventPayload({
            uniqueKey: tileId,
            eventType: csfConstants.VIEW,
            keyFieldName: csfConstants.COLLECTION_EVENT_KEY
        });
        const sotOverrides = createSOTOverrides({ uniqueKey: tileId, eventName, csfPayload });
        sendCSFTrackingEvent({ eventName, csfPayload, sotOverrides });

        // Mark collection as tracked
        setTrackedCollections(prev => ({ ...prev, [tileId]: true }));
    };

    // Set up horizontal visibility tracker for carousel items
    useEffect(() => {
        if (!moreFromCreatorContent?.length) {
            return;
        }

        // Create horizontal visibility tracker with 50% threshold and 1 second delay
        observerRef.current = createHorizontalVisibilityTracker({
            onVisible: sendViewEvent,
            threshold: 0.5,
            trackOnce: true, // Only track first visibility
            delay: 1000
        });

        // Observe all existing tile refs
        Object.values(tileRefs.current).forEach(tile => {
            if (tile) {
                observerRef.current.observe(tile);
            }
        });

        // eslint-disable-next-line consistent-return
        return () => {
            // Clean up observer on unmount
            observerRef.current?.disconnect();
        };
    }, [moreFromCreatorContent]);

    // Register callback for tracking collection tiles
    const registerTile = tileId => element => {
        if (element) {
            // Set tracking ID attribute and store reference
            element.setAttribute('data-tracking-id', tileId);
            element.classList.add('csf-collection-tile');
            tileRefs.current[tileId] = element;

            // Observe with horizontal visibility tracker if already created
            if (observerRef.current) {
                observerRef.current.observe(element);
            }
        } else if (tileRefs.current[tileId]) {
            // Clean up when element is removed
            observerRef.current?.unobserve(tileRefs.current[tileId]);
            delete tileRefs.current[tileId];
        }
    };

    const onViewAll = async event => {
        event.preventDefault();
        const path = `/creators/${handle}/collections`;
        await navigateTo(path, false, true);
    };

    useCSFPageLoadAnalytics({ creatorProfileData, collectionId, pageType: `${pageType} detail` });

    return (
        <>
            <Container>
                <Flex
                    flexDirection='column'
                    width='100%'
                    gap={5}
                >
                    <CollectionDetailsHeader
                        collectionTitle={collectionTitle}
                        collectionDescription={collectionDescription}
                        itemCount={tileProductThumbnails.length}
                        shareLabel={textResources?.share}
                        totalProducts={totalProducts}
                    />
                    <CSFProductGrid
                        products={products}
                        contextId={collectionId}
                        source='search'
                        setResultsCount={() => {}}
                        textResources={textResources}
                        pageType={pageType}
                        handle={handle}
                        totalProductCount={totalProducts}
                        fetchProductData={fetchCollectionProductsData}
                        collectionId={collectionId}
                        creatorProfileData={creatorProfileData}
                    />
                </Flex>
            </Container>
            <Box marginTop={5}>
                <SocialFeaturedCarousel
                    handle={handle}
                    headerText={`${textResources.moreFrom} ${creatorFirstName}`}
                    items={moreFromCreatorContent}
                    onViewAll={onViewAll}
                    viewAllText={textResources.viewAll}
                    registerTile={registerTile}
                />
            </Box>
        </>
    );
};

export default wrapFunctionalComponent(CollectionDetails, 'CollectionDetails');
