import InflatorComps from 'utils/framework/InflateComponents';
import store from 'store/Store';
import ProductActions from 'actions/ProductActions';
import framework from 'utils/framework';
import {
    ProductInfo, EventType, ProductInfoLoaded, HydrationFinished
} from 'constants/events';

const { Application } = framework;

const initialize = () => {
    /* ProductInfo Service */
    Application.events.onLastLoadEvent(window, [HydrationFinished, ProductInfoLoaded], () => {
        const productInfo = InflatorComps.services.ProductInfo;
        const productData = productInfo.data;

        store.dispatch(ProductActions.updateCurrentUserSpecificProduct({ ...productData }));

        Application.events.dispatchServiceEvent(ProductInfo, EventType.Ready);
        Application.events.dispatchServiceEvent(ProductInfo, EventType.ServiceCtrlrsApplied, true);
    });

    return null;
};

export { initialize };
