package com.sephora.services.inventory.model.dto;

import static com.sephora.services.inventory.validation.ValidationConstants.ENTERPRISE_CODE_ALLOWED_VALUES;
import static com.sephora.services.inventory.validation.ValidationConstants.ITEM_ID_MAX_LENGTH;
import static com.sephora.services.inventory.validation.ValidationConstants.THRESHOLD_MAX_LENGTH;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.hibernate.validator.constraints.Length;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.inventory.model.EnterpriseCodeEnum;
import com.sephora.services.inventory.model.doc.Inventory;
import com.sephora.services.inventory.util.InventoryUtils;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @author Vitaliy Oleksiyenko
 */
@ApiModel(value = "UpdateInventoryDto")
public class UpdateInventoryDto {

    @ApiModelProperty(value = "${UpdateInventoryDto.itemId.value}", required = true,
            allowableValues = "range[1, " + ITEM_ID_MAX_LENGTH + "]")
    @NotEmpty
    @Length(max = ITEM_ID_MAX_LENGTH)
    private String itemId;

    @ApiModelProperty(value = "${UpdateInventoryDto.enterpriseCode.value}",
            allowableValues = ENTERPRISE_CODE_ALLOWED_VALUES, required = true)
    @NotEmpty
    @Enum(message= "{Enum.updateInventoryDto.enterpriseCode}", enumClass = EnterpriseCodeEnum.class)
    private String enterpriseCode;

    @ApiModelProperty(value = "${UpdateInventoryDto.threshold.value}", required = true,
            allowableValues = "range[1, " + THRESHOLD_MAX_LENGTH + "]")
    @NotEmpty
    @Length(max = THRESHOLD_MAX_LENGTH)
    private String threshold;

    @ApiModelProperty(value = "${UpdateInventoryDto.availability.value}", required = true)
    @NotEmpty
    @Valid
    private List<AvailabilityElementDto> availability;

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getEnterpriseCode() {
        return enterpriseCode;
    }

    public void setEnterpriseCode(String enterpriseCode) {
        this.enterpriseCode = enterpriseCode;
    }

    public String getThreshold() {
        return threshold;
    }

    public void setThreshold(String threshold) {
        this.threshold = threshold;
    }

    public List<AvailabilityElementDto> getAvailability() {
        return availability;
    }

    public void setAvailability(List<AvailabilityElementDto> availability) {
        this.availability = availability;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("itemId", itemId)
                .append("enterpriseCode", enterpriseCode)
                .append("threshold", threshold)
                .append("availability", availability)
                .toString();
    }

    @ApiModelProperty(hidden = true)
    public List<Inventory> getInventories() {
        return Optional.ofNullable(availability).orElse(Collections.emptyList()).stream()
            .map(availabilityElementDto ->
                    Inventory.Builder.anInventory()
                        .withItemId(itemId)
                        .withEnterpriseCode(enterpriseCode)
                        .withShipNode(availabilityElementDto.getShipNode())
                        .withQuantity(availabilityElementDto.getQuantity())
                        .withThreshold(threshold)
                        //.withModifyTimestamp(DateTimeUtils.convertToLong(availabilityElementDto.getModifyts()))
                        .withModifyTimestamp(InventoryUtils.convertDateTimeToPST(availabilityElementDto.getModifyts()))
                        .build()
            ).collect(Collectors.toList());
    }

}
