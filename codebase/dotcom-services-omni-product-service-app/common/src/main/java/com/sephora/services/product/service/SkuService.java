package com.sephora.services.product.service;

import com.sephora.services.product.model.Sku;

import java.util.List;
import java.util.Locale;
import java.util.Set;

public interface SkuService {

    Set<Sku> getSkusById(List<String> skuIds, Locale locale);

    default Sku getSkuById(String skuId, Locale locale) {
        return getSkusById(List.of(skuId), locale).stream().findFirst().orElse(null);
    }

    Set<Sku> getSkusByPrimaryProductId(String productId, Locale locale,  boolean onlyIdField);

}
