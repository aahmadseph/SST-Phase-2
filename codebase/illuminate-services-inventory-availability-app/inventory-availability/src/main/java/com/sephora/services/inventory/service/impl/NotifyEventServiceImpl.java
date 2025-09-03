package com.sephora.services.inventory.service.impl;

import com.sephora.services.common.inventory.email.EmailService;
import com.sephora.services.inventory.service.ItemService;
import com.sephora.services.inventory.service.NotifyEventService;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.config.SephoraBulkInventorySupplyConfiguration;
import com.sephora.services.inventoryavailability.config.SephoraEmailConfiguration;
import com.sephora.services.inventoryavailability.model.cosmos.doc.bulksupply.BulkInventorySupplyDto;
import com.sephora.services.inventoryavailability.model.cosmos.doc.item.ItemDoc;
import com.sephora.services.inventoryavailability.model.supply.bulk.InventorySupplyBulkInfo;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
@Log4j2
@Service
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public class NotifyEventServiceImpl implements NotifyEventService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private SephoraEmailConfiguration sephoraEmailConfiguration;

    @Autowired
    private SephoraBulkInventorySupplyConfiguration bulkInventorySupplyConfiguration;

    @Autowired
    private ItemService itemService;

    @Override
    @Async
    public void notifyInventorySupplyEvent(Map<String, String> parameters, String templateName, String subject) {
        try{
            String itemId = parameters.get("itemId");
            String organizationCode = parameters.get("organizationCode");
            ItemDoc item = itemService.get(itemId, organizationCode);
            parameters.put("itemType", item.getPrimaryInformation().getItemType());
            emailService.sendEmail(AvailabilityConstants.INVENTORY_SUPPLY_NOTIFICATION_TEMPLATE_NAME, sephoraEmailConfiguration.getFromAddress(),
                    sephoraEmailConfiguration.getToAddress(), sephoraEmailConfiguration.getCcAddress(),
                    "ALERT > PROD > OMS UI Updates - InventorySupply", parameters);
        } catch(Exception e){
            log.error("notification for inventory supply failed for request: {} because of reason: {}", parameters, e.getMessage());
            log.error(e);
        }


    }

    private String getTableData(String data){
        String tableDataTemplate = "<td style=\"padding:0.75pt;\">\n" +
                "<p style=\"font-size:11pt;font-family:Calibri,sans-serif;margin:0;\">" + data + "</p>\n" +
                "</td>";
        return tableDataTemplate;
    }
    private String createTableRow(InventorySupplyBulkInfo inventorySupplyBulkInfo){
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("<tr>");
        stringBuilder.append(getTableData(inventorySupplyBulkInfo.getProductId()));
        stringBuilder.append(getTableData(inventorySupplyBulkInfo.getLocationId()));
        stringBuilder.append(getTableData(String.valueOf(inventorySupplyBulkInfo.getQuantity())));
        stringBuilder.append(getTableData(inventorySupplyBulkInfo.getUpdateTimeStamp()));
        stringBuilder.append(getTableData(inventorySupplyBulkInfo.getStatus()));
        stringBuilder.append("<tr>");
        return stringBuilder.toString();
    }

    @Override
    @Async
    public void notifyBulkSupplyStatus(BulkInventorySupplyDto request, Map<String, String> parameters, String templateName, String subject) {
        parameters.put("status", request.getStatus());
        parameters.put("reference", request.getReference());
        if(request.getStatus().equals("SUCCESS") || request.getStatus().equals("OPEN")){
            parameters.put("cssStyle", "style=\"visibility:hidden\"");
            parameters.put("failureMessage", "");
        }else{
            parameters.put("cssStyle", "");
            StringBuilder inventorySupplyFailureData = new StringBuilder("");
            for(InventorySupplyBulkInfo inventorySupplyBulkInfo: request.getInventorySupplyRequests()){
                inventorySupplyFailureData.append(createTableRow(inventorySupplyBulkInfo));
            }
            parameters.put("failureMessage", inventorySupplyFailureData.toString());
        }
        emailService.sendEmail(AvailabilityConstants.INVENTORY_SUPPLY_BULK_NOTIFICATION_TEMPLATE_NAME, bulkInventorySupplyConfiguration.getFromAddress(),
                bulkInventorySupplyConfiguration.getToAddress(), bulkInventorySupplyConfiguration.getCcAddress(),
                "ALERT > Inventory Supply Bulk Update Status", parameters);
    }
}
