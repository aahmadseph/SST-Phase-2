import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';

const offerSelector = createSelector(testTargetOffersSelector, offers => offers.shopYourStore || Empty.Object);
const showSelector = createSelector(offerSelector, shopYourStore => !!shopYourStore.show);
const showShopYourStoreAbTestSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showShopYourStoreAbTestSelector };
