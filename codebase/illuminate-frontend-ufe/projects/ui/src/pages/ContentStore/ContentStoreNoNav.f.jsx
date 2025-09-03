import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import ContentStoreBody from 'components/ContentPage/ContentStoreBody/ContentStoreBody';

// TODO: update region2 to region assuming API team can support it
const ContentStoreNoNav = ({ regions = {}, schemas, title, targetUrl }) => {
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
            {regions.content && (
                <ContentStoreBody
                    items={regions.content}
                    isNoNav={true}
                    analtyicsTitle={title}
                    targetUrl={targetUrl}
                />
            )}
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

export default wrapFunctionalComponent(ContentStoreNoNav, 'ContentStoreNoNav');
