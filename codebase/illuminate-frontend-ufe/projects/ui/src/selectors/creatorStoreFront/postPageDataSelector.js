import { createSelector } from 'reselect';
import { creatorStoreFrontDataSelector } from 'selectors/creatorStoreFront/creatorStoreFrontDataSelector';
import { textResourcesSelector } from 'selectors/creatorStoreFront/textResourcesSelector';
import Empty from 'constants/empty';

/**
 *  Selector combining post data and text resources for a single post.
 */
export const getPostDetailsPageSelector = createSelector(creatorStoreFrontDataSelector, textResourcesSelector, (data, textResources) => {
    const postPageData = data.postPageData ?? Empty.Object;
    const creatorProfile = postPageData.creatorProfile ?? Empty.Object;
    const creatorFirstName = creatorProfile.firstName ?? Empty.String;
    const postContent = postPageData.postContent ?? Empty.Object;
    const products = postPageData.products ?? Empty.Array;
    const moreFromCreatorContent = postPageData.moreFromCreatorContent ?? Empty.Array;

    return {
        creatorFirstName,
        postContent,
        products,
        moreFromCreatorContent,
        pageType: data.pageType ?? Empty.String,
        textResources: textResources ?? Empty.Object
    };
});
