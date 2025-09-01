
package com.sephora.services.inventory.model.cosmos.dynamicconfig;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import lombok.Builder;

import java.util.List;
import java.util.UUID;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import static com.sephora.services.inventory.cosmos.CosmosDbConstants.DYNAMIC_CONFIG_CONTAINER_NAME;

@Container(containerName = DYNAMIC_CONFIG_CONTAINER_NAME)
@CosmosIndexingPolicy(
        includePaths = { "/appName/?","/configType/?" },
        excludePaths = "/*" )
public class DynamicConfigDto {
    @Id
    @Builder.Default
    private String id = UUID.randomUUID().toString();
    @PartitionKey
    @NotEmpty
    private String appName;
    @NotEmpty
    private String configType;
    @NotNull
    private List<Object> configValue = null;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getConfigType() {
        return configType;
    }

    public void setConfigType(String configType) {
        this.configType = configType;
    }

    public List<Object> getConfigValue() {
        return configValue;
    }

    public void setConfigValue(List<Object> configValue) {
        this.configValue = configValue;
    }

}
