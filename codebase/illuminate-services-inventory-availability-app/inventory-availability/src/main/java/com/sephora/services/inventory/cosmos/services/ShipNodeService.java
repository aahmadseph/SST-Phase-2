/*
package com.sephora.services.inventory.cosmos.services;

import static com.sephora.services.inventory.cosmos.CosmosDbConstants.ACTIVE;
import static com.sephora.services.inventory.cosmos.CosmosDbConstants.ENTERPRISE_CODE;
import static com.sephora.services.inventory.cosmos.CosmosDbConstants.STATUS;
import static java.util.stream.Collectors.toList;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sephora.platform.database.cosmosdb.utils.CosmosQueryBuilder;
import com.sephora.platform.database.cosmosdb.utils.WhereStatements;
import com.sephora.services.inventory.repository.cosmos.CosmosShipNodeRepository;
import com.sephora.services.inventory.model.cosmos.doc.ShipNode;

@Service
public class ShipNodeService {

    @Autowired
    private CosmosShipNodeRepository shipNodeRepository;

    //@Cacheable(cacheManager = CACHE_MANAGER_NAME, cacheNames = SHIP_NODE_CACHE_NAME, key = "#enterpriseCode", unless = "#result == null or #result.size()==0")
    public List<String> findByEnterpriseCode(String enterpriseCode) {
        return shipNodeRepository.queryDocuments(CosmosQueryBuilder.select()
        		.where(WhereStatements.equal(STATUS, ACTIVE))
                .whereIf(enterpriseCode != null,
                        () -> WhereStatements.equal(ENTERPRISE_CODE, enterpriseCode))
                .build())
                .stream().map(ShipNode::getId).collect(toList());
    }

    public List<ShipNode> findAllShipNodes() {
        return shipNodeRepository.findAll();
    }

}
*/
