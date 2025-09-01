package com.sephora.services.sourcingoptions.controller.impl;

import com.sephora.platform.common.utils.ApplicationUtils;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
/*import com.sephora.services.commons.config.discovery.LocalServiceInstanceConfig;*/
/*import com.sephora.services.commons.logging.RequestLoggingFilterConfig;*/
import com.sephora.services.sourcingoptions.config.MessageConfig;
import com.sephora.services.sourcingoptions.controller.SourcingController;
import com.sephora.services.sourcingoptions.controller.SourcingResponseEntityExceptionHandler;
import com.sephora.services.sourcingoptions.exception.NotFoundException;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMappingFilterDto;
import com.sephora.services.sourcingoptions.service.ShipNodeDelayService;
import com.sephora.services.sourcingoptions.service.SourcingOptionsService;
import com.sephora.services.sourcingoptions.service.ZoneMapCsvUploadService;
import com.sephora.services.sourcingoptions.service.ZoneMapService;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.cloud.autoconfigure.RefreshAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.sephora.platform.common.utils.MessageUtils.getMessage;
import static com.sephora.services.sourcingoptions.service.impl.ShipNodeServiceImpl.SEPARATOR;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(SourcingController.class)
@ImportAutoConfiguration(RefreshAutoConfiguration.class)
@ContextConfiguration(classes = {
        SourcingControllerImpl.class,
        MessageConfig.class,
        SourcingResponseEntityExceptionHandler.class,
        RequestLoggingFilterConfig.class,
        ApplicationUtils.class
})
@MockBeans({
    @MockBean(name = "sourcingOptionsServiceImpl", value = SourcingOptionsService.class),
    @MockBean(ZoneMapCsvUploadService.class),
    @MockBean(ShipNodeDelayService.class)
})
public class SourcingControllerFunctionalTest {

    private static final String ZONE_MAPPING_NOT_FOUND = "getZoneMapping.zoneMap.notFound";
    private static final String SHIP_NODES_NOT_FOUND = "uploadZoneMapping.zoneMaps.notFound";

    @Autowired
    private MockMvc mvc;

    @MockBean
    private ZoneMapService zoneMapService;

    private final static String ENTERPRISE_CODE = "SEPHORAUS";
    private final static String FROM_ZIP_CODE = "94100";
    private final static String TO_ZIP_CODE = "94199";
    private final static String PRIORITY = "0701|0801|1001|1021";

    @Test
    public void whenGetZoneMappingNoParams_thenOk() throws Exception {

        List<ZoneMapDto> zoneMapList = new ArrayList<>();
        ZoneMapDto zoneMapDto = getZoneMapDto();
        zoneMapList.add(zoneMapDto);


        ZoneMappingFilterDto zoneMappingFilterDto = getZoneMappingFilterDto();

        given(zoneMapService.getZoneMap(zoneMappingFilterDto))
                .willReturn(zoneMapList);

        mvc.perform(get("/v1/sourcing/zone_maps?enterpriseCode={code}&fromZipCode={from}&toZipCode={to}&nodePriority={priority}",
                ENTERPRISE_CODE, FROM_ZIP_CODE, TO_ZIP_CODE, PRIORITY))
              .andExpect(status().isOk());
    }

    private ZoneMappingFilterDto getZoneMappingFilterDto() {
        return ZoneMappingFilterDto.builder()
                .enterpriseCode(ENTERPRISE_CODE)
                .fromZipCode(FROM_ZIP_CODE)
                .toZipCode(TO_ZIP_CODE)
                .nodePriority(PRIORITY)
                .build();
    }

    private ZoneMapDto getZoneMapDto() {
        return ZoneMapDto.Builder.anZoneMapDto()
                    .withEnterpriseCode(ENTERPRISE_CODE)
                    .withFromZipCode(FROM_ZIP_CODE)
                    .withToZipCode(TO_ZIP_CODE)
                    .withNodePriority(PRIORITY)
                    .build();
    }

