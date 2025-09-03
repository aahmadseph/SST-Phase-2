package com.sephora.services.inventoryavailability.cosmos.repository;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.sephora.services.inventoryavailability.model.cosmos.doc.bulksupply.BulkInventorySupplyDto;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

@Repository
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public interface InvBulkSupplyRepository extends CosmosRepository<BulkInventorySupplyDto, String> {
}
