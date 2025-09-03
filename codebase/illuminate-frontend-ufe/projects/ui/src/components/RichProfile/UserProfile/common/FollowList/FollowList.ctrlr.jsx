import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Image, Text, Divider, Button, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import locationUtils from 'utils/Location';
import lithiumApi from 'services/api/thirdparty/Lithium';
import socialInfoActions from 'actions/SocialInfoActions';
import decorators from 'utils/decorators';
import deepExtend from 'utils/deepExtend';
import safelyReadProp from 'analytics/utils/safelyReadProperty';
import communityUtils from 'utils/Community';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import { DebouncedScroll } from 'constants/events';

const { getLocaleResourceFile } = localeUtils;
const FOLLOW_DATA_PAGE_SIZE = 40;

let loadingData = false;

class FollowList extends BaseClass {
    state = {
        isMyProfile: false,
        publicUserId: null,
        nickname: null,
        followList: [],
        page: 1,
        ready: false,
        shouldSignIn: false
    };

    componentDidMount() {
        this.isMyProfile = locationUtils.isRichProfilePage();
        store.setAndWatch('user', this, data => {
            if (data.user.isInitialized) {
                if (userUtils.getNickname() && this.isMyProfile) {
                    this.signInHandler();
                } else {
                    this.loadData();
                }
            }
        });
        window.addEventListener(DebouncedScroll, this.loadDataOnScroll);
        this.setAnalyticsProps();
    }

    signInHandler = () => {
        communityUtils
            .ensureUserIsReadyForSocialAction(communityUtils.PROVIDER_TYPES.lithium)
            .then(() => {
                this.loadData();
            })
            .catch(() => {
                this.setState({ shouldSignIn: true });
            });
    };

    setAnalyticsProps = () => {
        digitalData.page.pageInfo.pageName = this.isMyProfile ? 'my-profile' : 'user-profile';
        digitalData.page.attributes.additionalPageInfo = this.props.isFollowers ? 'followers' : 'following';
    };

    componentWillUnmount() {
        window.removeEventListener(DebouncedScroll, this.loadDataOnScroll);
    }

    loadDataOnScroll = () => {
        if (window.innerHeight + window.pageYOffset >= document.body.scrollHeight && !loadingData) {
            this.loadData();
        }
    };

    /**
     *
     * @param {string} prop - This is the path to the property to sort by as a string. Ex 'e.f.g'
     */
    sortAlphabeticallyByProp = prop => {
        return function (a, b) {
            const nameA = safelyReadProp(prop, a).toUpperCase(); // ignore upper and lowercase
            const nameB = safelyReadProp(prop, b).toUpperCase(); // ignore upper and lowercase

            if (nameA < nameB) {
                return -1;
            }

            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        };
    };
    sortAndUpdateState = userInfo => {
        if (this.followList.length) {
            //Sort Alphabetically by Nickname
            this.followList.sort(this.sortAlphabeticallyByProp('user.login'));
        } else {
            //Don't show follow list if no one is actually following this user yet
            this.followList = [];
        }

        this.setState(
            {
                isMyProfile: this.isMyProfile,
                publicUserId: userInfo ? userInfo.socialProfile.id : null,
                nickname: this.nickname,
                page: this.state.page + 1,
                followList: this.nickname !== this.state.nickname ? this.followList : this.state.followList.concat(this.followList),
                ready: true
            },
            () => {
                loadingData = false;
            }
        );
    };

    getUserSocialInfo = socialInfo => {
        let promise;

        this.followList = socialInfo && socialInfo.response[this.props.isFollowers ? 'followers' : 'followings'];

        if (this.followList.length < FOLLOW_DATA_PAGE_SIZE) {
            window.removeEventListener(DebouncedScroll, this.loadDataOnScroll);
        }

        if (!this.isMyProfile) {
            promise = lithiumApi.getPublicUserSocialInfo(this.nickname);
        } else {
            promise = Promise.resolve();
        }

        promise.then(this.sortAndUpdateState);
    };

    loadData = () => {
        this.nickname = this.isMyProfile ? userUtils.getNickname() : this.getUserNicknameFromProfilePath(window.location.pathname);

        if (loadingData) {
            return;
        }

        loadingData = true;

        const listToGet = this.props.isFollowers ? 'followers' : 'followings';
        const pageToFetch = this.nickname !== this.state.nickname ? 1 : this.state.page;

        decorators
            .withInterstice(lithiumApi.getFolloweesOrFollowers, INTERSTICE_DELAY_MS)(this.nickname, listToGet, pageToFetch, FOLLOW_DATA_PAGE_SIZE)
            .then(this.getUserSocialInfo)
            .catch(() => {
                this.setState(
                    {
                        isMyProfile: this.isMyProfile,
                        nickname: this.nickname,
                        ready: true
                    },
                    () => {
                        window.removeEventListener(DebouncedScroll, this.loadDataOnScroll);
                        loadingData = false;
                    }
                );
            });
    };

