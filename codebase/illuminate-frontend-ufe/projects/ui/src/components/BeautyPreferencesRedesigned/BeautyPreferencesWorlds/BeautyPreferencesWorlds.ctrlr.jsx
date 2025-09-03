import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Divider } from 'components/ui';
import RefinementWorldLink from 'components/BeautyPreferencesRedesigned/RefinementWorldLink/RefinementWorldLink';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';
import deepEqual from 'deep-equal';
import RecommendationsCarousel from 'components/RecommendationsCarousel/RecommendationsCarousel';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/BeautyPreferencesRedesigned/locales', 'BeautyPreferencesRedesigned');

class BeautyPreferencesWorlds extends BaseClass {
    constructor(props) {
        super(props);
    }

    fetchProductRecommendations() {
        if (Array.isArray(this.props.refinementWorlds) && this.props.customerPreference) {
            this.props.refinementWorlds.forEach(world => {
                const payload = {
                    worldKey: world.key?.toLowerCase(),
                    numResults: 10
                };

                const preFilterExpression = bpRedesignedUtils.mapBeautyPreferencesToRecsServiceValues(
                    this.props.customerPreference[world.key],
                    world.key
                );
                this.props.fetchRecommendations({ ...payload, preFilterExpression });
            });
        }
    }

    componentDidMount() {
        if (this.props.customerPreference) {
            this.fetchProductRecommendations();
        }
    }

    componentDidUpdate(prevProps) {
        if (!deepEqual(prevProps.customerPreference, this.props.customerPreference)) {
            this.fetchProductRecommendations();
        }
    }

    render() {
        const { refinementWorlds, onWorldClick, recommendations, isAnonymous } = this.props;

        if (!Array.isArray(refinementWorlds)) {
            return null;
        }

        return (
            <>
                <Divider marginBottom={4} />
                {refinementWorlds.map(world => {
                    const { refinementsCount, completedRefinementsCount } = bpRedesignedUtils.beautyPreferencesWorldProgress(world);
                    const currentPodId = `beautypreferences-${world?.key?.toLowerCase()}`;
                    const productRecommendations = recommendations[currentPodId];
                    const isAtLeastOneAnsweredForWorld = bpRedesignedUtils.isAtLeastOneAnsweredForWorld(this.props?.customerPreference, world?.key);
                    const shouldDisplayWorldCarousel =
                        isAtLeastOneAnsweredForWorld && !isAnonymous && productRecommendations?.recommendations?.length > 0;

                    return (
                        <>
                            <RefinementWorldLink
                                key={world.key}
                                worldName={world.value}
                                worldKey={world.key}
                                totalRefinements={refinementsCount}
                                completedRefinements={completedRefinementsCount}
                                onWorldClick={onWorldClick}
                            />
                            {shouldDisplayWorldCarousel && (
                                <RecommendationsCarousel
                                    worldKey={world?.key}
                                    subtitle={getText('bpRedesignSubtitle', [world?.key?.toLowerCase()])}
                                    marginTop={0}
                                    marginBottom={0}
                                    recommendations={productRecommendations}
                                />
                            )}
                            <Divider marginY={4} />
                        </>
                    );
                })}
            </>
        );
    }
}

BeautyPreferencesWorlds.propTypes = {
    refinementWorlds: PropTypes.array,
    onWorldClick: PropTypes.func,
    customerPreference: PropTypes.object
};

export default wrapComponent(BeautyPreferencesWorlds, 'BeautyPreferencesWorlds', true);
