import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';
import UtilActions from 'utils/redux/Actions';
import addToBasketActions from 'actions/AddToBasketActions';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import { Divider, Box } from 'components/ui';
import CallToAction from 'components/ProductPage/CallToAction';
import ProductLoveButton from 'components/Product/ProductLove/ProductLoveButton/ProductLoveButton';
import CustomSetItem from 'components/ProductPage/CustomSets/CustomSetItem/CustomSetItem';
import mediaUtils from 'utils/Media';
import ProductLove from 'components/Product/ProductLove';
import actions from 'actions/Actions';
import { breakpoints } from 'style/config';

const { Media } = mediaUtils;

const getInitialState = props => {
    const {
        currentSku: { configurableOptions = {}, skuId }
    } = props;
    const { groupedSkuOptions = [] } = configurableOptions;

    const skuOptions = groupedSkuOptions.map(groupedSkuOption => {
        delete groupedSkuOption.choiceSelected;
        groupedSkuOption.selectedSku = groupedSkuOption.skuOptions[0];
        groupedSkuOption.selectedSku.primaryProduct = {
            brand: {
                displayName: groupedSkuOption.groupProduct.brand.displayName
            },
            displayName: groupedSkuOption.groupProduct.displayName
        };
        groupedSkuOption.isExpanded = false;

        return groupedSkuOption;
    });

    return {
        lastSelectedSku: skuOptions[0]?.selectedSku,
        skuId,
        skuOptions
    };
};

class CustomSets extends BaseClass {
    constructor(props) {
        super(props);
        this.state = getInitialState(props);

        store.setAndWatch('loves.shoppingListIds', this, null, store.STATE_STRATEGIES.CLIENT_SIDE_DATA);
    }

    static getDerivedStateFromProps = (props, state) => {
        const {
            currentSku: { skuId }
        } = props;

        if (state.skuId !== skuId) {
            const newState = getInitialState(props);

            return newState;
        }

        return null;
    };

    addAllToBasket = () => {
        const { currentProduct, currentSku } = this.props;

        const analyticsData = {
            productName: currentProduct.productDetails.displayName,
            skuType: currentProduct.type,
            productId: currentProduct.productDetails.productId
        };

        const skusToAdd = [
            {
                productId: currentProduct.productDetails.productId,
                ...currentProduct.customSetsChoices.slice()[0]
            }
        ];
        skusToAdd.push({
            skuId: currentSku.skuId,
            productId: currentProduct.productDetails.productId,
            qty: 1
        });

        store.dispatch(
            addToBasketActions.addMultipleSkusToBasket(
                skusToAdd,
                skusToAdd.length,
                () => {
                    store.dispatch(UtilActions.merge('page.product', 'customSetsChoices', []));

                    const state = getInitialState(this.props);
                    this.setState(state);
                },
                null,
                analyticsData,
                currentSku
            )
        );

        if (window.matchMedia(breakpoints.smMin).matches) {
            this.showAddToBasketModal();
        }
    };

    showAddToBasketModal = () => {
        const { analyticsContext, currentProduct } = this.props;
        const { currentSku } = currentProduct;
        const { currentSkuQuantity } = currentProduct;
        store.dispatch(
            actions.showAddToBasketModal({
                isOpen: true,
                product: currentProduct,
                sku: currentSku,
                quantity: currentSkuQuantity,
                analyticsContext
            })
        );
    };

    mergeChoicesStore = () => {
        const { skuOptions } = this.state;
        const choices = skuOptions
            .filter(sku => sku.choiceSelected)
            .map(sku => ({
                skuId: sku.choiceSelected.skuId,
                qty: 1
            }));
        store.dispatch(UtilActions.merge('page.product', 'customSetsChoices', choices));
    };

