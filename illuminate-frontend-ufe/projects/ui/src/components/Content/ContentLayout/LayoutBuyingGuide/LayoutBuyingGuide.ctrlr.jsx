/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Container } from 'components/ui';
import ComponentList from 'components/Content/ComponentList';
import contentConstants from 'constants/content';
import Breadcrumb from 'components/Content/Breadcrumb';
import NavigationCarousel from 'components/Content/NavigationCarousel';
import { mountHeroBanner } from 'utils/Layout';

const { CONTEXTS } = contentConstants;

class LayoutBuyingGuide extends BaseClass {
    constructor(props) {
        super(props);
        this.navRef = React.createRef();
    }

    render() {
        const { localization, breadcrumbs, seo, navigation } = this.props;
        const { heroBanner, content } = this.props.content;
        const isChild = !navigation?.action?.isCurrent;

        const heroBannerProps = mountHeroBanner({
            heroBanner,
            seo,
            isChild,
            navigation
        });

        // UA-2508: Smart trackingCount allocation based on actual component counts
        const heroBannerItems = heroBannerProps ? [heroBannerProps] : [];
        const contentItems = content || [];

        const heroBannerCount = heroBannerItems.length; // 0 or 1 (heroBanner is always single)
        const contentCount = contentItems.length; // Could be 0, 1, 2, 5, 10+

        let heroBannerTracking = 0;
        let contentTracking = 0;

        if (heroBannerCount >= 2) {
            // First ComponentList (heroBanner) has 2+ components - track 2 in first, 0 in second
            heroBannerTracking = 2;
            contentTracking = 0;
        } else if (heroBannerCount === 1) {
            // First ComponentList (heroBanner) has 1 component - track 1 in first, 1 in second
            heroBannerTracking = 1;
            contentTracking = Math.min(contentCount, 1);
        } else {
            // First ComponentList (heroBanner) has 0 components - track 0 in first, 2 in second
            heroBannerTracking = 0;
            contentTracking = Math.min(contentCount, 2);
        }

        const trackHeroBanner = heroBannerTracking > 0;
        const trackContent = contentTracking > 0;

        return (
            <Container paddingX={[0, 4]}>
                <Container paddingX={[4, 0]}>
                    {breadcrumbs && (
                        <Breadcrumb
                            breadcrumbs={breadcrumbs}
                            localization={localization?.breadcrumb}
                            fontSize='sm-bg'
                        />
                    )}
                </Container>
                {isChild && navigation?.items && (
                    <NavigationCarousel
                        variant={'link'}
                        navigation={navigation}
                    />
                )}
                {heroBannerProps && (
                    <ComponentList
                        enablePageRenderTracking={trackHeroBanner}
                        trackingCount={heroBannerTracking}
                        context={CONTEXTS.CONTAINER}
                        page='buying-guide'
                        items={[heroBannerProps]}
                    />
                )}
                {!isChild && navigation?.items && <NavigationCarousel navigation={navigation} />}
                <Container paddingX={[4, 0]}>
                    {content?.length && (
                        <ComponentList
                            enablePageRenderTracking={trackContent}
                            trackingCount={contentTracking}
                            context={CONTEXTS.CONTAINER}
                            page='buying-guide'
                            items={content}
                            removeLastItemMargin={true}
                            removeFirstItemMargin={true}
                        />
                    )}
                </Container>
            </Container>
        );
    }
}

LayoutBuyingGuide.propTypes = {
    navigation: PropTypes.object,
    seo: PropTypes.object,
    breadcrumbs: PropTypes.array
};

LayoutBuyingGuide.defaultProps = {
    navigation: null,
    seo: null,
    breadcrumbs: null
};

export default wrapComponent(LayoutBuyingGuide, 'LayoutBuyingGuide', true);
