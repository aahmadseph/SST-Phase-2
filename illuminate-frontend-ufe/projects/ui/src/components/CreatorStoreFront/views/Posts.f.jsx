/* eslint-disable class-methods-use-this */
import React, {
    useEffect, useState, useRef, useCallback
} from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Container } from 'components/ui';
import CSFCommonGrid from 'components/CreatorStoreFront/CSFCommonGrid/CSFCommonGrid';
import { useSkeletonLoading, SKELETON_CONFIG } from 'components/CreatorStoreFront/helpers/csfSkeleton';
import {
    createVisibilityTracker,
    createCSFEventPayload,
    createSOTOverrides,
    sendCSFTrackingEvent
} from 'components/CreatorStoreFront/helpers/csfEventHelpers';
import csfConstants from 'components/CreatorStoreFront/helpers/csfConstants';
import { useCSFPageLoadAnalytics } from 'components/CreatorStoreFront/helpers/csfEventHelpers';

function Posts(props) {
    const {
        handle, pageType, posts, totalPosts, creatorProfileData
    } = props;

    const referralOwnerId = creatorProfileData?.creatorProfile?.creatorId;

    const [isLoading, setIsLoading] = useState(true);

    const observerRef = useRef(null);
    const tileRefs = useRef({});

    const { shouldShowLoading, skeletonCount } = useSkeletonLoading(posts, SKELETON_CONFIG.GRID_DURATION, totalPosts);

    useEffect(() => {
        if (posts?.length > 0) {
            setIsLoading(false);
        }
    }, [posts]);

    const sendViewEvent = postId => {
        const eventName = csfConstants.POST_TILE_VIEW_EVENT;

        // Get additional data from post if available
        const post = posts?.find(p => (p.node?.id || p.id || p.postId) === postId);

        const additionalData = {
            referralOwnerId, // Creator ID for tracking
            productId: post?.productId || ''
        };

        const csfPayload = createCSFEventPayload({
            uniqueKey: postId,
            eventType: csfConstants.VIEW,
            keyFieldName: csfConstants.POST_EVENT_KEY,
            additionalData
        });
        const sotOverrides = createSOTOverrides({ uniqueKey: postId, eventName, csfPayload });
        sendCSFTrackingEvent({ eventName, csfPayload, sotOverrides });
    };

    useEffect(() => {
        if (!posts?.length || isLoading) {
            // No posts to track or still loading
            return;
        }

        observerRef.current = createVisibilityTracker({
            onVisible: sendViewEvent,
            threshold: 0.5, // 50% visible
            trackOnce: false, // Allow re-tracking for posts as per requirements
            delay: 1000 // 1 second delay as per Jira requirements
        });

        if (!observerRef.current) {
            Sephora.logger.verbose('Posts: Failed to create visibility tracker');

            return;
        }

        // Observe existing tiles
        Object.values(tileRefs.current).forEach(tile => {
            if (tile) {
                Sephora.logger.verbose(`Posts: Observing existing tile with ID: ${tile.getAttribute('data-tracking-id')}`);
                observerRef.current.observe(tile);
            }
        });

        // eslint-disable-next-line consistent-return
        return () => {
            Sephora.logger.verbose('Posts: Cleaning up observer');
            observerRef.current?.disconnect();
        };
    }, [posts, isLoading]);

    const registerTile = useCallback(
        id => el => {
            if (el) {
                Sephora.logger.verbose(`Posts: Registering tile with ID: ${id}`);
                el.setAttribute('data-tracking-id', id);
                el.setAttribute('data-creator-id', referralOwnerId);
                el.classList.add('csf-post-tile');
                tileRefs.current[id] = el;

                if (observerRef.current) {
                    observerRef.current.observe(el);
                }
            } else if (tileRefs.current[id]) {
                Sephora.logger.verbose(`Posts: Unregistering tile with ID: ${id}`);
                observerRef.current?.unobserve(tileRefs.current[id]);
                delete tileRefs.current[id];
            }
        },
        [referralOwnerId]
    );

    useCSFPageLoadAnalytics({ creatorProfileData, pageType });

    return (
        <Container>
            <CSFCommonGrid
                handle={handle}
                type={pageType}
                items={posts}
                totalItems={totalPosts}
                isLoading={isLoading || shouldShowLoading}
                skeletonCount={skeletonCount}
                getTileRef={registerTile}
                creatorId={creatorProfileData?.creatorProfile.creatorId}
            />
        </Container>
    );
}

export default wrapFunctionalComponent(Posts, 'Posts');
