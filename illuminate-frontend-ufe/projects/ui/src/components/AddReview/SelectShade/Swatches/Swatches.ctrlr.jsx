/* eslint-disable class-methods-use-this */
/* eslint-disable object-curly-newline */
/* eslint-disable guard-for-in */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import ProductActions from 'actions/ProductActions';
import historyLocationActions from 'actions/framework/HistoryLocationActions';

import { Box, Flex, Text } from 'components/ui';
import ProductSwatchItem from 'components/Product/ProductSwatchItem/ProductSwatchItem';

import { space } from 'style/config';

import skuUtils from 'utils/Sku';
import swatchUtils from 'utils/Swatch';
import localeUtils from 'utils/LanguageLocale';

import Debounce from 'utils/Debounce';
import UtilActions from 'utils/redux/Actions';

const { SKU_ID_PARAM } = skuUtils;
const { SALE_GROUP_NAME, REFINEMENT_LABELS, SWATCH_BORDER } = swatchUtils;

const DEBOUNCE_HOVER = 100;
const SALE = 'Sale';
const CA_SALE_REGEX = /\s+/g;

class Swatches extends BaseClass {
    constructor(props) {
        super(props);

        this.stateHasBeenSetInitially = false;

        this.state = {
            toggledSku: null,
            refinementGroups: null
        };

        store.setAndWatch(
            { 'page.product': 'currentProduct' },
            this,
            data => {
                const { refinementGroups } = this.initSwatches(data.currentProduct || {}, this.stateHasBeenSetInitially);

                // Set a state directly since it has not been initialized fully,
                // e.g. this function is called from controller
                if (!this.stateHasBeenSetInitially) {
                    this.state.refinementGroups = refinementGroups;
                }
            },
            store.STATE_STRATEGIES.DIRECT_INIT
        );

        this.stateHasBeenSetInitially = true;
    }

    shouldUpdateStateOn = [
        'currentProduct.currentSku.skuId',
        'currentProduct.currentSku.actionFlags',
        'currentProduct.regularChildSkus',
        'currentProduct.onSaleChildSkus',
        'refinementGroups'
    ];

    componentDidMount() {
        if (this.state.currentProduct) {
            this.initSwatches(this.state.currentProduct, true);
        }
    }

    render() {
        const isHorizontalScroll = Sephora.isMobile();
        const { currentProduct } = this.state;

        // The product has not been set yet
        if (!currentProduct) {
            return null;
        }

        const selectorType = currentProduct.skuSelectorType;

        return !selectorType || selectorType === skuUtils.skuSwatchType.NONE ? null : (
            <Box
                textAlign='left'
                marginY={isHorizontalScroll && 4}
            >
                {this.createSwatchesList(isHorizontalScroll)}
            </Box>
        );
    }

    initSwatches = (currentProduct, shouldSetState = true) => {
        const refinementGroups = this.createRefinementGroups(currentProduct);

        this.groupedSwatches = [];
        this.salePricesInterval = refinementGroups[SALE] ? this.createSaleLabel(refinementGroups[SALE]) : {};
        this.swatchesList = {};
        this.swatchesGroupNames = this.createSwatchesGroupNames();

        if (shouldSetState) {
            this.setState({
                refinementGroups
            });
        }

        return { refinementGroups };
    };

    handleSkuOnClick = sku => {
        this.currentSkuRefinementName = sku.refinementName;
        store.dispatch(ProductActions.updateSkuInCurrentProduct(sku));

        const queryParams = Object.assign({}, store.getState().historyLocation.queryParams);
        queryParams[SKU_ID_PARAM] = sku.skuId;
        store.dispatch(historyLocationActions.goTo({ queryParams }));
    };

    handleSkuOnMouseEnter = sku => {
        if (!Sephora.isTouch) {
            store.dispatch(UtilActions.merge('page.product', 'hoveredSku', sku));
        }
    };

    handleSkuOnMouseLeave = () => {
        if (!Sephora.isTouch) {
            store.dispatch(UtilActions.merge('page.product', 'hoveredSku', null));
        }
    };

    // Use same debouncer for swatches mouse actions
    handleSkuOnMouseAction = Debounce.debounce((type, sku) => {
        switch (type) {
            case 'enter':
                this.handleSkuOnMouseEnter(sku);

                break;
            case 'leave':
                this.handleSkuOnMouseLeave();

                break;
            default:
                break;
        }
    }, DEBOUNCE_HOVER);

