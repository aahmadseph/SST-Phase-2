package com.sephora.services.sourcingoptions.repository.carrier;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.cosmos.CarrierService;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(CarrierServiceRepository.CARRIER_SERVICE_REPOSITORY)
public interface CarrierServiceRepository extends CosmosRepository<CarrierService, String> {

    String CARRIER_SERVICE_REPOSITORY = "carrierServiceRepository";

    List<CarrierService> findAll();

    List<CarrierService> findByCarrierServiceCode(String carrierServiceCode);

    List<CarrierService> findByCarrierServiceCodeInAndEnterpriseCode(List<String> carrierServiceCodeList,
                                                                     EnterpriseCodeEnum enterpriseCode);

    List<CarrierService> findByCarrierServiceCodeAndEnterpriseCode(String carrierServiceCode,
                                                                   EnterpriseCodeEnum enterpriseCode);

}
