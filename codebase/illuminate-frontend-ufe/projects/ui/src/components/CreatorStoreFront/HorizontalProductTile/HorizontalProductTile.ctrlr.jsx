import React from 'react';
import { wrapComponent } from 'utils/framework';
import ProductTile from 'components/Catalog/ProductGrid/ProductTile/ProductTile';
import {
    colors, fontSizes, fontWeights, radii, shadows
} from 'style/config';
import {
    Box, Flex, Image, Text, Link
} from 'components/ui';
import StarRating from 'components/StarRating/StarRating';
import ReviewCount from 'components/Product/ReviewCount';
import Location from 'utils/Location';
import UIUtils from 'utils/UI';
import isFunction from 'utils/functions/isFunction';

const { SKELETON_ANIMATION } = UIUtils;

const SkeletonPiece = ({ width, height }) => {
    return (
        <Box
            css={{
                ...SKELETON_ANIMATION,
                width,
                height,
                backgroundColor: colors.lightGray,
                borderRadius: radii[2]
            }}
        />
    );
};

const TextWithEllipsis = ({
    children, fontSize, fontWeight, title, singleLine
}) => {
    return (
        <Text
            is='div'
            fontSize={fontSize}
            fontWeight={fontWeight}
            color={colors.black}
            lineHeight='16px'
            width='100%'
            title={title}
            css={{
                WebkitLineClamp: singleLine ? 1 : 2,
                WebkitBoxOrient: 'vertical',
                display: '-webkit-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}
        >
            {children}
        </Text>
    );
};

const PriceDetails = ({ currentSku }) => {
    return (
        <Flex
            flexDirection='column'
            alignItems='flex-end'
            width='100px'
            flexShrink={0}
            lineHeight='18px'
        >
            {currentSku.salePrice && (
                <Text
                    is='strong'
                    color={colors.red}
                    children={`${currentSku.salePrice}`}
                />
            )}
            <Text
                is={!currentSku.salePrice ? 'strong' : 'span'}
                css={currentSku.salePrice ? { textDecoration: 'line-through' } : {}}
                children={`${currentSku.listPrice}`}
            />
        </Flex>
    );
};

const ViewDetails = ({ viewDetails, onClick }) => {
    return (
        <Link
            onClick={onClick}
            color={colors.link}
            children={viewDetails}
        />
    );
};

class HorizontalProductTile extends ProductTile {
    handleCardClick = e => {
        e?.preventDefault();

        const { product, trackCSFProductClick, updateAttributionData } = this.props;

        isFunction(trackCSFProductClick) && trackCSFProductClick();
        isFunction(updateAttributionData) && updateAttributionData();

        // CSF needs an additinal wait time to fire SOT events before redirecting to targetUrl
        setTimeout(() => Location.navigateTo(e, product?.targetUrl), 2000);
    };

    handleViewDetailsClick = e => {
        e.stopPropagation();
        this.handleQuicklookClick(e);
    };

    handleKeyDown = e => {
        if (e.key === 'Enter' || e.key === ' ') {
            this.handleCardClick(e);
        }
    };

    handleViewDetailsKeyDown = e => {
        if (e.key === 'Enter') {
            this.handleViewDetailsClick(e);
        }
    };

    renderSkeleton = () => (
        <Flex
            paddingY={3}
            paddingX={4}
            backgroundColor={colors.white}
            borderRadius={radii[2]}
            boxShadow={shadows.light}
            width='350px'
            flexShrink={0}
            overflow='hidden'
            alignItems='flex-start'
            gap={3}
        >
            <Box flexShrink={0}>
                <SkeletonPiece
                    width='60px'
                    height='60px'
                />
            </Box>

            <Flex
                width='239px'
                height='150px'
                justifyContent='space-between'
            >
                <Flex
                    flexDirection='column'
                    alignItems='flex-start'
                    flex={1}
                    gap={1}
                    minWidth={0}
                >
                    <SkeletonPiece
                        width='100%'
                        height='16px'
                    />
                    <SkeletonPiece
                        width='100%'
                        height='32px'
                    />
                    <SkeletonPiece
                        width='100%'
                        height='12px'
                    />
                    <SkeletonPiece
                        width='68px'
                        height='12px'
                    />
                    <Box width='100%'>
                        <SkeletonPiece
                            width='130px'
                            height='32px'
                        />
                    </Box>
                </Flex>

                <Flex
                    flexDirection='column'
                    alignItems='flex-end'
                    justifyContent='space-between'
                    width='100px'
                >
                    <SkeletonPiece
                        width='60px'
                        height='18px'
                    />
                    <SkeletonPiece
                        width='100px'
                        height='20px'
                    />
                </Flex>
            </Flex>
        </Flex>
    );

    renderContent = () => {
        const { product, textResources, updateAttributionData } = this.props;
        const {
            brandName, displayName, currentSku, heroImage, productId, motomProductId
        } = product || {};
        const { viewDetails, addToBasket } = textResources || {};

        return (
            <Flex
                flexDirection='column'
                paddingX={4}
                paddingY={3}
                backgroundColor={colors.white}
                borderRadius={2}
                boxShadow={shadows.light}
                width={['100%', null, 343]}
                height={150}
                flexShrink={0}
                overflow='hidden'
                alignItems='flex-start'
                position={'relative'}
                cursor='pointer'
                onClick={this.handleCardClick}
                role='button'
                tabIndex={0}
                justifyContent={'space-between'}
                onKeyDown={this.handleKeyDown}
                data-tracking-id={productId}
                data-motom-tracking-id={motomProductId}
            >
                <Flex width='100%'>
                    <Box
                        flexShrink={0}
                        marginRight={3}
                    >
                        <Image
                            src={heroImage}
                            alt={displayName}
                            size={60}
                            borderRadius={2}
                            objectFit='cover'
                            backgroundColor={colors.lightGray}
                        />
                    </Box>
                    <Flex
                        width='100%'
                        justifyContent='space-between'
                    >
                        <Flex
                            flexDirection='column'
                            alignItems='flex-start'
                            flex='1 1 auto'
                            gap='2px'
                            minWidth={0}
                            width='100%'
                        >
                            <TextWithEllipsis
                                fontSize={fontSizes.sm}
                                fontWeight={fontWeights.bold}
                                singleLine={true}
                            >
                                {brandName}
                            </TextWithEllipsis>

                            <TextWithEllipsis
                                fontSize={fontSizes.sm}
                                fontWeight={fontWeights.normal}
                                title={displayName}
                            >
                                {displayName}
                            </TextWithEllipsis>

                            <Text
                                is='div'
                                fontSize={fontSizes.xs}
                                color={colors.gray}
                                lineHeight='14px'
                                width='100%'
                            >
                                {currentSku?.size || currentSku?.variationValue}
                            </Text>

                            {(product?.rating || product?.reviews) && (
                                <Flex
                                    alignItems='center'
                                    fontSize={fontSizes.xs}
                                    gap='2px'
                                    width='100%'
                                >
                                    <StarRating
                                        size='1em'
                                        rating={product?.rating || 0}
                                    />
                                    <ReviewCount
                                        fontSize={fontSizes.sm}
                                        color={colors.black}
                                        productReviewCount={product?.reviews || 0}
                                    />
                                </Flex>
                            )}
                        </Flex>
                        <PriceDetails currentSku={currentSku} />
                    </Flex>
                </Flex>
                <Flex
                    paddingLeft={'72px'}
                    width='100%'
                    justifyContent={'space-between'}
                    alignItems={'baseline'}
                >
                    <Box minWidth={['124px', '130px']}>
                        {this.renderAddToBasketButton({
                            product,
                            addToBasket,
                            paddingTop: 2,
                            customStyle: { width: 130 },
                            updateAttributionData
                        })}
                    </Box>
                    <ViewDetails
                        viewDetails={viewDetails}
                        onClick={this.handleViewDetailsClick}
                    />
                </Flex>
            </Flex>
        );
    };

    render() {
        const { isSkeleton } = this.props;

        return isSkeleton ? this.renderSkeleton() : this.renderContent();
    }
}

export default wrapComponent(HorizontalProductTile, 'HorizontalProductTile', true);
