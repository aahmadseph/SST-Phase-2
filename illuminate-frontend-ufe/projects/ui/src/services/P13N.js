import Events from 'utils/framework/Events';
import framework from 'utils/framework';
import { EventType, P13NData } from 'constants/events';
import InflatorComps from 'utils/framework/InflateComponents';
import store from 'store/Store';
import homepageActions from 'actions/HomepageActions';

const { Application } = framework;

export default (function () {
    Events.onLastLoadEvent(window, [Events.P13NDataLoaded, Events.HydrationFinished], function () {
        const p13nData = InflatorComps.services.p13nData.data;
        const previewCookie = InflatorComps.services.previewCookie;

        if (previewCookie) {
            store.dispatch(homepageActions.setP13NDataForPreview(p13nData));
        } else if (p13nData) {
            store.dispatch(homepageActions.setP13NData(p13nData));
            store.dispatch(homepageActions.setP13NInitialization(true));
        } else {
            store.dispatch(homepageActions.setP13NInitialization(true));
        }
    });

    Application.events.dispatchServiceEvent(P13NData, EventType.Ready);
}());
