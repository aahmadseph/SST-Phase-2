package com.sephora.services.inventory.repository.cosmos;

import java.util.List;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import org.springframework.stereotype.Repository;
import com.sephora.services.inventory.cosmos.CosmosDbConstants;
import com.sephora.services.inventory.model.cosmos.doc.Inventory;

@Repository(CosmosDbConstants.INVENTORY_CONTAINER_NAME)
public interface InventoryRepository extends CosmosRepository<Inventory, String> {
	List<Inventory> findByItemIdAndEnterpriseCodeAndInfinite(String itemId, String enterpriseCode, boolean infinite);
}

