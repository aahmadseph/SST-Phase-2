package com.sephora.services.common.inventory.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@ApiModel(value = "ErrorDetails")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {
    @ApiModelProperty(value = "ErrorDetails.code.value", required = true, position = 0, example = "update.inventory.supply.failure")
    private String code;
    @ApiModelProperty(value = "ErrorDetails.message.value", required = true, position = 1, example = "Update inventory update was a failure!")
    private String message;
    @ApiModelProperty(value = "ErrorDetails.errors.value", required = true, position = 1)
    private List<ErrorDetailInfo> errors;
}
