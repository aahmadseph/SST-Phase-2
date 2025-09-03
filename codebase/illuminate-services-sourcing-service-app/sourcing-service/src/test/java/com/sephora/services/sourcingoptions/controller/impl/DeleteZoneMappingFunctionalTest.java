package com.sephora.services.sourcingoptions.controller.impl;

import com.sephora.platform.common.utils.ApplicationUtils;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
/*import com.sephora.services.commons.config.discovery.LocalServiceInstanceConfig;
import com.sephora.services.commons.logging.RequestLoggingFilterConfig;*/
import com.sephora.services.sourcingoptions.config.MessageConfig;
import com.sephora.services.sourcingoptions.controller.SourcingResponseEntityExceptionHandler;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.dto.ZoneMappingFilterDto;
import com.sephora.services.sourcingoptions.service.ShipNodeDelayService;
import com.sephora.services.sourcingoptions.service.SourcingOptionsService;
import com.sephora.services.sourcingoptions.service.ZoneMapCsvUploadService;
import com.sephora.services.sourcingoptions.service.ZoneMapService;
import net.bytebuddy.utility.RandomString;
import org.junit.Test;
import org.junit.runner.RunWith;
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

import static org.hamcrest.Matchers.hasItem;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(SourcingControllerImpl.class)
@ImportAutoConfiguration(RefreshAutoConfiguration.class)
@ContextConfiguration(classes = {
        MessageConfig.class,
        SourcingControllerImpl.class,
        SourcingResponseEntityExceptionHandler.class,
        RequestLoggingFilterConfig.class,
        ApplicationUtils.class
})
@MockBeans({
    @MockBean(name = "sourcingOptionsServiceImpl", value = SourcingOptionsService.class),
    @MockBean(ZoneMapCsvUploadService.class),
    @MockBean(ShipNodeDelayService.class)
})
public class DeleteZoneMappingFunctionalTest {

    private static final String INTERNAL_SERVER_ERROR = "internal.server.error";

    @Autowired
    private MockMvc mvc;

    @MockBean
    private ZoneMapService zoneMapService;

    @Test
    public void whenDeleteZoneMappingWithAllCriteria_thenOk() throws Exception {
        String enterpriseCode = "SEPHORAUS";
        String fromZipCode = RandomString.make(5);
        String toZipCode = RandomString.make(5);
        String nodePriority = RandomString.make(35);

        mvc.perform(delete("/v1/sourcing/zone_maps?enterpriseCode={code}&fromZipCode={from}&toZipCode={to}&nodePriority={priority}",
                enterpriseCode, fromZipCode, toZipCode, nodePriority)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").doesNotExist());

    }

    @Test
    public void whenDeleteZoneMappingWithEmptyBody_thenOk() throws Exception {
        mvc.perform(delete("/v1/sourcing/zone_maps")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").doesNotExist());

    }

    @Test
    public void whenDeleteZoneMappingWithServerError_thenReturn500Error() throws Exception {
        ZoneMappingFilterDto zoneMappingFilterDto = ZoneMappingFilterDto.builder()
                .enterpriseCode(EnterpriseCodeEnum.SEPHORACA.name())
                .fromZipCode("12345")
                .toZipCode("12345")
                .nodePriority("0801|0701|0901")
                .build();

        willThrow(SourcingServiceException.class).given(zoneMapService).deleteZoneMaps(zoneMappingFilterDto);

        mvc.perform(delete( "/v1/sourcing/zone_maps?enterpriseCode={code}&fromZipCode={from}&toZipCode={to}&nodePriority={priority}",
                EnterpriseCodeEnum.SEPHORACA.name(), "12345", "12345", "0801|0701|0901")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_50000")))
                .andExpect(jsonPath("$..errorMessage", hasItem("Internal server error")));
    }

    @Test
    public void whenDeleteZoneMappingWithWrongEnterpriseCode_thenReturn400Error() throws Exception {
        String enterpriseCode = RandomString.make(5);

        mvc.perform(delete("/v1/sourcing/zone_maps?enterpriseCode={code}",
                enterpriseCode)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40010")))
                .andExpect(jsonPath("$..errorMessage",
                        hasItem("The enterpriseCode value provided is not an identified one. List of possible channel values: 'SEPHORAUS', 'SEPHORACA'")));
    }

    @Test
    public void whenDeleteZoneMappingForTooLongFromZipCode_thenReturn400Error() throws Exception {
        String fromZipCode = RandomString.make(6);
        String inputJson = "{ " +
                "  \"fromZipCode\": \"" + fromZipCode + "\"" +
                "}";

        mvc.perform(delete("/v1/sourcing/zone_maps?fromZipCode={from}",
                fromZipCode)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40011")))
                .andExpect(jsonPath("$..errorMessage",
                        hasItem("The field 'fromZipCode' length must be less than or equal to 5 symbols")));
    }

    @Test
    public void whenDeleteZoneMappingForTooLongToZipCode_thenReturn400Error() throws Exception {
        String toZipCode = RandomString.make(6);

        mvc.perform(delete("/v1/sourcing/zone_maps?toZipCode={to}",
                 toZipCode)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40012")))
                .andExpect(jsonPath("$..errorMessage",
                        hasItem("The field 'toZipCode' length must be less than or equal to 5 symbols")));
    }

    @Test
    public void whenDeleteZoneMappingForTooLongNodePriority_thenReturn400Error() throws Exception {
        String nodePriority = RandomString.make(41);

        mvc.perform(delete("/v1/sourcing/zone_maps?nodePriority={priority}",
               nodePriority)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$..errorCode", hasItem("ERR_S_40013")))
                .andExpect(jsonPath("$..errorMessage",
                        hasItem("The field 'nodePriority' length must be less than or equal to 40 symbols")));
    }
}