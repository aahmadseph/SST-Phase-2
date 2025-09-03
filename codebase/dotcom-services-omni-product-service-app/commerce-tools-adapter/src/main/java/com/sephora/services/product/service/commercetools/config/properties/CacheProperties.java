package com.sephora.services.product.service.commercetools.config.properties;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

@ConfigurationProperties(prefix = "sephora.cache.cache2k")
@Getter
@Setter
@NoArgsConstructor
public class CacheProperties extends BaseCacheProperties {

    private Map<String, BaseCacheProperties> caches = new HashMap<>();

}
