package com.sephora.services.common.inventory.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@ApiModel(value = "ErrorResponseDTO")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseDTO {
	@ApiModelProperty(value = "${ErrorResponseDTO.error.value}",
            required = true, position = 0)
    private ErrorDetails error;
}
