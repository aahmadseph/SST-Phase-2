package com.sephora.services.productaggregationservice.productaggregationservice.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ReferenceItemCreateRequestDto {

   @NotBlank(message = "ERR_E_001|name")
   @Schema(example = "test-item")
   private String name;
   @Schema(example = "10")
   private Integer quantity;
}
