package com.sephora.services.inventory.model.cosmos.doc;

import static com.sephora.services.inventory.cosmos.CosmosDbConstants.SHIP_NODE_CONTAINER_NAME;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.sephora.services.inventory.model.cosmos.EnterpriseCodeEnum;
import com.sephora.services.inventory.model.cosmos.ShipNodeStatusEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;

import java.io.Serializable;

@Container(containerName = SHIP_NODE_CONTAINER_NAME)
@CosmosIndexingPolicy(
        includePaths = { "/enterpriseCode/?" },
        excludePaths = "/*" )
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipNode implements Serializable {

    @Id
    @PartitionKey
    private String id;
    private String name;
    private EnterpriseCodeEnum enterpriseCode;
    private String nodeType;
    private String timeZone;
    private ShipNodeStatusEnum status;
    private String _etag;

}
