package com.sephora.services.sourcingoptions.service;

import com.microsoft.azure.documentdb.DocumentClientException;
import com.microsoft.azure.documentdb.bulkexecutor.BulkImportResponse;
import com.microsoft.azure.documentdb.bulkexecutor.DocumentBulkExecutor;
import com.sephora.platform.common.utils.DateTimeProvider;
import com.sephora.platform.common.utils.DateTimeUtils;
import com.sephora.services.sourcingoptions.TestConfig;
import com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig;
import com.sephora.services.sourcingoptions.exception.NotFoundException;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.BatchOperationResultBean;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapFullDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapFullDto.Fields;
import com.sephora.services.sourcingoptions.model.dto.ZoneMappingFilterDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapsDto;
import com.sephora.services.sourcingoptions.model.dto.ZonesDto;
import com.sephora.services.sourcingoptions.repository.cosmos.ZoneMapRepository;
import com.sephora.services.sourcingoptions.service.impl.ZoneMapCsvUploadServiceImpl;
import com.sephora.services.sourcingoptions.service.impl.ZoneMapServiceImpl;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import java.text.MessageFormat;
import java.util.List;

import static com.sephora.services.sourcingoptions.model.dto.ZipCodeRangeDto.ZipCodeRangeBuilder.anZipCodeRangeDto;
import static com.sephora.services.sourcingoptions.model.dto.ZonesDto.ZonesBuilder.anZonesDto;
import static com.sephora.services.sourcingoptions.service.impl.ZoneMapServiceImpl.UPLOADED_ZONE_MAPPING_NOT_FOUND;
import static com.sephora.services.sourcingoptions.service.impl.ZoneMapServiceImpl.ZONE_MAPPING_NOT_FOUND;
import static java.util.Arrays.asList;
import static java.util.Collections.emptyList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasProperty;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {ZoneMapServiceImpl.class})
@ContextConfiguration(classes = { TestConfig.class}, initializers = ConfigDataApplicationContextInitializer.class)
@TestPropertySource("classpath:application.yaml")
public class ZoneMapServiceTest {

    private static final String ENTERPRISE_CODE = "SEPHORAUS";
    private static final String FROM_ZIPCODE = "1";
    private static final String TO_ZIPCODE = "2";

    @Autowired
    private ZoneMapService zoneMapService;

    @MockBean
    private ShipNodeService shipNodeService;

    @MockBean
    private ZoneMapRepository zoneMapRepository;

    @MockBean
    private DocumentBulkExecutor zoneMapBulkExecutor;

    @MockBean
    private DateTimeProvider dateTimeProvider;

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Before
    public void before() {
        when(shipNodeService.findAllShipNode()).thenReturn(asList(ShipNode.builder()
            .id("1001")
            .build()));
    }

    @Test
    public void whenGetZoneMap_andUnhandledExceptionThrown_shouldWrapInSourcingServiceException() throws SourcingServiceException {
        when(zoneMapRepository.findByCriteria(any(), any(), any(), any()))
            .thenThrow(RuntimeException.class);

        thrown.expect(SourcingServiceException.class);

        zoneMapService.getZoneMap(new ZoneMappingFilterDto());
    }

    @Test
    public void whenGetZoneMap_andNoItemsFound_shouldThrowNotFoundException() throws SourcingServiceException {
        when(zoneMapRepository.findByCriteria(any(), any(), any(), any()))
            .thenReturn(emptyList());

        thrown.expect(NotFoundException.class);
        thrown.expect(hasProperty("message", equalTo(ZONE_MAPPING_NOT_FOUND)));

        zoneMapService.getZoneMap(new ZoneMappingFilterDto());
    }

    @Test
    public void whenUploadZoneMaps_shouldValidateInputPriorities() throws SourcingServiceException {
        ZoneMapsDto dto = new ZoneMapsDto();
        ZonesDto zonesDto = new ZonesDto();
        zonesDto.setNodePriority("NOT_EXIST");
        dto.setZones(asList(zonesDto));

        thrown.expect(NotFoundException.class);
        thrown.expect(hasProperty("message", equalTo(UPLOADED_ZONE_MAPPING_NOT_FOUND)));

        zoneMapService.uploadZoneMaps(dto);
    }

    @Test
    public void whenUploadZoneMaps_andUnhandledExceptionThrown_shouldWrapInSourcingServiceException() throws SourcingServiceException {
        doThrow(RuntimeException.class).when(zoneMapRepository).deleteByEnterpriseCode(any());

        thrown.expect(SourcingServiceException.class);

        ZoneMapsDto dto = new ZoneMapsDto();
        ZonesDto zonesDto = new ZonesDto();
        zonesDto.setNodePriority("1001");
        dto.setZones(asList(zonesDto));

        zoneMapService.uploadZoneMaps(dto);
    }

    @Test
    public void whenUploadZoneMaps_shouldFillIdAndCreatedDate() throws SourcingServiceException, DocumentClientException {
        String dateTimeNowInPST = DateTimeUtils.dateTimeNowInPST();
        when(dateTimeProvider.dateTimeNowInPST()).thenReturn(dateTimeNowInPST);
        when(zoneMapBulkExecutor.importAll(any(), anyBoolean(), anyBoolean(), any())).thenReturn(mock(BulkImportResponse.class));

        ZoneMapsDto dto = ZoneMapsDto.builder()
                .enterpriseCode(ENTERPRISE_CODE)
                .zones(asList(anZonesDto()
                        .withNodePriority("1001")
                        .withZipCodeRanges(anZipCodeRangeDto()
                            .withFromZipCode(FROM_ZIPCODE)
                            .withToZipCode(TO_ZIPCODE)
                            .build())
                        .build()))
                .build();

        BatchOperationResultBean result = zoneMapService.uploadZoneMaps(dto);

        verify(zoneMapBulkExecutor).importAll(anyList(), anyBoolean(), anyBoolean(), any());

        String idValue = MessageFormat.format("{0}_{1}_{2}", ENTERPRISE_CODE, FROM_ZIPCODE, TO_ZIPCODE);
        assertThat(result.getRecordCount()).isEqualTo(1);
        assertThat(result.getFailedRecordCount()).isEqualTo(0);
        assertThat(result.getProcessedRecordCount()).isEqualTo(0);
    }

    @Test
    public void whenDeleteZoneMaps_andUnhandledExceptionThrown_shouldWrapInSourcingServiceException() throws SourcingServiceException {
        when(zoneMapRepository.deleteByCriteria(any(), any(), any(), any())).thenThrow(RuntimeException.class);

        thrown.expect(SourcingServiceException.class);

        zoneMapService.deleteZoneMaps(new ZoneMappingFilterDto());
    }
}
