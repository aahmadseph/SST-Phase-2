package com.sephora.services.product.service.impl;

import com.commercetools.api.models.product.ProductProjection;
import com.commercetools.api.models.product.ProductVariant;
import com.commercetools.api.models.product_type.ProductTypeReference;
import com.sephora.services.product.model.Sku;
import com.sephora.services.product.service.SkuService;
import com.sephora.services.product.service.commercetools.model.MerchSkuDto;
import com.sephora.services.product.service.commercetools.model.NonSellableSkuDto;
import com.sephora.services.product.service.commercetools.model.SkuDto;
import com.sephora.services.product.service.commercetools.model.SkuDtoWithIdOnly;
import com.sephora.services.product.service.commercetools.repository.ProductProjectionRestRepository;
import com.sephora.services.product.service.commercetools.service.ProductProjectionService;
import com.sephora.services.product.service.commercetools.utils.ProductTypeUtils;
import com.sephora.services.product.service.commercetools.utils.ProductUtils;
import com.sephora.services.product.service.commercetools.utils.SkuUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static com.sephora.services.product.service.commercetools.utils.AttributesConstants.PRIMARY_PRODUCT;
import static java.util.Objects.nonNull;

@Component
@RequiredArgsConstructor
public class SkuServiceImpl implements SkuService {

    private final ProductProjectionRestRepository productProjectionRestRepository;

    private final ProductTypeUtils productTypeUtils;

    private final ProductProjectionService productProjectionService;

    @Override
    public Set<Sku> getSkusById(List<String> skuIds, Locale locale) {
        return getSkusByIdWithCache(skuIds, locale);
        //return getSkusByIdWithoutCache(skuIds, locale);
    }

    public Set<Sku> getSkusByIdWithCache(List<String> skuIds, Locale locale) {
        var productProjectionKeysMap = productProjectionService.getProductProjectionKeysBySkuId(skuIds);
        if (MapUtils.isNotEmpty(productProjectionKeysMap)) {
            var resultSet = new HashSet<Sku>(productProjectionKeysMap.size());

            var productProjectionKeysForAllSku = productProjectionKeysMap.values()
                    .stream()
                    .flatMap(Collection::stream)
                    .collect(Collectors.toSet());

            var map = productProjectionService.getProductProjectionMap(productProjectionKeysForAllSku);

            productProjectionKeysMap.forEach((skuId, productProjectionKeys) -> {
                if (!CollectionUtils.isEmpty(productProjectionKeys)) {
                    var firstKey = productProjectionKeys.iterator().next();
                    var productProjection = map.get(firstKey);
                    var productVariant = ProductUtils.getAllVariants(productProjection).stream()
                            .filter(variant -> Objects.equals(SkuUtils.getSkuId(variant.getKey()), skuId))
                            .findFirst()
                            .orElse(null);
                    if (nonNull(productVariant)) {
                        var sku = createSku(productProjection, productVariant, locale);
                        if (sku instanceof SkuDto skuDto) {
                            skuDto.setParentProductIds(productProjectionKeys.stream()
                                    .map(ProductUtils::getProductId)
                                    .collect(Collectors.toSet()));
                        }
                        resultSet.add(sku);
                    }
                }
            });
            return resultSet;
        }
        return Collections.emptySet();
    }

    public Set<Sku> getSkusByIdWithoutCache(List<String> skuIds, Locale locale) {
        var result = new HashMap<String, Sku>();
        var productProjections = productProjectionRestRepository.getProductVariantsBySkuIds(skuIds);
        if (!CollectionUtils.isEmpty(productProjections)) {
            for (ProductProjection productProjection : productProjections) {
                for (ProductVariant productVariant : ProductUtils.getAllVariants(productProjection)) {
                    if (BooleanUtils.isTrue(productVariant.getIsMatchingVariant())) {
                        var skuId = SkuUtils.getSkuId(productVariant.getSku());
                        if (!result.containsKey(skuId)) {
                            result.put(skuId, createSku(productProjection, productVariant, locale));
                        } else {
                            var sku = result.get(skuId);
                            if (sku instanceof SkuDto skuDto) {
                                skuDto.addParentProductId(ProductUtils.getProductId(productProjection.getKey()));
                            }
                        }
                    }
                }
            }
            return new HashSet<>(result.values());
        }
        return Set.of();
    }

