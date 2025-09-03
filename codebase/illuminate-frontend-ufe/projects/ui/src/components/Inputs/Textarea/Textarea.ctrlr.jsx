/* eslint-disable class-methods-use-this,complexity */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    colors, forms, fontSizes, lineHeights, space
} from 'style/config';
import InputMsg from 'components/Inputs/InputMsg/InputMsg';
import { Icon } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import ReactDOM from 'react-dom';

const LABEL_OFFSET = 10;
const ERROR_ICON_SIZE = 16;

class Textarea extends BaseClass {
    state = {
        characterCount: this.props.value ? this.props.value.length : 0,
        value: this.props.value ? this.props.value : ''
    };

    handleOnChange = (onChangeFunc, maxLength) => e => {
        maxLength && this.handleChange(e);
        onChangeFunc && onChangeFunc(e);
    };

    handleFocusChange = (handleFocusChangeFunc, isFocused) => () => {
        handleFocusChangeFunc && typeof handleFocusChangeFunc === 'function' && handleFocusChangeFunc(isFocused);
        this.setState({ isFocused });
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Inputs/Textarea/locales', 'Textarea');

        const {
            id,
            name,
            label,
            message,
            placeholder,
            minLength,
            maxLength,
            invalid,
            customStyle = {},
            onChange,
            required,
            validate,
            handleChange,
            warning,
            labelDataAt,
            charCountDataAt,
            errorDataAt,
            marginBottom,
            isSMPadding,
            hideCharacterCount,
            onFocus,
            onBlur,
            ...props
        } = this.props;

        const { error } = this.state;

        const hasFloatingLabel = placeholder || this.state.value || (this.state.value && this.state.isFocused);
        const hasError = invalid || error;

        const styles = {
            inputWrap: {
                position: 'relative'
            },
            label: [
                {
                    position: 'absolute',
                    zIndex: 1,
                    backgroundColor: hasFloatingLabel ? forms.BG : null,
                    color: invalid && !this.state.isFocused ? colors.red : colors.gray,
                    top: forms.PADDING_Y + forms.BORDER_WIDTH,
                    left: forms.PADDING_X,
                    right: forms.PADDING_X,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    transitionDuration: '.2s',
                    lineHeight: forms.LINE_HEIGHT
                },
                required && {
                    '&:after': {
                        content: '"*"'
                    }
                }
            ],
            labelFloating: {
                fontSize: fontSizes.sm,
                paddingTop: space[1],
                paddingBottom: 1,
                marginLeft: 1,
                marginRight: '1em', // this margin helps prevent label from clipping into alert icon
                top: forms.BORDER_WIDTH
            },
            textarea: [
                {
                    fontFamily: 'inherit',
                    fontSize: forms.FONT_SIZE,
                    display: 'block',
                    width: '100%',
                    paddingTop: isSMPadding ? forms.PADDING_SM : forms.PADDING_Y,
                    paddingBottom: isSMPadding ? forms.PADDING_SM : forms.PADDING_Y,
                    paddingLeft: isSMPadding ? forms.PADDING_SM : forms.PADDING_X,
                    paddingRight: isSMPadding ? forms.PADDING_SM : forms.PADDING_X,
                    color: invalid && !this.state.isFocused ? colors.error : forms.COLOR,
                    backgroundColor: forms.BG,
                    borderWidth: forms.BORDER_WIDTH,
                    borderColor: invalid ? colors.error : forms.BORDER_COLOR,
                    borderRadius: forms.BORDER_RADIUS,
                    overflow: 'auto',
                    WebkitAppearance: 'none',
                    lineHeight: lineHeights.tight,
                    minHeight: forms.HEIGHT,
                    resize: 'none',
                    ':disabled': {
                        cursor: 'not-allowed',
                        backgroundColor: forms.DISABLED_BG,
                        opacity: forms.DISABLED_OPACITY
                    },
                    '&::placeholder': {
                        color: forms.PLACEHOLDER_COLOR,
                        opacity: 1
                    },
                    ':focus': {
                        borderColor: forms.BORDER_FOCUS_COLOR,
                        outline: 0,
                        '&::placeholder': {
                            color: forms.PLACEHOLDER_FOCUS_COLOR
                        }
                    }
                },
                label &&
                    hasFloatingLabel && {
                    paddingTop: forms.PADDING_Y + LABEL_OFFSET,
                    paddingBottom: forms.PADDING_Y - LABEL_OFFSET
                }
            ],
            messaging: {
                display: 'grid',
                gap: space[3],
                gridTemplateColumns: '1fr auto'
            }
        };

        return (
            <div css={[{ marginBottom: space[marginBottom] || marginBottom }, customStyle.root]}>
                <div css={styles.inputWrap}>
                    {label && (
                        <label
                            data-at={labelDataAt ? Sephora.debug.dataAt(labelDataAt) : null}
                            css={[styles.label, hasFloatingLabel ? styles.labelFloating : null]}
                            htmlFor={id || name}
                            children={label}
                        />
                    )}
                    <textarea
                        {...props}
                        required={required}
                        placeholder={placeholder}
                        id={id || name}
                        name={name}
                        ref={inputElement => (this.inputElement = inputElement)}
                        css={[styles.textarea, customStyle.input]}
                        maxLength={maxLength}
                        value={this.state.value}
                        onFocus={this.handleFocusChange(onFocus, true)}
                        onBlur={this.handleFocusChange(onBlur, false)}
                        onChange={this.handleOnChange(onChange, maxLength)}
                    />
                    <Icon
                        name='alert'
                        color='error'
                        size={ERROR_ICON_SIZE}
                        css={{
                            position: 'absolute',
                            top: (forms.HEIGHT - ERROR_ICON_SIZE) / 2,
                            right: space[2],
                            pointerEvents: 'none'
                        }}
                        style={
                            !hasError || this.state.isFocused
                                ? {
                                    display: 'none'
                                }
                                : null
                        }
                    />
                </div>
                <div css={styles.messaging}>
                    <div>
                        {(error || warning || message) && (
                            <InputMsg
                                role={invalid || error ? 'alert' : null}
                                color={(error || warning || invalid) && 'error'}
                                data-at={errorDataAt ? Sephora.debug.dataAt(errorDataAt) : null}
                                children={error || warning || message}
                            />
                        )}
                    </div>
                    {(minLength || maxLength) && !hideCharacterCount && (
                        <InputMsg
                            data-at={charCountDataAt ? Sephora.debug.dataAt(charCountDataAt) : null}
                            color='gray'
                        >
                            {minLength && this.state.characterCount < minLength
                                ? `${getText('minimum')} ${minLength} ${getText('characters')}`
                                : `${this.state.characterCount} / ${maxLength} ${getText('characters')}`}
                        </InputMsg>
                    )}
                </div>
            </div>
        );
    }

