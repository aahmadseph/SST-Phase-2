import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import StoreLocatorContent from 'components/Stores/StoreLocator/StoreLocatorContent';
import ACTIVITY from 'constants/happening/activityConstants';

const StoreLocator = () => {
    const domPrefix = 'www';

    const breadCrumbsJsonLd = {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                position: 1,
                '@type': 'ListItem',
                item: {
                    name: 'About Sephora',
                    '@id': `https://${domPrefix}.sephora.com${ACTIVITY.OLR_URLS.LANDING_PAGE}`
                }
            },
            {
                position: 2,
                '@type': 'ListItem',
                item: {
                    name: 'Store Locations',
                    '@id': `https://${domPrefix}.sephora.com${ACTIVITY.OLR_URLS.STORE_LOCATOR}`
                }
            }
        ]
    };

    return (
        <>
            <StoreLocatorContent />
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadCrumbsJsonLd)
                }}
            ></script>
        </>
    );
};

export default wrapFunctionalComponent(StoreLocator, 'StoreLocator');
