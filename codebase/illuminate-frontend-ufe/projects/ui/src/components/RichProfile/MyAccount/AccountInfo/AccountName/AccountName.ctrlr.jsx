import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import { Button, Text, Link } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import formValidator from 'utils/FormValidator';
import agentAwareUtils from 'utils/AgentAware';
import ErrorList from 'components/ErrorList';
import store from 'Store';
import userActions from 'actions/UserActions';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import errorsUtils from 'utils/Errors';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';

const FIELD_LENGTHS = formValidator.FIELD_LENGTHS;
const { FRAGMENT_FOR_UPDATE } = userActions;
const { getLocaleResourceFile } = localeUtils;

class AccountName extends BaseClass {
    state = {
        errorMessages: null,
        isEditMode: false
    };

    validateForm = () => {
        const fieldsForValidation = [this.firstNameInput, this.lastNameInput];

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
        const prop55 = 'user profile:my account:name:update';
        const data = {
            actionInfo: prop55,
            eventStrings: [anaConsts.Event.EVENT_71],
            linkName: prop55
        };

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data });

        //close edit state
        this.props.setEditSection('');
    };

    editFailure = response => {
        if (response.errorMessages) {
            this.setState({ errorMessages: response.errorMessages }, this.handleResponseError(response));
        }
    };

    getOptionParams = () => {
        const firstNameInput = this.firstNameInput.getValue();
        const lastNameInput = this.lastNameInput.getValue();
        const optionParams = {
            fragmentForUpdate: FRAGMENT_FOR_UPDATE.NAME,
            firstName: firstNameInput,
            lastName: lastNameInput
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
        const getText = getLocaleResourceFile('components/RichProfile/MyAccount/AccountInfo/AccountName/locales', 'AccountName');
        const { user, isEditMode, setEditSection } = this.props;

        const displayBlock = (
            <LegacyGrid
                gutter={3}
                data-at={Sephora.debug.dataAt('account_name_field')}
                alignItems='baseline'
            >
                <LegacyGrid.Cell width={Sephora.isMobile() ? 85 : 1 / 4}>
                    <Text fontWeight='bold'>{getText('name')}</Text>
                </LegacyGrid.Cell>
                <LegacyGrid.Cell width='fill'>
                    {user.firstName} {user.lastName}
                </LegacyGrid.Cell>
                <LegacyGrid.Cell
                    width='fit'
                    className={agentAwareUtils.applyHideAgentAwareClass()}
                >
                    <Link
                        color='blue'
                        paddingY={2}
                        marginY={-2}
                        onClick={() => setEditSection('name')}
                        data-at={Sephora.debug.dataAt('myaccount_edit_button')}
                    >
                        {getText('edit')}
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
                <TextInput
                    label={getText('firstNameLabel')}
                    autoComplete='given-name'
                    autoCorrect='off'
                    name='firstName'
                    maxLength={FIELD_LENGTHS.name}
                    value={this.state.firstName}
                    ref={comp => {
                        if (comp !== null) {
                            this.firstNameInput = comp;
                        }
                    }}
                    validate={firstName => {
                        if (formValidator.isEmpty(firstName)) {
                            return getText('nameError');
                        }

                        return null;
                    }}
                />
                <TextInput
                    label={getText('lastNameLabel')}
                    autoComplete='family-name'
                    autoCorrect='off'
                    name='lastName'
                    maxLength={FIELD_LENGTHS.name}
                    value={this.state.lastName}
                    ref={comp => {
                        if (comp !== null) {
                            this.lastNameInput = comp;
                        }
                    }}
                    validate={lastName => {
                        if (formValidator.isEmpty(lastName)) {
                            return getText('nameError');
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

        return isEditMode ? editBlock : displayBlock;
    }
}

export default wrapComponent(AccountName, 'AccountName');
