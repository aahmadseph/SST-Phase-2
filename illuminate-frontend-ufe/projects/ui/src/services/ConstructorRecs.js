/* eslint-disable no-console */
/* eslint-disable camelcase */
import store from 'store/Store';
import watch from 'redux-watch';
import ConstructorRecsUtils from 'utils/ConstructorRecs';
import ConstructorRecsActions from 'actions/ConstructorRecsActions';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';

const { getConstructorRecommendations, transformConstructorResponseForCarousel, getConstructorCollections } = ConstructorRecsUtils;
const { updateConstructorRecommendations, setLoading } = ConstructorRecsActions;

function fetchConstructorCollections(data) {
    const { podId, params } = data;
    store.dispatch(setLoading({ podId, isLoading: true }));
    getConstructorCollections(podId, params)
        .then(res => {
            if (res?.response) {
                const { collection, results, total_num_results } = res.response;

                if (results && results.length > 0) {
                    const items = transformConstructorResponseForCarousel(results);
                    store.dispatch(
                        updateConstructorRecommendations({
                            podId: collection.id,
                            constructorTitle: collection.display_name,
                            constructorRecommendations: items,
                            totalResults: total_num_results,
                            resultId: res.result_id
                        })
                    );
                } else {
                    store.dispatch(
                        updateConstructorRecommendations({
                            podId: collection.id,
                            constructorTitle: collection.display_name,
                            constructorRecommendations: [],
                            isEmpty: true
                        })
                    );
                }
            }

            store.dispatch(setLoading({ podId, isLoading: false }));
        })
        .catch(() => {
            store.dispatch(updateConstructorRecommendations({ podId, constructorRecommendations: [], isError: true }));
            store.dispatch(setLoading({ podId, isLoading: false }));
        });
}

function fetchConstructorRecommendations(data) {
    const { podId, params } = data;
    store.dispatch(setLoading({ podId, isLoading: true }));
    getConstructorRecommendations(podId, params)
        .then(res => {
            if (res?.response) {
                const { pod, results, total_num_results } = res.response;

                if (results && results.length > 0) {
                    const items = [];

                    if (podId === CONSTRUCTOR_PODS.TRENDING_SEARCHES || podId === CONSTRUCTOR_PODS.TRENDING_CATEGORIES) {
                        items.push(...results);
                    } else {
                        items.push(...transformConstructorResponseForCarousel(results, pod));
                    }

                    store.dispatch(
                        updateConstructorRecommendations({
                            podId,
                            constructorTitle: pod.display_name,
                            constructorRecommendations: items,
                            totalResults: total_num_results,
                            resultId: res.result_id
                        })
                    );
                } else {
                    store.dispatch(
                        updateConstructorRecommendations({
                            podId,
                            constructorTitle: pod.display_name,
                            constructorRecommendations: [],
                            isEmpty: true
                        })
                    );
                }
            }

            store.dispatch(setLoading({ podId, isLoading: false }));
        })
        .catch(() => {
            store.dispatch(updateConstructorRecommendations({ podId, constructorRecommendations: [], isError: true }));
            store.dispatch(setLoading({ podId, isLoading: false }));
        });
}

function initialize() {
    const currentProductWatcher = watch(store.getState, 'constructorRecommendations.constructorRequestData');
    store.subscribe(
        currentProductWatcher(data => {
            if (window.ConstructorioClient) {
                if (!global.constructorio && window.ConstructorioTracker?.options) {
                    const { queryParams } = window.ConstructorioTracker.options;
                    const setRecommendationsClientOptions = {
                        apiKey: queryParams.autocomplete_key,
                        sessionId: queryParams.s,
                        userId: queryParams.ui,
                        serviceUrl: `https://${Sephora.configurationSettings?.constructorServiceUrl}`
                    };
                    global.constructorio = new window.ConstructorioClient(setRecommendationsClientOptions);
                }

                data.isCollection ? fetchConstructorCollections(data) : fetchConstructorRecommendations(data);
            }
        }),
        { ignoreAutoUnsubscribe: true }
    );
}

export { initialize };
