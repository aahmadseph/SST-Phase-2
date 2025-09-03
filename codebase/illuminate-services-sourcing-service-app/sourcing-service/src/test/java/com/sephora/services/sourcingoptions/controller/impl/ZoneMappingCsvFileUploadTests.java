package com.sephora.services.sourcingoptions.controller.impl;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;

import com.sephora.services.sourcingoptions.client.AvailabilityHubClient;
import com.sephora.services.sourcingoptions.service.DynamicConfigService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.sephora.platform.common.utils.ApplicationUtils;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.sourcingoptions.TestConfig;
import com.sephora.services.sourcingoptions.config.MessageConfig;
import com.sephora.services.sourcingoptions.exception.ZoneMapCsvValidationException;
import com.sephora.services.sourcingoptions.service.ShipNodeDelayService;
import com.sephora.services.sourcingoptions.service.SourcingOptionsService;
import com.sephora.services.sourcingoptions.service.ZoneMapCsvUploadService;
import com.sephora.services.sourcingoptions.service.impl.ZoneMapServiceImpl;

@RunWith(SpringRunner.class)
@EnableAutoConfiguration(exclude = { DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class,
		SimpleDiscoveryClientAutoConfiguration.class, RedisAutoConfiguration.class,
		RedisRepositoriesAutoConfiguration.class, KafkaAutoConfiguration.class })
@WebMvcTest(value = SourcingControllerImpl.class)
@ContextConfiguration(classes = { TestConfig.class, 
		MessageConfig.class, 
		RequestLoggingFilterConfig.class,
		ApplicationUtils.class}, initializers = ConfigDataApplicationContextInitializer.class)
@ComponentScan(value = {"com.sephora.services.sourcingoptions.controller.impl","com.sephora.services.sourcingoptions.controller"})
@MockBeans({ @MockBean(ShipNodeControllerImpl.class), @MockBean(SourcingOptionsService.class),
		@MockBean(ZoneMapServiceImpl.class), @MockBean(ShipNodeDelayService.class) })
public class ZoneMappingCsvFileUploadTests {
	
	public static final String SHIP_NODE_NOT_FOUND_ERROR = "shipNode.notFound";
	public static final String UPLOADED_ZONE_MAPPING_NOT_FOUND = "uploadZoneMapping.zoneMaps.notFound";
	public static final String UPLOADED_ZONE_MAPPING_INVALID_DC = "uploadZoneMapping.zoneMaps.invalid.dc";
	public static final String UPLOADED_ZONE_MAPPING_INVALID_ZONE_OR_ZIPCODE = "uploadZoneMapping.zoneMaps.invalid.zipcode.zone";
	public static final String UPLOADED_ZONE_MAPPING_INVALID_HEADER = "uploadZoneMapping.zoneMaps.invalid.header";
	public static final String UPLOADED_ZONE_MAPPING_INVALID_EOD = "uploadZoneMapping.zoneMaps.invalid.eod";
	
	@Autowired
	MockMvc mockMvc;

	@MockBean
	private ZoneMapCsvUploadService zoneMapCsvUploadService;

	@MockBean
	private DynamicConfigService dynamicConfigService;

	@MockBean
	@Qualifier("sourcingOptionsServiceImpl")
	private SourcingOptionsService sourcingOptionsService;

	@MockBean
	private AvailabilityHubClient availabilityHubClient;
	
	@Test
	public void testUploadCsvFile() throws Exception {
		MockMultipartFile file = new MockMultipartFile("file", "moke_zone_mapping_csv.csv",
				MediaType.MULTIPART_FORM_DATA_VALUE, "<<Mock Zone mapping data>>".getBytes(StandardCharsets.UTF_8));
		mockMvc.perform(multipart("/v1/sourcing/zone_maps/csv/SEPHORAUS").file(file).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}
	
	
	@Test
	public void testUploadCsvFileNotFound() throws Exception {
		MockMultipartFile file = new MockMultipartFile("file", "moke_zone_mapping_csv.csv",
				MediaType.MULTIPART_FORM_DATA_VALUE, "<<Mock Zone mapping data>>".getBytes(StandardCharsets.UTF_8));
		
		Mockito.doThrow(new ZoneMapCsvValidationException(SHIP_NODE_NOT_FOUND_ERROR, "0701"))
		.when(zoneMapCsvUploadService)
		.uploadCvsZoneMaps(ArgumentMatchers.any(),ArgumentMatchers.any());
		
		mockMvc.perform(multipart("/v1/sourcing/zone_maps/csv/SEPHORAUS").file(file).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotAcceptable())
				.andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40400")));
	}
	
	@Test
	public void testUploadCsvFileInvaidDc() throws Exception {
		MockMultipartFile file = new MockMultipartFile("file", "moke_zone_mapping_csv.csv",
				MediaType.MULTIPART_FORM_DATA_VALUE, "<<Mock Zone mapping data>>".getBytes(StandardCharsets.UTF_8));
		
		Mockito.doThrow(new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_DC, "0701"))
		.when(zoneMapCsvUploadService)
		.uploadCvsZoneMaps(ArgumentMatchers.any(),ArgumentMatchers.any());
		
		mockMvc.perform(multipart("/v1/sourcing/zone_maps/csv/SEPHORAUS").file(file).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotAcceptable())
				.andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40601")));
	}
	
	@Test
	public void testUploadCsvFileInvaidZipCoedOrZone() throws Exception {
		MockMultipartFile file = new MockMultipartFile("file", "moke_zone_mapping_csv.csv",
				MediaType.MULTIPART_FORM_DATA_VALUE, "<<Mock Zone mapping data>>".getBytes(StandardCharsets.UTF_8));
		
		Mockito.doThrow(new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_ZONE_OR_ZIPCODE, "0701"))
		.when(zoneMapCsvUploadService)
		.uploadCvsZoneMaps(ArgumentMatchers.any(),ArgumentMatchers.any());
		
		mockMvc.perform(multipart("/v1/sourcing/zone_maps/csv/SEPHORAUS").file(file).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotAcceptable())
				.andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40602")));
	}
	
	@Test
	public void testUploadCsvFileInvaidHeader() throws Exception {
		MockMultipartFile file = new MockMultipartFile("file", "moke_zone_mapping_csv.csv",
				MediaType.MULTIPART_FORM_DATA_VALUE, "<<Mock Zone mapping data>>".getBytes(StandardCharsets.UTF_8));
		
		Mockito.doThrow(new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_HEADER, "0701"))
		.when(zoneMapCsvUploadService)
		.uploadCvsZoneMaps(ArgumentMatchers.any(),ArgumentMatchers.any());
		
		mockMvc.perform(multipart("/v1/sourcing/zone_maps/csv/SEPHORAUS").file(file).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotAcceptable())
				.andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40603")));
	}
	
	@Test
	public void testUploadCsvFileInvaidEof() throws Exception {
		MockMultipartFile file = new MockMultipartFile("file", "moke_zone_mapping_csv.csv",
				MediaType.MULTIPART_FORM_DATA_VALUE, "<<Mock Zone mapping data>>".getBytes(StandardCharsets.UTF_8));
		
		Mockito.doThrow(new ZoneMapCsvValidationException(UPLOADED_ZONE_MAPPING_INVALID_EOD, "0701"))
		.when(zoneMapCsvUploadService)
		.uploadCvsZoneMaps(ArgumentMatchers.any(),ArgumentMatchers.any());
		
		mockMvc.perform(multipart("/v1/sourcing/zone_maps/csv/SEPHORAUS").file(file).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotAcceptable())
				.andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40604")));
	}
}
