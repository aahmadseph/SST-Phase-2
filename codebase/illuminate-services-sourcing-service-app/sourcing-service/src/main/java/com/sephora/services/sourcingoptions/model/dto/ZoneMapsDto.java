package com.sephora.services.sourcingoptions.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

import static com.sephora.services.sourcingoptions.validation.ValidationConstants.REFERENCE_MAX_LENGTH;

@JsonInclude(JsonInclude.Include.NON_NULL)
@ApiModel(value = "ZoneMaps")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ZoneMapsDto {
    
    @ApiModelProperty(value = "${ZoneMap.enterpriseCode.value}", required = true, position = 0)
    @Enum(enumClass = EnterpriseCodeEnum.class, required = true)
    private String enterpriseCode;

    @ApiModelProperty(value = "${ZoneMap.reference.value}", position = 1)
    @Length(max = REFERENCE_MAX_LENGTH)
    private String reference;

    @ApiModelProperty(value = "${ZoneMap.zones.value}", required = true, position = 2)
    @NotNull
    @Valid
    private List<ZonesDto> zones;

}
