import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import ProfileActions from 'actions/ProfileActions';
import userActions from 'actions/UserActions';
import termsAndConditionsActions from 'actions/TermsAndConditionsActions';
import localeUtils from 'utils/LanguageLocale';
import watch from 'redux-watch';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

import {
    Box, Image, Text, Button, Link
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import ErrorMsg from 'components/ErrorMsg';
import { globalModals, renderModal } from 'utils/globalModals';

const { TERMS_OF_SERVICE } = globalModals;
const TERMS_AND_CONDITIONS_MEDIA_ID = 11300018;
const TERMS_AND_CONDITIONS_TITLE = 'Terms & Conditions';

class SocialReOptModal extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            hasAcceptedTerms: false
        };
    }

    close = () => {
        store.dispatch(ProfileActions.showSocialReOptModal(false));

        if (this.props.cancellationCallback) {
            this.props.cancellationCallback();
        }
    };

    handleClick = () => {
        if (localeUtils.isCanada() && !this.state.hasAcceptedTerms) {
            this.setState({ displayErrorMessage: true });
        } else {
            const data = {
                fragmentForUpdate: 'SOCIAL',
                isAcceptCommunity: true
            };

            store.dispatch(userActions.updateUserFragment(data, this.handleClickSuccessCallback));
        }
    };

    handleClickSuccessCallback = () => {
        store.dispatch(ProfileActions.showSocialReOptModal(false));
        store.dispatch(userActions.getUserFull());

        //wait for userFull call to complete before calling socialReOptCallback
        const isSocialEnabledWatch = watch(store.getState, 'user.isSocialEnabled');
        store.subscribe(
            isSocialEnabledWatch(() => {
                if (this.props.socialReOptCallback) {
                    this.props.socialReOptCallback();
                }
            }),
            this
        );

        //Analytics
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'social registration:re-opt in:success',
                actionInfo: 'social registration:re-opt in:success',
                eventStrings: [anaConsts.Event.EVENT_71],
                previousPage: 'social registration:re-opt in:n/a:*'
            }
        });
    };

    handleAcceptCommunityClick = e => {
        this.setState({
            hasAcceptedTerms: e.target.checked,
            displayErrorMessage: false
        });
    };

    openTermsAndConditions = () => {
        renderModal(this.props.globalModals[TERMS_OF_SERVICE], () => {
            store.dispatch(termsAndConditionsActions.showModal(true, TERMS_AND_CONDITIONS_MEDIA_ID, TERMS_AND_CONDITIONS_TITLE));
        });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/SocialReOptModal/locales', 'SocialReOptModal');

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.close}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{getText('updateTermsOfUse')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Box
                        textAlign='center'
                        marginY={[3, 0]}
                    >
                        <Image
                            display='block'
                            marginX='auto'
                            src='/img/ufe/bi/logo-bi-community.svg'
                            width={258}
                            height={58}
                            marginBottom={4}
                            alt={getText('biInsiderCommunity')}
                        />
                        <Text is='p'>{getText('askQuestionsBi')}</Text>
                        <Text
                            is='p'
                            marginTop={6}
                        >
                            <b>{getText('termsChanged')}</b>
                        </Text>
                    </Box>
                </Modal.Body>

                <Modal.Footer hasBorder={true}>
                    {localeUtils.isUS() ? (
                        <Box
                            fontSize='sm'
                            marginBottom={5}
                            color='gray'
                            lineHeight='tight'
                        >
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: getText('agreeToContinue')
                                }}
                            />{' '}
                            <Link
                                color='blue'
                                underline={true}
                                onClick={this.openTermsAndConditions}
                            >
                                {getText('termsOfUse')}
                            </Link>
                            .{' '}
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: getText('agreeToPublicPage')
                                }}
                            />{' '}
                            <Link
                                color='blue'
                                underline={true}
                                onClick={this.openTermsAndConditions}
                            >
                                {getText('termsOfUse')}
                            </Link>{' '}
                            {getText('forMoreInformation')}
                        </Box>
                    ) : (
                        <Box
                            fontSize='sm'
                            marginBottom={5}
                            color='gray'
                            lineHeight='tight'
                        >
                            <Checkbox
                                name='TermsAndConditions'
                                checked={this.state.hasAcceptedTerms}
                                onClick={this.handleAcceptCommunityClick}
                            >
                                <div>
                                    {getText('joinAndAgree')}{' '}
                                    <Link
                                        color='blue'
                                        underline={true}
                                        onClick={this.openTermsAndConditions}
                                    >
                                        {getText('termsOfUse')}
                                    </Link>
                                    .{' '}
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: getText('agreeToPublicPage')
                                        }}
                                    />{' '}
                                    <Link
                                        color='blue'
                                        underline={true}
                                        onClick={this.openTermsAndConditions}
                                    >
                                        {getText('termsOfUse')}
                                    </Link>{' '}
                                    {getText('forMoreInformation')}
                                </div>
                            </Checkbox>
                            <Box marginTop={2}>
                                {this.state.displayErrorMessage && (
                                    <ErrorMsg
                                        marginTop={2}
                                        marginBottom='0'
                                    >
                                        {getText('agreeTermsAndConditions')}
                                    </ErrorMsg>
                                )}
                            </Box>
                        </Box>
                    )}
                    <Button
                        variant='primary'
                        hasMinWidth={true}
                        onClick={this.handleClick}
                    >
                        {getText('continue')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(SocialReOptModal, 'SocialReOptModal');
