package com.sephora.services.sourcingoptions.model.cosmos;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import lombok.*;

import javax.persistence.Id;
import java.util.List;

import static com.sephora.services.sourcingoptions.model.cosmos.Constants.ZONE_MAP_CONTAINER_NAME;
import static lombok.AccessLevel.NONE;

@Container(containerName = ZONE_MAP_CONTAINER_NAME)
@CosmosIndexingPolicy(
    includePaths = {
        "/enterpriseCode/?",
        "/fromZipCode/?",
        "/toZipCode/?"
//        "{" +
//            "\"path\": \"/priority/[]/?\"," +
//            "\"indexes\": [{\"kind\": \"Hash\",\"dataType\": \"String\",\"precision\": -1}]" +
//        "}"
    },
    excludePaths = { "/*" }
)
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ZoneMap {

    @Id
    @Setter(value = NONE)
    private String id;

    @PartitionKey
    @Enum(enumClass = EnterpriseCodeEnum.class)
    private String enterpriseCode;

    private String fromZipCode;

    private String toZipCode;

    private List<String> priority;

    private String createdAt;

    private String reference;

    public void updateId() {
        this.id = String.join("_", enterpriseCode, fromZipCode, toZipCode);
    }

    public void setEnterpriseCode(String enterpriseCode) {
        this.enterpriseCode = enterpriseCode;
        updateId();
    }

    public void setFromZipCode(String fromZipCode) {
        this.fromZipCode = fromZipCode;
        updateId();
    }

    public void setToZipCode(String toZipCode) {
        this.toZipCode = toZipCode;
        updateId();
    }
}
