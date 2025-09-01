package com.sephora.services.sourcingoptions.model.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.experimental.FieldNameConstants;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@ApiModel("ZoneMapFull")
@FieldNameConstants
public class ZoneMapFullDto extends ZoneMapDto {

    @ApiModelProperty(value = "${ZoneMap.id.value}", required = true)
    private String id;

    @ApiModelProperty(value = "${ZoneMap.createdAt.value}", required = true)
    private String createdAt;

    @ApiModelProperty(value = "${ZoneMap.reference.value}", required = true)
    private String reference;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("id", id)
                .append("enterpriseCode", super.getEnterpriseCode())
                .append("fromZipCode", super.getFromZipCode())
                .append("toZipCode", super.getToZipCode())
                .append("nodePriority", super.getNodePriority())
                .append("createdAt", createdAt)
                .append("reference", reference)
                .toString();
    }

    public static final class Builder {

        private String id;
        private String enterpriseCode;
        private String fromZipCode;
        private String toZipCode;
        private String nodePriority;
        private String createdAt;
        private String reference;

        private Builder() {
        }

        public static Builder anZoneMapFullDto() {
            return new Builder();
        }

        public Builder withId(String id) {
            this.id = id;
            return this;
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

        public Builder withCreatedAt(String createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder withReference(String reference) {
            this.reference = reference;
            return this;
        }

        public ZoneMapFullDto build() {
            ZoneMapFullDto zoneMapDto = new ZoneMapFullDto();
            zoneMapDto.setId(id);
            zoneMapDto.setEnterpriseCode(enterpriseCode);
            zoneMapDto.setFromZipCode(fromZipCode);
            zoneMapDto.setToZipCode(toZipCode);
            zoneMapDto.setNodePriority(nodePriority);
            zoneMapDto.setCreatedAt(createdAt);
            zoneMapDto.setReference(reference);
            return zoneMapDto;
        }
    }
}
