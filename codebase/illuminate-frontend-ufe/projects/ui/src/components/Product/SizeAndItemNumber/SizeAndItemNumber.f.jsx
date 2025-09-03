import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import skuUtils from 'utils/Sku';
import languageLocale from 'utils/LanguageLocale';

const getText = languageLocale.getLocaleResourceFile('components/Product/SizeAndItemNumber/locales', 'SizeAndItemNumber');

function SizeAndItemNumber(fullProps) {
    const { sku, isPurchaseHistoryItemList, isLovedItemList, ...props } = fullProps;
    const dataAt = isPurchaseHistoryItemList
        ? Sephora.debug.dataAt('size_and_item_number')
        : isLovedItemList
            ? Sephora.debug.dataAt('loves_page_size_and_item_number')
            : Sephora.debug.dataAt('sku_size');

    return (
        <Box
            data-at={dataAt}
            {...props}
        >
            {sku.size && sku.variationType && sku.variationType !== skuUtils.skuVariationType.SIZE && (
                <React.Fragment>
                    {getText('size', [sku.size])}
                    <span
                        data-at={Sephora.debug.dataAt('sku_size_separator')}
                        css={{ margin: '0 .5em' }}
                    >
                        •
                    </span>
                </React.Fragment>
            )}
            {getText('item', [sku.skuId])}
        </Box>
    );
}

SizeAndItemNumber.shouldUpdatePropsOn = ['sku.skuId', 'sku.actionFlags'];

SizeAndItemNumber.defaultProps = {
    color: 'gray',
    isPurchaseHistoryItemList: false
};

export default wrapFunctionalComponent(SizeAndItemNumber, 'SizeAndItemNumber');