    @Test
    public void whenGetZoneMappingInvalidEnterpriseCode_then400Error() throws Exception {

        String enterpriseCode = "testCode";

        mvc.perform(get("/v1/sourcing/zone_maps?enterpriseCode={code}&fromZipCode={from}&toZipCode={to}&nodePriority={priority}",
                enterpriseCode, FROM_ZIP_CODE, TO_ZIP_CODE, PRIORITY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40010")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The enterpriseCode value provided is not an identified one. List of possible channel values: 'SEPHORAUS', 'SEPHORACA'")));
    }

    @Test
    public void whenGetZoneMappingInvalidFromZipCode_then400Error() throws Exception {

        String zipCode = "tooLongCode";

        mvc.perform(get("/v1/sourcing/zone_maps?enterpriseCode={code}&fromZipCode={from}&toZipCode={to}&nodePriority={priority}",
                ENTERPRISE_CODE, zipCode, TO_ZIP_CODE, PRIORITY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40011")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'fromZipCode' length must be less than or equal to 5 symbols")));
    }

    @Test
    public void whenGetZoneMappingInvalidToZipCode_then400Error() throws Exception {

        String zipCode = "tooLongCode";

        mvc.perform(get("/v1/sourcing/zone_maps?enterpriseCode={code}&fromZipCode={from}&toZipCode={to}&nodePriority={priority}",
                ENTERPRISE_CODE, FROM_ZIP_CODE, zipCode, PRIORITY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40012")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'toZipCode' length must be less than or equal to 5 symbols")));
    }

    @Test
    public void whenGetZoneMappingInvalidPriority_then400Error() throws Exception {

        String priority = RandomStringUtils.random(41);

        mvc.perform(get("/v1/sourcing/zone_maps?enterpriseCode={code}&fromZipCode={from}&toZipCode={to}&nodePriority={priority}",
                ENTERPRISE_CODE, FROM_ZIP_CODE, TO_ZIP_CODE, priority))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40013")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'nodePriority' length must be less than or equal to 40 symbols")));
    }

    @Test
    public void whenGetZoneMappingNotFound_then404Error() throws Exception {

        ZoneMappingFilterDto zoneMappingFilterDto = getZoneMappingFilterDto();

        given(zoneMapService.getZoneMap(zoneMappingFilterDto))
                .willThrow(new NotFoundException(ZONE_MAPPING_NOT_FOUND, zoneMappingFilterDto));

        mvc.perform(get("/v1/sourcing/zone_maps?enterpriseCode={code}&fromZipCode={from}&toZipCode={to}&nodePriority={priority}",
                ENTERPRISE_CODE, FROM_ZIP_CODE, TO_ZIP_CODE, PRIORITY))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40410")))
                .andExpect(jsonPath("$..errorMessage",
                        hasItem("Unable to find 'zoneMap' item by enterpriseCode='SEPHORAUS', fromZipCode='94100', toZipCode='94199', nodePriority='0701|0801|1001|1021'")));
    }

    @Test
    public void whenGetZoneMappingWithFromZipCodeNotFound_then404Error() throws Exception {

        ZoneMappingFilterDto zoneMappingFilterDto = ZoneMappingFilterDto.builder()
                .fromZipCode(FROM_ZIP_CODE)
                .build();

        given(zoneMapService.getZoneMap(zoneMappingFilterDto))
                .willThrow(new NotFoundException(ZONE_MAPPING_NOT_FOUND, zoneMappingFilterDto));

        mvc.perform(get("/v1/sourcing/zone_maps?fromZipCode={from}",FROM_ZIP_CODE))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40410")))
                .andExpect(jsonPath("$..errorMessage",
                        hasItem("Unable to find 'zoneMap' item by enterpriseCode='null', fromZipCode='94100', toZipCode='null', nodePriority='null'")));
    }

    @Test
    public void whenGetZoneMappingWithServerError_thenReturn500Error() throws Exception {

        ZoneMappingFilterDto zoneMappingFilterDto = ZoneMappingFilterDto.builder()
                .enterpriseCode(ENTERPRISE_CODE)
                .fromZipCode("from")
                .toZipCode("to")
                .nodePriority("priority")
                .build();

        given(zoneMapService.getZoneMap(zoneMappingFilterDto))
                .willThrow(SourcingServiceException.class);

        mvc.perform(get("/v1/sourcing/zone_maps?enterpriseCode=SEPHORAUS&fromZipCode=from&toZipCode=to&nodePriority=priority"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_50000")))
                .andExpect(jsonPath("$..errorMessage", hasItem("Internal server error")));

    }

    @Test
    public void whenUploadZoneMappingWithCorrectParams_thenOk() throws Exception {

        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                      "    \"zones\": [" +
                      "        {\"nodePriority\": \"0701|0801|1001|1021\"," +
                      "            \"zipCodeRanges\": [" +
                      "                {\"fromZipCode\": \"29000\"," +
                      "                  \"toZipCode\": \"29099\"}]" +
                      "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                        .content(json)
                        .accept(MediaType.APPLICATION_JSON)
                        .contentType(MediaType.APPLICATION_JSON))
           .andExpect(status().isInternalServerError());

    }

    @Test
    public void whenUploadZoneMappingWithToZipCodeGreaterThanFrom_then400Error() throws Exception {

        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                      "    \"zones\": [" +
                      "        {\"nodePriority\": \"0701|0801|1001|1021\"," +
                      "            \"zipCodeRanges\": [" +
                      "                {\"fromZipCode\": \"39099\"," +
                      "                  \"toZipCode\": \"29099\"}]" +
                      "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                        .content(json)
                        .contentType(MediaType.APPLICATION_JSON))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40014")))
           .andExpect(jsonPath("$..errorMessage", hasItem("The field {toZipCode} must be >= than the field {fromZipCode}")));
    }

    @Test
    public void whenUploadZoneMappingWithToLongNodePriority_then400Error() throws Exception {

        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                      "    \"zones\": [" +
                      "        {\"nodePriority\": \"0701|080110011020801100110210801100110211231231231\"," +
                      "            \"zipCodeRanges\": [" +
                      "                {\"fromZipCode\": \"29000\"," +
                      "                  \"toZipCode\": \"29099\"}]" +
                      "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                        .content(json)
                        .contentType(MediaType.APPLICATION_JSON))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40015")))
           .andExpect(jsonPath("$..errorMessage", hasItem("The field-s {nodePriority} length must be less than or equal to 40 symbols")));
    }

    @Test
    public void whenUploadZoneMappingInvalidEnterpriseCode_then400Error() throws Exception {

        String json = "{\"enterpriseCode\": \"SEPHORAUSCA\"," +
                      "    \"zones\": [" +
                      "        {\"nodePriority\": \"0701|0801|1001|1021\"," +
                      "            \"zipCodeRanges\": [" +
                      "                {\"fromZipCode\": \"29000\"," +
                      "                  \"toZipCode\": \"29099\"}]" +
                      "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                        .content(json)
                        .contentType(MediaType.APPLICATION_JSON))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40016")))
           .andExpect(jsonPath("$..errorMessage", hasItem("The enterpriseCode value provided is not an identified one. List of possible channel values: 'SEPHORAUS', 'SEPHORACA'")));
    }

    @Test
    public void whenUploadZoneMappingWithToLongZipCode_then400Error() throws Exception {


        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                      "    \"zones\": [" +
                      "        {\"nodePriority\": \"0701|0801|1001|1021\"," +
                      "            \"zipCodeRanges\": [" +
                      "                {\"fromZipCode\": \"290988\"," +
                      "                  \"toZipCode\": \"29099\"}]" +
                      "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                        .content(json)
                        .contentType(MediaType.APPLICATION_JSON))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40017")))
           .andExpect(jsonPath("$..errorMessage", hasItem("The field-s {fromZipCode} length must be less than or equal to 5 symbols")));
    }

    @Test
    public void whenUploadZoneMappingWithEmptyFromZipCode_then400Error() throws Exception {


        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                      "    \"zones\": [" +
                      "        {\"nodePriority\": \"0701|0801|1001|1021\"," +
                      "            \"zipCodeRanges\": [" +
                      "                {\"fromZipCode\": \"\"," +
                      "                  \"toZipCode\": \"29099\"}]" +
                      "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                        .content(json)
                        .contentType(MediaType.APPLICATION_JSON))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40018")))
           .andExpect(jsonPath("$..errorMessage", hasItem("The field 'fromZipCode' cannot be null or blank")));
    }

    @Test
    public void whenUploadZoneMappingWithTooLongFromZipCode_then400Error() throws Exception {


        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                      "    \"zones\": [" +
                      "        {\"nodePriority\": \"0701|0801|1001|1021\"," +
                      "            \"zipCodeRanges\": [" +
                      "                {\"fromZipCode\": \"290999\"," +
                      "                  \"toZipCode\": \"29099\"}]" +
                      "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                        .content(json)
                        .contentType(MediaType.APPLICATION_JSON))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40017")))
           .andExpect(jsonPath("$..errorMessage", hasItem("The field-s {fromZipCode} length must be less than or equal to 5 symbols")));
    }

    @Test
    public void whenUploadZoneMappingWithEmptyToZipCode_then400Error() throws Exception {


        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                "    \"zones\": [" +
                "        {\"nodePriority\": \"0701|0801|1001|1021\"," +
                "            \"zipCodeRanges\": [" +
                "                {\"fromZipCode\": \"29099\"," +
                "                  \"toZipCode\": \"\"}]" +
                "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40020")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'toZipCode' cannot be null or blank")));
    }

    @Test
    public void whenUploadZoneMappingWithTooLongToZipCode_then400Error() throws Exception {


        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
            "    \"zones\": [" +
            "        {\"nodePriority\": \"0701|0801|1001|1021\"," +
            "            \"zipCodeRanges\": [" +
            "                {\"fromZipCode\": \"29099\"," +
            "                  \"toZipCode\": \"290999\"}]" +
            "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                        .content(json)
                        .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40019")))
            .andExpect(jsonPath("$..errorMessage", hasItem("The field-s {toZipCode} length must be less than or equal to 5 symbols")));
    }

    @Test
    public void whenUploadZoneMappingWithEmptyNodePriority_then400Error() throws Exception {


        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                      "    \"zones\": [" +
                      "        {\"nodePriority\": \"\"," +
                      "            \"zipCodeRanges\": [" +
                      "                {\"fromZipCode\": \"29099\"," +
                      "                  \"toZipCode\": \"29099\"}]" +
                      "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
            .content(json)
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40021")))
            .andExpect(jsonPath("$..errorCode", not(hasItem("ERR_S_40015"))))
            .andExpect(jsonPath("$..errorMessage", hasItem("The field 'nodePriority' cannot be null or blank")));
    }

    @Test
    public void whenUploadZoneMappingWithEmptyZipCodeRanges_then400Error() throws Exception {


        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                "    \"zones\": [" +
                "        {\"nodePriority\": \"0701|0801|1001|1021\" }" +
                "]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40022")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'zipCodeRanges' cannot be null or blank")));
    }

    @Test
    public void whenUploadZoneMappingWithEmptyZipCodeRangesList_then400Error() throws Exception {

        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                "    \"zones\": [" +
                "        {\"nodePriority\": \"0701|0801|1001|1021\", " +
                "         \"zipCodeRanges\": []}" +
                "]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40022")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'zipCodeRanges' cannot be null or blank")));
    }

    @Test
    public void whenUploadZoneMappingWithTooLongReference_then400Error() throws Exception {

        String referenceValue = RandomStringUtils.random(101);
        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                "    \"reference\": \""+ referenceValue +"\"," +
                "    \"zones\": [" +
                "        {\"nodePriority\": \"0701|0801\"," +
                "            \"zipCodeRanges\": [" +
                "                {\"fromZipCode\": \"29000\"," +
                "                  \"toZipCode\": \"29099\"}]" +
                "        }]}";

        mvc.perform(post("/v1/sourcing/zone_maps")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40023")))
                .andExpect(jsonPath("$..errorMessage", hasItem("The field 'reference' length must be less than or equal to 100 symbols")));
    }

    @Test
    public void wheUploadZoneMappingShipNodesNotFound_then404Error() throws Exception {

        String json = "{\"enterpriseCode\": \"SEPHORAUS\"," +
                "    \"zones\": [" +
                "        {\"nodePriority\": \"0701|0801\"," +
                "            \"zipCodeRanges\": [" +
                "                {\"fromZipCode\": \"29000\"," +
                "                  \"toZipCode\": \"29099\"}]" +
                "        }]}";


        Mockito.doThrow(new NotFoundException(SHIP_NODES_NOT_FOUND, StringUtils.join(Arrays.asList("0701", "0801"), SEPARATOR)))
                .when(zoneMapService).uploadZoneMaps(any());

        mvc.perform(post("/v1/sourcing/zone_maps")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40411")))
                .andExpect(jsonPath("$..errorMessage", hasItem("Unable to find 'ShipNodes' with names=[0701,0801]")));
    }
}