import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import MarketingPage from 'components/CreditCard/MarketingPage/MarketingPage';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';

const CreditCard = props => {
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
    const { title } = props;

    return (
        <LegacyContainer is='main'>
            <MarketingPage title={title} />
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(seoJSON)
                }}
            ></script>
        </LegacyContainer>
    );
};

export default wrapFunctionalComponent(CreditCard, 'CreditCard');
