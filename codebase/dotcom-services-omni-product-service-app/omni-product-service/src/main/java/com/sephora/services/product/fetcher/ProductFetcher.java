package com.sephora.services.product.fetcher;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import com.netflix.graphql.dgs.DgsEntityFetcher;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import com.sephora.services.product.model.Product;
import com.sephora.services.product.model.Sku;
import com.sephora.services.product.model.StandardLocaleEnum;
import com.sephora.services.product.service.ProductService;
import com.sephora.services.product.service.SkuService;
import com.sephora.services.product.service.commercetools.model.NonSellableSkuDto;
import com.sephora.services.product.service.commercetools.model.ProductDtoWithIdOnly;
import com.sephora.services.product.service.commercetools.model.SkuDto;
import com.sephora.services.product.service.commercetools.model.SkuDtoWithIdOnly;
import graphql.schema.SelectedField;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@DgsComponent
public class ProductFetcher {

    public static final String SKU_ID = "skuId";
    public static final String PRODUCT_ID = "productId";
    public static final String LOCALE = "locale";
    private final ProductService productService;
    private final SkuService skuService;

    @DgsQuery(field = "products")
    public Set<Product> getProductsById(@InputArgument List<String> productIds, @InputArgument String locale,
                                        DgsDataFetchingEnvironment dfe) {
       /* var fields = dfe.getSelectionSet().getFields().stream()
                .map(SelectedField::getNa
                .collect(Collectors.toSet());*/
        log.debug("Fetching products with IDs: {} and locale: {}", productIds, locale);
        return productService.getProductsByIds(productIds, StandardLocaleEnum.fromString(locale).getLocale());
    }

    @DgsQuery(field = "skus")
    public Set<Sku> getSkusById(@InputArgument List<String> skuIds, @InputArgument String locale,
                                DgsDataFetchingEnvironment dfe) {
        log.debug("Fetching skus with IDs: {} and locale: {}", skuIds, locale);
        return skuService.getSkusById(skuIds, StandardLocaleEnum.fromString(locale).getLocale());
    }

    @DgsEntityFetcher(name = "Product")
    public Product product(Map<String, Object> values, DgsDataFetchingEnvironment dfe) {
        var id = (String) values.get(PRODUCT_ID);
        var locale = (String) values.get(LOCALE);
        if (StringUtils.isBlank(id)) {
            log.warn("Product ID is null or blank, returning null");
            return null;
        }
        log.debug("Fetching product entity with ID: {} and locale {}", id, locale);
        return productService.getProductById(id, StandardLocaleEnum.fromString(locale).getLocale());
    }

    @DgsEntityFetcher(name = "Sku")
    public Sku sku(Map<String, Object> values, DgsDataFetchingEnvironment dfe) {
        var id = (String) values.get(SKU_ID);
        var locale = (String) values.get(LOCALE);
        if (StringUtils.isBlank(id)) {
            log.warn("Sku ID is null or blank, returning null");
            return null;
        }
        log.debug("Fetching sku entity with ID: {} and locale {}", id, locale);
        return skuService.getSkuById(id, StandardLocaleEnum.fromString(locale).getLocale());
    }

    @DgsData(parentType = "Product", field = "skus")
    public Set<Sku> skus(DgsDataFetchingEnvironment dataFetchingEnvironment) {
        var onlyIdField = isOnlySkuIdField(dataFetchingEnvironment);
        Product product = dataFetchingEnvironment.getSource();
        if (product != null) {
            log.debug("Retrieving skus for product: {}", product.getProductId());
            var skus = product.getSkus();
            if (product.isNonSellable() && CollectionUtils.isEmpty(skus)) {
                // For non-sellable product
                // The product contains only master variant
                log.debug("Product {} is non-sellable, fetching skus by primary product ID", product.getProductId());
                return skuService.getSkusByPrimaryProductId(product.getProductId(), product.getLocale().getLocale(), onlyIdField);
            }
            return skus;
        }
        return null;
    }

    @DgsData(parentType = "Sku", field = "parentProducts")
    public Set<Product> parentProducts(DgsDataFetchingEnvironment dataFetchingEnvironment) {
        Sku sku = dataFetchingEnvironment.getSource();
        if (sku instanceof SkuDto skuDto) {
            log.debug("Retrieving parentProducts for sku: {}", sku.getSkuId());
            if (!CollectionUtils.isEmpty(skuDto.getParentProductIds())) {
                if (isOnlyProductIdField(dataFetchingEnvironment)) {
                    return skuDto.getParentProductIds().stream()
                            .map(ProductDtoWithIdOnly::of)
                            .collect(Collectors.toSet());
                }
                return skuDto.getParentProductIds().stream()
                        .map(id -> productService.getProductById(id, sku.getLocale().getLocale()))
                        .collect(Collectors.toSet());
            }
        }
        return null;
    }

    private boolean isOnlyProductIdField(DgsDataFetchingEnvironment dataFetchingEnvironment) {
        var fields = dataFetchingEnvironment.getSelectionSet().getFields().stream()
                .map(SelectedField::getName)
                .collect(Collectors.toSet());
        return fields.size() == 1 && fields.contains(PRODUCT_ID);
    }

    private boolean isOnlySkuIdField(DgsDataFetchingEnvironment dataFetchingEnvironment) {
        var fields = dataFetchingEnvironment.getSelectionSet().getFields().stream()
                .map(SelectedField::getName)
                .collect(Collectors.toSet());
        return fields.size() == 1 && fields.contains(SKU_ID);
    }

    @DgsData(parentType = "Sku", field = "fullSizeSku")
    public Sku fullSizeSku(DgsDataFetchingEnvironment dataFetchingEnvironment) {
        Sku sku = dataFetchingEnvironment.getSource();
        if (sku != null && sku.getFullSizeSkuId() != null) {
            var onlyIdField = isOnlySkuIdField(dataFetchingEnvironment);
            var fullSizeSkuId = sku.getFullSizeSkuId();
            if (onlyIdField) {
                return SkuDtoWithIdOnly.of(fullSizeSkuId);
            }
            log.debug("Retrieving full size skus {} for sku: {}", fullSizeSkuId, sku.getSkuId());
            return skuService.getSkuById(fullSizeSkuId, sku.getLocale().getLocale());
        }
        return null;
    }

    @DgsData(parentType = "Sku", field = "originalSampleProduct")
    public Product originalSampleProduct(DgsDataFetchingEnvironment dataFetchingEnvironment) {
        Sku sku = dataFetchingEnvironment.getSource();
        if (sku instanceof NonSellableSkuDto nonSellableSkuDto) {
            var product = nonSellableSkuDto.getOriginalSampleProduct();
            if (product != null) {
                log.debug("Found original sample product ad reference object: {}", sku.getSkuId());
                return product;
            }
            var onlyIdField = isOnlyProductIdField(dataFetchingEnvironment);
            var productId = sku.getFullSizeSkuId();
            if (onlyIdField) {
                return ProductDtoWithIdOnly.of(productId);
            }
            log.debug("Retrieving original sample product {} for sku: {}", productId, sku.getSkuId());
            return productService.getProductById(productId, sku.getLocale().getLocale());
        }
        return null;
    }
}
