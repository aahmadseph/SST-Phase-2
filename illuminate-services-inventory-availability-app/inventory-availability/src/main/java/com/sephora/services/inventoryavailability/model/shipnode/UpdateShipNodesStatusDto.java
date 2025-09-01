//package com.sephora.services.inventoryavailability.model.shipnode;
//
//import io.swagger.annotations.ApiModel;
//import io.swagger.annotations.ApiModelProperty;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import org.apache.commons.lang3.builder.ToStringBuilder;
//import org.apache.commons.lang3.builder.ToStringStyle;
//
//import javax.validation.Valid;
//import javax.validation.constraints.NotEmpty;
//import java.util.List;
//
//@ApiModel(value = "UpdateShipNodesStatus")
//@Data
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//public class UpdateShipNodesStatusDto {
//
//    @ApiModelProperty(value = "${UpdateShipNodesStatusDto.shipNodesStatuses.value}", required = true)
//    @NotEmpty
//    @Valid
//    private List<UpdateShipNodeStatusDto> shipNodesStatuses;
//
//    @Override
//    public String toString() {
//        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
//                .append("shipNodesStatuses", shipNodesStatuses)
//                .toString();
//    }
//
//}