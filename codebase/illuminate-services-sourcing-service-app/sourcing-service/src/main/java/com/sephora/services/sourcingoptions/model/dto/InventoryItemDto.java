package com.sephora.services.sourcingoptions.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

public class InventoryItemDto {
    @ApiModelProperty(value = "${Inventory.itemId.value}", required = true, position = 0)
    @JsonProperty("itemId")
    private String itemId;

    @ApiModelProperty(value = "${InventoryModel.infiniteFlag.value}", required = true, position = 1)
    @JsonProperty("infiniteInventory")
    private Boolean infiniteInventory = false;

    @ApiModelProperty(value = "${Inventory.inventoryInfo.value}", position = 2)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<InventoryInfoDto> inventoryInfo;

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

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }
    
}

