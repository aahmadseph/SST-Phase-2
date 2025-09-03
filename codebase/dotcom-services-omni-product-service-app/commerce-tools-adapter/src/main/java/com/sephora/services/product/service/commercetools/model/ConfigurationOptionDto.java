package com.sephora.services.product.service.commercetools.model;

import com.sephora.services.product.model.ConfigurationOption;
import com.sephora.services.product.model.ConfigurationOptionTypeEnum;

import java.io.Serial;
import java.util.Map;

public class ConfigurationOptionDto extends ValueMapDto implements ConfigurationOption {

    @Serial
    private static final long serialVersionUID = -5443056526720296976L;

    private static final String TYPE = "type";
    private static final String UPC = "upc";
    private static final String SKU_ID = "skuId";
    private static final String PRODUCT_ID = "productId";
    private static final String PRIMARY_PRODUCT_ID = "primaryProductId";
    private static final String ID = "id";

    public ConfigurationOptionDto(Map<String, Object> valueMap) {
        super(valueMap);
    }

    @Override
    public ConfigurationOptionTypeEnum getType() {
        return ConfigurationOptionTypeEnum.fromString(getValue(TYPE));
    }

    @Override
    public String getUpc() {
        return getValue(UPC);
    }

    @Override
    public String getSkuId() {
        return getValue(SKU_ID);
    }

    @Override
    public String getProductId() {
        return getValue(PRODUCT_ID);
    }

    @Override
    public String getPrimaryProductId() {
        return getValue(PRIMARY_PRODUCT_ID);
    }

    @Override
    public String getConfigurationOptionId() {
        return getValue(ID);
    }
}
