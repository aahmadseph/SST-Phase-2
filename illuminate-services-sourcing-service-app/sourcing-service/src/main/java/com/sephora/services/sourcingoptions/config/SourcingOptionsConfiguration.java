package com.sephora.services.sourcingoptions.config;

import com.sephora.services.sourcingoptions.model.dto.ShippingAddressConfig;
import com.sephora.services.sourcingoptions.model.dto.ZipCodeRangeDto;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.*;

@ConfigurationProperties(prefix = "sourcing.options.availabilityhub")
@Data
public class SourcingOptionsConfiguration {
    private boolean useAvailabilityHubForSourcing = false;
    private boolean isRampUpEnabled = false;
    private boolean sddOptRampUpEnabled = false;
    private List<String> rampUpEnabledZipCodes = new ArrayList<>();
    private Boolean enableCarrierCodeAdjustment = false;
    private Map<String,String> carrierCodeAdjustments = new HashMap<>();
    private String electronicFulfillmentUSCarrierCode = "1";
    private String electronicFulfillmentCACarrierCode = "54";
    private String samedayFulfillmentUSCarrierCode = "38";
    private String samedayFulfillmentCACarrierCode = "58";
    private String shiptohomeFulfillmentUSCarrierCode = "1";
    private String shiptohomeFulfillmentCACarrierCode = "54";
    private List<String> samedayCarrierCodes = Arrays.asList("38", "58");
    private Map<String, ShippingAddressConfig> electronicFulfillmentAddressConfig = new HashMap<>();
    private Map<String, List<ZipCodeRangeDto>> rampUpZipCodeRange = new HashMap<>();
    private String borderFreeCarrierService = "17";
    private List<String> dcLocations = new ArrayList<String>();
    private Map<String, ShippingAddressConfig> defaultAddressConfig = new HashMap<>();
    private Boolean cartLineTypeAdjustmentsEnabled = true;
    private List<String> cartLineTypeCarrierServiceCodes = Arrays.asList("9", "24");
    private Boolean useScatterGatherDateByService = false;
}
