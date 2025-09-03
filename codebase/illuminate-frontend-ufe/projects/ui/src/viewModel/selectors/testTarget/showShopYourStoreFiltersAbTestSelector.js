import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const offerSelector = createSelector(testTargetOffersSelector, offers => offers.shopYourStoreFilters || Empty.Object);
const showSelector = createSelector(offerSelector, shopYourStoreFilters => !!shopYourStoreFilters.show);
const showShopYourStoreFiltersAbTestSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showShopYourStoreFiltersAbTestSelector };
