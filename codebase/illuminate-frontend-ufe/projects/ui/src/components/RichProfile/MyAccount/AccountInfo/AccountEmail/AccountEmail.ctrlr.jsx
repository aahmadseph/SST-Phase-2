import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Button, Text, Link } from 'components/ui';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import FormValidator from 'utils/FormValidator';
import agentAwareUtils from 'utils/AgentAware';
import ErrorList from 'components/ErrorList';
import localeUtils from 'utils/LanguageLocale';
import formValidator from 'utils/FormValidator';
import store from 'store/Store';
import Actions from 'actions/Actions';
import userActions from 'actions/UserActions';
import processEvent from 'analytics/processEvent';
import analyticsConsts from 'analytics/constants';
import brazeUtils from 'analytics/utils/braze';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import userUtils from 'utils/User';
import Empty from 'constants/empty';

class AccountEmail extends BaseClass {
    constructor(props) {
        super(props);

        this.state = { errorMessages: null };

        this.getText = localeUtils.getLocaleResourceFile('components/RichProfile/MyAccount/AccountInfo/AccountEmail/locales', 'AccountEmail');
    }

    validateForm = () => {
        const fieldsForValidation = [this.emailInput, this.confirmEmailInput];

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
        const fieldsForValidation = [this.emailInput, this.confirmEmailInput];
        const errors = formValidator.getErrors(fieldsForValidation);

        if (errors.fields.length) {
            //Analytics
            processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
                data: {
                    bindingMethods: linkTrackingError,
                    linkName: 'error',
                    fieldErrors: errors.fields,
                    errorMessages: errors.messages,
                    eventStrings: [analyticsConsts.Event.EVENT_71],
                    usePreviousPageName: true
                }
            });
        }
    };

    editSuccess = data => {
        const { brazeIsReady } = Sephora.analytics.promises;
        brazeIsReady &&
            brazeIsReady.then(() => {
                if (global.braze && brazeUtils.setNewData('brazeEmail', data.login)) {
                    braze.getUser().setEmail(data.login);
                }
            });
        //close edit state
        this.props.setEditSection('');
    };

    editFailure = error => {
        if (userUtils.isEmailDisposableError(error)) {
            const invalidEmailError = this.getText('invalidEmailError');
            this.emailInput.showError(invalidEmailError);
            this.confirmEmailInput.showError(invalidEmailError);
        } else if (userUtils.isEmailTypoError(error)) {
            store.dispatch(
                Actions.showEmailTypoModal({
                    isOpen: true,
                    email: this.emailInput.getValue(),
                    onCancel: Empty.Function,
                    onContinue: () => this.callUpdateUserFragment(true)
                })
            );
        } else if (error.errorMessages) {
            this.setState({ errorMessages: error.errorMessages });
        }
    };

    getOptionParams = (overrideVerification = false) => {
        const emailInput = this.emailInput.getValue();
        const confirmEmailInput = this.confirmEmailInput.getValue();
        const optionParams = {
            fragmentForUpdate: userActions.FRAGMENT_FOR_UPDATE.EMAIL,
            email: emailInput,
            confirmEmail: confirmEmailInput,
            requestOrigin: 'MyAccount',
            ...(overrideVerification && { overrideVerification })
        };

        return optionParams;
    };

    callUpdateUserFragment = overrideVerification => {
        const optionParams = this.getOptionParams(overrideVerification);

        this.setState({ errorMessages: null });

        store.dispatch(userActions.updateUserFragment(optionParams, this.editSuccess, this.editFailure));

        //Analytics
        processEvent.process(analyticsConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                linkData: digitalData.page.category.pageType + ':my account:email:update',
                pageType: digitalData.page.category.pageType,
                pageDetail: digitalData.page.pageInfo.pageName
            }
        });
    };

    submitForm = e => {
        e.preventDefault();

        const validate = this.validateForm();

        if (!validate.hasError) {
            this.callUpdateUserFragment();
        } else {
            this.setState({ errorMessages: null });
        }
    };

    render() {
        const { user, isEditMode, setEditSection } = this.props;

        const displayBlock = (
            <LegacyGrid
                gutter={3}
                data-at={Sephora.debug.dataAt('account_email_field')}
                alignItems='baseline'
            >
                <LegacyGrid.Cell width={Sephora.isMobile() ? 85 : 1 / 4}>
                    <Text fontWeight='bold'>{this.getText('email')}</Text>
                </LegacyGrid.Cell>
                <LegacyGrid.Cell
                    width='fill'
                    css={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {user.login}
                </LegacyGrid.Cell>
                <LegacyGrid.Cell
                    width='fit'
                    className={agentAwareUtils.applyHideAgentAwareClass()}
                >
                    <Link
                        color='blue'
                        paddingY={2}
                        marginY={-2}
                        onClick={() => setEditSection('email')}
                        data-at={Sephora.debug.dataAt('myaccount_edit_button')}
                    >
                        {this.getText('edit')}
                    </Link>
                </LegacyGrid.Cell>
            </LegacyGrid>
        );

        const editBlock = (
            <form
                action=''
                autoComplete='off'
                noValidate
                onSubmit={this.submitForm}
                css={
                    Sephora.isDesktop() && {
                        maxWidth: '50%'
                    }
                }
            >
                <ErrorList errorMessages={this.state.errorMessages} />

                <InputEmail
                    label={this.getText('email')}
                    name='email'
                    id='myaccount_email'
                    ref={comp => {
                        if (comp !== null) {
                            this.emailInput = comp;
                        }
                    }}
                    validate={emailInput => {
                        if (FormValidator.isEmpty(emailInput)) {
                            return this.getText('emptyEmailMessage');
                        } else if (!FormValidator.isValidEmailAddress(emailInput)) {
                            return this.getText('invalidEmailMessage');
                        }

                        return null;
                    }}
                />

                <InputEmail
                    label={this.getText('confirmEmailLabel')}
                    name='confirmEmail'
                    id='myaccount_confirm_email'
                    ref={comp => {
                        if (comp !== null) {
                            this.confirmEmailInput = comp;
                        }
                    }}
                    validate={confirmEmail => {
                        const emailInput = this.emailInput.getValue();

                        if (FormValidator.isEmpty(confirmEmail)) {
                            return this.getText('emptyEmailMessage');
                        } else if (FormValidator.isEmpty(confirmEmail) || (!FormValidator.isEmpty(emailInput) && confirmEmail !== emailInput)) {
                            return this.getText('invalidConfirmationMessage');
                        } else if (!FormValidator.isValidEmailAddress(confirmEmail)) {
                            return this.getText('invalidEmailMessage');
                        }

                        return null;
                    }}
                />

                <LegacyGrid
                    fill={true}
                    gutter={3}
                >
                    <LegacyGrid.Cell>
                        <Button
                            variant='secondary'
                            block={true}
                            onClick={() => {
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

export default wrapComponent(AccountEmail, 'AccountEmail', true);
