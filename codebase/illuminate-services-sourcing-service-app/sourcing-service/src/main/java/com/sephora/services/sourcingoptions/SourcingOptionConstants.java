package com.sephora.services.sourcingoptions;

public class SourcingOptionConstants {
	public static final String COMMA = ",";
	public static final String RECORD = "Record";
	public static final String ZIPCODE = "Zip Code";
	public static final String PREFFERED_DC = "Preferred DC";
	public static final String ZONE = "zone";
	public static final String STATE = "State";
	public static final String END_OF_RECORDS = "EndOfRecords";
	public static final int ZIP_CODE_LENGTH = 3;
	public static final int DC_NUMBER_LENGTH = 4;
	public static final String US_FROM_ZIP_CODE_SUFFIX = "00";
	public static final String US_TO_ZIP_CODE_SUFFIX = "99";
	public static final String CA_TO_ZIP_CODE_SUFFIX = "ZZ";
	public static final String ZONE_MAP_ID_SEPARATOR = "_";
	
	public static final String FSA_START = "FSA Start";
	public static final String FSA_END = "FSA End";
	public static final String PROVINCE = "Province";
	
	public static final String OMS = "OMS";
	public static final String INVS_RESERVATION = "INVS_RESERVATION";
	public static final String DC = "DC";
	public static final String STORE = "STORE";
	public static final String SEPHORA_INTL = "SEPHORAINTL";
	public static final String BORDER_FREE_LEVEL_OF_SERVICE = "STANDARD";
	public static final String ATG_TEST_CHECKOUT = "ATG_TEST_CHECKOUT";
	public static final String SHIPTOHOME_YANTRIKS = "SHIP";
	public static final String GIFTCARD = "GIFTCARD";
	
	//Micrometer Constants
	public static final String COMMITS_TIME_NAME = "commits.resrvation.yantiks.time";
	public static final String COMMITS_TIME_DESCRIPTION = "Time taken for receiving the response from Yantriks";
	public static final String COMMITS_URI = "yantriks uri";
	public static final String CART_SOURCE_URI = "POST /cart/source?ignoreExistingDemand={ignoreExistingDemand}";
	public static final String DATES_BY_SERVICE_URI = "POST /custom/dates-by-service?isAggregated=true&auditEnabled=false&ignoreExistingDemand={ignoreExistingDemand}";
     // Redis Cache Constants
	public static final String CACHE_KEY_SEPARATOR = "_";
	public static final String CACHE_KEY="carrierService";
	
	public static final String SHIP_NODE_CACHE_KEY_PREFIX="shipNode";
	public static final String US = "US";
	public static final String CA = "CA";
	public static final String ZONE_MAPPING_CACHE_KEY = "zonemapping_%s_%s";
	public static final String CACHE = "CACHE";
	public static final String AZURE_TABLE = "AZURE_TABLE";
}
