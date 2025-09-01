///*
// *  This software is the confidential and proprietary information of
// * sephora.com and may not be used, reproduced, modified, distributed,
// * publicly displayed or otherwise disclosed without the express written
// *  consent of sephora.com.
// *
// * This software is a work of authorship by sephora.com and protected by
// * the copyright laws of the United States and foreign jurisdictions.
// *
// *  Copyright  2020 sephora.com, Inc. All rights reserved.
// *
// */
//
//package com.sephora.services.inventory.controller.impl;
//
//import static com.sephora.services.inventory.config.async.YantriksAsyncConfig.THREAD_POOL;
//import static org.hamcrest.Matchers.hasItems;
//import static org.hamcrest.Matchers.is;
//import static org.springframework.http.MediaType.APPLICATION_JSON;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//import org.junit.Ignore;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.cloud.autoconfigure.RefreshAutoConfiguration;
//import org.springframework.core.task.AsyncTaskExecutor;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.TestPropertySource;
//import org.springframework.test.context.junit4.SpringRunner;
//import org.springframework.test.web.servlet.MockMvc;
//
//import com.sephora.platform.logging.RequestLoggingFilterConfig;
//import com.sephora.services.inventory.InventoryAvailabilityApplication;
//import com.sephora.services.inventory.config.async.YantriksAsyncConfig;
//import com.sephora.services.inventory.config.feign.YantriksServiceClientConfiguration;
//import com.sephora.services.inventory.controller.impl.InventoryYantriksControllerImpl;
//import com.sephora.services.inventory.service.YantriksInventoryService;
//
///**
// * @author Vitaliy Oleksiyenko
// */
//@RunWith(SpringRunner.class)
//@WebMvcTest(InventoryYantriksControllerImpl.class)
//@ImportAutoConfiguration(RefreshAutoConfiguration.class)
//@ContextConfiguration(classes = {
//		InventoryAvailabilityApplication.class,
//        InventoryYantriksControllerImpl.class,
//        RequestLoggingFilterConfig.class,
//        YantriksInventoryService.class,
//        YantriksServiceClientConfiguration.class,
//        YantriksAsyncConfig.class
//})
//@TestPropertySource(properties = {
//        "yantriks.enabled=true"
//})
//public class InventoryYantriksControllerImplTest {
//
//    private static final String AVAILABILITY_URL = "/v2/availability";
//    private static final String RESERVATION_URL = "/v2/reserve/create";
//
//    @Autowired
//    private MockMvc mvc;
//
//    @Autowired
//    private YantriksServiceClientConfiguration configuration;
//
//    @Autowired
//    @Qualifier(THREAD_POOL)
//    private AsyncTaskExecutor executor;
//
//    @Ignore
//    @Test
//    public void whenGetAvailabilityOneItem_thenOk() throws Exception {
//
//        String contentJson = "{\n" +
//                "   \"inventoryItemsRequest\": [\n" +
//                "      {\n" +
//                "         \"item\": {\n" +
//                "            \"itemID\": \"1771245\",\n" +
//                "            \"uom\": \"EACH\"\n" +
//                "         },\n" +
//                "         \"storeInfoRequired\": false,\n" +
//                "         \"distributionGroupName\": \"NETWORK\",\n" +
//                "         \"locationList\": [\"2791\",\"2792\",\"2793\",\"2794\",\"2795\",\"2796\",\"2797\",\"2798\"\n" +
//                "         ]\n" +
//                "      }\n" +
//                "   ],\n" +
//                "   \"orgCode\": \"SEPHORA\"\n" +
//                "}";
//
//        mvc.perform(post(AVAILABILITY_URL)
//                .content(contentJson)
//                .contentType(APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.response.itemAvailabilityDetails[0].itemID", is("1771245")))
//                .andExpect(jsonPath("$.response.itemAvailabilityDetails[0].uom", is("EACH")));
//    }
//
//    @Ignore
//    @Test
//    public void whenGetAvailabilityTwoItem_thenOk() throws Exception {
//
//        String contentJson = "{\n" +
//                "   \"inventoryItemsRequest\": [\n" +
//                "      {\n" +
//                "         \"item\": {\n" +
//                "            \"itemID\": \"1771245\",\n" +
//                "            \"uom\": \"EACH\"\n" +
//                "         },\n" +
//                "         \"storeInfoRequired\": false,\n" +
//                "         \"distributionGroupName\": \"NETWORK\",\n" +
//                "         \"locationList\": [\"2791\",\"2792\",\"2793\",\"2794\",\"2795\",\"2796\",\"2797\",\"2798\"\n" +
//                "         ]\n" +
//                "      },\n" +
//                "\t  {\n" +
//                "         \"item\": {\n" +
//                "            \"itemID\": \"1771246\",\n" +
//                "            \"uom\": \"EACH\"\n" +
//                "         },\n" +
//                "         \"storeInfoRequired\": false,\n" +
//                "         \"distributionGroupName\": \"NETWORK\",\n" +
//                "         \"locationList\": [\"2791\",\"2792\",\"2793\",\"2794\",\"2795\",\"2796\",\"2797\",\"2798\"\n" +
//                "         ]\n" +
//                "      }\n" +
//                "   ],\n" +
//                "   \"orgCode\": \"SEPHORA\"\n" +
//                "}";
//
//
//        mvc.perform(post(AVAILABILITY_URL)
//                .content(contentJson)
//                .contentType(APPLICATION_JSON))
//                .andExpect(status().isOk())
//                //.andExpect(jsonPath("$.response", ))
//                .andExpect(jsonPath("$..itemID", hasItems(is("1771245"), is("1771246"))))
//                .andExpect(jsonPath("$..uom", hasItems(is("EACH"))));
//    }
//}
