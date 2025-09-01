import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import {
    Flex, Image, Text, Link
} from 'components/ui';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';
import uiUtils from 'utils/UI';
import lithium from 'services/api/thirdparty/Lithium';
import galleryConstants from 'utils/GalleryConstants';

const { getLink } = urlUtils;
const { SKELETON_ANIMATION, SKELETON_TEXT } = uiUtils;
const { getPublicUserSocialInfo } = lithium;
const { socialMedia, DEFAULT_AVATAR_URL } = galleryConstants;

class GalleryCommunityUser extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            socialProfile: {},
            showSkeleton: true
        };
    }

    setUserData = () => {
        const nickName = this.props.userNickname;

        getPublicUserSocialInfo(nickName)
            .then(userData => {
                this.setState({
                    socialProfile: userData.socialProfile,
                    showSkeleton: false
                });
            })
            .catch(() => {
                this.setState({
                    showSkeleton: false
                });
            });
    };

    componentDidMount() {
        if (this.props.userNickname && !!Object.keys(this.state.socialProfile)) {
            this.setUserData();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.userNickname !== prevProps.userNickname) {
            this.setUserData();
        }
    }

    renderUrlForProfile = (source = '', username) => {
        const itemSource = source?.toUpperCase();
        let url = '';

        switch (itemSource) {
            case socialMedia.INSTAGRAM:
                url = `https://www.instagram.com/${username}`;

                break;
            case socialMedia.TIKTOK:
                url = `https://www.tiktok.com/@${username}`;

                break;
            case socialMedia.YOUTUBE:
                url = `https://www.youtube.com/@${username}`;

                break;
            case socialMedia.DESKTOP:
                url = `/community/gallery/users/${username}`;

                break;
            default:
                url = '';
        }

        return url;
    };

    render() {
        const { avatar = '', biBadgeUrl = '', engagementBadgeUrl } = this.state.socialProfile;
        const { user, item, inUserGallery } = this.props;

        const avatarDisplay = this.state.showSkeleton ? (
            <div
                css={[{ width: inUserGallery ? '40px' : '32px', height: inUserGallery ? '40px' : '32px', borderRadius: '50%' }, SKELETON_ANIMATION]}
            />
        ) : (
            <Image
                size={inUserGallery ? [32, 40] : 32}
                src={avatar?.length > 0 ? avatar : DEFAULT_AVATAR_URL}
                css={{ objectFit: 'cover', borderRadius: '50%' }}
            />
        );

        const badgesDisplay = (item?.source === 'desktop' || (!item && user?.isInitialized)) && (
            <div css={{ lineHeight: '12px' }}>
                {this.state.showSkeleton ? (
                    <div css={[{ height: '12px', marginTop: '4px' }, SKELETON_ANIMATION]} />
                ) : (
                    <>
                        <Image
                            src={`https://${Sephora.configurationSettings.communitySiteHost}/${biBadgeUrl}`}
                            height={12}
                        />

                        <Image
                            src={`https://${Sephora.configurationSettings.communitySiteHost}/${engagementBadgeUrl}`}
                            height={12}
                            marginLeft={1}
                        />
                    </>
                )}
            </div>
        );

        const nickNameDisplay = () => {
            const props = {
                fontSize: inUserGallery ? ['md', 'xl'] : 'sm',
                fontWeight: 'bold',
                display: 'block',
                css: this.state.showSkeleton && SKELETON_TEXT
            };

            const userName = item?.user_name || user.nickName;

            return inUserGallery ? (
                <Text {...props}>{userName}</Text>
            ) : (
                <Link
                    {...props}
                    onClick={e => {
                        this.props.toggleGalleryLightBox({ display: false });
                        const link = getLink(this.renderUrlForProfile(item?.source, item?.user_name));
                        Location.navigateTo(e, link);
                    }}
                    target={item?.source?.toUpperCase() === socialMedia.DESKTOP ? null : '_blank'}
                >
                    {userName}
                </Link>
            );
        };

        const sourceDisplay = item && item?.source !== 'desktop' && (
            <Text
                is='p'
                fontSize='sm'
                lineHeight='14px'
                color='gray'
                css={this.state.showSkeleton && [{ fontSize: '12px', lineHeight: '14px' }, SKELETON_TEXT]}
            >{`${this.props.localization.viaSourceText} ${item?.source}`}</Text>
        );

        return inUserGallery ? (
            <Flex
                flexDirection='row'
                gap={3}
                justifyContent={['flex-start', 'center']}
                alignItems={['center', 'flex-start']}
            >
                {avatarDisplay}
                <Flex
                    flexDirection={['column', 'row']}
                    justifyContent={['center', 'flex-start']}
                    gap={[0, 3]}
                    alignItems={['flex-start', 'center']}
                >
                    {nickNameDisplay()}
                    {badgesDisplay}
                </Flex>
            </Flex>
        ) : (
            <Flex gap={3}>
                {avatarDisplay}
                <div>
                    {nickNameDisplay()}
                    {sourceDisplay}
                    {badgesDisplay}
                </div>
            </Flex>
        );
    }
}

export default wrapComponent(GalleryCommunityUser, 'GalleryCommunityUser', true);
