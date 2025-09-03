import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import { site } from 'style/config';
import { Box } from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import BccBreadcrumbs from 'components/Bcc/BccBreadCrumbs/BccBreadCrumbs';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import ContentStoreLeftNav from 'components/ContentPage/ContentStoreLeftNav/ContentStoreLeftNav';
import OrderStatusLookup from 'components/RichProfile/MyAccount/OrderStatusLookup';

const OrderStatus = ({ regions = {}, ancestorHierarchy, breadcrumbs, schemas }) => {
    const isDesktop = Sephora.isDesktop();
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
                >
                    <BccComponentList
                        isContained={!isDesktop}
                        items={regions.content}
                        disableLazyLoadCount={2}
                        enablePageRenderTracking={true}
                    />
                    <Box marginLeft={isDesktop && site.MAIN_INDENT}>
                        <OrderStatusLookup />
                    </Box>
                    <BccComponentList
                        isContained={!isDesktop}
                        items={regions.right}
                        disableLazyLoadCount={2}
                        enablePageRenderTracking={true}
                    />
                </LegacyGrid.Cell>
            </LegacyGrid>
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

export default wrapFunctionalComponent(OrderStatus, 'OrderStatus');
