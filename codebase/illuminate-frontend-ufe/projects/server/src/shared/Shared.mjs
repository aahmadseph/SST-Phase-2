import { SEARCH_SORT_OPTIONS } from '#server/shared/CatalogConstants.mjs';

const ALLOWED_FILTERS_BASE = ['currentPage', 'pageSize', 'ph', 'pl', 'ref', 'sortBy', 'ptype', 'node'];
const ALLOWED_FILTERS_BROWSER = [...ALLOWED_FILTERS_BASE, 'icid2'];
const ALLOWED_FILTERS_SERVER = [...ALLOWED_FILTERS_BASE];

const validateQueryParams = function (param, value, allowedFilters) {
    const stringRegEx = /^[A-Za-zÀ-Ÿ (\-",')_?&\[\]=\d]*$/g;
    const numberRegEx = /^(0|[1-9]\d*)$/g;
    const priceRangeRegEx = /^(min|max|(0|[1-9]\d*))$/g;
    const regExObj = {
        ref: stringRegEx,
        node: /^cat[0-9]+$/g,
        pl: priceRangeRegEx,
        ph: priceRangeRegEx,
        currentPage: numberRegEx,
        pageSize: numberRegEx,
        icid2: stringRegEx
    };
    let sanitizedQueryParam;

    if (allowedFilters.indexOf(param) !== -1) {
        if (param === 'ptype' && value === 'manual') {
            sanitizedQueryParam = `${param}=manual`;
        }

        if (param === 'sortBy') {
            if (SEARCH_SORT_OPTIONS.find(e => e.code === value)) {
                sanitizedQueryParam = `sortBy=${value}`;
            }
        }

        if (param === 'ref') {
            try {
                if (regExObj.ref.test(decodeURIComponent(value))) {
                    sanitizedQueryParam = `ref=${value}`;
                }
            } catch (_e) {
                console.error('Error decodeURIComponent URL ref param!'); // eslint-disable-line
            }
        }

        if (param !== 'ptype' && param !== 'sortBy' && param !== 'ref') {
            if (regExObj[param].test(value)) {
                sanitizedQueryParam = `${param}=${value}`;
            }
        }
    }

    return sanitizedQueryParam;
};

// TODO: if we switch to export, server tests will break with SyntaxError: Unexpected token 'export'
// we need to configure server folder/env to accept export and export default syntax.
export {
    validateQueryParams,
    ALLOWED_FILTERS_SERVER,
    ALLOWED_FILTERS_BROWSER
};
