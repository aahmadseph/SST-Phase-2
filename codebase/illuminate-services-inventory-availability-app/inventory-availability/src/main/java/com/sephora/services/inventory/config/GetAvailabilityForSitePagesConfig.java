package com.sephora.services.inventory.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.FulfillmentTypeEnum;

import java.util.List;

import lombok.Data;
import org.springframework.util.CollectionUtils;

@Component
@ConfigurationProperties(prefix = "inventory.site-page-availability")
@Data
public class GetAvailabilityForSitePagesConfig {
	
	private List<PriorityConfig> priorityConfig;
	private List<String> defaultPriorityOrder;
	
	private boolean pickRampUpEnabled;
	private boolean samedayRampUpEnabled;
	private boolean useDefaultFulfillmentType;
	private String defaultFulfillmentType;
	private boolean useRedisTemplate;
	
	private String appName;
	private String configType;
	
	//OMM-807: Temp fix for Invalid Kohl's store from ATG
	private List<String> kohlsStores;
	
	private boolean kohlsCacheEnabled;
	
	public PriorityConfig getPriorityOrder(String reqFulfillmentType, final String requestOrigin) {
		String fulfillmentType = FulfillmentTypeEnum.SHIPTOHOME.toString().equals(reqFulfillmentType) ? FulfillmentTypeEnum.SHIP.toString() : reqFulfillmentType;
		PriorityConfig pc = priorityConfig.stream()
				.filter(priorityConfigEntry -> fulfillmentType.equals(priorityConfigEntry.getFulfillmentType())
						&& !CollectionUtils.isEmpty(priorityConfigEntry.getRequestOrigin()) && priorityConfigEntry.getRequestOrigin().contains(requestOrigin.toUpperCase()))
				.findAny().orElse(null);
		
		/*if (null != pc && !pc.getPriorityOrder().isEmpty()) {
			return pc.getPriorityOrder();
		} else {
			return defaultPriorityOrder;
		}*/
		return pc;
	}
	
	public boolean rampUpEnabled(String fulfillmentType) {
		if(AvailabilityConstants.FULFILLMENT_TYPE_SAMEDAY.equals(fulfillmentType)) {
			return samedayRampUpEnabled;
		} else if(AvailabilityConstants.FULFILLMENT_TYPE_PICK.equals(fulfillmentType)) {
			return pickRampUpEnabled;
		} else {
			return false;
		}
	}
}
