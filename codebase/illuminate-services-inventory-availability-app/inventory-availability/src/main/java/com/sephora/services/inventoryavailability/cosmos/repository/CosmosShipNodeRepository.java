//package com.sephora.services.inventoryavailability.cosmos.repository;
//
//import com.microsoft.azure.spring.data.cosmosdb.repository.CosmosRepository;
//import com.sephora.services.inventoryavailability.model.cosmos.doc.ShipNode;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository(CosmosShipNodeRepository.COSMOS_SHIP_NODE_REPOSITORY)
//public interface CosmosShipNodeRepository extends CosmosRepository<ShipNode, String>, CustomCosmosShipNodeRepository {
//
//    String COSMOS_SHIP_NODE_REPOSITORY = "cosmosShipNodeRepositoryAvailability";
//
//    List<ShipNode> findAll();
//
//    List<ShipNode> findByIdIn(List<String> shipNodeIds);
//
//    List<ShipNode> findByEnterpriseCode(String enterpriseCode);
//}