    getProductSwatchGroup = (currentProduct, skus, currentSku, groupedIndex) => {
        return skus && skus.length ? (
            <div
                ref={c => {
                    this.groupedSwatches[groupedIndex] = c;
                }}
                role='none'
                css={{
                    fontSize: 0,
                    margin: `0 -${SWATCH_BORDER}px`
                }}
            >
                {skus.map((sku, index) => {
                    const props = {
                        key: index,
                        index: index,
                        product: currentProduct,
                        sku: sku,
                        activeSku: this.props.isQuickLookModal ? this.state.toggledSku : currentSku,
                        showColorMatchBadge: this.state.currentProduct.showColorMatch,
                        handleSkuOnClick: clickedSku => this.handleSkuOnClick(clickedSku),
                        handleSkuOnMouseEnter: hoverSku => {
                            this.handleSkuOnMouseAction('enter', hoverSku);
                        },
                        handleSkuOnMouseLeave: hoverSku => {
                            this.handleSkuOnMouseAction('leave', hoverSku);
                        },
                        disableLazyLoad: true,
                        isQuickLookModal: this.props.isQuickLookModal
                    };

                    if (sku.actionFlags) {
                        props.actionFlags = sku.actionFlags;
                    }

                    return (
                        <ProductSwatchItem
                            {...this.props}
                            {...props}
                        />
                    );
                })}
            </div>
        ) : null;
    };

    createSwatchesList = isHorizontalScroll => {
        const { currentProduct } = this.state;
        const { currentSku, onSaleChildSkus } = currentProduct;

        const list = [];

        if (this.state.refinementGroups && this.salePricesInterval) {
            Object.keys(this.state.refinementGroups).forEach((group, groupIndex, groupArray) => {
                Object.keys(this.state.refinementGroups[group]).forEach((size, sizeIndex, sizeArray) => {
                    const refinementGroup = group === SALE ? this.state.refinementGroups[group] : this.state.refinementGroups[group][size];
                    list.push(
                        <Box
                            key={`${groupIndex.toString()}-${sizeIndex.toString()}`}
                            position='relative'
                            marginTop={groupIndex > 0 && 3}
                        >
                            <Flex
                                marginTop={sizeIndex > 0 && 3}
                                marginBottom={1}
                                aria-hidden
                                marginRight={3}
                                data-at={Sephora.debug.dataAt('product_refinement')}
                            >
                                {this.swatchesGroupNames[group] && this.swatchesGroupNames[group][sizeIndex]}
                                {group === SALE && (
                                    <Box marginLeft={2}>
                                        <Text
                                            color='gray'
                                            css={{ textDecoration: 'line-through' }}
                                        >
                                            {onSaleChildSkus[0].listPrice}
                                        </Text>{' '}
                                        <Text
                                            color='red'
                                            fontWeight='bold'
                                        >
                                            {
                                                // eslint-disable-next-line max-len
                                                this.salePricesInterval.minSalePrice === this.salePricesInterval.maxSalePrice
                                                    ? this.salePricesInterval.minSalePrice
                                                    : `${this.salePricesInterval.minSalePrice} - ${this.salePricesInterval.maxSalePrice}`
                                            }
                                        </Text>
                                    </Box>
                                )}
                            </Flex>
                            <div
                                css={[
                                    { position: 'relative' },
                                    isHorizontalScroll &&
                                        !this.state.isExpanded && {
                                        marginLeft: -space[4],
                                        marginRight: -space[4],
                                        paddingLeft: space[4],
                                        paddingRight: space[4],
                                        whiteSpace: 'nowrap',
                                        overflowY: 'hidden',
                                        overflowX: 'auto',
                                        '&::-webkit-scrollbar': { display: 'none' }
                                    }
                                ]}
                            >
                                {this.getProductSwatchGroup(
                                    currentProduct,
                                    refinementGroup.groupEntries,
                                    currentSku,
                                    sizeArray.length >= groupArray.length ? sizeIndex : groupIndex
                                )}
                            </div>
                        </Box>
                    );
                });
            });
        }

        return list;
    };

