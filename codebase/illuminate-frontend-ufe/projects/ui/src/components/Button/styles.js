import { buttons, colors, fontSizes } from 'style/config';
import { hexToRGB } from 'style/util';

const HOVER_ACTIVE_SELECTOR = '.no-touch &:hover, :active, &.is-active';
const DISABLED_SELECTOR = ':disabled, &.is-disabled';

const size = s => {
    let height = buttons.HEIGHT;
    let fontSize = fontSizes.base;
    let paddingX = '1.125em';
    let fontWeight = 'var(--font-weight-bold)';
    let borderWidth = 2;

    if (s === 'xs' || s === 'sm') {
        fontSize = fontSizes.sm;
        paddingX = '.875em';
    }

    if (s === 'xs') {
        height = buttons.HEIGHT_XS;
        fontWeight = 'var(--font-weight-normal)';
        borderWidth = 1;
    }

    if (s === 'sm') {
        height = buttons.HEIGHT_SM;
    }

    return {
        fontSize,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        minHeight: height,
        maxHeight: s !== 'xs' && height,
        fontWeight,
        borderWidth
    };
};

const base = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '.25em',
    paddingBottom: '.25em',
    lineHeight: 1,
    color: 'inherit',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: 99999,
    MozAppearance: 'none',
    WebkitAppearance: 'none'
};

const disabled = {
    color: colors.gray,
    borderColor: colors.lightGray,
    backgroundColor: colors.lightGray
};

const disabledCursor = {
    cursor: 'not-allowed',
    pointerEvents: 'none'
};

const secondary = [
    base,
    {
        color: colors.black,
        borderColor: 'currentcolor',
        transition: 'color .2s, border-color .2s',
        [HOVER_ACTIVE_SELECTOR]: { color: colors.gray },
        [DISABLED_SELECTOR]: disabled,
        ':disabled': disabledCursor
    }
];

const primary = [
    base,
    {
        color: colors.white,
        backgroundColor: colors.black,
        transition: 'background-color .2s',
        [HOVER_ACTIVE_SELECTOR]: { backgroundColor: colors.gray },
        [DISABLED_SELECTOR]: disabled,
        ':disabled': disabledCursor
    }
];

const special = [
    primary,
    {
        backgroundColor: colors.red,
        [HOVER_ACTIVE_SELECTOR]: { backgroundColor: colors.brightRed }
    }
];

const inverted = [
    secondary,
    {
        color: colors.white,
        [HOVER_ACTIVE_SELECTOR]: { color: colors.midGray }
    }
];

const white = [
    secondary,
    {
        backgroundColor: colors.white,
        borderColor: 'transparent',
        transition: 'box-shadow .15s ease-in-out',
        boxShadow: '0 0 4px rgba(0,0,0,0.15)',
        [HOVER_ACTIVE_SELECTOR]: {
            color: 'currentcolor',
            boxShadow: '0 0 20px rgba(0,0,0,0.15)'
        },
        [DISABLED_SELECTOR]: { boxShadow: 'none' }
    }
];

/* style like a primary `Link` but with button sizing  */

const link = [
    base,
    {
        '--color': hexToRGB(colors.link, true),
        color: 'rgba(var(--color), 1)',
        textDecoration: 'underline',
        textDecorationColor: 'rgba(var(--color), .3)',
        textUnderlineOffset: 1,
        transition: 'text-decoration-color .2s',
        paddingTop: 0,
        paddingBottom: 0,
        fontWeight: 'var(--font-weight-normal)',
        fontSize: 'var(--font-size-base)',
        [HOVER_ACTIVE_SELECTOR]: {
            textDecorationColor: 'rgba(var(--color), 1)'
        },
        [DISABLED_SELECTOR]: {
            color: 'var(--color-base)',
            opacity: 0.3,
            backgroundColor: 'transparent',
            textDecoration: 'none'
        },
        ':disabled': disabledCursor
    }
];

export default {
    size,
    secondary,
    primary,
    disabled,
    special,
    inverted,
    white,
    link
};
