/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Flex, Image, Icon, Text, Box
} from 'components/ui';
import { fontWeights, mediaQueries } from 'style/config';
import IncentivizedBadge from 'components/ProductPage/IncentivizedBadge/IncentivizedBadge';
import uiUtils from 'utils/UI';
import galleryAPI from 'services/api/gallery';
import pixleeUtils from 'utils/pixlee';
import galleryConstants from 'utils/GalleryConstants';
import Location from 'utils/Location';
import Debounce from 'utils/Debounce';
import CommunityPageBindings from 'analytics/bindingMethods/pages/community/CommunityPageBindings';
import CommunityGalleryBindings from 'analytics/bindingMethods/pages/community/CommunityGalleryBindings';
import anaConsts from 'analytics/constants';
import mediaUtils from 'utils/Media';

const { SKELETON_ANIMATION } = uiUtils;
const { setLoveMedia, deleteLoveMedia } = galleryAPI;
const { checkUserBeforeActions } = pixleeUtils;
const { loveInteractions } = galleryConstants;
const { Media } = mediaUtils;

class GalleryCard extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isLovedByUser: this.props.loves?.isLovedByCurrentUser,
            numberOfLoves: this.props.loves?.count || 0
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id || this.props.loves?.count !== prevProps.loves?.count) {
            const { loves: { isLovedByCurrentUser = false, count = 0 } = {} } = this.props;
            this.setState({
                isLovedByUser: isLovedByCurrentUser,
                numberOfLoves: count
            });
        }
    }

    convertLoves = num => {
        if (num < 1000) {
            return num;
        } else if (num >= 1000 && num < 10000) {
            const thousands = Math.floor(num / 1000);
            const hundreds = num % 1000;

            if (hundreds === 0) {
                return `${thousands}K`;
            } else if (hundreds >= 100) {
                return `${thousands}.${Math.floor(hundreds / 100)}k`;
            } else {
                return `${thousands}K`;
            }
        } else if (num >= 10000 && num < 100000) {
            const tenThousands = Math.floor(num / 1000);

            return `${tenThousands}K`;
        } else {
            return '';
        }
    };

    getClassNameForMasonry = (height, inCarousel) => {
        let classNameForMasonryEffect = '';

        if (height > 2000) {
            classNameForMasonryEffect = 'large';
        } else if (height > 1000 && height <= 2000) {
            classNameForMasonryEffect = 'medium';
        } else if (height <= 1000 || !height) {
            classNameForMasonryEffect = 'small';
        }

        if (inCarousel) {
            classNameForMasonryEffect = 'small';
        }

        return classNameForMasonryEffect;
    };

    handleLoveClick = event => {
        event.stopPropagation();
        const { inCarousel } = this.props;

        if (this.state.isLovedByUser) {
            deleteLoveMedia(this.props.userLogin, this.props.album_photo_id).then(() => {
                this.props.setLovesOnItems({ currentItem: this.props, action: loveInteractions.UNLOVE, isGalleryCarousel: inCarousel });
            });
        } else {
            checkUserBeforeActions().then(() => {
                setLoveMedia(this.props.album_photo_id, this.props.userLogin).then(() => {
                    this.props.setLovesOnItems({ currentItem: this.props, action: loveInteractions.LOVE, isGalleryCarousel: inCarousel });
                });
            });
        }
    };

    debouncedhandleLoveClick = Debounce.preventDoubleClick(this.handleLoveClick);

    handleCardClick = inCarousel => () => {
        const {
            album_photo_id: albumId,
            content_type: contentType,
            user_name: userName,
            source,
            products,
            loves,
            categories,
            analyticsCardName
        } = this.props;
        this.props.setActiveGalleryItemIndex(this.props.index);
        this.props.toggleGalleryLightBox({
            isGalleryCarousel: inCarousel,
            display: true,
            activeItem: this.props.id
        });
        const params = {
            albumId,
            contentType,
            isIncentivized: categories?.includes('Incentivized'),
            userName,
            source,
            products,
            loves: loves?.count || 0
        };

        CommunityPageBindings.setLightBoxAnalytics(params);

        if (analyticsCardName === anaConsts.CARD_NAMES.UGC_IMAGE) {
            CommunityGalleryBindings.ugcImageClick();
        }
    };

    renderIncentivizedBadge = isSmallScreen => {
        const tooltipProps = {
            side: 'top',
            stopPropagation: true,
            isFixed: isSmallScreen
        };

        return (
            <IncentivizedBadge
                tooltipProps={tooltipProps}
                isOverlay={true}
            />
        );
    };

    // eslint-disable-next-line complexity
    render() {
        const {
            user_name: userName = '',
            source = '',
            content_type: contentType = '',
            categories = [],
            products = [],
            thumbnail_url: thumbnail = '',
            pixlee_cdn_photos: { original_url: originalUrl = '' } = {},
            height,
            alt_text: altText = '',
            showSkeleton,
            inCarousel = false,
            title = '',
            localization: { love, unlove, loves, playVideo } = {},
            video_settings: { thumbnail_url: customThumbnail } = {}
        } = this.props;

        const username = !inCarousel && userName?.length >= 12 ? userName?.substring(0, 12) + '...' : userName;
        const sanitizedAltText = decodeURIComponent(altText);
        const sanitizedTitle = decodeURIComponent(title);
        const icon = `/img/ufe/icons/${source.toLowerCase() === 'desktop' ? 'community-gallery' : `${source.toLowerCase()}-ko`}.svg`;
        const isVideo = contentType?.toLowerCase() === 'video';
        const isIncentivized = categories?.includes('Incentivized');
        const numberOfProducts = products?.length;
        let marginLeft = '8px';

        if (numberOfProducts === 2) {
            marginLeft = '-2px';
        } else if (numberOfProducts >= 3) {
            marginLeft = '-12px';
        }

        const imageSource = isVideo ? customThumbnail ?? thumbnail : originalUrl;
        const hasProducts = numberOfProducts > 0;
        const className = this.getClassNameForMasonry(height, inCarousel);
        let bottomScrim;

        if (className === 'small') {
            bottomScrim = hasProducts && isIncentivized ? '12px' : hasProducts && !isIncentivized ? '30px' : '50px';
        } else {
            bottomScrim = hasProducts && isIncentivized ? '42px' : hasProducts && !isIncentivized ? '65px' : '100px';
        }

        return (
            <Box
                css={showSkeleton ? SKELETON_ANIMATION : styles.tile}
                className={className}
                onClick={this.handleCardClick(inCarousel)}
                data-at={Sephora.debug.dataAt('gallery_card')}
            >
                {!showSkeleton && (
                    <Image
                        src={imageSource}
                        css={inCarousel ? [styles.img, Location.isProductPage() ? styles.imgPdp : styles.imgCarousel] : styles.img}
                        alt={sanitizedAltText}
                    />
                )}
                {showSkeleton && inCarousel && !Location.isProductPage() && <div css={[styles.imgCarousel, SKELETON_ANIMATION]} />}
                <Flex
                    flexDirection='row'
                    justifyContent='space-between'
                    position='absolute'
                    top='0'
                    right='0'
                    left='0'
                    paddingX={2}
                    paddingTop={2}
                    paddingBottom={className === 'small' ? '30px' : '48px'}
                    css={!showSkeleton && styles.userDetails}
                >
                    <Text
                        is='h4'
                        position='absolute'
                        color='white'
                        fontSize='sm'
                        fontWeight={fontWeights.bold}
                        tabIndex={0}
                    >
                        {username}
                    </Text>
                    <Image
                        src={icon}
                        size={15}
                        alt={source}
                        color='white'
                        tabIndex={0}
                    />
                </Flex>
                {isVideo && (
                    <div
                        css={styles.playIcon}
                        tabIndex={0}
                        role='button'
                        aria-label={playVideo}
                    >
                        <Image
                            src='/img/ufe/icons/play.svg'
                            color='white'
                            size={32}
                        />
                    </div>
                )}
                <Flex
                    css={[styles.bottomContainer, !showSkeleton && styles.bottomScrim]}
                    paddingTop={bottomScrim}
                >
                    <div
                        className='flex-child'
                        css={{ flexBasis: '80%' }}
                    >
                        {isIncentivized && (
                            <div className='incentivized'>
                                <Media greaterThan='xs'>{this.renderIncentivizedBadge(false)}</Media>
                                <Media lessThan='sm'>{this.renderIncentivizedBadge(true)}</Media>
                            </div>
                        )}

                        {hasProducts && (
                            <Flex
                                flexDirection='row'
                                alignItems='center'
                                className='products-container-flex'
                            >
                                <Flex className='products-container'>
                                    {products.slice(0, 3).map(product => (
                                        <Image
                                            src={product.image}
                                            size={22}
                                            className='product-image'
                                            css={styles.products}
                                        />
                                    ))}
                                </Flex>
                                <Flex>
                                    <Text
                                        color='white'
                                        css={{
                                            fontSize: '12px',
                                            marginLeft: `${marginLeft}`
                                        }}
                                        fontWeight={fontWeights.normal}
                                        tabIndex={0}
                                    >
                                        {`${numberOfProducts} product${numberOfProducts > 1 ? 's' : ''}`}
                                    </Text>
                                </Flex>
                            </Flex>
                        )}
                        {inCarousel && hasProducts && (
                            <Text
                                is='p'
                                fontSize='12px'
                                color='white'
                                px={2}
                                mb={3}
                                css={{
                                    'white-space': 'nowrap',
                                    overflow: 'hidden',
                                    'text-overflow': 'ellipsis'
                                }}
                                tabIndex={0}
                            >
                                {sanitizedTitle}
                            </Text>
                        )}
                    </div>
                    <div
                        className='flex-child'
                        css={{ flexBasis: '20%' }}
                    >
                        <div
                            css={styles.loves}
                            onClick={this.debouncedhandleLoveClick}
                            tabIndex={0}
                            role='button'
                            aria-label={this.state.isLovedByUser ? unlove : love}
                        >
                            <Icon
                                data-at={Sephora.debug.dataAt('love_icon_large')}
                                name={this.state.isLovedByUser ? 'heart' : 'heartOutline'}
                                size={18}
                                color={'white'}
                                alt={loves}
                                css={{
                                    ':hover': { opacity: '80%' }
                                }}
                            />
                            <Text
                                display='block'
                                color='white'
                                fontWeight={fontWeights.bold}
                            >
                                {this.convertLoves(this.state.numberOfLoves)}
                            </Text>
                        </div>
                    </div>
                </Flex>
            </Box>
        );
    }
}

