package com.sephora.services.product.service.commercetools.service.impl;

import com.commercetools.api.models.product_type.ProductType;
import com.sephora.services.product.service.commercetools.repository.ProductTypeRepository;
import com.sephora.services.product.service.commercetools.service.ProductTypeService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.stereotype.Service;

import static com.sephora.services.product.service.commercetools.config.CachingConfig.CACHE2K_CACHE_MANAGER;
import static com.sephora.services.product.service.commercetools.config.CachingConfig.PRODUCT_TYPE_CACHE_NAME;
import static com.sephora.services.product.service.commercetools.config.RedisCacheConfig.REDIS_CACHE_MANAGER;
import static java.util.Objects.nonNull;

@Service
@Slf4j
public class ProductTypeServiceImpl implements ProductTypeService {

    private final ProductTypeRepository productTypeRepository;
    private final CacheManager cacheManager;
    private final RedisCacheManager redisCacheManager;

    public ProductTypeServiceImpl(ProductTypeRepository productTypeRepository,
                                  @Qualifier(CACHE2K_CACHE_MANAGER)
                                  CacheManager cacheManager,
                                  @Qualifier(REDIS_CACHE_MANAGER)
                                  ObjectProvider<RedisCacheManager> redisCacheManager) {
        this.productTypeRepository = productTypeRepository;
        this.cacheManager = cacheManager;
        this.redisCacheManager = redisCacheManager.getIfAvailable();
    }

    public void loadProductTypes() {
        try {
            var productTypes = productTypeRepository.getProductTypes();
            if (CollectionUtils.isNotEmpty(productTypes)) {
                productTypes.forEach(this::putProductTypeToCache);
            }
        } catch (Exception e) {
            // Log the exception or handle it as needed
            log.error("Error loading product types into cache: {}", e.getMessage());
        }

    }

    private void putProductTypeToCache(ProductType productType) {
        var cache = cacheManager.getCache(PRODUCT_TYPE_CACHE_NAME);
        if (nonNull(cache) && nonNull(productType) && nonNull(productType.getId())) {
            cache.put(productType.getId(), productType);
        }


        if (redisCacheManager != null) {
            var redisCache = redisCacheManager.getCache(PRODUCT_TYPE_CACHE_NAME);
            if (nonNull(redisCache) && nonNull(productType) && nonNull(productType.getId())) {
                redisCache.put(productType.getId(), productType);
            }
        }
    }

}
