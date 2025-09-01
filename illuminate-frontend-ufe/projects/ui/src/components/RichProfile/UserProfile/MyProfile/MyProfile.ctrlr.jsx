/* eslint-disable max-len */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Button, Text, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import AboutMeSlideshow from 'components/RichProfile/UserProfile/common/AboutMeSlideshow/AboutMeSlideshow';
import CommunityRibbon from 'components/RichProfile/UserProfile/common/CommunityRibbon/CommunityRibbon';
import JoinCommunity from 'components/RichProfile/UserProfile/common/JoinCommunity/JoinCommunity';
import Groups from 'components/RichProfile/UserProfile/common/Groups/Groups';
import Conversations from 'components/RichProfile/UserProfile/common/Conversations/Conversations';
import Looks from 'components/RichProfile/UserProfile/common/Looks';
import RecentReviews from 'components/RichProfile/UserProfile/common/RecentReviews/RecentReviews';
import RecentPurchases from 'components/RichProfile/UserProfile/common/RecentPurchases/RecentPurchases';
import ProductRecommendations from 'components/RichProfile/UserProfile/common/ProductRecommendations/ProductRecommendations';
import userUtils from 'utils/User';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';
import communityUtils from 'utils/Community';
import localeUtils from 'utils/LanguageLocale';
import decoratorsUtils from 'utils/decorators';
import lithiumApi from 'services/api/thirdparty/Lithium';
import bazaarVoiceApi from 'services/api/thirdparty/BazaarVoice';
import biApi from 'services/api/beautyInsider';
import store from 'Store';
import watch from 'redux-watch';
import auth from 'utils/Authentication';
import skuUtils from 'utils/Sku';
import sessionExtensionService from 'services/SessionExtensionService';
import pixleeUtils from 'utils/pixlee';
import { HEADER_VALUE } from 'constants/authentication';

const { getCommunityUrl, socialCheckLink, COMMUNITY_URLS, PROVIDER_TYPES } = communityUtils;
const { getLocaleResourceFile } = localeUtils;
const { ensureUserIsAtLeastRecognized } = decoratorsUtils;
const { getApprovedContentCount, getApprovedContentFromAlbum } = pixleeUtils;

const SLIDE_WIDTH = Sephora.isDesktop() ? 665 : null;
const CONVERSATIONS_LIMIT = Sephora.isMobile() ? 1 : 2;
const GROUPS_LIMIT = Sephora.isMobile() ? 2 : 4;

class MyProfile extends BaseClass {
    constructor() {
        super();
        this.state = {
            userReviews: { totalResults: 0 },
            showPleaseSignInBlock: true,
            isUserReady: false,
            isUserAtleastRecognized: false,
            user: {},
            recentPurchases: [],
            recentPurchasesApiCalled: false
        };
    }

    componentDidMount() {
        const userWatch = watch(store.getState, 'user');
        store.subscribe(
            userWatch(watchedUser => {
                if (this.state.user.profileId !== watchedUser.profileId) {
                    this.initUserProfile(watchedUser);
                }

                this.setState({
                    isUserReady: true,
                    isUserAtleastRecognized: userUtils.isUserAtleastRecognized()
                });
            }),
            this
        );
    }

