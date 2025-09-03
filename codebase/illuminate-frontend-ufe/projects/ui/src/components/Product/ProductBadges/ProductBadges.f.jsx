import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors, lineHeights } from 'style/config';
import skuUtils from 'utils/Sku';
import languageLocale from 'utils/LanguageLocale';
import rougeExclusiveUtils from 'utils/rougeExclusive';

const getText = languageLocale.getLocaleResourceFile('components/Product/ProductBadges/locales', 'ProductBadges');

function ProductBadges(fullProps) {
    const {
        sku, top = 0, left = 0, position = 'absolute', isSmall
    } = fullProps;
    const biExclusiveLevel = sku.biExclusiveLevel;

    const styles = {
        root: {
            position,
            top,
            left,
            color: colors.white,
            fontWeight: 'var(--font-weight-bold)',
            fontSize: isSmall ? 9 : 11,
            lineHeight: lineHeights.base,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
        },
        badge: {
            display: 'flex',
            alignItems: 'center',
            height: isSmall ? 15 : 16,
            backgroundColor: colors.black,
            marginBottom: isSmall ? 2 : '.25em',
            padding: '0 .375em'
        },
        rougeExclusiveBadge: {
            display: 'flex',
            alignItems: 'center',
            height: isSmall ? 15 : 16,
            backgroundColor: colors.red,
            borderRadius: 4,
            marginBottom: isSmall ? 2 : '.25em',
            padding: '0 .375em'
        }
    };

    return (
        <div
            css={styles.root}
            data-at={Sephora.debug.dataAt('product_badges')}
        >
            {sku.isNew && <div css={[styles.badge, isSmall && { fontSize: 10 }]}>{getText('newText')}</div>}
            {(biExclusiveLevel === skuUtils.biExclusiveLevels.ROUGE ||
                biExclusiveLevel === skuUtils.biExclusiveLevels.VIB ||
                biExclusiveLevel === skuUtils.biExclusiveLevels.BI) && (
                <div
                    css={rougeExclusiveUtils.isRougeExclusiveEnabled ? styles.rougeExclusiveBadge : styles.badge}
                    children={rougeExclusiveUtils.isRougeExclusiveEnabled ? getText('rougeBadge') : 'ROUGE'}
                />
            )}
            {(biExclusiveLevel === skuUtils.biExclusiveLevels.VIB || biExclusiveLevel === skuUtils.biExclusiveLevels.BI) && (
                <div
                    css={styles.badge}
                    children='VIB'
                />
            )}
            {biExclusiveLevel === skuUtils.biExclusiveLevels.BI && (
                <div
                    css={styles.badge}
                    children='INSIDER'
                />
            )}
        </div>
    );
}

ProductBadges.shouldUpdatePropsOn = ['sku.skuId', 'sku.actionFlags'];

export default wrapFunctionalComponent(ProductBadges, 'ProductBadges');
