/* eslint-disable max-len */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Button, Text, Link } from 'components/ui';
import PasswordRevealInput from 'components/Inputs/PasswordRevealInput';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import FormValidator from 'utils/FormValidator';
import ErrorList from 'components/ErrorList';
import localeUtils from 'utils/LanguageLocale';
import formValidator from 'utils/FormValidator';
import store from 'Store';
import userActions from 'actions/UserActions';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import errorsUtils from 'utils/Errors';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';

const FIELD_LENGTHS = FormValidator.FIELD_LENGTHS;
const { FRAGMENT_FOR_UPDATE } = userActions;
const { getLocaleResourceFile } = localeUtils;

class AccountPassword extends BaseClass {
    state = {
        errorMessages: null,
        isEditMode: false
    };

    validateForm = () => {
        const fieldsForValidation = [this.passwordInput, this.confirmPasswordInput];

        const errors = formValidator.getErrors(fieldsForValidation);

        const result = { hasError: false };

        if (errors.fields.length) {
            result.hasError = true;
            result.errors = errors;

            if (errors.errorIndex) {
                result.errorField = fieldsForValidation[errors.errorIndex - 1];
            }
        }

        return result;
    };

    editSuccess = () => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data: { actionInfo: 'user profile:my account:password:update' } });

        //close edit state
        this.props.setEditSection('');
    };

    editFailure = response => {
        if (response.errorMessages) {
            this.setState({ errorMessages: response.errorMessages });
        }
    };

    getOptionParams = () => {
        const passwordInput = this.passwordInput.getValue();
        const confirmPasswordInput = this.confirmPasswordInput.getValue();
        const optionParams = {
            fragmentForUpdate: FRAGMENT_FOR_UPDATE.PASSWORD,
            password: passwordInput,
            confirmPassword: confirmPasswordInput
        };

        return optionParams;
    };

    submitForm = e => {
        e.preventDefault();

        const validate = this.validateForm();

        if (!validate.hasError) {
            const optionParams = this.getOptionParams();

            this.setState({ errorMessages: null });

            store.dispatch(userActions.updateUserFragment(optionParams, this.editSuccess, this.editFailure));
        } else {
            this.triggerErrorTracking(validate.errors);
            this.setState({ errorMessages: null });
        }
    };

    handleResponseError = errorData => {
        errorsUtils.collectAndValidateBackEndErrors(errorData, this);
    };

    triggerErrorTracking = errorData => {
        const eventData = {
            data: {
                linkName: 'error',
                bindingMethods: linkTrackingError,
                eventStrings: [anaConsts.Event.EVENT_71],
                fieldErrors: errorData.fields.map(field => field),
                errorMessages: errorData.messages.map(message => message),
                previousPage: digitalData.page.attributes.sephoraPageInfo.pageName,
                usePreviousPageName: true
            }
        };
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, eventData);
    };

    render() {
        const getText = getLocaleResourceFile('components/RichProfile/MyAccount/AccountInfo/AccountPassword/locales', 'AccountPassword');
        const { isEditMode, setEditSection } = this.props;

        const displayBlock = (
            <LegacyGrid
                gutter={3}
                data-at={Sephora.debug.dataAt('account_password_field')}
                alignItems='baseline'
            >
                <LegacyGrid.Cell width={Sephora.isMobile() ? 85 : 1 / 4}>
                    <Text fontWeight='bold'>{getText('password')}</Text>
                </LegacyGrid.Cell>
                <LegacyGrid.Cell width='fill'>
                    <Text>&bull;&bull;&bull;&bull;&bull;&bull;&bull;</Text>
                </LegacyGrid.Cell>
                {!Sephora.isAgent && (
                    <LegacyGrid.Cell width='fit'>
                        <Link
                            color='blue'
                            paddingY={2}
                            marginY={-2}
                            onClick={() => setEditSection('password')}
                            data-at={Sephora.debug.dataAt('myaccount_edit_button')}
                        >
                            {getText('edit')}
                        </Link>
                    </LegacyGrid.Cell>
                )}
            </LegacyGrid>
        );

        const editBlock = (
            <form
                action=''
                autoComplete='off'
                noValidate
                onSubmit={this.submitForm}
                css={Sephora.isDesktop() && { maxWidth: '50%' }}
            >
                <ErrorList errorMessages={this.state.errorMessages} />

                <PasswordRevealInput
                    id='password1'
                    autoOff={true}
                    label={getText('passwordLabel', [FIELD_LENGTHS.passwordMin, FIELD_LENGTHS.passwordMax])}
                    type='password'
                    name='password'
                    minLength={FIELD_LENGTHS.passwordMin}
                    maxLength={FIELD_LENGTHS.passwordMax}
                    ref={comp => {
                        if (comp !== null) {
                            this.passwordInput = comp;
                        }
                    }}
                    validate={password => {
                        if (FormValidator.isEmpty(password)) {
                            return getText('errorMessagePassword');
                        } else {
                            if (!FormValidator.isValidLength(password, 6, 12) || FormValidator.hasEmptySpaces(password)) {
                                return getText('errorShortPassword', [FIELD_LENGTHS.passwordMin, FIELD_LENGTHS.passwordMax]);
                            }
                        }

                        return null;
                    }}
                />

                <PasswordRevealInput
                    id='password2'
                    autoOff={true}
                    label={getText('confirmPasswordLabel')}
                    type='password'
                    name='confirmPassword'
                    minLength={FIELD_LENGTHS.passwordMin}
                    maxLength={FIELD_LENGTHS.passwordMax}
                    ref={comp => {
                        if (comp !== null) {
                            this.confirmPasswordInput = comp;
                        }
                    }}
                    validate={confirmPassword => {
                        const passwordInput = this.passwordInput.getValue();

                        if (FormValidator.isEmpty(confirmPassword)) {
                            return getText('errorMessagePassword');
                        } else if (!FormValidator.isEmpty(passwordInput) && confirmPassword !== passwordInput) {
                            return getText('errorConfirmPassord');
                        } else if (
                            !FormValidator.isValidLength(confirmPassword, FIELD_LENGTHS.passwordMin, FIELD_LENGTHS.passwordMax) ||
                            FormValidator.hasEmptySpaces(confirmPassword)
                        ) {
                            return getText('errorShortPassword', [FIELD_LENGTHS.passwordMin, FIELD_LENGTHS.passwordMax]);
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
                            onClick={() => setEditSection('')}
                            data-at={Sephora.debug.dataAt('myaccount_cancel_button')}
                        >
                            {getText('cancel')}
                        </Button>
                    </LegacyGrid.Cell>
                    <LegacyGrid.Cell>
                        <Button
                            variant='primary'
                            block={true}
                            type='submit'
                            data-at={Sephora.debug.dataAt('myaccount_update_button')}
                        >
                            {getText('update')}
                        </Button>
                    </LegacyGrid.Cell>
                </LegacyGrid>
            </form>
        );

        return isEditMode && !Sephora.isAgent ? editBlock : displayBlock;
    }
}

export default wrapComponent(AccountPassword, 'AccountPassword');
