import {
    SET_DYNAMIC_COMPONENTS_DATA
} from 'constants/actionTypes/dynamicComponent';
import PromotionListTargetedPAS from 'utils/features/PromotionListTargetedPAS';

const dynamicComponentsFeatures = {
    'PromotionList_Targeted_PAS': PromotionListTargetedPAS
};

const setDynamicComponentsData = (data) => ({
    type: SET_DYNAMIC_COMPONENTS_DATA,
    payload: data
});

function getRecognizedFeaturesWithTheirComponents(components) {
    const featuresMap = new Map();

    components.forEach((component) => {
        if (component.features && Array.isArray(component.features)) {
            component.features.forEach((feature) => {
                const featureType = feature.handlerType;

                if (dynamicComponentsFeatures[featureType]) {
                    if (!featuresMap.has(featureType)) {
                        featuresMap.set(featureType, {
                            feature: dynamicComponentsFeatures[featureType],
                            components: []
                        });
                    }

                    featuresMap.get(featureType).components.push(component);
                }
            });
        }
    });

    return Array.from(featuresMap.values());
}

const processDynamicComponents = (components) => {
    const recognizedFeaturesWithComponents = getRecognizedFeaturesWithTheirComponents(components);

    recognizedFeaturesWithComponents.forEach((featureGroup) => {
        try {
            const FeatureClass = featureGroup.feature;
            const feature = new FeatureClass();
            feature.execute(featureGroup.components);
        } catch (error) {
            Sephora.logger.verbose('Error executing dynamic component feature: ', error);
        }
    });
};

export default {
    processDynamicComponents,
    setDynamicComponentsData
};
