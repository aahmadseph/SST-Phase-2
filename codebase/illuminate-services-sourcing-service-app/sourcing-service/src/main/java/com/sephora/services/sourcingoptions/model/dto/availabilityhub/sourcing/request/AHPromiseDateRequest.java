
package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "cartId",
    "orgId",
    "sellingChannel",
    "cartType",
    "transactionType",
    "cartLines"
})
@Data
public class AHPromiseDateRequest {

    @JsonProperty("cartId")
    private String cartId;
    @JsonProperty("optimizationRuleId")
    private String optimizationRuleId;
    @JsonProperty("orgId")
    private String orgId;
    @JsonProperty("sellingChannel")
    private String sellingChannel;
    @JsonProperty("cartType")
    private String cartType;
    @JsonProperty("transactionType")
    private String transactionType;
    @JsonProperty("cartLines")
    private List<CartLine> cartLines = null;

    @JsonProperty("cartId")
    public String getCartId() {
        return cartId;
    }

    @JsonProperty("cartId")
    public void setCartId(String cartId) {
        this.cartId = cartId;
    }

    @JsonProperty("orgId")
    public String getOrgId() {
        return orgId;
    }

    @JsonProperty("orgId")
    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    @JsonProperty("sellingChannel")
    public String getSellingChannel() {
        return sellingChannel;
    }

    @JsonProperty("sellingChannel")
    public void setSellingChannel(String sellingChannel) {
        this.sellingChannel = sellingChannel;
    }

    @JsonProperty("cartType")
    public String getCartType() {
        return cartType;
    }

    @JsonProperty("cartType")
    public void setCartType(String cartType) {
        this.cartType = cartType;
    }

    @JsonProperty("cartLines")
    public List<CartLine> getCartLines() {
        return cartLines;
    }

    @JsonProperty("cartLines")
    public void setCartLines(List<CartLine> cartLines) {
        this.cartLines = cartLines;
    }

    @JsonProperty("transactionType")
    public String getTransactionType() {
        return transactionType;
    }
    @JsonProperty("transactionType")
    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }
}
