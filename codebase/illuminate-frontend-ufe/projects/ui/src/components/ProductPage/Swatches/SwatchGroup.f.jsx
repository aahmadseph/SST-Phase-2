import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { mediaQueries } from 'style/config';
import { Text } from 'components/ui';
import SwatchItem from 'components/ProductPage/Swatches/SwatchItem';
import UrlUtils from 'utils/Url';
import utils from 'analytics/utils';
import store from 'store/Store';
import wizardActions from 'actions/WizardActions';

import swatchUtils from 'utils/Swatch';

const {
    getSwatchType, SWATCH_TYPES, SWATCH_BORDER, SQUARE_MARGIN, SWATCH_GROUP_VIEWS
} = swatchUtils;

const SwatchGroup = props => {
    const {
        index,
        currentProduct,
        showColorMatch,
        skus = [],
        currentSku,
        wizardResult = {},
        wizardMatchText,
        isCustomSet,
        swatchItemCallback,
        scrollRef,
        selectedItemRef,
        customSetDataAt,
        groupName,
        swatchView,
        isFragrance,
        isDropdown,
        colorIQMatch
    } = props;

    const swatchTypeStyle = isFragrance ? 'fragrance' : getSwatchType(isCustomSet ? SWATCH_TYPES.CIRCLE : currentProduct.swatchType);
    const isListView = swatchView === SWATCH_GROUP_VIEWS.LIST;
    const listPadding = isDropdown ? 3 : ['container', 3];

    return (
        <div>
            {groupName && (
                <Text
                    is='p'
                    fontSize='sm'
                    lineHeight='tight'
                    paddingX={isListView && listPadding}
                    marginTop={isListView ? (index > 0 ? 3 : 1) : index === 0 && 2}
                    marginBottom={1}
                    children={groupName}
                />
            )}
            <div
                ref={scrollRef}
                css={[
                    styles.container,
                    swatchView && [styles[swatchView], isListView || styles[swatchView][swatchTypeStyle], isFragrance && styles.fragrance]
                ]}
            >
                {skus.map((sku, i) => {
                    const matchText = wizardMatchText;
                    const matchedSkuId = UrlUtils.getParamValueAsSingleString('matchedSkuId');
                    const matchedSkuObj = { skuId: matchedSkuId };

                    if (matchedSkuId === sku.skuId) {
                        const { pageName } = utils.getPreviousPageData();

                        if (pageName.match('multi-product shade finder-results page')) {
                            store.dispatch(
                                wizardActions.setResult({
                                    result: matchedSkuObj,
                                    matchText: matchText || 'match'
                                })
                            );
                        }
                    }

                    const skuFinderSelected = wizardResult.skuId === sku.skuId;

                    return (
                        <SwatchItem
                            key={sku.skuId}
                            isSkuReady={props.isSkuReady}
                            swatchView={swatchView}
                            swatchTypeStyle={swatchTypeStyle}
                            isFragrance={isFragrance}
                            selectedItemRef={selectedItemRef}
                            index={i}
                            highlight={skuFinderSelected}
                            matchText={matchText}
                            currentProduct={currentProduct}
                            sku={sku}
                            activeSku={currentSku}
                            showColorMatch={showColorMatch}
                            isShadeFinderActive={Object.keys(wizardResult).length > 0 ? wizardResult : false}
                            isCustomSet={isCustomSet}
                            isDropdown={isDropdown}
                            swatchItemCallback={swatchItemCallback}
                            customSetDataAt={customSetDataAt}
                            listPadding={listPadding}
                            colorIQMatch={colorIQMatch}
                            {...props}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    // create new stacking context to prevent swatch dropdown layer conflicts
    container: {
        position: 'relative',
        zIndex: 0
    },
    [SWATCH_GROUP_VIEWS.GRID]: {
        display: 'flex',
        flexWrap: 'wrap',
        marginLeft: -SWATCH_BORDER,
        marginRight: -SWATCH_BORDER,
        paddingLeft: 0,
        paddingRight: 0,
        square: {
            marginRight: -(SWATCH_BORDER - SQUARE_MARGIN)
        },
        // squeeze in 1 more swatch for 375px mobile view to show 8 vs 7 across
        circle: {
            marginRight: -(SWATCH_BORDER + 1)
        }
    },
    fragrance: {
        [mediaQueries.md]: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)'
        }
    }
};

SwatchGroup.shouldUpdatePropsOn = ['skus', 'currentSku.skuId', 'currentProduct.currentSku', 'currentProduct.hoveredSku', 'colorIQMatch'];

export default wrapFunctionalComponent(SwatchGroup, 'SwatchGroup');
