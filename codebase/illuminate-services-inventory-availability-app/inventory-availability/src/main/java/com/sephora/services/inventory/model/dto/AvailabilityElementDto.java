package com.sephora.services.inventory.model.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.sephora.platform.common.validation.InvalidFormat;
import com.sephora.services.inventory.validation.ValidationUtils;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.ZonedDateTime;

import static com.sephora.services.inventory.validation.ValidationConstants.SHIP_NODE_KEY_MAX_LENGTH;

/**
 * @author Vitaliy Oleksiyenko
 */
@ApiModel(value = "AvailabilityElement")
public class AvailabilityElementDto implements Serializable {

    public static final String MODIFY_TS_PROPERTY = "updateInventoryDto.availability.modifyts";

    @ApiModelProperty(value = "${UpdateInventoryDto.AvailabilityElementDto.shipNode.value}", required = true,
            allowableValues = "range[1, " + SHIP_NODE_KEY_MAX_LENGTH + "]")
    @NotEmpty
    @Length(max = SHIP_NODE_KEY_MAX_LENGTH)
    private String shipNode;

    @ApiModelProperty(value = "${UpdateInventoryDto.AvailabilityElementDto.quantity.value}", required = true)
    @NotNull
    @InvalidFormat("{InvalidFormat.updateInventoryDto.availability.quantity}")
    @Min(0)
    private Long quantity;

    @ApiModelProperty(value = "${UpdateInventoryDto.AvailabilityElementDto.modifyts.value}", required = true)
    @NotNull
    private ZonedDateTime modifyts;

    public String getShipNode() {
        return shipNode;
    }

    public void setShipNode(String shipNode) {
        this.shipNode = shipNode;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public ZonedDateTime getModifyts() {
        return modifyts;
    }

    public void setModifyts(ZonedDateTime modifyts) {
        this.modifyts = modifyts;
    }

    @JsonSetter
    public void setModifyts(String modifyts) {
        this.modifyts = ValidationUtils.toLocalDateTime(modifyts, MODIFY_TS_PROPERTY);
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("shipNode", shipNode)
                .append("quantity", quantity)
                .append("modifyts", modifyts)
                .toString();
    }
}