    initUserProfile = user => {
        let getUserPhotosNum;
        let getSocialInfo;
        const biAccount = user.beautyInsiderAccount;
        const socialInfoWatch = watch(store.getState, 'socialInfo');
        const userProfileId = user.profileId;

        let skinTone;
        let skinType;
        let hairColor;
        let eyeColor;
        let skinLabValue;

        const customerPreference = user.customerPreference;

        if (customerPreference) {
            const customerPreferenceValues = bpRedesignedUtils.mapCustomerPreferenceToValues(customerPreference);
            skinTone = customerPreferenceValues?.['makeup']?.['skinTone'];
            skinType = customerPreferenceValues?.['makeup']?.['skinType'];
            hairColor = customerPreferenceValues?.['hair']?.['hairColor'];
            eyeColor = customerPreferenceValues?.['makeup']?.['eyeColor'];
            skinLabValue = user.colorIq && user.colorIq[0]?.labValue;

            this.setState({
                skinTone,
                skinType,
                hairColor,
                eyeColor,
                skinLabValue
            });
        }

        if (user.nickName) {
            getUserPhotosNum = function () {
                if (userProfileId) {
                    const options = {
                        /* eslint-disable-next-line camelcase */
                        filters: { vendor_id: userProfileId, approved: true }
                    };

                    return getApprovedContentCount(Sephora.configurationSettings.exploreGalleryAlbumId, options);
                }

                return Promise.resolve(0);
            };

            getSocialInfo = userUtils.getSocialInfo;
        } else {
            getUserPhotosNum = function () {
                return Promise.resolve(0);
            };

            getSocialInfo = function () {
                return lithiumApi.getNoNicknameUserSocialInfo();
            };
        }

        if (userProfileId) {
            const options = {
                page: 1,
                photosPerPage: 4,
                /* eslint-disable-next-line camelcase */
                filters: { vendor_id: userProfileId }
            };
            getApprovedContentFromAlbum(Sephora.configurationSettings.exploreGalleryAlbumId, options).then(data => {
                this.setState({
                    looksData: {
                        media: data.data
                    }
                });
            });
        }

        const reviewLimit = Sephora.isMobile() ? 1 : 2;

        const getUserReviews = bazaarVoiceApi.getUserReviews(userProfileId, reviewLimit);

        if (!this.state.recentPurchasesApiCalled && biAccount && this.state.recentPurchases.length <= 0) {
            this.setState({ recentPurchasesApiCalled: true });
            this.getRecentPurchases(userProfileId);
        }

        getUserReviews.then(userReviews => {
            this.setState({ userReviews });
        });

        getUserPhotosNum().then(data => {
            const count = data.count;

            this.setState({ numUserPhotos: count });
        });

        getSocialInfo()
            .then(socialInfo => {
                this.setState({
                    socialInfo,
                    biAccount,
                    user
                });

                /* eslint-disable no-shadow */
                store.subscribe(
                    socialInfoWatch(socialInfo => {
                        if (socialInfo.socialProfile) {
                            this.setState({ socialInfo });
                        }
                    }),
                    this
                );
            })
            .catch(() => {
                this.props.handleError();
            });
        Sephora.isDesktop() && sessionExtensionService.setExpiryTimer(this.props.requestCounter);
    };

