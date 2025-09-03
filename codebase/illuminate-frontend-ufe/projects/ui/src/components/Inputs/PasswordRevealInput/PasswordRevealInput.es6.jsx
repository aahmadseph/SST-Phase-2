import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent, wrapFunctionalComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import TextInput from 'components/Inputs/TextInput/TextInput';
import { Icon } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

const getText = text => localeUtils.getLocaleResourceFile('components/Inputs/PasswordRevealInput/locales', 'PasswordRevealInput')(text);

class PasswordRevealInput extends BaseClass {
    state = {
        isFocused: false,
        showPassword: false,
        value: ''
    };

    onBlurTimeOut;

    handleOnFocus = event => {
        this.setState({ isFocused: true }, () => {
            this.props.onFocus(event);
        });
    };

    handleOnBlur = event => {
        const fn = () =>
            this.setState({ isFocused: false }, () => {
                this.props.onBlur(event);
            });

        // Delays execution so onBlur is not triggered when
        // user tries to click password reveal icon
        this.onBlurTimeOut = setTimeout(fn, 150);
    };

    handleOnChange = event => {
        event.persist();
        const value = event.target.value;
        this.setState({ value }, () => {
            this.props.onChange(event);
        });
    };

    handleShowPassword = () => {
        // cancel pending onBlur event triggered when
        // user clicks password reveal icon
        clearInterval(this.onBlurTimeOut);

        const { id } = this.props;
        const passwordInput = document.getElementById(id);

        this.setState(
            prevState => ({
                showPassword: !prevState.showPassword
            }),
            passwordInput.focus()
        );
    };

    render() {
        const { showPasswordReveal, forwardedRef, ...restProps } = this.props;
        const { showPassword, isFocused, value } = this.state;
        const shouldShowIcon = showPasswordReveal && (value || isFocused);

        return (
            <TextInput
                {...restProps}
                ref={forwardedRef}
                onFocus={this.handleOnFocus}
                onBlur={this.handleOnBlur}
                onChange={this.handleOnChange}
                type={showPassword ? 'text' : 'password'}
                {...(shouldShowIcon && {
                    infoLink: {
                        onClick: this.handleShowPassword,
                        lineHeight: 0,
                        fontSize: 24,
                        children: (
                            <Icon
                                name={showPassword ? 'eye' : 'eyeCrossed'}
                                color={isFocused ? 'black' : 'gray'}
                            />
                        ),
                        ['aria-label']: showPassword ? getText('hidePasswordLinkAriaLabel') : getText('showPasswordLinkAriaLabel')
                    }
                })}
            />
        );
    }
}

PasswordRevealInput.defaultProps = {
    showPasswordReveal: true,
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {}
};

PasswordRevealInput.propTypes = {
    id: PropTypes.string.isRequired
};

const WrappedPasswordRevealInput = wrapComponent(PasswordRevealInput, 'PasswordRevealInput');

const PasswordRevealInputWithForwardRef = React.forwardRef((props, ref) => {
    return (
        <WrappedPasswordRevealInput
            {...props}
            forwardedRef={ref}
        />
    );
});

export default wrapFunctionalComponent(PasswordRevealInputWithForwardRef, 'PasswordRevealInputWithForwardRef');
