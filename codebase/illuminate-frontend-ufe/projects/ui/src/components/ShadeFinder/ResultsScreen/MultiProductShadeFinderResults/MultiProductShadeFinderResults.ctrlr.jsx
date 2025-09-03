import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Interstice from 'components/Interstice/Interstice';
import ProductGrid from 'components/ShadeFinder/ProductGrid/ProductGrid';
import { Text } from 'components/ui';
import CapturedColorIQBox from 'components/ShadeFinder/ResultsScreen/CapturedColorIQBox';
import { site } from 'style/config';

const { wrapComponent } = FrameworkUtils;

class MultiProductShadeFinderResults extends BaseClass {
    constructor(props) {
        super(props);
        const { l, a, b } = Sephora.Util.getQueryStringParams();
        const fullQueryParams = l && a && b;
        this.state = {
            shadeCode: fullQueryParams
                ? {
                    l: l[0],
                    a: a[0],
                    b: b[0]
                }
                : undefined,
            products: undefined,
            queryParamsError: !fullQueryParams,
            serverError: undefined,
            apiError: undefined
        };
    }

    componentDidMount() {
        const { shadeCode, queryParamsError } = this.state;
        const { showInterstice, getMultiProductMatch, localization } = this.props;

        if (shadeCode) {
            showInterstice(true);

            getMultiProductMatch(shadeCode)
                .then(({ products, serverError }) => {
                    const newState = { serverError };

                    if (serverError) {
                        newState.errorMessage = localization.serverErrorMessage;
                        newState.actionDescription = localization.serverErrorAction;
                    }

                    this.setState({ ...newState, products }, () => showInterstice(false));
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
        } else if (queryParamsError) {
            this.setState({
                errorMessage: localization.queryParamsErrorMessage,
                actionDescription: localization.queryParamsErrorAction
            });
        }
    }

    render() {
        const {
            products, errorMessage, actionDescription, queryParamsError, apiError, serverError
        } = this.state;

        if (products) {
            return (
                <>
                    <CapturedColorIQBox />
                    <Text
                        is='h2'
                        color='gray'
                        marginTop={[2, null, 5]}
                        marginBottom={2}
                        marginX='auto'
                        maxWidth={site.legacyWidth - site.SIDEBAR_WIDTH}
                        textAlign={['center', null, 'left']}
                        style={
                            !products.length
                                ? {
                                    visibility: 'hidden'
                                }
                                : null
                        }
                        data-at={Sephora.debug.dataAt('number_of_products')}
                        children={`${products.length} ${this.props.localization.products}`}
                    />

                    <ProductGrid
                        products={products}
                        isShadeFinderResults={true}
                        hideBadges
                        shouldRunSoasta={false}
                    />
                </>
            );
        }

        if (queryParamsError || apiError || serverError) {
            return (
                <div
                    css={{
                        padding: '1em',
                        textAlign: 'center'
                    }}
                >
                    <p
                        css={{
                            fontWeight: 'bold'
                        }}
                    >
                        {errorMessage}
                    </p>
                    <p>{actionDescription}</p>
                </div>
            );
        }

        return <Interstice />;
    }
}

MultiProductShadeFinderResults.propTypes = {};

export default wrapComponent(MultiProductShadeFinderResults, 'MultiProductShadeFinderResults', true);
