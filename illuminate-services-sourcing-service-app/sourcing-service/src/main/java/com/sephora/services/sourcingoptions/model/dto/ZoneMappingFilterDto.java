package com.sephora.services.sourcingoptions.model.dto;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.io.Serializable;

import static com.sephora.services.sourcingoptions.validation.ValidationConstants.*;

/**
 * @author Vitaliy Oleksiyenko
 */
@ApiModel("ZoneMappingFilter")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ZoneMappingFilterDto implements Serializable {

    public static final String INVALID_ENTERPRISE_CODE = "Enum.zoneMappingFilterDto.enterpriseCode";
    public static final String FROM_ZIP_CODE_EXCEEDED_LENGTH_ERROR = "Length.zoneMappingFilterDto.fromZipCode";
    public static final String TO_ZIP_CODE_EXCEEDED_LENGTH_ERROR = "Length.zoneMappingFilterDto.toZipCode";
    public static final String NODE_PRIORITY_EXCEEDED_LENGTH_ERROR = "Length.zoneMappingFilterDto.nodePriority";

    @ApiModelProperty(value = "${ZoneMap.enterpriseCode.value}")
    @Enum(enumClass = EnterpriseCodeEnum.class, required = false, message = INVALID_ENTERPRISE_CODE)
    private String enterpriseCode;

    @ApiModelProperty(value = "${ZoneMap.fromZipCode.value}")
    @Length(max = FROM_ZIP_CODE_MAX_LENGTH, message = FROM_ZIP_CODE_EXCEEDED_LENGTH_ERROR)
    private String fromZipCode;

    @ApiModelProperty(value = "${ZoneMap.toZipCode.value}")
    @Length(max = TO_ZIP_CODE_MAX_LENGTH, message = TO_ZIP_CODE_EXCEEDED_LENGTH_ERROR)
    private String toZipCode;

    @ApiModelProperty(value = "${ZoneMap.nodePriority.value}")
    @Length(max = NODE_PRIORITY_ZIP_CODE_MAX_LENGTH, message = NODE_PRIORITY_EXCEEDED_LENGTH_ERROR)
    private String nodePriority;

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder();
        sb.append("enterpriseCode='").append(enterpriseCode).append('\'');
        sb.append(", fromZipCode='").append(fromZipCode).append('\'');
        sb.append(", toZipCode='").append(toZipCode).append('\'');
        sb.append(", nodePriority='").append(nodePriority).append('\'');
        return sb.toString();
    }
}
