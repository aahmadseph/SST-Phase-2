const { LANGUAGES } = require('utils/LanguageLocale').default;
const { translatePageToLocale } = require('utils/buy');

const originalResponse = {
    slug: 'bright-lipstick',
    title: 'bright lipstick',
    relatedPages: [
        {
            url: 'https://www.sephora.ca/buy/best-makeup',
            slug: 'best-makeup',
            title: 'best makeup',
            translations: {
                fr: {
                    title: 'meilleur maquillage',
                    metaDescription:
                        'Trouvez le meilleur maquillage chez Sephora-Canada. Achetez notre collection d\'outils de maquillage, de soins de la peau et de beauté pour un look impeccable.'
                }
            }
        }
    ],
    translations: {
        fr: {
            title: 'rouge à lèvres brillant',
            metaDescription:
                'Trouvez le rouge à lèvres brillant parfait pour votre look. Découvrez la collection Sephora de teintes de rouge à lèvres vives, y compris des couleurs fluo et vives.'
        }
    }
};

const expectedOutput = {
    slug: 'bright-lipstick',
    title: 'rouge à lèvres brillant',
    metaDescription:
        'Trouvez le rouge à lèvres brillant parfait pour votre look. Découvrez la collection Sephora de teintes de rouge à lèvres vives, y compris des couleurs fluo et vives.',
    relatedPages: [
        {
            url: 'https://www.sephora.ca/buy/best-makeup',
            slug: 'best-makeup',
            title: 'meilleur maquillage',
            metaDescription:
                'Trouvez le meilleur maquillage chez Sephora-Canada. Achetez notre collection d\'outils de maquillage, de soins de la peau et de beauté pour un look impeccable.'
        }
    ]
};

describe('translatePagesToLocale', () => {
    it('should return the input if locale is en', () => {
        expect(translatePageToLocale({ x: 1 }, LANGUAGES.EN)).toEqual({ x: 1 });
    });

    it('should return French translation if locale is fr', () => {
        expect(translatePageToLocale(originalResponse, LANGUAGES.FR)).toEqual(expectedOutput);
    });
});
