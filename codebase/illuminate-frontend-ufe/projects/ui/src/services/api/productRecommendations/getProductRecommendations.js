import { gqlClient } from 'services/api/gql/gqlClient';
import { Recommendations } from 'constants/gql/queries/productRecommendations/recommendations.gql';
import localeUtils from 'utils/LanguageLocale';

const getProductRecommendations = async ({ worldKey, numResults, preFilterExpression = {} }) => {
    let client = 'ciojs-client-2.63.0';
    let s = '';
    let id = '';
    let ui = '';
    const locale = `${localeUtils.getCurrentLanguage().toLowerCase()}-${localeUtils.getCurrentCountry()}`;

    if (window.ConstructorioClient) {
        const { queryParams } = window.ConstructorioTracker.options;
        client = queryParams.c;
        s = queryParams.s;
        id = queryParams.i;
        ui = queryParams.ui;
    }

    const options = {
        operationName: 'Recommendations',
        query: Recommendations,
        numResults,
        variables: {
            request: {
                client,
                s,
                id,
                ui,
                locale,
                podId: `beautypreferences-${worldKey?.toLowerCase()}`,
                variationsMap: {
                    values: {
                        minListPrice: {
                            aggregation: 'min',
                            field: 'data.currentSku.listPriceFloat'
                        },
                        maxListPrice: {
                            aggregation: 'max',
                            field: 'data.currentSku.listPriceFloat'
                        },
                        minSalePrice: {
                            aggregation: 'min',
                            field: 'data.currentSku.salePriceFloat'
                        },
                        maxSalePrice: {
                            aggregation: 'max',
                            field: 'data.currentSku.salePriceFloat'
                        }
                    },
                    dtype: 'object'
                },
                ...(preFilterExpression && { preFilterExpression })
            }
        }
    };

    const response = await gqlClient.query(options);

    return response || null;
};

export default getProductRecommendations;