const styles = {
    tile: {
        display: 'flex',
        justifyContent: 'center',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative',
        '.products-container-flex': {
            paddingLeft: '8px',
            paddingBottom: '8px',
            paddingTop: '8px'
        },
        '.products-container img:nth-child(2)': {
            transform: 'translate(-10px)'
        },
        '.products-container img:nth-child(3)': {
            transform: 'translate(-20px)'
        },
        '.incentivized': {
            marginLeft: '8px'
        },
        '.flex-child': {
            boxSizing: 'border-box',
            minWidth: '0',
            minHeight: '0'
        }
    },
    img: {
        maxWidth: '100%',
        minWidth: '100%',
        verticalAlign: 'top',
        objectFit: 'cover',
        height: '100%',
        width: '100%'
    },
    imgPdp: {
        height: '136px',
        [mediaQueries.sm]: {
            height: '188px'
        }
    },
    imgCarousel: {
        height: '315px'
    },
    userDetails: {
        backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 84.9%);'
    },
    playIcon: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    },
    IncentivizedAndProductsContainer: {
        position: 'absolute',
        left: '0',
        bottom: '0'
    },
    products: {
        borderRadius: '50%'
    },
    loves: {
        position: 'absolute',
        right: '0',
        bottom: '0',
        padding: '8px',
        textAlign: 'center',
        cursor: 'pointer'
    },
    bottomContainer: {
        flexWrap: 'wrap',
        position: 'absolute',
        bottom: '0',
        left: 0,
        width: '100%'
    },
    bottomScrim: {
        backgroundImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 51.56%)'
    }
};

export default wrapComponent(GalleryCard, 'GalleryCard', true);
