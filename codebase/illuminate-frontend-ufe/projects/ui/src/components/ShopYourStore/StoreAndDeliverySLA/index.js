import StoreAndDeliverySLA from 'components/ShopYourStore/StoreAndDeliverySLA/StoreAndDeliverySLA';
import { withStoreAndDeliverySLAProps } from 'components/ShopYourStore/StoreAndDeliverySLA/withStoreAndDeliverySLAProps';
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';

import { HydrationFinished, UserInfoLoaded } from 'constants/events';

export default withAfterEventsRendering(withStoreAndDeliverySLAProps(StoreAndDeliverySLA), [HydrationFinished, UserInfoLoaded]);
