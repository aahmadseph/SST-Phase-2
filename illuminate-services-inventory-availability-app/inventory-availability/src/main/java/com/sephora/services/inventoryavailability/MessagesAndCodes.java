package com.sephora.services.inventoryavailability;

public interface MessagesAndCodes {
	
	public static final String LOCATION_ELIGIBILITY_FAILURE = "location.eligibility.failure";
	public static final String LOCATION_ELIGIBILITY_FAILURE_MESSAGE = "Location Eligibility update failed!";
	public static final String LOCATION_ELIGIBILITY_SERVICE_PROVIDER_CONNECTIVITY_FAILURE_CODE = "location.eligibility.yantriks.connectivity.failure";
	public static final String LOCATION_ELIGIBILITY_SERVICE_PROVIDER_CONNECTIVITY_FAILURE_MESSAGE = "Error while connecting to Yantriks";

	public static final String UPDATE_INVENTORY_FAILURE = "inventoryavailability.supplyadjustment.update.failure";
	public static final String UPDATE_INVENTORY_AVAILABILITY_HUB_FAILURE = "yantriks.supplyUpdate.update.failure";
	public static final String UPDATE_INVENTORY_FAILURE_MESSAGE = "Inventory Supply Adjustment failed!";
	public static final String UPDATE_INVENTORY_SERVICE_PROVIDER_CONNECTIVITY_FAILURE_CODE = "inventoryavailability.supplyadjustment.yantriks.connectivity.failure";
	public static final String UPDATE_INVENTORY_SERVICE_PROVIDER_CONNECTIVITY_FAILURE_MESSAGE = "Error while connecting to Yantriks";
	
	public static final String GET_INVENTORY_SUPPLY_FAILURE = "inventoryavailability.supplydetails.search.failure";
	public static final String GET_INVENTORY_SUPPLY_FAILURE_MESSAGE = "Get inventory supply failed!";
	public static final String GET_INVENTORY_SUPPLY_SERVICE_PROVIDER_CONNECTIVITY_FAILURE_CODE = "get.inventory.yantriks.connectivity.failure";
	public static final String GET_INVENTORY_SUPPLY_SERVICE_PROVIDER_CONNECTIVITY_FAILURE_MESSAGE = "Error while connecting to Yantriks!";

	public static final String GET_AVAILABILITY_VALIDATION_ERROR_CODE = "availability.inventory-availability.validation_error";
	public static final String GET_AVAILABILITY_VALIDATION_ERROR_CODE_MESSAGE = "Validation failed for the request";

	public static final String GET_AVAILABILITY_CLIENT_ERROR_CODE = "yantriks.inventory-availability.bad_request";
	public static final String GET_AVAILABILITY_CLIENT_ERROR_CODE_MESSAGE = "Yantriks responded with 4XX error";

	public static final String GET_AVAILABILITY_SERVER_ERROR_CODE = "yantriks.inventory-availability.server_error";
	public static final String GET_AVAILABILITY_SERVER_ERROR_CODE_MESSAGE = "Yantriks responded with 5XX error";

	public static final String GET_AVAILABILITY_SERVER_TIMEOUT_CODE = "yantriks.inventory-availability.server_timeout";
	public static final String GET_AVAILABILITY_SERVER_TIMEOUT_CODE_MESSAGE = "Yantriks did not respond in a timely manner";

	public static final String GET_AVAILABILITY_UNKNOWN_ERROR_CODE = "availability.inventory-availability.unknownerror";
	public static final String GET_AVAILABILITY_UNKNOWN_ERROR_CODE_MESSAGE = "Unhandled exception happened";

	public static final String GET_AVAILABILITY_PARTIAL_FAILURE_CODE = "yantriks.availability.partialsuccess";
	public static final String GET_AVAILABILITY_PARTIAL_FAILURE_CODE_MESSAGE = "Get Availability was a partial success!";

	public static final String GET_AVAILABILITY_MULTIPLE_FAILURE_CODE = "yantriks.availability.all_requests_failed";
	public static final String GET_AVAILABILITY_MULTIPLE_FAILURE_CODE_MESSAGE = "Get Availability failed for all items!";

	public static final String GET_AVAILABILITY_NO_CONTENT_CODE = "yantriks.availability.no_content";
	public static final String GET_AVAILABILITY_NO_CONTENT_CODE_MESSAGE = "Received no content from availability call";

	public static final String GET_AVAILABILITY_PRODUCT_NOT_AVAILABLE_CODE = "yantriks.availability.product_not_found";
	public static final String GET_AVAILABILITY_PRODUCT_NOT_AVAILABLE_CODE_MESSAGE = "Product information not received from yantriks";
	
	public static final String DELETE_CONTROL_HUB_FAILURE = "yantriks.inventorycontroll.delete.failure";
	public static final String DELETE_CONTROL_HUB_FAILURE_MESSAGE = "Inventory control delete failed!";
	public static final String DELETE_CONTROL_FAILURE_MESSAGE = "Inventory control delete failed!";
	public static final String DELETE_CONTROL_FAILURE = "inventoryavailability.inventorycontroll.delete.failure";
	
