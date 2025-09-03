import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import upperFunnelCore from 'components/Catalog/UpperFunnel/upperFunnelCore';

import preferredStoreSelector from 'selectors/user/preferredStoreSelector';
import { userSelector } from 'selectors/user/userSelector';
import { deliveryOptionsSelector } from 'viewModel/selectors/deliveryOptions/deliveryOptionsSelector';
import { showEddOnBrowseAndSearchSelector } from 'viewModel/selectors/testTarget/showEddOnBrowseAndSearchSelector';
import { showNthCategoryChicletsInFilterSelector } from 'viewModel/selectors/testTarget/showNthCategoryChicletsInFilterSelector';

import userActions from 'actions/UserActions';

const { wrapHOC, wrapHOCComponent } = FrameworkUtils;
const { enhanceValues, updateFiltersModalState, upperFunnelQueue } = upperFunnelCore;

function withUpperFunnel(WrappedComponent) {
    const UpperFunnelProps = props => {
        const {
            // eslint-disable-next-line no-unused-vars
            dispatch,
            user,
            preferredStore,
            deliveryOptions,
            clearUpperFunnelDraft,
            ...restProps
        } = props;

        if (Sephora.isNodeRender) {
            return <WrappedComponent {...restProps} />;
        }

        const data = restProps.refinements;
        let clearFiltersSelectionAndDraftStore;

        if (restProps.clearFiltersSelection) {
            clearFiltersSelectionAndDraftStore = (applyFilters, resetSortToDefault) => {
                restProps.clearFiltersSelection(applyFilters, resetSortToDefault);
                clearUpperFunnelDraft();
            };
        }

        const enhancedValues = enhanceValues(data, props);
        const newProps = {
            ...restProps,
            refinements: enhancedValues,
            updateFiltersModalState,
            upperFunnelQueue,
            ...(clearFiltersSelectionAndDraftStore && {
                clearFiltersSelection: clearFiltersSelectionAndDraftStore
            })
        };

        return <WrappedComponent {...newProps} />;
    };

    return wrapHOCComponent(UpperFunnelProps, 'UpperFunnelProps', arguments);
}

const withUpperFunnelProps = compose(
    wrapHOC(
        connect(
            createStructuredSelector({
                preferredStore: preferredStoreSelector,
                user: userSelector,
                deliveryOptions: deliveryOptionsSelector,
                showEddOnBrowseAndSearch: showEddOnBrowseAndSearchSelector,
                showNthCategoryChicletsInFilter: showNthCategoryChicletsInFilterSelector
            }),
            {
                clearUpperFunnelDraft: userActions.clearUpperFunnelDraft
            }
        )
    ),
    wrapHOC(withUpperFunnel)
);

export { withUpperFunnelProps };
