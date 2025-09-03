package com.sephora.services.product.service.commercetools.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.cache.CacheProperties;

@Getter
@Setter
public class ExtendedRedisCacheProperties extends CacheProperties.Redis {

    private Boolean enableKryo;
    private Boolean enableCompression;
}