    fireAnalytics = (action, value, skuId) => {
        const eventName = action === 'select' ? anaConsts.Event.SC_ADD : anaConsts.Event.SC_REMOVE;
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'D=c55',
                actionInfo: value,
                eventStrings: [anaConsts.Event.EVENT_71, eventName],
                sku: {
                    skuId
                }
            }
        });
    };

    selectSkuChoice = skuIndex => {
        const skuOptions = this.state.skuOptions.slice();
        skuOptions[skuIndex].choiceSelected = skuOptions[skuIndex].selectedSku;
        this.setState({ skuOptions });
        this.mergeChoicesStore();
        this.fireAnalytics('select', 'product:custom set:select', skuOptions[skuIndex].choiceSelected.skuId);
    };

    removeSkuChoice = skuIndex => {
        const skuOptions = this.state.skuOptions.slice();
        const deletedSkuId = skuOptions[skuIndex].choiceSelected.skuId;
        delete skuOptions[skuIndex].choiceSelected;
        this.setState({ skuOptions });
        this.mergeChoicesStore();
        this.fireAnalytics('remove', 'product:custom set:remove', deletedSkuId);
    };

    updateSkuImage = (updatedSku, skuIndex) => {
        const skuOptions = this.state.skuOptions.slice();
        delete skuOptions[skuIndex].selectedSku;
        skuOptions[skuIndex].selectedSku = skuOptions[skuIndex].skuOptions.find(sku => sku.skuId === updatedSku.skuId);
        this.setState({
            skuOptions,
            lastSelectedSku: skuOptions[skuIndex].selectedSku
        });
    };

    render() {
        const {
            addToBasketDataAt, addToBasketDataAtSm, isRopis, isSkuReady, currentSku, currentProduct
        } = this.props;

        const { lastSelectedSku, shoppingListIds = [] } = this.state;
        const { customSetsChoices = [] } = currentProduct;
        const isCurrentSkuLoved = !!shoppingListIds.find(skuId => skuId === currentSku.skuId);

        const loveButton = (
            <ProductLove
                sku={currentSku}
                customSetsChoices={customSetsChoices}
                loveSource='productPage'
                productId={currentProduct?.productDetails?.productId}
            >
                <ProductLoveButton
                    isCustomSetsProduct={true}
                    customSetsChoice={customSetsChoices}
                    currentProduct={currentProduct}
                    sku={currentSku}
                    loveSource='productPage'
                    disabled={customSetsChoices.length === 0 && !isCurrentSkuLoved}
                />
            </ProductLove>
        );

        return (
            <React.Fragment>
                {this.state.skuOptions.length > 0 ? (
                    <Box
                        data-at={Sephora.debug.dataAt('pdp_custom_set_block')}
                        paddingTop={[4, null, 0]}
                        marginBottom={6}
                    >
                        <Media greaterThan='sm'>
                            <Divider
                                marginTop={4}
                                marginBottom={3}
                            />
                        </Media>
                        {this.state.skuOptions.map((sku, skuIndex) => (
                            <React.Fragment key={`customSetItem_${sku.selectedSku.skuId}`}>
                                {skuIndex > 0 && (
                                    <Divider
                                        height={3}
                                        marginX={[-2, null, 0]}
                                        marginY={3}
                                    />
                                )}
                                <CustomSetItem
                                    isSkuReady={isSkuReady}
                                    skuIndex={skuIndex}
                                    sku={sku}
                                    currentProduct={currentProduct}
                                    selectSkuChoice={this.selectSkuChoice}
                                    removeSkuChoice={this.removeSkuChoice}
                                    updateSkuImage={this.updateSkuImage}
                                />
                            </React.Fragment>
                        ))}
                    </Box>
                ) : null}

                {isSkuReady && <Media lessThan='md'>{loveButton}</Media>}

                <CallToAction
                    isCustomSets={true}
                    addToBasketDataAt={addToBasketDataAt}
                    addToBasketDataAtSm={addToBasketDataAtSm}
                    isRopis={isRopis}
                    sku={lastSelectedSku}
                    product={currentProduct}
                    loveButton={isSkuReady && loveButton}
                    addToBasketCallback={this.addAllToBasket}
                />
            </React.Fragment>
        );
    }
}

export default wrapComponent(CustomSets, 'CustomSets', true);
