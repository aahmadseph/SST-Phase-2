package com.sephora.services.inventoryavailability.controller.impl;

import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.AVAILABILITY_REQUEST_URI;
import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.DELETE_INVENTORY_CONTROL_REQUEST_URI;
import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.SEARCH_BY_LOCATION_INVENTORY_SUPPLY_URI;
import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.SEARCH_INVENTORY_SUPPLY_URI;
import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.UPDATE_INVENTORY_SUPPLY_URI;
import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.*;

import com.sephora.services.common.inventory.audit.service.AuditService;
import com.sephora.services.inventory.service.InventoryService;
import com.sephora.services.inventory.service.InventoryShipNodeService;
import com.sephora.services.inventory.service.UpdateInventoryServiceWrapper;

import static com.sephora.services.inventoryavailability.AvailabilityTestConstants.ITEM_HOLD_UPDATE_URI;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;

import com.sephora.services.inventoryavailability.exception.AvailabilityServicePartialFailureException;
import com.sephora.services.inventoryavailability.exception.HoldItemException;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.request.SitePageAvailabilityDto;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.AvailabilityByProduct;
import com.sephora.services.inventoryavailability.model.availabilitysp.response.SitePageAvailabilityResponse;
import com.sephora.services.inventoryavailability.model.inventorycontrol.DeleteInventoryControlDTO;
import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateRequestDto;
import com.sephora.services.inventory.service.*;
import com.sephora.services.inventoryavailability.service.*;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.azure.spring.autoconfigure.cosmosdb.CosmosAutoConfiguration;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import com.sephora.services.inventoryavailability.TestUtils;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.availability.request.AvailabilityRequestDto;
import com.sephora.services.inventoryavailability.model.inventorycontrol.DeleteInventoryControlDTO;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;

@RunWith(SpringRunner.class)
@EnableAutoConfiguration(exclude = {HibernateJpaAutoConfiguration.class,
		SimpleDiscoveryClientAutoConfiguration.class,
		DataSourceAutoConfiguration.class,
	      HibernateJpaAutoConfiguration.class,
	      SimpleDiscoveryClientAutoConfiguration.class,
	      RedisAutoConfiguration.class,
	      RedisRepositoriesAutoConfiguration.class,
		SecurityAutoConfiguration.class,
		ManagementWebSecurityAutoConfiguration.class,
		org.springframework.boot.actuate.autoconfigure.metrics.cache.CacheMetricsAutoConfiguration.class})
@WebMvcTest(value = InventoryAvailabilityControllerImpl.class)
@ContextConfiguration(classes = {
		AvailabilityConfig.class }, initializers = ConfigDataApplicationContextInitializer.class)
@ComponentScan(value = "com.sephora.services.inventoryavailability.controller.impl")
@TestPropertySource("classpath:application-test.yaml")
@MockBeans(value = { @MockBean(LocationEligibilityService.class), @MockBean(InventoryShipNodeService.class), @MockBean(NodeControlService.class), @MockBean(TimeInTransitService.class)})
public class InventoryAvailabilityControllerImplTests {

	@MockBean
	UpdateInventorySupplyService updateInventorySupplyService;

	@MockBean
	BulkInventorySupplyService bulkInventorySupplyService;

	@MockBean
	GetInventorySupplyService getInventorySupplyService;

	@MockBean
	private InventoryService inventoryService;
	
	@MockBean
	private UpdateInventoryServiceWrapper updateInventoryServiceWrapper;
	

	protected MockMvc mvc;

	@Autowired
	WebApplicationContext webApplicationContext;

	@MockBean
	GetInventoryAvailabilityService getInventoryAvailabilityService;

	@MockBean
	AvailabilityHubInventoryService yantriksInventoryService;

	@MockBean
	HoldItemService holdItemService;

	@MockBean
	AuditService auditService;
	
	@MockBean
    private DeleteInventoryControlService deleteInventoryControlService;
	
	@MockBean
	GetAvailabilityForSitePagesService getAvailabilityForSitePagesService;

	@Before
	public void setUp() {
		mvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
	}

