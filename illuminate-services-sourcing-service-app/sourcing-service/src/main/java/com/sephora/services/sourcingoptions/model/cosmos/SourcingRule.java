package com.sephora.services.sourcingoptions.model.cosmos;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.DestinationTypeEnum;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import com.sephora.services.sourcingoptions.model.SellerCodeEnum;
import lombok.*;
import org.springframework.data.annotation.Id;

import static com.sephora.services.sourcingoptions.model.cosmos.Constants.SOURCING_RULE_CONTAINER_NAME;
import static lombok.AccessLevel.NONE;

@Container(containerName = SOURCING_RULE_CONTAINER_NAME)
@CosmosIndexingPolicy(
    includePaths = {
        "/enterpriseCode/?",
        "/sellerCode/?",
        "/fulfilmentType/?",
        "/destinationType/?" },
    excludePaths = { "/*" }
)
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SourcingRule {

    @Id
    @Setter(value = NONE)
    private String id;

    @PartitionKey
    @Enum(enumClass = EnterpriseCodeEnum.class)
    private String enterpriseCode;

    @Enum(enumClass = SellerCodeEnum.class)
    private String sellerCode;

    @Enum(enumClass = FulfillmentTypeEnum.class)
    private String fulfilmentType;

    @Enum(enumClass = DestinationTypeEnum.class)
    private String destinationType;

    private Boolean shipFromSingleNode;

    private Boolean shipComplete;

    private String defaultShipNode;

    private Boolean regionBased;

    private String _etag;

    public void updateId() {
        this.id = String.join("_", enterpriseCode, sellerCode, fulfilmentType, destinationType);
    }

    public void setEnterpriseCode(String enterpriseCode) {
        this.enterpriseCode = enterpriseCode;
        updateId();
    }

    public void setSellerCode(String sellerCode) {
        this.sellerCode = sellerCode;
        updateId();
    }

    public void setFulfilmentType(String fulfilmentType) {
        this.fulfilmentType = fulfilmentType;
        updateId();
    }

    public void setDestinationType(String destinationType) {
        this.destinationType = destinationType;
        updateId();
    }
}
