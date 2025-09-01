package com.sephora.services.sourcingoptions.service;

import static com.sephora.services.sourcingoptions.SourcingoptionsTestConstants.RESOURCE_PATH;
import static com.sephora.services.sourcingoptions.SourcingoptionsTestConstants.ZONEMAP_RESOURCE_FOLDER;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.when;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

//import com.sephora.platform.util.SkipPatternUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.multipart.MultipartFile;

import com.microsoft.azure.documentdb.DocumentClientException;
import com.microsoft.azure.documentdb.bulkexecutor.DocumentBulkExecutor;
import com.sephora.services.sourcingoptions.TestConfig;
import com.sephora.services.sourcingoptions.TestUtils;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.exception.ZoneMapCsvValidationException;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.repository.cosmos.TempZoneMapRepository;
import com.sephora.services.sourcingoptions.service.impl.ZoneMapCsvUploadServiceImpl;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {ZoneMapCsvUploadServiceImpl.class})
@EnableAutoConfiguration(exclude = { DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class,
		SimpleDiscoveryClientAutoConfiguration.class, RedisAutoConfiguration.class,
		RedisRepositoriesAutoConfiguration.class, KafkaAutoConfiguration.class })
@ContextConfiguration(classes = { TestConfig.class}, initializers = ConfigDataApplicationContextInitializer.class)
@MockBeans({@MockBean(ShipNodeService.class), @MockBean(EmailService.class), @MockBean(TempZoneMapRepository.class)})
@TestPropertySource("classpath:application.yaml")
public class ZoneMapCsvUploadServiceImplTests {
	
	@Autowired
	ZoneMapCsvUploadServiceImpl zoneMapCsvUploadService;
	
	@MockBean
	ShipNodeService shipNodeService;
	
	@MockBean
	private DocumentBulkExecutor zoneMapBulkExecutor;
	
	@MockBean
	TempZoneMapRepository tempZoneMapRepository;

//	@MockBean
//	SkipPatternUtil skipPatternUtil;

	@MockBean
	SourcingHubZoneMapService sourcingHubZoneMapService;
	
	@Test
	public void testUloadCvsZoneMaps() throws FileNotFoundException, IOException, SourcingServiceException, DocumentClientException {
		File file = new File(RESOURCE_PATH + ZONEMAP_RESOURCE_FOLDER + File.separator + "SOURCING_US_ZoneMapping_test.csv");
		MultipartFile multipartFile = new MockMultipartFile("SOURCING_US_ZoneMapping_test", new FileInputStream(file));
		assertNotNull(multipartFile);
		when(shipNodeService.findAllShipNodeByEnterpriseCode(ArgumentMatchers.any())).thenReturn(TestUtils.getShipNodeFromConstants());
		zoneMapCsvUploadService.uploadCvsZoneMaps(EnterpriseCodeEnum.SEPHORAUS, multipartFile);
		
		Mockito.verify(tempZoneMapRepository, Mockito.times(1)).save(ArgumentMatchers.any());
		
		Mockito.reset(zoneMapBulkExecutor);
	}
	
	@Test( expected=ZoneMapCsvValidationException.class)
	public void testUloadCvsZoneMapsInvaildHeader() throws FileNotFoundException, IOException, SourcingServiceException, DocumentClientException {
		File file = new File(RESOURCE_PATH + ZONEMAP_RESOURCE_FOLDER + File.separator + "SOURCING_US_ZoneMapping_test_invalid_header.csv");
		MultipartFile multipartFile = new MockMultipartFile("SOURCING_US_ZoneMapping_test", new FileInputStream(file));
		assertNotNull(multipartFile);
		when(shipNodeService.findAllShipNodeByEnterpriseCode(ArgumentMatchers.any())).thenReturn(TestUtils.getShipNodeFromConstants());
		zoneMapCsvUploadService.uploadCvsZoneMaps(EnterpriseCodeEnum.SEPHORAUS, multipartFile);
	}
	
	@Test( expected=ZoneMapCsvValidationException.class)
	public void testUloadCvsZoneMapsInvailFirstColumn() throws FileNotFoundException, IOException, SourcingServiceException, DocumentClientException {
		File file = new File(RESOURCE_PATH + ZONEMAP_RESOURCE_FOLDER + File.separator + "SOURCING_US_ZoneMapping_test_invalid_first_column.csv");
		MultipartFile multipartFile = new MockMultipartFile("SOURCING_US_ZoneMapping_test", new FileInputStream(file));
		assertNotNull(multipartFile);
		when(shipNodeService.findAllShipNodeByEnterpriseCode(ArgumentMatchers.any())).thenReturn(TestUtils.getShipNodeFromConstants());
		zoneMapCsvUploadService.uploadCvsZoneMaps(EnterpriseCodeEnum.SEPHORAUS, multipartFile);
	}
	@Test( expected=ZoneMapCsvValidationException.class)
	public void testUloadCvsZoneMapsInvaildZipCode() throws FileNotFoundException, IOException, SourcingServiceException, DocumentClientException {
		File file = new File(RESOURCE_PATH + ZONEMAP_RESOURCE_FOLDER + File.separator + "SOURCING_US_ZoneMapping_test_invalid_zip_code.csv");
		MultipartFile multipartFile = new MockMultipartFile("SOURCING_US_ZoneMapping_test", new FileInputStream(file));
		assertNotNull(multipartFile);
		when(shipNodeService.findAllShipNodeByEnterpriseCode(ArgumentMatchers.any())).thenReturn(TestUtils.getShipNodeFromConstants());
		zoneMapCsvUploadService.uploadCvsZoneMaps(EnterpriseCodeEnum.SEPHORAUS, multipartFile);
	}
	
	@Test( expected=ZoneMapCsvValidationException.class)
	public void testUloadCvsZoneMapsInvaildShipNode() throws FileNotFoundException, IOException, SourcingServiceException, DocumentClientException {
		File file = new File(RESOURCE_PATH + ZONEMAP_RESOURCE_FOLDER + File.separator + "SOURCING_US_ZoneMapping_test_invalid_shipNode.csv");
		MultipartFile multipartFile = new MockMultipartFile("SOURCING_US_ZoneMapping_test", new FileInputStream(file));
		assertNotNull(multipartFile);
		when(shipNodeService.findAllShipNodeByEnterpriseCode(ArgumentMatchers.any())).thenReturn(TestUtils.getShipNodeFromConstants());
		zoneMapCsvUploadService.uploadCvsZoneMaps(EnterpriseCodeEnum.SEPHORAUS, multipartFile);
	}
	@Test( expected=ZoneMapCsvValidationException.class)
	public void testUloadCvsZoneMapsInvaildEof() throws FileNotFoundException, IOException, SourcingServiceException, DocumentClientException {
		File file = new File(RESOURCE_PATH + ZONEMAP_RESOURCE_FOLDER + File.separator + "SOURCING_US_ZoneMapping_test_invalid_eod.csv");
		MultipartFile multipartFile = new MockMultipartFile("SOURCING_US_ZoneMapping_test", new FileInputStream(file));
		assertNotNull(multipartFile);
		when(shipNodeService.findAllShipNodeByEnterpriseCode(ArgumentMatchers.any())).thenReturn(TestUtils.getShipNodeFromConstants());
		zoneMapCsvUploadService.uploadCvsZoneMaps(EnterpriseCodeEnum.SEPHORAUS, multipartFile);
	}
}
