/* eslint-disable consistent-return */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { wrapFunctionalComponent } from 'utils/framework';
import PostDetailsContainer from 'components/CreatorStoreFront/PostDetailsPage/PostDetailsContainer';
import HorizontalProductTile from 'components/CreatorStoreFront/HorizontalProductTile/HorizontalProductTile';
import PostDetailsFrame from 'components/CreatorStoreFront/PostDetailsFrame/PostDetailsFrame';
import PostHeaderFrame from 'components/CreatorStoreFront/PostHeaderFrame/PostHeaderFrame';
import SocialFeaturedCarousel from 'components/CreatorStoreFront/SocialFeaturedCarousel';
import { Box, Flex, Container } from 'components/ui';
import { getPostDetailsPageSelector } from 'selectors/creatorStoreFront/postPageDataSelector';
import { useNavigateTo } from 'components/CreatorStoreFront/helpers/csfNavigation';
import {
    useCSFPageLoadAnalytics,
    createVisibilityTracker,
    trackProductView,
    trackProductClick,
    trackCollectionView,
    trackPostView
} from 'components/CreatorStoreFront/helpers/csfEventHelpers';
import csfConstants from 'components/CreatorStoreFront/helpers/csfConstants';
import { updateAttributionForDetailsPage } from 'components/CreatorStoreFront/helpers/csfAttribution';

