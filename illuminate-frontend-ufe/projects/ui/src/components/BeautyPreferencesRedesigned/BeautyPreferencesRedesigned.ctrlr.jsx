/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import { Container } from 'components/ui';
import BaseClass from 'components/BaseClass';
import BeautyPreferencesHeader from 'components/BeautyPreferencesRedesigned/Header';
import BeautyPreferencesWorlds from 'components/BeautyPreferencesRedesigned/BeautyPreferencesWorlds/BeautyPreferencesWorlds';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned';
import Location from 'utils/Location';

class BeautyPreferencesRedesigned extends BaseClass {
    state = {
        refinementWorlds: []
    };

    componentDidMount() {
        this.loadRefinements();
        bpRedesignedUtils.executeWhenMasterListLoaded(() => {
            this.loadRefinements();
        });
    }

    componentDidUpdate() {}

    onWorldClick = e => {
        const href = e?.currentTarget?.getAttribute('href');

        if (href) {
            Location.navigateTo(e, href);
        }
    };

    loadRefinements = () => {
        const refinementWorlds = bpRedesignedUtils.getMasterListRefinementWorldsOrderedById();
        this.setState({
            refinementWorlds
        });
    };

    render() {
        return (
            <Container>
                <BeautyPreferencesHeader />
                {this.state.refinementWorlds.length && (
                    <BeautyPreferencesWorlds
                        refinementWorlds={this.state.refinementWorlds}
                        onWorldClick={this.onWorldClick}
                        customerPreference={this.props.customerPreference}
                        recommendations={this.props.recommendations}
                        isAnonymous={this.props.isAnonymous}
                        fetchRecommendations={this.props.fetchRecommendations}
                        biAccount={this.props.biAccount}
                    />
                )}
            </Container>
        );
    }
}

export default wrapComponent(BeautyPreferencesRedesigned, 'BeautyPreferencesRedesigned', true);
