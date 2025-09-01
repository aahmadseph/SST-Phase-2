package com.sephora.services.productaggregationservice.productaggregationservice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.sephora.services.productaggregationservice.productaggregationservice.model.ReferenceStatusEnum;
import com.sephora.services.productaggregationservice.productaggregationservice.model.ReferenceStoreEnum;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
@ToString
@Builder
public class ReferenceDto {

   private String id;
   @Schema(example = "test-item")
   @NotEmpty(message = "ERR_E_001|name")
   private String referenceName;
   @Schema(oneOf= ReferenceStatusEnum.class,defaultValue = "NEW")
   private ReferenceStatusEnum status;
   @Schema(example = "10")
   private Integer quantity;
   @Schema(oneOf= ReferenceStoreEnum.class,defaultValue = "STORE01")
   private ReferenceStoreEnum storeId;
}

