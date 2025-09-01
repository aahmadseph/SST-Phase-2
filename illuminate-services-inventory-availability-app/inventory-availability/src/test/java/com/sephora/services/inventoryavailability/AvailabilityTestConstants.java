package com.sephora.services.inventoryavailability;

public class AvailabilityTestConstants {
	public static final String RESOURCE_PATH = "src/test/resources/";
	public static final String ADJUSTMENT_TYPE = "DELTA";
	public static final String LOCATION_ID = "0701";
	public static final String LOCATION_TYPE = "DC";
	public static final String PRODUCT_ID= "ITEM-4";
	public final static String SELLING_CHANNEL = "SEPHORAUS";
	public static final Double QUANTITY = 2.0;
	public static final String UOM = "EACH";
	public static final String UPDATE_TIME_STAMP = "2020-12-03T10:15:30.123-08:00";
	public static final String SUPPLY_TYPE = "ONHAND";
	public static final String UPDATE_USER = "admin";
	public static final String REQUEST_ORGIN = "OMS";
	
	public static final String ORG_ID = "SEPHORA";
	public static final String FEED_TYPE = "DELTA";
	
	public final static String UPDATE_INVENTORY_SUPPLY_URI = "/v1.0/supplyUpdate";
	public final static String SEARCH_INVENTORY_SUPPLY_URI = "/v1.0//search/ITEM-4/EACH";
	public final static String SEARCH_BY_LOCATION_INVENTORY_SUPPLY_URI = "/v1.0//search/1340025TEST999/EACH/0801";

	public final static String AVAILABILITY_REQUEST_ORIGIN = "OMS";
	public final static String AVAILABILITY_SELLING_CHANNEL = "SEPHORAUS";
	public final static String AVAILABILITY_TRANSACTION_TYPE = "DEFAULT";
	public final static String AVAILABILITY_FULFILLMENT_TYPE = "SHIP";
	public final static String AVAILABILITY_PRODUCT_ID = "1";
	public final static String AVAILABILITY_UOM = "EACH";
	public final static String AVAILABILITY_LOCATION_ID = "0770";

	public final static String AVAILABILITY_REQUEST_URI = "/v1.0/GetAvailability/";
	public final static String DELETE_INVENTORY_CONTROL_REQUEST_URI = "/v1.0/DeleteInventoryControl";

	public final static String GET_AVAIABILITY_SITE_CONTROL_REQUEST_URI = "/v1.0/GetAvailabilityForSitePages";
	public final static String GET_AVAIABILITY_SITE_RQUEST_FILE = "request/GetAvailabilityForSitePagesRquest.json";
	public final static String GET_AVAIABILITY_SITE_RQUEST_FILE_MUL_LOC = "request/GetAvailabilityForSitePagesRquestWithMulLoc.json";
	public final static String GET_AVAIABILITY_SITE_RQUEST_FILE_SHIP = "request/GetAvailabilityForSitePagesRquestWithShipType.json";
	public final static String AVAIABILITY_CACHE_ENTRY_FILE_11113 ="11113_SEPHORAUS_inventoryAvailability.json";
	public final static String AVAIABILITY_CACHE_ENTRY_FILE_11114 ="11114_SEPHORAUS_inventoryAvailability.json";
	public final static String AVAIABILITY_CACHE_ENTRY_KEY_11113 = "11113_SEPHORAUS_inventoryAvailability";
	public final static String AVAIABILITY_CACHE_ENTRY_KEY_11114 = "11114_SEPHORAUS_inventoryAvailability";

	public final static String ITEM_HOLD_UPDATE_URI = "/v1.0/updateItemHoldStatus/";
}
