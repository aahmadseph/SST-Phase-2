/* eslint-disable class-methods-use-this,complexity */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    colors, fontSizes, forms, space, radii
} from 'style/config';
import InputMsg from 'components/Inputs/InputMsg/InputMsg';
import { Icon } from 'components/ui';
import Chevron from 'components/Chevron/Chevron';

const FOCUS_STYLE = {
    borderColor: forms.BORDER_FOCUS_COLOR,
    outline: 0
};

const INPUT_LABEL_PADDING = '1em';

class Select extends BaseClass {
    state = {
        message: this.props.message,
        error: null,
        value: this.props.value ? this.props.value : ''
    };

    handleOnStateChange = onChangeFunc => e => {
        this.setState({
            value: e.target.value,
            error: null
        });

        onChangeFunc && onChangeFunc(e);
    };

    render() {
        const {
            indent,
            id,
            hideAsterisk,
            name,
            label,
            invalid,
            onChange,
            value,
            disabled,
            isInline,
            customStyle = {},
            size,
            children,
            required,
            hasFakeFocus,
            marginBottom,
            chevronColor,
            isNotSelectable,
            isNotChangeable,
            isInReplenishBasket,
            textIndent,
            ...props
        } = this.props;

        const isXS = size === 'xs';
        const isSM = size === 'sm';
        const hasError = invalid || this.state.error;
        const hasErrorWithoutFocus = hasError && !this.state.isFocused;
        const message = this.props.message || this.state.message;
        const inputColor = hasErrorWithoutFocus ? colors.error : forms.COLOR;
        const paddingRight = hasError ? (size ? 22 : 28) : size ? 18 : 24;

        return (
            <div css={[{ marginBottom: space[marginBottom] || marginBottom }, customStyle.root]}>
                <div css={[styles.inputWrap, isInline && { display: isInline }]}>
                    <select
                        {...props}
                        required={required}
                        id={id || name}
                        name={name}
                        value={value}
                        disabled={disabled || isNotChangeable || isNotSelectable}
                        onChange={this.handleOnStateChange(onChange)}
                        css={[
                            styles.input,
                            isInline && { width: 'auto' },
                            indent && { paddingLeft: indent },
                            hasError && { borderColor: colors.error },
                            {
                                paddingRight,
                                color: inputColor,
                                ':disabled': {
                                    color: !value ? forms.PLACEHOLDER_COLOR : null
                                },
                                /* FF: rm additional whitespace around text */
                                '@-moz-document url-prefix("")': {
                                    '&': {
                                        textIndent: textIndent || '-2px',
                                        paddingRight: paddingRight - 7
                                    }
                                },
                                /* FF: rm dotted focus outline */
                                '&:-moz-focusring': {
                                    color: 'transparent',
                                    textShadow: `0 0 0 ${inputColor}`
                                }
                            },
                            isNotSelectable &&
                                !isInReplenishBasket && {
                                ':disabled': {
                                    color: forms.BG,
                                    backgroundColor: colors.red,
                                    opacity: 1
                                }
                            },
                            isInReplenishBasket && {
                                ':disabled': {
                                    color: forms.PLACEHOLDER_COLOR
                                }
                            },
                            isXS && {
                                fontSize: fontSizes.sm,
                                borderRadius: radii.full,
                                paddingLeft: space[2],
                                height: forms.HEIGHT_XXS
                            },
                            isSM && {
                                paddingLeft: space[2],
                                height: forms.HEIGHT_XS
                            },
                            indent && {
                                paddingLeft: indent
                            },
                            label && {
                                paddingTop: value ? INPUT_LABEL_PADDING : null,
                                /* float label when autofill option is
                                   hovered but not yet applied */
                                '&:-webkit-autofill, :focus': {
                                    paddingTop: INPUT_LABEL_PADDING,
                                    '& + label': styles.labelFloating
                                }
                            },
                            hasFakeFocus && FOCUS_STYLE,
                            customStyle.input
                        ]}
                    >
                        {/* prevent label overlap by having an empty
                            default selection */}
                        {label && !value && <option hidden />}
                        {children}
                    </select>
                    {label && (
                        <label
                            css={[
                                styles.label,
                                {
                                    color: hasError && !this.state.isFocused ? colors.error : colors.gray,
                                    left: indent || forms.PADDING_X,
                                    right: paddingRight
                                },
                                value && styles.labelFloating,
                                required &&
                                    !hideAsterisk && {
                                    '&:after': {
                                        content: '"*"'
                                    }
                                }
                            ]}
                            htmlFor={id || name}
                            children={label}
                        />
                    )}
                    <Chevron
                        color={chevronColor || (disabled && 'gray')}
                        direction='down'
                        size={size ? 8 : 11}
                        css={[
                            {
                                position: 'absolute',
                                top: '50%',
                                right: size ? 7 : 9,
                                transform: 'translate(0, -50%)',
                                pointerEvents: 'none'
                            },
                            customStyle.svg
                        ]}
                        style={hasError || isNotSelectable ? { display: 'none' } : null}
                    />
                    <Icon
                        name='alert'
                        color='error'
                        size={size ? 14 : 16}
                        css={{
                            position: 'absolute',
                            top: '50%',
                            right: size ? 6 : 8,
                            transform: 'translate(0, -50%)',
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
                {(this.state.error || message) && (
                    <InputMsg
                        role={hasError ? 'alert' : null}
                        color={hasError ? 'error' : null}
                        children={this.state.error || message}
                    />
                )}
            </div>
        );
    }

    getValue = () => {
        return this.state.value;
    };

    setValue = (value, callback) => {
        //set error to null when setting new value
        this.setState(
            {
                value: value,
                error: null,
                invalid: null
            },
            () => {
                callback && callback(this.state.value);
            }
        );
    };

    empty = () => {
        this.setValue('');
    };

    validateErrorWithCode = () => {
        return this.props.validateError ? this.props.validateError(this.state.value) : null;
    };

    getPossibleErrorCodes = () => {
        return this.props.possibleErrorCodes || [];
    };

    showError = (error, value) => {
        if (typeof error === 'string') {
            this.setState({ error: error });
        } else {
            this.setState({ invalid: error });
        }

        if (value) {
            this.setState({ value: value });
        }
    };
}

const styles = {
    inputWrap: {
        position: 'relative'
    },
    input: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'inherit',
        fontSize: forms.FONT_SIZE,
        verticalAlign: 'middle',
        width: '100%',
        height: forms.HEIGHT,
        paddingLeft: forms.PADDING_X,
        backgroundColor: forms.BG,
        textTransform: 'none',
        borderWidth: forms.BORDER_WIDTH,
        borderRadius: forms.BORDER_RADIUS,
        borderColor: forms.BORDER_COLOR,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        ':focus': FOCUS_STYLE,
        /* custom appearance (arrow) */
        MozAppearance: 'none',
        WebkitAppearance: 'none',
        '&::-ms-expand': { display: 'none' },
        ':disabled': {
            cursor: 'not-allowed',
            backgroundColor: forms.DISABLED_BG,
            opacity: forms.DISABLED_OPACITY
        }
    },
    label: {
        position: 'absolute',
        top: forms.PADDING_Y + forms.BORDER_WIDTH,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        transitionDuration: '.2s',
        lineHeight: forms.LINE_HEIGHT
    },
    labelFloating: {
        fontSize: fontSizes.sm,
        top: 5,
        marginLeft: 1
    }
};

Select.defaultProps = {
    marginBottom: forms.MARGIN_BOTTOM
};

Select.propTypes = {
    /** Smaller inputs; not for use with floating labels */
    size: PropTypes.oneOf(['xs', 'sm']),
    /** Label for form element */
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /** Adds a helper or error message below the select */
    message: PropTypes.string,
    /**  Verifying if challenger, don't show asterisk */
    hideAsterisk: PropTypes.bool,
    /** Additional styles */
    customStyle: PropTypes.object
};

export default wrapComponent(Select, 'Select', true);
