import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import {
    Box, Image, Text, Button
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Select from 'components/Inputs/Select/Select';
import Textarea from 'components/Inputs/Textarea/Textarea';
import FormValidator from 'utils/FormValidator';
import ErrorConstants from 'utils/ErrorConstants';
import { subjectOptions as hardcodedSubjectOptions, maxLength } from 'components/EmailUs/constants';
import Modal from 'components/Modal/Modal';
import ErrorsUtils from 'utils/Errors';
import utilityApi from 'services/api/utility';
import sdnApi from 'services/api/sdn';

class EmailUs extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            fromEmail: '',
            biNumber: '',
            orderId: '',
            comment: '',
            subjectCode: '',
            isCommentFieldError: false,
            showConfirmationModal: false,
            subjectOptions: []
        };

        store.setAndWatch('user', this, userData => {
            if (!userUtils.isAnonymous()) {
                const { firstName, lastName, login, beautyInsiderAccount } = userData.user;
                const biNumber = userUtils.isBI() ? beautyInsiderAccount.biAccountId : this.state.biNumber;
                this.setState({
                    fromEmail: login,
                    firstName,
                    lastName,
                    biNumber
                });
            }
        });
    }

    componentDidMount() {
        if (Sephora.configurationSettings.isAtgSunsetEnabled) {
            sdnApi.subjects().then(subjectOptions => this.setState({ subjectOptions }));
        } else {
            this.setState({ subjectOptions: hardcodedSubjectOptions });
        }
    }

    handleFirstNameOnChange = e => {
        this.setState({ firstName: e.target.value });
    };

    handleLastNameOnChange = e => {
        this.setState({ lastName: e.target.value });
    };

    handleEmailAddressOnChange = e => {
        this.setState({ fromEmail: e.target.value });
    };

    handleOnBeautyIdOnChange = e => {
        this.setState({ biNumber: e.target.value });
    };

    handleOnChange = e => {
        this.setState({ orderId: e.target.value });
    };

    handleSubjectOptionOnChange = e => {
        const selectedObj = this.state.subjectOptions.find(subjects => subjects.value === e.target.value);
        this.setState({
            subjectCode: selectedObj.code,
            subjectValue: selectedObj.value
        });
    };

    handleCommentOnChange = e => {
        this.setState({
            comment: e.target.value,
            isCommentFieldError: false
        });
    };

    validateForm = () => {
        ErrorsUtils.clearErrors();
        const fieldsForValidation = [];

        fieldsForValidation.push(this.emailInput, this.firstNameInput, this.lastNameInput, this.subjectSelectInput);

        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);

        const isCommentFieldEmpty = this.state.comment.length === 0;

        if (isCommentFieldEmpty) {
            this.setState({ isCommentFieldError: true });
        }

        return !ErrorsUtils.validate() && !isCommentFieldEmpty;
    };

    handleSubjectOptionOnChange = e => {
        const selectedObj = this.state.subjectOptions.find(subjects => subjects.value === e.target.value);
        this.setState({
            subjectCode: selectedObj.code,
            subjectValue: selectedObj.value
        });
    };

    handleCommentOnChange = e => {
        this.setState({
            comment: e.target.value,
            isCommentFieldError: false
        });
    };

    handleSubmit = e => {
        e.preventDefault();

        if (this.validateForm()) {
            const {
                firstName, lastName, fromEmail, biNumber, orderId, subjectCode, comment
            } = this.state;

            const bodyParams = {
                firstName,
                lastName,
                fromEmail,
                biNumber,
                orderId,
                subjectCode,
                comment
            };

            const requestMethod = Sephora.configurationSettings.isAtgSunsetEnabled ? sdnApi.contactUs : utilityApi.contactUs;

            requestMethod(bodyParams).then(response => {
                if (response.responseStatus === 200) {
                    const newState = Object.assign({ showConfirmationModal: true }, this.getDefaultState());
                    this.setState(newState, () => {
                        this.commentTextInput.clearTextArea();
                        this.subjectSelectInput.empty();
                    });
                }
            });
        }
    };

    getDefaultState = () => {
        this.setState({
            firstName: '',
            lastName: '',
            fromEmail: '',
            biNumber: '',
            orderNumber: '',
            comment: '',
            subjectCode: '',
            subjectValue: ''
        });

        if (!userUtils.isAnonymous()) {
            const user = store.getState().user;
            this.state.firstName = user.firstName;
            this.state.lastName = user.lastName;
            this.state.fromEmail = user.login;
            this.state.biNumber = userUtils.isBI() && user.beautyInsiderAccount ? user.beautyInsiderAccount.biAccountId : '';
        }

        return this.state;
    };

    closeModal = () => {
        this.setState({ showConfirmationModal: false });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/EmailUs/locales', 'EmailUs');
        const isDesktop = Sephora.isDesktop();
        const gutterSize = isDesktop && 5;

        return (
            <div>
                <Box
                    is='form'
                    maxWidth={572}
                    borderRadius={2}
                    border={1}
                    borderColor='lightGray'
                    paddingY={6}
                    paddingX={5}
                    marginY={5}
                    onSubmit={e => this.handleSubmit(e)}
                    noValidate
                >
                    <LegacyGrid
                        gutter={gutterSize}
                        fill={isDesktop}
                    >
                        <LegacyGrid.Cell>
                            <TextInput
                                label={getText('firstName')}
                                value={this.state.firstName}
                                onChange={this.handleFirstNameOnChange}
                                name='firstName'
                                ref={comp => (this.firstNameInput = comp)}
                                validateError={firstName => {
                                    if (FormValidator.isEmpty(firstName)) {
                                        return ErrorConstants.ERROR_CODES.FIRST_NAME;
                                    }

                                    return null;
                                }}
                                maxLength={FormValidator.FIELD_LENGTHS.name}
                                required={true}
                            />
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell>
                            <TextInput
                                label={getText('lastName')}
                                onChange={this.handleLastNameOnChange}
                                value={this.state.lastName}
                                ref={comp => (this.lastNameInput = comp)}
                                validateError={lastName => {
                                    if (FormValidator.isEmpty(lastName)) {
                                        return ErrorConstants.ERROR_CODES.LAST_NAME;
                                    }

                                    return null;
                                }}
                                name='lastName'
                                maxLength={FormValidator.FIELD_LENGTHS.name}
                                required={true}
                            />
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                    <LegacyGrid
                        gutter={gutterSize}
                        fill={isDesktop}
                    >
                        <LegacyGrid.Cell>
                            <TextInput
                                label={getText('emailAddress')}
                                type='email'
                                autoComplete='email'
                                autoCorrect='off'
                                autoCapitalize='off'
                                spellCheck={false}
                                onChange={e => this.handleEmailAddressOnChange(e)}
                                value={this.state.fromEmail}
                                name='emailAddress'
                                maxLength={FormValidator.FIELD_LENGTHS.email}
                                ref={comp => (this.emailInput = comp)}
                                validateError={userEmail => {
                                    if (FormValidator.isEmpty(userEmail)) {
                                        return ErrorConstants.ERROR_CODES.EMAIL_EMPTY;
                                    } else if (!FormValidator.isValidEmailAddress(userEmail)) {
                                        return ErrorConstants.ERROR_CODES.EMAIL_INVALID;
                                    }

                                    return null;
                                }}
                                required={true}
                            />
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell>
                            <Select
                                label={getText('subject')}
                                required={true}
                                ref={comp => (this.subjectSelectInput = comp)}
                                validateError={option => {
                                    if (FormValidator.isEmpty(option)) {
                                        return ErrorConstants.ERROR_CODES.EMAIL_SUBJECT_REQUIRED;
                                    }

                                    return null;
                                }}
                                value={this.state.subjectValue}
                                onChange={this.handleSubjectOptionOnChange}
                                name='subject'
                            >
                                {this.state.subjectOptions.map((option, i) => {
                                    return (
                                        <option
                                            value={option.value}
                                            key={option.value || i}
                                        >
                                            {option.label}
                                        </option>
                                    );
                                })}
                            </Select>
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                    <LegacyGrid
                        gutter={gutterSize}
                        fill={isDesktop}
                    >
                        <LegacyGrid.Cell>
                            <TextInput
                                label={getText('biIdOptional')}
                                value={this.state.biNumber}
                                onChange={e => this.handleOnBeautyIdOnChange(e)}
                                maxLength={FormValidator.FIELD_LENGTHS.biNumber}
                                onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                                onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                name='beautyInsiderId'
                            />
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell>
                            <TextInput
                                label={getText('orderNumberOptional')}
                                value={this.state.orderNumber}
                                onChange={e => this.handleOnChange(e)}
                                maxLength={FormValidator.FIELD_LENGTHS.orderId}
                                onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                                onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                name='orderNumber'
                            />
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                    <Textarea
                        label={getText('enterComment')}
                        rows={5}
                        required={true}
                        ref={comp => (this.commentTextInput = comp)}
                        invalid={this.state.isCommentFieldError}
                        message={this.state.isCommentFieldError ? getText('commentRequired') : null}
                        name='comment'
                        onChange={e => this.handleCommentOnChange(e)}
                        value={this.state.comment}
                        maxLength={maxLength.commentText}
                    />
                    <Text
                        is='p'
                        marginY={5}
                    >
                        {getText('personalInfoConfidential')}
                    </Text>
                    <Button
                        type='submit'
                        variant='primary'
                        children={getText('sendEmail')}
                    />
                </Box>
                <Modal
                    width={0}
                    isOpen={this.state.showConfirmationModal}
                    onDismiss={this.closeModal}
                >
                    <Modal.Header>
                        <Modal.Title>{getText('thankYou')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Text
                            is='p'
                            children={getText('inTouchSoon')}
                        />
                        <Image
                            src='/img/ufe/mail-sent.svg'
                            display='block'
                            marginX='auto'
                            marginY={5}
                            size={128}
                        />
                        <Button
                            block={true}
                            variant='primary'
                            onClick={this.closeModal}
                            children={getText('ok')}
                        />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default wrapComponent(EmailUs, 'EmailUs', true);
