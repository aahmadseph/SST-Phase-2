package com.sephora.services.sourcingoptions.model.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@ApiModel(value = "InventoryInfo")
public class InventoryInfoDto {

    @ApiModelProperty(value = "${InventoryModel.shipNode.value}", required = true)
    private String shipNode;

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

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("shipNode", shipNode)
                .append("quantity", quantity)
                .toString();
    }
}