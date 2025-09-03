
package com.sephora.services.sourcingoptions.model.dto.zonemap;

import java.util.List;
import javax.annotation.Generated;

public class SourcingHubZoneMapInfo {

    private String beginZipCode;
    private String endZipCode;
    private String countryCode;
    private String orgId;
    private List<Zone> zones = null;
    private String state;
    private String updateTime;
    private String updateUser;

    public String getBeginZipCode() {
        return beginZipCode;
    }

    public void setBeginZipCode(String beginZipCode) {
        this.beginZipCode = beginZipCode;
    }

    public String getEndZipCode() {
        return endZipCode;
    }

    public void setEndZipCode(String endZipCode) {
        this.endZipCode = endZipCode;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public List<Zone> getZones() {
        return zones;
    }

    public void setZones(List<Zone> zones) {
        this.zones = zones;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser;
    }

}