    handleChange = event => {
        let input = event.target.value;
        const maxLength = this.props.maxLength;

        // maxLength prop doesn't work on Android browsers
        if (maxLength) {
            input = input.substr(0, maxLength);
        }

        let characterCount = input.length;

        if (typeof this.props.sanitizeCharacterCount === 'function') {
            characterCount = this.props.sanitizeCharacterCount(input);
        }

        this.setState(
            {
                error: null,
                value: input,
                characterCount
            },
            () => {
                this.props.handleChange && this.props.handleChange(input);
            }
        );
    };

    getValue = () => {
        return this.state.value;
    };

    getCharacterCount = () => {
        return this.state.characterCount;
    };

    validateError = () => {
        const error = this.props.validate ? this.props.validate(this.state.value) : null;

        this.setState({ error: error });

        return error;
    };

    focus = () => {
        const element = ReactDOM.findDOMNode(this.inputElement);
        element.focus();
    };

    clearTextArea = () => {
        this.setState({
            value: '',
            characterCount: 0
        });
    };
}

Textarea.defaultProps = {
    marginBottom: forms.MARGIN_BOTTOM,
    hideCharacterCount: false
};

Textarea.propTypes = {
    /** Label for form element */
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** Adds a helper or error message below the input */
    message: PropTypes.string,
    /** Additional styles */
    customStyle: PropTypes.object,
    /** If there's a max or min count, override showing the character count */
    hideCharacterCount: PropTypes.bool
};

export default wrapComponent(Textarea, 'Textarea', true);
