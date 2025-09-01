import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import { site } from 'style/config';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import BccBreadcrumbs from 'components/Bcc/BccBreadCrumbs/BccBreadCrumbs';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import ContentStoreLeftNav from 'components/ContentPage/ContentStoreLeftNav/ContentStoreLeftNav';
import EmailUs from 'components/EmailUs';
import SetPageAnalyticsProps from 'components/Analytics';
import AnaConst from 'analytics/constants';

const ContactUs = ({ regions = {}, ancestorHierarchy, breadcrumbs = [], schemas }) => {
    const isDesktop = Sephora.isDesktop();

    //analytics info comes from breadcrumbs
    const anaPageName = breadcrumbs[0] || {};
    const anaAdditionalPageInfo = breadcrumbs[breadcrumbs.length - 1] || {};

    return (
        <LegacyContainer>
            {isDesktop && <BccBreadcrumbs breadcrumbs={breadcrumbs} />}
            <LegacyGrid>
                {isDesktop && (
                    <LegacyGrid.Cell
                        width={site.SIDEBAR_WIDTH}
                        borderRight={1}
                        borderColor='midGray'
                        paddingRight={4}
                        lineHeight='tight'
                    >
                        <ContentStoreLeftNav
                            leftRegion={regions.left}
                            ancestorHierarchy={ancestorHierarchy}
                        />
                    </LegacyGrid.Cell>
                )}
                <LegacyGrid.Cell
                    is='main'
                    width={isDesktop && 'fill'}
                    paddingLeft={isDesktop && site.MAIN_INDENT}
                >
                    <BccComponentList
                        isContained={!isDesktop}
                        items={regions.content}
                        disableLazyLoadCount={2}
                        enablePageRenderTracking={true}
                    />
                    {Sephora.configurationSettings.isEmailUsEnabled && <EmailUs />}
                    <BccComponentList
                        isContained={!isDesktop}
                        items={regions.right}
                        disableLazyLoadCount={2}
                        enablePageRenderTracking={true}
                    />
                </LegacyGrid.Cell>
            </LegacyGrid>

            {schemas?.length &&
                schemas.map(schema => (
                    <script
                        key={schema['@type']}
                        type='application/ld+json'
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                    ></script>
                ))}
            <SetPageAnalyticsProps
                isContentStore={true}
                pageType={AnaConst.PAGE_TYPES.CONTENT_STORE}
                pageName={anaPageName.name || ''}
                additionalPageInfo={anaAdditionalPageInfo.name || ''}
            />
        </LegacyContainer>
    );
};

export default wrapFunctionalComponent(ContactUs, 'ContactUs');