	String mapToJson(Object obj) throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		return objectMapper.writeValueAsString(obj);
	}

	@Test
	public void testUpdateInventorySupply() throws Exception {
		InventorySupplyDTO supplyDTO = TestUtils.getInventorySupplyFromConstants();
		String inputJson = mapToJson(supplyDTO);

		mvc.perform(MockMvcRequestBuilders.post(UPDATE_INVENTORY_SUPPLY_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

		Mockito.verify(updateInventorySupplyService, Mockito.times(1))
				.updateInventorySupply(ArgumentMatchers.any(InventorySupplyDTO.class));
	}

	@Test
	public void testGetInventorySupply() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get(SEARCH_INVENTORY_SUPPLY_URI).accept(MediaType.APPLICATION_JSON_VALUE))
				.andReturn();

		Mockito.verify(getInventorySupplyService, Mockito.times(1)).search(ArgumentMatchers.any(String.class),
				ArgumentMatchers.any(String.class));
	}

	@Test
	public void testGetInventorySupplyByLocation() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get(SEARCH_BY_LOCATION_INVENTORY_SUPPLY_URI)
				.accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

		Mockito.verify(getInventorySupplyService, Mockito.times(1)).search(ArgumentMatchers.any(String.class),
				ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class));
	}

	@Test
	public void testUpdateInventorySupplyExceptionHandler() throws Exception {
		InventorySupplyDTO supplyDTO = TestUtils.getInventorySupplyFromConstants();
		String inputJson = mapToJson(supplyDTO);

		Mockito.doThrow(buildMockAvailabilityServiceException(HttpStatus.BAD_REQUEST.value()))
				.when(updateInventorySupplyService)
				.updateInventorySupply(ArgumentMatchers.any(InventorySupplyDTO.class));

		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(UPDATE_INVENTORY_SUPPLY_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

		Assert.assertEquals(HttpStatus.BAD_REQUEST.value(), mvcResult.getResponse().getStatus());
		Mockito.reset(updateInventorySupplyService);

	}

	@Test
	public void testGetInventorySupplyExceptionHandler() throws Exception {

		Mockito.doThrow(buildMockAvailabilityServiceException(HttpStatus.BAD_REQUEST.value()))
				.when(getInventorySupplyService)
				.search(ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class));

		MvcResult mvcResult = mvc.perform(
				MockMvcRequestBuilders.get(SEARCH_INVENTORY_SUPPLY_URI).accept(MediaType.APPLICATION_JSON_VALUE))
				.andReturn();

		Assert.assertEquals(HttpStatus.BAD_REQUEST.value(), mvcResult.getResponse().getStatus());
		Mockito.reset(getInventorySupplyService);

	}

	@Test
	public void testGetInventorySupplyByLocationExceptionHandler() throws Exception {

		Mockito.doThrow(buildMockAvailabilityServiceException(HttpStatus.BAD_REQUEST.value()))
				.when(getInventorySupplyService).search(ArgumentMatchers.any(String.class),
						ArgumentMatchers.any(String.class), ArgumentMatchers.any(String.class));

		MvcResult mvcResult = mvc.perform(
				MockMvcRequestBuilders.get(SEARCH_BY_LOCATION_INVENTORY_SUPPLY_URI).accept(MediaType.APPLICATION_JSON_VALUE))
				.andReturn();

		Assert.assertEquals(HttpStatus.BAD_REQUEST.value(), mvcResult.getResponse().getStatus());
		Mockito.reset(getInventorySupplyService);

	}

	@Test
	public void testGetInventoryAvailability() throws Exception {
		Mockito.when(getInventoryAvailabilityService.getInventoryAvailability(ArgumentMatchers.any()))
				.thenReturn(TestUtils.buildMockAvailabilityServiceResponseData());
		AvailabilityRequestDto request = TestUtils.buildAvailabilityRequestDtoFromConstants();
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(AVAILABILITY_REQUEST_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(mapToJson(request))).andReturn();
		Mockito.verify(getInventoryAvailabilityService,
				Mockito.times(1)).getInventoryAvailability(ArgumentMatchers.any());

	}

	@Test
	public void testGetInventoryAvailabilityExceptionHandler() throws Exception {
		Mockito.when(getInventoryAvailabilityService.getInventoryAvailability(ArgumentMatchers.any()))
				.thenThrow(buildMockAvailabilityServiceException(HttpStatus.BAD_REQUEST.value()));
		AvailabilityRequestDto request = TestUtils.buildAvailabilityRequestDtoFromConstants();
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(AVAILABILITY_REQUEST_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(mapToJson(request))).andReturn();
		Mockito.verify(getInventoryAvailabilityService,
				Mockito.times(1)).getInventoryAvailability(ArgumentMatchers.any());
		Assert.assertEquals(HttpStatus.BAD_REQUEST.value(), mvcResult.getResponse().getStatus());

	}
	
	@Test
	public void testDeleteInventoryControl() throws Exception {
		DeleteInventoryControlDTO request = TestUtils.buildDeleteInventoryControlDTOFromConstants();
		
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(DELETE_INVENTORY_CONTROL_REQUEST_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(mapToJson(request))).andReturn();
		
		Mockito.verify(deleteInventoryControlService,
				Mockito.times(1)).deleteInventoryControl(ArgumentMatchers.any());
		Assert.assertEquals(HttpStatus.OK.value(), mvcResult.getResponse().getStatus());
	}
	
	@Test
	public void testDeleteInventoryControlExceptionHandler() throws Exception {
		Mockito.doThrow(buildMockAvailabilityServiceException(HttpStatus.BAD_REQUEST.value()))
			.when(deleteInventoryControlService).deleteInventoryControl(ArgumentMatchers.any());
		
		DeleteInventoryControlDTO request = TestUtils.buildDeleteInventoryControlDTOFromConstants();
		
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(DELETE_INVENTORY_CONTROL_REQUEST_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(mapToJson(request))).andReturn();
		
		Mockito.verify(deleteInventoryControlService,
				Mockito.times(1)).deleteInventoryControl(ArgumentMatchers.any());
		Assert.assertEquals(HttpStatus.BAD_REQUEST.value(), mvcResult.getResponse().getStatus());
	}
	
	@Test
	public void testGetAvailabilityForSitePages() throws JsonProcessingException, Exception {
		//Mock site page availability response 
		SitePageAvailabilityResponse sitePageAvailabilityResponse = new SitePageAvailabilityResponse();
		sitePageAvailabilityResponse.setAvailabilityByProducts(new ArrayList<AvailabilityByProduct>());
		Mockito.doReturn(sitePageAvailabilityResponse).when(getAvailabilityForSitePagesService).getAvailability(ArgumentMatchers.any(), ArgumentMatchers.anyBoolean());
		
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);
		assertNotNull(availabilityDto);
		
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(GET_AVAIABILITY_SITE_CONTROL_REQUEST_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(mapToJson(availabilityDto))).andReturn();
		
		Mockito.verify(getAvailabilityForSitePagesService,
				Mockito.times(1)).getAvailability(ArgumentMatchers.any(), ArgumentMatchers.anyBoolean());
		Assert.assertEquals(HttpStatus.OK.value(), mvcResult.getResponse().getStatus());
	}
	
	@Test
	public void testGetAvailabilityForSitePagesExceptionHandler() throws Exception {
		Mockito.doThrow(buildMockAvailabilityServiceException(HttpStatus.BAD_REQUEST.value()))
			.when(getAvailabilityForSitePagesService).getAvailability(ArgumentMatchers.any(), ArgumentMatchers.anyBoolean());
		
		SitePageAvailabilityDto availabilityDto = TestUtils.readObjectFromJsonFile(GET_AVAIABILITY_SITE_RQUEST_FILE, SitePageAvailabilityDto.class);
		
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(GET_AVAIABILITY_SITE_CONTROL_REQUEST_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(mapToJson(availabilityDto))).andReturn();
		
		Mockito.verify(getAvailabilityForSitePagesService,
				Mockito.times(1)).getAvailability(ArgumentMatchers.any(), ArgumentMatchers.anyBoolean());
		Assert.assertEquals(HttpStatus.BAD_REQUEST.value(), mvcResult.getResponse().getStatus());
	}
	

	private AvailabilityServiceException buildMockAvailabilityServiceException(Integer status) {
		ErrorResponseDTO errorResponseDTO = TestUtils.buildMockErrorResponseDTO();
		return new AvailabilityServiceException(status, errorResponseDTO);
	}

	@Test
	public void testHoldItemRequest() throws Exception {
		ItemHoldUpdateRequestDto requestDto = TestUtils.buildItemHoldUpdateRequestDtoFromConstant();
		String inputJson = mapToJson(requestDto);

		mvc.perform(MockMvcRequestBuilders.post(ITEM_HOLD_UPDATE_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(inputJson)).andReturn();

		Mockito.verify(holdItemService, Mockito.times(1))
				.updateHoldItemStatus(ArgumentMatchers.any(ItemHoldUpdateRequestDto.class));
	}

	@Test
	public void testHoldItemExceptionHandler() throws Exception {
		Mockito.doThrow(buildMockHoldItemException(HttpStatus.BAD_REQUEST.value()))
				.when(holdItemService).updateHoldItemStatus(ArgumentMatchers.any());

		ItemHoldUpdateRequestDto requestDto = TestUtils.buildItemHoldUpdateRequestDtoFromConstant();

		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(ITEM_HOLD_UPDATE_URI)
				.contentType(MediaType.APPLICATION_JSON_VALUE).content(mapToJson(requestDto))).andReturn();

		Mockito.verify(holdItemService,
				Mockito.times(1)).updateHoldItemStatus(ArgumentMatchers.any());
		Assert.assertEquals(HttpStatus.BAD_REQUEST.value(), mvcResult.getResponse().getStatus());
	}

	private HoldItemException buildMockHoldItemException(Integer status) {
		ErrorResponseDTO errorResponseDTO = TestUtils.buildMockErrorResponseDTO();
		return new HoldItemException(status, errorResponseDTO);
	}

}
