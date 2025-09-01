import catalogUtils from 'utils/Search';

/**
 * Retrieves the brand info from the categories array in the
 * in the component state using the node as search parameter.
 *
 * @param  {integer} node - The node number
 * @param  {array} categories - The categories in the state
 */

// TODO: Research if we can add the categories in the store so that we
// don't have to pass the categories object as a parameter,
// also we need to call this function in the setCategory catalog action,
// and the categories object is not available there.
function getCatalogInfoById(node, categories, source) {
    const param = source?.toLowerCase() === 'nlp' ? 'nodeStr' : 'node';
    const brandInfo = catalogUtils.getCatalogInfoFromCategories(categories, {
        parameter: param,
        value: node
    });

    return new Promise(resolve => {
        resolve(brandInfo);
    });
}

export default {
    getCatalogInfoById,
    PRODUCT_DATA_ENGINE: 'Endeca'
};
