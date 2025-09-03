package com.sephora.services.sourcingoptions.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

/**
 * @author Vitaliy Oleksiyenko
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@ApiModel(value = "SourcingOptionsResponseItem")
public class SourcingOptionsResponseItemDto implements Serializable {

    @ApiModelProperty(value = "${SourcingOptionsResponse.items.itemId.value}", required = true)
    private String itemId;
    
    private String lineId;

    @ApiModelProperty(value = "${SourcingOptionsResponse.items.shipNode.value}")
    private String shipNode;

    @ApiModelProperty(value = "${SourcingOptionsResponse.items.unavailableReason.value}")
    private String unavailableReason;

    @ApiModelProperty(value = "${SourcingOptionsResponse.items.maxShipNodeQuantity.value}")
    private Long maxShipNodeQuantity;

    @ApiModelProperty(value = "${SourcingOptionsResponse.items.totalAvailableQuantity.value}")
    private Long totalAvailableQuantity;

    @ApiModelProperty(value = "${SourcingOptionsResponse.items.requestedQtyAvailable.values}", required = true)
    private boolean requestedQtyAvailable;
    
    private Integer requestedQuantity;

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getShipNode() {
        return shipNode;
    }

    public void setShipNode(String shipNode) {
        this.shipNode = shipNode;
    }

    public String getUnavailableReason() {
        return unavailableReason;
    }

    public void setUnavailableReason(String unavailableReason) {
        this.unavailableReason = unavailableReason;
    }

    public Long getMaxShipNodeQuantity() {
        return maxShipNodeQuantity;
    }

    public void setMaxShipNodeQuantity(Long maxShipNodeQuantity) {
        this.maxShipNodeQuantity = maxShipNodeQuantity;
    }

    public Long getTotalAvailableQuantity() {
        return totalAvailableQuantity;
    }

    public void setTotalAvailableQuantity(Long totalAvailableQuantity) {
        this.totalAvailableQuantity = totalAvailableQuantity;
    }

    public boolean isRequestedQtyAvailable() {
        return requestedQtyAvailable;
    }

    public void setRequestedQtyAvailable(boolean requestedQtyAvailable) {
        this.requestedQtyAvailable = requestedQtyAvailable;
    }
    
    public Integer getRequestedQuantity() {
		return requestedQuantity;
	}
    
	public void setRequestedQuantity(Integer requestedQuantity) {
		this.requestedQuantity = requestedQuantity;
	}
	
	public String getLineId() {
		return lineId;
	}
	
	public void setLineId(String lineId) {
		this.lineId = lineId;
	}

    @Override
    public String toString() {
        return "SourcingOptionsResponseItemDto{" +
                "itemId='" + itemId + '\'' +
                ", shipNode='" + shipNode + '\'' +
                ", unavailableReason='" + unavailableReason + '\'' +
                ", maxShipNodeQuantity=" + maxShipNodeQuantity +
                ", totalAvailableQuantity=" + totalAvailableQuantity +
                ", requestedQtyAvailable=" + requestedQtyAvailable +
                '}';
    }

    public static final class Builder {
        private String itemId;
        private String shipNode;
        private String unavailableReason;
        private Long maxShipNodeQuantity;
        private Long totalAvailableQuantity;
        private boolean requestedQtyAvailable;

        private Builder() {
        }

        public static Builder anItemResponseDto() {
            return new Builder();
        }

        public Builder withItemId(String skuId) {
            this.itemId = skuId;
            return this;
        }

        public Builder withShipNode(String shipNode) {
            this.shipNode = shipNode;
            return this;
        }

        public Builder withUnavailableReason(String unavailableReason) {
            this.unavailableReason = unavailableReason;
            return this;
        }

        public Builder withMaxShipNodeQuantity(Long maxShipNodeQuantity) {
            this.maxShipNodeQuantity = maxShipNodeQuantity;
            return this;
        }

        public Builder withTotalAvailableQuantity(Long totalAvailableQuantity) {
            this.totalAvailableQuantity = totalAvailableQuantity;
            return this;
        }

        public Builder withRequestedQtyAvailable(boolean requestedQtyAvailable) {
            this.requestedQtyAvailable = requestedQtyAvailable;
            return this;
        }

        public SourcingOptionsResponseItemDto build() {
            SourcingOptionsResponseItemDto itemDto = new SourcingOptionsResponseItemDto();
            itemDto.setItemId(itemId);
            itemDto.setShipNode(shipNode);
            itemDto.setUnavailableReason(unavailableReason);
            itemDto.setMaxShipNodeQuantity(maxShipNodeQuantity);
            itemDto.setTotalAvailableQuantity(totalAvailableQuantity);
            itemDto.setRequestedQtyAvailable(requestedQtyAvailable);
            return itemDto;
        }
    }
}
