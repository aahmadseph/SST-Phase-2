package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.cosmos.CarrierService;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;

import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.SOURCING_CACHE_MANAGER;

public interface CarrierServiceService {

    @Cacheable(value = SourcingOptionsCacheConfig.CARRIER_SERVICE_CACHE_NAME,
            key = "#carrierServiceCode + '__' + #enterpriseCode",
            cacheManager = SOURCING_CACHE_MANAGER,
            unless = "#result == null"
    )
    CarrierService getCarrierServiceByCarrierServiceCodeAndEnterpriseCode(String carrierServiceCode,
                                                                          EnterpriseCodeEnum enterpriseCode);

    public List<CarrierService> getCarrierServices(List<String> carrierServiceCodes,
                                                   EnterpriseCodeEnum enterpriseCode)
            throws SourcingServiceException;
}
