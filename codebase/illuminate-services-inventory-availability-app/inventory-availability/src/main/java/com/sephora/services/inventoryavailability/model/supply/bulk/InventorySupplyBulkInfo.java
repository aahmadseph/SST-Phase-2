package com.sephora.services.inventoryavailability.model.supply.bulk;

import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;
import lombok.Data;

@Data
public class InventorySupplyBulkInfo extends InventorySupplyDTO {
    private String status;
}
