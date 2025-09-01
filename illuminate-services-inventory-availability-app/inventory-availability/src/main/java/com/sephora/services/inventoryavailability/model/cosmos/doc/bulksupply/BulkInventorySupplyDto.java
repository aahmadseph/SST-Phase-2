package com.sephora.services.inventoryavailability.model.cosmos.doc.bulksupply;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.sephora.services.inventoryavailability.cosmos.config.CosmosConfiguration;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;
import com.sephora.services.inventoryavailability.model.supply.bulk.InventorySupplyBulkInfo;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.codehaus.jackson.annotate.JsonPropertyOrder;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.List;

@Container(containerName = CosmosConfiguration.INV_SUPPLY_BULK_COLLECTION)
@CosmosIndexingPolicy(
        includePaths = { "/enterpriseCode/?", "/reference/?" },
        excludePaths = "/*" )
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
@NoArgsConstructor
@Data
public class BulkInventorySupplyDto {
    /*
    "id": "1602141310501",
        "reference": "Inventory_info.csv",
        "enterpriseCode": "SEPHORAUS",
        "status": "CLOSED",

*/  private String id;
    private String reference;
    private String enterpriseCode;
    @PartitionKey
    private String status;
    private List<InventorySupplyBulkInfo> inventorySupplyRequests;

}
