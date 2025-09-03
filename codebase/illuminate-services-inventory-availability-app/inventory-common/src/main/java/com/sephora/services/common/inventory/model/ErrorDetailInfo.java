package com.sephora.services.common.inventory.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@ApiModel(value = "ErrorDetailInfo")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorDetailInfo {
	@ApiModelProperty(value = "ErrorDetailInfo.reason.value", required = true, position = 0, example = "400")
    private String reason;
	private String errorItemId;
	@ApiModelProperty(value = "ErrorDetailInfo.message.value", required = true, position = 0, example = "BAD REQUEST")
    private String message;
}
