/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box } from 'components/ui';
import ComponentList from 'components/Content/ComponentList';
import contentConstants from 'constants/content';
import BeautyInsiderModules from 'components/Content/BeautyInsider/BeautyInsiderModules';
import ProfileBanner from 'components/ProfileBanner';
import BeautyInsiderSummary from 'components/Content/BeautyInsider/BeautyInsiderSummary';
import beautyInsiderPageBindings from 'analytics/bindingMethods/pages/beautyInsider/beautyInsiderPageBindings';

const { CONTEXTS } = contentConstants;

class BeautyInsider extends BaseClass {
    componentDidMount() {
        const { fetchBeautyOffers } = this.props;
        const { country, language } = Sephora.renderQueryParams;

        fetchBeautyOffers(country, language);
    }

    componentDidUpdate(prevProps) {
        const {
            fetchClientSummary, fetchRecentlyRedeemedRewards, getAccountHistorySlice, user, isAtLeastRecognized, fetchBiRewards
        } = this.props;

        if (user.profileId !== prevProps.user.profileId) {
            fetchClientSummary(user.profileId, true);
            fetchRecentlyRedeemedRewards(user.profileId);
            getAccountHistorySlice(user.profileId);
        }

        const defaultSADataChanged =
            user.defaultSACountryCode !== prevProps.user.defaultSACountryCode || user.defaultSAZipCode !== prevProps.user.defaultSAZipCode;

        if (defaultSADataChanged) {
            fetchBiRewards();
        }

        if (user.isInitialized && prevProps.user.isInitialized !== user.isInitialized) {
            beautyInsiderPageBindings.setPageLoadAnalytics(isAtLeastRecognized);
        }
    }

    hardCodedModules = () => {
        return (
            <>
                <BeautyInsiderModules user={this.props.user} />
            </>
        );
    };

    renderContentZone = content => {
        return (
            <ComponentList
                enablePageRenderTracking={true}
                trackingCount={1}
                context={CONTEXTS.CONTAINER}
                removeLastItemMargin={true}
                removeFirstItemMargin={true}
                items={content}
            />
        );
    };

    signedInUserSection = (topContent, bottomContent) => {
        return (
            <Box marginTop={5}>
                <BeautyInsiderSummary />
                <Box marginTop={[6, 7]}>{this.renderContentZone(topContent)}</Box>
                <Box>{this.hardCodedModules()}</Box>
                <Box marginTop={[6, 7]}>{this.renderContentZone(bottomContent)}</Box>
            </Box>
        );
    };

    notSignedInUserSection = bottomContent => {
        return <Box marginTop={[6, 7]}>{this.renderContentZone(bottomContent)}</Box>;
    };

    render() {
        const { userIsInitialized, isAtLeastRecognized, content } = this.props;

        return (
            <>
                <ProfileBanner origin='beautyInsider' />
                {!userIsInitialized
                    ? null
                    : isAtLeastRecognized
                        ? this.signedInUserSection(content.topContent, content.bottomContent)
                        : this.notSignedInUserSection(content.bottomContent)}
            </>
        );
    }
}

export default wrapComponent(BeautyInsider, 'BeautyInsider');
