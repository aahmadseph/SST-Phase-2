import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors, forms, radii } from 'style/config';
import { Box } from 'components/ui';

function Radio(props) {
    const {
        id,
        children,
        name,
        checked,
        disabled,
        hasHover,
        hasDot,
        value,
        onClick,
        onChange,
        tabIndex,
        dotOffset,
        dataAt,
        label,
        isPaymentRadio = false,
        ...rest
    } = props;

    const hasHoverStyle = hasHover && !disabled && !checked;

    return (
        <Box
            is='label'
            label={label}
            htmlFor={id}
            baseCss={[
                { cursor: checked ? 'default' : disabled ? 'not-allowed' : 'pointer' },
                !disabled && !checked && styles.rootHover,
                hasHoverStyle && styles.rootHoverUnderline
            ]}
            {...rest}
        >
            <input
                type='radio'
                id={id}
                name={name}
                value={value ? value : ''}
                checked={checked}
                disabled={disabled}
                onClick={onClick}
                onChange={onChange}
                tabIndex={tabIndex}
                css={[styles.input, hasDot && styles.inputWithDot, hasHoverStyle && styles.inputWithHover]}
            />
            {hasDot && (
                <div
                    css={[
                        styles.dot,
                        { marginTop: dotOffset },
                        checked && { borderColor: colors.black },
                        disabled && [checked ? { opacity: 0.25 } : styles.dotDisabled],
                        isPaymentRadio && styles.paymentRadio
                    ]}
                    data-at={Sephora.debug.dataAt(dataAt ? dataAt : null)}
                    className='Radio-dot'
                >
                    <div
                        css={[styles.dotInner, checked && { backgroundColor: colors.black }]}
                        style={disabled && !checked ? { display: 'none' } : null}
                    />
                </div>
            )}
            <div
                className='Radio-label'
                css={styles.label}
                children={children}
            />
        </Box>
    );
}

const styles = {
    rootHover: {
        '.no-touch &:hover .Radio-dot': {
            borderColor: colors.black
        }
    },
    rootHoverUnderline: {
        '.no-touch &:hover .Radio-label': {
            textDecoration: 'underline'
        }
    },
    input: {
        position: 'absolute',
        opacity: 0
    },
    inputWithDot: {
        ':focus + .Radio-dot': {
            borderColor: colors.black,
            boxShadow: `${colors.white} 0 0 0 2px,
                ${colors.black} 0 0 0 3px`
        }
    },
    inputWithHover: {
        ':focus + .Radio-label': {
            textDecoration: 'underline'
        }
    },
    dot: {
        position: 'relative',
        display: 'flex',
        borderRadius: radii.full,
        flexShrink: 0,
        borderWidth: 2,
        borderColor: colors.gray,
        backgroundColor: colors.white,
        width: forms.RADIO_SIZE,
        height: forms.RADIO_SIZE,
        marginRight: forms.RADIO_MARGIN
    },
    dotDisabled: {
        backgroundColor: colors.nearWhite,
        borderColor: colors.midGray,
        marginTop: 0,
        ':after': {
            content: '""',
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '100%',
            borderTop: `2px solid ${colors.midGray}`,
            transform: 'translate(-50%, -50%) rotate(-45deg)'
        }
    },
    dotInner: {
        borderRadius: radii.full,
        width: '100%',
        borderWidth: 3,
        borderColor: colors.white
    },
    label: {
        minWidth: 0,
        alignSelf: 'center',
        flex: 1
    },
    paymentRadio: {
        alignSelf: 'flex-start',
        top: '6px'
    }
};

Radio.defaultProps = {
    display: 'flex',
    position: 'relative',
    lineHeight: 'tight',
    paddingY: '.375em',
    hasDot: true,
    dotOffset: '-.0625em',
    width: 'fit-content',
    alignItems: 'center',
    onChange: () => {}
};

export default wrapFunctionalComponent(Radio, 'Radio');