	public static final String AVAILABILITY_SITE_PAGE_SERVER_TIMEOUT_CODE = "redis.inventory-availability.server_timeout";
	public static final String AVAILABILITY_SITE_PAGE_SERVER_TIMEOUT_CODE_MESSAGE = "Redis did not respond in a timely manner";
	
	public static final String AVAILABILITY_SITE_PAGE_UNKNOWN_ERROR_CODE = "availability.inventory-availability.unknownerror";
	public static final String AVAILABILITY_SITE_PAGE_UNKNOWN_ERROR_CODE_MESSAGE = "Unhandled exception happened";
	
	public static final String AVAILABILITY_SITE_PAGE_VALIDATION_ERROR_CODE = "availability.inventory-availability.validation_error";
	public static final String AVAILABILITY_SITE_PAGE_VALIDATION_ERROR_CODE_MESSAGE = "Validation failed for the request";
	public static final String AVAILABILITY_SITE_PAGE_LOCATIOS_VALIDATION_ERROR_MESSAGE = "locationsByFulfillmentType cannot be null or empty if evaluateNetworkAvail is false";

	public static final String ITEM_HOLD_VALIDATION_ERROR_CODE = "itemhold.inventory-availability.validation_error";
	public static final String ITEM_HOLD_VALIDATION_ERROR_CODE_MESSAGE = "Validation failed for the request";

	public static final String ITEM_NOT_FOUND_ERROR_CODE = "item.inventory-availability.item_not_found";
	public static final String ITEM_NOT_FOUND_ERROR_CODE_MESSAGE = "Item not found in database";

	public static final String ITEM_UNKNOWN_ERROR_CODE = "item.inventory-availability.unknown-error";
	public static final String ITEM_UNKNOWN_ERROR_CODE_MESSAGE = "Unknown error occured";
	
	public static final String INVALID_ROLE_ERROR_CODE = "inv-user.inventory-availability.invalid_role";
	public static final String INVALID_ROLE_ERROR_CODE_MESSAGE = "Invalid role list";
	
	public static final String USER_ALREADY_EXISTS_ERROR_CODE = "inv-user.inventory-availability.user_already_exists";
	public static final String USER_ALREADY_EXISTS_ERROR_CODE_MESSAGE = "User id is already exists";
	
	public static final String USER_NOT_AVAILABLE_ERROR_CODE = "inv-user.inventory-availability.user_not_found";
	public static final String USER_NOT_AVAILABLE_ERROR_CODE_MESSAGE = "User id is not found";
	
	public static final String USER_CONNECTION_ERROR_CODE = "inv-user.inventory-availability.connection_failure";
	public static final String USER_CONNECTION_ERROR_CODE_MESSAGE = "Database connection failure";
	
	public static final String USER_UNKNOWN_ERROR_CODE = "inv-user.inventory-availability.unknown-error";
	public static final String USER_UNKNOWN_ERROR_CODE_MESSAGE = "Unknown error occured";
	
	public static final String ROLE_ALREADY_EXISTS_ERROR_CODE = "inv-role.inventory-availability.role_already_exists";
	public static final String ROLE_ALREADY_EXISTS_ERROR_CODE_MESSAGE = "Role id is already exists";
	
	public static final String ROLE_NOT_AVAILABLE_ERROR_CODE = "inv-role.inventory-availability.user_not_found";
	public static final String ROLE_NOT_AVAILABLE_ERROR_CODE_MESSAGE = "Role id is not found";
	
	public static final String ROLE_CONNECTION_ERROR_CODE = "inv-role.inventory-availability.connection_failure";
	public static final String ROLE_CONNECTION_ERROR_CODE_MESSAGE = "Database connection failure";
	
	public static final String ROLE_UNKNOWN_ERROR_CODE = "inv-role.inventory-availability.unknown-error";
	public static final String ROLE_UNKNOWN_ERROR_CODE_MESSAGE = "Unknown error occured";
	
	public static final String NODE_CONTROL_FAILURE = "yantriks.inventory-availability.node-control.failure";
	public static final String NODE_CONTROL_FAILURE_MESSAGE = "Node control update failed!";
	public static final String NODE_CONTROL_SERVICE_PROVIDER_CONNECTIVITY_FAILURE_CODE = "yantriks.node-control.connectivity.failure";
	public static final String NODE_CONTROL_SERVICE_PROVIDER_CONNECTIVITY_FAILURE_MESSAGE = "Error while connecting to Yantriks";

	public static final String BULK_INVENTORY_SUPPLY_VALIDATION_ERROR_CODE = "bulk-inventory-supply.inventory-availability.bulk_inventory_supply_failure";
	public static final String BULK_INVENTORY_SUPPLY_VALIDATION_ERROR_CODE_MESSAGE = "Bulk Inventory Supply failed because of validation errors";



}
