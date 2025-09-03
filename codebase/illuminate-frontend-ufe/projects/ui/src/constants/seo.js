const seo = [
    {
        url: '/sale',
        localeVersions: [
            {
                locale: 'en_US',
                seoTitle: 'Makeup Sale | Beauty Sale | Sephora',
                seoMetaDescription:
                    'Makeup sales are always on at Sephora. Shop discounted makeup, skincare, fragrance and hair care products at Sephora today. Free shipping and samples available.',
                seoCanonicalUrl: '/sale'
            },
            {
                locale: 'fr_CA',
                seoTitle: 'Bons Plans Maquillage et Offres Beauté | Sephora',
                seoMetaDescription:
                    'Nos offres beauté sont toujours disponibles chez Sephora. Achetez dès aujourd\'hui des produits de maquillage, de soin de la peau, de parfum et de soins capillaires à prix réduit chez Sephora. Livraison gratuite et échantillons disponibles.',
                seoCanonicalUrl: '/sale'
            }
        ]
    }
];

const homePage = {
    seoJSON: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://www.sephora.com/',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.sephora.com/search?keyword={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    }
};

export {
    homePage, seo
};
