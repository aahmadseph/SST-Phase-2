package com.sephora.services.inventory.cosmos.repository;//package com.sephora.services.inventory.cosmos.repository;
//
//import java.util.List;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Repository;
//
//import com.microsoft.azure.spring.data.cosmosdb.repository.CosmosRepository;
//import com.sephora.services.inventory.model.cosmos.doc.Inventory;
//@Repository
//public interface CosmosInventoryRepository extends CosmosRepository<Inventory, String>, CustomCosmosInventoryRepository {
//	 List<Inventory> findAll();
//
//	 Page<Inventory> findByShipNodeAndInfiniteAndEnterpriseCode(String shipNode, boolean infinite,String enterpriseCode, Pageable pageable);
//	 List<Inventory> findByItemIdAndEnterpriseCode(String itemId, String enterpriseCode);
//
//
//}
