package com.sephora.services.sourcingoptions.model.dto;

import com.sephora.services.sourcingoptions.validation.ValidationConstants;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

public class InventoryAvailabilityDto {

    @ApiModelProperty(value = "${Inventory.enterpriseCode.value}", required = true,
                      allowableValues = ValidationConstants.ENTERPRISE_CODE_ALLOWED_VALUES)
    private String enterpriseCode;

    @ApiModelProperty(value = "${Inventory.items.value}", required = true)
    private List<InventoryItemDto> items;

    public String getEnterpriseCode() {
        return enterpriseCode;
    }

    public void setEnterpriseCode(String enterpriseCode) {
        this.enterpriseCode = enterpriseCode;
    }

    public List<InventoryItemDto> getItems() {
        return items;
    }

    public void setItems(List<InventoryItemDto> items) {
        this.items = items;
    }
}
