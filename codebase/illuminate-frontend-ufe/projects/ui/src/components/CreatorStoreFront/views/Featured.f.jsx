import React, { useRef, useEffect } from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import SocialFeaturedCarousel from 'components/CreatorStoreFront/SocialFeaturedCarousel';
import CSFProductGridBase from 'components/CreatorStoreFront/CSFProductGrid/CSFProductGrid';
import { withUpperFunnelProps } from 'viewModel/catalog/upperFunnel/withUpperFunnelProps';
import { Box } from 'components/ui';
import {
    useCSFPageLoadAnalytics,
    createVisibilityTracker,
    trackCollectionView,
    trackPostView,
    trackProductView
} from 'components/CreatorStoreFront/helpers/csfEventHelpers';
import csfConstants from 'components/CreatorStoreFront/helpers/csfConstants';

const CSFProductGrid = withUpperFunnelProps(CSFProductGridBase);

const Featured = props => {
    const {
        contextId, featuredSection, productSection, textResources, handle, fetchProductData, creatorProfileData, pageType
    } = props;

    const observerRef = useRef(null);
    const tileRefs = useRef({});

    const referralOwnerId = creatorProfileData?.creatorProfile?.creatorId;
    const featuredItems = featuredSection?.featuredItems;
    const products = productSection?.products;

    useCSFPageLoadAnalytics({ creatorProfileData, pageType });

    useEffect(() => {
        if (!featuredItems || featuredItems.length === 0) {
            return;
        }

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = createVisibilityTracker({
            threshold: 0.5,
            trackOnce: true,
            onVisible: id => {
                const item = featuredItems.find(i => i.id === id || i.collectionId === id || i.postId === id || i.productId === id);

                if (item?.type === csfConstants.COLLECTION) {
                    trackCollectionView({ collectionId: item.collectionId, referralOwnerId });
                } else if (item?.type === csfConstants.POST) {
                    trackPostView({ postId: item.postId, referralOwnerId });
                } else if (item?.type === csfConstants.PRODUCT) {
                    trackProductView({
                        referralOwnerId,
                        productId: item.productId,
                        motomProductId: item.motomProductId,
                        isFeaturted: true
                    });
                }
            }
        });

        // Observe any tiles already mounted
        Object.values(tileRefs.current).forEach(el => {
            if (el) {
                observerRef.current.observe(el);
            }
        });

        // eslint-disable-next-line consistent-return
        return () => {
            observerRef.current?.disconnect();
        };
    }, [featuredItems, referralOwnerId]);

    const registerTile = (tileId, isCollection) => element => {
        if (element) {
            // Set tracking ID attribute and store reference
            element.setAttribute('data-tracking-id', tileId);
            element.classList.add(`csf-${isCollection ? 'collection' : 'post'}-tile`);
            element.setAttribute('data-creator-id', referralOwnerId);
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

    return (
        <Box marginTop={[4, null, 5]}>
            {featuredItems && (
                <SocialFeaturedCarousel
                    handle={handle}
                    headerText={textResources.featuredHeader}
                    items={featuredItems}
                    registerTile={registerTile}
                    referralOwnerId={referralOwnerId}
                    isFeaturedPage
                />
            )}
            <CSFProductGrid
                products={products}
                contextId={contextId}
                source='search'
                setResultsCount={() => {}}
                showUpdateCatalogSorting={false}
                textResources={textResources}
                fetchProductData={fetchProductData}
                handle={handle}
                totalProductCount={productSection?.totalProductCount}
                creatorProfileData={creatorProfileData}
            />
        </Box>
    );
};

export default wrapFunctionalComponent(Featured, 'Featured');
