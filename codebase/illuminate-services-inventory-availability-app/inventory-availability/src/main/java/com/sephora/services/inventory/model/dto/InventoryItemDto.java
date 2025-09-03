package com.sephora.services.inventory.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@ApiModel(value = "InventoryItem")
public class InventoryItemDto {
    @ApiModelProperty(value = "${Inventory.itemId.value}", required = true, position = 0)
    @JsonProperty("itemId")
    private String itemId;

    @ApiModelProperty(value = "${InventoryModel.infiniteFlag.value}", required = true, position = 1)
    @JsonProperty("infiniteInventory")
    private Boolean infiniteInventory;

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

    public static final class InventoryItemBuilder {
        private String itemId;
        private Boolean infiniteInventory;
        private List<InventoryInfoDto> inventoryInfoList;

        private InventoryItemBuilder() {
        }

        public static InventoryItemBuilder anInventoryItemDto() {
            return new InventoryItemBuilder();
        }

        public InventoryItemBuilder withItemId(String itemId) {
            this.itemId = itemId;
            return this;
        }

        public InventoryItemBuilder withInfiniteInventory(Boolean infiniteInventory) {
            this.infiniteInventory = infiniteInventory;
            return this;
        }

        public InventoryItemBuilder withInventoryInfo(InventoryInfoDto inventoryInfo) {
            if (inventoryInfoList == null) {
                inventoryInfoList = new ArrayList<>();
            }
            if(!StringUtils.isEmpty(inventoryInfo.getShipNode())) {
                this.inventoryInfoList.add(inventoryInfo);    
            }
            
            return this;
        }

        public InventoryItemDto build() {
            InventoryItemDto inventoryItemDto = new InventoryItemDto();
            inventoryItemDto.setItemId(itemId);
            inventoryItemDto.setInfiniteInventory(infiniteInventory);
            inventoryItemDto.setInventoryInfo(inventoryInfoList);
            return inventoryItemDto;
        }
    }

}
