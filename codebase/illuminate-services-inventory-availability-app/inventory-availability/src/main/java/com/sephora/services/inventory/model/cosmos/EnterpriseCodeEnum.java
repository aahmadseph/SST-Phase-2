package com.sephora.services.inventory.model.cosmos;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;


/**
 * @author Vitaliy Oleksiyenko
 */
public enum EnterpriseCodeEnum {
    SEPHORAUS,
    SEPHORACA;

    private static Map<String, EnterpriseCodeEnum> namesMap =
            new HashMap<>(2);

    static {
        for (EnterpriseCodeEnum enterpriseCode : EnterpriseCodeEnum.values()) {
            namesMap.put(enterpriseCode.name().toLowerCase(), enterpriseCode);
        }

    }

    public static EnterpriseCodeEnum forValue(String value) {
        return namesMap.get(StringUtils.lowerCase(value));
    }

    public String toValue() {
        return this.name();
    }

}
