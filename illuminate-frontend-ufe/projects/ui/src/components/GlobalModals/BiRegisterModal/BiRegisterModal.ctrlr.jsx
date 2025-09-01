/* eslint-disable class-methods-use-this */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Button } from 'components/ui';
import store from 'store/Store';
import Actions from 'actions/Actions';
import UserActions from 'actions/UserActions';
import localeUtils from 'utils/LanguageLocale';
import profileActions from 'actions/ProfileActions';
import userUtils from 'utils/User';
import profileApi from 'services/api/profile';
import DecoratorsUtils from 'utils/decorators';
import HelpersUtils from 'utils/Helpers';
import anaUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import ErrorsUtils from 'utils/Errors';
import ErrorConstants from 'utils/ErrorConstants';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import checkoutUtils from 'utils/Checkout';
import Modal from 'components/Modal';
import BiRegisterForm from 'components/BiRegisterForm/BiRegisterForm';
import GuestCheckoutSection from 'components/OrderConfirmation/GuestCheckoutSection/GuestCheckoutSection';
import SubscribeEmail from 'components/SubscribeEmail/SubscribeEmail';

const { withInterstice } = DecoratorsUtils;
const { getProp } = HelpersUtils;

const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/RegisterModal/RegisterForm/locales', 'RegisterForm');

class BiRegisterModal extends BaseClass {
    constructor() {
        super();
        this.state = {
            subscribeSephoraEmail: false
        };
    }

