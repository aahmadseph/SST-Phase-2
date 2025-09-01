package com.sephora.productexpservice.mapper;

import org.springframework.stereotype.Component;

import com.sephora.productexpservice.dto.ReferenceDto;
import com.sephora.productexpservice.model.ReferenceItem;

import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.impl.ConfigurableMapper;

@Component
public class ReferenceItemMapper extends ConfigurableMapper {

   protected void configure(MapperFactory factory) {

      factory.classMap(ReferenceItem.class, ReferenceDto.class)
            .field("id", "id")
            .field("name", "referenceName")
            .field("referenceStatus", "status")
            .field("quantity", "quantity")
            .byDefault()
            .register();

      factory.classMap(ReferenceDto.class, ReferenceItem.class)
            .field("referenceName", "name")
            .field("status", "referenceStatus")
            .field("quantity", "quantity")
            .byDefault()
            .register();
   }
}
