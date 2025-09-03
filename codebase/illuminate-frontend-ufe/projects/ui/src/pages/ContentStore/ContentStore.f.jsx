import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import { site } from 'style/config';
import BccBreadcrumbs from 'components/Bcc/BccBreadCrumbs/BccBreadCrumbs';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import ContentStoreBody from 'components/ContentPage/ContentStoreBody/ContentStoreBody';
import ContentStoreLeftNav from 'components/ContentPage/ContentStoreLeftNav/ContentStoreLeftNav';
import RelatedLinks from 'components/RelatedLinks/RelatedLinks';

const ContentStore = ({
    ancestorHierarchy, breadcrumbs, linkEquityBlock, schemas, regions = {}, title, targetUrl
}) => {
    const domPrefix = 'www';
    const seoJSON = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: `https://${domPrefix}.sephora.com/`,
        potentialAction: {
            '@type': 'SearchAction',
            target: `https://${domPrefix}.sephora.com/search/{search_term_string}`,
            'query-input': 'required name=search_term_string'
        }
    };
    const isDesktop = Sephora.isDesktop();

    return (
        <LegacyContainer data-at={Sephora.debug.dataAt('content_store_container')}>
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
                    minHeight='1086px'
                >
                    <ContentStoreBody
                        isContained={!isDesktop}
                        items={regions.content}
                        ancestorHierarchy={ancestorHierarchy}
                        breadcrumbs={breadcrumbs}
                        anaTitle={title}
                        targetUrl={targetUrl}
                    />
                </LegacyGrid.Cell>
            </LegacyGrid>
            <RelatedLinks
                lemDataSource
                links={linkEquityBlock?.links}
            />
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(seoJSON) }}
            ></script>
            {schemas?.length &&
                schemas.map(schema => (
                    <script
                        key={schema['@type']}
                        type='application/ld+json'
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                    ></script>
                ))}
        </LegacyContainer>
    );
};

export default wrapFunctionalComponent(ContentStore, 'ContentStore');
