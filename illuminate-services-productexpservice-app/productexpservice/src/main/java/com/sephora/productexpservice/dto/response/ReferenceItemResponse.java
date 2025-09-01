package com.sephora.productexpservice.dto.response;

import java.util.ArrayList;
import java.util.List;

import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sephora.platform.common.model.dto.ErrorListDto;
import com.sephora.platform.common.model.Error;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@ApiModel(value = "ReferenceItemResponse", parent = ErrorListDto.class)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class ReferenceItemResponse extends ErrorListDto {

   @ApiModelProperty(value = "${ReferenceItemResponse.id.value}")
   private String id;

   @ApiModelProperty(value = "${ReferenceItemResponse.name.value}")
   private String name;

   @ApiModelProperty(value = "${ReferenceItemResponse.quantity.value}")
   private Integer quantity;

   @ApiModelProperty(value = "${ReferenceItemResponse.status.value}")
   private String status;

   @Override
   @ApiModelProperty(value = "${ReferenceItemResponse.errors.value}")
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

