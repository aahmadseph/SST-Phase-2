import store from 'store/Store';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import skuUtils from 'utils/Sku';
import keyConsts from 'utils/KeyConstants';
import testTargetUtils from 'utils/TestTarget';
import anaConsts from 'analytics/constants';
import localeUtils from 'utils/LanguageLocale';
import helpersUtils from 'utils/Helpers';

const { deferTaskExecution } = helpersUtils;
const { SKU_ID_PARAM } = skuUtils;

const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Swatch');

const SALE_GROUP_NAME = getText('SALE_GROUP_NAME');

const REFINEMENT_LABELS = {
    SIZE: getText('SIZE_REFINEMENT_LABEL'),
    FINISH: getText('FINISH_REFINEMENT_LABEL'),
    STANDARD: getText('STANDARD_REFINEMENT_LABEL'),
    COLOR: getText('COLOR_REFINEMENT_LABEL'),
    NO_REFINEMENT_LABEL: getText('NO_REFINEMENT_LABEL')
};

const SWATCH_TYPES = {
    CIRCLE: 'Image - 36',
    SQUARE_SM: 'Image - 42',
    SQUARE_LG: 'Image - 62',
    RECTANGLE: 'Image - Rectangle'
};

const CLOSEST = 'closest';
const CLOSE = 'close';
const NO_MATCH = 'no match';

const SWATCH_BORDER = 4; // border + padding
const SQUARE_MARGIN = 4;

const createRefinementGroups = ({ regularChildSkus, onSaleChildSkus }) => {
    const refinementTypes = {};

    if (onSaleChildSkus && onSaleChildSkus.length) {
        onSaleChildSkus.forEach(element => setSkuRefinementGroup(element, refinementTypes));
    }

    if (regularChildSkus && regularChildSkus.length) {
        regularChildSkus.forEach(element => setSkuRefinementGroup(element, refinementTypes));
    }

    Object.keys(refinementTypes).forEach(type => {
        refinementTypes[type] = sortRefinementGroups(refinementTypes[type]);
    });

    return refinementTypes;
};

const setSkuRefinementGroup = (element, refinementTypes) => {
    const standardSizeLabel = `${element.type}${REFINEMENT_LABELS.SIZE}`;
    const createNewGroup = elm => (elm ? { groupEntries: [elm] } : { groupEntries: [] });

    const setGroup = (refLabel, sizeLabel) => {
        const label = refLabel ? `${refLabel}${REFINEMENT_LABELS.FINISH}` : REFINEMENT_LABELS.NO_REFINEMENT_LABEL;

        const refinementObj = refinementTypes[label] ? refinementTypes[label] : (refinementTypes[label] = {});

        if (sizeLabel) {
            if (!refinementObj[sizeLabel]) {
                refinementObj[sizeLabel] = createNewGroup();
            }

            refinementObj[sizeLabel].groupEntries.push(element);
        } else {
            if (!refinementObj[standardSizeLabel]) {
                refinementObj[standardSizeLabel] = createNewGroup();
            }

            refinementObj[standardSizeLabel].groupEntries.push(element);
        }
    };

    const { refinements } = element;

    if (refinements) {
        const { sizeRefinements, finishRefinements } = refinements;
        const sizeRefinementLabel = sizeRefinements && `${sizeRefinements}${REFINEMENT_LABELS.SIZE}`;

        if (finishRefinements && finishRefinements.length > 1) {
            finishRefinements.forEach(ref => setGroup(ref, sizeRefinementLabel));
        } else {
            setGroup(finishRefinements, sizeRefinementLabel);
        }
    } else {
        setGroup();
    }

    return refinementTypes;
};

const sortRefinementGroups = refinementObj => {
    const sortedRefinements = {};
    Object.keys(refinementObj)
        .sort((group1, group2) => {
            if (!group1) {
                return 1;
            } else if (!group2) {
                return -1;
            } else if (group1.indexOf(REFINEMENT_LABELS.STANDARD) > -1) {
                return -1;
            } else if (group2.indexOf(REFINEMENT_LABELS.STANDARD) > -1) {
                return 1;
            } else {
                return 0;
            }
        })
        .forEach(key => (sortedRefinements[key] = refinementObj[key]));

    return sortedRefinements;
};

