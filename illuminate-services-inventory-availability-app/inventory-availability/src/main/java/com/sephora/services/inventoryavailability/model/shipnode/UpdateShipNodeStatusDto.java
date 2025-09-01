///*
// * This software is the confidential and proprietary information of
// * sephora.com and may not be used, reproduced, modified, distributed,
// * publicly displayed or otherwise disclosed without the express written
// * consent of sephora.com.
// *
// * This software is a work of authorship by sephora.com and protected by
// * the copyright laws of the United States and foreign jurisdictions.
// *
// * Copyright 2019 sephora.com, Inc. All rights reserved.
// */
//
//package com.sephora.services.inventoryavailability.model.shipnode;
//
//import static com.sephora.services.inventoryavailability.validation.ValidationConstants.LOCK_STATUS_ALLOWED_VALUES;
//import static com.sephora.services.inventoryavailability.validation.ValidationConstants.SHIP_NODE_KEY_MAX_LENGTH;
//
//import java.util.List;
//
//import javax.validation.constraints.NotEmpty;
//
//import org.hibernate.validator.constraints.Length;
//
//import com.sephora.platform.common.validation.Enum;
//import com.sephora.services.inventoryavailability.model.cosmos.ShipNodeStatusEnum;
//
//import io.swagger.annotations.ApiModel;
//import io.swagger.annotations.ApiModelProperty;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@ApiModel(value = "UpdateShipNodeStatus")
//@Data
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//public class UpdateShipNodeStatusDto {
//
//    @ApiModelProperty(value = "${UpdateShipNodeStatusDto.shipNodes.value}", required = true)
//    @NotEmpty
//    private List<@Length(max = SHIP_NODE_KEY_MAX_LENGTH) String> shipNodes;
//
//    @ApiModelProperty(value = "${UpdateShipNodeStatusDto.status.value}",
//            allowableValues = LOCK_STATUS_ALLOWED_VALUES, required = true)
//    @NotEmpty
//    @Enum(enumClass = ShipNodeStatusEnum.class)
//    private String status;
//}