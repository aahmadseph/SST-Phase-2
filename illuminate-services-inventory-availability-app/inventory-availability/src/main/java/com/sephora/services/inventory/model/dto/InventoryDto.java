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

import com.sephora.platform.common.utils.DateTimeUtils;
import com.sephora.platform.common.validation.Enum;
import com.sephora.services.inventory.model.EnterpriseCodeEnum;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotEmpty;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Date;

import static com.sephora.services.inventory.validation.ValidationConstants.*;

/**
 * @author Alexey Zalivko 5/8/2019
 */
@ApiModel(value = "Inventory")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryDto {

    private String id;

    @ApiModelProperty(value = "${Inventory.itemId.value}", required = true,
            allowableValues = "range[1, " + ITEM_ID_MAX_LENGTH + "]")
    @NotEmpty
    @Length(max = ITEM_ID_MAX_LENGTH)
    private String itemId;

    @ApiModelProperty(value = "${Inventory.enterpriseCode.value}", required = true,
            allowableValues = ENTERPRISE_CODE_ALLOWED_VALUES)
    @Enum(enumClass = EnterpriseCodeEnum.class, required = true)
    private String enterpriseCode;

    @ApiModelProperty(value = "${Inventory.shipNode.value}", required = true,
            allowableValues = "range[1, " + SHIP_NODE_KEY_MAX_LENGTH + "]")
    @NotEmpty
    @Length(max = SHIP_NODE_KEY_MAX_LENGTH)
    private String shipNode;

    private Long quantity;

    private String threshold;

    private Long modifyTimestamp;

    private Boolean infinite;

    public ZonedDateTime getModifyTimestamp() {
        if(null==modifyTimestamp)
            modifyTimestamp = Date.from(Instant.now()).getTime();
        return DateTimeUtils.convertToZonedDateTime(modifyTimestamp);
    }
}
