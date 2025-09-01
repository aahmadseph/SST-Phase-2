package com.sephora.services.sourcingoptions.model.dto;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

import static com.sephora.services.sourcingoptions.validation.ValidationConstants.FULFILLMENT_TYPE__ALLOWED_VALUES;

/**
 * @author Vitaliy Oleksiyenko
 */
@ApiModel(value = "ShippingGroup")
@Builder
@Data
public class ShippingGroupDto implements Serializable {

    private String shippingGroupID;

    @ApiModelProperty(value = "${SourcingOptionsRequest.shippingGroup.fulfillmentType.value}", required = true, position = 3,
            allowableValues = FULFILLMENT_TYPE__ALLOWED_VALUES)
    @Enum(enumClass = FulfillmentTypeEnum.class, required = true)
    private String fulfillmentType;

    @ApiModelProperty(value = "${SourcingOptionsRequest.shippingGroup.shippingAddress.value}", required = true, position = 4)
    @NotNull
    @Valid
    private ShippingAddressDto shippingAddress;

    @ApiModelProperty(value = "${SourcingOptionsRequest.shippingGroup.items.value}", required = true, position = 5)
    @NotNull
    @Valid
    private List<ItemDto> items;

    private Boolean isAvailable;

    private Boolean isMultiNodeAssigned;

}