    @Override
    public Set<Sku> getSkusByPrimaryProductId(String productId, Locale locale, boolean onlyIdField) {
        //return getSkusByPrimaryProductIdWithoutCaching(productId, locale);
        return getSkusByPrimaryProductIdWithCaching(productId, locale, onlyIdField);
    }

    private Set<Sku> getSkusByPrimaryProductIdWithoutCaching(String productId, Locale locale) {
        // retrieve product variant by primary product
        var productProjections = productProjectionRestRepository.getProductVariantsByPrimaryProduct(productId);
        if (!CollectionUtils.isEmpty(productProjections)) {
            var result = new HashSet<Sku>();
            for (ProductProjection productProjection : productProjections) {
                for (ProductVariant productVariant : ProductUtils.getAllVariants(productProjection)) {
                    var isMatchingVariant = productVariant.getIsMatchingVariant();
                    if (isMatchingVariant == null) {
                        var sku = createSku(productProjection, productVariant, locale);
                        if (Objects.equals(sku.getPrimaryProductId(), productId)) {
                            result.add(sku);
                        }
                    } else if (isMatchingVariant) {
                        result.add(createSku(productProjection, productVariant, locale));
                    }
                }
            }
            return result;
        }
        return Set.of();
    }

    private Set<Sku> getSkusByPrimaryProductIdWithCaching(String productId, Locale locale, boolean onlyIdField) {
        // retrieve product variant by primary product
        var productProjectionKeys = productProjectionService.getProductProjectionKeysPrimaryProductId(productId);
        if (!CollectionUtils.isEmpty(productProjectionKeys)) {
            if (onlyIdField) {
                return productProjectionKeys.stream()
                        .map(SkuUtils::getSkuId)
                        .map(SkuDtoWithIdOnly::of)
                        .collect(Collectors.toSet());
            }
            var map = productProjectionService.getProductProjectionMap(productProjectionKeys);
            var productProjections = map.values();
            if (!CollectionUtils.isEmpty(productProjections)) {
                var result = new HashSet<Sku>();
                for (ProductProjection productProjection : productProjections) {
                    var productVariant = ProductUtils.getAllVariants(productProjection).stream()
                            .filter(productVariant1 -> {
                                var primaryProduct = ProductUtils.getStringAttribute(productVariant1, PRIMARY_PRODUCT);
                                return Objects.equals(primaryProduct, productId);
                            })
                            .findFirst()
                            .orElse(null);
                    if (nonNull(productVariant)) {
                        var sku = createSku(productProjection, productVariant, locale);
                        if (sku instanceof SkuDto skuDto) {
                            skuDto.setParentProductIds(productProjectionKeys.stream()
                                    .map(ProductUtils::getProductId)
                                    .collect(Collectors.toSet()));
                        }
                        result.add(sku);
                    }
                }
                return result;
            }
        }

        return Set.of();
    }

    private Sku createSku(ProductProjection productProjection, ProductVariant productVariant, Locale locale) {
        var productType =
                Optional.ofNullable(productProjection.getProductType())
                        .map(ProductTypeReference::getId)
                        .map(productTypeUtils::getProductType)
                        .orElse(null);
        if (productType == null) {
            return new SkuDto(productProjection, productVariant, locale);
        }
        switch (productType) {
            case NON_SELLABLE -> {
                return new NonSellableSkuDto(productProjection, productVariant, locale);
            }
            case MERCH -> {
                return new MerchSkuDto(productProjection, productVariant, locale);
            }
            default -> {
                return new SkuDto(productProjection, productVariant, locale);
            }
        }
    }

}
