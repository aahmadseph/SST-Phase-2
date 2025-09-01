package com.sephora.services.sourcingoptions.service;

import com.sephora.platform.common.utils.ApplicationUtils;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
//import com.sephora.services.commons.config.discovery.LocalServiceInstanceConfig;
import com.sephora.services.sourcingoptions.TestConfig;
import com.sephora.services.sourcingoptions.client.InventoryAvailabilityServiceClient;
import com.sephora.services.sourcingoptions.client.InventoryServiceClient;
import com.sephora.services.sourcingoptions.config.ConfigHubProperties;
import com.sephora.services.sourcingoptions.config.SourcingOptionsConfiguration;
import com.sephora.services.sourcingoptions.exception.SourcingItemsServiceException;
import com.sephora.services.sourcingoptions.mapper.SourcingAHPromiseDateMapper;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.model.cosmos.SourcingRule;
import com.sephora.services.sourcingoptions.model.dto.InventoryAvailabilityDto;
import com.sephora.services.sourcingoptions.model.dto.InventoryInfoDto;
import com.sephora.services.sourcingoptions.model.dto.InventoryItemDto;
import com.sephora.services.sourcingoptions.model.dto.ShippingAddressDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestItemDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsResponseDto;
import com.sephora.services.sourcingoptions.repository.cosmos.ShipNodeRepository;
import com.sephora.services.sourcingoptions.repository.cosmos.SourcingRuleRepository;
import com.sephora.services.sourcingoptions.service.impl.SourcingOptionsServiceImpl;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;

import static com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum.SEPHORAUS;
import static com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum.ELECTRONIC;
import static com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum.SHIPTOHOME;
import static com.sephora.services.sourcingoptions.model.SellerCodeEnum.BORDERFREE;
import static com.sephora.services.sourcingoptions.model.SellerCodeEnum.SEPHORADOTCOM;
import static com.sephora.services.sourcingoptions.model.UnavailableReasonsConst.NOT_ENOUGH_PRODUCT_CHOICES;
import static com.sephora.services.sourcingoptions.model.UnavailableReasonsConst.NO_SOURCING_RULE_DEFINED;
import static com.sephora.services.sourcingoptions.model.UnavailableReasonsConst.SCHEDULING_CONSTRAINT_VIOLATION;
import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {
    SourcingOptionsServiceImpl.class,
    TestConfig.class,
    RequestLoggingFilterConfig.class,
    ApplicationUtils.class
})
public class SourcingOptionsServiceTest {

    @Autowired
    @Qualifier("sourcingOptionsServiceImpl")
    private SourcingOptionsService sourcingOptionsService;

    @MockBean
    private ZoneMapService zoneMapService;

    @MockBean
    private ShipNodeService shipNodeService;

    @MockBean
    private SourcingRulesService sourcingRulesService;

    @MockBean
    private SourcingRuleRepository sourcingRuleRepository;

    @MockBean
    private ZipCodeRampupService zipCodeRampupService;

    @MockBean
    private InventoryServiceClient inventoryServiceClient;

    @MockBean
    private InventoryAvailabilityServiceClient inventoryAvailabilityServiceClient;

    @MockBean
    private SourcingOptionsConfiguration sourcingOptionsConfiguration;

    @MockBean
    private AHPromiseDatesService ahPromiseDatesService;

    @MockBean
    private SourcingAHPromiseDateMapper sourcingAHPromiseDateMapper;
    
    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @MockBean
    private ShipNodeRepository shipNodeRepository;

    @MockBean
    private AvailabilitySvcService availabilitySvcService;
    
    @MockBean
    private MockSourcingOptionService mockSourcingOptionService;

    @MockBean
    private ConfigHubProperties configHubProperties;

