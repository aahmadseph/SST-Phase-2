package com.sephora.services.sourcingoptions.model.dto.availabilityhub.sourcing.response;

import lombok.Data;
import lombok.ToString;

@ToString
public class AuditDetails {
    /**
     * {
     *                 "reasonCode": "PRODUCT_NOT_ELIGIBLE",
     *                 "description": "Product (Product1) is not eligible"
     *             }
     */
    private String reasonCode;
    private String description;

    public String getReasonCode() {
        return reasonCode;
    }

    public void setReasonCode(String reasonCode) {
        this.reasonCode = reasonCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
