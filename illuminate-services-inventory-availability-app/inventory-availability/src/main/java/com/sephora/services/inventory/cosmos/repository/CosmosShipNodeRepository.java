//package com.sephora.services.inventory.cosmos.repository;
//
//import static com.sephora.services.inventory.cosmos.CosmosDbConstants.COSMOS_SHIP_NODE_REPOSITORY;
//
//import com.microsoft.azure.spring.data.cosmosdb.repository.CosmosRepository;
//import com.sephora.services.inventory.model.cosmos.doc.ShipNode;
//
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository(COSMOS_SHIP_NODE_REPOSITORY)
//public interface CosmosShipNodeRepository extends CosmosRepository<ShipNode, String>, CustomCosmosShipNodeRepository {
//
//    List<ShipNode> findAll();
//
//    List<ShipNode> findByIdIn(List<String> shipNodeIds);
//
//    List<ShipNode> findByEnterpriseCode(String enterpriseCode);
//
//    List<String> findIdByEnterpriseCodeAndStatus(String enterpriseCode);
//}
