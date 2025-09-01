/* eslint-disable consistent-return */
import React, {
    useEffect, useState, useRef, useCallback
} from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    createVisibilityTracker,
    createCSFEventPayload,
    createSOTOverrides,
    sendCSFTrackingEvent
} from 'components/CreatorStoreFront/helpers/csfEventHelpers';
import csfConstants from 'components/CreatorStoreFront/helpers/csfConstants';
import { Container } from 'components/ui';
import CSFCommonGrid from 'components/CreatorStoreFront/CSFCommonGrid/CSFCommonGrid';
import { useSkeletonLoading, SKELETON_CONFIG } from 'components/CreatorStoreFront/helpers/csfSkeleton';
import { useCSFPageLoadAnalytics } from 'components/CreatorStoreFront/helpers/csfEventHelpers';

const Collections = props => {
    const {
        handle, pageType, collections, totalCollections, creatorProfileData
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [trackedCollections, setTrackedCollections] = useState({});

    const observerRef = useRef(null);
    const tileRefs = useRef({});

    const { shouldShowLoading, skeletonCount } = useSkeletonLoading(collections, SKELETON_CONFIG.GRID_DURATION, totalCollections);

    useEffect(() => {
        if (collections?.length > 0) {
            setIsLoading(false);
        }
    }, [collections]);

    const sendViewEvent = collectionId => {
        if (trackedCollections[collectionId]) {
            return;
        }

        const eventName = csfConstants.COLLECTION_TILE_VIEW_EVENT;
        const csfPayload = createCSFEventPayload({
            uniqueKey: collectionId,
            eventType: csfConstants.VIEW,
            keyFieldName: csfConstants.COLLECTION_EVENT_KEY
        });
        const sotOverrides = createSOTOverrides({ uniqueKey: collectionId, eventName, csfPayload });
        sendCSFTrackingEvent({ eventName, csfPayload, sotOverrides });
        setTrackedCollections(prev => ({ ...prev, [collectionId]: true }));
    };

    useEffect(() => {
        if (!collections?.length || isLoading) {
            return;
        }

        observerRef.current = createVisibilityTracker({
            onVisible: sendViewEvent,
            threshold: 0.1,
            trackOnce: true
        });

        Object.values(tileRefs.current).forEach(tile => {
            if (tile) {
                observerRef.current.observe(tile);
            }
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [collections, isLoading]);

    useEffect(() => {
        if (isLoading || !collections?.length || !observerRef.current) {
            return;
        }

        const visibleCollections = collections
            .slice(0, 4)
            .map(col => col?.node?.id || col?.id)
            .filter(id => id && !trackedCollections[id]);

        visibleCollections.forEach(id => {
            const el = document.querySelector(`[data-tracking-id="${id}"]`);

            if (!el) {
                return;
            }

            const rect = el.getBoundingClientRect();

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                sendViewEvent(id);
            }
        });
    }, [isLoading, collections, trackedCollections]);

    const registerTile = useCallback(
        id => el => {
            if (el) {
                el.setAttribute('data-tracking-id', id);
                el.classList.add('csf-collection-tile');
                tileRefs.current[id] = el;

                if (observerRef.current) {
                    observerRef.current.observe(el);
                }
            } else if (tileRefs.current[id]) {
                observerRef.current?.unobserve(tileRefs.current[id]);
                delete tileRefs.current[id];
            }
        },
        []
    );

    useCSFPageLoadAnalytics({ creatorProfileData, pageType });

    return (
        <Container>
            <CSFCommonGrid
                handle={handle}
                type={pageType}
                items={collections}
                totalItems={totalCollections}
                skeletonCount={skeletonCount}
                isLoading={isLoading || shouldShowLoading}
                getTileRef={registerTile}
                tileClassName='csf-collection-tile'
            />
        </Container>
    );
};

export default wrapFunctionalComponent(Collections, 'Collections');
