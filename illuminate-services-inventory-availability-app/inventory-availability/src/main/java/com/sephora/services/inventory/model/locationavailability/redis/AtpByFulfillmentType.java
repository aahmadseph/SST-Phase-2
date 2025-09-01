
package com.sephora.services.inventory.model.locationavailability.redis;


import java.io.Serializable;

public class AtpByFulfillmentType implements Serializable {

    private String fulfillmentType;
    private Double atp;
    private String atpStatus;
    private String updateTime;

    public String getFulfillmentType() {
        return fulfillmentType;
    }

    public void setFulfillmentType(String fulfillmentType) {
        this.fulfillmentType = fulfillmentType;
    }

    public Double getAtp() {
        return atp;
    }

    public void setAtp(Double atp) {
        this.atp = atp;
    }

    public String getAtpStatus() {
        return atpStatus;
    }

    public void setAtpStatus(String atpStatus) {
        this.atpStatus = atpStatus;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }
}
