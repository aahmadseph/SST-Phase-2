import { createSelector } from 'reselect';
import { creatorStoreFrontDataSelector } from 'selectors/creatorStoreFront/creatorStoreFrontDataSelector';
import { textResourcesSelector } from 'selectors/creatorStoreFront/textResourcesSelector';
import Empty from 'constants/empty';

/**
 * Factory selector for individual collection.
 */
export const getCollectionByIdSelector = collectionId =>
    createSelector(creatorStoreFrontDataSelector, data => {
        const collectionPageData = data.collectionPageData ?? Empty.Object;
        const collectionData = collectionPageData.collectionContent ?? Empty.Object;

        return collectionData.collectionId === collectionId ? collectionData : Empty.Object;
    });

/**
 *  Selector combining collection data and text resources for a single collection.
 */
export const getSingleCollectionPageSelector = createSelector(creatorStoreFrontDataSelector, textResourcesSelector, (data, textResources) => {
    const collectionPageData = data.collectionPageData ?? Empty.Object;
    const collectionContent = collectionPageData.collectionContent ?? Empty.Object;
    const products = collectionPageData.products ?? Empty.Array;
    const creatorProfile = collectionPageData.creatorProfile ?? Empty.Object;
    const creatorFirstName = creatorProfile.firstName ?? Empty.String;
    const moreFromCreatorContent = collectionPageData.moreFromCreatorContent ?? Empty.Array;

    return {
        creatorFirstName,
        collectionPageData,
        collectionContent,
        products,
        moreFromCreatorContent,
        pageType: data.pageType ?? Empty.String,
        textResources: textResources ?? Empty.Object
    };
});
