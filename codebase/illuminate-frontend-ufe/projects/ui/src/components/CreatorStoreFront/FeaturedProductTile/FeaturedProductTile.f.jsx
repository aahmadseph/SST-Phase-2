import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { radii, shadows } from 'style/config';
import UIUtils from 'utils/UI';
import Empty from 'constants/empty';
import {
    Box, Flex, Image, Link, Text
} from 'components/ui';
import { trackProductClick } from 'components/CreatorStoreFront/helpers/csfEventHelpers';
import { updateAttributionWithProductId } from 'components/CreatorStoreFront/helpers/csfAttribution';
import Location from 'utils/Location';
import isFunction from 'utils/functions/isFunction';

const { SKELETON_ANIMATION } = UIUtils;
const DEFAULT_IMG_SRC = '/img/ufe/image-error.svg';

const handleImageError = e => (e.target.src = DEFAULT_IMG_SRC);

const titleClampStyle = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 1,
    whiteSpace: 'nowrap'
};

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

function FeaturedProductTile({ item, isLoading, referralOwnerId, nextPageDataCB }) {
    // Handle skeleton loading state
    if (isLoading || !item || !item.productId) {
        return renderSkeleton();
    }

    const {
        productId, motomProductId, productName = Empty.String, targetUrl, heroImage, image250
    } = item;

    const handleProductClick = async event => {
        event.preventDefault();

        trackProductClick({
            referralOwnerId,
            productId,
            targetUrl,
            motomProductId,
            isFeaturted: true
        });

        updateAttributionWithProductId(motomProductId);

        isFunction(nextPageDataCB) && nextPageDataCB();

        // CSF needs an additinal wait time to fire SOT events before redirecting to targetUrl
        setTimeout(() => Location.navigateTo(event, targetUrl), 2000);
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
            onClick={handleProductClick}
        >
            <Flex
                alignItems={'center'}
                justifyContent={'center'}
                width={240}
                height={240}
                css={{ minHeight: '240px' }}
            >
                <Box
                    is='figure'
                    position={'relative'}
                    width={224}
                    height={224}
                    backgroundColor={'white'}
                >
                    {/* thumbnail */}
                    <Image
                        src={heroImage || image250}
                        alt={productName}
                        size={224}
                        css={{ objectFit: 'cover' }}
                        onError={handleImageError}
                    />
                </Box>
            </Flex>

            {/* productName */}
            <Flex
                alignItems='center'
                width='100%'
                height='100%'
                padding={2}
            >
                <Text
                    is='h3'
                    lineHeight='18px'
                    css={titleClampStyle}
                    children={productName}
                />
            </Flex>
        </Link>
    );
}

export default wrapFunctionalComponent(FeaturedProductTile, 'FeaturedProductTile');
