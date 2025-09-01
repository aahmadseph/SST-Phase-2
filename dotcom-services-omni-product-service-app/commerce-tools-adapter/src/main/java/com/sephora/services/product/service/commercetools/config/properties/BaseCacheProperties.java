package com.sephora.services.product.service.commercetools.config.properties;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Duration;

@Setter
@Getter
@NoArgsConstructor
public class BaseCacheProperties {
    private Duration expireAfterWrite;
    private Long entryCapacity;
    private Boolean boostConcurrency;
    private Class<?> keyType = Object.class; // Default to Object for key type
    private Class<?> valueType = Object.class; // Default to Object for value type
    private Boolean keepDataAfterExpired;
    private Boolean enableUniversalResiliencePolicy;
    private Boolean enableLogging;
    private Boolean permitNullValues;
    private Boolean enabled;
}
