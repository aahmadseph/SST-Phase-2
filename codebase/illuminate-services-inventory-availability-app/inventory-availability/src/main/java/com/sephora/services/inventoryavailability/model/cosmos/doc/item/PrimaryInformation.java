
package com.sephora.services.inventoryavailability.model.cosmos.doc.item;

import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.annotate.JsonPropertyOrder;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
@JsonPropertyOrder({
    "assumeInfiniteInventory",
    "description",
    "extendedDescription",
    "isHazmat",
    "isReturnable",
    "isShippingAllowed",
    "itemType",
    "shortDescription"
})
public class PrimaryInformation {

    @JsonProperty("assumeInfiniteInventory")
    private String assumeInfiniteInventory;
    @JsonProperty("description")
    private String description;
    @JsonProperty("extendedDescription")
    private String extendedDescription;
    @JsonProperty("isHazmat")
    private String isHazmat;
    @JsonProperty("isReturnable")
    private String isReturnable;
    @JsonProperty("isShippingAllowed")
    private String isShippingAllowed;
    @JsonProperty("itemType")
    private String itemType;
    @JsonProperty("shortDescription")
    private String shortDescription;

    @JsonProperty("assumeInfiniteInventory")
    public String getAssumeInfiniteInventory() {
        return assumeInfiniteInventory;
    }

    @JsonProperty("assumeInfiniteInventory")
    public void setAssumeInfiniteInventory(String assumeInfiniteInventory) {
        this.assumeInfiniteInventory = assumeInfiniteInventory;
    }

    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    @JsonProperty("description")
    public void setDescription(String description) {
        this.description = description;
    }

    @JsonProperty("extendedDescription")
    public String getExtendedDescription() {
        return extendedDescription;
    }

    @JsonProperty("extendedDescription")
    public void setExtendedDescription(String extendedDescription) {
        this.extendedDescription = extendedDescription;
    }

    @JsonProperty("isHazmat")
    public String getIsHazmat() {
        return isHazmat;
    }

    @JsonProperty("isHazmat")
    public void setIsHazmat(String isHazmat) {
        this.isHazmat = isHazmat;
    }

    @JsonProperty("isReturnable")
    public String getIsReturnable() {
        return isReturnable;
    }

    @JsonProperty("isReturnable")
    public void setIsReturnable(String isReturnable) {
        this.isReturnable = isReturnable;
    }

    @JsonProperty("isShippingAllowed")
    public String getIsShippingAllowed() {
        return isShippingAllowed;
    }

    @JsonProperty("isShippingAllowed")
    public void setIsShippingAllowed(String isShippingAllowed) {
        this.isShippingAllowed = isShippingAllowed;
    }

    @JsonProperty("itemType")
    public String getItemType() {
        return itemType;
    }

    @JsonProperty("itemType")
    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    @JsonProperty("shortDescription")
    public String getShortDescription() {
        return shortDescription;
    }

    @JsonProperty("shortDescription")
    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

}
