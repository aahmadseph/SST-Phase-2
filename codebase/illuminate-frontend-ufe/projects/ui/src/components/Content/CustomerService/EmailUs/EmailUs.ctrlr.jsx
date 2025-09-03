/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Box, Image, Text, Button
} from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Select from 'components/Inputs/Select/Select';
import Textarea from 'components/Inputs/Textarea/Textarea';
import FormValidator from 'utils/FormValidator';
import ErrorConstants from 'utils/ErrorConstants';
import { subjectOptions as hardcodedSubjectOptions, maxLength } from 'components/Content/CustomerService/EmailUs/constants';
import Modal from 'components/Modal/Modal';
import localeUtils from 'utils/LanguageLocale';
import ErrorsUtils from 'utils/Errors';
import utilityApi from 'services/api/utility';
import sdnApi from 'services/api/sdn';
import userUtils from 'utils/User';
import store from 'store/Store';
import { Grid } from 'components/ui';
import PropTypes from 'prop-types';
import content from 'constants/content';

const { COMPONENT_SPACING } = content;

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

    handleInputChange = (e, field) => {
        this.setState({ [field]: e.target.value });
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
        const defaultState = {
            firstName: '',
            lastName: '',
            fromEmail: '',
            biNumber: '',
            orderNumber: '',
            comment: '',
            subjectCode: '',
            subjectValue: ''
        };

        if (!userUtils.isAnonymous()) {
            const user = store.getState().user;
            defaultState.firstName = user.firstName;
            defaultState.lastName = user.lastName;
            defaultState.fromEmail = user.login;
            defaultState.biNumber = userUtils.isBI() && user.beautyInsiderAccount ? user.beautyInsiderAccount.biAccountId : '';
        }

        return defaultState;
    };

    closeModal = () => {
        this.setState({ showConfirmationModal: false });
    };

    componentDidMount() {
        if (Sephora.configurationSettings.isAtgSunsetEnabled) {
            sdnApi.subjects().then(subjectOptions => this.setState({ subjectOptions }));
        } else {
            this.setState({ subjectOptions: hardcodedSubjectOptions });
        }
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Content/CustomerService/EmailUs/locales', 'EmailUs');
        const { sid, marginBottom } = this.props;

        return (
            <Box
                id={sid}
                backgroundColor='#F6F6F8'
                gridColumn={['span 6 !important', 'span 3 !important']}
                borderRadius={2}
                padding={[4, 5]}
                marginBottom={marginBottom}
            >
                <Text
                    is='h2'
                    fontWeight={'bold'}
                    children={getText('emailUs')}
                    fontSize='xl-bg'
                    marginBottom={3}
                />
                <Box
                    is='form'
                    onSubmit={e => this.handleSubmit(e)}
                    noValidate
                >
                    <Grid
                        gap={2}
                        columns={['1fr', '1fr 1fr']}
                    >
                        <TextInput
                            label={getText('firstName')}
                            value={this.state.firstName}
                            onChange={e => this.handleInputChange(e, 'firstName')}
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
                        <TextInput
                            label={getText('lastName')}
                            onChange={e => this.handleInputChange(e, 'lastName')}
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
                    </Grid>
                    <Grid
                        gap={2}
                        columns={['1fr', '1fr 1fr']}
                    >
                        <TextInput
                            label={getText('emailAddress')}
                            type='email'
                            autoComplete='email'
                            autoCorrect='off'
                            autoCapitalize='off'
                            spellCheck={false}
                            onChange={e => this.handleInputChange(e, 'fromEmail')}
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
                    </Grid>
                    <Grid
                        gap={2}
                        columns={['1fr', '1fr 1fr']}
                    >
                        <TextInput
                            label={getText('biIdOptional')}
                            value={this.state.biNumber}
                            onChange={e => this.handleInputChange(e, 'biNumber')}
                            maxLength={FormValidator.FIELD_LENGTHS.biNumber}
                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            name='beautyInsiderId'
                        />
                        <TextInput
                            label={getText('orderNumberOptional')}
                            value={this.state.orderNumber}
                            onChange={e => this.handleInputChange(e, 'orderId')}
                            maxLength={FormValidator.FIELD_LENGTHS.orderId}
                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            name='orderNumber'
                        />
                    </Grid>
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
            </Box>
        );
    }
}

EmailUs.propTypes = {
    sid: PropTypes.string.isRequired,
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number])
};

EmailUs.defaultProps = {
    marginBottom: COMPONENT_SPACING.SM
};

export default wrapComponent(EmailUs, 'EmailUs', true);
