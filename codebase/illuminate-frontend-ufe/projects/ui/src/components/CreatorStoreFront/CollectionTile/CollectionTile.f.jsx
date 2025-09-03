import React from 'react';
import { useDispatch } from 'react-redux';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Image, Link, Text
} from 'components/ui';
import UIUtils from 'utils/UI';
import Empty from 'constants/empty';
import { radii, shadows, mediaQueries } from 'style/config';
import { useNavigateTo } from 'components/CreatorStoreFront/helpers/csfNavigation';
import isFunction from 'utils/functions/isFunction';

const { SKELETON_ANIMATION } = UIUtils;

const DEFAULT_IMG_SRC = '/img/ufe/image-error.svg';

const handleImageError = e => (e.target.src = DEFAULT_IMG_SRC);

const titleClampStyle = (isTextLineClamp = false) => ({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 1,
    whiteSpace: 'nowrap',
    ...(isTextLineClamp &&
    {
        [mediaQueries.smMax]: {
            WebkitLineClamp: 2,
            whiteSpace: 'pre-wrap'
        }
    })
});

const renderSkeleton = () => (
    <Flex
        position='relative'
        flexDirection='column'
        alignItems='center'
        backgroundColor='white'
        borderRadius={1}
        boxShadow={shadows.light}
        overflow='hidden'
        flexShrink={0}
        width={[168, null, 240]}
        height={[220, null, 280]}
    >
        <Flex
            justifyContent='center'
            alignItems='center'
            paddingY={2}
            paddingX='9px'
            width={[168, null, 240]}
            height={[168, null, 240]}
        >
            <Flex
                flexDirection='column'
                gap={1}
            >
                {[0, 1].map(row => (
                    <Flex
                        key={row}
                        flexDirection='row'
                        gap={1}
                    >
                        {[0, 1].map(col => (
                            <Box
                                key={`${row}-${col}`}
                                width={[78, null, 107]}
                                height={[78, null, 107]}
                                borderRadius={1}
                                backgroundColor='lightGray'
                                css={SKELETON_ANIMATION}
                            />
                        ))}
                    </Flex>
                ))}
            </Flex>
        </Flex>

        <Box
            width='80%'
            height='18px'
            backgroundColor='midGray'
            borderRadius={2}
            css={SKELETON_ANIMATION}
            marginTop={2}
        />
    </Flex>
);

const renderThumbnails = (thumbnails, imageSize) => {
    return thumbnails.map(
        ({ thumbnailUrl }, i) =>
            thumbnailUrl && (
                <Image
                    key={thumbnailUrl}
                    src={thumbnailUrl}
                    alt={`Thumbnail ${i + 1}`}
                    size={imageSize}
                    onError={handleImageError}
                />
            )
    );
};

const CollectionTile = ({
    item, isLoading, handle, isSmallTile, nextPageDataCB
}) => {
    const dispatch = useDispatch();
    const { navigateTo } = useNavigateTo(dispatch);

    const {
        collectionId,
        tileProductThumbnails = Empty.Array,
        taggedProductCount = 0,
        title = Empty.String,
        customCoverImageUrl
    } = item || Empty.Object;

    const thumbnails = tileProductThumbnails.slice(0, 4);

    const handleCollectionClick = async event => {
        event.preventDefault();
        const path = `/creators/${handle}/collections/${collectionId}`;

        isFunction(nextPageDataCB) && nextPageDataCB();

        await navigateTo(path, false, true);
    };

    if (isLoading) {
        return renderSkeleton();
    }

    const containerSize = isSmallTile ? [168, null, 240] : 240;
    const imageSize = isSmallTile ? [78, null, 107] : 107;
    const paddingSize = isSmallTile ? [1, null, 2] : 2;

    return (
        <Link
            underline={false}
            display='flex'
            flexDirection='column'
            overflow='hidden'
            width='100%'
            height='100%'
            css={{ position: 'relative', borderRadius: radii[2], boxShadow: shadows.light }}
            onClick={handleCollectionClick}
        >
            {taggedProductCount > 0 && (
                <Flex
                    alignItems='center'
                    gap={1}
                    position='absolute'
                    top={isSmallTile ? [138, null, 210] : 210}
                    left='6px'
                    paddingY={1}
                    paddingX={2}
                    borderRadius={1}
                    backgroundColor='rgba(255, 255, 255, 0.80)'
                    zIndex={1}
                >
                    <Image
                        src='/img/ufe/csf/product-count-icon.svg'
                        alt='Product Count Icon'
                        size={16}
                        disableLazyLoad
                        isPageRenderImg
                    />
                    <Text
                        fontSize='xs'
                        color='black'
                        children={taggedProductCount}
                    />
                </Flex>
            )}

            {customCoverImageUrl ? (
                <Box
                    is='figure'
                    width={containerSize}
                    height={containerSize}
                    backgroundColor={'white'}
                >
                    {/* Custom Cover Image */}
                    <Image
                        src={customCoverImageUrl}
                        alt={title}
                        size={containerSize}
                        css={{ objectFit: 'cover' }}
                    />
                </Box>
            ) : (
                <Flex
                    flexWrap='wrap'
                    padding={paddingSize}
                    gap={paddingSize}
                    width={containerSize}
                    height={containerSize}
                    minHeight={containerSize}
                >
                    {renderThumbnails(thumbnails, imageSize)}
                </Flex>
            )}

            <Flex
                alignItems='center'
                width='100%'
                height='100%'
                padding={2}
            >
                <Text
                    is='h3'
                    lineHeight='18px'
                    css={titleClampStyle(isSmallTile)}
                    children={title}
                />
            </Flex>
        </Link>
    );
};

export default wrapFunctionalComponent(CollectionTile, 'CollectionTile');
