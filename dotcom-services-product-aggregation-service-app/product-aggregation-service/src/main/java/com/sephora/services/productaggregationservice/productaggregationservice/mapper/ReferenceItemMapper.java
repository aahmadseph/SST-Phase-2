package com.sephora.services.productaggregationservice.productaggregationservice.mapper;

import com.sephora.services.productaggregationservice.productaggregationservice.dto.ReferenceDto;
import com.sephora.services.productaggregationservice.productaggregationservice.model.ReferenceItem;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ReferenceItemMapper  {
   ReferenceItemMapper MAPPER = Mappers.getMapper(ReferenceItemMapper.class);
   @Mapping(source = "status", target = "referenceStatus")
   @Mapping(source = "referenceName", target = "name")
   @Mapping(source = "storeId", target = "storeId")
   ReferenceItem toEntity(ReferenceDto referenceDto);

   @InheritInverseConfiguration
   ReferenceDto toDto(ReferenceItem referenceItem);
}
