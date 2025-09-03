package com.sephora.services.product.service.commercetools.cache;

import org.cache2k.io.BulkCacheLoader;
import org.cache2k.io.CacheLoader;

public interface CacheLoaderProvider {

    CacheLoader<Object, Object> getLoader(String cacheName);

    BulkCacheLoader<Object, Object> getBulkLoader(String cacheName);

}
