import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Grid, Flex, Link, Button
} from 'components/ui';
import SwatchListDropdown from 'components/ProductPage/Swatches/SwatchListDropdown';
import SwatchGroup from 'components/ProductPage/Swatches/SwatchGroup';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import mediaUtils from 'utils/Media';

import languageLocale from 'utils/LanguageLocale';

const { Media } = mediaUtils;
const getText = text => languageLocale.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);

const renderSkuInfo = ({ sku = {} }) => (
    <div>
        <strong data-at={Sephora.debug.dataAt('item_brand')}>{sku.groupProduct?.brand?.displayName}</strong>
        <br />
        <span data-at={Sephora.debug.dataAt('item_name')}>{sku.groupProduct?.displayName}</span>
        <br />
        <span data-at={Sephora.debug.dataAt('item_variation')}>
            {sku.selectedSku?.variationValue}
            {sku.selectedSku?.variationDesc ? ' - ' + sku.selectedSku?.variationDesc : ''}
        </span>
    </div>
);

const renderSelectButton = props => (
    <Button
        data-at={Sephora.debug.dataAt('select_free_item_btn')}
        marginTop={3}
        disabled={props.sku.selectedSku && (props.sku.selectedSku.isOutOfStock || props.sku.selectedSku.isAppExclusive)}
        variant='primary'
        size='sm'
        minWidth={[72, null, 126]}
        onClick={() => props.selectSkuChoice(props.skuIndex)}
    >
        Select
    </Button>
);

const renderSkuImage = props =>
    props.isSkuReady ? (
        <ProductImage
            id={props.sku.selectedSku.skuId}
            skuImages={props.sku.selectedSku.skuImages}
            size={[92, null, 116]}
            borderRadius={3}
            border={1}
            disableLazyLoad={true}
            borderColor='lightGray'
            overflow='hidden'
        />
    ) : null;

const renderSwatchGrid = props => (
    <SwatchGroup
        isCustomSet={true}
        isSkuReady={props.isSkuReady}
        currentSku={props.sku.selectedSku}
        currentProduct={props.currentProduct}
        skus={props.sku.skuOptions}
        showColorMatch={false}
        customSetDataAt='pdp_custom_set_free_product_swatch'
        swatchItemCallback={updatedSku => props.updateSkuImage(updatedSku, props.skuIndex)}
    />
);

const renderSwatchDropdown = props => (
    <SwatchListDropdown
        product={{
            currentSku: props.sku.selectedSku,
            regularChildSkus: props.sku.skuOptions
        }}
        isCustomSet={true}
        onSelectedSkuChanged={updatedSku => props.updateSkuImage(updatedSku, props.skuIndex)}
    />
);

function CustomSetItem(props) {
    return (
        <React.Fragment>
            <Media lessThan='md'>
                <div data-at={Sephora.debug.dataAt('custom_set_item_small_view')}>
                    <Grid
                        gap={4}
                        marginBottom={3}
                        columns='1fr auto'
                        alignItems='flex-start'
                    >
                        <div>
                            {renderSkuInfo(props)}
                            {renderSelectButton(props)}
                        </div>
                        {renderSkuImage(props)}
                    </Grid>
                    <Flex
                        marginBottom={1}
                        justifyContent='flex-end'
                    >
                        {renderSwatchDropdown(props)}
                    </Flex>
                    {renderSwatchGrid(props)}
                </div>
            </Media>
            <Media greaterThan='sm'>
                <div data-at={Sephora.debug.dataAt('custom_set_item_large_view')}>
                    <Grid
                        gap={2}
                        columns='1fr auto'
                        alignItems='center'
                        marginBottom={3}
                    >
                        {renderSkuInfo(props)}
                        {renderSwatchDropdown(props)}
                    </Grid>
                    <Grid
                        columns='auto 1fr'
                        alignItems='flex-start'
                        gap={4}
                        paddingBottom={3}
                    >
                        {renderSkuImage(props)}
                        <div>
                            {renderSwatchGrid(props)}
                            {renderSelectButton(props)}
                        </div>
                    </Grid>
                </div>
            </Media>
            {props.sku.choiceSelected ? (
                <Grid
                    data-at={Sephora.debug.dataAt('selected_free_product')}
                    marginTop={[3, null, 0]}
                    columns='auto 1fr'
                    gap={2}
                    alignItems='center'
                >
                    <ProductImage
                        id={props.sku.choiceSelected.skuId}
                        skuImages={props.sku.choiceSelected.skuImages}
                        size={52}
                    />
                    <div>
                        <Link
                            data-at={Sephora.debug.dataAt('remove_free_item_btn')}
                            fontSize='sm'
                            onClick={() => props.removeSkuChoice(props.skuIndex)}
                            color='blue'
                            padding={3}
                            margin={-3}
                            children={getText('remove')}
                        />
                    </div>
                </Grid>
            ) : null}
        </React.Fragment>
    );
}

CustomSetItem.shouldUpdatePropsOn = ['sku', 'currentProduct'];

export default wrapFunctionalComponent(CustomSetItem, 'CustomSetItem');
