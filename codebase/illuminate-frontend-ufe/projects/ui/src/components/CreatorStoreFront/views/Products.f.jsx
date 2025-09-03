import React from 'react';
import { useSelector } from 'react-redux';
import framework from 'utils/framework';
import CSFProductGridBase from 'components/CreatorStoreFront/CSFProductGrid/CSFProductGrid';
import { withUpperFunnelProps } from 'viewModel/catalog/upperFunnel/withUpperFunnelProps';
import { getProductPageViewModelSelector } from 'selectors/creatorStoreFront/productPageDataSelector';
import { Box } from 'components/ui';
import { useCSFPageLoadAnalytics } from 'components/CreatorStoreFront/helpers/csfEventHelpers';

const { wrapFunctionalComponent } = framework;
const CSFProductGrid = withUpperFunnelProps(CSFProductGridBase);

const Products = props => {
    const { fetchProductData, handle, creatorProfileData } = props;

    const {
        products, contextId, textResources, pageType, totalProductCount
    } = useSelector(getProductPageViewModelSelector);

    useCSFPageLoadAnalytics({ creatorProfileData, pageType });

    return (
        <Box marginTop={[4, null, 5]}>
            <CSFProductGrid
                products={products}
                contextId={contextId}
                source='search'
                setResultsCount={() => {}}
                textResources={textResources}
                pageType={pageType}
                handle={handle}
                totalProductCount={totalProductCount}
                fetchProductData={fetchProductData}
                creatorProfileData={creatorProfileData}
            />
        </Box>
    );
};

export default wrapFunctionalComponent(Products, 'Products');
