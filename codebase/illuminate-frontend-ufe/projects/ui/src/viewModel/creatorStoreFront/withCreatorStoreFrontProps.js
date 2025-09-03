import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Empty from 'constants/empty';
import CreatorStoreFrontActions from 'actions/CreatorStoreFrontActions';
import { creatorStoreFrontDataSelector } from 'selectors/creatorStoreFront/creatorStoreFrontDataSelector';
import { creatorProfileSelector } from 'selectors/creatorStoreFront/creatorProfile/creatorProfileSelector';
import { textResourcesSelector } from 'selectors/creatorStoreFront/textResourcesSelector';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

const { wrapHOC } = FrameworkUtils;

const menuItems = [CSF_PAGE_TYPES.FEATURED, CSF_PAGE_TYPES.PRODUCTS, CSF_PAGE_TYPES.COLLECTIONS, CSF_PAGE_TYPES.POSTS] || Empty.Array;

const formattedMenuItems = (pageType, textResources = {}, contentSummary = {}) => {
    return menuItems
        .filter(item => {
            const { collectionsCount = 0, postsCount = 0 } = contentSummary;

            switch (item) {
                case CSF_PAGE_TYPES.COLLECTIONS:
                    return collectionsCount > 0;
                case CSF_PAGE_TYPES.POSTS:
                    return postsCount > 0;
                default:
                    return true;
            }
        })
        .map(item => ({
            title: textResources[item] || item,
            link: item === CSF_PAGE_TYPES.FEATURED ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`,
            isActive: item === pageType
        }));
};

// Map state to props
const fields = createSelector(
    createStructuredSelector({
        textResources: textResourcesSelector,
        creatorStoreFrontData: creatorStoreFrontDataSelector,
        creatorProfileData: creatorProfileSelector
    }),
    ({ textResources, creatorStoreFrontData, creatorProfileData }) => {
        const pageTypeMappings = [
            {
                key: 'featuredPageData',
                dataFields: ['featuredSection', 'productSection']
            },
            {
                key: 'collectionsPageData',
                dataFields: ['collections', 'totalCollections']
            },
            {
                key: 'postsPageData',
                dataFields: ['posts', 'totalPosts']
            },
            {
                key: 'productsPageData',
                dataFields: ['title', 'totalProductCount', 'products']
            },
            {
                key: 'collectionPageData',
                dataFields: ['collectionContent']
            },
            {
                key: 'postPageData',
                dataFields: ['postContent']
            }
        ];

        let pageData = Empty.Object;

        for (const { key, dataFields } of pageTypeMappings) {
            const data = creatorStoreFrontData[key];

            if (data) {
                pageData = dataFields.reduce((acc, field) => {
                    if (field === 'featuredSection') {
                        const featuredSection = data[field] || Empty.Object;
                        const featuredItems = featuredSection?.featuredItems || Empty.Array;
                        const newFeaturedItems = featuredItems.length > 0 ? featuredItems : null;

                        featuredSection.featuredItems = newFeaturedItems;

                        acc[field] = featuredSection;
                    } else {
                        acc[field] = data[field];
                    }

                    return acc;
                }, {});

                break;
            }
        }

        const pageType = creatorStoreFrontData.pageType;
        const contentSummary = creatorProfileData ? creatorProfileData?.creatorProfile?.contentSummary : Empty.Object;

        return {
            textResources,
            formattedMenuItems: formattedMenuItems(pageType, textResources, contentSummary),
            creatorProfileData,
            creatorStoreFrontData,
            pageData
        };
    }
);

const functions = dispatch => ({
    dispatch,
    setPageData: CreatorStoreFrontActions.setPageData,
    fetchProductData: (handle, pageNum, params) => dispatch(CreatorStoreFrontActions.fetchMoreProductsData(handle, pageNum, params)),
    fetchCollectionProductsData: (collectionId, handle, pageNum) =>
        dispatch(CreatorStoreFrontActions.fetchCollectionMoreProductsData(collectionId, handle, pageNum)),
    initializeCSFPageData: (pageType, path) => dispatch(CreatorStoreFrontActions.initializeCSFPageData(pageType, path)),
    initializeCSFCreatorProfileData: () => dispatch(CreatorStoreFrontActions.initializeCSFCreatorProfileData())
});

const withCreatorStoreFrontProps = wrapHOC(connect(fields, functions));

export {
    withCreatorStoreFrontProps, fields, functions
};
