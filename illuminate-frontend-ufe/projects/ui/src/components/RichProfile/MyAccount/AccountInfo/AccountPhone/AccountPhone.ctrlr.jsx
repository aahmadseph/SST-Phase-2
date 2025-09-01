import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Button, Text, Link, Divider, Box, Flex
} from 'components/ui';
import { space } from 'style/config';
import InfoButton from 'components/InfoButton/InfoButton';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import MobilePhoneInput from 'components/Inputs/MobilePhoneInput/MobilePhoneInput';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import FormValidator from 'utils/FormValidator';
import agentAwareUtils from 'utils/AgentAware';
import ErrorList from 'components/ErrorList';
import localeUtils from 'utils/LanguageLocale';
import formValidator from 'utils/FormValidator';
import store from 'store/Store';
import userActions from 'actions/UserActions';
import Actions from 'actions/Actions';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
import * as legalConstants from 'constants/legal';
import userUtils from 'utils/User';
import Empty from 'constants/empty';
import RegisterPhoneBanner from 'components/GlobalModals/RegisterModal/RegisterForm/RegisterPhoneBanner/RegisterPhoneBanner';
import anaConsts from 'analytics/constants';

const MAX_VISIBLE_PHONE_DIGITS = 3;
class AccountPhone extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { errorMessages: null, isMarketingEnabled: false };

        // Store the initial phone state to determine if this is an add or update operation
        this.initialPhoneNumber = props.user.primaryPhone;

        this.getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/AccountInfo/AccountPhone/locales', 'AccountPhone');
    }

    validateForm = () => {
        const fieldsForValidation = [this.phoneInput, this.confirmPhoneInput];

        const errors = formValidator.getErrors(fieldsForValidation);

        const result = { hasError: false };

        if (errors.fields.length) {
            result.hasError = true;

            if (errors.errorIndex) {
                result.errorField = fieldsForValidation[errors.errorIndex - 1];
            }
        }

        return result;
    };

    checkAndFireAnalytics = () => {
        const fieldsForValidation = [this.phoneInput, this.confirmPhoneInput];
        const errors = formValidator.getErrors(fieldsForValidation);
        const { PHONE_UPDATE } = analyticsConsts.FIELD_ERRORS;

        if (errors.fields.length) {
            //Analytics
            processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                data: {
                    linkName: 'error',
                    fieldErrors: PHONE_UPDATE,
                    errorMessages: errors.messages
                }
            });
        }
    };

    editSuccess = () => {
        const { PHONE_UPDATE, PHONE_ADD } = analyticsConsts.ACTION_INFO;

        if (this.state.isMarketingEnabled) {
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: `${anaConsts.PAGE_TYPES.TEXT_MODAL}:${anaConsts.PAGE_DETAIL.SUBSCRIBE_TEXT_IS_ON_THE_WAY}:n/a:*`,
                    pageType: anaConsts.PAGE_TYPES.TEXT_MODAL,
                    pageDetail: anaConsts.PAGE_DETAIL.SUBSCRIBE_TEXT_IS_ON_THE_WAY,
                    eventStrings: [anaConsts.Event.REGISTRATION_PHONE_OPT_IN]
                }
            });
            store.dispatch(
                Actions.showMobileConfirmModal(
                    true,
                    this.getHiddenPhoneNumber(this.phoneInput.getValue().replace(/\D+/g, '')),
                    this.smsOptInSuccessCallback
                )
            );
        }

        if (this.initialPhoneNumber) {
            processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo: PHONE_UPDATE
                }
            });
        } else {
            const data = {
                actionInfo: PHONE_ADD
            };

            // Fire s.t() call when user successfully adds a phone number
            if (this.state.isMarketingEnabled) {
                data.eventStrings = [anaConsts.Event.REGISTRATION_PHONE_OPT_IN];
            }

            processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, { data });
        }

        this.props.setEditSection('');
        // Update initial phone state for future operations
        this.initialPhoneNumber = this.phoneInput.getValue().replace(/\D+/g, '');
    };

    onRemoveSuccess = () => {
        const { user } = this.props;
        const wasOptedInForSMS = user.isUserSMSOptedIn;

        //Fire s.tl() call when phone removal is successful
        const eventData = {
            data: {
                actionInfo: anaConsts.ACTION_INFO.PHONE_REMOVE
            }
        };

        // AC3: If removal also unsubscribes from SMS texts, add event292
        if (wasOptedInForSMS) {
            eventData.data.eventStrings = [anaConsts.Event.EVENT_292];
        }

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, eventData);

        store.dispatch(userActions.update({ primaryPhone: '', isUserSMSOptedIn: false }));
        this.props.setEditSection('');
        store.dispatch(Actions.showRemovePhoneConfirmationModal({ isOpen: false }));
        // Update initial phone state for future operations - phone is now removed
        this.initialPhoneNumber = '';
    };

    editFailure = error => {
        if (userUtils.isPhoneRejectedError(error)) {
            const invalidPhoneError = this.getText('phoneNumberRejected');
            this.phoneInput.showError(invalidPhoneError);
            this.confirmPhoneInput.showError(invalidPhoneError);
        } else if (error.errorMessages) {
            this.setState({ errorMessages: [error.errorMessages] });
        }
    };

    getOptionParams = (overrideVerification = false, removePhone = false) => {
        const optionParams = {
            fragmentForUpdate: userActions.FRAGMENT_FOR_UPDATE.PHONE,
            primaryPhone: !removePhone ? this.phoneInput.getValue().replace(/\D+/g, '') : '',
            confirmPrimaryPhone: !removePhone ? this.confirmPhoneInput.getValue().replace(/\D+/g, '') : '',
            requestOrigin: 'MyAccount',
            isPrimaryPhoneSmsOptedIn: removePhone ? false : this.state.isMarketingEnabled,
            ...(overrideVerification && { overrideVerification })
        };

        return optionParams;
    };

    callUpdateUserFragment = (overrideVerification = false, removePhone = false) => {
        const optionParams = this.getOptionParams(overrideVerification, removePhone);

        this.setState({ errorMessages: null });

        const successCallback = removePhone ? this.onRemoveSuccess : this.editSuccess;

        store.dispatch(userActions.updateUserFragment(optionParams, successCallback, this.editFailure));

        //Analytics
        // processEvent.process(analyticsConsts.ASYNC_PAGE_LOAD, {
        //     data: {
        //         pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
        //         linkData: digitalData.page.category.pageType + ':my account:phone:update',
        //         pageType: digitalData.page.category.pageType,
        //         pageDetail: digitalData.page.pageInfo.pageName
        //     }
        // });
    };

    submitForm = e => {
        e.preventDefault();

        const validate = this.validateForm();

        if (!validate.hasError) {
            // Analytics for Update button click
            processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo: analyticsConsts.ACTION_INFO.PHONE_UPDATE
                }
            });
            this.callUpdateUserFragment();
        } else {
            this.setState({ errorMessages: null });
        }
    };

    onRemovePhoneClick = () => {
        //  Fire s.t() call when remove modal opens
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${anaConsts.PAGE_TYPES.TEXT_MODAL}:${anaConsts.PAGE_DETAIL.REMOVE}:n/a:*`,
                pageType: anaConsts.PAGE_TYPES.TEXT_MODAL,
                pageDetail: anaConsts.PAGE_DETAIL.REMOVE
            }
        });

        store.dispatch(
            Actions.showRemovePhoneConfirmationModal({
                isOpen: true,
                phoneNumber: this.props.user.primaryPhone,
                onCancel: Empty.Function,
                onContinue: () => this.callUpdateUserFragment(false, true)
            })
        );
    };

    toggleMarketing = () => {
        this.setState({ isMarketingEnabled: !this.state.isMarketingEnabled });
    };

    fireUnsubscribeAnalytics = () => {
        const pageType = anaConsts.PAGE_TYPES.TEXT_MODAL;
        const pageDetail = anaConsts.PAGE_DETAIL.UNSUBSCRIBE_DISCLAIMER;
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                pageDetail,
                pageType
            }
        });
    };

    handleInfoButtonClick = () => {
        this.fireUnsubscribeAnalytics();
        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: this.getText('InfoModaltitle'),
                message: this.getText('InFoDescription'),
                buttonText: this.getText('GotIt'),
                callback: () => store.dispatch(Actions.showInfoModal({ isOpen: false })),
                showCloseButton: true
            })
        );
    };

    getHiddenPhoneNumber = mobile => {
        if (!mobile || mobile.length < MAX_VISIBLE_PHONE_DIGITS) {
            return '••• ••• ••••';
        }

        return `••• ••• •${mobile.substr(mobile.length - MAX_VISIBLE_PHONE_DIGITS)}`;
    };

    smsOptOutSuccessCallback = () => {
        // AC2: Fire s.tl() call when user successfully unsubscribes from SMS
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                previousPage: `${anaConsts.PAGE_TYPES.TEXT_MODAL}:${anaConsts.PAGE_DETAIL.UNSUBSCRIBE}:n/a:*`,
                eventStrings: [anaConsts.Event.EVENT_292]
            }
        });

        store.dispatch(userActions.update({ isUserSMSOptedIn: false }));
        store.dispatch(Actions.showMobileConfirmModal(false, ''));
    };

    smsOptInSuccessCallback = () => {
        store.dispatch(Actions.showMobileConfirmModal(false, ''));
    };

    subscribeCallBack = () => {
        const { user } = this.props;
        const isSubscribed = user.isUserSMSOptedIn;
        const action = userActions.submitSMSOptInForm(
            user.primaryPhone,
            'MyAccount',
            this.getHiddenPhoneNumber(user.primaryPhone),
            this.editFailure,
            !isSubscribed ? 'SMS_optin' : 'SMS_optout',
            null,
            isSubscribed ? this.smsOptOutSuccessCallback : this.smsOptInSuccessCallback
        );
        store.dispatch(action);
        store.dispatch(Actions.showInfoModal({ isOpen: false }));
    };

    getUnsubscribeModalText = () => {
        const { user } = this.props;

        return (
            <>
                <Text
                    is='p'
                    marginBottom={1}
                >
                    {this.getText('unsubscribeInfoDescription')}
                </Text>
                <Text
                    is='p'
                    marginBottom={1}
                >
                    {this.getHiddenPhoneNumber(user.primaryPhone)}
                </Text>
                <Text
                    is='p'
                    marginBottom={1}
                >
                    {this.getText('unsubscribeInfoDescription2')}
                </Text>
            </>
        );
    };

    generateTextsTerms = addingNumber => {
        const isCanada = localeUtils.isCanada();

        return (
            <Box
                color='gray'
                fontSize='sm'
                lineHeight='tight'
                marginTop={4}
            >
                <Text
                    is='p'
                    marginBottom='1em'
                >
                    <Text fontWeight='bold'>{this.getText('disclosure')}</Text>
                    {this.getText('by')}

                    {this.getText('entering')}
                    {addingNumber && (
                        <>
                            {this.getText('checkingThe')}
                            <Text fontWeight='bold'>{this.getText('marketingCheckbox')},</Text>
                        </>
                    )}

                    <Text>{this.getText('clicking', [addingNumber ? this.getText('update') : this.getText('subscribeContinue')])}</Text>
                    <Link
                        color='blue'
                        underline={true}
                        fontWeight='bold'
                        href={legalConstants.TEXT_TERM_LINK}
                        children={this.getText('textTerm')}
                    />
                    <Text>{this.getText('message')}</Text>
                    <Link
                        color='blue'
                        underline={true}
                        fontWeight='bold'
                        href={legalConstants.PRIVACY_POLICY_LINK}
                        children={this.getText('privacy')}
                    />

                    {this.getText('and')}
                    <Link
                        color='blue'
                        underline={true}
                        fontWeight='bold'
                        href={legalConstants.USNoticeIncentiveLink}
                        children={this.getText('noticeOf')}
                    />

                    {this.getText('textStop')}
                    {isCanada ? this.getText('textStopAddress') : ''}
                </Text>
            </Box>
        );
    };

    showSubscribeInfoModal = () => {
        const { user } = this.props;
        const primaryButtonText = this.getText(user.isUserSMSOptedIn ? 'cancel' : 'subscribeContinue');
        const secondaryButtonText = this.getText(user.isUserSMSOptedIn ? 'unsubscribe' : 'cancel');
        const primaryCallback = user.isUserSMSOptedIn ? null : this.subscribeCallBack;
        const secondaryCallback = user.isUserSMSOptedIn ? this.subscribeCallBack : () => store.dispatch(Actions.showInfoModal({ isOpen: false }));

        //  s.t() call when unsubscribe modal opens
        if (user.isUserSMSOptedIn) {
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: `${anaConsts.PAGE_TYPES.TEXT_MODAL}:${anaConsts.PAGE_DETAIL.UNSUBSCRIBE}:n/a:*`,
                    pageType: anaConsts.PAGE_TYPES.TEXT_MODAL,
                    pageDetail: anaConsts.PAGE_DETAIL.UNSUBSCRIBE
                }
            });
        } else {
            // Fire s.t() call when subscribe modal opens
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: `${anaConsts.PAGE_TYPES.TEXT_MODAL}:${anaConsts.PAGE_DETAIL.SUBSCRIBE}:n/a:*`,
                    pageType: anaConsts.PAGE_TYPES.TEXT_MODAL,
                    pageDetail: anaConsts.PAGE_DETAIL.SUBSCRIBE
                }
            });
        }

        store.dispatch(
            Actions.showInfoModal({
                isOpen: true,
                title: this.getText(user.isUserSMSOptedIn ? 'unsubscribeInfoTitle' : 'subscribeInfoTitle'),
                message: user.isUserSMSOptedIn ? this.getUnsubscribeModalText() : this.generateTextsTerms(false),
                buttonText: primaryButtonText,
                callback: () => primaryCallback(),
                showCancelButtonLeft: !user.isUserSMSOptedIn,
                cancelText: secondaryButtonText,
                cancelButtonCallback: () => secondaryCallback(),
                showCancelButton: user.isUserSMSOptedIn,
                showCloseButton: true
            })
        );
    };

    render() {
        const { user, isEditMode, setEditSection } = this.props;

        const formattedPhone = user.primaryPhone ? formValidator.getFormattedPhoneNumber(user.primaryPhone) : this.getText('noPhone');

        const styles = {
            icon: {
                marginRight: space[2],
                marginLeft: space[3]
            },
            form: Sephora.isDesktop() ? { maxWidth: '50%' } : {},
            phoneNumber: {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            },
            subscribe: {
                fontWeight: 'bold'
            }
        };

        const editClickHandler = () => {
            // Analytics
            const actionInfo = user.primaryPhone ? analyticsConsts.ACTION_INFO.PHONE_EDIT : analyticsConsts.ACTION_INFO.PHONE_ADD;
            processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                data: {
                    actionInfo
                }
            });
            setEditSection('phoneNumber');
        };

        const displayBlock = (
            <>
                <LegacyGrid
                    gutter={2}
                    data-at={Sephora.debug.dataAt('account_phone_field')}
                    alignItems='baseline'
                    marginY={5}
                >
                    <LegacyGrid.Cell width={Sephora.isMobile() ? 85 : 1 / 4}>
                        <Text fontWeight='bold'>{this.getText('phone')}</Text>
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell style={{ flex: 1 }}>
                        <LegacyGrid>
                            <LegacyGrid.Cell width='fill'>
                                <div
                                    width='fill'
                                    css={styles.phoneNumber}
                                >
                                    {formattedPhone}
                                </div>
                                {user.primaryPhone && (
                                    <div
                                        width='fit'
                                        className={agentAwareUtils.applyHideAgentAwareClass()}
                                    >
                                        <Link
                                            color='blue'
                                            paddingY={2}
                                            marginY={-2}
                                            onClick={() => this.onRemovePhoneClick()}
                                            data-at={Sephora.debug.dataAt('myaccount_remove_button')}
                                        >
                                            {this.getText('remove')}
                                        </Link>
                                    </div>
                                )}
                            </LegacyGrid.Cell>
                            <LegacyGrid.Cell
                                width='4em'
                                textAlign='right'
                                className={agentAwareUtils.applyHideAgentAwareClass()}
                            >
                                <Link
                                    color='blue'
                                    paddingY={2}
                                    marginY={-2}
                                    onClick={editClickHandler}
                                    data-at={Sephora.debug.dataAt('myaccount_edit_button')}
                                >
                                    {this.getText(user.primaryPhone ? 'edit' : 'add')}
                                </Link>
                            </LegacyGrid.Cell>
                        </LegacyGrid>
                        {user.primaryPhone && (
                            <React.Fragment>
                                <Divider marginY={space[5]} />
                                <LegacyGrid marginBottom={4}>
                                    <LegacyGrid.Cell width='fill'>
                                        <div
                                            width='fill'
                                            css={styles.subscribe}
                                        >
                                            {this.getText('sephoraTexts')}
                                        </div>
                                        <div width='fit'>{user.isUserSMSOptedIn ? this.getText('subscribed') : this.getText('notSubscribed')}</div>
                                    </LegacyGrid.Cell>
                                    <LegacyGrid.Cell
                                        width='8em'
                                        textAlign='right'
                                        className={agentAwareUtils.applyHideAgentAwareClass()}
                                    >
                                        <Link
                                            color='blue'
                                            paddingY={2}
                                            marginY={-2}
                                            onClick={() => this.showSubscribeInfoModal()}
                                            data-at={Sephora.debug.dataAt('myaccount_edit_button')}
                                        >
                                            {user.isUserSMSOptedIn ? this.getText('unsubscribe') : this.getText('subscribe')}
                                        </Link>
                                    </LegacyGrid.Cell>
                                </LegacyGrid>
                                {!user.isUserSMSOptedIn && <RegisterPhoneBanner pageName='myAccounts' />}
                            </React.Fragment>
                        )}
                    </LegacyGrid.Cell>
                    <ErrorList errorMessages={this.state.errorMessages} />
                </LegacyGrid>
            </>
        );

        const editBlock = (
            <form
                action=''
                autoComplete='off'
                noValidate
                onSubmit={this.submitForm}
                css={styles.form}
            >
                <ErrorList errorMessages={this.state.errorMessages} />

                <MobilePhoneInput
                    label={this.getText('phoneNumber')}
                    name='phoneNumber'
                    id='myaccount_phone_number'
                    ref={comp => {
                        if (comp !== null) {
                            this.phoneInput = comp;
                        }
                    }}
                    validate={phoneInput => {
                        const confirmPhoneNumber = this.confirmPhoneInput.getValue();

                        if (FormValidator.isEmpty(phoneInput)) {
                            return this.getText('emptyPhoneMessage');
                        } else if (!FormValidator.isValidPhoneNumber(phoneInput)) {
                            return this.getText('invalidPhoneMessage');
                        } else if (
                            FormValidator.isEmpty(confirmPhoneNumber) ||
                            (!FormValidator.isEmpty(phoneInput) && confirmPhoneNumber !== phoneInput)
                        ) {
                            return this.getText('invalidConfirmationMessage');
                        } else if (!FormValidator.isValidPhoneNumber(confirmPhoneNumber)) {
                            return this.getText('invalidPhoneMessage');
                        }

                        return null;
                    }}
                />

                <MobilePhoneInput
                    label={this.getText('confirmPhoneLabel')}
                    name='confirmPhoneNumber'
                    id='myaccount_confirm_phone'
                    ref={comp => {
                        if (comp !== null) {
                            this.confirmPhoneInput = comp;
                        }
                    }}
                    validate={confirmPhoneNumber => {
                        const phoneInput = this.phoneInput.getValue();

                        if (FormValidator.isEmpty(confirmPhoneNumber)) {
                            return this.getText('emptyPhoneMessage');
                        } else if (
                            FormValidator.isEmpty(confirmPhoneNumber) ||
                            (!FormValidator.isEmpty(phoneInput) && confirmPhoneNumber !== phoneInput)
                        ) {
                            return this.getText('invalidConfirmationMessage');
                        } else if (!FormValidator.isValidPhoneNumber(confirmPhoneNumber)) {
                            return this.getText('invalidPhoneMessage');
                        }

                        return null;
                    }}
                />
                <Flex
                    alignItems='center'
                    marginBottom={4}
                    gap={[2, 3]}
                >
                    <Checkbox
                        paddingY={0}
                        name='isMarketingEnabled'
                        checked={this.state.isMarketingEnabled}
                        onClick={this.toggleMarketing}
                    >
                        <Text fontWeight='bold'>{this.getText('marketingCheckbox')}</Text>
                    </Checkbox>
                    <span css={styles.icon}>
                        <InfoButton
                            isOutline
                            padding={0}
                            margin={0}
                            marginLeft={1}
                            onClick={this.handleInfoButtonClick}
                        />
                    </span>
                </Flex>
                {this.generateTextsTerms(true)}

                <LegacyGrid
                    fill={true}
                    gutter={3}
                >
                    <LegacyGrid.Cell>
                        <Button
                            variant='secondary'
                            block={true}
                            onClick={() => {
                                // Analytics
                                processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                                    data: {
                                        actionInfo: analyticsConsts.ACTION_INFO.PHONE_CANCEL
                                    }
                                });
                                this.setState({ errorMessages: null });
                                setEditSection('');
                            }}
                            data-at={Sephora.debug.dataAt('myaccount_cancel_button')}
                        >
                            {this.getText('cancel')}
                        </Button>
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell>
                        <Button
                            variant='primary'
                            block={true}
                            onClick={this.checkAndFireAnalytics}
                            type='submit'
                            data-at={Sephora.debug.dataAt('myaccount_update_button')}
                        >
                            {this.getText('update')}
                        </Button>
                    </LegacyGrid.Cell>
                </LegacyGrid>
            </form>
        );

        return isEditMode ? editBlock : displayBlock;
    }
}

export default wrapComponent(AccountPhone, 'AccountPhone', true);
