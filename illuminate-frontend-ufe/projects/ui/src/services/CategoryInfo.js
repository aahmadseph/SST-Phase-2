import store from 'Store';
import watch from 'redux-watch';

let categoryInfoByCategoryIdMap;

const categoriesWatcher = watch(store.getState, 'category.categories');

function createCategoryInfoByCategoryIdMap(categoryLevel, level = 0) {
    const result = {};

    for (const category of categoryLevel) {
        const categoryId = category.categoryId;
        const seoCanonicalUrl = category.content && category.content.seoCanonicalUrl;
        const targetUrl = category.targetUrl;
        const displayName = category.displayName;
        const dataEntity = {
            seoCanonicalUrl,
            targetUrl,
            level,
            displayName
        };

        result[categoryId] = dataEntity;

        // childCategories might be outdated. We def have subCategories as for now,
        // but I left childCategories as a top priority for backwards compatibility
        const nestedCategories = category.childCategories || category.subCategories;

        if (nestedCategories) {
            Object.assign(result, createCategoryInfoByCategoryIdMap(nestedCategories, level + 1));
        }
    }

    return result;
}

function getCategoryIdMap(categoriesOverride) {
    return new Promise(resolve => {
        if (!categoryInfoByCategoryIdMap) {
            const categories = categoriesOverride || store.getState().category.categories;

            if (categories) {
                categoryInfoByCategoryIdMap = createCategoryInfoByCategoryIdMap(categories);
                resolve(categoryInfoByCategoryIdMap);
            } else {
                const unsubscribe = store.subscribe(
                    categoriesWatcher(categoriesList => {
                        unsubscribe();
                        categoryInfoByCategoryIdMap = createCategoryInfoByCategoryIdMap(categoriesList);
                        resolve(categoryInfoByCategoryIdMap);
                    }),
                    { ignoreAutoUnsubscribe: true }
                );
            }
        } else {
            resolve(categoryInfoByCategoryIdMap);
        }
    });
}

function getCategoryInfoByCategoryId(categoryId, categories) {
    return getCategoryIdMap(categories).then(map => {
        let promise;

        if (map[categoryId]) {
            promise = Promise.resolve(Object.assign(map[categoryId], { categoryId }));
        } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            promise = Promise.reject({ errMessage: `no category info for categoryId ${categoryId}` });
        }

        return promise;
    });
}

export default {
    getCategoryInfoByCategoryId,
    getCatalogInfoById: getCategoryInfoByCategoryId,
    PRODUCT_DATA_ENGINE: 'Endeca'
};
