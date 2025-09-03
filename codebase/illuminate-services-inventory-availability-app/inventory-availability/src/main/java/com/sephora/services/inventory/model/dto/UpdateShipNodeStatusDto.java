/*
 * This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 * consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 * Copyright 2019 sephora.com, Inc. All rights reserved.
 */

package com.sephora.services.inventory.model.dto;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.inventory.model.ShipNodeStatusEnum;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotEmpty;
import java.util.List;

import static com.sephora.services.inventory.validation.ValidationConstants.LOCK_STATUS_ALLOWED_VALUES;
import static com.sephora.services.inventory.validation.ValidationConstants.SHIP_NODE_KEY_MAX_LENGTH;

@ApiModel(value = "UpdateShipNodeStatus")
public class UpdateShipNodeStatusDto {

    @ApiModelProperty(value = "${UpdateShipNodeStatusDto.shipNodes.value}", required = true)
    @NotEmpty
    private List<@Length(max = SHIP_NODE_KEY_MAX_LENGTH) String> shipNodes;

    @ApiModelProperty(value = "${UpdateShipNodeStatusDto.status.value}",
            allowableValues = LOCK_STATUS_ALLOWED_VALUES, required = true)
    @NotEmpty
    @Enum(enumClass = ShipNodeStatusEnum.class)
    private String status;

    public List<String> getShipNodes() {
        return shipNodes;
    }

    public void setShipNodes(List<String> shipNodes) {
        this.shipNodes = shipNodes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("shipNodes", shipNodes)
                .append("status", status)
                .toString();
    }

    public static final class Builder {

        private List<String> shipNodes;
        private String status;

        private Builder() {
        }

        public static Builder anUpdateShipNodesStatusDto() {
            return new Builder();
        }

        public Builder withStatus(String status) {
            this.status = status;
            return this;
        }

        public Builder withShipNodes(List<String> shipNodes) {
            this.shipNodes = shipNodes;
            return this;
        }

        public UpdateShipNodeStatusDto build() {
            UpdateShipNodeStatusDto statusDto = new UpdateShipNodeStatusDto();
            statusDto.setStatus(status);
            statusDto.setShipNodes(shipNodes);
            return statusDto;
        }
    }

}