package com.sephora.services.productaggregationservice.productaggregationservice.dto.response;

import java.util.ArrayList;
import java.util.List;

import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sephora.platform.common.model.dto.ErrorListDto;
import com.sephora.platform.common.model.Error;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import com.sephora.services.productaggregationservice.productaggregationservice.dto.ReferenceDto;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class ReferenceItemResponse {
   @Schema(name = "${ReferenceDto}")
   private ReferenceDto item;
}


