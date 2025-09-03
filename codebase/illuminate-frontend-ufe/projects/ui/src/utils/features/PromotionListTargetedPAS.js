import getPASData from 'services/api/sdn/getPASData';
import store from 'store/Store';
import { SET_DYNAMIC_COMPONENTS_DATA } from 'constants/actionTypes/dynamicComponent';
import userUtils from 'utils/User';
import { UserInfoReady } from 'constants/events';

class Feature {
    // eslint-disable-next-line class-methods-use-this
    execute(_components) {}
}

class PromotionListTargetedPAS extends Feature {
    // eslint-disable-next-line class-methods-use-this
    execute(components) {
        if (userUtils.isAnonymous()) {
            return;
        }

        const stateData = {};
        components.forEach(component => {
            stateData[component.sid] = {
                featuresInProgress: ['PromotionList_Targeted_PAS'],
                data: {}
            };
        });

        store.dispatch({
            type: SET_DYNAMIC_COMPONENTS_DATA,
            payload: stateData
        });

        const contextIds = components.map(component => component.sys?.id).filter(Boolean);

        // Get dynamic endpoint URL from featuresDataCollection - required, no fallback
        const firstComponent = components[0];
        let apiEndpoint = null;

        if (firstComponent?.featuresDataCollection?.items) {
            const pasFeatureData = firstComponent.featuresDataCollection.items.find(item => item.key === 'PromotionListTargetedPAS');

            if (pasFeatureData?.value) {
                apiEndpoint = pasFeatureData.value;
            }
        }

        // Only call API if we have a valid endpoint
        if (!apiEndpoint) {
            return;
        }

        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            getPASData(contextIds, apiEndpoint)
                .then(response => {
                    const updatedStateData = {};
                    components.forEach(component => {
                        const componentSid = component.sid;

                        if (componentSid) {
                            let pasData = [];

                            if (response?.data?.aggregateContent?.data) {
                                const aggregateData = response.data.aggregateContent.data;
                                const matchingComponent = aggregateData.find(item => item.sid === componentSid);

                                if (matchingComponent && matchingComponent.items) {
                                    pasData = matchingComponent.items;
                                }
                            }

                            const dynamicComponent = {
                                ...component,
                                items: pasData || []
                            };

                            updatedStateData[componentSid] = {
                                featuresInProgress: [],
                                data: dynamicComponent
                            };
                        }
                    });

                    store.dispatch({
                        type: SET_DYNAMIC_COMPONENTS_DATA,
                        payload: updatedStateData
                    });
                })
                .catch(error => {
                    // eslint-disable-next-line no-console
                    console.error('Error fetching PAS data:', error);

                    const errorStateData = {};

                    components.forEach(component => {
                        const componentSid = component.sid;

                        if (componentSid) {
                            const dynamicComponent = {
                                ...component,
                                items: []
                            };

                            errorStateData[componentSid] = {
                                featuresInProgress: [],
                                data: dynamicComponent
                            };
                        }
                    });

                    store.dispatch({
                        type: SET_DYNAMIC_COMPONENTS_DATA,
                        payload: errorStateData
                    });
                });
        });
    }
}

export default PromotionListTargetedPAS;
