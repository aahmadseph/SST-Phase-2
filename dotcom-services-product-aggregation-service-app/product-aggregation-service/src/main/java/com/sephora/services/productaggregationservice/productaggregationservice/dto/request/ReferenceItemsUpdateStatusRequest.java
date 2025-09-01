package com.sephora.services.productaggregationservice.productaggregationservice.dto.request;

import java.io.Serializable;
import java.util.List;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.productaggregationservice.productaggregationservice.model.ReferenceStatusEnum;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;


@Data
public class ReferenceItemsUpdateStatusRequest implements Serializable {

   @Schema(type = "array",example = "[\"test-item\"]")
   @NotEmpty(message = "ERR_E_001|names")
   private List<String> names;


   @Schema(oneOf= ReferenceStatusEnum.class,defaultValue = "NEW")
   @NotEmpty(message = "ERR_E_001|status")
   private String status;

}