    getUserNicknameFromProfilePath = pathName => {
        const m = pathName.match(/^\/users\/([^\/]+)/);

        return m && m[1];
    };

    addFirstUserToFollowList = () => {
        // Public User didn't have any followers, and we just followed them
        // Since real followers list will not be updated immediately,
        // let's fetch our user data and put it into followers list
        lithiumApi.getAuthenticatedUserSocialInfo(userUtils.getNickname()).then(userInfo => {
            userInfo.isLithiumSuccessful = true;
            store.dispatch(socialInfoActions.setUserSocialInfo(userInfo));
            const profile = userInfo.socialProfile;

            this.setState({
                followList: [
                    {
                        isFollowedByRequester: true,
                        user: {
                            avatar: { url: profile.avatar },
                            badges: [{ icon: profile.biBadgeUrl }, { icon: profile.engagementBadgeUrl }],
                            login: userUtils.getNickname()
                        }
                    }
                ]
            });
        });
    };

    toggleFollowingStatus = (e, followUser, index) => {
        e.stopPropagation();
        e.preventDefault();

        communityUtils.ensureUserIsReadyForSocialAction(communityUtils.PROVIDER_TYPES.lithium).then(() => {
            const myNickName = userUtils.getNickname();
            const theirId = followUser.user.id;
            let toggleMethod = lithiumApi.followUser;

            const followList = this.state.followList;

            //Check for null instead of if(index) because an Index of 0 would be falsy
            if (index !== null) {
                const isFollowed = followList[index].isFollowedByRequester;

                if (isFollowed) {
                    toggleMethod = lithiumApi.unfollowUser;
                }

                toggleMethod(myNickName, theirId).then(() => {
                    lithiumApi.getAuthenticatedUserSocialInfo(userUtils.getNickname()).then(data => {
                        data.isLithiumSuccessful = true;
                        store.dispatch(socialInfoActions.setUserSocialInfo(data));
                    });
                    this.setState({
                        followList: this.state.followList.map((user, i) =>
                            i === index ? deepExtend({}, user, { isFollowedByRequester: !isFollowed }) : user
                        )
                    });
                });
            } else {
                toggleMethod(myNickName, theirId).then(this.addFirstUserToFollowList);
            }
        });
    };

