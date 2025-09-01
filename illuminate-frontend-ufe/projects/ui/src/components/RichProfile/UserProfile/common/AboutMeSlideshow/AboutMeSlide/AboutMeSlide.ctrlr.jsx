import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Flex, Image, Text, Link
} from 'components/ui';
import userUtils from 'utils/User';
import Popover from 'components/Popover/Popover';
import communityUtils from 'utils/Community';
import localeUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
const MAXIMUM_POPOVER_DISPLAY_COUNT = 2;

const { getCommunityUrl, COMMUNITY_BADGES } = communityUtils;
const { getLocaleResourceFile } = localeUtils;

class AboutMeSlide extends BaseClass {
    state = {
        showPopover: true
    };

    componentDidMount() {
        if (this.shouldDisplayPopover()) {
            this.incrementPopoverDisplayedCount();
        }
    }

    incrementPopoverDisplayedCount = () => {
        const profilePopoverDisplayCount = Storage.local.getItem(LOCAL_STORAGE.PROFILE_POPOVER_DISPLAY_COUNT) + 1;

        Storage.local.setItem(LOCAL_STORAGE.PROFILE_POPOVER_DISPLAY_COUNT, profilePopoverDisplayCount);
    };

    maximumPopoverDisplayedCountReached = () => {
        const currentDisplayCount = Storage.local.getItem(LOCAL_STORAGE.PROFILE_POPOVER_DISPLAY_COUNT);

        return currentDisplayCount >= MAXIMUM_POPOVER_DISPLAY_COUNT;
    };

    dismissPopover = () => {
        Storage.local.setItem(LOCAL_STORAGE.PROFILE_POPOVER_DISMISSED, 'true');
        this.setState({ showPopover: false });
    };

    isPopoverDismissed = () => {
        const popOverDismissed = Storage.local.getItem(LOCAL_STORAGE.PROFILE_POPOVER_DISMISSED);
        const booleanDimissed = !!(popOverDismissed !== null && popOverDismissed === 'true');

        return booleanDimissed;
    };

    shouldDisplayPopover = () => {
        return !(this.maximumPopoverDisplayedCountReached() || this.isPopoverDismissed());
    };

    hideBIBadge = rankBadgeProp => {
        const rankValues = [
            '/html/rank_icons/role_admin.svg',
            '/html/rank_icons/role_mod.svg',
            '/html/rank_icons/role_store.svg',
            '/html/rank_icons/role_sephora-pro-artist.svg',
            '/html/rank_icons/role_beauty-advisor.svg',
            '/html/rank_icons/role_founder.svg',
            '/html/rank_icons/role_brand.svg'
        ];

        return rankValues.indexOf(rankBadgeProp) === -1;
    };

    render() {
        const getText = getLocaleResourceFile('components/RichProfile/UserProfile/common/AboutMeSlideshow/AboutMeSlide/locales', 'AboutMeSlide');
        const isMobile = Sephora.isMobile();

        const {
            nickname, followerCount, followingCount, avatarPhotoUrl, isMyProfile, rankBadge, biBadge
        } = this.props;

        //TODO ILLUPH-79373: Add a default avatar
        const biBadgeUrl = getCommunityUrl() + biBadge;
        const rankBadgeUrl = getCommunityUrl() + rankBadge;
        const badgeHeight = isMobile ? 18 : 24;
        const avatarSize = isMobile ? 92 : 172;
        const avatarOffset = isMobile ? avatarSize * 0.4 : avatarSize / 2;

        const followerCountText = getText(followerCount === '1' ? 'follower' : 'followers');

        return (
            <Box
                textAlign='center'
                paddingTop={avatarSize - avatarOffset + 'px'}
            >
                <Box
                    position='absolute'
                    top={-avatarOffset}
                    left='50%'
                    css={{
                        transform: 'translate(-50%, 0)'
                    }}
                >
                    <Box
                        borderRadius='full'
                        data-at={Sephora.debug.dataAt(`user_avatar_${avatarPhotoUrl}`)}
                        border='4px solid'
                        borderColor='white'
                        width={avatarSize}
                        height={avatarSize}
                        css={{
                            boxShadow: '0 0 12px 0 rgba(150,150,150,0.25)',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover'
                        }}
                        style={{
                            backgroundImage: `url(${avatarPhotoUrl})`
                        }}
                    />
                </Box>
                <Text
                    is='h1'
                    fontSize={isMobile ? 'lg' : '2xl'}
                    lineHeight='none'
                    marginY='.5em'
                >
                    {nickname ? <b>{nickname}</b> : <Text color='gray'>{getText('createANickname')}</Text>}
                </Text>
                <Flex
                    justifyContent='center'
                    marginBottom={isMobile ? 1 : 2}
                >
                    {biBadge && this.hideBIBadge(rankBadge) && (
                        <Image
                            alt={COMMUNITY_BADGES[biBadge.split('.')[0]]}
                            src={biBadgeUrl}
                            marginRight={2}
                            height={badgeHeight}
                        />
                    )}
                    {rankBadge && (
                        <Image
                            alt={COMMUNITY_BADGES[rankBadge.split('.')[0]]}
                            src={rankBadgeUrl}
                            height={badgeHeight}
                        />
                    )}
                </Flex>
                <Popover
                    placement='top'
                    content={
                        <React.Fragment>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: getText(
                                        isMyProfile
                                            ? Sephora.isTouch
                                                ? 'userProfileMessageTap'
                                                : 'userProfileMessageClick'
                                            : Sephora.isTouch
                                                ? 'otherUserProfileMessageTap'
                                                : 'otherUserProfileMessageClick'
                                    )
                                }}
                            />
                            <Link
                                display='block'
                                width='100%'
                                color='blue'
                                paddingY={2}
                                marginBottom={-2}
                                children={getText('gotIt')}
                                onClick={this.dismissPopover}
                            />
                        </React.Fragment>
                    }
                    shouldDisplayPopover={this.shouldDisplayPopover}
                    showImmediately={this.state.showPopover}
                    textAlign='center'
                >
                    <Text
                        is='p'
                        fontSize={isMobile ? 'base' : 'md'}
                    >
                        <Link href={isMyProfile ? '/profile/me/followers' : '/users/' + nickname + '/followers'}>
                            <b>{userUtils.formatSocialCount(followerCount)}</b> {followerCountText}
                        </Link>
                        <Text marginX='.5em'>•</Text>
                        <Link href={isMyProfile ? '/profile/me/following' : '/users/' + nickname + '/following'}>
                            <b>{userUtils.formatSocialCount(followingCount)}</b> {getText('following')}
                        </Link>
                    </Text>
                </Popover>
            </Box>
        );
    }
}

export default wrapComponent(AboutMeSlide, 'AboutMeSlide', true);
