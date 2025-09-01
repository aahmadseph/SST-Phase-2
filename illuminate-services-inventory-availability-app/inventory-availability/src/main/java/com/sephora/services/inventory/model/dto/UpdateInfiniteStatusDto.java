package com.sephora.services.inventory.model.dto;

import static com.sephora.services.inventory.validation.ValidationConstants.ENTERPRISE_CODE_ALLOWED_VALUES;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import com.sephora.platform.common.validation.BooleanValue;
import com.sephora.platform.common.validation.Enum;
import com.sephora.services.inventory.model.EnterpriseCodeEnum;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(value = "UpdateInfiniteStatusDto")
public class UpdateInfiniteStatusDto {

    @ApiModelProperty(value = "${UpdateInfiniteStatusDto.enterpriseCode.value}", required = true,
            allowableValues = ENTERPRISE_CODE_ALLOWED_VALUES)
    @NotEmpty
    @Enum(message= "{Enum.updateInfiniteStatusDto.enterpriseCode}", enumClass = EnterpriseCodeEnum.class)
    private String enterpriseCode;

    @ApiModelProperty(value = "${UpdateInfiniteStatusDto.isInfinite.value}", required = true)
    @NotNull
    @BooleanValue("{BooleanValue.updateInfiniteStatusDto.isInfinite}")
    private Boolean isInfinite;

    public Boolean getIsInfinite() {
        return isInfinite;
    }

    public void setIsInfinite(Boolean isInfinite) {
        this.isInfinite = isInfinite;
    }

    public String getEnterpriseCode() {
        return enterpriseCode;
    }

    public void setEnterpriseCode(String enterpriseCode) {
        this.enterpriseCode = enterpriseCode;
    }
}