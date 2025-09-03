import React from 'react';
import store from 'Store';
import watch from 'redux-watch';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import skuUtils from 'utils/Sku';
import ProductSwatchItem from 'components/Product/ProductSwatchItem/ProductSwatchItem';
import { Box, Flex } from 'components/ui';
import swatchUtils from 'utils/Swatch';
import processEvent from 'analytics/processEvent';
import Debounce from 'utils/Debounce';
import swatchClickEvent from 'analytics/bindings/pages/all/swatchClickEvent';

const { SWATCH_BORDER } = swatchUtils;
const DEBOUNCE_HOVER = 50;

class ProductSwatchGroup extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            currentSku: null,
            previousSku: null,
            toggledSku: null
        };
    }

    componentDidMount() {
        // toggledSku defaults to currentSku prop from parent's component props.
        this.setState({ toggledSku: this.props.currentSku });

        const currentSkuWatch = watch(store.getState, 'product');
        store.subscribe(
            currentSkuWatch((newVal, oldVal) => {
                this.setState({
                    currentSku: newVal.currentSku,
                    previousSku: oldVal.currentSku
                });
            }),
            this
        );
    }

    handleSkuOnClick = sku => {
        this.props.updateCurrentSku(sku);

        /**
         * toggledSku stores only the most recently clicked swatch,
         * and is used exclusively to validate which productSwatchItem
         * receives the "active" UI class.
         */
        this.setState({ toggledSku: sku });

        //Analytics
        processEvent.preprocess.commonInteractions({
            actionInfo: 'quicklook_swatch_click',
            bindingMethods: [swatchClickEvent],
            context: this.props.analyticsContext,
            eventStrings: ['event71'],
            sku: sku,
            linkName: 'quicklook_swatch_click'
        });
    };

    handleSkuOnMouseAction = Debounce.debounce((type, sku) => {
        if (Sephora.isTouch) {
            return;
        }

        switch (type) {
            case 'enter':
                this.props.updateCurrentSku(sku);

                break;
            case 'leave':
                this.props.updateCurrentSku(this.state.toggledSku);

                break;
            default:
                break;
        }
    }, DEBOUNCE_HOVER);

    render() {
        const { showOnSaleOnly } = this.props;
        const skus = product => {
            const { regularChildSkus = [], onSaleChildSkus = [] } = product;

            if (showOnSaleOnly) {
                return onSaleChildSkus;
            } else {
                return [].concat([], regularChildSkus, onSaleChildSkus);
            }
        };

        return (
            <Box
                overflowY='auto'
                maxHeight={[null, this.props.product.skuSelectorType === skuUtils.skuSwatchType.IMAGE ? 110 : null]}
                css={{
                    /* Outdent selector so swatch image edge is flush with container edge */
                    marginLeft: -SWATCH_BORDER,
                    paddingBottom: SWATCH_BORDER,
                    marginBottom: -SWATCH_BORDER
                }}
            >
                <Flex
                    flexWrap='wrap'
                    fontSize='0'
                >
                    {skus(this.props.product).map((sku, index) => (
                        <ProductSwatchItem
                            key={sku.skuId}
                            index={index}
                            product={this.props.product}
                            sku={sku}
                            isQuickLookModal={true}
                            activeSku={this.state.toggledSku}
                            colorIqSku={this.props.matchSku}
                            handleSkuOnClick={this.handleSkuOnClick}
                            handleSkuOnMouseEnter={hoverSku => this.handleSkuOnMouseAction('enter', hoverSku)}
                            handleSkuOnMouseLeave={() => this.handleSkuOnMouseAction('leave')}
                        />
                    ))}
                </Flex>
            </Box>
        );
    }
}

export default wrapComponent(ProductSwatchGroup, 'ProductSwatchGroup', true);
