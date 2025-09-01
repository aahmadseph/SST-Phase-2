import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import AutoReplenishmentActions from 'actions/AutoReplenishmentActions';
import { hasAutoReplenishmentSubscriptionsSelector } from 'viewModel/selectors/user/hasAutoReplenishmentSubscriptionsSelector';

const fields = createSelector(hasAutoReplenishmentSubscriptionsSelector, hasAutoReplenishmentSubscriptions => {
    const shouldRenderEmptyHub = Sephora.configurationSettings.isAutoReplenishEmptyHubEnabled && !hasAutoReplenishmentSubscriptions;

    return {
        shouldRenderEmptyHub
    };
});

const functions = {
    loadContentfulContent: AutoReplenishmentActions.loadContentfulContent
};

const withAutoReplenishmentPageContentProps = connect(fields, functions);

export {
    fields, functions, withAutoReplenishmentPageContentProps
};
