package com.sephora.services.sourcingoptions.controller.impl;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockBeans;
import org.springframework.cloud.autoconfigure.RefreshAutoConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.sephora.platform.common.utils.ApplicationUtils;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.sourcingoptions.SourcingoptionsTestConstants;
import com.sephora.services.sourcingoptions.TestUtils;
import com.sephora.services.sourcingoptions.config.MessageConfig;
import com.sephora.services.sourcingoptions.controller.SourcingController;
import com.sephora.services.sourcingoptions.controller.SourcingResponseEntityExceptionHandler;
import com.sephora.services.sourcingoptions.service.ShipNodeDelayService;
import com.sephora.services.sourcingoptions.service.SourcingOptionsService;
import com.sephora.services.sourcingoptions.service.ZoneMapCsvUploadService;
import com.sephora.services.sourcingoptions.service.ZoneMapService;

@RunWith(SpringRunner.class)
@WebMvcTest(SourcingController.class)
@ImportAutoConfiguration(RefreshAutoConfiguration.class)
@ContextConfiguration(classes = { SourcingControllerImpl.class, MessageConfig.class,
		SourcingResponseEntityExceptionHandler.class, RequestLoggingFilterConfig.class, ApplicationUtils.class })
@MockBeans({ @MockBean(ZoneMapService.class), @MockBean(ZoneMapCsvUploadService.class),
		@MockBean(SourcingOptionsService.class) })
public class SourcingControllerShipNodeDelayTest {
	
	@Autowired
	private MockMvc mvc;
	
	@MockBean
	private ShipNodeDelayService shipnodeDelayService;

	@MockBean
	@Qualifier("sourcingOptionsServiceImpl")
	private SourcingOptionsService sourcingOptionsService;

	@Test
	public void testPublishShipnodeDelay() throws Exception {
		String shipNodeDelayRequestJson = TestUtils.readJsonFromFile(SourcingoptionsTestConstants.SHIP_NODE_DELAY_INPUT,
				TestUtils.JSON_INPUT_TYPE.INPUT);
		mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/shipNodeDelay").content(shipNodeDelayRequestJson)
				.accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
	}
	
	@Test
	public void testUpdateShipnodeDelay() throws Exception {
		String shipNodeDelayRequestJson = TestUtils.readJsonFromFile(SourcingoptionsTestConstants.SHIP_NODE_DELAY_INPUT,
				TestUtils.JSON_INPUT_TYPE.INPUT);
		mvc.perform(MockMvcRequestBuilders.put("/v1/sourcing/shipNodeDelay").content(shipNodeDelayRequestJson)
				.accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
	}
	
	@Test
	public void testDeleteShipnodeDelay() throws Exception {
		
		mvc.perform(MockMvcRequestBuilders.delete("/v1/sourcing/shipNodeDelay/123/STANDARD/1001")
				.accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
	}
}
