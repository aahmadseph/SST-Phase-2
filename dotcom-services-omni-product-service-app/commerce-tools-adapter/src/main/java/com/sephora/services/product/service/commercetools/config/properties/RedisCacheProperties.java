package com.sephora.services.product.service.commercetools.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.cache.CacheProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

@ConfigurationProperties(prefix = "sephora.cache.redis")
@Getter
@Setter
public class RedisCacheProperties extends ExtendedRedisCacheProperties {
    private Map<String, ExtendedRedisCacheProperties> caches = new HashMap<>();
}
