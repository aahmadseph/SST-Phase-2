package com.sephora.services.sourcingoptions.model.cosmos;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.ShipNodeStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import static com.sephora.services.sourcingoptions.model.cosmos.Constants.SHIP_NODE_CONTAINER_NAME;

@Container(containerName = SHIP_NODE_CONTAINER_NAME)
@CosmosIndexingPolicy(
    includePaths = {
        "/enterpriseCode/?" },
    excludePaths = { "/*" })
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShipNode {

    @Id
    @PartitionKey
    private String id;

    private String name;

    @Enum(enumClass = EnterpriseCodeEnum.class)
    private String enterpriseCode;

    private String nodeType;

    private String timeZone;

    @Enum(enumClass = ShipNodeStatusEnum.class)
    private String status;

    private String _etag;

}
