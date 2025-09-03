package com.sephora.services.sourcingoptions.model.dto;

import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;

/**
 * @author Vitaliy Oleksiyenko
 */
public class ItemDto implements Serializable {

    @ApiModelProperty(value = "${SourcingOptionsRequest.items.itemId.value}", required = true)
    @NotNull
    private String itemId;

    @ApiModelProperty(value = "${SourcingOptionsRequest.items.requiredQuantity.value}", required = true)
    @NotNull
    @Positive
    private Integer requiredQuantity;

    private boolean isAvailable;

    private String shipNode;

    private String unavailableReason;

    private Integer maxShipNodeQuantity;

    private Integer totalAvailableQuantity;

    /**
     * @return the sku
     */
    public String getItemId() {
        return itemId;
    }

    /**
     * @param itemId the sku to set
     */
    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    /**
     * @return the requiredQuantity
     */
    public Integer getRequiredQuantity() {
        return requiredQuantity;
    }

    /**
     * @param requiredQuantity the requiredQuantity to set
     */
    public void setRequiredQuantity(Integer requiredQuantity) {
        this.requiredQuantity = requiredQuantity;
    }

    /**
     * @return the available
     */
    public boolean isAvailable() {
        return isAvailable;
    }

    /**
     * @param available the available to set
     */
    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    /**
     * @return the shipNode
     */
    public String getShipNode() {
        return shipNode;
    }

    /**
     * @param shipNode the shipNode to set
     */
    public void setShipNode(String shipNode) {
        this.shipNode = shipNode;
    }

    /**
     * @return the unavailableReason
     */
    public String getUnavailableReason() {
        return unavailableReason;
    }

    /**
     * @param unavailableReason the unavailableReason to set
     */
    public void setUnavailableReason(String unavailableReason) {
        this.unavailableReason = unavailableReason;
    }

    /**
     * @return the maxShipNodeQuantity
     */
    public Integer getMaxShipNodeQuantity() {
        return maxShipNodeQuantity;
    }

    /**
     * @param maxShipNodeQuantity the maxShipNodeQuantity to set
     */
    public void setMaxShipNodeQuantity(Integer maxShipNodeQuantity) {
        this.maxShipNodeQuantity = maxShipNodeQuantity;
    }

    /**
     * @return the totalAvailableQuantity
     */
    public Integer getTotalAvailableQuantity() {
        return totalAvailableQuantity;
    }

    /**
     * @param totalAvailableQuantity the totalAvailableQuantity to set
     */
    public void setTotalAvailableQuantity(Integer totalAvailableQuantity) {
        this.totalAvailableQuantity = totalAvailableQuantity;
    }


    public static final class Builder {
        private String itemId;
        private Integer requiredQuantity;
        private boolean isAvailable;
        private String shipNode;
        private String unavailableReason;
        private Integer maxShipNodeQuantity;
        private Integer totalAvailableQuantity;

        private Builder() {
        }

        public static Builder anItemDto() {
            return new Builder();
        }

        public Builder withItemId(String itemId) {
            this.itemId = itemId;
            return this;
        }

        public Builder withRequiredQuantity(Integer requiredQuantity) {
            this.requiredQuantity = requiredQuantity;
            return this;
        }

        public Builder withIsAvailable(boolean isAvailable) {
            this.isAvailable = isAvailable;
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

        public Builder withMaxShipNodeQuantity(Integer maxShipNodeQuantity) {
            this.maxShipNodeQuantity = maxShipNodeQuantity;
            return this;
        }

        public Builder withTotalAvailableQuantity(Integer totalAvailableQuantity) {
            this.totalAvailableQuantity = totalAvailableQuantity;
            return this;
        }

        public ItemDto build() {
            ItemDto itemDto = new ItemDto();
            itemDto.setItemId(itemId);
            itemDto.setRequiredQuantity(requiredQuantity);
            itemDto.setShipNode(shipNode);
            itemDto.setUnavailableReason(unavailableReason);
            itemDto.setMaxShipNodeQuantity(maxShipNodeQuantity);
            itemDto.setTotalAvailableQuantity(totalAvailableQuantity);
            itemDto.isAvailable = this.isAvailable;
            return itemDto;
        }
    }
}
