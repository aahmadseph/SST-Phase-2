/* eslint-disable class-methods-use-this */
import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import localeUtils from 'utils/LanguageLocale';

import EditMyProfile from 'components/RichProfile/EditMyProfile/EditMyProfile';
import store from 'store/Store';
import ProfileActions from 'actions/ProfileActions';
import Actions from 'Actions';
import lithiumApi from 'services/api/thirdparty/Lithium';
import socialInfoActions from 'actions/SocialInfoActions';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
import biUtils from 'utils/BiProfile';
import profileConsts from 'services/api/profile/constants';
import { ProfileUpdated } from 'constants/events';

const { SAVED_BANNER_TIMEOUT } = profileConsts;

const ALBUM_TITLES = {
    AVATAR: 'ProfilePicture',
    BACKGROUND: 'Background'
};
class EditMyProfileModal extends BaseClass {
    state = {
        profileId: '',
        biAccount: null,
        socialProfile: null,
        showSavedBanner: false
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile(
            'components/RichProfile/EditMyProfile/Modals/EditMyProfileModal/locales',
            'EditMyProfileModal'
        );

        const PROFILE_CATEGORIES = getText('profileCategories');
        // isLithiumSuccessful should always be true (display photos & bio tab)
        // unless this.state.isLithiumSuccessful becomes false (hide photos & bio tab)
        let isLithiumSuccessful = true;

        if (this.state.isLithiumSuccessful === false) {
            isLithiumSuccessful = false;
        }

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={0}
                isDrawer={true}
                dataAt={'edit_modal'}
            >
                <Modal.Header>
                    <Modal.Title>{getText('editProfile')}</Modal.Title>
                </Modal.Header>

                <Modal.Body
                    paddingX={null}
                    paddingTop={null}
                    paddingBottom={null}
                >
                    <EditMyProfile
                        isLithiumSuccessful={isLithiumSuccessful}
                        biAccount={this.state.biAccount}
                        socialProfile={this.state.socialProfile}
                        saveProfileCallback={this.saveProfileCallback}
                        linksList={PROFILE_CATEGORIES}
                        showSavedBanner={this.state.showSavedBanner}
                    />
                </Modal.Body>
            </Modal>
        );
    }

    componentDidMount() {
        this.avatarFile = null;
        this.backgroundFile = null;

        store.setAndWatch(
            [
                { 'user.profileId': 'profileId' },
                { 'user.nickName': 'nickname' },
                { 'user.beautyInsiderAccount': 'biAccount' },
                { 'socialInfo.socialProfile': 'socialProfile' },
                { 'socialInfo.isLithiumSuccessful': 'isLithiumSuccessful' }
            ],
            this,
            null,
            true
        );

        store.setAndWatch('profile.showSavedMessage', this, showMessage => {
            if (showMessage.showSavedMessage) {
                this.setState({ showSavedBanner: true }, () =>
                    setTimeout(
                        () => this.setState({ showSavedBanner: false }, () => store.dispatch(ProfileActions.showSavedMessage(false))),
                        SAVED_BANNER_TIMEOUT
                    )
                );
            }
        });
    }

    requestClose = () => {
        store.dispatch(ProfileActions.showEditMyProfileModal(false));

        if (this.props.saveBeautyTraitCallBack) {
            this.props.saveBeautyTraitCallBack();
        }
    };

    shouldShowInterstice = () => {
        if (!store.getState().interstice.isVisible) {
            store.dispatch(Actions.showInterstice(true));
        }
    };

    updateAvatar = (lithiumData, nickname) => {
        if (this.avatarFile !== lithiumData.avatarFile) {
            const imageFormData = this.createImageFormData(lithiumData.avatarFile);

            if (imageFormData) {
                this.shouldShowInterstice();

                return lithiumApi
                    .getUserAlbums(nickname)
                    .then(albums => this.getAlbum(albums, ALBUM_TITLES.AVATAR))
                    .then(album => lithiumApi.uploadImageToAlbum(album.album.id.$, imageFormData))
                    .then(image => lithiumApi.updateUserSocialAvatar(image.image.url.$, nickname))
                    .then(this.setAvatarFile(lithiumData.avatarFile));
            }
        }

        return new Promise(resolve => resolve(false));
    };

    updateBackground = (lithiumData, nickname) => {
        if (this.backgroundFile !== lithiumData.backgroundFile) {
            const imageFormData = this.createImageFormData(lithiumData.backgroundFile);

            if (imageFormData) {
                this.shouldShowInterstice();

                return lithiumApi
                    .getUserAlbums(nickname)
                    .then(albums => this.getAlbum(albums, ALBUM_TITLES.BACKGROUND))
                    .then(album => lithiumApi.uploadImageToAlbum(album.album.id.$, imageFormData))
                    .then(image => lithiumApi.updateUserSocialBackground(image.image.url.$, nickname))
                    .then(this.setBackgroundFile(lithiumData.backgroundFile));
            }
        }

        return new Promise(resolve => resolve(false));
    };

    updateBio = (lithiumData, nickname) => {
        if (this.state.socialProfile.aboutMe !== lithiumData.aboutMe) {
            this.shouldShowInterstice();

            return lithiumApi.updateUserSocialBio(lithiumData.aboutMe, nickname);
        }

        return new Promise(resolve => resolve(false));
    };

    updateInstagram = (lithiumData, nickname) => {
        if (this.state.socialProfile.instagram !== lithiumData.instagram) {
            this.shouldShowInterstice();

            if (lithiumData.instagram.indexOf('http://') === 0) {
                lithiumData.instagram = lithiumData.instagram.replace('http://', 'https://');
            } else if (lithiumData.instagram.indexOf('https') !== 0 && lithiumData.instagram.length) {
                lithiumData.instagram = 'https://' + lithiumData.instagram;
            }

            return lithiumApi.updateUserSocialInstagram(lithiumData.instagram, nickname);
        }

        return new Promise(resolve => resolve(false));
    };

    updateYoutube = (lithiumData, nickname) => {
        if (this.state.socialProfile.youtube !== lithiumData.youtube) {
            this.shouldShowInterstice();

            if (lithiumData.youtube.indexOf('http://') === 0) {
                lithiumData.youtube = lithiumData.youtube.replace('http://', 'https://');
            } else if (lithiumData.youtube.indexOf('https') !== 0 && lithiumData.youtube.length) {
                lithiumData.youtube = 'https://' + lithiumData.youtube;
            }

            return lithiumApi.updateUserSocialYoutube(lithiumData.youtube, nickname);
        }

        return new Promise(resolve => resolve(false));
    };

    updateLithium = (lithiumData, nickname, callback, shouldMakeAnalyticsCall = true) => {
        const descriptionOfEdits = [];
        const eventStrings = [];

        // set up promise so that after all updates are made then
        // we make a getAuthenticatedUserSocialInfo call
        Promise.all([
            this.updateAvatar(lithiumData, nickname),
            this.updateBackground(lithiumData, nickname),
            this.updateBio(lithiumData, nickname),
            this.updateInstagram(lithiumData, nickname),
            this.updateYoutube(lithiumData, nickname)
        ])
            .then(values => {
                const [isUpdateAvatar, isUpdateBackground, isUpdateBio, isUpdateInstagram, isUpdateYoutube] = values;

                if (isUpdateAvatar || isUpdateBackground || isUpdateBio || isUpdateInstagram || isUpdateYoutube) {
                    lithiumApi.getAuthenticatedUserSocialInfo(this.state.nickname).then(data => {
                        data.isLithiumSuccessful = true;
                        store.dispatch(socialInfoActions.setUserSocialInfo(data));
                        store.dispatch(Actions.showInterstice(false));

                        if (callback && typeof callback === 'function') {
                            callback();
                        }
                    });
                }

                //Analytics - Track if photo, bio or both were updated.
                if (shouldMakeAnalyticsCall) {
                    if (isUpdateBio) {
                        descriptionOfEdits.push('edit about me text');
                        eventStrings.push(analyticsConsts.Event.EDIT_ABOUT_ME_TEXT);
                    }

                    if (isUpdateAvatar) {
                        descriptionOfEdits.push('upload profile photo');
                        eventStrings.push(analyticsConsts.Event.UPLOAD_PROFILE_PHOTO);
                    }

                    if (descriptionOfEdits.length) {
                        const linkName = [digitalData.page.category.pageType, digitalData.page.pageInfo.pageName, descriptionOfEdits.join(' ')].join(
                            ':'
                        );

                        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                            data: {
                                actionInfo: linkName,
                                linkName,
                                eventStrings: [analyticsConsts.Event.EVENT_71].concat(eventStrings),
                                usePreviousPageName: true
                            }
                        });
                    }
                }

                if (callback && typeof callback === 'function') {
                    callback();
                }
            })
            .catch(() => {
                if (store.getState().interstice.isVisible) {
                    store.dispatch(Actions.showInterstice(false));
                }
            });
    };

    setAvatarFile = avatar => {
        return new Promise(resolve => {
            this.avatarFile = avatar;
            resolve();
        });
    };

    setBackgroundFile = background => {
        return new Promise(resolve => {
            this.backgroundFile = background;
            resolve();
        });
    };

    /**
     * 1. Search for the album in the albums data
     * 2. Create the album if it cannot find it
     * @param  {Object} data - The albums' data
     * @param  {String} albumTitle - The title of the album
     * @returns {Promise}
     */
    getAlbum = (data, albumTitle) => {
        let albums = [];

        if (data.albums && data.albums.album) {
            albums = data.albums.album.filter(response => {
                return response.title.$ === albumTitle;
            });
        }

        if (albums.length) {
            return new Promise(resolve => resolve({ album: albums[0] }));
        } else {
            return lithiumApi.createAlbum(albumTitle);
        }
    };

    /**
     * Create a FormData object with the image file content
     * @param  {File} imageContent - The image file content
     * @returns {FormData}
     */
    createImageFormData = imageContent => {
        const IMAGE_REG_EX = /image\/*\w+/g;

        // Return false if file is not an image
        if (!imageContent || !imageContent.type.match(IMAGE_REG_EX)) {
            return false;
        }

        const formData = new FormData();

        formData.append('image.content', imageContent);

        return formData;
    };

    saveProfileCallback = (profileData, callback, isLithiumUpdate, shouldMakeAnalyticsCall = true) => {
        if (isLithiumUpdate) {
            this.updateLithium(profileData, this.state.nickname, callback, shouldMakeAnalyticsCall);
        } else if (profileData && profileData.biPrivate) {
            store.dispatch(ProfileActions.updateBiAccount(profileData.biPrivate, callback));
        } else {
            // Get the bi data that is already saved
            const finalObject = biUtils.completeProfileObject(
                profileData.biAccount.personalizedInformation,
                this.state.biAccount.personalizedInformation
            );

            profileData.biAccount.personalizedInformation = finalObject;
            profileData.profileId = this.state.profileId;
            store.dispatch(ProfileActions.updateBiAccount(profileData, callback));
        }

        window.dispatchEvent(new CustomEvent(ProfileUpdated));
    };
}

export default wrapComponent(EditMyProfileModal, 'EditMyProfileModal', true);
