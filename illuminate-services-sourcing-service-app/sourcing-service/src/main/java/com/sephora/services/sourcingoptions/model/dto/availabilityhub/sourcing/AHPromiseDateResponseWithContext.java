package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing;

import com.sephora.services.sourcingoptions.model.cosmos.CarrierService;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request.AHPromiseDateRequest;
import com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response.AHPromiseDateResponse;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AHPromiseDateResponseWithContext {
    private AHPromiseDateResponse response;
    private AHPromiseDateRequest request;
    private List<CarrierService> carrierCodes;
    private Map<String,String> itemIdCarrierCode;
    private String levelOfService;
}
