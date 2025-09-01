import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Button, Box, Flex, Text
} from 'components/ui';
import CollectionTile from 'components/CreatorStoreFront/CollectionTile/CollectionTile';
import PostTile from 'components/CreatorStoreFront/PostTile/PostTile';
import localUtils from 'utils/LanguageLocale';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';
import getCollectionsNextPage from 'services/api/creatorStoreFront/getCollectionsNextPage';
import getPostsNextPage from 'services/api/creatorStoreFront/getPostsNextPage';
import Actions from 'actions/Actions';
import { createVisibilityTracker, trackCollectionView, trackPostView } from 'components/CreatorStoreFront/helpers/csfEventHelpers';

const getText = localUtils.getLocaleResourceFile('components/CreatorStoreFront/CSFCommonGrid/locales', 'CSFCommonGrid');

const { COLLECTIONS, POSTS } = CSF_PAGE_TYPES;

const TITLE_TEXT_KEY = {
    [COLLECTIONS]: 'collections',
    [POSTS]: 'posts'
};

const ITEM_COMPONENTS = {
    [COLLECTIONS]: CollectionTile,
    [POSTS]: PostTile
};

const ITEM_ID_KEY = {
    [COLLECTIONS]: 'collectionId',
    [POSTS]: 'postId'
};

const COMPONENT_PROPS = {
    [COLLECTIONS]: ({ handle, isLoading }) => ({ handle, isLoading, isSmallTile: true }),
    [POSTS]: ({ handle, isLoading, creatorId = '' }) => ({ handle, isLoading, isSmallTile: true, referralOwnerId: creatorId })
};

const fetchers = {
    [COLLECTIONS]: getCollectionsNextPage,
    [POSTS]: getPostsNextPage
};

const ShowMoreItemsTile = ({ numberOfItemsText, showMoreItemsText, isCentered, onClick }) => {
    return (
        <Flex
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            gap={3}
            width={['100%', null, 240]}
            paddingY={[5, null, 7]}
            flex={['none', null, isCentered ? 'auto' : 'none']}
            order={9999}
        >
            <Flex
                alignItems='center'
                flexDirection='column'
                gap='10px'
            >
                <Text
                    color='gray'
                    lineHeight='18px'
                    children={numberOfItemsText}
                />
                <Button
                    variant='secondary'
                    width={200}
                    onClick={onClick}
                    children={showMoreItemsText}
                />
            </Flex>
        </Flex>
    );
};

