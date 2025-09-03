/* eslint-disable class-methods-use-this,complexity */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    colors, forms, fontSizes, space, radii
} from 'style/config';
import InputMsg from 'components/Inputs/InputMsg/InputMsg';
import InfoButton from 'components/InfoButton/InfoButton';
import { Icon, Link } from 'components/ui';
import Tooltip from 'components/Tooltip/Tooltip';
import ErrorConstants from 'utils/ErrorConstants';

class TextInput extends BaseClass {
    state = {
        value: this.props.value ? this.props.value : '',
        error: null,
        message: this.props.message
    };

    inputElementRef = React.createRef();
    textInputRef = React.createRef();

    render() {
        const {
            indent,
            id,
            hideAsterisk,
            name,
            label,
            autoOff,
            knockout,
            validate,
            message,
            placeholder,
            invalid,
            infoAction,
            infoLabel,
            infoText,
            customStyle = {},
            isSmall,
            required,
            validateError,
            infoLink,
            dataAtError,
            contentBefore,
            contentAfter,
            type,
            isInputChecked,
            isControlled,
            disabled,
            marginBottom,
            infoDismissButton,
            initialValue,
            ...props
        } = this.props;

        const hasError = invalid || this.state.error;
        const { isFocused } = this.state;
        const hasFloatingLabel = placeholder || this.state.value || (this.state.value && isFocused);

        const labelFloatingStyle = {
            fontSize: fontSizes.sm,
            top: 5,
            marginLeft: 1
        };

        const inputLabelPadding = forms.FONT_SIZE;

        const styles = {
            innerWrap: [
                {
                    display: 'flex',
                    height: this.props.height || forms.HEIGHT,
                    backgroundColor: forms.BG,
                    borderWidth: forms.BORDER_WIDTH,
                    borderColor: hasError ? colors.error : knockout ? colors.white : forms.BORDER_COLOR,
                    borderRadius: forms.BORDER_RADIUS
                },
                disabled && {
                    backgroundColor: forms.DISABLED_BG
                },
                isSmall && {
                    height: forms.HEIGHT_SM
                },
                isFocused && {
                    borderColor: knockout ? null : forms.BORDER_FOCUS_COLOR
                },
                type === 'search' && [
                    { borderRadius: radii.full },
                    isFocused ? { borderWidth: forms.BORDER_WIDTH_BOLD } : { backgroundColor: colors.nearWhite }
                ]
            ],
            inputWrap: {
                position: 'relative',
                display: 'flex',
                flex: 1,
                margin: -forms.BORDER_WIDTH
            },
            label: [
                {
                    position: 'absolute',
                    color: hasError && !isFocused ? colors.error : colors.gray,
                    top: forms.PADDING_Y + forms.BORDER_WIDTH,
                    left: space[indent] || indent || forms.PADDING_X,
                    right: forms.PADDING_SM,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    transitionDuration: '.2s',
                    lineHeight: forms.LINE_HEIGHT
                },
                required &&
                    !hideAsterisk && {
                    '&:after': {
                        content: '"*"'
                    }
                }
            ],
            input: [
                {
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    fontFamily: 'inherit',
                    fontSize: forms.FONT_SIZE,
                    margin: forms.BORDER_WIDTH,
                    paddingLeft: forms.PADDING_X,
                    paddingRight: forms.PADDING_SM,
                    color: hasError && !isFocused ? colors.error : forms.COLOR,
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                    boxShadow: 'none', // rm FF required red glow
                    WebkitAppearance: 'none',
                    '&::placeholder': {
                        color: forms.PLACEHOLDER_COLOR,
                        opacity: 1
                    },
                    ':focus': {
                        outline: 0,
                        '&::placeholder': {
                            color: forms.PLACEHOLDER_FOCUS_COLOR
                        }
                    },
                    /* IE: hide iconography */
                    '&::-ms-clear, &::-ms-reveal': { display: 'none' },
                    /* Safari: hide iconography */
                    '&::-webkit-contacts-auto-fill-button, &::-webkit-credentials-auto-fill-button': {
                        visibility: 'hidden'
                    }
                },
                disabled && {
                    cursor: 'not-allowed',
                    opacity: forms.DISABLED_OPACITY
                },
                isSmall && {
                    paddingLeft: forms.PADDING_SM
                },
                indent && {
                    paddingLeft: space[indent] || indent
                },
                label && [
                    hasFloatingLabel && {
                        paddingTop: inputLabelPadding
                    },
                    {
                        /* float label when autofill option is
                           hovered but not yet applied */
                        '&:-webkit-autofill': {
                            paddingTop: inputLabelPadding,
                            '& + label': labelFloatingStyle
                        }
                    }
                ]
            ],
            icon: {
                display: 'flex',
                alignItems: 'center',
                lineHeight: 0,
                marginRight: space[2]
            }
        };

        const autoProps = autoOff
            ? {
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: false
            }
            : {};

        return (
            <div
                ref={x => (this.textInputRef = x)}
                css={[{ marginBottom: space[marginBottom] || marginBottom }, customStyle.root]}
            >
                <div css={[styles.innerWrap, customStyle.innerWrap]}>
                    {contentBefore}
                    <div css={styles.inputWrap}>
                        <input
                            {...autoProps}
                            {...props}
                            type={type}
                            disabled={disabled}
                            required={required}
                            placeholder={placeholder}
                            id={id || name}
                            name={name}
                            value={this.state.value}
                            css={[styles.input, customStyle.input]}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                            ref={x => (this.inputElementRef = x)}
                        />
                        {label && (
                            <label
                                css={[styles.label, customStyle.label, hasFloatingLabel && labelFloatingStyle]}
                                htmlFor={id || name}
                                children={label}
                            />
                        )}
                    </div>
                    {contentAfter}
                    {infoAction && (
                        <span css={styles.icon}>
                            <InfoButton
                                ref={comp => (this.infoActionButtonRef = comp)}
                                onClick={infoAction}
                                aria-label={infoLabel}
                            />
                        </span>
                    )}
                    {infoText && (
                        <span css={styles.icon}>
                            <Tooltip
                                content={infoText}
                                dismissButton={infoDismissButton}
                            >
                                <InfoButton />
                            </Tooltip>
                        </span>
                    )}
                    {infoLink && (
                        <Link
                            fontSize='sm'
                            lineHeight='tight'
                            padding={2}
                            marginLeft={-2}
                            {...infoLink}
                        />
                    )}
                    {hasError && !isFocused && (
                        <span
                            css={styles.icon}
                            data-at={Sephora.debug.dataAt('alert_icon')}
                        >
                            <Icon
                                name='alert'
                                color='error'
                                size={16}
                                css={{ pointerEvents: 'none' }}
                            />
                        </span>
                    )}
                </div>
                {(this.props.error || this.state.error || this.state.message) && (
                    <InputMsg
                        role={hasError ? 'alert' : null}
                        color={knockout ? 'white' : hasError ? 'error' : null}
                        children={this.state.error || this.props.error || this.state.message}
                        data-at={dataAtError}
                        css={customStyle.message}
                    />
                )}
            </div>
        );
    }

