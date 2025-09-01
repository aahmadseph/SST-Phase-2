import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import imageUtil from 'utils/Image';
import lithiumApi from 'services/api/thirdparty/Lithium';

import { colors, space, modal } from 'style/config';
import { Box, Text, Divider } from 'components/ui';
import Textarea from 'components/Inputs/Textarea/Textarea';
import TextInput from 'components/Inputs/TextInput/TextInput';
import IconInstagram from 'components/LegacyIcon/IconInstagram';
import IconYoutube from 'components/LegacyIcon/IconYoutube';
import IconCamera from 'components/LegacyIcon/IconCamera';
import localeUtils from 'utils/LanguageLocale';

const ADD_PROFILE_PIC = 'added_profile_pic';
const ADD_BACKGROUND_PIC = 'added_background_pic';

const fileOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
};

const styles = {
    overlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: colors.darken3,
        color: colors.white,
        fontSize: 20,
        lineHeight: 0
    },
    fileLabel: [
        fileOverlayStyle,
        {
            textIndent: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            cursor: 'pointer'
        }
    ],
    fileInput: [
        fileOverlayStyle,
        {
            opacity: 0,
            ':focus + label': {
                outline: `1px dashed ${colors.black}`,
                outlineOffset: space[1]
            }
        }
    ],
    centerObject: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    socialIcon: {
        padding: space[1],
        marginRight: space[2],
        borderRadius: 99999,
        lineHeight: 0,
        color: colors.white,
        backgroundColor: colors.black
    }
};

class BioProfile extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            avatar: this.props.socialProfile.avatar,
            avatarFile: null,
            background: this.props.socialProfile.background,
            backgroundFile: null
        };
    }

    getData = () => {
        const dataObj = {
            aboutMe: this.aboutMe.getValue(),
            instagram: this.instagramLink.getValue().trim(),
            youtube: this.youtubeLink.getValue().trim(),
            avatarFile: this.state.avatarFile,
            backgroundFile: this.state.backgroundFile,
            avatar: this.state.avatar,
            background: this.state.background
        };

        return dataObj;
    };

    handleAvatarUpload = e => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            const isAvatarDefault = lithiumApi.isAvatarDefault(this.state.avatar);
            this.replaceImage(file, event => {
                this.setState(
                    {
                        avatar: event,
                        avatarFile: file
                    },
                    () => {
                        if (isAvatarDefault) {
                            lithiumApi.incrementUserScore(ADD_PROFILE_PIC, 1);
                        }
                    }
                );
            });
        }
    };

    handleBackgroundUpload = e => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            const isBackgroundDefault = lithiumApi.isBackgroundDefault(this.state.background);
            this.replaceImage(file, event => {
                this.setState(
                    {
                        background: event,
                        backgroundFile: file
                    },
                    () => {
                        if (isBackgroundDefault) {
                            lithiumApi.incrementUserScore(ADD_BACKGROUND_PIC, 1);
                        }
                    }
                );
            });
        }
    };

    replaceImage = (file, callback) => {
        const fileReader = new FileReader();

        if (!fileReader) {
            return;
        }

        fileReader.onload = event => {
            if (typeof callback === 'function') {
                imageUtil.resetOrientation(event.target.result, file, function (correctImage) {
                    callback(correctImage);
                });
            }
        };
        fileReader.readAsDataURL(file);
    };

    render() {
        const { socialProfile } = this.props;
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/EditMyProfile/Content/BioProfile/locales', 'BioProfile');

        return (
            <>
                <Box marginX={modal.outdentX}>
                    <div
                        data-at={Sephora.debug.dataAt(`background_picture_${this.state.background}`)}
                        css={[
                            {
                                position: 'relative',
                                height: 142,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover'
                            }
                        ]}
                        style={{
                            backgroundImage: `url(${this.state.background})`
                        }}
                    >
                        <div css={styles.overlay}>
                            <Box
                                position='absolute'
                                right={0}
                                bottom={0}
                                marginRight={4}
                                marginBottom={4}
                            >
                                <IconCamera />
                            </Box>
                            <input
                                id='profile_bg'
                                onChange={e => this.handleBackgroundUpload(e)}
                                type='file'
                                css={styles.fileInput}
                            />
                            <label
                                css={styles.fileLabel}
                                htmlFor='profile_bg'
                                children={getText('uploadBgImage')}
                            />
                        </div>
                        <Box
                            borderRadius='full'
                            border='4px solid'
                            borderColor='white'
                            css={styles.centerObject}
                        >
                            <Box
                                borderRadius='full'
                                data-at={Sephora.debug.dataAt(`user_avatar_${this.state.avatar}`)}
                                width={90}
                                height={90}
                                boxShadow='0 0 12px 0 rgba(150,150,150,0.25)'
                                css={{
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover'
                                }}
                                style={{
                                    backgroundImage: `url(${this.state.avatar})`
                                }}
                            />
                            <Box
                                borderRadius='full'
                                css={styles.overlay}
                            >
                                <div css={styles.centerObject}>
                                    <IconCamera />
                                </div>
                                <input
                                    id='profile_avatar'
                                    onChange={e => this.handleAvatarUpload(e)}
                                    type='file'
                                    css={[
                                        styles.fileInput,
                                        {
                                            ':focus + label': {
                                                outlineColor: colors.white
                                            }
                                        }
                                    ]}
                                />
                                <label
                                    css={styles.fileLabel}
                                    htmlFor='profile_avatar'
                                    children={getText('uploadProfileImage')}
                                />
                            </Box>
                        </Box>
                    </div>

                    <Divider thick={true} />
                </Box>
                <Text
                    is='label'
                    htmlFor='profileBio'
                    display='block'
                    fontWeight='bold'
                    marginBottom='.5em'
                    marginTop={4}
                    children={getText('biography')}
                />
                <Textarea
                    id='profileBio'
                    placeholder={getText('addShortBio')}
                    rows={3}
                    maxLength={170}
                    value={socialProfile.aboutMe}
                    ref={c => {
                        if (c !== null) {
                            this.aboutMe = c;
                        }
                    }}
                />
                <Divider
                    thick={true}
                    marginX={modal.outdentX}
                />
                <Text
                    is='label'
                    htmlFor='profileInstagram'
                    fontWeight='bold'
                    display='flex'
                    alignItems='center'
                    marginBottom='.5em'
                    marginTop={4}
                >
                    <span css={styles.socialIcon}>
                        <IconInstagram />
                    </span>
                    {getText('instagram')}
                </Text>
                <TextInput
                    id='profileInstagram'
                    placeholder={getText('instagramLink')}
                    value={socialProfile.instagram}
                    ref={c => {
                        if (c !== null) {
                            this.instagramLink = c;
                        }
                    }}
                ></TextInput>

                <Text
                    is='label'
                    htmlFor='profileYouTube'
                    fontWeight='bold'
                    display='flex'
                    alignItems='center'
                    marginBottom='.5em'
                >
                    <span css={styles.socialIcon}>
                        <IconYoutube />
                    </span>
                    {getText('youtube')}
                </Text>
                <TextInput
                    id='profileYouTube'
                    placeholder={getText('youtubeLink')}
                    value={socialProfile.youtube}
                    ref={c => {
                        if (c !== null) {
                            this.youtubeLink = c;
                        }
                    }}
                    marginBottom={null}
                ></TextInput>
            </>
        );
    }
}

export default wrapComponent(BioProfile, 'BioProfile');
