package com.sephora.services.product.service.commercetools.model;

import com.commercetools.api.models.product.ProductProjection;
import com.commercetools.api.models.product.ProductVariant;
import com.sephora.services.product.model.NonSellableSku;
import com.sephora.services.product.model.Product;
import com.sephora.services.product.model.RewardSubTypeEnum;
import com.sephora.services.product.model.RewardTypeEnum;
import com.sephora.services.product.model.Sku;
import com.sephora.services.product.service.commercetools.utils.NonSellableSkuUtils;
import com.sephora.services.product.service.commercetools.utils.ProductUtils;
import com.sephora.services.product.service.commercetools.utils.SkuUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.Serial;
import java.util.Locale;

import static com.sephora.services.product.service.commercetools.utils.SkuUtils.PRODUCT_KEY_DELIMITER;

/*
 * Adapter class for adapt CT model to common model.
 */
public class NonSellableSkuDto extends SkuDto implements NonSellableSku {

    @Serial
    private static final long serialVersionUID = 2827289010475448675L;

    public NonSellableSkuDto(ProductProjection productProjection, ProductVariant productVariant, Locale locale) {
        super(productProjection, productVariant, locale);
    }

    @Override
    public Double getRewardCurrencyAmount() {
        return NonSellableSkuUtils.getRewardCurrencyAmount(attributesAccessor);
    }

    @Override
    public Double getRewardPoints() {
        return NonSellableSkuUtils.getRewardPoints(attributesAccessor);
    }

    @Override
    public Sku getFullSizeSku() {
        var productData = NonSellableSkuUtils.getFullSizeProductData(attributesAccessor);
        if (productData != null) {
            String productId = NonSellableSkuUtils.getFullSizeProductId(attributesAccessor);
            String skuId = SkuUtils.getFullSizeSkuId(attributesAccessor);
            var variantKey = productId + PRODUCT_KEY_DELIMITER + skuId;
            var productVariant = ProductUtils.getAllVariants(productData).stream()
                    .filter(variant -> variantKey.equalsIgnoreCase(variant.getKey()))
                    .findFirst()
                    .orElse(null);
            if (productVariant != null) {
                return new SkuDto(ProductUtils.getProductId(productVariant.getKey()), productData.getName(), productVariant, locale);
            }
        }
        return null;
    }

    @Override
    public String getFullSizeProductId() {
        return NonSellableSkuUtils.getFullSizeProductId(attributesAccessor);
    }

    @Override
    public Boolean isRewardActive() {
        return NonSellableSkuUtils.getIsRewardActive(attributesAccessor);
    }

    @Override
    public Product getOriginalSampleProduct() {
        return NonSellableSkuUtils.getOriginalSampleProduct(attributesAccessor, locale);
    }

    @Override
    public String getOriginalSampleProductId() {
        return NonSellableSkuUtils.getOriginalSampleProductId(attributesAccessor);
    }

    @Override
    public RewardSubTypeEnum getRewardSubType() {
        return NonSellableSkuUtils.getRewardSubType(attributesAccessor);
    }

    @Override
    public RewardTypeEnum rewardType() {
        return NonSellableSkuUtils.getRewardType(attributesAccessor);
    }

    @Override
    public Boolean isNonsellable() {
        return StringUtils.isNotEmpty(NonSellableSkuUtils.getNonSellableType(attributesAccessor));
    }

    @Override
    public String getNonSellableType() {
        return NonSellableSkuUtils.getNonSellableType(attributesAccessor);
    }

    @Override
    protected boolean isNonSellable() {
        return true;
    }
}
