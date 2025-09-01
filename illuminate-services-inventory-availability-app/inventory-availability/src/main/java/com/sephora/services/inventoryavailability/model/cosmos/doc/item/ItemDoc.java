
package com.sephora.services.inventoryavailability.model.cosmos.doc.item;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.CosmosIndexingPolicy;
import com.sephora.services.inventoryavailability.cosmos.config.CosmosConfiguration;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.annotate.JsonPropertyOrder;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.springframework.data.annotation.Id;

@Container(containerName = CosmosConfiguration.ITEM_COLLECTION)
@CosmosIndexingPolicy(
        includePaths = { "/productId/?", "/productCategory/?", "/productClass/?" },
        excludePaths = "/*" )
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
@JsonPropertyOrder({
    "itemId",
    "organizationCode",
    "unitOfMeasure",
    "primaryInformation"
})
public class ItemDoc {

    @JsonProperty("itemId")
    @Id
    private String itemId;
    @JsonProperty("organizationCode")
    private String organizationCode;
    @JsonProperty("unitOfMeasure")
    private String unitOfMeasure;
    @JsonProperty("primaryInformation")
    private PrimaryInformation primaryInformation;

    @JsonProperty("itemId")
    public String getItemId() {
        return itemId;
    }

    @JsonProperty("itemId")
    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    @JsonProperty("organizationCode")
    public String getOrganizationCode() {
        return organizationCode;
    }

    @JsonProperty("organizationCode")
    public void setOrganizationCode(String organizationCode) {
        this.organizationCode = organizationCode;
    }

    @JsonProperty("unitOfMeasure")
    public String getUnitOfMeasure() {
        return unitOfMeasure;
    }

    @JsonProperty("unitOfMeasure")
    public void setUnitOfMeasure(String unitOfMeasure) {
        this.unitOfMeasure = unitOfMeasure;
    }

    @JsonProperty("primaryInformation")
    public PrimaryInformation getPrimaryInformation() {
        return primaryInformation;
    }

    @JsonProperty("primaryInformation")
    public void setPrimaryInformation(PrimaryInformation primaryInformation) {
        this.primaryInformation = primaryInformation;
    }

}
