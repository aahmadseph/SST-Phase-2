package com.sephora.services.sourcingoptions.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sephora.services.sourcingoptions.validation.ValidShipNodesPriority;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@ApiModel(value = "Zones")
public class ZonesDto {

    @ApiModelProperty(value = "${ZoneMap.nodePriority.value}", required = true)
    @NotEmpty
    @ValidShipNodesPriority
    private String nodePriority;
    
    @ApiModelProperty(value = "${ZoneMap.zipCodeRanges.value}", required = true)
    @NotEmpty
    @Valid
    private List<ZipCodeRangeDto> zipCodeRanges;

    public String getNodePriority() {
        return nodePriority;
    }

    public void setNodePriority(String nodePriority) {
        this.nodePriority = nodePriority;
    }

    public List<ZipCodeRangeDto> getZipCodeRanges() {
        return zipCodeRanges;
    }

    public void setZipCodeRanges(List<ZipCodeRangeDto> zipCodeRanges) {
        this.zipCodeRanges = zipCodeRanges;
    }

    @Override
    public String toString() {
        return "ZonesDto{" +
               "nodePriority='" + nodePriority + '\'' +
               ", zipCodeRanges=" + zipCodeRanges +
               '}';
    }

    public static final class ZonesBuilder {
        private String nodePriority;
        private List<ZipCodeRangeDto> zipCodeRanges;

        private ZonesBuilder() {
        }

        public static ZonesBuilder anZonesDto() {
            return new ZonesBuilder();
        }

        public ZonesBuilder withNodePriority(String nodePriority) {
            this.nodePriority = nodePriority;
            return this;
        }

        public ZonesBuilder withZipCodeRanges(ZipCodeRangeDto zipCodeRangeDto) {
            if (zipCodeRanges == null) {
                zipCodeRanges = new ArrayList<>();
            }
            zipCodeRanges.add(zipCodeRangeDto);
            return this;
        }

        public ZonesDto build() {
            ZonesDto zonesDto = new ZonesDto();
            zonesDto.setNodePriority(nodePriority);
            zonesDto.setZipCodeRanges(zipCodeRanges);
            return zonesDto;
        }
    }
}
