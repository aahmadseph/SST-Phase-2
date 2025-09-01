package com.sephora.services.inventoryavailability.service;

import com.sephora.services.inventory.service.NotifyEventService;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.cosmos.repository.InvBulkSupplyRepository;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;
import com.sephora.services.inventoryavailability.model.cosmos.doc.bulksupply.BulkInventorySupplyDto;
import com.sephora.services.inventoryavailability.model.supply.bulk.InventorySupplyBulkInfo;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@Log4j2
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public class BulkInventorySupplyServiceAsync extends AbstractAvailabilityService{

    @Autowired
    UpdateInventorySupplyService updateInventorySupplyService;

    @Autowired(required = false)
    private InvBulkSupplyRepository bulkSupplyRepository;

    @Autowired
    private NotifyEventService notifyEventService;

    @Async
    public void updateBulkRequest(BulkInventorySupplyDto bulkInventorySupplyDto) throws AvailabilityServiceException {
        Boolean failed = false;
        if(bulkInventorySupplyDto != null){
            for(InventorySupplyBulkInfo inventorySupplyDTO: bulkInventorySupplyDto.getInventorySupplyRequests()){
                try {
                    updateInventorySupplyService.updateInventorySupply(inventorySupplyDTO);
                    inventorySupplyDTO.setStatus("SUCCESS");
                } catch (AvailabilityServiceException e) {
                    e.printStackTrace();
                    failed = true;
                    inventorySupplyDTO.setStatus("FAILED");
                }
            }
        }
        if(failed){
            bulkInventorySupplyDto.setStatus("FAILED");
        }else {
            bulkInventorySupplyDto.setStatus("SUCCESS");
        }
        bulkSupplyRepository.save(bulkInventorySupplyDto);
        notifyEventService.notifyBulkSupplyStatus(bulkInventorySupplyDto, new HashMap<>(),
                AvailabilityConstants.INVENTORY_SUPPLY_BULK_NOTIFICATION_TEMPLATE_NAME,
                "BULK SUPPLY UPDATE STATUS");
    }
}
