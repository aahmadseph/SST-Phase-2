package com.sephora.productexpservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
@Builder
public class ReferenceDto {

   private String id;
   private String referenceName;
   private String status;
   private Integer quantity;
}
