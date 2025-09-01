package com.sephora.services.sourcingoptions.model.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

/**
 * @author Vitaliy Oleksiyenko
 */
@ApiModel("ZoneMap")
public class ZoneMapDto implements Serializable {

    @ApiModelProperty(value = "${ZoneMap.enterpriseCode.value}", required = true)
    private String enterpriseCode;

    @ApiModelProperty(value = "${ZoneMap.fromZipCode.value}", required = true)
    private String fromZipCode;

    @ApiModelProperty(value = "${ZoneMap.toZipCode.value}", required = true)
    private String toZipCode;

    @ApiModelProperty(value = "${ZoneMap.nodePriority.value}", required = true)
    private String nodePriority;

    /**
     * @return the enterpriseCode
     */
    public String getEnterpriseCode() {
        return enterpriseCode;
    }

    /**
     * @param enterpriseCode the enterpriseCode to set
     */
    public void setEnterpriseCode(String enterpriseCode) {
        this.enterpriseCode = enterpriseCode;
    }

    /**
     * @return the fromZipCode
     */
    public String getFromZipCode() {
        return fromZipCode;
    }

    /**
     * @param fromZipCode the fromZipCode to set
     */
    public void setFromZipCode(String fromZipCode) {
        this.fromZipCode = fromZipCode;
    }

    /**
     * @return the toZipCode
     */
    public String getToZipCode() {
        return toZipCode;
    }

    /**
     * @param toZipCode the toZipCode to set
     */
    public void setToZipCode(String toZipCode) {
        this.toZipCode = toZipCode;
    }

    /**
     * @return the nodePriority
     */
    public String getNodePriority() {
        return nodePriority;
    }

    /**
     * @param nodePriority the nodePriority to set
     */
    public void setNodePriority(String nodePriority) {
        this.nodePriority = nodePriority;
    }

    public static final class Builder {

        private String enterpriseCode;

        private String fromZipCode;

        private String toZipCode;

        private String nodePriority;

        private Builder() {
        }

        public static Builder anZoneMapDto() {
            return new Builder();
        }

        public Builder withEnterpriseCode(String enterpriseCode) {
            this.enterpriseCode = enterpriseCode;
            return this;
        }

        public Builder withFromZipCode(String fromZipCode) {
            this.fromZipCode = fromZipCode;
            return this;
        }

        public Builder withToZipCode(String toZipCode) {
            this.toZipCode = toZipCode;
            return this;
        }

        public Builder withNodePriority(String nodePriority) {
            this.nodePriority = nodePriority;
            return this;
        }

        public ZoneMapDto build() {
            ZoneMapDto zoneMapDto = new ZoneMapDto();
            zoneMapDto.setEnterpriseCode(enterpriseCode);
            zoneMapDto.setFromZipCode(fromZipCode);
            zoneMapDto.setToZipCode(toZipCode);
            zoneMapDto.setNodePriority(nodePriority);
            return zoneMapDto;
        }
    }
}
