package com.sephora.services.sourcingoptions.controller.impl;

import com.sephora.platform.common.utils.ApplicationUtils;
/*import com.sephora.services.commons.config.discovery.LocalServiceInstanceConfig;*/
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.sourcingoptions.config.MessageConfig;
import com.sephora.services.sourcingoptions.controller.SourcingController;
import com.sephora.services.sourcingoptions.controller.SourcingResponseEntityExceptionHandler;
import com.sephora.services.sourcingoptions.exception.SourcingItemsServiceException;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsResponseDto;
import com.sephora.services.sourcingoptions.service.ShipNodeDelayService;
import com.sephora.services.sourcingoptions.service.SourcingOptionsService;
import com.sephora.services.sourcingoptions.service.ZoneMapCsvUploadService;
import com.sephora.services.sourcingoptions.service.ZoneMapService;
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

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
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
    @MockBean(ZoneMapService.class), @MockBean(ZoneMapCsvUploadService.class), @MockBean(ShipNodeDelayService.class)
})
public class SourcingControllerGetSourceItemsTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    @Qualifier("sourcingOptionsServiceImpl")
    private SourcingOptionsService sourcingOptionsService;

    @Test
    public void whenGetSourceItems_thenOk() throws Exception {
        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"sourceSystem\": \"eStore\"," +
                "  \"enterpriseCode\": \"SEPHORAUS\"," +
                "  \"sellerCode\": \"SEPHORADOTCOM\"," +
                "  \"fulfillmentType\": \"SHIPTOHOME\"," +
                "  \"cartId\": \"11111\"," +
                "  \"shippingAddress\": {" +
                "       \"state\": \"CA\"," +
                "       \"zipCode\": \"90100\"," +
                "       \"country\": \"US\"" +
                "   }," +
                "   \"items\": [" +
                "       {" +
                "         \"itemId\": \"123\"," +
                "         \"requiredQuantity\": \"5\"," +
                "		  \"uom\":\"EACH\""+
                "        }" +
                "     ]" +
                "  }";

        when(sourcingOptionsService.getSourcingOptions(any())).thenReturn(new SourcingOptionsResponseDto());

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void whenGetSourceItemsMissedSourceSystem_thenReturn400() throws Exception {
        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"enterpriseCode\": \"SEPHORAUS\"," +
                "  \"sellerCode\": \"SEPHORADOTCOM\"," +
                "  \"fulfillmentType\": \"SHIPTOHOME\"," +
                "  \"cartId\": \"11111\"," +
                "  \"shippingAddress\": {" +
                "       \"state\": \"CA\"," +
                "       \"zipCode\": \"90100\"," +
                "       \"country\": \"US\"" +
                "   }," +
                "   \"items\": [" +
                "       {" +
                "         \"itemId\": \"123\"," +
                "         \"requiredQuantity\": \"5\"," +
                "		  \"uom\":\"EACH\","+
                " 		  \"lineId\": \"1\""+
                "        }" +
                "     ]" +
                "  }";

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].errorCode", is("sourcing-service.sourceItems.validationerror")))
                .andExpect(jsonPath("$.errors[0].errorMessage", is("The field 'sourceSystem' cannot be null or blank")));

    }

    @Test
    public void whenGetSourceItemsInvalidEnterpriseCode_thenReturn400() throws Exception {
        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"sourceSystem\": \"eStore\"," +
                "  \"enterpriseCode\": \"TEST\"," +
                "  \"sellerCode\": \"SEPHORADOTCOM\"," +
                "  \"fulfillmentType\": \"SHIPTOHOME\"," +
                "  \"cartId\": \"11111\"," +
                "  \"shippingAddress\": {" +
                "       \"state\": \"CA\"," +
                "       \"zipCode\": \"90100\"," +
                "       \"country\": \"US\"" +
                "   }," +
                "   \"items\": [" +
                "       {" +
                "         \"itemId\": \"123\"," +
                "         \"requiredQuantity\": \"5\"," +
                "		  \"uom\":\"EACH\","+
                " 		  \"lineId\": \"1\""+
                "        }" +
                "     ]" +
                "  }";

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].errorCode", is("sourcing-service.sourceItems.validationerror")))
                .andExpect(jsonPath("$.errors[0].errorMessage",
                        is("The enterpriseCode value provided is not an identified one. List of possible values: 'SEPHORAUS', 'SEPHORACA'")));

    }

    @Test
    public void whenGetSourceItemsRandomSellerCode_thenReturn200() throws Exception {
        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"sourceSystem\": \"eStore\"," +
                "  \"enterpriseCode\": \"SEPHORAUS\"," +
                "  \"sellerCode\": \"TEST\"," +
                "  \"fulfillmentType\": \"SHIPTOHOME\"," +
                "  \"cartId\": \"11111\"," +
                "  \"shippingAddress\": {" +
                "       \"state\": \"CA\"," +
                "       \"zipCode\": \"90100\"," +
                "       \"country\": \"US\"" +
                "   }," +
                "   \"items\": [" +
                "       {" +
                "         \"itemId\": \"123\"," +
                "         \"requiredQuantity\": \"5\"," +
                "		  \"uom\":\"EACH\","+
                " 		  \"lineId\": \"1\""+
                "        }" +
                "     ]" +
                "  }";

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful());

    }

    @Test
    public void whenGetSourceItemsInvalidFulfillmentType_thenReturn400() throws Exception {
        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"sourceSystem\": \"eStore\"," +
                "  \"enterpriseCode\": \"SEPHORAUS\"," +
                "  \"sellerCode\": \"SEPHORADOTCOM\"," +
                "  \"fulfillmentType\": \"TEST\"," +
                "  \"cartId\": \"11111\"," +
                "  \"shippingAddress\": {" +
                "       \"state\": \"CA\"," +
                "       \"zipCode\": \"90100\"," +
                "       \"country\": \"US\"" +
                "   }," +
                "   \"items\": [" +
                "       {" +
                "         \"itemId\": \"123\"," +
                "         \"requiredQuantity\": \"5\"," +
                "		  \"uom\":\"EACH\","+
                " 		  \"lineId\": \"1\""+
                "        }" +
                "     ]" +
                "  }";

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].errorCode", is("sourcing-service.sourceItems.validationerror")))
                .andExpect(jsonPath("$.errors[0].errorMessage",
                        is("The fulfillmentType value provided is not an identified one. List of possible values: 'SHIPTOHOME', 'ELECTRONIC'")));

    }

    @Test
    public void whenGetSourceItemsMissedShippingAddress_thenReturn400() throws Exception {
        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"sourceSystem\": \"eStore\"," +
                "  \"enterpriseCode\": \"SEPHORAUS\"," +
                "  \"sellerCode\": \"SEPHORADOTCOM\"," +
                "  \"fulfillmentType\": \"SHIPTOHOME\"," +
                "  \"cartId\": \"11111\"," +
                "   \"items\": [" +
                "       {" +
                "         \"itemId\": \"123\"," +
                "         \"requiredQuantity\": \"5\"," +
                "		  \"uom\":\"EACH\","+
                " 		  \"lineId\": \"1\""+
                "        }" +
                "     ]" +
                "  }";

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].errorCode", is("sourcing-service.sourceItems.validationerror")))
                .andExpect(jsonPath("$.errors[0].errorMessage", is("The field 'shippingAddress' cannot be null")));

    }


    @Test
    public void whenGetSourceItemsMissedItems_thenReturn400() throws Exception {
        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"sourceSystem\": \"eStore\"," +
                "  \"enterpriseCode\": \"SEPHORAUS\"," +
                "  \"sellerCode\": \"SEPHORADOTCOM\"," +
                "  \"fulfillmentType\": \"SHIPTOHOME\"," +
                "  \"shippingAddress\": {" +
                "       \"state\": \"CA\"," +
                "       \"zipCode\": \"90100\"," +
                "       \"country\": \"US\"" +
                "   }" +
                " }";

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].errorCode", is("sourcing-service.sourceItems.validationerror")))
                .andExpect(jsonPath("$.errors[0].errorMessage", is("The field 'items' cannot be null or blank")));

    }

    @Test
    public void whenGetSourceItemsMissedItemId_thenReturn400() throws Exception {
        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"sourceSystem\": \"eStore\"," +
                "  \"enterpriseCode\": \"SEPHORAUS\"," +
                "  \"sellerCode\": \"SEPHORADOTCOM\"," +
                "  \"fulfillmentType\": \"SHIPTOHOME\"," +
                "  \"shippingAddress\": {" +
                "       \"state\": \"CA\"," +
                "       \"zipCode\": \"90100\"," +
                "       \"country\": \"US\"" +
                "   }," +
                "   \"items\": [" +
                "       {" +
                "         \"requiredQuantity\": \"5\"," +
                "		  \"uom\":\"EACH\","+
                " 		  \"lineId\": \"1\""+
                "        }" +
                "     ]" +
                "  }";

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].errorCode", is("sourcing-service.sourceItems.validationerror")))
                .andExpect(jsonPath("$.errors[0].errorMessage", is("The field 'items[0].itemId' cannot be null or blank")));

    }

    @Test
    public void whenGetSourceItemsMissedRequiredQuantity_thenReturn400() throws Exception {
        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"sourceSystem\": \"eStore\"," +
                "  \"enterpriseCode\": \"SEPHORAUS\"," +
                "  \"sellerCode\": \"SEPHORADOTCOM\"," +
                "  \"fulfillmentType\": \"SHIPTOHOME\"," +
                "  \"shippingAddress\": {" +
                "       \"state\": \"CA\"," +
                "       \"zipCode\": \"90100\"," +
                "       \"country\": \"US\"" +
                "   }," +
                "   \"items\": [" +
                "       {" +
                "         \"itemId\": \"123\"," +
                "		  \"uom\":\"EACH\","+
                " 		  \"lineId\": \"1\""+
                "        }" +
                "     ]" +
                "  }";

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].errorCode", is("sourcing-service.sourceItems.validationerror")))
                .andExpect(jsonPath("$.errors[0].errorMessage",
                        is("The field 'items[0].requiredQuantity' cannot be null")));

    }

    @Test
    public void whenGetSourceItemsNonPositiveQuantity_thenReturn400() throws Exception {
        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"sourceSystem\": \"eStore\"," +
                "  \"enterpriseCode\": \"SEPHORAUS\"," +
                "  \"sellerCode\": \"SEPHORADOTCOM\"," +
                "  \"fulfillmentType\": \"SHIPTOHOME\"," +
                "  \"shippingAddress\": {" +
                "       \"state\": \"CA\"," +
                "       \"zipCode\": \"90100\"," +
                "       \"country\": \"US\"" +
                "   }," +
                "   \"items\": [" +
                "       {" +
                "         \"itemId\": \"123\"," +
                "         \"requiredQuantity\": \"-1\"," +
                "		  \"uom\":\"EACH\","+
                " 		  \"lineId\": \"1\""+
                "        }" +
                "     ]" +
                "  }";

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].errorCode", is("sourcing-service.sourceItems.validationerror")))
                .andExpect(jsonPath("$.errors[0].errorMessage",
                        is("The field 'items[0].requiredQuantity' value must be greater than 0")));

    }

    @Test
    public void whenErrorDuringGetSourceItems_thenReturn503() throws Exception {

        String inputJson = "{" +
        		"  \"cartId\": \"20210429217\","+
                "  \"sourceSystem\": \"eStore\"," +
                "  \"enterpriseCode\": \"SEPHORAUS\"," +
                "  \"sellerCode\": \"SEPHORADOTCOM\"," +
                "  \"fulfillmentType\": \"SHIPTOHOME\"," +
                "  \"shippingAddress\": {" +
                "       \"state\": \"CA\"," +
                "       \"zipCode\": \"90100\"," +
                "       \"country\": \"US\"" +
                "   }," +
                "   \"items\": [" +
                "       {" +
                "         \"itemId\": \"123\"," +
                "         \"requiredQuantity\": \"5\"," +
                "		  \"uom\":\"EACH\","+
                " 		  \"lineId\": \"1\""+
                "        }" +
                "     ]" +
                "  }";


        when(sourcingOptionsService.getSourcingOptions(any())).thenThrow(SourcingItemsServiceException.class);

        mvc.perform(MockMvcRequestBuilders.post("/v1/sourcing/sourceItems")
                .content(inputJson)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.errors[0].errorCode", is("ERR_S_50300")))
                .andExpect(jsonPath("$.errors[0].errorMessage",
                        startsWith("Server error during retrieving best sourcing option in the request with correlationId:")));
    }

}
