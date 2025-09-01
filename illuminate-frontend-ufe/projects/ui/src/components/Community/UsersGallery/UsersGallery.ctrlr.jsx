import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import getProfileApi from 'services/api/profile/getProfile';

import { Container, Divider } from 'components/ui';
import { colors, space } from 'style/config';
import UsersGalleryTopSection from 'components/Community/UsersGallery/UsersGalleryTopSection';
import UsersGalleryGridSection from 'components/Community/UsersGallery/UsersGalleryGridSection';
import CommunityPageBindings from 'analytics/bindingMethods/pages/community/CommunityPageBindings';
import anaConsts from 'analytics/constants';

import pixleeUtils from 'utils/pixlee';

const { getApprovedContentFromAlbum, getApprovedContentCount } = pixleeUtils;
const { getPublicProfileByNickname } = getProfileApi;
let galleryItems = [];

class UsersGallery extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            showSkeleton: true,
            publicUserProfile: {},
            showMoreButton: true,
            contentCount: 0
        };
    }

    getPublicUserNickName = prevProps => {
        const { path } = prevProps || this.props;
        const splitPath = path && path.split('/');

        return splitPath && splitPath[splitPath.length - 1];
    };

    getPublicUserProfile = nickName => {
        getPublicProfileByNickname(nickName).then(data => {
            this.setState({
                publicUserProfile: { isInitialized: true, nickName, ...data }
            });
        });
    };

    componentDidMount() {
        const nickName = this.getPublicUserNickName();

        if (this.props.isUserPublicGallery && nickName) {
            this.getPublicUserProfile(nickName);
        }

        this.getGalleryItems();
        const pageName = this.props.isUserPublicGallery ? anaConsts.PAGE_NAMES.COMMUNITY_USER_GALLERY : anaConsts.PAGE_NAMES.COMMUNITY_MY_GALLERY;
        CommunityPageBindings.setPageLoadAnalytics(pageName);
    }

    getContentCount = () => {
        const userId = this.props.user.profileId;
        const options = {
            filters: {
                approved: true,
                /* eslint-disable-next-line camelcase */
                vendor_id: userId
            }
        };

        if (userId) {
            return getApprovedContentCount(Sephora.configurationSettings.exploreGalleryAlbumId, options);
        }

        return null;
    };

    getUserId = () => {
        return this.getPublicUserNickName() && this.props.isUserPublicGallery ? this.state.publicUserProfile?.profileId : this.props.user.profileId;
    };

    getGalleryItems = (loadMore = false) => {
        const userId = this.getUserId();
        const pageNumber = loadMore ? this.state.pageNumber + 1 : this.state.pageNumber;
        const options = {
            page: pageNumber,
            photosPerPage: 30,
            filters: {
                approved: true,
                /* eslint-disable-next-line camelcase */
                vendor_id: userId
            }
        };

        if (userId) {
            getApprovedContentFromAlbum(Sephora.configurationSettings.exploreGalleryAlbumId, options).then(data => {
                const prevPageNUmber = this.state.pageNumber;
                const contentCount = this.getContentCount();
                contentCount &&
                    contentCount.then(contentCountData => {
                        this.setState(
                            {
                                contentCount: contentCountData ? contentCountData.count : 0,
                                pageNumber,
                                showSkeleton: false,
                                showMoreButton: data.next
                            },
                            () => {
                                galleryItems = galleryItems && pageNumber !== prevPageNUmber ? [...galleryItems, ...data.data] : data.data;
                                this.props.setGalleryGridItems(galleryItems);
                            }
                        );
                    });
            });
        } else if (this.state.showSkeleton) {
            this.setState({
                showSkeleton: false
            });
            this.props.setGalleryGridItems([]);
        }
    };

    loadMorePhotos = () => {
        this.getGalleryItems(true);
    };

    componentDidUpdate(prevProps, prevState) {
        const nickName = this.getPublicUserNickName();
        const prevNickName = this.getPublicUserNickName(prevProps);

        if (
            this.props.isUserPublicGallery &&
            ((nickName && Object.keys(this.state.publicUserProfile).length === 0) ||
                this.state.publicUserProfile?.profileId !== prevState.publicUserProfile.profileId)
        ) {
            if (prevNickName !== nickName) {
                this.getPublicUserProfile(nickName);
            }

            this.getGalleryItems();
        }

        if (!this.props.isUserPublicGallery && this.props.user.profileId !== prevProps.user.profileId) {
            this.getGalleryItems();
        }

        if (!this.props.isUserPublicGallery && this.props.user.login && !this.props.user.profileId && this.state.showSkeleton) {
            this.setState({
                showSkeleton: false
            });
            this.props.setGalleryGridItems([]);
        }
    }

    render() {
        const { isUserPublicGallery = false, user, locale } = this.props;
        const userData = isUserPublicGallery ? this.state.publicUserProfile : user;

        return (
            <Container paddingX={2}>
                <UsersGalleryTopSection
                    isUserPublicGallery={isUserPublicGallery}
                    showSkeleton={this.state.showSkeleton}
                    user={userData}
                    contentCount={this.state.contentCount}
                    locale={locale}
                />

                <Divider
                    mx={`-${space[2]}px`}
                    height={`${space[2]}px solid`}
                    color={colors.nearWhite}
                />

                <UsersGalleryGridSection
                    isUserPublicGallery={isUserPublicGallery}
                    user={userData}
                    locale={locale}
                    galleryItems={this.props.galleryItems}
                    showSkeleton={this.state.showSkeleton}
                    showMoreButton={this.state.showMoreButton}
                    loadMorePhotos={this.loadMorePhotos}
                    getGalleryItems={this.getGalleryItems}
                />
            </Container>
        );
    }
}

export default wrapComponent(UsersGallery, 'UsersGallery', true);
