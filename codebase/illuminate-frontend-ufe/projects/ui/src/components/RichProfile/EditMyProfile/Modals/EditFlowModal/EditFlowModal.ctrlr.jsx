import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import watch from 'redux-watch';
import ProfileActions from 'actions/ProfileActions';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
// Categories Contents
import BioProfile from 'components/RichProfile/EditMyProfile/Content/BioProfile/BioProfile';
import Skin from 'components/RichProfile/EditMyProfile/Content/Skin/Skin';
import Hair from 'components/RichProfile/EditMyProfile/Content/Hair/Hair';
import Eyes from 'components/RichProfile/EditMyProfile/Content/Eyes/Eyes';
import ColorIQ from 'components/RichProfile/EditMyProfile/Content/ColorIQ/ColorIQ';
import Birthday from 'components/RichProfile/EditMyProfile/Content/Birthday/Birthday';
import Privacy from 'components/RichProfile/EditMyProfile/Content/Privacy/Privacy';

import localeUtils from 'utils/LanguageLocale';

import { Button, Icon } from 'components/ui';
import Modal from 'components/Modal/Modal';
import Location from 'utils/Location';

const SAVED_TEXT_TIMEOUT = 1000;
const { PHOTO_AND_BIO, PRIVACY_SETTINGS, COMMUNITY_PROFILE, MY_PROFILE } = anaConsts.LinkData;
const getModalType = isPhotosAndBio => (isPhotosAndBio ? PHOTO_AND_BIO : PRIVACY_SETTINGS);
const getPageName = isPhotosAndBio => `${COMMUNITY_PROFILE}:${MY_PROFILE}:${getModalType(isPhotosAndBio)}:*`;
const isMySephoraPage = Location.isMySephoraPage();

const content = [BioProfile, Skin, Hair, Eyes, ColorIQ, Birthday, Privacy];
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/EditMyProfile/Content/Privacy/locales', 'Privacy');

class EditFlowModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            biAccount: this.props.biAccount,
            beautyPreference: {},
            iSaved: false
        };
    }

    componentDidMount() {
        //need to be able to add color iqs on the fly from color iq edit flow section
        const isColorIQSection = this.props.title === 'Color IQ';

        if (isColorIQSection) {
            const biInfoWatch = watch(store.getState, 'user.beautyInsiderAccount');
            store.subscribe(
                biInfoWatch(newBiInfo => {
                    this.setState({ biAccount: newBiInfo });
                }),
                this
            );
        }

        this.avatarFile = null;

        const { isPhotosAndBio, beautyPreferences } = this.props;
        this.fireAnalyticsPageLoad(isPhotosAndBio);
        this.setState({ beautyPreference: beautyPreferences });
    }

    getCategoryContent = idx => {
        return content[idx];
    };

    save = () => {
        const isBioProfileSection = this.props.content === 0;

        //no getData function for some of the edit profile sections (Color IQ, Birthday)
        //when no getData function, then no need for saveProfileCallback. Just close modal.
        if (this.tabContent.getData) {
            const dataToSave = this.tabContent.getData();

            this.props.saveProfileCallback(
                dataToSave,
                () => {
                    this.setState({ isSaved: true }, () => setTimeout(() => this.setState({ isSaved: false }), SAVED_TEXT_TIMEOUT));
                },
                isBioProfileSection,
                false
            );

            this.fireAnalytics(dataToSave, this.props.isPhotosAndBio);
        } else {
            store.dispatch(ProfileActions.showEditFlowModal(false));
        }
    };

    requestClose = () => {
        store.dispatch(ProfileActions.showEditFlowModal(false));
    };

    fireAnalytics = (dataToSave, isPhotosAndBio) => {
        if (!isPhotosAndBio) {
            digitalData.page.attributes.previousPageData.pageName = getPageName(isPhotosAndBio);
        }

        const actionInfo = `cmnty:my profile:updated:${getModalType(isPhotosAndBio)}`;
        const eventStrings = [anaConsts.Event.EVENT_71];

        if (isPhotosAndBio) {
            eventStrings.push(anaConsts.Event.EDIT_ABOUT_ME_TEXT);
        }

        if (this.avatarFile !== (dataToSave.avatarFile || null)) {
            eventStrings.push(anaConsts.Event.UPLOAD_PROFILE_PHOTO);
            this.avatarFile = dataToSave.avatarFile;
        }

        // Analytics - ILLUPH-104509
        if (dataToSave.biPrivate?.biPrivate || isPhotosAndBio) {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    eventStrings,
                    linkName: 'D=c55',
                    actionInfo,
                    text: getText('justMe').toLowerCase(),
                    pageName: getPageName(isPhotosAndBio),
                    world: getModalType(isPhotosAndBio)
                }
            });
        }
    };

    fireAnalyticsPageLoad = isPhotosAndBio => {
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: getPageName(isPhotosAndBio),
                pageType: COMMUNITY_PROFILE,
                pageDetail: MY_PROFILE,
                world: getModalType(isPhotosAndBio)
            }
        });
    };

    render() {
        const {
            isOpen, title, socialProfile, saveText, savedText, isPhotosAndBio
        } = this.props;

        const { isSaved, biAccount, beautyPreference } = this.state;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={this.requestClose}
                hasBodyScroll={Sephora.isMobile()}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                    {!isMySephoraPage && <Modal.Back onClick={this.requestClose} />}
                </Modal.Header>
                <Modal.Body
                    {...(isPhotosAndBio && {
                        paddingTop: 0
                    })}
                >
                    {isPhotosAndBio ? (
                        <BioProfile
                            socialProfile={socialProfile}
                            ref={comp => (this.tabContent = comp)}
                        />
                    ) : (
                        <Privacy
                            biAccount={biAccount}
                            beautyPreference={beautyPreference}
                            ref={comp => (this.tabContent = comp)}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='primary'
                        disabled={isSaved && true}
                        onClick={!isSaved && this.save}
                        block={true}
                        width={[null, 176]}
                        marginLeft='auto'
                        marginRight={['auto', 0]}
                    >
                        {isSaved ? (
                            <>
                                <Icon
                                    name='checkmark'
                                    size='1em'
                                    marginRight={2}
                                />
                                {savedText}
                            </>
                        ) : (
                            <>{saveText}</>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(EditFlowModal, 'EditFlowModal');
