import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import languageLocale from 'utils/LanguageLocale';
import ProductCard from 'components/Product/ProductCard';
import AddToBasketButton from 'components/AddToBasketButton';
import basketUtils from 'utils/Basket';
import {
    Grid, Text, Box, Divider, Icon, Flex
} from 'components/ui';
import mediaUtils from 'utils/Media';
import helpersUtils from 'utils/Helpers';
import analyticsConsts from 'analytics/constants';
import { CONSTRUCTOR_PODS, RESULTS_COUNT } from 'constants/constructorConstants';

const { ADD_TO_BASKET_TYPES } = basketUtils;
const { isMobileView } = mediaUtils;
const { calculateTotalPrice } = helpersUtils;
const getText = languageLocale.getLocaleResourceFile('components/ProductPage/FrequentlyBoughtTogether/locales', 'FrequentlyBoughtTogether');

class FrequentlyBoughtTogether extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            currentSku: {},
            currentProduct: {},
            recommendedSKUs: [],
            recommendedTitle: ''
        };
    }

    setPropertiesFromConstructor = () => {
        const { currentProduct } = this.props;
        const params = { itemIds: currentProduct?.productDetails?.productId, numResults: RESULTS_COUNT.FREQUENTLY_BOUGHT_TOGETHER };

        this.props.updateRequestData({ params, podId: CONSTRUCTOR_PODS.FREQUENTLY_BOUGHT_TOGETHER });
    };

    updateRecommendations = () => {
        const {
            shouldExcludeCurrentProduct, title, recs, totalResults, resultId
        } = this.props;
        this.setState({
            recommendedSKUs: shouldExcludeCurrentProduct ? recs.slice(1) : recs,
            recommendedTitle: title,
            totalResults,
            resultId
        });
    };

    componentDidMount() {
        this.setPropertiesFromConstructor();

        if (this.props.recs?.length) {
            this.updateRecommendations();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.recs?.length && prevProps.recs !== this.props.recs) {
            this.updateRecommendations();
        }

        if (prevProps.currentProduct?.productDetails?.productId !== this.props.currentProduct?.productDetails?.productId) {
            this.setPropertiesFromConstructor();
        }
    }

    addToBasketSize = () => {
        return isMobileView() ? 'sm' : undefined;
    };

    render() {
        const { recommendedSKUs, recommendedTitle, totalResults, resultId } = this.state;

        const { shouldExcludeCurrentProduct, showAddAllToBasketButton = true, isCarousel } = this.props;

        const addProps = showAddAllToBasketButton
            ? {
                variant: ADD_TO_BASKET_TYPES.PRIMARY,
                sku: recommendedSKUs || [],
                text: getText('addAllToBasket'),
                hasMinWidth: true,
                isAddButton: true,
                showBasketQuickAdd: false,
                isQuickLook: false,
                analyticsContext: analyticsConsts.CONTEXT.FREQUENTLY_BOUGHT_TOGETHER,
                rootContainerName: analyticsConsts.CONTEXT.FREQUENTLY_BOUGHT_TOGETHER,
                isMultiProductsAdd: true
            }
            : {};

        const totalPrice = `${getText('totalPrice', [calculateTotalPrice(recommendedSKUs)])}`;

        return recommendedSKUs?.length ? (
            <Box
                marginBottom={showAddAllToBasketButton ? [6, 8] : 0}
                lineHeight='tight'
                {...(!showAddAllToBasketButton && { marginTop: 4 })}
            >
                <Divider />
                <Text
                    is='h2'
                    marginTop='1em'
                    marginBottom={[3, 5]}
                    fontSize={showAddAllToBasketButton ? ['md', 'lg'] : 'md'}
                    fontWeight='bold'
                    children={showAddAllToBasketButton ? recommendedTitle : getText('frequentlyBoughtWithThisProduct')}
                    {...(!showAddAllToBasketButton && { textAlign: 'center' })}
                />
                <Grid
                    backgroundColor={showAddAllToBasketButton ? 'nearWhite' : 'unset'}
                    alignItems='start'
                    gap={[showAddAllToBasketButton ? 4 : 0, null, null, showAddAllToBasketButton ? 5 : 0]}
                    columns={[null, null, null, '1fr auto']}
                    marginX={['-container', null, null, 0]}
                    paddingY={[4, null, null, showAddAllToBasketButton ? 5 : 4]}
                    paddingX={[3, null, null, showAddAllToBasketButton ? 5 : 3]}
                    borderRadius={[null, null, null, 2]}
                >
                    <Box
                        overflow={shouldExcludeCurrentProduct ? ['auto', null, null, 'unset'] : 'auto'}
                        padding={[3, null, null, 5]}
                        margin={[-3, null, null, -5]}
                        {...(!showAddAllToBasketButton && {
                            marginLeft: [null, -2],
                            marginTop: [-5, -5],
                            paddingLeft: [null, null, null, 3],
                            paddingRight: [null, null, null, 3],
                            paddingTop: [null, 1, 1, 1]
                        })}
                    >
                        <Flex
                            minWidth={shouldExcludeCurrentProduct ? [recommendedSKUs.length === 1 ? 287 : 583] : [901, null, null, 893]}
                            {...(!showAddAllToBasketButton && { paddingLeft: 1, paddingRight: [1, 2, null, 1] })}
                            data-cnstrc-recommendations
                            data-cnstrc-recommendations-pod-id={CONSTRUCTOR_PODS.FREQUENTLY_BOUGHT_TOGETHER}
                            data-cnstrc-result-id={resultId}
                            data-cnstrc-num-results={totalResults}
                        >
                            {recommendedSKUs.map((item, index) => (
                                <React.Fragment
                                    key={item.skuId}
                                    data-cnstrc-recommendations
                                    data-cnstrc-recommendations-pod-id={CONSTRUCTOR_PODS.FREQUENTLY_BOUGHT_TOGETHER}
                                    data-cnstrc-result-id={resultId}
                                    data-cnstrc-num-results={totalResults}
                                >
                                    {index ? (
                                        showAddAllToBasketButton ? (
                                            <Icon
                                                name='plus'
                                                size='12px'
                                                marginX={1}
                                                css={{ alignSelf: 'center' }}
                                            />
                                        ) : (
                                            <Box marginX={1} />
                                        )
                                    ) : null}
                                    <ProductCard
                                        isSkeleton={false}
                                        sku={item.sku || item}
                                        showPrice={true}
                                        showAddButton={true}
                                        useInternalTracking={true}
                                        showMarketingFlags={true}
                                        showLovesButton={false}
                                        showRating={true}
                                        isHorizontal={true}
                                        imageSize={[60, null, null, 80]}
                                        rootContainerName={analyticsConsts.CONTEXT.FREQUENTLY_BOUGHT_TOGETHER}
                                        analyticsContext={analyticsConsts.CONTEXT.FREQUENTLY_BOUGHT_TOGETHER}
                                        isCarousel={isCarousel}
                                    />
                                </React.Fragment>
                            ))}
                        </Flex>
                    </Box>
                    <Grid
                        gap={4}
                        alignItems='center'
                        columns={['auto 1fr', null, null, 1]}
                        order={[-1, null, null, 0]}
                        marginLeft={[1, null, null, 0]}
                    >
                        {showAddAllToBasketButton && (
                            <Text
                                is='h3'
                                fontWeight='bold'
                                children={totalPrice}
                            />
                        )}
                        <AddToBasketButton
                            {...addProps}
                            size={this.addToBasketSize()}
                        />
                    </Grid>
                </Grid>
            </Box>
        ) : null;
    }
}

export default wrapComponent(FrequentlyBoughtTogether, 'FrequentlyBoughtTogether', true);