    createSaleLabel = saleRefinementGroup => {
        const salePrices = [];

        if (saleRefinementGroup.groupEntries && Array.isArray(saleRefinementGroup.groupEntries)) {
            saleRefinementGroup.groupEntries.forEach(item => {
                //Need to convert french price format to US first for the Math methods to work
                const salePrice = localeUtils.isFRCanada() ? item.salePrice.replace(CA_SALE_REGEX, '').replace(',', '.') : item.salePrice;
                salePrices.push(skuUtils.parsePrice(salePrice));
            });
        }

        const minSalePrice = Math.min(...salePrices);
        const maxSalePrice = Math.max(...salePrices);

        return {
            minSalePrice: localeUtils.getFormattedPrice(minSalePrice),
            maxSalePrice: localeUtils.getFormattedPrice(maxSalePrice)
        };
    };

    createSwatchesGroupNames = () => {
        const names = {};

        if (this.state.refinementGroups) {
            for (const groupName in this.state.refinementGroups) {
                if (groupName === SALE) {
                    names[groupName] = [SALE_GROUP_NAME];
                } else {
                    for (const sizeLabel in this.state.refinementGroups[groupName]) {
                        if (!names[groupName]) {
                            names[groupName] = [];
                        }

                        if (this.state.refinementGroups[groupName][sizeLabel]) {
                            const name = groupName !== REFINEMENT_LABELS.NO_REFINEMENT_LABEL ? `${sizeLabel}: ${groupName}` : sizeLabel;
                            names[groupName].push(name);
                        } else {
                            names[groupName].push(groupName);
                        }
                    }
                }
            }
        }

        return names;
    };

    createRefinementGroups = ({ regularChildSkus, onSaleChildSkus }) => {
        const refinementTypes = {};

        if (regularChildSkus) {
            regularChildSkus.forEach(element => this.setSkuRefinementGroup(element, refinementTypes));
        }

        if (onSaleChildSkus) {
            onSaleChildSkus.forEach(element => this.setSkuRefinementGroup(element, refinementTypes, true));
        }

        Object.keys(refinementTypes).forEach(refType => {
            refinementTypes[refType] = this.sortRefinementGroups(refinementTypes[refType]);
        });

        return refinementTypes;
    };

    setSkuRefinementGroup = (element, refs, isSale) => {
        const standardSizeLabel = `${element.type}${REFINEMENT_LABELS.SIZE}`;
        const createNewGroup = elm => (elm ? { groupEntries: [elm] } : { groupEntries: [] });

        const setGroup = (refLabel, sizeLabel) => {
            const label = refLabel ? `${refLabel}${REFINEMENT_LABELS.FINISH}` : REFINEMENT_LABELS.NO_REFINEMENT_LABEL;

            const refinementObj = refs[label] ? refs[label] : (refs[label] = {});

            if (sizeLabel) {
                if (!refinementObj[sizeLabel]) {
                    refinementObj[sizeLabel] = createNewGroup();
                }

                refinementObj[sizeLabel].groupEntries.push(element);
            } else {
                if (!refinementObj[standardSizeLabel]) {
                    refinementObj[standardSizeLabel] = createNewGroup();
                }

                refinementObj[standardSizeLabel].groupEntries.push(element);
            }
        };

        if (isSale) {
            if (refs?.Sale) {
                refs.Sale.groupEntries.push(element);
            } else {
                refs.Sale = createNewGroup(element);
            }
        } else {
            const { refinements } = element;

            if (refinements) {
                const { sizeRefinements, finishRefinements } = refinements;
                const sizeRefinementLabel = sizeRefinements && `${sizeRefinements}${REFINEMENT_LABELS.SIZE}`;

                if (finishRefinements && finishRefinements.length > 1) {
                    finishRefinements.forEach(ref => setGroup(ref, sizeRefinementLabel));
                } else {
                    setGroup(finishRefinements, sizeRefinementLabel);
                }
            } else {
                setGroup();
            }
        }

        return refs;
    };

    sortRefinementGroups = refinementObj => {
        const sortedRefinements = {};
        Object.keys(refinementObj)
            .sort((group1, group2) => {
                if (!group1) {
                    return 1;
                } else if (!group2) {
                    return -1;
                } else if (group1 === SALE_GROUP_NAME) {
                    return 1;
                } else if (group2 === SALE_GROUP_NAME) {
                    return -1;
                } else if (group1.indexOf(REFINEMENT_LABELS.STANDARD) > -1) {
                    return -1;
                } else if (group2.indexOf(REFINEMENT_LABELS.STANDARD) > -1) {
                    return 1;
                } else {
                    return 0;
                }
            })
            .forEach(key => (sortedRefinements[key] = refinementObj[key]));

        return sortedRefinements;
    };
}

export default wrapComponent(Swatches, 'Swatches', true);
