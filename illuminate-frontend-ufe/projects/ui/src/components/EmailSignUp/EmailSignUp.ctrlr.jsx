import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import profileApi from 'services/api/profile';
import userUtils from 'utils/User';
import { space } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import InputMsg from 'components/Inputs/InputMsg/InputMsg';
import { Button } from 'components/ui';
import Tooltip from 'components/Tooltip/Tooltip';
import compConstants from 'components/constants';

const { CANADA_LEGAL_COPY } = compConstants;

class EmailSignUp extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showError: false,
            showSuccess: false,
            lastEmails: [],
            isInputInvalid: false
        };
    }

    componentDidMount() {
        this.inputEl = ReactDOM.findDOMNode(this).querySelectorAll('input')[0];
        this.setState({ firstName: userUtils.getProfileFirstName() });
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({ disabled: true });

        if (this.isValid()) {
            const email = this.input.getValue();
            const { lastEmails } = this.state;

            if (lastEmails.length > 0 && lastEmails.indexOf(email) !== -1) {
                this.showError();
            } else {
                profileApi
                    .enrollToSephoraEmails(email)
                    .then(() => this.showSuccess(email))
                    .catch(() => this.showError());
            }
        } else {
            this.setState({
                disabled: false,
                showError: false,
                showSuccess: false
            });
        }
    };

    handleFocus = () => {
        if (this.state.showSuccess) {
            this.input.input.setValue('');
            this.setState({ showSuccess: false });
        }
    };

    isValid = () => {
        return !this.input.validateError();
    };

    showSuccess = currentEmail => {
        const { lastEmails } = this.state;

        lastEmails.push(currentEmail);

        this.setState(
            {
                disabled: false,
                showError: false,
                showSuccess: true,
                lastEmails: lastEmails
            },
            () => this.inputEl.blur()
        );
    };

    showError = () => {
        this.input.input.setValue('');
        this.setState(
            {
                disabled: false,
                showError: true,
                showSuccess: false
            },
            () => this.inputEl.focus()
        );
    };

    renderInputEmail = () => {
        const getText = localeUtils.getLocaleResourceFile('components/EmailSignUp/locales', 'EmailSignUp');

        const inputEmail = (
            <InputEmail
                id='emailSignUpInput'
                placeholder={getText('emailPlaceholder')}
                knockout={true}
                marginBottom={null}
                disabled={this.state.disabled}
                onFocus={this.handleFocus}
                ref={c => {
                    if (c !== null) {
                        this.input = c;
                    }
                }}
            />
        );

        return localeUtils.isCanada() ? (
            <Tooltip content={CANADA_LEGAL_COPY}>
                <div>{inputEmail}</div>
            </Tooltip>
        ) : (
            inputEmail
        );
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/EmailSignUp/locales', 'EmailSignUp');
        const isFrench = localeUtils.isFrench();

        return (
            <div>
                <label
                    htmlFor='emailSignUpInput'
                    css={styles.label}
                    children={getText('signUpLabel')}
                />
                <form
                    css={styles.form}
                    action=''
                    noValidate
                    onSubmit={this.handleSubmit}
                >
                    <div css={styles.inputWrap}>{this.renderInputEmail()}</div>
                    <Button
                        marginLeft={4}
                        variant='inverted'
                        type='submit'
                        disabled={this.state.disabled}
                        children={getText('button')}
                        minWidth={isFrench ? 102 : 96}
                    />
                </form>
                {this.state.showSuccess && (
                    <InputMsg
                        color='inherit'
                        children={getText('signUpSuccessMessage')}
                    />
                )}
                {this.state.showError && (
                    <InputMsg
                        color='inherit'
                        children={getText('sameEmailErrorMessage')}
                    />
                )}
            </div>
        );
    }
}

const styles = {
    label: {
        display: 'block',
        marginBottom: space[3],
        fontWeight: 'var(--font-weight-bold)'
    },
    form: {
        display: 'flex',
        alignItems: 'flex-start'
    },
    inputWrap: {
        flex: 1
    }
};

export default wrapComponent(EmailSignUp, 'EmailSignUp');
