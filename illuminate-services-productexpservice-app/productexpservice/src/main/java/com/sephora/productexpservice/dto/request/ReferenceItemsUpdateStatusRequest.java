package com.sephora.productexpservice.dto.request;

import java.io.Serializable;
import java.util.List;

import javax.validation.constraints.NotBlank;

import com.sephora.platform.common.validation.Enum;
import com.sephora.productexpservice.model.ReferenceStatusEnum;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;

@Builder
@FieldNameConstants
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReferenceItemsUpdateStatusRequest implements Serializable {

   private static final long serialVersionUID = -3705210506030759838L;

   private List<String> names;

   @Enum(enumClass = ReferenceStatusEnum.class, required = true)
   private String status;
}
