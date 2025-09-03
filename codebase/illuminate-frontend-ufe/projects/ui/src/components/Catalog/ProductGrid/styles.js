import { space, mediaQueries } from 'style/config';

const SM_COL_GAP = space[4] / 2;
const LG_COL_GAP = space[5] / 2;
const SM_ROW_GAP = space[5] / 2;
const LG_ROW_GAP = space[7] / 2;

const getStyles = increaseImageSizeGrid => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: -SM_ROW_GAP,
        marginBottom: -SM_ROW_GAP,
        marginLeft: -SM_COL_GAP,
        marginRight: -SM_COL_GAP,
        [mediaQueries.sm]: {
            marginTop: -LG_ROW_GAP,
            marginBottom: -LG_ROW_GAP,
            marginLeft: -LG_COL_GAP,
            marginRight: -LG_COL_GAP
        },
        '@media (min-width: 768px)': {
            ...(increaseImageSizeGrid && {
                padding: `${space[5]}px ${space[4]}px`
            })
        }
    },
    item: {
        display: 'flex',
        width: '50%',
        paddingTop: SM_ROW_GAP,
        paddingBottom: SM_ROW_GAP,
        paddingLeft: SM_COL_GAP,
        paddingRight: SM_COL_GAP,
        ...(increaseImageSizeGrid && {
            paddingLeft: '1px',
            paddingRight: '1px'
        }),

        ['@media (min-width: 556px)']: {
            width: 'calc(1 / 3 * 100%)'
        },
        [mediaQueries.sm]: {
            paddingTop: LG_ROW_GAP,
            paddingBottom: LG_ROW_GAP,
            paddingLeft: LG_COL_GAP,
            paddingRight: LG_COL_GAP,
            ...(increaseImageSizeGrid && {
                padding: `${space[4]}px`,
                paddingBottom: `${space[7]}px`
            })
        },
        [mediaQueries.lg]: {
            width: increaseImageSizeGrid ? 'calc(1 / 3 * 100%)' : '25%'
        }
    },
    banner: {
        width: '100%',
        height: 'auto',
        minHeight: 'auto',
        paddingTop: space[1],
        paddingBottom: space[1],
        paddingLeft: SM_COL_GAP,
        paddingRight: SM_COL_GAP,
        [mediaQueries.sm]: {
            paddingTop: space[2],
            paddingBottom: space[2],
            paddingLeft: LG_COL_GAP,
            paddingRight: LG_COL_GAP
        }
    },
    itemLazy: {
        minHeight: space[8] + space[7] + space[6], // 64 + 48 + 32 = 144
        [mediaQueries.sm]: {
            minHeight: space[9] + space[8] // 96 + 64 = 160
        }
    },
    showMore: {
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        flex: 1,
        order: 9999
    },
    showMoreButton: {
        width: '100%',
        maxWidth: '16.5em'
    },
    productListContainer: {
        width: '100vw'
    }
});

export default getStyles;
