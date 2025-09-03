package com.sephora.services.inventory.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sephora.services.inventory.validation.ValidationConstants;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.ArrayList;
import java.util.List;

@ApiModel(value = "EnterpriseItem")
public class EnterpriseItemDto {

    @ApiModelProperty(value = "${InventoryModel.enterpriseCode.value}", required = true,
            allowableValues = ValidationConstants.ENTERPRISE_CODE_ALLOWED_VALUES)
    private String enterpriseCode;

    @ApiModelProperty(value = "${InventoryModel.infiniteFlag.value}", required = true)
    private Boolean infiniteInventory;

    @ApiModelProperty(value = "${InventoryModel.inventoryInfoList.value}")
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<InventoryInfoDto> inventoryInfo;

    public String getEnterpriseCode() {
        return enterpriseCode;
    }

    public void setEnterpriseCode(String enterpriseCode) {
        this.enterpriseCode = enterpriseCode;
    }

    public Boolean getInfiniteInventory() {
        return infiniteInventory;
    }

    public void setInfiniteInventory(Boolean infiniteInventory) {
        this.infiniteInventory = infiniteInventory;
    }

    public List<InventoryInfoDto> getInventoryInfo() {
        return inventoryInfo;
    }

    public void setInventoryInfo(List<InventoryInfoDto> inventoryInfo) {
        this.inventoryInfo = inventoryInfo;
    }

    public void addInventoryInfo(InventoryInfoDto inventoryInfoItem) {
        if (inventoryInfo == null) {
            inventoryInfo = new ArrayList<>();
        }
        inventoryInfo.add(inventoryInfoItem);
    }

    @Override
    public String toString() {
        return "EnterpriseItemDto{" +
                "enterpriseCode='" + enterpriseCode + '\'' +
                ", infiniteInventory=" + infiniteInventory +
                ", inventoryInfo=" + inventoryInfo +
                '}';
    }

    public static final class Builder {

        private String enterpriseCode;

        private Boolean infiniteInventory;

        private List<InventoryInfoDto> inventoryInfoList;

        private Builder() {
        }

        public static Builder anEnterpriseItemDto() {
            return new Builder();
        }

        public Builder withEnterpriseCode(String enterpriseCode) {
            this.enterpriseCode = enterpriseCode;
            return this;
        }

        public Builder withInfiniteInventory(Boolean infiniteInventory) {
            this.infiniteInventory = infiniteInventory;
            return this;
        }

        public Builder withInventoryInfo(InventoryInfoDto inventoryInfo) {
            if (inventoryInfoList == null) {
                inventoryInfoList = new ArrayList<>();
            }
            inventoryInfoList.add(inventoryInfo);
            return this;
        }

        public EnterpriseItemDto build() {
            EnterpriseItemDto inventoryItemDto = new EnterpriseItemDto();
            inventoryItemDto.setEnterpriseCode(enterpriseCode);
            inventoryItemDto.setInfiniteInventory(infiniteInventory);
            inventoryItemDto.setInventoryInfo(inventoryInfoList);
            return inventoryItemDto;
        }
    }
}