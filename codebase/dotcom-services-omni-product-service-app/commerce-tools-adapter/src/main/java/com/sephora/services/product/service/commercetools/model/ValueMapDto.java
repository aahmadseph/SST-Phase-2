package com.sephora.services.product.service.commercetools.model;

import lombok.Getter;
import org.apache.commons.collections4.MapUtils;

import java.util.Map;

@Getter
public class ValueMapDto {

    private final Map<String, Object> valueMap;

    public ValueMapDto(Map<String, Object> valueMap) {
        if (MapUtils.isEmpty(valueMap)) {
            this.valueMap = Map.of();
        } else {
            this.valueMap = valueMap;
        }
    }

    @SuppressWarnings("unchecked")
    protected <T> T getValue(String key) {
        return (T) valueMap.get(key);
    }

}
