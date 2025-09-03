/* eslint-disable max-len */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Button } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import AboutMeSlideshow from 'components/RichProfile/UserProfile/common/AboutMeSlideshow/AboutMeSlideshow';
import CommunityRibbon from 'components/RichProfile/UserProfile/common/CommunityRibbon/CommunityRibbon';
import Groups from 'components/RichProfile/UserProfile/common/Groups/Groups';
import Conversations from 'components/RichProfile/UserProfile/common/Conversations/Conversations';
import Looks from 'components/RichProfile/UserProfile/common/Looks';
import RecentReviews from 'components/RichProfile/UserProfile/common/RecentReviews/RecentReviews';
import communityUtils from 'utils/Community';
import localeUtils from 'utils/LanguageLocale';
import profileApi from 'services/api/profile';
import lithiumApi from 'services/api/thirdparty/Lithium';
import bazaarVoiceApi from 'services/api/thirdparty/BazaarVoice';
import userUtils from 'utils/User';
import store from 'Store';
import anaConsts from 'analytics/constants';
import getProfile from 'services/api/profile/getProfile';
import pixleeUtils from 'utils/pixlee';

const { getApprovedContentFromAlbum, getApprovedContentCount } = pixleeUtils;
const { getPublicProfileByNickname } = getProfile;
const REVIEW_LIMIT = Sephora.isMobile() ? 1 : 2;
const SLIDE_WIDTH = Sephora.isDesktop() ? 665 : null;
const GROUPS_LIMIT = Sephora.isMobile() ? 2 : 4;
const CONVERSATIONS_LIMIT = Sephora.isMobile() ? 1 : 2;

class PublicProfile extends BaseClass {
    state = {
        numUserPhotos: 0,
        socialInfo: {
            recentMessages: [],
            totalGroups: 0
        },
        userReviews: { totalResults: 0 },
        isFollowButtonDisabled: false,
        loggedInUser: {}
    };

    //TODO: ILLUPH-88897 create a catch for getPublicUserProfile if errorCode 404 exists
    componentDidMount() {
        profileApi.getProfileIdentifiersByNickname(this.props.nickname).then(data => {
            const getUserReviews = bazaarVoiceApi.getUserReviews(data.profileId, REVIEW_LIMIT);
            const getPublicUserProfile = profileApi.getPublicProfileByNickname(data.nickName);

            const loggedInUser = store.getState().user;
            const auth = store.getState().auth;
            let getSocialInfo;

            if (auth.profileStatus === 0 || !loggedInUser.nickName) {
                getSocialInfo = lithiumApi.getPublicUserSocialInfo(data.nickName);
            } else {
                getSocialInfo = lithiumApi.getAuthenticatedUserSocialInfo(data.nickName);
            }

            //wait for social info.  If social info is unavailable, then show error page
            getSocialInfo
                .then(socialInfo => {
                    getUserReviews.then(userReviews => this.setState({ userReviews })).catch(error => error);

                    getPublicUserProfile.then(user => {
                        this.setState({
                            socialInfo,
                            user,
                            profileId: data.profileId,
                            publicId: data.publicId,
                            isBeingFollowed: socialInfo.socialProfile.isBeingFollowed,
                            followerCount: socialInfo.socialProfile.follower,
                            loggedInUser: loggedInUser
                        });
                    });

                    getPublicProfileByNickname(data.nickName).then(account => {
                        if (account.profileId) {
                            const contentOptions = {
                                page: 1,
                                photosPerPage: 4,
                                /* eslint-disable-next-line camelcase */
                                filters: { vendor_id: account.profileId, approved: true }
                            };
                            getApprovedContentFromAlbum(Sephora.configurationSettings.exploreGalleryAlbumId, contentOptions).then(items => {
                                this.setState({
                                    pixleeData: items.data
                                });
                            });
                            const contentCountOptions = {
                                filters: {
                                    approved: true,
                                    /* eslint-disable-next-line camelcase */
                                    vendor_id: data.profileId
                                }
                            };
                            getApprovedContentCount(Sephora.configurationSettings.exploreGalleryAlbumId, contentCountOptions)
                                .then(content => {
                                    this.setState({
                                        numUserPhotos: content?.count || 0
                                    });
                                })
                                .catch(() => {
                                    this.setState({
                                        numUserPhotos: 0
                                    });
                                });
                        }
                    });
                })
                .catch(() => {
                    this.props.handleError();
                });
        });

        //Analytics
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.COMMUNITY_PROFILE;
        digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.USER_PROFILE;
    }

