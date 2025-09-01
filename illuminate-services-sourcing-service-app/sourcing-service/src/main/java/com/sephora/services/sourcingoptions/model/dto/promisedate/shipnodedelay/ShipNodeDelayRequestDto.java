package com.sephora.services.sourcingoptions.model.dto.promisedate.shipnodedelay;

import static com.sephora.services.sourcingoptions.validation.ValidationConstants.SHIP_NODE_KEY_MAX_LENGTH;
import static com.sephora.services.sourcingoptions.validation.ValidationConstants.DELAY_TIME_MAX_DIGITS;
import static com.sephora.services.sourcingoptions.validation.ValidationConstants.LEVEL_OF_SERVICES_ALLOWED_VALUES;
import static com.sephora.services.sourcingoptions.validation.ValidationConstants.DELAY_DATE_TIME_FORMAT;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.dto.promisedate.LevelOfServiceEnum;
import com.sephora.services.sourcingoptions.validation.DateTime;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShipNodeDelayRequestDto {
	@ApiModelProperty(value = "${OrderProcessingDelayRequest.shipNode.value}", required = true)
    @NotEmpty()
    @Length(max = SHIP_NODE_KEY_MAX_LENGTH)
    private String shipNode;

    @ApiModelProperty(value = "${OrderProcessingDelayRequest.levelOfService.value}", required = true,
            allowableValues = LEVEL_OF_SERVICES_ALLOWED_VALUES)
    @NotEmpty()
    @Enum(enumClass = LevelOfServiceEnum.class)
    private String levelOfService;

    @ApiModelProperty(value = "${OrderProcessingDelayRequest.delayTime.value}", required = true)
    @NotNull
    @Digits(integer = DELAY_TIME_MAX_DIGITS, fraction = 0)
    private Integer delayTime;

    @ApiModelProperty(value = "${OrderProcessingDelayRequest.ruleId.value}")
    @NotNull
    private Integer ruleId;

    @ApiModelProperty(value = "${OrderProcessingDelayRequest.startDateTime.value}", required = true)
    @NotNull
    @DateTime(format = DELAY_DATE_TIME_FORMAT)
    private String startDateTime;

    @ApiModelProperty(value = "${OrderProcessingDelayRequest.endDateTime.value}", required = true)
    @NotNull
    @DateTime(format = DELAY_DATE_TIME_FORMAT)
    private String endDateTime;
}
