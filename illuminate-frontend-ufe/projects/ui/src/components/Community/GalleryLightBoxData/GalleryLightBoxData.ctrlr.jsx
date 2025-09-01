import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { mediaQueries, fontWeights } from 'style/config';
import galleryApi from 'services/api/gallery';
import dateUtils from 'utils/Date';
import pixleeUtils from 'utils/pixlee';
import userUtils from 'utils/User';
import galleryConstants from 'utils/GalleryConstants';
import Debounce from 'utils/Debounce';
import {
    Flex, Text, Icon, Divider, Image
} from 'components/ui';
import IncentivizedBadge from 'components/ProductPage/IncentivizedBadge/IncentivizedBadge';
import GalleryCommunityUser from 'components/Community/GalleryCommunityUser';
import ShopThisPostCarousel from 'components/Community/ShopThisPostCarousel';
import CommunityPageBindings from 'analytics/bindingMethods/pages/community/CommunityPageBindings';

const { loveInteractions } = galleryConstants;
const { checkUserBeforeActions } = pixleeUtils;
const { setLoveMedia, deleteLoveMedia } = galleryApi;

class GalleryLightBoxData extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showSkeleton: true
        };
    }

    handleLoveClick = () => {
        const currentItem = this.props.sharedItem || this.props.items[this.props.activeItem];

        if (currentItem?.loves?.isLovedByCurrentUser) {
            deleteLoveMedia(this.props.user.login, currentItem.album_photo_id).then(() => {
                this.props.setLovesOnItems({ currentItem, action: loveInteractions.UNLOVE, isGalleryCarousel: this.props.isGalleryCarousel });
            });
        } else {
            checkUserBeforeActions().then(() => {
                userUtils.getUser().then(user => {
                    setLoveMedia(currentItem.album_photo_id, user.login).then(() => {
                        this.props.setLovesOnItems({ currentItem, action: loveInteractions.LOVE, isGalleryCarousel: this.props.isGalleryCarousel });
                    });
                });
            });
        }
    };

    handleLoveImageClick = currentItem => () => {
        const isLoggedInUserPhoto = currentItem?.vendor_id === this.props.user?.profileId;
        this.props.toggleGalleryLightBoxKebabModal({ isOpen: true, photoId: currentItem?.album_photo_id, isLoggedInUserPhoto });
    };

    fireAnalytics = (activeItem = {}) => {
        const {
            album_photo_id: albumId, content_type: contentType, user_name: userName, source, products, loves, categories
        } = activeItem;
        const params = {
            albumId,
            contentType,
            isIncentivized: categories?.includes('Incentivized'),
            userName,
            source,
            products,
            loves: loves?.count || 0
        };
        CommunityPageBindings.setLightBoxAnalytics(params, true);
    };

    debouncedhandleLoveClick = Debounce.preventDoubleClick(this.handleLoveClick);

    componentDidUpdate(prevProps) {
        if (this.props.activeItem !== prevProps.activeItem) {
            this.fireAnalytics(this.props.items[this.props.activeItem]);
            this.setState({
                showSkeleton: true
            });
        }
    }

    renderDateAndCaption = currentItem => {
        const isIncentivized = currentItem.categories?.includes('Incentivized');

        return (
            <div css={{ marginTop: '10' }}>
                <Flex
                    alignItems='center'
                    gap='6px'
                >
                    {currentItem?.created_at && (
                        <Text
                            is='p'
                            fontSize='sm'
                            lineHeight='14px'
                            color='gray'
                        >
                            {dateUtils.formatDateMDY(new Date(currentItem.created_at)?.toISOString(), true)}
                        </Text>
                    )}
                    {isIncentivized && (
                        <IncentivizedBadge
                            tooltipProps={{
                                side: 'bottom',
                                stopPropagation: true
                            }}
                            isOverlay={false}
                        />
                    )}
                </Flex>
                <Text
                    is='p'
                    fontSize='base'
                    lineHeight='18px'
                    paddingTop='2px'
                >
                    {currentItem?.photo_title || ''}
                </Text>
            </div>
        );
    };

    renderLoves = currentItem => {
        return (
            <Flex gap='16px'>
                <Flex>
                    <Icon
                        data-at={Sephora.debug.dataAt('love_icon_large')}
                        name={currentItem?.loves?.isLovedByCurrentUser ? 'heart' : 'heartOutline'}
                        size={24}
                        color={'black'}
                        alt={'loves'}
                        css={{ cursor: 'pointer' }}
                        onClick={this.debouncedhandleLoveClick}
                    />
                    <Text
                        display='block'
                        fontWeight={fontWeights.bold}
                        children={currentItem?.loves?.count || 0}
                        css={{ width: '21px', height: '14px', paddingLeft: '6px', wordWrap: 'normal' }}
                    />
                </Flex>
                <Image
                    src='/img/ufe/icons/kebab.svg'
                    size={24}
                    color='white'
                    tabIndex={0}
                    css={{ cursor: 'pointer' }}
                    onClick={this.handleLoveImageClick(currentItem)}
                />
            </Flex>
        );
    };

    render() {
        const currentItem = this.props.sharedItem || this.props.items[this.props.activeItem];

        return (
            <div
                css={styles.container}
                data-at={Sephora.debug.dataAt('gallery_lightBoxData')}
            >
                <Flex justifyContent='space-between'>
                    <GalleryCommunityUser
                        user={this.props.user}
                        item={currentItem}
                        userNickname={currentItem?.user_name}
                    />
                    {this.renderLoves(currentItem)}
                </Flex>
                {this.renderDateAndCaption(currentItem)}
                {currentItem?.products?.length > 0 && (
                    <>
                        <Divider marginY={[4, 5]} />
                        <ShopThisPostCarousel item={currentItem} />
                    </>
                )}
            </div>
        );
    }
}

const styles = {
    container: {
        paddingTop: '24px',
        paddingLeft: '16px',
        paddingRight: '16px',
        [mediaQueries.sm]: {
            flexBasis: '60%',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '10px'
        }
    }
};

export default wrapComponent(GalleryLightBoxData, 'GalleryLightBoxData', true);
