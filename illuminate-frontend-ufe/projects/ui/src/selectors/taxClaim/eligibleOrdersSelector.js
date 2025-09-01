import { createSelector } from 'reselect';
import Empty from 'constants/empty';

const mainStateSelector = state => state.page?.taxClaim || Empty.Object;

const eligibleOrdersSelector = createSelector(mainStateSelector, taxClaim => ({
    eligibleOrders: taxClaim.eligibleOrders,
    eligibleOrdersError: taxClaim.eligibleOrdersError
}));

export { eligibleOrdersSelector };
