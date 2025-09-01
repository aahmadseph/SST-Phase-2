package com.sephora.services.sourcingoptions.repository.cosmos;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.ShipNodeStatusEnum;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(ShipNodeRepository.SOURCING_SHIP_NODE_REPOSITORY)
public interface ShipNodeRepository extends CosmosRepository<ShipNode, String> {

    String SOURCING_SHIP_NODE_REPOSITORY = "shipNodeRepositoryCosmos";

    List<ShipNode> findByIdIn(List<String> shipNodeKeys);

    List<ShipNode> findByStatus(ShipNodeStatusEnum status);

    List<ShipNode> findByStatusAndEnterpriseCode(ShipNodeStatusEnum status, EnterpriseCodeEnum enterpriseCode);
    
    List<ShipNode> findByEnterpriseCode(EnterpriseCodeEnum enterpriseCode);
}