    handleFollowClick = function () {
        const currentUser = store.getState().user;
        this.setState({ isFollowButtonDisabled: true });

        if (userUtils.isSocial() && !userUtils.isAnonymous()) {
            if (this.state.isBeingFollowed) {
                lithiumApi.unfollowUser(currentUser.nickName, this.state.socialInfo.socialProfile.id).then(() => {
                    this.setState({
                        followerCount: parseInt(this.state.followerCount) - 1,
                        isBeingFollowed: false,
                        isFollowButtonDisabled: false
                    });
                });
            } else {
                lithiumApi.followUser(currentUser.nickName, this.state.socialInfo.socialProfile.id).then(() => {
                    this.setState({
                        followerCount: parseInt(this.state.followerCount) + 1,
                        isBeingFollowed: true,
                        isFollowButtonDisabled: false
                    });
                });
            }
        }
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/UserProfile/PublicProfile/locales', 'PublicProfile');
        const { nickname } = this.props;
        const groupsData = this.state.socialInfo && this.state.socialInfo.groupsData;
        const conversationsData = this.state.socialInfo && this.state.socialInfo.conversationsData;

        return (
            <div>
                {!Sephora.isNodeRender && this.state.socialInfo.socialProfile && (
                    <div>
                        <AboutMeSlideshow
                            nickname={nickname}
                            socialProfile={this.state.socialInfo.socialProfile}
                            skinTone={this.state.user.skinTone}
                            skinType={this.state.user.skinType}
                            hairColor={this.state.user.hairColor}
                            eyeColor={this.state.user.eyeColor}
                            skinLabValue={this.state.user.labValue}
                            isMyProfile={false}
                            slideWidth={SLIDE_WIDTH}
                            followerCount={this.state.followerCount}
                            isSocialEnabled={this.state.user.isSocialEnabled}
                            isBiPrivate={this.state.user.biPrivate}
                        />
                        <CommunityRibbon
                            photoCount={this.state.numUserPhotos}
                            groupCount={this.state.socialInfo.groupsData.total}
                            postCount={this.state.socialInfo.conversationsData.total}
                            reviewCount={this.state.userReviews.totalResults}
                            userSocialId={this.state.socialInfo.socialProfile.id}
                            publicNickname={nickname}
                            publicId={this.state.publicId}
                            profileId={this.state.profileId}
                        />
                        <Box
                            paddingY={4}
                            backgroundColor='nearWhite'
                        >
                            <LegacyContainer>
                                <Box
                                    width='100%'
                                    maxWidth={SLIDE_WIDTH}
                                    marginX='auto'
                                >
                                    <LegacyGrid
                                        fill={true}
                                        gutter={4}
                                    >
                                        <LegacyGrid.Cell position='relative'>
                                            <Button
                                                variant='white'
                                                disabled={nickname === this.state.loggedInUser.nickName}
                                                onClick={() => {
                                                    communityUtils
                                                        .ensureUserIsReadyForSocialAction(communityUtils.PROVIDER_TYPES.lithium)
                                                        .then(() => {
                                                            this.handleFollowClick();
                                                        });
                                                }}
                                                block={true}
                                            >
                                                {getText(this.state.isBeingFollowed ? 'unfollow' : 'follow')}
                                            </Button>
                                            {this.state.isFollowButtonDisabled && (
                                                <div
                                                    css={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        left: 0
                                                    }}
                                                />
                                            )}
                                        </LegacyGrid.Cell>
                                        <LegacyGrid.Cell>
                                            <Button
                                                variant='white'
                                                disabled={nickname === this.state.loggedInUser.nickName}
                                                onClick={() => {
                                                    communityUtils.socialCheckLink(
                                                        `https://${Sephora.configurationSettings.communitySiteHost}/t5/notes/composepage/note-to-user-id/${this.state.socialInfo.socialProfile.id}`,
                                                        communityUtils.PROVIDER_TYPES.lithium
                                                    );
                                                }}
                                                block={true}
                                            >
                                                {getText('sendMessage')}
                                            </Button>
                                        </LegacyGrid.Cell>
                                    </LegacyGrid>
                                </Box>
                            </LegacyContainer>
                        </Box>

                        <Groups
                            isPublic={true}
                            nickname={nickname}
                            groups={!groupsData.isFeaturedGroups && groupsData.groups.slice(0, GROUPS_LIMIT)}
                        />

                        <Conversations
                            isMyProfile={false}
                            conversations={!conversationsData.isFeaturedConversation && conversationsData.conversations.slice(0, CONVERSATIONS_LIMIT)}
                            socialId={this.state.socialInfo.socialProfile.id}
                            nickname={nickname}
                        />

                        {this.state.pixleeData && (
                            <Looks
                                isPublic={true}
                                nickname={nickname}
                                publicId={this.state.publicId}
                                media={this.state.pixleeData}
                            />
                        )}

                        {this.state.userReviews.totalResults !== 0 && (
                            <RecentReviews
                                reviews={this.state.userReviews.results}
                                nickname={nickname}
                                isMyProfile={false}
                                profileId={this.state.profileId}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default wrapComponent(PublicProfile, 'PublicProfile', true);
