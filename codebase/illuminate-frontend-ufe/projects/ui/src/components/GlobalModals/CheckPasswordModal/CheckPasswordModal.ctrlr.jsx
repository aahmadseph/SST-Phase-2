/* eslint-disable class-methods-use-this */
import BaseClass from 'components/BaseClass';
import ErrorList from 'components/ErrorList';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Modal from 'components/Modal/Modal';
import {
    Button, Grid, Icon, Text
} from 'components/ui';
import PropTypes from 'prop-types';
import React from 'react';
import FormValidator from 'utils/FormValidator';
import { wrapComponent } from 'utils/framework';

class CheckPasswordModal extends BaseClass {
    state = {
        password: '',
        showPassword: false,
        passwordFocused: false
    };

    onChange = e => {
        this.setState({ password: e.target.value });
    };

    validatePassword = password => {
        const { localization } = this.props;
        const { passwordMin, passwordMax } = FormValidator.FIELD_LENGTHS;

        if (
            FormValidator.isEmpty(password) ||
            !FormValidator.isValidLength(password, passwordMin, passwordMax) ||
            FormValidator.hasEmptySpaces(password)
        ) {
            return localization.errorMessage;
        }

        return null;
    };

    submitPassword = () => {
        const error = this.passwordInput.validateError();

        if (!error) {
            this.props.onSubmit(this.passwordInput.getValue());
        }
    };

    handlePasswordFocus = () => {
        this.setState({ passwordFocused: true });
    };

    handlePasswordBlur = () => {
        this.setState({ passwordFocused: false });
    };

    render() {
        const {
            localization, isOpen, errorMessages, onCancel, onClose
        } = this.props;
        const { password, showPassword, passwordFocused } = this.state;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={onClose}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{localization.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text
                        is='p'
                        fontWeight='bold'
                        marginBottom={4}
                    >
                        {localization.bodyText}
                    </Text>
                    <ErrorList errorMessages={errorMessages} />
                    <TextInput
                        marginBottom={null}
                        autoComplete='current-password'
                        autoCorrect='off'
                        autoCapitalize='off'
                        spellCheck={false}
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        placeholder={localization.placeholder}
                        id='reenter_password'
                        onChange={this.onChange}
                        infoLink={{
                            ['aria-label']: showPassword ? localization.hidePasswordLinkAriaLabel : localization.showPasswordLinkAriaLabel,
                            color: 'gray',
                            onClick: () => {
                                this.setState({ showPassword: !showPassword });
                                const passwordField = document.getElementById('reenter_password');

                                if (passwordField) {
                                    passwordField.focus();
                                }
                            },
                            fontSize: 24,
                            lineHeight: 0,
                            children: (
                                <Icon
                                    name={showPassword ? 'eye' : 'eyeCrossed'}
                                    color={passwordFocused ? 'black' : 'gray'}
                                />
                            )
                        }}
                        value={password}
                        ref={c => {
                            if (c !== null) {
                                this.passwordInput = c;
                            }
                        }}
                        onFocus={this.handlePasswordFocus}
                        onBlur={this.handlePasswordBlur}
                        validate={this.validatePassword}
                    />
                </Modal.Body>
                <Modal.Footer hasBorder={true}>
                    <Grid columns={2}>
                        <Button
                            block={true}
                            onClick={onCancel}
                            variant='secondary'
                            children={localization.cancelButton}
                        />
                        <Button
                            block={true}
                            variant='primary'
                            onClick={this.submitPassword}
                            children={localization.submitButton}
                            disabled={Sephora.isAgent || !password}
                        />
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}
CheckPasswordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    localization: PropTypes.object.isRequired,
    errorMessages: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};

CheckPasswordModal.defaultProps = {
    errorMessages: [],
    isOpen: false,
    onCancel: () => {},
    onClose: () => {},
    onSubmit: () => {}
};

export default wrapComponent(CheckPasswordModal, 'CheckPasswordModal', true);
