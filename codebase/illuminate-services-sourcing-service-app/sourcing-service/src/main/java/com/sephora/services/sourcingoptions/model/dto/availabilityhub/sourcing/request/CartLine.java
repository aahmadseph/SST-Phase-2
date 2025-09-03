
package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class CartLine {

    private String lineId;
    private String productId;
    private String uom;
    private String fulfillmentType;
    private String fulfillmentService = null;
    private ShippingAddress shippingAddress;
    private Integer quantity;
    private String sourcingConstraint;
    private String cartLineType;
    private SourcingLocations sourcingLocations;


    public String getLineId() {
        return lineId;
    }


    public void setLineId(String lineId) {
        this.lineId = lineId;
    }


    public String getProductId() {
        return productId;
    }


    public void setProductId(String productId) {
        this.productId = productId;
    }


    public String getUom() {
        return uom;
    }


    public void setUom(String uom) {
        this.uom = uom;
    }


    public String getFulfillmentType() {
        return fulfillmentType;
    }


    public void setFulfillmentType(String fulfillmentType) {
        this.fulfillmentType = fulfillmentType;
    }

    public String getFulfillmentService() {
        return fulfillmentService;
    }

    public void setFulfillmentService(String fulfillmentService) {
        this.fulfillmentService = fulfillmentService;
    }


    public ShippingAddress getShippingAddress() {
        return shippingAddress;
    }


    public void setShippingAddress(ShippingAddress shippingAddress) {
        this.shippingAddress = shippingAddress;
    }


    public Integer getQuantity() {
        return quantity;
    }


    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public String getSourcingConstraint() {
        return sourcingConstraint;
    }


    public void setSourcingConstraint(String sourcingConstraint) {
        this.sourcingConstraint = sourcingConstraint;
    }

    public String getCartLineType() {
        return cartLineType;
    }

    public void setCartLineType(String cartLineType) {
        this.cartLineType = cartLineType;
    }

    public SourcingLocations getSourcingLocations() {
        return sourcingLocations;
    }

    public void setSourcingLocations(SourcingLocations sourcingLocations) {
        this.sourcingLocations = sourcingLocations;
    }
}