    componentDidMount() {
        if (localeUtils.isCanada() && !checkoutUtils.isGuestOrder()) {
            withInterstice(profileApi.getCurrentProfileEmailSubscriptionStatus)().then(subscribed => {
                if (subscribed) {
                    this.subscribeEmail.setChecked(true);
                }
            });
        }

        // Analytics for biRegister load
        const { REGISTER } = anaConsts.PAGE_TYPES;
        const { analyticsData } = this.props;
        const { context } = analyticsData || {};
        const contextEvent = (context && anaUtils.getLastAsyncPageLoadData({ pageType: context })) || {};
        let registerData = {
            pageName: `${REGISTER}:${REGISTER}:n/a:*`,
            pageType: REGISTER,
            pageDetail: REGISTER,
            eventStrings: [anaConsts.Event.REGISTRATION_STEP_1],
            previousPageName: contextEvent.pageName || getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName')
        };

        if (analyticsData && analyticsData.linkData) {
            registerData = {
                ...registerData,
                linkData: analyticsData.linkData
            };
        }

        if (analyticsData && analyticsData.pageName) {
            registerData = {
                ...registerData,
                pageName: analyticsData.pageName
            };
        }

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: registerData });
    }

    requestClose = () => {
        store.dispatch(Actions.showBiRegisterModal({ isOpen: false }));

        if (this.props.extraParams?.biFormTestType === 'popupModalWithPasswordFieldAndBI') {
            const isBiRegisterModalDismissed = Storage.session.getItem(LOCAL_STORAGE.IS_BIREGISTER_MODAL_DISMISSED);

            if (!isBiRegisterModalDismissed) {
                Storage.session.setItem(LOCAL_STORAGE.IS_BIREGISTER_MODAL_DISMISSED, true);
            }
        }

        if (this.props.cancellationCallback) {
            this.props.cancellationCallback();
        }
    };

    /** success callback for register, close modal */
    biRegisterSuccess = response => {
        store.dispatch(Actions.showBiRegisterModal({ isOpen: false }));

        if (this.props.isCommunity && userUtils.needsSocialReOpt()) {
            store.dispatch(profileActions.showSocialReOptModal(true, this.props.callback, true, this.props.cancellationCallback));

            return;
        }

        if (Sephora.isMobile()) {
            // forward callback to the next modal
            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: getText('registrationComplete'),
                    message: getText('confirmMessageBI'),
                    buttonText: getText('continue'),
                    cancelCallback: this.props.callback
                })
            );
        } else {
            this.props.callback && this.props.callback(response);
        }
    };

    /** failure callback for register */
    biRegisterFailure = response => {
        if (response.errors.biBirthDayInput) {
            this.biRegForm.setErrorState(response.errors.biBirthDayInput.join());
        }
    };

    /** Reformat user bi form data into params for API call
     * @param {object} BI date data
     */
    getOptionParams = biFormData => {
        let optionParams = {};

        if (localeUtils.isCanada()) {
            optionParams.subscription = { subScribeToEmails: this.subscribeEmail.getValue() };
        }

        if (this.props.extraParams) {
            optionParams = {
                ...optionParams,
                ...this.props.extraParams
            };
        }

        optionParams.isJoinBi = !!biFormData;
        optionParams.biAccount = biFormData;

        return optionParams;
    };

    trackErrors = (errorsObj = {}) => {
        const { REGISTER } = anaConsts.PAGE_TYPES;
        const { MODAL } = anaConsts.LinkData;
        const { ERROR } = anaConsts.EVENT_NAMES;
        const errors = Object.keys(errorsObj).map(errKey => errorsObj[errKey]);
        const currentEventData = anaUtils.getLastAsyncPageLoadData({ pageType: REGISTER });
        const eventData = {
            data: {
                linkName: `${REGISTER}:${MODAL}:${ERROR}`,
                bindingMethods: linkTrackingError,
                fieldErrors: errors.map(error => error.name || error.getComp().props.name),
                errorMessages: errors.map(error => error.message),
                ...currentEventData
            }
        };
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, eventData);

        return eventData;
    };

    biRegister = () => {
        const biFormData = this.biRegForm.getBIDate();
        const validate = this.biRegForm.validateForm();
        let totalErrors = store.getState().errors;
        totalErrors = Object.assign({}, totalErrors[ErrorConstants.ERROR_LEVEL.FIELD], totalErrors[ErrorConstants.ERROR_LEVEL.FORM]);
        const hasErrors = Object.keys(totalErrors).length;

        if (hasErrors) {
            if (this.reCaptcha && ErrorsUtils.findError(ErrorConstants.ERROR_CODES.CAPTCHA)) {
                this.reCaptcha.reset();
            }

            //Analytics
            this.trackErrors(totalErrors);
        }

        if (!validate) {
            const optionParams = this.getOptionParams(biFormData);
            const biRegisterAction = UserActions.biRegister(optionParams, this.biRegisterSuccess, this.biRegisterFailure, this.props.analyticsData);
            store.dispatch(biRegisterAction);
        }
    };

    render() {
        const getModalText = localeUtils.getLocaleResourceFile('components/GlobalModals/BiRegisterModal/locales', 'BiRegisterModal');

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={1}
                dataAt='BeautyInsiderPopup'
                formProps={{
                    noValidate: true,
                    onSubmit: e => {
                        e.preventDefault();

                        if (this.biRegForm) {
                            this.biRegister();
                        }
                    }
                }}
            >
                {this.props.extraParams?.biFormTestType === 'popupModalWithPasswordFieldAndBI' && (
                    <Modal.Header>
                        <Modal.Title>{getModalText('createAccount')}</Modal.Title>
                    </Modal.Header>
                )}
                <Modal.Body>
                    {this.props.extraParams?.biFormTestType !== 'popupModalWithPasswordFieldAndBI' && (
                        <BiRegisterForm
                            isBiModal={true}
                            isCreditCardApply={this.props.isCreditCardApply}
                            extraParams={this.props.extraParams}
                            ref={c => {
                                if (c !== null) {
                                    this.biRegForm = c;
                                }
                            }}
                        />
                    )}
                    {this.props.extraParams?.biFormTestType === 'popupModalWithPasswordFieldAndBI' && (
                        <GuestCheckoutSection
                            isModal={true}
                            isExistingUser={this.props.extraParams?.isEmailRegistered}
                            isNonBIRegisteredUser={this.props.extraParams?.isNonBIRegisteredUser}
                            isBooking={this.props.extraParams?.isBooking}
                            confirmationId={this.props.extraParams?.confirmationId}
                            guestEmail={this.props.extraParams?.guestEmail}
                            guestProfileId={this.props.extraParams?.guestProfileId}
                            biPoints={this.props.extraParams?.biPoints}
                            isStoreBIMember={this.props.extraParams?.isStoreBIMember}
                            editStore='GuestCheckoutSignIn'
                            biFormTestType={this.props.extraParams?.biFormTestType}
                            isCompleteAccountSetupModal={this.props.isCompleteAccountSetupModal}
                            orderId={this.props.extraParams?.orderId}
                            biAccountId={this.props.extraParams?.biAccountId}
                            firstName={this.props.extraParams?.firstName}
                            lastName={this.props.extraParams?.lastName}
                        />
                    )}
                    {localeUtils.isCanada() && this.props.extraParams?.biFormTestType !== 'popupModalWithPasswordFieldAndBI' && (
                        <SubscribeEmail
                            checked={this.state.subscribeSephoraEmail}
                            disabled={false}
                            ref={c => {
                                if (c !== null) {
                                    this.subscribeEmail = c;
                                }
                            }}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {this.props.extraParams?.biFormTestType !== 'popupModalWithPasswordFieldAndBI' && (
                        <Button
                            variant='primary'
                            hasMinWidth={true}
                            type='submit'
                        >
                            {getModalText('joinButton')}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(BiRegisterModal, 'BiRegisterModal');
