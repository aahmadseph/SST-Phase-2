package com.sephora.services.inventoryavailability;

import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.*;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import com.sephora.services.inventoryavailability.model.SupplyType;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventory.model.networkThreshold.redis.ProductAvailability;
import com.sephora.services.inventoryavailability.model.Location;
import com.sephora.services.inventoryavailability.model.PhysicalInventory;
import com.sephora.services.inventoryavailability.model.availability.availabilityhub.response.*;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestLocation;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestProduct;
import com.sephora.services.inventoryavailability.model.availability.response.AvailabilityResponseDto;
import com.sephora.services.inventoryavailability.model.inventorycontrol.DeleteInventoryControlDTO;
import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateProduct;
import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateRequestDto;
import com.sephora.services.inventoryavailability.model.supply.GetInventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyAHResponse;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;

import feign.Request;
import feign.RequestTemplate;

public class TestUtils {

	public static InventorySupplyDTO getInventorySupplyFromConstants() {

		InventorySupplyDTO inventorySupplyDTO = InventorySupplyDTO.builder().adjustmentType(ADJUSTMENT_TYPE)
				.locationId(LOCATION_ID).productId(PRODUCT_ID).quantity(QUANTITY).uom(UOM)
				.updateTimeStamp(UPDATE_TIME_STAMP).supplyType(SUPPLY_TYPE).updateUser(UPDATE_USER)
				.requestOrigin(REQUEST_ORGIN).build();
		return inventorySupplyDTO;
	}

	public static InventorySupplyAHResponse getInventorySupplyAHResponseFromConstants() {

		SupplyType supplyType = SupplyType.builder().supplyType(SUPPLY_TYPE).quantity(QUANTITY).segment("").build();
		Location location = Location.builder().locationId(LOCATION_ID).supplyTypes(Arrays.asList(supplyType)).build();
		PhysicalInventory physicalInventory = PhysicalInventory.builder().locationType(LOCATION_TYPE)
				.locations(Arrays.asList(location)).build();

		return InventorySupplyAHResponse.builder().orgId(ORG_ID).productId(PRODUCT_ID).feedType(FEED_TYPE).uom(UOM)
				.updateTime(UPDATE_TIME_STAMP).updateUser(UPDATE_USER)
				.physicalInventory(Arrays.asList(physicalInventory)).build();

	}

	public static GetInventorySupplyAHResponse getSearchInventorySupplyAHResponseFromConstants() {
		SupplyType supplyType = SupplyType.builder().supplyType(SUPPLY_TYPE).quantity(QUANTITY).segment("").build();
		Location location = Location.builder().locationId(LOCATION_ID).supplyTypes(Arrays.asList(supplyType)).build();
		PhysicalInventory physicalInventory = PhysicalInventory.builder().locationType(LOCATION_TYPE)
				.locations(Arrays.asList(location)).build();

		return GetInventorySupplyAHResponse.builder().orgId(ORG_ID).productId(PRODUCT_ID).uom(UOM)
				.physicalInventory(Arrays.asList(physicalInventory)).build();
	}

	public static Request getMockRequest() {
		return Request.create(Request.HttpMethod.POST, "/mock-url/", new HashMap<>(), Request.Body.empty(), new RequestTemplate());
	}

	public static ErrorResponseDTO buildMockErrorResponseDTO() {
		return ErrorResponseDTO.builder()
				.error(ErrorDetails.builder().code("mock.code").message("Mock error message").build()).build();
	}

	public static AvailabilityRequestDto buildAvailabilityRequestDtoFromConstants() {
		return AvailabilityRequestDto.builder()
				// not used in code
				.currentDateTime("2020-06-19").requestOrigin(AVAILABILITY_REQUEST_ORIGIN)
				.sellingChannel(AVAILABILITY_SELLING_CHANNEL).transactionType(AVAILABILITY_TRANSACTION_TYPE)
				.products(Arrays.asList(AvailabilityRequestProduct.builder()
						.fulfillmentType(AVAILABILITY_FULFILLMENT_TYPE).productId(AVAILABILITY_PRODUCT_ID)
						.uom(AVAILABILITY_UOM)
						.locations(Arrays.asList(new AvailabilityRequestLocation(AVAILABILITY_LOCATION_ID))).build()))
				.build();
	}

