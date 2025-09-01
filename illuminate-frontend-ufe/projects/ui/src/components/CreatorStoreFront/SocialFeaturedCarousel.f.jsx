import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Container, Divider, Flex, Link, Text
} from 'components/ui';
import Carousel from 'components/Carousel/Carousel';
import CollectionTile from 'components/CreatorStoreFront/CollectionTile/CollectionTile';
import PostTile from 'components/CreatorStoreFront/PostTile/PostTile';
import FeaturedProductTile from 'components/CreatorStoreFront/FeaturedProductTile/FeaturedProductTile';
import csfConstants from 'components/CreatorStoreFront/helpers/csfConstants';
import isFunction from 'utils/functions/isFunction';
import anaConsts from 'analytics/constants';
import { sendCSFFeaturedCarouselNextPageLoadEvent } from 'components/CreatorStoreFront/helpers/csfEventHelpers';

const renderSkeleton = () => {
    const typePost = { type: csfConstants.POST };
    const typeCollection = { type: csfConstants.COLLECTION };
    const typeProduct = { type: csfConstants.PRODUCT };
    const items = [typePost, typeProduct, typeCollection, typePost, typePost];

    return items.map((item, index) => (
        <Flex
            key={index}
            flexDirection={'column'}
            alignItems={'flex-start'}
            justifyContent={'center'}
            width={240}
            height={280}
        >
            {item.type === csfConstants.POST ? (
                <PostTile isLoading={true} />
            ) : item.type === csfConstants.COLLECTION ? (
                <CollectionTile isLoading={true} />
            ) : item.type === csfConstants.PRODUCT ? (
                <FeaturedProductTile isLoading={true} />
            ) : null}
        </Flex>
    ));
};

const SocialFeaturedCarousel = props => {
    const {
        handle, headerText, items = [], isFeaturedPage, onViewAll, viewAllText, registerTile, referralOwnerId
    } = props;

    const [isLoading, setIsLoading] = useState(process.env.NODE_ENV !== 'test');
    const resizeTimeoutRef = useRef();

    const triggerResizeEvent = () => {
        window.dispatchEvent(new Event('resize'));
    };

    useEffect(() => {
        let timeout;

        if (items?.length > 0) {
            timeout = setTimeout(() => setIsLoading(false), 500);
        }

        return () => {
            timeout && clearTimeout(timeout);
        };
    }, [items]);

    /**
     * Trigger a resize event when items are loaded to ensure the Carousel recalculates its layout so the left and right arrows appear correctly.
     * Otherwise, `isScrollable` in parent Carousel component happens too early and the arrows do not appear.
     */
    useEffect(() => {
        if (!isLoading && items?.length > 0) {
            // Use a ref to store the timeout so we can clear it on unmount
            resizeTimeoutRef.current = setTimeout(() => {
                triggerResizeEvent();
            }, 0);
        }

        // Cleanup: clear timeout
        return () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, [isLoading, items]);

    // Using useRef to get a reference to the Carousel component
    const carouselRef = useRef(null);

    let shownItems;

    if (isLoading) {
        shownItems = renderSkeleton();
    } else {
        // Map over the items to render the items
        shownItems = items.map((item, index) => {
            const itemId = item.id || item.collectionId || item.postId || item.productId || `item-${index}`;

            // Determine if the item is a collection or post
            const isCollection = item.type === csfConstants.COLLECTION;
            const isPost = item.type === csfConstants.POST;
            const isProduct = item.type === csfConstants.PRODUCT;

            const nextPageDataCB = () => sendCSFFeaturedCarouselNextPageLoadEvent(index + 1);

            return (
                <Flex
                    key={index}
                    flexDirection={'column'}
                    alignItems={'flex-start'}
                    justifyContent={'center'}
                    width={240}
                    height={280}
                    ref={registerTile && isCollection ? registerTile(itemId, isCollection) : registerTile(itemId, isPost)}
                >
                    {isPost ? (
                        <PostTile
                            item={item}
                            handle={handle}
                            isLoading={isLoading}
                            nextPageDataCB={nextPageDataCB}
                        />
                    ) : isCollection ? (
                        <CollectionTile
                            item={item}
                            handle={handle}
                            isLoading={isLoading}
                            nextPageDataCB={nextPageDataCB}
                        />
                    ) : isProduct ? (
                        <FeaturedProductTile
                            item={item}
                            handle={handle}
                            isLoading={isLoading}
                            referralOwnerId={referralOwnerId}
                            nextPageDataCB={nextPageDataCB}
                        />
                    ) : null}
                </Flex>
            );
        });
    }

    return (
        <>
            <Container>
                <Flex
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    marginBottom={isFeaturedPage ? 3 : [4, null, 5]}
                >
                    <Text
                        is={'h2'}
                        fontSize={['md', null, 'lg']}
                        fontWeight={'bold'}
                        lineHeight={['20px', null, '22px']}
                        children={headerText}
                    />
                    {!isFeaturedPage && isFunction(onViewAll) && viewAllText && (
                        <Link
                            onClick={onViewAll}
                            color={'blue'}
                            underline={false}
                            children={viewAllText}
                        />
                    )}
                </Flex>
                <Carousel
                    ref={carouselRef}
                    items={shownItems}
                    itemWidth={240}
                    hasShadowHack
                    gap={[2, null, 3]} // Use a fixed gap for spacing
                    scrollPadding={'container'}
                    paddingY={2}
                    marginX={'-container'}
                    showArrowOnHover={true} // Arrows are always visible now
                    dotsShown={false}
                    dataAt='social-featured-carousel'
                    arrowVariant='circle'
                    analyticsCarouselName={anaConsts.CAROUSEL_NAMES.CSF_FEATURED_CAROUSEL}
                />
            </Container>
            {isFeaturedPage && (
                <Divider
                    color={'nearWhite'}
                    height={3}
                    marginY={[4, null, 5]}
                />
            )}
        </>
    );
};

SocialFeaturedCarousel.defaultProps = {
    isFeaturedPage: false,
    registerTile: null,
    onViewAll: () => {},
    viewAllText: ''
};

SocialFeaturedCarousel.propTypes = {
    handle: PropTypes.string.isRequired,
    headerText: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    isFeaturedPage: PropTypes.bool,
    onViewAll: PropTypes.func,
    viewAllText: PropTypes.string,
    registerTile: PropTypes.func
};

export default wrapFunctionalComponent(SocialFeaturedCarousel, 'SocialFeaturedCarousel');