const setSwatchGroupFilterNames = (refinementGroups, group, size) => {
    //Currently Products are set up to have a maximum of either:
    //1 Refinement & multiple Sizes or multiple Refinements and 1 Size.
    //This logic establishes which filter (Refinement or Size) to use.
    if (refinementGroups[group][size]) {
        if (group !== REFINEMENT_LABELS.NO_REFINEMENT_LABEL) {
            return `${group} - ${size}`;
        }

        return size;
    } else {
        return group;
    }
};

const buildSwatchGroupsAndFilters = refinementGroups => {
    const swatchFilters = [];
    const swatchGroups = [];

    Object.keys(refinementGroups).forEach(group => {
        Object.keys(refinementGroups[group]).forEach(size => {
            swatchGroups.push(refinementGroups[group][size].groupEntries);
            swatchFilters.push(setSwatchGroupFilterNames(refinementGroups, group, size));
        });
    });

    return {
        swatchGroups,
        swatchFilters
    };
};

const isActiveSwatch = ({ sku, activeSku }) => sku.skuId === activeSku.skuId;

const getAriaDescribedById = skuType => {
    switch (skuType) {
        case skuUtils.skuSwatchType.SIZE:
            return skuUtils.ARIA_DESCRIBED_BY_IDS.SIZE_SWATCH;
        case skuUtils.skuSwatchType.IMAGE:
            return skuUtils.ARIA_DESCRIBED_BY_IDS.COLOR_SWATCH;
        default:
            return null;
    }
};

const updateDigitalDataProduct = ({ currentProduct, isQuickLookModal, sku }) => {
    const digitalDataProductList = digitalData.product;

    if (digitalDataProductList.length) {
        digitalData.product.shift();
    }

    testTargetUtils.updateDigitalProductObject(currentProduct, isQuickLookModal && digitalDataProductList.length > 0, sku);

    if (isQuickLookModal) {
        window.dispatchEvent(new Event(anaConsts.SNAPCHAT_QUICK_LOAD_EVENT));
        window.dispatchEvent(new Event(anaConsts.PINTEREST_QUICK_LOAD_EVENT));
    } else {
        window.dispatchEvent(new Event(anaConsts.SNAPCHAT_PRODUCT_PAGE_VIEW_EVENT));
        window.dispatchEvent(new Event(anaConsts.PINTEREST_PRODUCT_PAGE_VIEW_EVENT));
    }
};

const handleSkuOnClick = sku => {
    const queryParams = Object.assign({}, store.getState().historyLocation.queryParams);
    queryParams[SKU_ID_PARAM] = sku.skuId;
    deferTaskExecution(() => {
        store.dispatch(historyLocationActions.goTo({ queryParams }));
    });
};

const handleKeyDown = (e, index) => {
    const btn = e.target;
    const grid = btn.parentNode;
    const cells = grid.childNodes;
    const lastCell = cells.length - 1;

    const setFocus = i => cells[i].focus();

    switch (e.key) {
        case keyConsts.END:
            e.preventDefault();
            setFocus(lastCell);

            break;
        case keyConsts.HOME:
            e.preventDefault();
            setFocus(0);

            break;
        case keyConsts.RIGHT:
        case keyConsts.DOWN:
            e.preventDefault();

            if (index === lastCell) {
                setFocus(0);
            } else {
                setFocus(index + 1);
            }

            break;
        case keyConsts.LEFT:
        case keyConsts.UP:
            e.preventDefault();

            if (index === 0) {
                setFocus(lastCell);
            } else {
                setFocus(index - 1);
            }

            break;
        default:
            break;
    }
};

const getSwatchType = skuSelectorType => {
    let type;

    switch (skuSelectorType) {
        case SWATCH_TYPES.CIRCLE:
            type = 'circle';

            break;
        case SWATCH_TYPES.SQUARE_SM:
        case SWATCH_TYPES.SQUARE_LG:
            type = 'square';

            break;
        case SWATCH_TYPES.RECTANGLE:
            type = 'rectangle';

            break;
        default:
            type = 'chip';
    }

    return type;
};

const SWATCH_GROUP_VIEWS = {
    GRID: 'GRID',
    LIST: 'LIST'
};

export default {
    SWATCH_BORDER,
    SQUARE_MARGIN,
    SALE_GROUP_NAME,
    REFINEMENT_LABELS,
    CLOSEST,
    CLOSE,
    NO_MATCH,
    SWATCH_TYPES,
    createRefinementGroups,
    buildSwatchGroupsAndFilters,
    isActiveSwatch,
    getAriaDescribedById,
    handleSkuOnClick,
    handleKeyDown,
    updateDigitalDataProduct,
    getSwatchType,
    SWATCH_GROUP_VIEWS
};