    //used for empty state
    signInHandler = () => {
        auth.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK)
            .then(() => {
                //hide the please sign in block immediately after user signs in
                this.setState({ showPleaseSignInBlock: false });
            })
            .catch(() => {});
    };

    getRecentPurchases = profileId => {
        const options = {
            sortBy: 'recently',
            groupBy: 'none',
            excludeSamples: true,
            excludeRewards: true
        };

        const itemLimit = Sephora.isMobile() ? 2 : 4;

        biApi.getPurchaseHistory(profileId, options).then(purchaseHistory => {
            const recentPurchases = purchaseHistory.purchasedItems.filter(item => skuUtils.showAddReview(item.sku) && !skuUtils.isGiftCard(item.sku));

            if (recentPurchases.length && recentPurchases.length > itemLimit) {
                recentPurchases.length = itemLimit;
            }

            this.setState({ recentPurchases: recentPurchases.length ? recentPurchases : null, recentPurchasesApiCalled: false });
        });
    };

    isUserReady = () => {
        return this.state.isUserReady;
    };

    isUserAtleastRecognized = () => {
        return this.state.isUserAtleastRecognized;
    };

    render() {
        const getText = getLocaleResourceFile('components/RichProfile/UserProfile/MyProfile/locales', 'MyProfile');
        const {
            skinTone, skinType, eyeColor, hairColor, skinLabValue
        } = this.state;

        const communityUrl = getCommunityUrl();

        return (
            <div>
                {!Sephora.isNodeRender && this.isUserReady() && (
                    <React.Fragment>
                        {!this.isUserAtleastRecognized() && this.state.showPleaseSignInBlock && (
                            <LegacyContainer paddingY={5}>
                                <Text
                                    is='h2'
                                    fontSize='md'
                                    marginY={5}
                                >
                                    {getText('toViewYourProfilePlease')}{' '}
                                    <Link
                                        color='blue'
                                        underline={true}
                                        onClick={this.signInHandler}
                                    >
                                        {getText('signIn')}
                                    </Link>
                                    .
                                </Text>
                            </LegacyContainer>
                        )}

                        {this.isUserAtleastRecognized() && this.state.socialInfo && (
                            <React.Fragment>
                                <AboutMeSlideshow
                                    nickname={this.state.user.nickName}
                                    socialProfile={this.state.socialInfo.socialProfile}
                                    skinTone={skinTone}
                                    skinType={skinType}
                                    hairColor={hairColor}
                                    skinLabValue={skinLabValue}
                                    eyeColor={eyeColor}
                                    slideWidth={SLIDE_WIDTH}
                                    followerCount={this.state.socialInfo.socialProfile.follower}
                                    isSocialEnabled={this.state.user.isSocialEnabled}
                                    isMyProfile
                                />
                                <CommunityRibbon
                                    photoCount={this.state.numUserPhotos}
                                    groupCount={this.state.socialInfo.groupsData.total}
                                    postCount={this.state.socialInfo.conversationsData.total}
                                    reviewCount={this.state.userReviews.totalResults}
                                    userSocialId={this.state.socialInfo.socialProfile.id}
                                    profileId={this.state.user.profileId}
                                />

                                <Box
                                    paddingY={4}
                                    backgroundColor='nearWhite'
                                >
                                    <LegacyContainer>
                                        <Box
                                            marginX='auto'
                                            width='100%'
                                            maxWidth={SLIDE_WIDTH}
                                        >
                                            <LegacyGrid
                                                fill={true}
                                                gutter={4}
                                            >
                                                <LegacyGrid.Cell>
                                                    <Button
                                                        variant='white'
                                                        block={true}
                                                        onClick={() => {
                                                            socialCheckLink(communityUrl + COMMUNITY_URLS.NOTIFICATIONS, PROVIDER_TYPES.lithium);
                                                        }}
                                                    >
                                                        {getText('notifications')}
                                                    </Button>
                                                </LegacyGrid.Cell>
                                                <LegacyGrid.Cell>
                                                    <Button
                                                        variant='white'
                                                        block={true}
                                                        onClick={() => {
                                                            socialCheckLink(communityUrl + COMMUNITY_URLS.MESSAGES, PROVIDER_TYPES.lithium);
                                                        }}
                                                    >
                                                        {getText('messages')}
                                                    </Button>
                                                </LegacyGrid.Cell>
                                            </LegacyGrid>
                                        </Box>
                                    </LegacyContainer>
                                </Box>

                                {!this.state.user.nickName && <JoinCommunity />}

                                <Groups
                                    groups={this.state.socialInfo.groupsData.groups.slice(0, GROUPS_LIMIT)}
                                    isFeaturedGroups={this.state.socialInfo.groupsData.isFeaturedGroups}
                                />

                                <Conversations
                                    conversations={this.state.socialInfo.conversationsData.conversations.slice(0, CONVERSATIONS_LIMIT)}
                                    isMyProfile={true}
                                    isFeatured={this.state.socialInfo.conversationsData.isFeaturedConversation}
                                    socialId={this.state.socialInfo.socialProfile.id}
                                />

                                {this.state.looksData && (
                                    <Looks
                                        isFeaturedLooks={this.state.looksData?.isFeaturedLooks}
                                        media={this.state.looksData?.media}
                                    />
                                )}

                                {this.state.userReviews.totalResults !== 0 && (
                                    <RecentReviews
                                        reviews={this.state.userReviews.results}
                                        isMyProfile
                                        profileId={this.state.user.profileId}
                                    />
                                )}
                                {this.state.recentPurchases && (
                                    <React.Fragment>
                                        <RecentPurchases recentPurchases={this.state.recentPurchases} />
                                        <ProductRecommendations />
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default wrapComponent(ensureUserIsAtLeastRecognized(MyProfile), 'MyProfile', true);
