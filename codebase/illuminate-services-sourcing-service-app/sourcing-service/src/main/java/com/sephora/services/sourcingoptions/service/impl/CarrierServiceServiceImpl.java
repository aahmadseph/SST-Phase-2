package com.sephora.services.sourcingoptions.service.impl;

import static com.sephora.services.sourcingoptions.SourcingOptionConstants.CACHE_KEY;
import static com.sephora.services.sourcingoptions.SourcingOptionConstants.CACHE_KEY_SEPARATOR;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.services.common.service.CacheServices;
import com.sephora.services.deliveryoptions.model.cache.CarrierServiceCache;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.mapper.CarrierServiceRedisCacheMapper;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.cosmos.CarrierService;
import com.sephora.services.sourcingoptions.repository.carrier.CarrierServiceRepository;
import com.sephora.services.sourcingoptions.service.CarrierServiceService;
import com.sephora.services.sourcingoptions.util.SourcingUtils;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class CarrierServiceServiceImpl implements CarrierServiceService {

    @Resource
    private CarrierServiceService self;

    @Autowired(required = false)
    private CarrierServiceRepository carrierServiceRepository;
    
    @Autowired
    CacheServices cacheServices;
    
    @Value("${sourcing.options.availabilityhub.redisCache.useCache:false}")
    private boolean userRedisCache;
    
    @Value("${cacheWarmup.baseLocation}")
    private String cacheBackupBasePath;
    
    @Autowired
    ObjectMapper mapper;
    
    @Autowired
    CarrierServiceRedisCacheMapper carrierServiceRedisCacheMapper;

    @Override
    public List<CarrierService> getCarrierServices(List<String> carrierServiceCodes,
                                                   EnterpriseCodeEnum enterpriseCode)
            throws SourcingServiceException {

        try {
            // Use self for get value from cache if exist
            return carrierServiceCodes.stream()
                    .map(carrierServiceCode -> self.getCarrierServiceByCarrierServiceCodeAndEnterpriseCode(carrierServiceCode, enterpriseCode))
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            String carrierServiceCodesString = carrierServiceCodes.stream().map(Object::toString).collect(Collectors.joining(","));
            log.error(
                    "Error occurred while trying to get carrierServices by carrierServiceCodes={} and enterpriseCode {}",
                    carrierServiceCodesString, enterpriseCode, e);
            throw new SourcingServiceException(e);
        }
    }
    @Override
    public CarrierService getCarrierServiceByCarrierServiceCodeAndEnterpriseCode(String carrierServiceCode, EnterpriseCodeEnum enterpriseCode) {
        if(userRedisCache) {        	  
            String cacheKey= CACHE_KEY + CACHE_KEY_SEPARATOR + enterpriseCode + CACHE_KEY_SEPARATOR + carrierServiceCode;           
            CarrierServiceCache carrierServiceCache= (CarrierServiceCache) cacheServices.get(cacheKey);	            
	        log.debug("getting CarrierServiceCache from RedisCache:{} for carrierServiceCode: {}",carrierServiceCache ,carrierServiceCode);            
            if(ObjectUtils.isEmpty(carrierServiceCache)) {
            	String carrierCodeJson = SourcingUtils.getCacheBackupObject(cacheBackupBasePath, "carrierService", cacheKey);
            	try {
            		carrierServiceCache = mapper.readValue(carrierCodeJson, CarrierServiceCache.class);
            		cacheServices.set(cacheKey, carrierServiceCache);
				} catch (Exception e) {					
					log.error("An error occured while parsing CarrierServiceCache from backup", e);					
				} 
            }
            
            CarrierService carrierService= carrierServiceRedisCacheMapper.convert(carrierServiceCache);
            log.debug("After Converting CarrierServiceCache to  carrierService : {}",carrierService);
            return carrierService;
        } else {
            return carrierServiceRepository
                    .findByCarrierServiceCodeAndEnterpriseCode(carrierServiceCode, enterpriseCode)
                    .stream().findFirst().orElse(null);
        }
    }
}
