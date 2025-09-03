package com.sephora.services.inventory.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sephora.services.inventory.model.EnterpriseCodeEnum;
import com.sephora.services.inventory.validation.ValidationConstants;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import com.sephora.platform.common.validation.Enum;
import javax.validation.constraints.NotEmpty;
import java.util.List;

import static com.sephora.services.inventory.validation.ValidationConstants.ENTERPRISE_CODE_ALLOWED_VALUES;
import static com.sephora.services.inventory.validation.ValidationConstants.SHIP_NODE_KEY_MAX_LENGTH;

@JsonInclude(JsonInclude.Include.NON_NULL)
@ApiModel(value = "InventoryAvailability")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetInventoryAvailabilityDto {

    @ApiModelProperty(value = "${Inventory.requestSourceSystem.value}", required = true, position = 0)
    private String requestSourceSystem;

    @ApiModelProperty(value = "${Inventory.enterpriseCode.value}", required = true,
                      allowableValues = ENTERPRISE_CODE_ALLOWED_VALUES)
    @Enum(enumClass = EnterpriseCodeEnum.class, required = true)
    private String enterpriseCode;

    @ApiModelProperty(value = "${Inventory.items.value}", required = true, position = 2)
    @NotEmpty
    private List<@Length(max = ValidationConstants.ITEM_ID_MAX_LENGTH) String> items;

    @ApiModelProperty(value = "${Inventory.shipNodes.value}", position = 3,
                      allowableValues = "range[1, " + SHIP_NODE_KEY_MAX_LENGTH + "]")
    private List<@Length(max = SHIP_NODE_KEY_MAX_LENGTH) String> shipNodes;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GetInventoryAvailabilityDto)) return false;

        GetInventoryAvailabilityDto that = (GetInventoryAvailabilityDto) o;

        if (requestSourceSystem != null ? !requestSourceSystem.equals(that.requestSourceSystem) : that.requestSourceSystem != null) {
            return false;
        }
        if (enterpriseCode != null ? !enterpriseCode.equals(that.enterpriseCode) : that.enterpriseCode != null) return false;
        if (items != null ? !items.equals(that.items) : that.items != null) return false;
        return shipNodes != null ? shipNodes.equals(that.shipNodes) : that.shipNodes == null;
    }

}
