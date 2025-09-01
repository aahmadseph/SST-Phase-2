package com.sephora.services.inventory.model.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@ApiModel(value = "UpdateShipNodesStatus")
public class UpdateShipNodesStatusDto {

    @ApiModelProperty(value = "${UpdateShipNodesStatusDto.shipNodesStatuses.value}", required = true)
    @NotEmpty
    @Valid
    private List<UpdateShipNodeStatusDto> shipNodesStatuses;

    public List<UpdateShipNodeStatusDto> getShipNodesStatuses() {
        return shipNodesStatuses;
    }

    public void setShipNodesStatuses(List<UpdateShipNodeStatusDto> shipNodesStatuses) {
        this.shipNodesStatuses = shipNodesStatuses;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("shipNodesStatuses", shipNodesStatuses)
                .toString();
    }

}