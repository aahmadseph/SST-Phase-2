import { createSelector } from 'reselect';
import { productSelector } from 'selectors/page/product/productSelector';

const productCategoriesArraySelector = createSelector(productSelector, productPage => {
    const getCategory = root => {
        const result = [];

        if (root?.parentCategory) {
            result.push(root.parentCategory.displayName);

            if (root.parentCategory.parentCategory) {
                result.push(...getCategory(root.parentCategory));
            }
        }

        return result;
    };

    return getCategory(productPage).reverse();
});

export { productCategoriesArraySelector };
