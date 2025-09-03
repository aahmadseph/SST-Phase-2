package com.sephora.services.inventory.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.sephora.services.inventory.validation.ValidationConstants;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"enterpriseCode"})
@ApiModel(value = "InventoryResponse")
public class InventoryResponseDto {

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