    componentDidMount() {
        const { highlight, readOnly } = this.props;
        const element = this.inputElementRef;

        if (highlight && readOnly && element) {
            element.focus();
            element.setSelectionRange(0, element.value.length);
        }

        if (this.props.onPaste) {
            this.textInputRef.addEventListener('paste', this.props.onPaste);
        }
    }

    componentWillUnmount() {
        if (this.props.onPaste) {
            this.textInputRef.removeEventListener('paste', this.props.onPaste);
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.value !== this.props.value) {
            this.setValue(newProps.value);
        }

        if (newProps.message !== this.props.message) {
            this.setState({ message: newProps.message });
        }
    }

    // Note of caution: in many places where getValue is used (example: giftcards.c.js)
    // we check that the value exists.  In the event that this function returns 0,
    // we need to make sure it's stringified.
    getValue = () => {
        return this.state.value;
    };

    setValue = (value, callback) => {
        const newState = { value };

        //set error to null when setting new value and value is not empty

        if (value && value.length) {
            newState.error = null;
        }

        this.setState(newState, () => {
            callback && callback(this.state.value);
        });
    };

    empty = () => {
        this.setValue('');
    };

    validateError = () => {
        const error = this.props.validate && this.props.isInputChecked !== false ? this.props.validate(this.state.value) : null;

        this.setState({ error: error });

        return error;
    };

    validateErrorWithCode = () => {
        return this.props.validateError ? this.props.validateError(this.state.value) : null;
    };

    handleFocus = e => {
        const newState = { isFocused: true };

        if (this.state.value === ErrorConstants.TEXT_INPUT_MESSAGE) {
            newState.value = '';
        }

        this.setState(newState, () => {
            this.props.onFocus && this.props.onFocus(e);
        });
    };

    handleBlur = e => {
        this.setState({ isFocused: false }, () => {
            this.props.onBlur && this.props.onBlur(e);
        });
    };

    handleChange = e => {
        if (!this.props.isControlled) {
            this.setState({
                value: e.target.value,
                error: null
            });
        }

        this.props.onChange && this.props.onChange(e);
    };

    removeSpecificError = errorMsg => {
        if (this.state.error === errorMsg) {
            this.setState({ error: null });
        }
    };

    showError = (error, value) => {
        this.setState({ error: error }, () => {
            this.props.onError && this.props.onError();
        });

        if (value && value !== ErrorConstants.TEXT_INPUT_MESSAGE) {
            this.setState({ value: value });
        }
    };

    focus = () => {
        this.inputElementRef.focus();
    };

    blur = () => {
        this.inputElementRef.blur();
    };

    getInfoActionButtonRef = () => {
        return this.infoActionButtonRef;
    };
}

TextInput.defaultProps = {
    type: 'text',
    marginBottom: forms.MARGIN_BOTTOM,
    isInputChecked: true,
    isControlled: false,
    infoDismissButton: false
};

TextInput.propTypes = {
    /** Smaller input; not for use with floating labels; placeholders only */
    isSmall: PropTypes.bool,
    /** Label for form element */
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** Form element type */
    type: PropTypes.string,
    /** Verifying if challenger, don't show asterisk */
    hideAsterisk: PropTypes.bool,
    /** Adds a helper or error message below the input */
    message: PropTypes.string,
    /** Disables autocomplete, autocorrect, autocapitalize, and spellcheck props */
    autoOff: PropTypes.bool,
    /** Adjust styles when on dark background */
    knockout: PropTypes.bool,
    /** Info popover text */
    infoText: PropTypes.string,
    /** Error check scenario */
    isInputChecked: PropTypes.bool,
    /** Info button action (non popover, e.g. Modal) */
    infoAction: PropTypes.func,
    /** Info button aria-label; required when using `infoLabel` for a11y */
    infoLabel: PropTypes.string,
    /** Info `Link` positioned to right of input */
    infoLink: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    /** Additional styles */
    customStyle: PropTypes.object,
    /** Used to display "Got it" button on info window */
    infoDismissButton: PropTypes.bool
};

export default wrapComponent(TextInput, 'TextInput', true);
