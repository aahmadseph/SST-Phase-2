/* eslint-disable object-curly-newline */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { radii, colors, forms, fontWeights } from 'style/config';
import { Box } from 'components/ui';

const styles = {
    rootHover: {
        '.no-touch &:hover .Checkbox-box': {
            borderColor: colors.black
        }
    },
    rootHoverUnderline: {
        '.no-touch &:hover .Checkbox-label': {
            textDecoration: 'underline'
        }
    },
    input: {
        position: 'absolute',
        opacity: 0,
        ':focus + .Checkbox-box': {
            boxShadow: `${colors.white} 0 0 0 2px,
                ${colors.black} 0 0 0 3px`
        }
    },
    inputWithHover: {
        ':focus ~ .Checkbox-label': {
            textDecoration: 'underline'
        }
    },
    box: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radii[2],
        marginTop: '-.0625em',
        flexShrink: 0,
        borderWidth: 2,
        borderColor: colors.gray,
        overflow: 'hidden'
    },
    boxDisabled: {
        backgroundColor: colors.nearWhite,
        borderColor: colors.midGray,
        ':after': {
            content: '""',
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '150%',
            borderTop: `2px solid ${colors.midGray}`,
            transform: 'translate(-50%, -50%) rotate(-45deg)'
        }
    },
    checkmark: {
        width: '88%',
        height: '88%'
    },
    label: {
        minWidth: 0,
        alignSelf: 'center',
        flex: 1
    },
    disabledText: {
        color: colors.gray,
        fontWeight: fontWeights.normal
    },
    boxDisabledVariant: {
        backgroundColor: '#F4F4F4',
        borderColor: colors.midGray
    }
};

const SVG_ICON = {
    checked: checked => (
        <svg
            viewBox='0 0 14 11'
            css={styles.checkmark}
            fill={colors.white}
            style={!checked ? { display: 'none' } : null}
        >
            <path d='M12.524.729l1.452 1.375-8.207 8.663L.876 5.874 2.29 4.459 5.73 7.9z' />
        </svg>
    ),
    disabled: (
        <svg
            viewBox='0 0 20 20'
            fill='none'
        >
            <line
                x1='0'
                y1='20'
                x2='20'
                y2='0'
                stroke={colors.midGray}
                strokeWidth='2'
            />
        </svg>
    )
};

// eslint-disable-next-line complexity
function Checkbox(props) {
    // eslint-disable-next-line max-len
    const {
        id,
        name,
        fontSize,
        isSmall,
        checked,
        html,
        children,
        disabled,
        hasHover,
        value,
        onClick,
        onChange,
        tabIndex,
        inputDataAt,
        isHappening,
        ...rest
    } = props;

    const checkSize = isSmall ? forms.RADIO_SIZE_SM : forms.RADIO_SIZE;
    const checkMargin = isSmall ? forms.RADIO_MARGIN_SM : forms.RADIO_MARGIN;

    return (
        <Box
            is='label'
            baseCss={[
                { cursor: disabled ? 'not-allowed' : 'pointer' },
                !disabled && !checked && styles.rootHover,
                hasHover && !disabled && styles.rootHoverUnderline
            ]}
            fontSize={isSmall ? 'sm' : fontSize}
            {...rest}
        >
            <input
                data-at={Sephora.debug.dataAt(inputDataAt)}
                type='checkbox'
                id={id}
                name={name}
                value={value ? value : ''}
                checked={checked}
                disabled={disabled}
                onClick={onClick}
                onChange={onChange}
                tabIndex={tabIndex}
                css={[styles.input, hasHover && !disabled && styles.inputWithHover]}
            />
            <div
                css={[
                    styles.box,
                    {
                        width: checkSize,
                        height: checkSize,
                        marginRight: checkMargin
                    },
                    checked && {
                        backgroundColor: colors.black,
                        borderColor: colors.black
                    },
                    isHappening && disabled
                        ? [{ ...styles.boxDisabled, ...styles.boxDisabledVariant }]
                        : disabled && [checked ? { opacity: 0.25 } : styles.boxDisabled]
                ]}
                className='Checkbox-box'
            >
                {isHappening && disabled ? SVG_ICON.disabled : SVG_ICON.checked(checked)}
            </div>
            <div
                css={{ ...styles.label, ...(isHappening && disabled && styles.disabledText) }}
                aria-hidden={props['aria-label'] ? true : null}
                className='Checkbox-label'
                dangerouslySetInnerHTML={
                    html
                        ? {
                            __html: html
                        }
                        : null
                }
                children={children}
            />
        </Box>
    );
}

Checkbox.defaultProps = {
    display: 'flex',
    position: 'relative',
    lineHeight: 'tight',
    paddingY: '.375em',
    width: 'fit-content',
    onChange: () => {}
};

export default wrapFunctionalComponent(Checkbox, 'Checkbox');
