package com.sephora.services.inventoryavailability;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sephora.services.inventory.service.availability.AvailabilityService;
import com.sephora.services.inventory.service.availability.impl.AvailabilityHubAvailabilityService;
import com.sephora.services.inventory.service.availability.impl.CosmosDbAvailabilityService;

public class AvailabilityConstants {
	public static final String DC = "DC";
	public static final String STORE = "STORE";
	
	//
	public static final String AVAILABILITY_TIME_NAME ="inventory.availability.yantiks.time";
	public static final String AVAILABILITY_TIME_DESCRIPTION = "Time taken for receiving the response from Yantriks";
	public static final String YANTRIKS_URI = "Yantriks uri";
	public static final String GET_SUPPLY_NETWORK_AH_URI = "GET /inventory-services/search/{orgId}/{productId}/{uom}";
	public static final String GET_SUPPLY_LOCATION_AH_URI = "GET /inventory-services/search/{orgId}/{productId}/{uom}/{locationType}/{locationId}";
	public static final String SUPPLY_UPDATE_AH_URI = "POST /inventory-services/supplyupdate";
	public static final String GET_AVAILABILITY_AH_URI = "POST /availability-services/availability/aggregator/v3.0";
	public static final String DELETE_CONTROL_AH_URI = "DELETE /availability-services/product-location-controls/v3.0/{orgId}/{productId}/{uom}/{locationId}/{locationType}";
	
	//
	public static final String SUPPLY_UPDATE_URI = "/v1.0/supplyUpdate";
	public static final String GET_SUPPLY_LOCATION_URI = "/v1.0/search/{productId}/{uom}";
	public static final String GET_SUPPLY_NETWORK_URI = "/v1.0/search/{productId}/{uom}/{locationId}";
	public static final String GET_AVAILABILITY_URI = "/v1.0/GetAvailability/";
	
	public static final String DELETE_CONTROL_URI = "/v1.0/DeleteInventoryControl";
	
	//Redis Cache constants
	public static final String CACHE_NAME = "referenceItemsCacheById";
	public static final String CASH_STORE_NAME = "Availability";
	
	public static final String FULFILLMENT_TYPE_SHIP = "SHIP";
	public static final String FULFILLMENT_TYPE_SAMEDAY = "SAMEDAY";
	public static final String FULFILLMENT_TYPE_PICK = "PICK";
	public static final String SHIPTOHOME = "SHIPTOHOME";
	
	public static final String UOM_EACH = "EACH";
	public static final String REQUEST_ORIGIN_EMWA = "EMWA";

	public static final String INVENTORY_SUPPLY_NOTIFICATION_TEMPLATE_NAME = "inventory-supply";
	public static final String INVENTORY_SUPPLY_BULK_NOTIFICATION_TEMPLATE_NAME = "inventory-supply-bulk";
	
	public static final String AVAILABILITY_HUB = "AVAILABILITY_HUB";
	public static final String CACHE = "CACHE";
	public static final String COSMOSE_DB = "COSMOSE_DB";
	
	public static final String INSTOCK  = "INSTOCK";
	public static final String LIMITEDSTOCK ="LIMITEDSTOCK";
	public static final String OOS = "OOS";
	
	public static final List<String> DEFAULT_PRIORITY_LIST = new ArrayList<String>();
	
	static {	
		DEFAULT_PRIORITY_LIST.add(AVAILABILITY_HUB);
		//DEFAULT_PRIORITY_LIST.add(COSMOSE_DB);
	}
	public static final DateTimeFormatter DTF_YYYY_MM_DDTHH_MM_SS_SSS = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");

	public static final String CACHE_KEY="shipNode";
	public static final String CACHE_KEY_SEPARATOR = "_";
	
	public static final String KOHLS_STORE_ID_START_WITH_EIGHT = "8";
	public static final String KOHLS = "KOHLS";
	public static final String ASSUMED_ATP_CONFIG_PATH = "inventory.site-page-availability.assumedAtp";
	public static final String ASSUMED_ATP_STATUS_CONFIG_PATH = "inventory.site-page-availability.defaultAtpStatus";
	public static final String IS_MOCKED_AVAILABILITY_CONFIG_PATH = "availability.mock.isMockedAvailability";
	public static final String CONFIGHUB_BRIDGE_PROPERTY_SOURCE = "CONFIGHUB_BRIDGE_PROPERTY_SOURCE";
}
