package com.sephora.services.sourcingoptions.mapper;

import com.sephora.platform.common.mapper.BaseMapper;
import com.sephora.services.deliveryoptions.model.cache.CarrierServiceCache;
import com.sephora.services.sourcingoptions.model.cosmos.CarrierService;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import static org.mapstruct.NullValuePropertyMappingStrategy.IGNORE;

@Mapper(nullValuePropertyMappingStrategy = IGNORE)
public interface CarrierServiceRedisCacheMapper extends BaseMapper<CarrierServiceCache, CarrierService> {

    CarrierServiceRedisCacheMapper INSTANCE = Mappers.getMapper(CarrierServiceRedisCacheMapper.class);

    @Override
    CarrierService convert(CarrierServiceCache input);
}