    @Before
    public void before() {
        when(sourcingRulesService.getSourcingRules(argThat(dto -> {
            return dto != null
                && SEPHORAUS.name().equals(dto.getEnterpriseCode())
                && BORDERFREE.name().equals(dto.getSellerCode())
                && SHIPTOHOME.name().equals(dto.getFulfillmentType());
        }), isNull())).thenReturn(SourcingRule.builder()
            .enterpriseCode(SEPHORAUS.name())
            .sellerCode(BORDERFREE.name())
            .fulfilmentType(SHIPTOHOME.name())
            .shipFromSingleNode(true)
            .shipComplete(true)
            .defaultShipNode("0701")
            .regionBased(false)
            .build());

        when(sourcingRulesService.getSourcingRules(argThat(dto -> {
            return dto != null
                && SEPHORAUS.name().equals(dto.getEnterpriseCode())
                && SEPHORADOTCOM.name().equals(dto.getSellerCode())
                && SHIPTOHOME.name().equals(dto.getFulfillmentType());
        }), isNull())).thenReturn(SourcingRule.builder()
             .enterpriseCode(SEPHORAUS.name())
             .sellerCode(SEPHORADOTCOM.name())
             .fulfilmentType(SHIPTOHOME.name())
             .shipFromSingleNode(false)
             .shipComplete(true)
             .regionBased(true)
             .build());

        when(shipNodeService.findAllActiveNodes()).thenReturn(asList("0701","0801","1001","1021","US_NONSHIP"));

        when(zoneMapService.getPriorityByEnterpriseCodeAndZipCode(SEPHORAUS.name(), "94100"))
            .thenReturn(asList("0701", "0801", "1001", "1021"));
    }

