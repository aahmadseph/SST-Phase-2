package com.sephora.services.productaggregationservice.productaggregationservice.dto.response;

import java.util.ArrayList;
import java.util.List;

import org.springframework.util.CollectionUtils;

import com.sephora.platform.common.model.Error;
import com.sephora.platform.common.model.dto.ErrorListDto;
import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Data;
import com.sephora.services.productaggregationservice.productaggregationservice.dto.ReferenceDto;

@Schema(name = "ReferenceItemResponse", allOf = ErrorListDto.class)
@Data
public class ReferenceItemsResponse extends ErrorListDto {

   @Schema(description = "${ReferenceItemsResponse.items.value}",type = "array")
   List<ReferenceDto> items;

   public boolean hasError() {
      return !CollectionUtils.isEmpty(this.getErrors());
   }

   public void addError(Error error) {
      if (CollectionUtils.isEmpty(this.getErrors())) {
         this.setErrors(new ArrayList<Error>());
      }
      this.getErrors().add(error);
   }
}
