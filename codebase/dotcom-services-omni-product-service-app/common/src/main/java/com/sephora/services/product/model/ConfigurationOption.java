package com.sephora.services.product.model;

import java.io.Serializable;

public interface ConfigurationOption extends Serializable {

    String getConfigurationOptionId();

    ConfigurationOptionTypeEnum getType();

    String getUpc();

    String getSkuId();

    String getProductId();

    String getPrimaryProductId();

}
