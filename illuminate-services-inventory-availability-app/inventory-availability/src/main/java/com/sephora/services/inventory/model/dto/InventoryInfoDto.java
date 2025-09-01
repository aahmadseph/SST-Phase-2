package com.sephora.services.inventory.model.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@ApiModel(value = "InventoryInfo")
public class InventoryInfoDto {

    @ApiModelProperty(value = "${InventoryModel.shipNode.value}", required = true)
    private String shipNode;

    @ApiModelProperty(value = "${InventoryModel.shipNodeStatus.value}", required = true)
    private String shipNodeStatus;

    @ApiModelProperty(value = "${InventoryModel.quantity.value}", required = true)
    private Long quantity;

    public String getShipNode() {
        return shipNode;
    }

    public void setShipNode(String shipNode) {
        this.shipNode = shipNode;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public String getShipNodeStatus() {
        return shipNodeStatus;
    }

    public void setShipNodeStatus(String shipNodeStatus) {
        this.shipNodeStatus = shipNodeStatus;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("shipNode", shipNode)
                .append("quantity", quantity)
                .append("shipNodeStatus", shipNodeStatus)
                .toString();
    }

    public static final class Builder {
        private String shipNode;
        private String shipNodeStatus;
        private Long quantity;

        private Builder() {
        }

        public static Builder anInventoryInfoDto() {
            return new Builder();
        }

        public Builder withShipNode(String shipNode) {
            this.shipNode = shipNode;
            return this;
        }

        public Builder withShipNodeStatus(String shipNodeStatus) {
            this.shipNodeStatus = shipNodeStatus;
            return this;
        }

        public Builder withQuantity(Long quantity) {
            this.quantity = quantity;
            return this;
        }

        public InventoryInfoDto build() {
            InventoryInfoDto inventoryInfoDto = new InventoryInfoDto();
            inventoryInfoDto.setShipNode(shipNode);
            inventoryInfoDto.setShipNodeStatus(shipNodeStatus);
            inventoryInfoDto.setQuantity(quantity);
            return inventoryInfoDto;
        }
    }
}