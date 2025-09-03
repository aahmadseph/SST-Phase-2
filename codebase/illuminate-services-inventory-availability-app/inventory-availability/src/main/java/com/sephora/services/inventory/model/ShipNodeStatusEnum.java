package com.sephora.services.inventory.model;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

/**
 * @author Vitaliy Oleksiyenko
 */
public enum ShipNodeStatusEnum {
    ACTIVE,
    LOCKED;

    private static Map<String, ShipNodeStatusEnum> namesMap =
            new HashMap<>(2);

    static {
        for (ShipNodeStatusEnum status : ShipNodeStatusEnum.values()) {
            namesMap.put(status.name().toLowerCase(), status);
        }

    }

    public static ShipNodeStatusEnum forValue(String value) {
        return namesMap.get(StringUtils.lowerCase(value));
    }
}