const PostDetails = props => {
    const {
        dispatch, handle, creatorProfileData, postId, pageType
    } = props;

    const [isLoading, setIsLoading] = useState(true);

    const { navigateTo } = useNavigateTo(dispatch);

    const observerProductCardRef = useRef(null);
    const carouselObserverRef = useRef(null); // Add separate observer for carousel
    const carouselTileRefs = useRef({}); // Add separate refs for carousel tiles

    const {
        creatorFirstName, postContent, products, moreFromCreatorContent, textResources
    } = useSelector(getPostDetailsPageSelector);

    useEffect(() => {
        if (products.length > 0 && isLoading) {
            setIsLoading(false);
        }
    }, [products, isLoading]);

    const renderTiles = () => {
        const MAX_TILES = 20;

        if (isLoading) {
            return Array.from({ length: 4 }).map((_, i) => (
                <HorizontalProductTile
                    key={`skeleton-${i}`}
                    isSkeleton={true}
                    textResources={textResources}
                />
            ));
        }

        return products.slice(0, MAX_TILES).map((product, index) => {
            const creatorProfile = creatorProfileData?.creatorProfile;
            const referralOwnerId = creatorProfile?.creatorId;
            const productId = product.productId;
            const targetUrl = product.targetUrl;
            const motomProductId = product?.motomProductId;

            return (
                <HorizontalProductTile
                    key={productId || index}
                    product={product}
                    textResources={textResources}
                    trackCSFProductClick={() => trackProductClick({ referralOwnerId, productId, targetUrl, motomProductId })}
                    updateAttributionData={() => updateAttributionForDetailsPage(creatorProfile, motomProductId)}
                    csfCreatorId={referralOwnerId}
                />
            );
        });
    };

    const onViewAll = async event => {
        event.preventDefault();
        const path = `/creators/${handle}/posts`;
        await navigateTo(path, false, true);
    };

    // Add carousel tracking setup
    useEffect(() => {
        if (!moreFromCreatorContent || moreFromCreatorContent.length === 0) {
            return;
        }

        if (carouselObserverRef.current) {
            carouselObserverRef.current.disconnect();
        }

        carouselObserverRef.current = createVisibilityTracker({
            threshold: 0.5,
            trackOnce: true,
            onVisible: id => {
                const item = moreFromCreatorContent.find(i => i.id === id || i.collectionId === id || i.postId === id);
                const referralOwnerId = creatorProfileData?.creatorProfile?.creatorId;

                if (item?.type === csfConstants.COLLECTION) {
                    trackCollectionView({ collectionId: item.collectionId });
                } else if (item?.type === csfConstants.POST) {
                    trackPostView({
                        postId: item.postId,
                        referralOwnerId,
                        productId: item.productId
                    });
                }
            }
        });

        // Observe any carousel tiles already mounted
        Object.values(carouselTileRefs.current).forEach(el => {
            if (el) {
                carouselObserverRef.current.observe(el);
            }
        });

        return () => {
            carouselObserverRef.current?.disconnect();
        };
    }, [moreFromCreatorContent, creatorProfileData]);

    // Register callback for tracking carousel tiles (separate from product tiles)
    const registerCarouselTile = (tileId, isCollection) => element => {
        if (element) {
            // Set tracking ID attribute and store reference
            element.setAttribute('data-tracking-id', tileId);
            element.classList.add(`csf-${isCollection ? csfConstants.COLLECTION : csfConstants.POST}-tile`);
            element.setAttribute('data-creator-id', creatorProfileData?.creatorProfile?.creatorId);
            carouselTileRefs.current[tileId] = element;

            // Observe with visibility tracker if already created
            if (carouselObserverRef.current) {
                carouselObserverRef.current.observe(element);
            }
        } else if (carouselTileRefs.current[tileId]) {
            // Clean up when element is removed
            carouselObserverRef.current?.unobserve(carouselTileRefs.current[tileId]);
            delete carouselTileRefs.current[tileId];
        }
    };

    useCSFPageLoadAnalytics({ creatorProfileData, postId, pageType: `${pageType} detail` });

    // Add visibility tracking for product cards
    useEffect(() => {
        if (!isLoading && products.length > 0) {
            // Clean up previous observer
            if (observerProductCardRef.current) {
                observerProductCardRef.current.disconnect();
            }

            // Setup new intersection observer for product card tracking
            observerProductCardRef.current = createVisibilityTracker({
                onVisible: (productId, element) => {
                    const motomProductId = element?.getAttribute('data-motom-tracking-id');

                    trackProductView({
                        referralOwnerId: creatorProfileData?.creatorProfile?.creatorId,
                        productId,
                        postId,
                        collectionId: null,
                        motomProductId
                    });
                },
                threshold: 0.5, // This is per jira spec
                trackOnce: true
            });

            // Small delay to ensure DOM is updated after render
            setTimeout(() => {
                const tiles = document.querySelectorAll('[data-tracking-id]');
                tiles.forEach(tile => {
                    const itemId = tile.getAttribute('data-tracking-id');

                    if (itemId) {
                        // Set data-tracking-id for the visibility tracker
                        tile.setAttribute('data-tracking-id', itemId);
                        observerProductCardRef.current.observe(tile);
                    }
                });
            }, 100);
        }

        return () => {
            if (observerProductCardRef.current) {
                observerProductCardRef.current.disconnect();
            }
        };
    }, [products, isLoading, creatorProfileData, postId]);

    return (
        <>
            <Container>
                <Flex
                    flexDirection={['column', null, 'row']}
                    width='100%'
                    gap={[4, null, 5]}
                >
                    {/* Left Column: PostDetailsFrame */}
                    <Box
                        flex={[null, null, 1]}
                        maxWidth={[null, null, 400]}
                        marginX={['-container', null, 0]}
                    >
                        <PostDetailsFrame
                            postContent={postContent}
                            isSkeleton={isLoading}
                        />
                    </Box>

                    {/* Right Column: PostHeaderFrame + PostDetailsContainer */}
                    <Flex
                        flexDirection='column'
                        flex='1'
                        width={'100%'}
                        gap={[4, null, 5]}
                    >
                        <PostHeaderFrame
                            postContent={postContent}
                            textResources={textResources}
                            isSkeleton={isLoading}
                        />
                        <PostDetailsContainer productTiles={renderTiles()} />
                    </Flex>
                </Flex>
            </Container>
            {moreFromCreatorContent?.length && (
                <Box marginTop={5}>
                    <SocialFeaturedCarousel
                        handle={handle}
                        headerText={`${textResources.moreFrom} ${creatorFirstName}`}
                        items={moreFromCreatorContent}
                        onViewAll={onViewAll}
                        viewAllText={textResources.viewAll}
                        registerTile={registerCarouselTile}
                    />
                </Box>
            )}
        </>
    );
};

export default wrapFunctionalComponent(PostDetails, 'PostDetails');
