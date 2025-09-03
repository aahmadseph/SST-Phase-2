import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    colors, fontSizes, lineHeights, space, fontWeights, radii
} from 'style/config';
import KlarnaMarketing from 'components/ProductPage/KlarnaMarketing/KlarnaMarketing';
import skuUtils from 'utils/Sku';
import languageLocale from 'utils/LanguageLocale';
import anaConsts from 'analytics/constants';

function getPrice(sku) {
    const { isBirthdayGiftSkuValidationEnabled } = Sephora.configurationSettings;
    const getText = text => languageLocale.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);

    let price = '';

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

function shouldDisplayBnplAsContents(salePrice, valuePrice, isReplenishmentEligible) {
    return salePrice != null || valuePrice != null || (!salePrice && !valuePrice && !isReplenishmentEligible);
}

function formatValueText(rawText, isFrench) {
    const innerText = rawText
        .trim()
        .replace(/^\((.*)\)$/, '$1')
        .trim();
    const parts = innerText.split(/\s+/);

    if (isFrench) {
        const label = parts[0].toUpperCase();
        const amount = parts.slice(1).join(' ');

        return `${label} ${amount}`;
    } else {
        const amount = parts[0];
        const label = parts.slice(1).join(' ').toUpperCase();

        return `${amount} ${label}`;
    }
}

/* eslint-disable-next-line complexity */
function Price({
    sku, isSmallView, isReplenishmentEligible, replenishMessage, isExternallySellable, isCanada, highlightValueHidden, isFrench
}) {
    const { salePrice, listPrice, valuePrice } = sku;
    const isAfterpayEnabled = Sephora.configurationSettings.afterpayEnabled && sku.actionFlags?.isAfterpayEligible;
    const isKlarnaPaymentEnabled = Sephora.configurationSettings.isKlarnaPaymentEnabled && sku.actionFlags?.isKlarnaEligible;
    const isPayPalPayLaterEligibleEnabled = Sephora.configurationSettings.isPayPalEnabled && sku.actionFlags?.isPayPalPayLaterEligible;
    const displayBnplAsContents = shouldDisplayBnplAsContents(salePrice, valuePrice, isReplenishmentEligible);
    const formattedValuePrice = highlightValueHidden && valuePrice && formatValueText(valuePrice, isFrench);

    return (
        <>
            <p css={styles.root}>
                <span
                    css={[
                        styles.inner,
                        (salePrice || valuePrice) && styles.innerSale,
                        {
                            flexWrap: isReplenishmentEligible ? 'wrap' : 'nowrap',
                            paddingBottom: isSmallView && isCanada ? space[2] : '0'
                        }
                    ]}
                >
                    <span css={styles.pricingWrapper}>
                        {salePrice && (
                            <>
                                <b
                                    css={styles.salePrice}
                                    children={salePrice}
                                />{' '}
                            </>
                        )}
                        <b
                            css={salePrice && styles.priceStrikethrough}
                            children={getPrice(sku)}
                        />
                        {valuePrice && (
                            <>
                                {' '}
                                {!highlightValueHidden ? (
                                    <span children={valuePrice} />
                                ) : (
                                    <span
                                        css={styles.valuePrice}
                                        children={formattedValuePrice}
                                    />
                                )}
                            </>
                        )}
                    </span>
                    {isExternallySellable ? null : (
                        <>
                            {(isKlarnaPaymentEnabled || isAfterpayEnabled || isPayPalPayLaterEligibleEnabled) && (
                                <KlarnaMarketing
                                    isSmallView={isSmallView}
                                    isAfterpayEnabled={isAfterpayEnabled}
                                    isKlarnaEnabled={isKlarnaPaymentEnabled}
                                    isPayPalPayLaterEligibleEnabled={isPayPalPayLaterEligibleEnabled}
                                    sku={{
                                        listPrice,
                                        salePrice
                                    }}
                                    analyticsPageType={anaConsts.PAGE_TYPES.PRODUCT}
                                    analyticsContext={anaConsts.CONTEXT.PRODUCTPAGE}
                                    displayBnplAsContents={displayBnplAsContents}
                                />
                            )}
                        </>
                    )}
                </span>
            </p>
            {isReplenishmentEligible && replenishMessage()}
        </>
    );
}

const styles = {
    root: {
        display: 'flex',
        alignItems: 'center',
        fontSize: fontSizes.md,
        lineHeight: lineHeights.tight,
        minHeight: 35
    },
    inner: {
        display: 'flex',
        alignItems: 'baseline'
    },
    innerSale: {
        flexDirection: 'column'
    },
    pricingWrapper: {
        marginRight: '.25em',
        minWidth: 'auto',
        whiteSpace: 'nowrap'
    },
    salePrice: {
        color: colors.red
    },
    priceStrikethrough: {
        textDecoration: 'line-through',
        fontWeight: 'var(--font-weight-normal)'
    },
    valuePrice: {
        backgroundColor: colors.red,
        color: colors.white,
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.xs,
        padding: `${space[1]}px ${space[2]}px`,
        borderRadius: radii[2],
        verticalAlign: 'middle',
        position: 'relative',
        lineHeight: lineHeights.relaxed,
        top: '-1px'
    }
};

export default wrapFunctionalComponent(Price, 'Price');
