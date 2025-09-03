package com.sephora.services.inventory.model.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;
import java.util.Optional;

@ApiModel(value = "GetInventoryItemDetails")
public class GetInventoryItemDetailsDto {

    @ApiModelProperty(value = "${InventoryModel.itemId.value}", required = true, position = 0)
    private String itemId;

    @ApiModelProperty(value = "${InventoryModel.enterprises.value}", required = true, position = 1)
    private List<EnterpriseItemDto> enterprises;

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public List<EnterpriseItemDto> getEnterprises() {
        return enterprises;
    }

    public void setEnterprises(List<EnterpriseItemDto> enterprises) {
        this.enterprises = enterprises;
    }

    public Optional<EnterpriseItemDto> getEnterpriseItem(String enterpriseCode) {
        return enterprises.stream()
                .filter(enterpriseItem -> enterpriseItem.getEnterpriseCode().equals(enterpriseCode)).findFirst();
    }

    @Override
    public String toString() {
        return "GetInventoryItemDetailsDto{" +
                "itemId='" + itemId + '\'' +
                ", enterprises=" + enterprises +
                '}';
    }

    public static final class Builder {

        private String itemId;

        private List<EnterpriseItemDto> enterpriseItemList;

        private Builder() {
        }

        public static Builder anEnterpriseItemList() {
            return new Builder();
        }

        public Builder withItemId(String itemId) {
            this.itemId = itemId;
            return this;
        }

        public Builder withEnterpriseItemList(List<EnterpriseItemDto> enterpriseItemList) {
            this.enterpriseItemList = enterpriseItemList;
            return this;
        }

        public GetInventoryItemDetailsDto build() {
            GetInventoryItemDetailsDto getInventoryItemDetailsDto = new GetInventoryItemDetailsDto();
            getInventoryItemDetailsDto.setItemId(itemId);
            getInventoryItemDetailsDto.setEnterprises(enterpriseItemList);
            return getInventoryItemDetailsDto;
        }
    }

}