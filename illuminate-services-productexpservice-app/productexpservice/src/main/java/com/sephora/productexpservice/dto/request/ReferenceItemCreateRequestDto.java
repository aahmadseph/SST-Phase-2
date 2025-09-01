package com.sephora.productexpservice.dto.request;

import javax.validation.constraints.NotBlank;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@ApiModel(value = " ReferenceItemCreateRequest")
@Data
public class ReferenceItemCreateRequestDto {

   @ApiModelProperty(value = "${ReferenceItemCreateRequest.name.value}", required = true, position = 0)
   @NotBlank
   private String name;

   @ApiModelProperty(value = "${ReferenceItemCreateRequest.quantity.value}", required = true, position = 1)
   private Integer quantity;

}
