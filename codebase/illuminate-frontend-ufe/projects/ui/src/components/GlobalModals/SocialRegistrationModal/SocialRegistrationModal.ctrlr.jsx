import store from 'store/Store';
import actions from 'Actions';
import profileActions from 'actions/ProfileActions';
import socialInfoActions from 'actions/SocialInfoActions';
import userActions from 'actions/UserActions';
import profileApi from 'services/api/profile';
import biApi from 'services/api/beautyInsider';
import userUtils from 'utils/User';
import formValidator from 'utils/FormValidator';
import termsAndConditionsActions from 'actions/TermsAndConditionsActions';

import watch from 'redux-watch';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import Community from 'utils/Community';
import EditDataActions from 'actions/EditDataActions';
import {
    Box, Image, Text, Button, Link
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import BiBirthdayForm from 'components/BiRegisterForm/BiBirthdayForm/BiBirthdayForm';
import TextInput from 'components/Inputs/TextInput/TextInput';

import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import SubscribeEmail from 'components/SubscribeEmail/SubscribeEmail';
import ErrorMsg from 'components/ErrorMsg';
import ErrorList from 'components/ErrorList';
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import getLithiumSSOToken from 'services/api/profile/getLithiumSSOToken';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

const COMMUNITY_TERMS_AND_CONDITIONS_MEDIA_ID = 43900056;
const BI_TERMS_AND_CONDITIONS_MEDIA_ID = 28100020;
const TERMS_AND_CONDITIONS_TITLE = 'Terms & Conditions';
const MIN_NICKNAME_LENGTH = 4;
const MAX_NICKNAME_LENGTH = 15;

const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/SocialRegistrationModal/locales', 'SocialRegistrationModal');

class SocialRegistrationModal extends BaseClass {
    //Analytics
    isJoiningBI = false;

    constructor(props) {
        super(props);

        this.state = {
            errorMessages: null
        };

        this.subscribeEmail = React.createRef();
        this.nicknameInput = React.createRef();
        this.birthdayForm = React.createRef();
    }

    componentWillUnmount() {
        // Delete properties pertaining to sign up from store (name, pw etc...)
        store.dispatch(EditDataActions.clearEditData(this.props.editStore));
    }

    openTermsAndConditions = isBiTerms => {
        const termsMediaId = isBiTerms ? BI_TERMS_AND_CONDITIONS_MEDIA_ID : COMMUNITY_TERMS_AND_CONDITIONS_MEDIA_ID;
        store.dispatch(termsAndConditionsActions.showModal(true, termsMediaId, TERMS_AND_CONDITIONS_TITLE));
    };

    handleJoinBIClick = e => {
        this.setState({ isJoinBI: e.target.checked });
    };

    handleJoinClick = () => {
        let createBiAccount;
        let setNickname;
        let hasFrontEndError = false;
        const isCanada = localeUtils.isCanada();

        const isAddReviewPage = window.location.href.indexOf('/addReview') !== -1;

        if (isAddReviewPage) {
            window.addEventListener('postPageLoad', () => anaUtils.fireEventForTagManager('joinCommunityButtonClick'));
        } else {
            anaUtils.fireEventForTagManager('joinCommunityButtonClick');
        }

        if (!userUtils.isBI() && !this.state.isUserBI) {
            const optionParams = {};
            const isBirthdayValid = this.birthdayForm.current?.validateForm();

            optionParams.isJoinBi = isCanada ? this.state.isJoinBI : true;
            this.isJoiningBI = optionParams.isJoinBi; // Analytics

            if (isBirthdayValid && optionParams.isJoinBi) {
                optionParams.biAccount = this.birthdayForm.current?.getBirthday();

                if (isCanada) {
                    optionParams.subscription = { subScribeToEmails: this.subscribeEmail.current?.getValue() };
                }

                // Return true if call was successful and false if rejected
                createBiAccount = () => {
                    return biApi
                        .createBiAccount(optionParams)
                        .then(data => {
                            if (data?.biAccountId) {
                                Storage.local.setItem(LOCAL_STORAGE.BI_ACCOUNT_ID, data.biAccountId);
                            }

                            this.setState({ isUserBI: true });

                            return true;
                        })
                        .catch(() => {
                            return false;
                        });
                };
            } else {
                // If form did not pass front end validation, don't make the Api call
                // and just return false
                hasFrontEndError = true;
                createBiAccount = () => {
                    return Promise.resolve(false);
                };
            }
        } else {
            // If user is already BI, just return true
            createBiAccount = () => {
                return Promise.resolve(true);
            };
        }

        if (!this.state.hasNickname) {
            // Clear previous errors
            if (this.state.errorMessages || this.state.invalidNickname) {
                this.setState({
                    invalidNickname: false,
                    errorMessages: null
                });
            }

            const errors = formValidator.getErrors([this.nicknameInput.current]);

            if (!errors.fields.length) {
                // Return true if call was successful and false if rejected
                setNickname = () => {
                    store.dispatch(actions.showInterstice(true));

                    return profileApi
                        .setNickname(
                            this.nicknameInput.current?.getValue(),
                            this.props.socialRegistrationProvider,
                            this.getRegistrationSource(this.props.socialRegistrationProvider)
                        )
                        .then(async () => {
                            store.dispatch(actions.showInterstice(false));
                            this.setState({
                                hasNickname: true,
                                errorMessages: null,
                                invalidNickname: false
                            });

                            // Set new lith token in LS when user sets nickname
                            const profileId = userUtils.getProfileId();
                            const newLithiumSsoToken = await getLithiumSSOToken(profileId);

                            // Success, let's store the lithium sso token in LocalStorage for later.
                            Storage.local.setItem(LOCAL_STORAGE.LITHIUM_API_TOKEN, newLithiumSsoToken);

                            return true;
                        })
                        .catch(e => {
                            store.dispatch(actions.showInterstice(false));
                            this.setState({
                                errorMessages: e.errorMessages,
                                invalidNickname: true,
                                displayJoinBIError: false
                            });

                            return false;
                        });
                };
            } else {
                // If nickname field did not pass front end validation, don't make the
                // Api call and just return false
                hasFrontEndError = true;
                setNickname = () => {
                    return Promise.resolve(false);
                };
            }
        } else {
            // If first nickname call was successful, but there was an error in birthday
            // fields, just return true and don't make Api call
            setNickname = () => {
                return Promise.resolve(true);
            };
        }

        if (!hasFrontEndError) {
            Promise.all([createBiAccount(), setNickname()]).then(values => {
                const biAccountData = values[0]; // Data from createBiAccount()

                if (biAccountData?.biAccountId) {
                    Storage.local.setItem(LOCAL_STORAGE.BI_ACCOUNT_ID, biAccountData.biAccountId);
                }
                // Only call success callback if neither nickname or birthday returns an error

                const errors = values.filter(value => {
                    return value === false;
                });

                if (!errors.length) {
                    this.registrationSuccess();
                }
            });
        } else {
            this.setState({
                displayJoinBIError: isCanada && !this.state.isUserBI && !this.state.isJoinBI
            });
        }
    };

    registrationSuccess = () => {
        processEvent.process('communityProfileCreationSuccess');

        store.dispatch(profileActions.showSocialRegistrationModal(false));
        store.dispatch(userActions.getUserFull());

        //Analytics
        let pageDetail = 'nickname';
        const eventStrings = [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_244];

        if (this.isJoiningBI) {
            pageDetail += ' birthday';
            eventStrings.push(anaConsts.Event.REGISTRATION_WITH_BI);
        }

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'social registration:' + pageDetail + ':success',
                actionInfo: 'social registration:' + pageDetail + ':success',
                eventStrings: eventStrings
            }
        });
        //We use this communityProfileCreationWithData when we need to trigger signal with
        //user or page data as opposed to communityProfileCreationSuccess. The former needs
        //to wait the sequence of events to be triggered (pageLoad, asyncPageLoad, etc),
        //so it has the correct data when triggered
        processEvent.process('communityProfileCreationWithData');

        const signUpOptions = {
            isJoinBi: true,
            inStoreUser: false
        };

        userUtils.setSignUpData(signUpOptions);
    };

    close = () => {
        // If BI call is successful, but user errors on nickname and then closes the modal,
        // update the user to reflect that she is now BI
        if (this.state.isUserBI) {
            store.dispatch(userActions.getUserFull());
            const biInfoWatch = watch(store.getState, 'user.beautyInsiderAccount');

            //should only be able to register for bi once, so unsubscribe from this watch
            //so that we don't setLithiumSuccssStatus to false multiple times
            const unsubscribe = store.subscribe(
                biInfoWatch(() => {
                    store.dispatch(profileActions.showSocialRegistrationModal(false));

                    //dispatch setLithiumSuccessStatus here when user only successfully registers for bi,
                    //this will reject the promise for 'ensureUserIsReadyForSocialAction' since this close
                    //function is only called if the user exits out of social registration modal
                    store.dispatch(socialInfoActions.setLithiumSuccessStatus(false));
                    unsubscribe();
                }),
                this
            );
        } else {
            store.dispatch(profileActions.showSocialRegistrationModal(false));

            //dispatch setLithiumSuccessStatus here when user only successfully registers for bi,
            //this will reject the promise for 'ensureUserIsReadyForSocialAction' since this close
            //function is only called if the user exits out of social registration modal
            store.dispatch(socialInfoActions.setLithiumSuccessStatus(false));
        }
    };

    getRegistrationSource = socialRegistrationProvider => {
        if (Location.isMyProfilePage()) {
            return 'profile';
        }

        switch (socialRegistrationProvider) {
            case Community.PROVIDER_TYPES.bv:
                return 'reviews';
            case Community.PROVIDER_TYPES.lithium:
                return 'groups';
            default:
        }

        return '';
    };

    openBiTermsAndConditions = () => {
        this.openTermsAndConditions(true);
    };

    validateNickname = nickname => {
        if (formValidator.isEmpty(nickname)) {
            return getText('nickName');
        } else if (!formValidator.isValidLength(nickname, MIN_NICKNAME_LENGTH, MAX_NICKNAME_LENGTH)) {
            return getText('nickNameLength');
        } else if (!formValidator.isAlphaNumeric(nickname)) {
            return getText('fixNickName');
        }

        return null;
    };

    render() {
        const isUserBI = userUtils.isBI();
        const isCanada = localeUtils.isCanada();

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.close}
                width={0}
                formProps={{
                    noValidate: true,
                    onSubmit: e => {
                        e.preventDefault();
                        this.handleJoinClick();
                    }
                }}
            >
                <Modal.Body padForX={true}>
                    <Box
                        textAlign='center'
                        marginTop={5}
                        marginBottom={4}
                        lineHeight='tight'
                    >
                        <Image
                            display='block'
                            marginX='auto'
                            src='/img/ufe/bi/logo-bi-community.svg'
                            width={258}
                            height={58}
                            marginBottom={4}
                            disableLazyLoad={true}
                            alt={getText('biAlt')}
                        />
                        <p>{getText('lead')}</p>
                    </Box>
                    <TextInput
                        name='nickname'
                        label={getText('nickNameLabel')}
                        autoComplete='nickname'
                        autoCorrect='off'
                        autoCapitalize='off'
                        spellCheck={false}
                        required={true}
                        hideAsterisk={true}
                        maxLength={15}
                        ref={this.nicknameInput}
                        invalid={this.state.invalidNickname}
                        validate={this.validateNickname}
                    />

                    <ErrorList errorMessages={this.state.errorMessages} />

                    {isUserBI || (
                        <>
                            <fieldset>
                                <Text
                                    is='legend'
                                    marginBottom={2}
                                    fontWeight='bold'
                                    lineHeight='tight'
                                    // squeeze onto one line
                                    letterSpacing='-.013em'
                                    children={getText('birthdayLegend')}
                                />
                                <BiBirthdayForm
                                    isRequired={true}
                                    hideAsterisk={true}
                                    ref={this.birthdayForm}
                                />
                            </fieldset>
                            {isCanada && (
                                <>
                                    <SubscribeEmail
                                        hasDivider={false}
                                        paddingY={2}
                                        marginTop={2}
                                        fontWeight={null}
                                        ref={this.subscribeEmail}
                                    />
                                    <Checkbox
                                        paddingY={2}
                                        marginBottom={-2}
                                        checked={this.state.isJoinBI}
                                        onClick={this.handleJoinBIClick}
                                        name='join_bi'
                                    >
                                        {getText('agreeBiTermsAndConditions')}
                                    </Checkbox>
                                    {this.state.displayJoinBIError && (
                                        <ErrorMsg
                                            marginTop={2}
                                            marginBottom={null}
                                        >
                                            {getText('agreeTermsAndConditions')}
                                        </ErrorMsg>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    <Box
                        textAlign='center'
                        lineHeight='tight'
                    >
                        <Image
                            display='block'
                            marginX='auto'
                            src='/img/ufe/social-reg-avatars.jpg'
                            width={157}
                            height={54}
                            marginY={3}
                            disableLazyLoad={true}
                        />
                        <p>{getText('desc')}</p>
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Box
                        fontSize='sm'
                        marginBottom={4}
                        color='gray'
                        lineHeight='tight'
                    >
                        {!isUserBI ? (
                            <Text is='p'>
                                {getText('joinCommunity')}{' '}
                                <Link
                                    is='span'
                                    color='blue'
                                    fontWeight='bold'
                                    underline={true}
                                    display='inline'
                                    onClick={this.openTermsAndConditions}
                                >
                                    {getText('termsOfUse')}
                                </Link>
                                . {getText('joinBiTerms')}{' '}
                                <Link
                                    is='span'
                                    color='blue'
                                    fontWeight='bold'
                                    underline={true}
                                    display='inline'
                                    onClick={this.openBiTermsAndConditions}
                                >
                                    {getText('biTermsAndConditions')}
                                </Link>
                                {isCanada ? '.' : getText('receiveEmails')}
                            </Text>
                        ) : (
                            <Text is='p'>
                                {getText('joinCommunity')}{' '}
                                <Link
                                    is='span'
                                    color='blue'
                                    fontWeight='bold'
                                    underline={true}
                                    display='inline'
                                    onClick={this.openTermsAndConditions}
                                >
                                    {getText('termsOfUse')}
                                </Link>
                                . {getText('publicProfile')}
                            </Text>
                        )}
                    </Box>
                    <Button
                        type='submit'
                        variant='primary'
                        block={true}
                        data-at={Sephora.debug.dataAt('join_now')}
                    >
                        {getText('cta')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(SocialRegistrationModal, 'SocialRegistrationModal');
