package com.sephora.services.sourcingoptions.model.dto;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import com.sephora.services.sourcingoptions.validation.CountryValid;
import com.sephora.services.sourcingoptions.validation.FulfillmentTypeValid;
import com.sephora.services.sourcingoptions.validation.OmsLineIdValid;
import com.sephora.services.sourcingoptions.validation.ValidSamedayFulfillment;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

import static com.sephora.services.sourcingoptions.validation.ValidationConstants.*;

/**
 * @author Vitaliy Oleksiyenko
 */

@ApiModel(value = "SourcingOptionsRequest")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@CountryValid
@OmsLineIdValid
@FulfillmentTypeValid
@ValidSamedayFulfillment
public class SourcingOptionsRequestDto implements Serializable {

    @ApiModelProperty(value = "${SourcingOptionsRequest.sourceSystem.value}", required = true, position = 0)
    @NotEmpty
    private String sourceSystem;

    @ApiModelProperty(value = "${SourcingOptionsRequest.enterpriseCode.value}", required = true, position = 1,
            allowableValues = ENTERPRISE_CODE_ALLOWED_VALUES)
    @Enum(enumClass = EnterpriseCodeEnum.class, required = true)
    private String enterpriseCode;

    @ApiModelProperty(value = "${SourcingOptionsRequest.sellerCode.value}", required = true, position = 2)
    private String sellerCode;

    @ApiModelProperty(value = "${SourcingOptionsRequest.fulfillmentType.value}", required = true, position = 3,
            allowableValues = FULFILLMENT_TYPE__ALLOWED_VALUES)
    @Enum(enumClass = FulfillmentTypeEnum.class, required = false)
    private String fulfillmentType;

    @ApiModelProperty(value = "${SourcingOptionsRequest.shippingAddress.value}", required = true, position = 4)
    @NotNull
    @Valid
    private ShippingAddressDto shippingAddress;

    @ApiModelProperty(value = "${SourcingOptionsRequest.items.value}", required = true, position = 5)
    @NotEmpty
    private List<@Valid SourcingOptionsRequestItemDto> items;

    private String transactionType;

    private List<String> carrierServiceCodes;
    @NotEmpty
    private String cartId;

}
