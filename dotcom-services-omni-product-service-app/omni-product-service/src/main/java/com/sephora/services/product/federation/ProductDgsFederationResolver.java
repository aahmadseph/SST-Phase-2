package com.sephora.services.product.federation;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.federation.DefaultDgsFederationResolver;
import com.sephora.services.product.service.commercetools.model.MerchSkuDto;
import com.sephora.services.product.service.commercetools.model.NonSellableSkuDto;
import com.sephora.services.product.service.commercetools.model.ProductDto;
import com.sephora.services.product.service.commercetools.model.SkuDto;
import org.jetbrains.annotations.NotNull;

import java.util.Map;

@DgsComponent
public class ProductDgsFederationResolver extends DefaultDgsFederationResolver {

    public static final String PRODUCT_TYPE_NAME = "Product";
    public static final String SKU_TYPE_NAME = "Sku";
    public static final Map<Class<?>, String> TYPE_MAPPING = Map.of(
            ProductDto.class, PRODUCT_TYPE_NAME,
            SkuDto.class, SKU_TYPE_NAME,
            MerchSkuDto.class, SKU_TYPE_NAME,
            NonSellableSkuDto.class, SKU_TYPE_NAME
    );

    @Override
    public @NotNull Map<Class<?>, String> typeMapping() {
        return TYPE_MAPPING;
    }
}
