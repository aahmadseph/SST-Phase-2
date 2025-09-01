import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigateTo } from 'components/CreatorStoreFront/helpers/csfNavigation';
import { wrapFunctionalComponent } from 'utils/framework';
import { radii, shadows, mediaQueries } from 'style/config';
import UIUtils from 'utils/UI';
import Empty from 'constants/empty';
import {
    Box, Flex, Image, Link, Text
} from 'components/ui';
import { trackPostClick } from 'components/CreatorStoreFront/helpers/csfEventHelpers';
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
        flexDirection='column'
        overflow='hidden'
        width='100%'
        height='100%'
        css={{ borderRadius: radii[2], boxShadow: shadows.light }}
        backgroundColor='white'
    >
        <Box
            width={[168, null, 240]}
            height={[168, null, 240]}
            backgroundColor='lightGray'
            css={SKELETON_ANIMATION}
        />

        <Flex
            alignItems='center'
            width='100%'
            height='40px'
            padding={2}
        >
            <Box
                width='80%'
                height='18px'
                backgroundColor='midGray'
                borderRadius={2}
                css={SKELETON_ANIMATION}
            />
        </Flex>
    </Flex>
);

function PostTile({
    handle, item, isSmallTile, isLoading, referralOwnerId, nextPageDataCB
}) {
    const dispatch = useDispatch();
    const { navigateTo } = useNavigateTo(dispatch);

    // Handle skeleton loading state
    if (isLoading || !item || !item.postId) {
        return renderSkeleton();
    }

    const {
        postId, title = Empty.String, media = Empty.Object, socialMedia, taggedProductCount = 0, productId
    } = item;

    const handlePostClick = async event => {
        event.preventDefault();
        const path = `/creators/${handle}/posts/${postId}`;

        trackPostClick({ postId, referralOwnerId, productId });

        isFunction(nextPageDataCB) && nextPageDataCB();

        await navigateTo(path, false, true);
    };

    return (
        <Link
            underline={false}
            display={'flex'}
            flexDirection={'column'}
            overflow={'hidden'}
            width={'100%'}
            height={'100%'}
            css={{ borderRadius: radii[2], boxShadow: shadows.light }}
            onClick={handlePostClick}
        >
            <Box
                is='figure'
                position={'relative'}
                width={isSmallTile ? [168, null, 240] : 240}
                height={isSmallTile ? [168, null, 240] : 240}
                backgroundColor={'white'}
            >
                {/* thumbnail */}
                <Image
                    src={media?.thumbnailUrl}
                    alt={title}
                    size={isSmallTile ? [168, null, 240] : 240}
                    css={{ objectFit: 'cover' }}
                    onError={handleImageError}
                />

                {/* social icon */}
                {socialMedia && (
                    <Flex
                        position={'absolute'}
                        top={'6px'}
                        right={'6px'}
                        alignItems={'center'}
                        padding={'2px'}
                        borderRadius={1}
                        backgroundColor={'rgba(255, 255, 255, 0.80)'}
                    >
                        <Image
                            src={`/img/ufe/csf/${socialMedia}.svg`}
                            alt={`${socialMedia} icon`}
                            size={20}
                        />
                    </Flex>
                )}

                {/* play icon */}
                {media?.type === 'video' && (
                    <Box
                        position={'absolute'}
                        top={'50%'}
                        left={'50%'}
                        css={{ transform: 'translate(-50%, -50%)' }}
                    >
                        <Image
                            src={'/img/ufe/csf/play.svg'}
                            alt='play icon'
                            size={36}
                        />
                    </Box>
                )}

                {/* tag-product count */}
                {taggedProductCount > 0 && (
                    <Box
                        position={'absolute'}
                        bottom={'6px'}
                        left={'6px'}
                        display={'inline-flex'}
                        alignItems={'center'}
                        gap={1}
                        paddingX={2}
                        paddingY={1}
                        borderRadius={1}
                        backgroundColor={'rgba(255, 255, 255, 0.80)'}
                        fontSize={'sm'}
                    >
                        <Image
                            src='/img/ufe/csf/product-count-icon.svg'
                            alt='tag-product count icon'
                            size={16}
                        />
                        <span>{taggedProductCount}</span>
                    </Box>
                )}
            </Box>

            {/* title */}
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
}

export default wrapFunctionalComponent(PostTile, 'PostTile');
