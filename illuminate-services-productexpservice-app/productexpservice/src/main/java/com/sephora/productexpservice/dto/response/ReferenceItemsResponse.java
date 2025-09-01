package com.sephora.productexpservice.dto.response;

import java.util.ArrayList;
import java.util.List;

import org.springframework.util.CollectionUtils;

import com.sephora.platform.common.model.Error;
import com.sephora.platform.common.model.dto.ErrorListDto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@ApiModel(value = "ReferenceItemResponse", parent = ErrorListDto.class)
@Data
public class ReferenceItemsResponse extends ErrorListDto {

   @ApiModelProperty(value = "${ReferenceItemsResponse.items.value}")
   List<ReferenceItemResponse> items;

   @Override
   @ApiModelProperty(value = "${ReferenceItemsResponse.errors.value}")
   public List<Error> getErrors() {
      return super.getErrors();
   }

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