const CSFCommonGrid = ({
    handle, type, items, totalItems, isLoading = false, skeletonCount = 8, getTileRef, creatorId
}) => {
    const dispatch = useDispatch();
    const showLoader = isVisible => dispatch(Actions.showInterstice(isVisible));

    const [nextPage, setNextPage] = useState(2);
    const [shownItems, setShownItems] = useState(items || []);
    const observerRef = useRef(null);

    useEffect(() => {
        if (items && !isLoading) {
            setShownItems(items);
        }
    }, [items, isLoading]);

    // Add visibility tracking for collections
    useEffect(() => {
        if (!isLoading && shownItems.length > 0) {
            // Clean up previous observer
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            // Setup new intersection observer for collection tracking
            observerRef.current = createVisibilityTracker({
                onVisible: itemId => {
                    type === COLLECTIONS
                        ? trackCollectionView({ collectionId: itemId })
                        : trackPostView({ postId: itemId, referralOwnerId: creatorId });
                },
                threshold: 0.5, // This is per jira spec
                trackOnce: true
            });

            // Small delay to ensure DOM is updated after render
            setTimeout(() => {
                const itemType = type === COLLECTIONS ? 'collection' : 'post';
                const tiles = document.querySelectorAll(`.csf-${itemType}-tile[data-${itemType}-id]`);
                tiles.forEach(tile => {
                    const itemId = tile.getAttribute(`data-${itemType}-id`);

                    if (itemId) {
                        // Set data-tracking-id for the visibility tracker
                        tile.setAttribute('data-tracking-id', itemId);
                        observerRef.current.observe(tile);
                    }
                });
            }, 100);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [type, shownItems, isLoading]);

    const isSingleCollection = type === COLLECTIONS && totalItems === 1;
    const isShowMoreItemsTile = !isLoading && !isSingleCollection && shownItems.length < totalItems;

    const fetchMoreItems = async () => {
        showLoader(true);

        try {
            const { data } = await fetchers[type](handle, nextPage);
            setShownItems(prev => [...prev, ...data[type]]);
            setNextPage(prev => prev + 1);
        } catch (error) {
            Sephora.logger.error(`Error fetching ${type} page ${nextPage}:`, error);
        } finally {
            showLoader(false);
        }
    };

    const handleShowMoreItemsClick = () => {
        fetchMoreItems();
    };

    const Component = ITEM_COMPONENTS[type];
    const componentProps = COMPONENT_PROPS[type]({ handle, isLoading, creatorId });

    const renderItems = () => {
        if (isLoading || !shownItems || shownItems.length === 0) {
            return Array.from({ length: skeletonCount }).map((_, index) => (
                <Box
                    key={`skeleton-${index}`}
                    width={[168, null, 240]}
                    height={[220, null, 280]}
                >
                    <Component
                        item={{}}
                        {...componentProps}
                    />
                </Box>
            ));
        }

        return shownItems.map(item => {
            const nodeItem = item.node || item;
            const key = nodeItem[ITEM_ID_KEY[type]] || nodeItem.id;
            const itemId = nodeItem.id || nodeItem[ITEM_ID_KEY[type]] || key;

            return (
                <Box
                    key={key || `item-${Math.random()}`}
                    width={[168, null, 240]}
                    height={[220, null, 280]}
                    ref={getTileRef ? getTileRef(itemId) : undefined}
                    data-tracking-id={itemId}
                    className={type === COLLECTIONS ? 'csf-collection-tile' : 'csf-post-tile'}
                >
                    <Component
                        item={nodeItem}
                        {...componentProps}
                    />
                </Box>
            );
        });
    };

    const titleText = getText(TITLE_TEXT_KEY[type]);
    const itemsText = getText(totalItems === 1 ? 'item' : 'items', [totalItems]);
    const numberOfItemsText = getText('numberOfItems', [shownItems.length, totalItems, titleText.toLowerCase()]);
    const showMoreItemsText = getText('showMoreItems', [titleText]);
    const isShowMoreCentered = shownItems.length % 5 === 0;

    return (
        <Flex
            marginTop={[4, null, 5]}
            flexDirection='column'
            alignItems='flex-start'
            justifyContent={[null, null, 'center']}
            gap={[4, null, 5]}
        >
            <Flex
                flexDirection='column'
                gap={['4px', null, 2]}
            >
                <Text
                    is='h2'
                    fontSize={['md', null, 'lg']}
                    fontWeight='bold'
                    lineHeight={['20px', null, '22px']}
                >
                    {titleText}
                </Text>
                {!isSingleCollection && (
                    <Text
                        color='gray'
                        fontSize={['sm', null, 'base']}
                        lineHeight={['14px', null, '18px']}
                    >
                        {itemsText}
                    </Text>
                )}
            </Flex>

            <Flex
                alignItems='center'
                alignContent='center'
                alignSelf='stretch'
                columnGap={['7px', null, 3]}
                rowGap={4}
                flexWrap='wrap'
            >
                {renderItems()}
                {isShowMoreItemsTile && (
                    <ShowMoreItemsTile
                        numberOfItemsText={numberOfItemsText}
                        showMoreItemsText={showMoreItemsText}
                        isCentered={isShowMoreCentered}
                        onClick={handleShowMoreItemsClick}
                    />
                )}
            </Flex>
        </Flex>
    );
};

CSFCommonGrid.defaultProps = {
    isLoading: false,
    skeletonCount: 8
};

CSFCommonGrid.propTypes = {
    type: PropTypes.oneOf([COLLECTIONS, POSTS]).isRequired,
    handle: PropTypes.string.isRequired,
    totalItems: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    skeletonCount: PropTypes.number,
    getTileRef: PropTypes.func
};

export default wrapFunctionalComponent(CSFCommonGrid, 'CSFCommonGrid');
