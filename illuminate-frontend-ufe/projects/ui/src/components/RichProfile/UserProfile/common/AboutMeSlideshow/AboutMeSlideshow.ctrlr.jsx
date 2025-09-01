import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { forms, space } from 'style/config';
import { Box, Button } from 'components/ui';
import LegacyCarousel from 'components/LegacyCarousel/LegacyCarousel';
import AboutMeSlide from 'components/RichProfile/UserProfile/common/AboutMeSlideshow/AboutMeSlide/AboutMeSlide';
import BiProfileSlide from 'components/RichProfile/UserProfile/common/AboutMeSlideshow/BiProfileSlide/BiProfileSlide';
import SocialSlide from 'components/RichProfile/UserProfile/common/AboutMeSlideshow/SocialSlide/SocialSlide';
import localeUtils from 'utils/LanguageLocale';
import store from 'Store';
import ProfileActions from 'actions/ProfileActions';
import watch from 'redux-watch';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
import communityUtils from 'utils/Community';
import userUtils from 'utils/User';
import urlUtils from 'utils/Url';

class AboutMeSlideshow extends BaseClass {
    state = {};

    componentDidMount() {
        if (this.props.isMyProfile && !this.props.nickname) {
            const nicknameWatch = watch(store.getState, 'user.nickName');
            store.subscribe(
                nicknameWatch(newNickname => {
                    this.setState({ nickname: newNickname });
                    nicknameWatch();
                }),
                this
            );
        }

        const params = urlUtils.getParams();

        if (this.props.isMyProfile && (params.edit || params.editprofile)) {
            this.handleOpenEditMyProfileClick();
        }
    }

    handleOpenEditMyProfileClick = () => {
        communityUtils
            .ensureUserIsReadyForSocialAction(communityUtils.PROVIDER_TYPES.lithium)
            .then(() => {
                this.openEditMyProfileModal();
            })
            .catch(() => {
                // User must be BI and must have nickname to edit profile
                if (userUtils.isBI() && userUtils.isSocial()) {
                    this.openEditMyProfileModal();
                }
            });
    };

    openEditMyProfileModal = () => {
        store.dispatch(ProfileActions.showEditMyProfileModal(true));

        //Analytics
        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'cmnty:my profile:edit',
                actionInfo: 'cmnty:my profile:edit',
                eventStrings: [analyticsConsts.Event.EVENT_71],
                usePreviousPageName: true
            }
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/UserProfile/common/AboutMeSlideshow/locales', 'AboutMeSlideshow');
        const {
            socialProfile,
            skinTone,
            skinType,
            hairColor,
            eyeColor,
            skinLabValue,
            isMyProfile,
            slideWidth,
            followerCount,
            isSocialEnabled,
            isBiPrivate
        } = this.props;

        const nickname = isMyProfile && this.state.nickname ? this.state.nickname : this.props.nickname;

        const slideArray = [
            <AboutMeSlide
                nickname={nickname}
                followerCount={followerCount}
                followingCount={socialProfile.following}
                avatarPhotoUrl={socialProfile.avatar}
                rankBadge={socialProfile.engagementBadgeUrl}
                isMyProfile={isMyProfile}
                biBadge={socialProfile.biBadgeUrl}
            />,
            <SocialSlide
                instagramUrl={socialProfile.instagram}
                youtubeUrl={socialProfile.youtube}
                biography={socialProfile.aboutMe}
                isMyProfile={isMyProfile}
                nickname={nickname}
            />
        ];

        if (isSocialEnabled && !isBiPrivate) {
            const biProfileSlide = (
                <BiProfileSlide
                    skinTone={skinTone}
                    skinType={skinType}
                    eyeColor={eyeColor}
                    hairColor={hairColor}
                    skinLabValue={skinLabValue}
                    isMyProfile={isMyProfile}
                    nickname={nickname}
                />
            );
            slideArray.splice(1, 0, biProfileSlide);
        }

        const slideBg = 'rgba(255,255,255,.95)';
        const slideHeight = Sephora.isMobile() ? 152 : 231;
        const slideTopPad = Sephora.isMobile() ? 55 : 103;
        const slideBotPad = Sephora.isMobile() ? space[5] : space[6];

        return (
            <Box
                position='relative'
                data-at={Sephora.debug.dataAt(`background_picture_${socialProfile.background}`)}
                css={{
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
                style={{
                    backgroundImage: `url(${socialProfile.background})`
                }}
            >
                <LegacyCarousel
                    isSlideshow={true}
                    showArrows={Sephora.isDesktop()}
                    showTouts={true}
                    displayCount={1}
                    controlHeight='auto'
                    controlStyles={{
                        top: slideTopPad,
                        bottom: slideBotPad,
                        padding: space[5],
                        backgroundColor: 'rgba(255,255,255,.75)',
                        transition: 'background-color .2s',
                        ':hover': {
                            backgroundColor: slideBg
                        }
                    }}
                    totalItems={slideArray.length}
                >
                    {slideArray.map((slideContent, index) => (
                        <Box
                            key={index.toString()}
                            paddingTop={slideTopPad}
                            paddingBottom={slideBotPad}
                            width={slideWidth}
                            marginX={Sephora.isMobile() ? 2 : 'auto'}
                        >
                            <Box
                                backgroundColor={slideBg}
                                height={slideHeight}
                                css={{
                                    position: 'relative',
                                    boxShadow: '0 0 12px 0 rgba(150,150,150,0.25)'
                                }}
                            >
                                {slideContent}
                            </Box>
                        </Box>
                    ))}
                </LegacyCarousel>
                <Box
                    css={[
                        { position: 'absolute' },
                        Sephora.isMobile()
                            ? {
                                top: space[3],
                                right: space[2]
                            }
                            : {
                                top: slideTopPad - forms.HEIGHT - space[3],
                                left: 0,
                                right: 0
                            }
                    ]}
                >
                    <Box
                        textAlign='right'
                        width={slideWidth}
                        marginX='auto'
                    >
                        {isMyProfile && (
                            <Button
                                variant='white'
                                size={Sephora.isMobile() ? 'sm' : null}
                                onClick={() => this.handleOpenEditMyProfileClick()}
                            >
                                {getText('edit')}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default wrapComponent(AboutMeSlideshow, 'AboutMeSlideshow', true);
