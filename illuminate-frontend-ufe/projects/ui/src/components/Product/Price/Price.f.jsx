import React from 'react';
import { colors } from 'style/config';
import { Box } from 'components/ui';
import skuUtils from 'utils/Sku';
import languageLocale from 'utils/LanguageLocale';
import { wrapFunctionalComponent } from 'utils/framework';

const getText = languageLocale.getLocaleResourceFile('components/Product/Price/locales', 'Price');

function getPrice(sku) {
    const { isBirthdayGiftSkuValidationEnabled } = Sephora.configurationSettings;
    let price = '';

    //TODO UML-830
    //sku.type,
    // sku.biType,
    // sku.rewardSubType,
    // sku.listPrice
    if (skuUtils.isFree(sku)) {
        price = (
            <span>
                {getText('free')}
                {isBirthdayGiftSkuValidationEnabled ? <sup>∫</sup> : null}
            </span>
        );
    } else if (sku.biType && !skuUtils.isRougeRewardCard(sku)) {
        price = sku.biType.toLowerCase();
    } else {
        price = sku.listPrice;
    }

    return price;
}

function Price(props) {
    /* eslint-disable prefer-const */
    let {
        sku, atPrefix, includeValue, replenishmentSelected, ...restProps
    } = props;
    /* eslint-enable prefer-const */

    atPrefix = atPrefix ? `${atPrefix}_` : '';

    return (
        <Box {...restProps}>
            {sku.salePrice ? (
                <React.Fragment>
                    <span
                        data-at={Sephora.debug.dataAt(`${atPrefix}price`)}
                        css={styles.listPrice}
                        children={sku.listPrice}
                    />{' '}
                    <span
                        data-at={Sephora.debug.dataAt(`${atPrefix}sale_price`)}
                        css={styles.salePrice}
                        children={sku.salePrice}
                    />
                </React.Fragment>
            ) : (
                <span
                    data-at={Sephora.debug.dataAt(`${atPrefix}price`)}
                    children={replenishmentSelected ? sku.replenishmentAdjusterPrice : getPrice(sku)}
                />
            )}
            {includeValue && sku.valuePrice && (
                <div
                    data-at={Sephora.debug.dataAt(`${atPrefix}value_price`)}
                    css={styles.valuePrice}
                    children={sku.valuePrice}
                />
            )}
        </Box>
    );
}

Price.shouldUpdatePropsOn = ['sku.skuId', 'sku.actionFlags'];

Price.defaultProps = {
    lineHeight: 'tight',
    fontWeight: 'var(--font-weight-bold)',
    includeValue: true
};

const styles = {
    listPrice: {
        color: colors.gray,
        fontWeight: 'var(--font-weight-normal)',
        textDecoration: 'line-through'
    },
    salePrice: {
        color: colors.red
    },
    valuePrice: {
        marginTop: '.125em',
        fontSize: '.875em',
        fontWeight: 'var(--font-weight-normal)'
    }
};

export default wrapFunctionalComponent(Price, 'Price');
