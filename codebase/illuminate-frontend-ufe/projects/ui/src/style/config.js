const breakpoints = ['768px', '992px', '1200px'];
breakpoints.xsMax = `(max-width: ${parseInt(breakpoints[0]) - 1}px)`;
breakpoints.smMin = `(min-width: ${breakpoints[0]})`;
breakpoints.smMax = `(max-width: ${parseInt(breakpoints[1]) - 1}px)`;
breakpoints.mdMin = `(min-width: ${breakpoints[1]})`;
breakpoints.mdMax = `(max-width: ${parseInt(breakpoints[2]) - 1}px)`;
breakpoints.lgMin = `(min-width: ${breakpoints[2]})`;

const mediaQueries = {
    xsMax: `@media ${breakpoints.xsMax}`,
    sm: `@media ${breakpoints.smMin}`,
    smMax: `@media ${breakpoints.smMax}`,
    md: `@media ${breakpoints.mdMin}`,
    mdMax: `@media ${breakpoints.mdMax}`,
    lg: `@media ${breakpoints.lgMin}`
};

const black = '#000';
const white = '#fff';
const red = '#cf112c';
const lightRed = '#FCECEC';
const brightRed = '#e2030f';
const green = '#008048';
const yellow = '#ffc003';
const blue = '#136BEA';
const lightBlue = '#e5f2fd';
const gray = '#666';
const inputGray = '#888';
const midGray = '#ccc';
const lightGray = '#eee';
const nearWhite = '#f6f6f8';
const babyPink = '#f4b6c7';
const paleTurquoise = '#b2fce4';
const goldenYellow = '#f8d15d';
const venmoBlue = '#008cff';
const venmoLightBlue = '#299EFF';
const pazeBlue = '#0F42F8';

const darken = n => `rgba(0, 0, 0, ${n})`;

const space = [
    0,
    4, // 1
    8, // 2
    12, // 3
    16, // 4
    24, // 5
    32, // 6
    48, // 7
    64, // 8
    96 // 9
];

space.container = space[4];
space['-container'] = -space[4];

const borders = [0, '1px solid', '2px solid', '8px solid'];

const radii = [0, 2, 4, 6, 8, 10];
radii.none = radii[0];
radii.full = 9999;
radii.top = `${radii[2]}px ${radii[2]}px 0 0`;
radii.right = `0 ${radii[2]}px ${radii[2]}px 0`;
radii.bottom = `0 0 ${radii[2]}px ${radii[2]}px`;
radii.left = `${radii[2]}px 0 0 ${radii[2]}px`;

const shadows = {
    light: '0 0 6px rgba(0,0,0,.2)',
    medium: '0 0 12px rgba(0,0,0,.2)'
};

const colors = {
    black,
    white,
    lightRed,
    red,
    brightRed,
    green,
    yellow,
    blue,
    lightBlue,
    gray,
    inputGray,
    midGray,
    lightGray,
    nearWhite,
    babyPink,
    paleTurquoise,
    goldenYellow,
    venmoBlue,
    venmoLightBlue,
    pazeBlue
};
colors.darken1 = darken(1 / 16);
colors.darken2 = darken(1 / 8);
colors.darken3 = darken(1 / 4);
colors.error = colors.red;
colors.base = colors.black;
colors.link = colors.blue;
colors.divider = colors.darken1;

const fonts = {
    base: '"helvetica neue", helvetica, arial, sans-serif',
    serif: 'georgia, times, serif'
};

const fontSizes = {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    //new font sizes for use on buying guides
    'xs-bg': 11,
    'sm-bg': 12,
    'base-bg': 14,
    'md-bg': 16,
    'lg-bg': 18,
    'xl-bg': 20,
    '2xl-bg': 24,
    '3xl-bg': 26,
    '4xl-bg': 36
};

const lineHeights = {
    none: '1',
    tight: '1.25',
    base: '1.5',
    relaxed: '1.75'
};

const fontWeights = {
    light: '300',
    normal: '400',
    medium: '500',
    demiBold: '600',
    bold: '700'
};

const site = {
    containerMax: 1248,
    maxWidth: 1440,
    headerHeight: 54,
    MIN_WIDTH_FS: 1024,
    SIDEBAR_WIDTH: 203,
    TOP_BAR_HEIGHT: 34,
    legacyWidth: 980,
    BREADCRUMB_HEIGHT: 50,
    MAIN_INDENT: space[5]
};

const letterSpacings = ['normal', '.0625em', '.125em', '.25em'];

const zIndices = {
    fixedBar: '1000',
    header: '1010',
    flyout: '1020',
    modal: '1030',
    max: '2147483647'
};

const buttons = {
    HEIGHT: 44,
    HEIGHT_SM: 32,
    HEIGHT_XS: 24
};

const forms = {
    HEIGHT: buttons.HEIGHT,
    HEIGHT_SM: 36,
    HEIGHT_XS: buttons.HEIGHT_SM,
    HEIGHT_XXS: buttons.HEIGHT_XS,
    SEARCH_BAR_HEIGHT: 32,
    SEARCH_BAR_HEIGHT_SM: 34,
    BORDER_WIDTH: 1,
    BORDER_WIDTH_BOLD: 2,
    FONT_SIZE: fontSizes.base,
    PADDING_X: space[4],
    PADDING_Y: space[3],
    PADDING_SM: space[3],
    COLOR: colors.black,
    BG: colors.white,
    BORDER_COLOR: colors.inputGray,
    BORDER_FOCUS_COLOR: colors.black,
    BORDER_RADIUS: radii[2],
    DISABLED_BG: colors.lightGray,
    DISABLED_OPACITY: 0.7,
    RADIO_SIZE: 20,
    RADIO_SIZE_SM: 15,
    RADIO_MARGIN: space[3],
    RADIO_MARGIN_SM: space[2],
    PLACEHOLDER_COLOR: colors.gray,
    PLACEHOLDER_FOCUS_COLOR: colors.midGray,
    LINE_HEIGHT: lineHeights.base,
    MARGIN_BOTTOM: space[4]
};

const modal = {
    paddingXs: space[2],
    paddingSm: space[4],
    paddingLg: space[6],
    paddingX: [space[4], space[5]],
    outdentX: [-space[4], -space[5]],
    headerHeight: site.headerHeight,
    radius: radii[3],
    xSize: 13,
    width: [384, 472, 576, 650, 783, site.legacyWidth, 1036]
};

const measure = [
    /* Measure is limited to ~45 characters */
    '20em',
    /* Measure is limited to ~66 characters */
    '30em',
    /* Measure is limited to ~80 characters */
    '34em',
    '41em'
];

const screenReaderOnlyStyle = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    clipPath: 'inset(50%)',
    border: '0'
};

export {
    borders,
    radii,
    shadows,
    breakpoints,
    mediaQueries,
    buttons,
    colors,
    fonts,
    forms,
    lineHeights,
    fontWeights,
    measure,
    modal,
    site,
    space,
    letterSpacings,
    fontSizes,
    zIndices,
    screenReaderOnlyStyle
};
