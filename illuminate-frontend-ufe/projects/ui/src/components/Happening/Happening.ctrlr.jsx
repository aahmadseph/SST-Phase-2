import React from 'react';
import { wrapComponent } from 'utils/framework';
import ContentLayout from 'components/Content/ContentLayout';
import anaConsts from 'analytics/constants';
import SeoText from 'components/Catalog/SeoText';
import { Divider, Container } from 'components/ui';
import processEvent from 'analytics/processEvent';
import BaseClass from 'components/BaseClass';
import { space, mediaQueries, fontSizes } from 'style/config';
import BackToTopButton from 'components/BackToTopButton/BackToTopButton';

import LocationUtils from 'utils/Location';

const { isEventsLandingPage } = LocationUtils;

const pageName = anaConsts.PAGE_TYPES.OLR;
const pageType = anaConsts.PAGE_DETAIL.SERVICE_HOME;

const trackSoftLink = link => {
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            pageName: `${pageName}:${pageType}:n/a:*`,
            actionInfo: `${pageName}:appointment type:${link.label}`
        }
    });
};

class Happening extends BaseClass {
    render() {
        const {
            layout, breadcrumbs, navigation, seo, seoText, sid
        } = this.props.content;

        const LayoutComponent = ContentLayout[layout.type];

        return (
            <>
                <LayoutComponent
                    content={layout}
                    breadcrumbs={breadcrumbs}
                    navigation={navigation}
                    trackSoftLink={!isEventsLandingPage() ? trackSoftLink : undefined}
                    seo={seo}
                    customStyles={isEventsLandingPage() && customStyles}
                    enablePageRenderTracking={true}
                />

                {seoText && (
                    <Container>
                        <Divider
                            marginTop={[6, '40px']}
                            marginBottom={[6, '40px']}
                        />
                        <SeoText
                            contextId={sid}
                            text={seoText}
                        />
                    </Container>
                )}
                <BackToTopButton analyticsLinkName={anaConsts.LinkData.BACK_TO_TOP} />
                {seo?.schemas?.length &&
                    seo.schemas.map(schema => (
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

// TODO: separate user story, this need to move to Section or Card
const customStyles = {
    breadcrumbs: {
        paddingBottom: 0,
        marginTop: 2,
        minHeight: '20px'
    },
    section: {
        marginTop: space[4],
        marginBottom: space[4],
        [mediaQueries.sm]: {
            marginTop: space[5],
            marginBottom: space[5]
        }
    },
    card: {
        imageContainer: {
            marginBottom: space[0]
        },
        aboveTitle: {
            fontSize: fontSizes.sm
        },
        description: {
            marginBottom: space[3]
        }
    }
};

export default wrapComponent(Happening, 'Happening');
