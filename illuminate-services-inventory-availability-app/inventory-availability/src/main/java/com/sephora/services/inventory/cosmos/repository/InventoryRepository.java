/*
package com.sephora.services.inventory.cosmos.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.microsoft.azure.spring.data.cosmosdb.repository.CosmosRepository;
import com.sephora.services.inventory.cosmos.CosmosDbConstants;
import com.sephora.services.inventory.model.cosmos.doc.Inventory;

@Repository(CosmosDbConstants.INVENTORY_CONTAINER_NAME)
public interface InventoryRepository extends CosmosRepository<Inventory, String>{
	List<Inventory> findByItemIdAndEnterpriseCodeAndInfinite(String itemId, String enterpriseCode, boolean infinite);
}
*/
