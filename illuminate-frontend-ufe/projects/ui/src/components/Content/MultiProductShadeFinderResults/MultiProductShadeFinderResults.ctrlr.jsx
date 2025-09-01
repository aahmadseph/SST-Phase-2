import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Loader from 'components/Loader/Loader';
import ProductListLayout from 'components/Content/ProductListLayout';
import CapturedColorIQBox from 'components/ShadeFinder/ResultsScreen/CapturedColorIQBox';
import { Box, Text } from 'components/ui';

const { GridLayout } = ProductListLayout;

class MultiProductShadeFinderResults extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            shadeCode: undefined,
            products: []
        };
    }

    componentDidMount() {
        const { showInterstice, getMultiProductMatch, localization } = this.props;
        const { l, a, b } = Sephora.Util.getQueryStringParams();
        const fullQueryParams = l && a && b;
        const shadeCode = fullQueryParams
            ? {
                l: l[0],
                a: a[0],
                b: b[0]
            }
            : undefined;

        if (shadeCode) {
            this.setState({
                shadeCode: shadeCode,
                isLoading: true
            });

            showInterstice(true);

            getMultiProductMatch(shadeCode)
                .then(({ products, serverError }) => {
                    const newState = { serverError };

                    if (serverError) {
                        newState.errorMessage = localization.serverErrorMessage;
                        newState.actionDescription = localization.serverErrorAction;
                    }

                    this.setState({ ...newState, products, isLoading: false }, () => showInterstice(false));
                })
                .catch(() => {
                    this.setState(
                        {
                            apiError: true,
                            errorMessage: localization.apiErrorMessage,
                            actionDescription: localization.apiErrorAction
                        },
                        () => showInterstice(false)
                    );
                });
        }
    }

    render() {
        const { isLoading, shadeCode, products } = this.state;
        const { localization, ...restProps } = this.props;

        return isLoading ? (
            <Loader
                isShown={true}
                isFixed={true}
                style={{ zIndex: 'var(--layer-max)' }}
            />
        ) : shadeCode ? (
            <Box>
                <CapturedColorIQBox />
                <GridLayout
                    {...restProps}
                    skus={products.map(product => {
                        return { ...product.currentSku, ...product };
                    })}
                    showMarketingFlags={true}
                    showLovesButton={true}
                    showRatingWithCount={true}
                    showQuickLookOnMobile={true}
                    showPrice={true}
                    showAddButton={true}
                    size={'small'}
                />
            </Box>
        ) : (
            <Box>
                <Text
                    is='h2'
                    fontSize='20'
                    fontWeight='bold'
                >
                    {localization.welcome}
                </Text>
                <Text is='p'>{localization.clickAbove}</Text>
            </Box>
        );
    }
}

MultiProductShadeFinderResults.propTypes = {};

export default wrapComponent(MultiProductShadeFinderResults, 'MultiProductShadeFinderResults', true);
