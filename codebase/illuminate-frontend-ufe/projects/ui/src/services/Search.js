import historyLocationActions from 'actions/framework/HistoryLocationActions';
import Services from 'utils/Services';
import InflatorComps from 'utils/framework/InflateComponents';
import Events from 'utils/framework/Events';
import store from 'store/Store';
import UtilActions from 'utils/redux/Actions';
import SearchActions from 'actions/SearchActions';

const { setSearchData } = SearchActions;
const { shouldServiceRun } = Services;

export default (function () {
    // Stop service from loading if not necessary
    if (!shouldServiceRun.search()) {
        return;
    }

    Events.onLastLoadEvent(window, [Events.SearchInfoLoaded], function () {
        const searchInfo = InflatorComps.services.SearchInfo.data;

        if (searchInfo) {
            // If 'originalKeyword' is in API response, the user misspelled
            // a keyword. The 'keyword' key is the originalKeyword corrected
            // for spelling. API doc: https://jira.sephora.com/wiki/x/4bEnBw
            if (searchInfo.originalKeyword) {
                store.dispatch(
                    historyLocationActions.replaceLocation({
                        path: location.pathname,
                        queryParams: { keyword: encodeURIComponent(searchInfo.keyword) },
                        anchor: location.hash
                    })
                );
            }

            const isJerrySearch = Sephora.renderedData.catOrMouse === 'mouse';

            if (isJerrySearch) {
                const { currentPage } = Sephora.Util.getQueryStringParams();
                store.dispatch(setSearchData(searchInfo, { currentPage: Number(currentPage?.[0] || 1) }));
            } else {
                store.dispatch(UtilActions.merge('catalog', 'catalogData', searchInfo));
            }

            window.dispatchEvent(new CustomEvent(Events.SearchInfoReady, { detail: {} }));
        }
    });
}());
