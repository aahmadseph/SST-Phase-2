/*
 * This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 * consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 * Copyright 2019 sephora.com, Inc. All rights reserved.
 */

package com.sephora.services.inventory.model.dto;

/**
 * @author Alexey Zalivko
 */
public class ShipNodeDto {

    private String id;
    private String name;
    private String enterpriseCode;
    private String nodeType;
    private String timeZone;
    private String status;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEnterpriseCode() {
        return enterpriseCode;
    }

    public void setEnterpriseCode(String enterpriseCode) {
        this.enterpriseCode = enterpriseCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public static final class Builder {

        private String id;
        private String name;
        private String enterpriseCode;
        private String nodeType;
        private String timeZone;
        private String status;

        private Builder() {
        }

        public static Builder aShipNodeDto() {
            return new Builder();
        }

        public Builder withId(String id) {
            this.id = id;
            return this;
        }

        public Builder withName(String name) {
            this.name = name;
            return this;
        }

        public Builder withEnterpriseCode(String enterpriseCode) {
            this.enterpriseCode = enterpriseCode;
            return this;
        }

        public Builder withNodeType(String nodeType) {
            this.nodeType = nodeType;
            return this;
        }

        public Builder withTimeZone(String timeZone) {
            this.timeZone = timeZone;
            return this;
        }

        public Builder withStatus(String status) {
            this.status = status;
            return this;
        }

        public ShipNodeDto build() {
            ShipNodeDto shipNodeDto = new ShipNodeDto();
            shipNodeDto.setId(id);
            shipNodeDto.setName(name);
            shipNodeDto.setEnterpriseCode(enterpriseCode);
            shipNodeDto.setNodeType(nodeType);
            shipNodeDto.setTimeZone(timeZone);
            shipNodeDto.setStatus(status);
            return shipNodeDto;
        }
    }
}