	public static GetAvailabilityResponseData buildMockAvailabilityResponseData() {
		List<AvailabilityByProduct> productsList = new ArrayList<>();
		// Arrays.asList will not allow to add items
		productsList.add(AvailabilityByProduct.builder().productId(AVAILABILITY_PRODUCT_ID).uom(AVAILABILITY_UOM)
				.availabilityByFulfillmentTypes(Arrays.asList(AvailabilityByFulfillmentType.builder()
						.availabilityDetails(Arrays.asList(AvailabilityDetail.builder().atp(100D).segment("DEFAULT")
								.availabilityByLocations(Arrays.asList(AvailabilityByLocation.builder().atp(100D)
										.locationId("0770").locationType("DC").build()))
								.build()))
						.fulfillmentType(AVAILABILITY_FULFILLMENT_TYPE).build()))
				.build());
		return GetAvailabilityResponseData.builder().orgId(ORG_ID).availabilityByProducts(productsList)
				.sellingChannel(AVAILABILITY_SELLING_CHANNEL).transactionType(AVAILABILITY_TRANSACTION_TYPE).build();
	}

	public static AvailabilityResponseDto buildMockAvailabilityServiceResponseData() {
		return AvailabilityResponseDto.builder().availabilityByProducts(
				Arrays.asList(com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct.builder()
						.productId(AVAILABILITY_PRODUCT_ID).uom(AVAILABILITY_UOM)
						.availabilityByFulfillmentTypes(Arrays.asList(
								com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByFulfillmentType
										.builder()
										.availabilityDetails(Arrays.asList(
												com.sephora.services.inventoryavailability.model.availability.response.AvailabilityDetail
														.builder().atp(100D)
														.availabilityByLocations(Arrays.asList(
																com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByLocation
																		.builder().atp(100D).locationId("0770")
																		.build()))
														.build()))
										.fulfillmentType(AVAILABILITY_FULFILLMENT_TYPE).build()))
						.build()))
				.sellingChannel(AVAILABILITY_SELLING_CHANNEL).build();
	}

	public static DeleteInventoryControlDTO buildDeleteInventoryControlDTOFromConstants() {
		return DeleteInventoryControlDTO.builder().productId(PRODUCT_ID).locationId(LOCATION_ID).uom(UOM).build();
	}
	
	public static ProductAvailability buildMockAProductAvailability() {
		return ProductAvailability.builder()
				.productId(PRODUCT_ID)
				.sellingChannel(SELLING_CHANNEL)
				.build();
	}
	
	public static ItemHoldUpdateRequestDto buildItemHoldUpdateRequestDtoFromConstant(){
		return ItemHoldUpdateRequestDto.builder()
				.sellingChannel(AVAILABILITY_SELLING_CHANNEL)
				.products(Arrays.asList(new ItemHoldUpdateProduct(PRODUCT_ID, true)))
				.build();
	}
	
	public static com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct buildMockAvailabilityByProduct() {
		return com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByProduct.builder()
				.productId("2152668").uom(AVAILABILITY_UOM)
				.availabilityByFulfillmentTypes(Arrays.asList(
						com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByFulfillmentType
								.builder()
								.availabilityDetails(Arrays.asList(
										com.sephora.services.inventoryavailability.model.availability.response.AvailabilityDetail
												.builder().atp(100D)
												.availabilityByLocations(Arrays.asList(
														com.sephora.services.inventoryavailability.model.availability.response.AvailabilityByLocation
																.builder().atp(100D).locationId("0701")
																.build()))
												.build()))
								.fulfillmentType(AVAILABILITY_FULFILLMENT_TYPE).build()))
				.build();
	}
	
	public static com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation buildMockAvailabilityByLocation() {
		return com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByLocation.builder().atp(100D).atpStatus("INSTOCK").location("0058").build();
	}


	public enum JSON_INPUT_TYPE {
		REQUEST, RESPONSE
	}
	
	/**
	 * Read json data from give fine and directory and convert the same to specific object
	 * @param <T>
	 * @param fileName
	 * @param valueType
	 * @return
	 */
	public static <T> T readObjectFromJsonFile(String fileName, Class<T> valueType) {
		File file = new File(RESOURCE_PATH + fileName);
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);;
		try {
			return mapper.readValue(file, valueType);
		} catch (IOException e) {
			return null;
		}
	}
	
	/**
	 * Read json data from give fine and directory
	 * @param fileName
	 * @param inputType
	 * @return
	 */
	public static String readFromJsonFile(String fileName, JSON_INPUT_TYPE inputType) {
		File file = new File(RESOURCE_PATH + fileName);
		if (file.exists()) {
			BufferedInputStream inputStream = null;
			try {
				inputStream = new BufferedInputStream(new FileInputStream(file));
				byte[] data = new byte[(int) file.length()];
				inputStream.read(data, 0, (int) file.length());
				return new String(data);
			} catch (FileNotFoundException e1) {
				return null;
			} catch (IOException e) {
				return null;
			} finally {
				if (inputStream != null) {
					try {
						inputStream.close();
					} catch (IOException e) {
					}
				}
			}

		} else {
			return null;
		}
	}

}
