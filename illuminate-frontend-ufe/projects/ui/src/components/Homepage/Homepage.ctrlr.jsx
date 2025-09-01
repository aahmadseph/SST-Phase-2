/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Container } from 'components/ui';
import ComponentList from 'components/Content/ComponentList';
import ChicletNav from 'components/Homepage/ChicletNav';
import ChicletNavExtended from 'components/Homepage/ChicletNavExtended';
import MediaUtils from 'utils/Media';
import SignInBanner from 'components/Homepage/SignInBanner';
import ContentConstants from 'constants/content';
import { screenReaderOnlyStyle } from 'style/config';
import p13nUtils from 'utils/localStorage/P13n';
import Location from 'utils/Location';
import SkeletonBanner from 'components/Banner/SkeletonBanner/SkeletonBanner';

const { Media } = MediaUtils;
const { CONTEXTS } = ContentConstants;

class Homepage extends BaseClass {
    componentDidMount() {
        const cachedPersonalizationData = p13nUtils.getAllPersonalizedCache();

        if (cachedPersonalizationData) {
            this.props.setPersonalizationAnalyticsData(cachedPersonalizationData);
        }

        this.props.setPageLoadAnalytics();
        // Temporarily show consumer privacy modal on home page load if requested
        // Should be eliminated (the whole commit) when/if apps implement their logic internally

        if (this.props.showCCPADialog && !this.props.userAccountClosed) {
            this.props.showConsumerPrivacyModal({ isOpen: true });
        }

        if (this.props.userAccountClosed) {
            this.props.showCloseAccountSuccessfulModal(
                this.props.showCCPADialog ? () => this.props.showConsumerPrivacyModal({ isOpen: true }) : null
            );
        }
    }

    componentDidUpdate(prevProps) {
        const p13nAnalyticsData = digitalData.page.attributes.p13nAnalyticsData;

        if (prevProps.p13n !== this.props.p13n && this.props.p13n.headData && !p13nAnalyticsData) {
            this.props.setPersonalizationAnalyticsData(this.props.p13n.headData);
        }
    }

    componentWillUnmount() {
        this.props.setP13NInitialization(false);
    }

    isInitializedAndNoData() {
        const { items, p13n } = this.props;

        return p13n.isInitialized && !items.length;
    }

    getDynamicTrackingCount() {
        const { items } = this.props;

        // Find the position of the BannerList (carousel) component
        const bannerListIndex = items.findIndex(item => item.type === 'BannerList');

        // If BannerList is found, return its position + 1 (to include it in tracking)
        // If not found, default to 1 (original behavior)
        return bannerListIndex >= 0 ? bannerListIndex + 1 : 1;
    }

    render() {
        const {
            items, headerText, seoJSON, schemas, p13n
        } = this.props;

        // Calculate dynamic tracking count based on BannerList position
        const dynamicTrackingCount = this.getDynamicTrackingCount();

        return (
            <>
                <h1
                    css={screenReaderOnlyStyle}
                    tabIndex='-1'
                >
                    {headerText}
                </h1>
                <Media at='xs'>
                    <SignInBanner />
                </Media>
                <Media lessThan='md'>
                    {!p13n.isInitialized && !p13n.headData ? <SkeletonBanner /> : Location.isHomepage() && !!items.length && <ChicletNav />}
                </Media>
                <Container>
                    {this.isInitializedAndNoData() ? (
                        <ChicletNavExtended />
                    ) : (
                        <ComponentList
                            enablePageRenderTracking={true}
                            trackingCount={dynamicTrackingCount}
                            context={CONTEXTS.CONTAINER}
                            page='home'
                            items={items}
                            removeLastItemMargin={true}
                        />
                    )}
                </Container>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(seoJSON)
                    }}
                ></script>
                {schemas?.length &&
                    schemas.map(schema => (
                        <script
                            key={schema['@type']}
                            type='application/ld+json'
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                        ></script>
                    ))}
            </>
        );
    }
}

Homepage.propTypes = {
    headerText: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    seoJSON: PropTypes.object.isRequired,
    setP13NInitialization: PropTypes.func.isRequired,
    setPageLoadAnalytics: PropTypes.func.isRequired,
    showCCPADialog: PropTypes.bool.isRequired,
    showConsumerPrivacyModal: PropTypes.func.isRequired,
    schemas: PropTypes.array
};

export default wrapComponent(Homepage, 'Homepage', true);
