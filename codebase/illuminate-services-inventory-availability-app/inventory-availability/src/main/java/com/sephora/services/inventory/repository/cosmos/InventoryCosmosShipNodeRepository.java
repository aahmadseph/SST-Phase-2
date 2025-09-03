package com.sephora.services.inventory.repository.cosmos;


import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.sephora.services.inventory.model.doc.ShipNode;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(InventoryCosmosShipNodeRepository.COSMOS_SHIP_NODE_REPOSITORY)
public interface InventoryCosmosShipNodeRepository extends CosmosRepository<ShipNode, String>, CustomCosmosShipNodeRepository {

    String COSMOS_SHIP_NODE_REPOSITORY = "cosmosShipNodeRepository";

    List<ShipNode> findAll();

    List<ShipNode> findByIdIn(List<String> shipNodeIds);

    List<ShipNode> findByEnterpriseCode(String enterpriseCode);
}
