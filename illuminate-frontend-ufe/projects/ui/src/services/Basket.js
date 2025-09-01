import store from 'store/Store';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import { BasketInfoLoaded, HydrationFinished, AuthTokenReceived } from 'constants/events';
import RCPSCookies from 'utils/RCPSCookies';
import Events from 'utils/framework/Events';
import InflatorComps from 'utils/framework/InflateComponents';
import Location from 'utils/Location';

export default (function () {
    Events.onLastLoadEvent(window, [BasketInfoLoaded], function () {
        const basket = InflatorComps.services.BasketInfo.data;

        store.dispatch(RwdBasketActions.updateBasket({ newBasket: basket }));
    });

    // make a call to get basket data if we are not on a basket page and rcps_full_profile_group cookie is true
    if (!Location.isBasketPage() && RCPSCookies.isRCPSFullProfileGroup()) {
        Events.onLastLoadEvent(window, [HydrationFinished], function () {
            if (Sephora.Util.RefreshToken.isAccessTokenValid()) {
                Sephora.Util.getBasketData();
            } else {
                window.addEventListener(AuthTokenReceived, Sephora.Util.getBasketData);
            }
        });
    }

    return null;
}());