    @Test
    public void testSourcingOptionsIncorrectZipCode_returnNoSourcingRuleDefined() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 1));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("INCORRECT_ZIP_CODE").build())
                .items(items)
                .build();

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getUnavailableReason()).isEqualTo(NO_SOURCING_RULE_DEFINED);
        assertThat(response.getItems().get(0).getMaxShipNodeQuantity()).isEqualTo(0);
        assertThat(response.getItems().get(0).getTotalAvailableQuantity()).isEqualTo(0);
    }

    @Test
    public void testSourcingOptionsSingleSkuNoInventory_returnNotEnoughProductChoices() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 1));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getUnavailableReason()).isEqualTo(NOT_ENOUGH_PRODUCT_CHOICES);
        assertThat(response.getItems().get(0).getMaxShipNodeQuantity()).isEqualTo(0);
        assertThat(response.getItems().get(0).getTotalAvailableQuantity()).isEqualTo(0);
    }

    @Test
    public void testSourcingOptionsSingleInfiniteSku_returnAvailableResponse() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 1));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1"));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("0701");
    }

    @Test
    public void testSourcingOptionsSingleSkuNotEnoughInventory_returnNotEnoughChoices() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 3));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        List<InventoryInfoDto> inventoryInfoList = new ArrayList<>();
        inventoryInfoList.add(buildInventoryInfoDto("0701", 1L));
        inventoryInfoList.add(buildInventoryInfoDto("0801", 2L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoList));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getUnavailableReason()).isEqualTo(NOT_ENOUGH_PRODUCT_CHOICES);
        assertThat(response.getItems().get(0).getMaxShipNodeQuantity()).isEqualTo(2);
        assertThat(response.getItems().get(0).getTotalAvailableQuantity()).isEqualTo(3);
    }

    @Test
    public void testSourcingOptionsAllSkusSameShipNode_returnSingleShipNode() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 3));
        items.add(buildRequestItemDto("sku2", 3));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        // Inventory for sku1
        List<InventoryInfoDto> inventoryInfoListSku1 = new ArrayList<>();
        inventoryInfoListSku1.add(buildInventoryInfoDto("0701", 100L));
        inventoryInfoListSku1.add(buildInventoryInfoDto("0801", 100L));

        // Inventory for sku2
        List<InventoryInfoDto> inventoryInfoListSku2 = new ArrayList<>();
        inventoryInfoListSku2.add(buildInventoryInfoDto("0801", 100L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoListSku1));
        responseItems.add(buildInventoryItemDto("sku2", inventoryInfoListSku2));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("0801");
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("sku2");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(1).getShipNode()).isEqualTo("0801");
    }

    @Test
    public void testSourcingOptionsInfiniteAndNormalSku_returnShipNodeWithHighestPriority() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 3));
        items.add(buildRequestItemDto("sku2", 3));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        // Inventory for sku1
        List<InventoryInfoDto> inventoryInfoListSku1 = new ArrayList<>();
        inventoryInfoListSku1.add(buildInventoryInfoDto("1021", 100L));
        inventoryInfoListSku1.add(buildInventoryInfoDto("1001", 100L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoListSku1));
        responseItems.add(buildInventoryItemDto("sku2"));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("1001");
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("sku2");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(1).getShipNode()).isEqualTo("1001");
    }

    @Test
    public void testSourcingOptionsTwoInfiniteSkus_returnShipNodeWithHighestPriority() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 3));
        items.add(buildRequestItemDto("sku2", 3));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1"));
        responseItems.add(buildInventoryItemDto("sku2"));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("0701");
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("sku2");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(1).getShipNode()).isEqualTo("0701");
    }

    @Test
    public void testSourcingOptionsDifferentShipNodesConditionsMet_returnShipNodes() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 3));
        items.add(buildRequestItemDto("sku2", 3));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto()
                        .withZipCode("94100")
                        .withState("AA") // 'XPO' destination type
                        .build())
                .items(items)
                .build();

        // Inventory for sku1
        List<InventoryInfoDto> inventoryInfoListSku1 = new ArrayList<>();
        inventoryInfoListSku1.add(buildInventoryInfoDto("1021", 100L));

        // Inventory for sku2
        List<InventoryInfoDto> inventoryInfoListSku2 = new ArrayList<>();
        inventoryInfoListSku2.add(buildInventoryInfoDto("0701", 100L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoListSku1));
        responseItems.add(buildInventoryItemDto("sku2", inventoryInfoListSku2));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("1021");
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("sku2");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(1).getShipNode()).isEqualTo("0701");
    }

    @Test
    public void testSourcingOptionsDifferentShipNodes_returnSplittedShipmentResponse() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("2019071101", 1));
        items.add(buildRequestItemDto("2019071102", 1));
        items.add(buildRequestItemDto("2019071103", 1));
        items.add(buildRequestItemDto("2019071104", 1));
        items.add(buildRequestItemDto("2019071105", 1));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        // Inventory for sku1
        List<InventoryInfoDto> inventoryInfoListSku1 = new ArrayList<>();
        inventoryInfoListSku1.add(buildInventoryInfoDto("0701", 0L));
        inventoryInfoListSku1.add(buildInventoryInfoDto("0801", 0L));
        inventoryInfoListSku1.add(buildInventoryInfoDto("1001", 10L));

        // Inventory for sku2
        List<InventoryInfoDto> inventoryInfoListSku2 = new ArrayList<>();
        inventoryInfoListSku2.add(buildInventoryInfoDto("0701", 0L));
        inventoryInfoListSku2.add(buildInventoryInfoDto("0801", 5L));
        inventoryInfoListSku2.add(buildInventoryInfoDto("1001", 5L));

        // Inventory for sku3
        List<InventoryInfoDto> inventoryInfoListSku3 = new ArrayList<>();
        inventoryInfoListSku3.add(buildInventoryInfoDto("0701", 6L));
        inventoryInfoListSku3.add(buildInventoryInfoDto("0801", 8L));
        inventoryInfoListSku3.add(buildInventoryInfoDto("1001", 0L));

        // Inventory for sku4
        List<InventoryInfoDto> inventoryInfoListSku4 = new ArrayList<>();
        inventoryInfoListSku4.add(buildInventoryInfoDto("0701", 8L));
        inventoryInfoListSku4.add(buildInventoryInfoDto("0801", 3L));
        inventoryInfoListSku4.add(buildInventoryInfoDto("1001", 0L));

        // Inventory for sku5
        List<InventoryInfoDto> inventoryInfoListSku5 = new ArrayList<>();
        inventoryInfoListSku5.add(buildInventoryInfoDto("0701", 4L));
        inventoryInfoListSku5.add(buildInventoryInfoDto("0801", 13L));
        inventoryInfoListSku5.add(buildInventoryInfoDto("1001", 0L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("2019071101", inventoryInfoListSku1));
        responseItems.add(buildInventoryItemDto("2019071102", inventoryInfoListSku2));
        responseItems.add(buildInventoryItemDto("2019071103", inventoryInfoListSku3));
        responseItems.add(buildInventoryItemDto("2019071104", inventoryInfoListSku4));
        responseItems.add(buildInventoryItemDto("2019071105", inventoryInfoListSku5));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when - all SKUs available, but constraints not met
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("2019071101");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("1001");
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("2019071102");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(1).getShipNode()).isEqualTo("1001");
        assertThat(response.getItems().get(2).getItemId()).isEqualTo("2019071103");
        assertThat(response.getItems().get(2).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(2).getShipNode()).isEqualTo("0701");
        assertThat(response.getItems().get(3).getItemId()).isEqualTo("2019071104");
        assertThat(response.getItems().get(3).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(3).getShipNode()).isEqualTo("0701");
        assertThat(response.getItems().get(4).getItemId()).isEqualTo("2019071105");
        assertThat(response.getItems().get(4).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(4).getShipNode()).isEqualTo("0701");
    }

    @Test
    public void testSourcingOptionsDifferentShipNodesConditionsNotMet_returnUnavailableResponse() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 4));
        items.add(buildRequestItemDto("sku2", 6));
        items.add(buildRequestItemDto("sku3", 4));

        when(sourcingRulesService.getSourcingRules(any(), isNull())).thenReturn(SourcingRule.builder()
            .enterpriseCode(SEPHORAUS.name())
            .sellerCode(SEPHORADOTCOM.name())
            .fulfilmentType(SHIPTOHOME.name())
            .shipFromSingleNode(true)
            .shipComplete(true)
            .regionBased(true)
            .build());

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        // Inventory for sku1
        List<InventoryInfoDto> inventoryInfoListSku1 = new ArrayList<>();
        inventoryInfoListSku1.add(buildInventoryInfoDto("0701", 7L));
        inventoryInfoListSku1.add(buildInventoryInfoDto("0801", 3L));
        inventoryInfoListSku1.add(buildInventoryInfoDto("1001", 5L));

        // Inventory for sku2
        List<InventoryInfoDto> inventoryInfoListSku2 = new ArrayList<>();
        inventoryInfoListSku2.add(buildInventoryInfoDto("0701", 5L));
        inventoryInfoListSku2.add(buildInventoryInfoDto("0801", 6L));
        inventoryInfoListSku2.add(buildInventoryInfoDto("1001", 4L));

        // Inventory for sku3
        List<InventoryInfoDto> inventoryInfoListSku3 = new ArrayList<>();
        inventoryInfoListSku3.add(buildInventoryInfoDto("0701", 4L));
        inventoryInfoListSku3.add(buildInventoryInfoDto("0801", 7L));
        inventoryInfoListSku3.add(buildInventoryInfoDto("1001", 9L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoListSku1));
        responseItems.add(buildInventoryItemDto("sku2", inventoryInfoListSku2));
        responseItems.add(buildInventoryItemDto("sku3", inventoryInfoListSku3));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when - all SKUs available, but constraints not met
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        //assertThat(response.getItems().get(0).getUnavailableReason()).isEqualTo(SCHEDULING_CONSTRAINT_VIOLATION);
        //assertThat(response.getItems().get(0).getMaxShipNodeQuantity()).isEqualTo(7);
        //assertThat(response.getItems().get(0).getTotalAvailableQuantity()).isEqualTo(15);
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("sku2");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        //assertThat(response.getItems().get(1).getUnavailableReason()).isEqualTo(SCHEDULING_CONSTRAINT_VIOLATION);
        //assertThat(response.getItems().get(1).getMaxShipNodeQuantity()).isEqualTo(6);
        //assertThat(response.getItems().get(1).getTotalAvailableQuantity()).isEqualTo(15);
        assertThat(response.getItems().get(2).getItemId()).isEqualTo("sku3");
        assertThat(response.getItems().get(2).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        //assertThat(response.getItems().get(2).getUnavailableReason()).isEqualTo(SCHEDULING_CONSTRAINT_VIOLATION);
        //assertThat(response.getItems().get(2).getMaxShipNodeQuantity()).isEqualTo(9);
        //assertThat(response.getItems().get(2).getTotalAvailableQuantity()).isEqualTo(20);
    }

    @Test
    public void testSourcingOptionsDifferentShipNodesNotEnoughInventory_returnUnavailableResponse() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 3));
        items.add(buildRequestItemDto("sku2", 100));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        // Inventory for sku1
        List<InventoryInfoDto> inventoryInfoListSku1 = new ArrayList<>();
        inventoryInfoListSku1.add(buildInventoryInfoDto("1021", 100L));
        inventoryInfoListSku1.add(buildInventoryInfoDto("0801", 200L));

        // Inventory for sku2 - not enough inventory
        List<InventoryInfoDto> inventoryInfoListSku2 = new ArrayList<>();
        inventoryInfoListSku2.add(buildInventoryInfoDto("0701", 1L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoListSku1));
        responseItems.add(buildInventoryItemDto("sku2", inventoryInfoListSku2));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        /*assertThat(response.getItems().get(0).getUnavailableReason()).isEqualTo(SCHEDULING_CONSTRAINT_VIOLATION);
        assertThat(response.getItems().get(0).getMaxShipNodeQuantity()).isEqualTo(200);
        assertThat(response.getItems().get(0).getTotalAvailableQuantity()).isEqualTo(300);*/
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("sku2");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(1).getUnavailableReason()).isEqualTo(NOT_ENOUGH_PRODUCT_CHOICES);
        assertThat(response.getItems().get(1).getMaxShipNodeQuantity()).isEqualTo(1);
        assertThat(response.getItems().get(1).getTotalAvailableQuantity()).isEqualTo(1);
    }

    @Test
    public void testSourcingOptionsInventoryForSkuNotAvailable_returnShipNodes() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 3));
        items.add(buildRequestItemDto("sku2", 3));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto()
                        .withZipCode("94100")
                        .withState("AA")
                        .build())
                .items(items)
                .build();

        // Inventory for sku1
        List<InventoryInfoDto> inventoryInfoListSku1 = new ArrayList<>();
        inventoryInfoListSku1.add(buildInventoryInfoDto("1021", 100L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoListSku1));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        //assertThat(response.getItems().get(0).getUnavailableReason()).isEqualTo(SCHEDULING_CONSTRAINT_VIOLATION);
        //assertThat(response.getItems().get(0).getMaxShipNodeQuantity()).isEqualTo(100);
        //assertThat(response.getItems().get(0).getTotalAvailableQuantity()).isEqualTo(100);
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("sku2");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(1).getUnavailableReason()).isEqualTo(NOT_ENOUGH_PRODUCT_CHOICES);
        assertThat(response.getItems().get(1).getMaxShipNodeQuantity()).isEqualTo(0);
        assertThat(response.getItems().get(1).getTotalAvailableQuantity()).isEqualTo(0);
    }

    @Test
    public void testSourcingOptionsBorderfreeInfiniteInventory_returnAvailableResponse() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 1));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(BORDERFREE.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1"));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then - BORDERFREE can be shipped from only PDC (0701) ship node
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("0701");
    }

    @Test
    public void testSourcingOptionsBorderfree_withNonUSAndNonCACountry_returnAvailableResponse() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 1));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(BORDERFREE.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto()
                        .withZipCode("94100")
                        .withCountry("JP")
                        .build())
                .items(items)
                .build();

        List<InventoryInfoDto> inventoryInfoList = new ArrayList<>();
        inventoryInfoList.add(buildInventoryInfoDto("0701", 1L));
        inventoryInfoList.add(buildInventoryInfoDto("0801", 2L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        inventoryAvailability.setEnterpriseCode(SEPHORAUS.name());
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoList));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then - BORDERFREE can be shipped from only PDC (0701) ship node
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("0701");
    }

    @Test
    public void testSourcingOptionsElectronicInfiniteInventory_returnAvailableResponse() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 1));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(ELECTRONIC.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1"));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        when(sourcingRulesService.getSourcingRules(any(), isNull())).thenReturn(SourcingRule.builder()
            .enterpriseCode(SEPHORAUS.name())
            .sellerCode(SEPHORADOTCOM.name())
            .fulfilmentType(ELECTRONIC.name())
            .shipFromSingleNode(true)
            .shipComplete(true)
            .defaultShipNode("US_NONSHIP")
            .regionBased(false)
            .build());

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then - ELECTRONIC should be shipped from US_NONSHIP
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("US_NONSHIP");
    }

    public void testSourcingOptionsNotEnoughAndInfiniteInventory_returnUnavailableResponse() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 100));
        items.add(buildRequestItemDto("sku2", 100));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        // Inventory for sku1
        List<InventoryInfoDto> inventoryInfoListSku1 = new ArrayList<>();
        inventoryInfoListSku1.add(buildInventoryInfoDto("1021", 1L));
        inventoryInfoListSku1.add(buildInventoryInfoDto("0801", 10L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoListSku1));
        responseItems.add(buildInventoryItemDto("sku2"));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getUnavailableReason()).isEqualTo(NOT_ENOUGH_PRODUCT_CHOICES);
        assertThat(response.getItems().get(0).getMaxShipNodeQuantity()).isEqualTo(10);
        assertThat(response.getItems().get(0).getTotalAvailableQuantity()).isEqualTo(11);
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("sku2");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(1).getUnavailableReason()).isEqualTo(SCHEDULING_CONSTRAINT_VIOLATION);
        assertThat(response.getItems().get(1).getMaxShipNodeQuantity()).isEqualTo(-1L);
        assertThat(response.getItems().get(1).getTotalAvailableQuantity()).isEqualTo(-1L);
    }

    @Test
    public void testSourcingOptionsLockedShipNodeWithZipCode_returnOnlyActiveShipNode() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 5));
        items.add(buildRequestItemDto("sku2", 5));

        // update status to LOCKED for "0701" ship node
        when(shipNodeService.findAllActiveNodes()).thenReturn(asList("0801","1001","1021"));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        // Inventory for sku1
        List<InventoryInfoDto> inventoryInfoListSku1 = new ArrayList<>();
        inventoryInfoListSku1.add(buildInventoryInfoDto("0701", 10L));
        inventoryInfoListSku1.add(buildInventoryInfoDto("0801", 10L));

        // Inventory for sku2
        List<InventoryInfoDto> inventoryInfoListSku2 = new ArrayList<>();
        inventoryInfoListSku2.add(buildInventoryInfoDto("0701", 10L));
        inventoryInfoListSku2.add(buildInventoryInfoDto("0801", 10L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoListSku1));
        responseItems.add(buildInventoryItemDto("sku2", inventoryInfoListSku2));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when - all skus available, but constraints not met
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("0801");
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("sku2");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(1).getShipNode()).isEqualTo("0801");
    }

    @Test
    public void testSourcingOptionsOnlyLockedShipNode_returnNoSourcingRule() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 5));

        // update status to LOCKED for all available ship nodes ("0701", "0801", "1001", "1021" )
        when(shipNodeService.findAllActiveNodes()).thenReturn(asList());

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().withZipCode("94100").build())
                .items(items)
                .build();

        // when
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getUnavailableReason()).isEqualTo(NO_SOURCING_RULE_DEFINED);
        assertThat(response.getItems().get(0).getMaxShipNodeQuantity()).isEqualTo(0);
        assertThat(response.getItems().get(0).getTotalAvailableQuantity()).isEqualTo(0);
    }

    @Test
    public void testSourcingOptionsLockedShipNodeNoZipCode_returnOnlyActiveShipNode() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 5));
        items.add(buildRequestItemDto("sku2", 5));

        // update status to LOCKED for "0701" ship node
        when(shipNodeService.findAllActiveNodesByEnterpriseCode(any())).thenReturn(asList("0801","1001","1021"));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(SEPHORADOTCOM.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().build())
                .items(items)
                .build();

        // Inventory for sku1
        List<InventoryInfoDto> inventoryInfoListSku1 = new ArrayList<>();
        inventoryInfoListSku1.add(buildInventoryInfoDto("0701", 10L));
        inventoryInfoListSku1.add(buildInventoryInfoDto("0801", 10L));

        // Inventory for sku2
        List<InventoryInfoDto> inventoryInfoListSku2 = new ArrayList<>();
        inventoryInfoListSku2.add(buildInventoryInfoDto("0701", 10L));
        inventoryInfoListSku2.add(buildInventoryInfoDto("0801", 10L));

        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoListSku1));
        responseItems.add(buildInventoryItemDto("sku2", inventoryInfoListSku2));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when - all skus available, but constraints not met
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(0).getShipNode()).isEqualTo("0801");
        assertThat(response.getItems().get(1).getItemId()).isEqualTo("sku2");
        assertThat(response.getItems().get(1).isRequestedQtyAvailable()).isEqualTo(Boolean.TRUE);
        assertThat(response.getItems().get(1).getShipNode()).isEqualTo("0801");
    }

    @Test
    public void testSourcingOptionsLockedDefaultShipNodeForBorderfree_returnNoSourcingRuleError() throws Exception {
        List<SourcingOptionsRequestItemDto> items = new ArrayList<>();
        items.add(buildRequestItemDto("sku1", 5));

        // update status to LOCKED for "0701" ship node
        when(shipNodeService.findAllActiveNodes()).thenReturn(asList("0801","1001","1021"));

        SourcingOptionsRequestDto sourcingOptionsRequest = SourcingOptionsRequestDto.builder()
                .sellerCode(BORDERFREE.name())
                .fulfillmentType(SHIPTOHOME.name())
                .enterpriseCode(SEPHORAUS.name())
                .shippingAddress(ShippingAddressDto.Builder.aShippingAddressDto().build())
                .items(items)
                .build();

        List<InventoryInfoDto> inventoryInfoListSku = new ArrayList<>();
        inventoryInfoListSku.add(buildInventoryInfoDto("0701", 10L));
        inventoryInfoListSku.add(buildInventoryInfoDto("0801", 10L));
        InventoryAvailabilityDto inventoryAvailability = new InventoryAvailabilityDto();
        List<InventoryItemDto> responseItems = new ArrayList<>();
        responseItems.add(buildInventoryItemDto("sku1", inventoryInfoListSku));
        inventoryAvailability.setItems(responseItems);

        when(inventoryServiceClient.getItemsInventoryAvailability(any(), any())).thenReturn(inventoryAvailability);

        // when - all skus available, but constraints not met
        SourcingOptionsResponseDto response = sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest);

        // then
        assertThat(response.isAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getItemId()).isEqualTo("sku1");
        assertThat(response.getItems().get(0).isRequestedQtyAvailable()).isEqualTo(Boolean.FALSE);
        assertThat(response.getItems().get(0).getUnavailableReason()).isEqualTo(NO_SOURCING_RULE_DEFINED);
        assertThat(response.getItems().get(0).getMaxShipNodeQuantity()).isEqualTo(0);
        assertThat(response.getItems().get(0).getTotalAvailableQuantity()).isEqualTo(0);
    }

    private SourcingOptionsRequestItemDto buildRequestItemDto(String skuId, int requiredQuantity) {
        return SourcingOptionsRequestItemDto.builder().itemId(skuId)
                .requiredQuantity(requiredQuantity)
                .build();
    }

    private InventoryInfoDto buildInventoryInfoDto(String shipNode, long quantity) {
        InventoryInfoDto inventoryInfo = new InventoryInfoDto();
        inventoryInfo.setShipNode(shipNode);
        inventoryInfo.setQuantity(quantity);
        return inventoryInfo;
    }

    private InventoryItemDto buildInventoryItemDto(String skuId, List<InventoryInfoDto> inventoryInfoListSku) {
        InventoryItemDto inventoryItemDto = new InventoryItemDto();
        inventoryItemDto.setItemId(skuId);
        inventoryItemDto.setInventoryInfo(inventoryInfoListSku);
        return inventoryItemDto;
    }

    private InventoryItemDto buildInventoryItemDto(String skuId) {
        InventoryItemDto inventoryItemDto = new InventoryItemDto();
        inventoryItemDto.setItemId(skuId);
        inventoryItemDto.setInfiniteInventory(Boolean.TRUE);
        return inventoryItemDto;
    }
}
