/*
 *  This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 *  consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 *  Copyright  2019 sephora.com, Inc. All rights reserved.
 *
 */

package com.sephora.services.inventory.model.doc;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.sephora.services.inventory.model.EnterpriseCodeEnum;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.springframework.data.annotation.Id;

import java.io.Serializable;

import static com.sephora.services.inventoryavailability.cosmos.config.CosmosConfiguration.INVENTORY_COLLECTION;

@Container(containerName = INVENTORY_COLLECTION)
@CosmosIndexingPolicy(
        includePaths = { "/itemId/?", "/enterpriseCode/?", "/shipNode/?"},
        excludePaths = "/*" )
public class Inventory implements Serializable {

    @Id
    private String id;

    @PartitionKey
    private String itemId;

    private EnterpriseCodeEnum enterpriseCode;

    private String shipNode;

    private Long quantity;

    private String threshold;

    private Boolean infinite = Boolean.FALSE;

    // The number of milliseconds from the unix epoch, 1 January 1970 00:00:00.000 UTC
    private Long modifyts;

    /**
     * @return the id
     */
    public String getId() {
        return generatedId();
    }

    public void updateId() {
        this.id = generatedId();
    }

    public String generatedId() {
        return StringUtils.join(new String[]{getEnterpriseCodeString(), this.itemId, this.shipNode}, "_");
    }

    private String getEnterpriseCodeString(){
        if(null!=this.enterpriseCode)
            return enterpriseCode.name();
        else
            return "-";
    }
    /**
     * @return the itemId
     */
    public String getItemId() {
        return itemId;
    }

    /**
     * @param itemId the itemId to set
     */
    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    /**
     * @return the enterpriseCode
     */
    public EnterpriseCodeEnum getEnterpriseCode() {
        return enterpriseCode;
    }

    /**
     * @param enterpriseCode the enterpriseCode to set
     */
    public void setEnterpriseCode(EnterpriseCodeEnum enterpriseCode) {
        this.enterpriseCode = enterpriseCode;
    }

    /**
     * @return the threshold
     */
    public String getThreshold() {
        return threshold;
    }

    /**
     * @param threshold the threshold to set
     */
    public void setThreshold(String threshold) {
        this.threshold = threshold;
    }

    /**
     * @return the infinite
     */
    public Boolean getInfinite() {
        return infinite;
    }

    /**
     * @param infinite the infinite to set
     */
    public void setInfinite(Boolean infinite) {
        this.infinite = infinite;
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
     * @return the quantity
     */
    public Long getQuantity() {
        return quantity;
    }

    /**
     * @param quantity the quantity to set
     */
    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    /**
     * @return the modifyts
     */
    public Long getModifyts() {
        return modifyts;
    }

    /**
     * @param modifyts the modifyts to set
     */
    public void setModifyts(Long modifyts) {
        this.modifyts = modifyts;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("itemId", itemId)
                .append("enterpriseCode", enterpriseCode)
                .append("threshold", threshold)
                .append("shipNode", shipNode)
                .append("quantity", quantity)
                .append("infinite", infinite)
                .append("modifyts", modifyts)
                .toString();
    }

    public static final class Builder {
        private String itemId;
        private String enterpriseCode;
        private String shipNode;
        private Long quantity;
        private String threshold;
        private Long modifyTimestamp;
        private Boolean infinite = Boolean.FALSE;

        private Builder() {
        }

        public static Builder anInventory() {
            return new Builder();
        }

        public Builder withItemId(String itemId) {
            this.itemId = itemId;
            return this;
        }

        public Builder withEnterpriseCode(String enterpriseCode) {
            this.enterpriseCode = enterpriseCode;
            return this;
        }

        public Builder withShipNode(String shipNode) {
            this.shipNode = shipNode;
            return this;
        }

        public Builder withQuantity(Long quantity) {
            this.quantity = quantity;
            return this;
        }

        public Builder withThreshold(String threshold) {
            this.threshold = threshold;
            return this;
        }

        public Builder withModifyTimestamp(Long modifyTimestamp) {
            this.modifyTimestamp = modifyTimestamp;
            return this;
        }

        public Builder withInfinite(Boolean infinite) {
            this.infinite = infinite;
            return this;
        }

        public Inventory build() {
            Inventory inventory = new Inventory();
            inventory.setItemId(itemId);
            inventory.setEnterpriseCode(EnterpriseCodeEnum.valueOf(enterpriseCode));
            inventory.setShipNode(shipNode);
            inventory.setQuantity(quantity);
            inventory.setThreshold(threshold);
            inventory.setModifyts(modifyTimestamp);
            inventory.setInfinite(infinite);
            inventory.updateId();
            return inventory;
        }
    }
}