    render() {
        const getText = getLocaleResourceFile('components/RichProfile/UserProfile/common/FollowList/locales', 'FollowList');

        const { isFollowers } = this.props;

        const {
            isMyProfile, nickname, followList, ready, shouldSignIn
        } = this.state;

        const isMobile = Sephora.isMobile();
        const currentUserNickName = userUtils.getNickname();
        const firstUserName = userUtils.getProfileFirstName();
        const badgeUrlPrefix = `https://${Sephora.configurationSettings.communitySiteHost}`;

        return (
            <div>
                <LegacyContainer paddingTop={isMobile ? 4 : 6}>
                    <Box position='relative'>
                        {ready && (
                            <Link
                                href={isMyProfile ? '/profile/me' : '/users/' + nickname}
                                padding={2}
                                margin={-2}
                                arrowDirection='left'
                                arrowPosition='before'
                                css={
                                    !isMobile
                                        ? {
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0
                                        }
                                        : null
                                }
                            >
                                {isMyProfile ? getText('backToProfileLinkNickname', [firstUserName]) : getText('backToProfileLink')}
                            </Link>
                        )}
                        <Text
                            is='h1'
                            marginTop={isMobile ? 3 : null}
                            fontSize={isMobile ? 'xl' : '2xl'}
                            textAlign='center'
                            lineHeight='none'
                            fontFamily='serif'
                            children={isFollowers ? getText('followers') : getText('following')}
                        />
                    </Box>
                </LegacyContainer>
                <Divider
                    height={3}
                    marginTop={4}
                    marginBottom={isMobile ? 4 : 5}
                    color='nearWhite'
                />
                {ready && !shouldSignIn ? (
                    <LegacyContainer>
                        {followList && followList.length ? (
                            <LegacyGrid gutter={!isMobile ? 7 : null}>
                                {followList.map((followUser, index) => (
                                    <LegacyGrid.Cell
                                        key={followUser.user.login}
                                        width={!isMobile ? '50%' : null}
                                    >
                                        <LegacyGrid
                                            href={'/users/' + followUser.user.login}
                                            gutter={2}
                                            alignItems='center'
                                        >
                                            <LegacyGrid.Cell width='fit'>
                                                <Image
                                                    src={followUser.user.avatar.url}
                                                    borderRadius='full'
                                                    border={1}
                                                    size={38}
                                                />
                                            </LegacyGrid.Cell>
                                            <LegacyGrid.Cell width='fill'>
                                                <Text
                                                    is='h2'
                                                    lineHeight='tight'
                                                    fontSize='sm'
                                                    fontWeight='bold'
                                                    marginBottom='.25em'
                                                >
                                                    {followUser.user.login}
                                                </Text>
                                                <Image
                                                    src={badgeUrlPrefix + followUser.user.badges[0].icon}
                                                    height={16}
                                                />
                                                {followUser.user.badges[1] && (
                                                    <Image
                                                        src={badgeUrlPrefix + followUser.user.badges[1].icon}
                                                        height={16}
                                                        marginLeft={1}
                                                    />
                                                )}
                                            </LegacyGrid.Cell>
                                            <LegacyGrid.Cell width='fit'>
                                                {currentUserNickName !== followUser.user.login ? (
                                                    followUser.isFollowedByRequester ? (
                                                        <Button
                                                            variant='secondary'
                                                            size='sm'
                                                            minWidth='9.25em'
                                                            onClick={e => {
                                                                this.toggleFollowingStatus(e, followUser, index);
                                                            }}
                                                            children={getText('following')}
                                                        />
                                                    ) : (
                                                        <Button
                                                            variant='primary'
                                                            size='sm'
                                                            minWidth='9.25em'
                                                            onClick={e => {
                                                                this.toggleFollowingStatus(e, followUser, index);
                                                            }}
                                                            children={getText('follow')}
                                                        />
                                                    )
                                                ) : null}
                                            </LegacyGrid.Cell>
                                        </LegacyGrid>
                                        <Divider marginY={3} />
                                    </LegacyGrid.Cell>
                                ))}
                            </LegacyGrid>
                        ) : (
                            <Box textAlign='center'>
                                <Image
                                    src='/img/ufe/rich-profile/follow.svg'
                                    display='block'
                                    marginX='auto'
                                    size={128}
                                    marginTop={7}
                                    marginBottom={6}
                                />
                                {isFollowers ? (
                                    isMyProfile ? (
                                        <Text is='p'>
                                            <b>{getText('noFollowersMessage')}</b>
                                            <br />
                                            {getText('noFollowersMessageBr')}
                                        </Text>
                                    ) : (
                                        <div>
                                            <Text
                                                is='p'
                                                fontWeight='bold'
                                                marginBottom={5}
                                            >
                                                {getText('memberHasNoFollowers')}
                                            </Text>
                                            {currentUserNickName !== nickname ? (
                                                <Button
                                                    variant='primary'
                                                    onClick={e => {
                                                        this.toggleFollowingStatus(
                                                            e,
                                                            {
                                                                user: { id: this.state.publicUserId }
                                                            },
                                                            null
                                                        );
                                                    }}
                                                    children={getText('followUser', [nickname])}
                                                />
                                            ) : null}
                                        </div>
                                    )
                                ) : isMyProfile ? (
                                    <Text
                                        is='p'
                                        maxWidth='25em'
                                        marginX='auto'
                                    >
                                        <b>{getText('noFollowingAnyoneYet')}</b>
                                        <br />
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: getText('followingInstructions')
                                            }}
                                        />
                                    </Text>
                                ) : (
                                    <Text
                                        is='p'
                                        fontWeight='bold'
                                    >
                                        {nickname} {getText('noFollowing')}
                                    </Text>
                                )}
                            </Box>
                        )}
                    </LegacyContainer>
                ) : shouldSignIn ? (
                    <LegacyContainer paddingY={5}>
                        <Text
                            is='h2'
                            fontSize='md'
                            marginY={5}
                        >
                            {getText('toViewYourProfile')}{' '}
                            <Link
                                color='blue'
                                onClick={this.signInHandler}
                            >
                                {getText('signIn')}
                            </Link>
                            .
                        </Text>
                    </LegacyContainer>
                ) : null}
            </div>
        );
    }
}

export default wrapComponent(FollowList, 'FollowList', true);
