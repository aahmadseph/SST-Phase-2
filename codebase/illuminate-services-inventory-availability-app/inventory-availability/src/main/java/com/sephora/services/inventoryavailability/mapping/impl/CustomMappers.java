package com.sephora.services.inventoryavailability.mapping.impl;

import org.springframework.stereotype.Component;

import com.sephora.services.inventoryavailability.model.cosmos.EnterpriseCodeEnum;


@Component
public class CustomMappers {

    public String toString(EnterpriseCodeEnum enterpriseCodeEnum) {
        return enterpriseCodeEnum.toValue();
    }
}