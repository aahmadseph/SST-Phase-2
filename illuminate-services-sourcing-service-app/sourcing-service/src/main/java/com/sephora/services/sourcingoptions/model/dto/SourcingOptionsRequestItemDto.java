package com.sephora.services.sourcingoptions.model.dto;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.FulfillmentTypeEnum;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;
import java.util.List;

import static com.sephora.services.sourcingoptions.validation.ValidationConstants.FULFILLMENT_TYPE__ALLOWED_VALUES;

@ApiModel(value = "SourcingOptionsRequestItem")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SourcingOptionsRequestItemDto implements Serializable {

    private String lineId;

    @ApiModelProperty(value = "${SourcingOptionsRequest.items.itemId.value}", required = true)
    @NotEmpty
    private String itemId;

    @ApiModelProperty(value = "${SourcingOptionsRequest.items.requiredQuantity.value}", required = true)
    @NotNull
    @Positive
    private Integer requiredQuantity;

    /**
     *           "lineId":"2071777",
     *       "itemId": "2071777",
     *       "requiredQuantity": 1
     *            "uom":"EACH",
     * "carrierServiceCode":"10",
     * "lineType":"SHIPTOHOME"
     */
    private String uom;

    private String carrierServiceCode;

    private String lineType;

    @ApiModelProperty(value = "${SourcingOptionsRequest.fulfillmentType.value}", required = true, position = 3,
            allowableValues = FULFILLMENT_TYPE__ALLOWED_VALUES)
    @Enum(enumClass = FulfillmentTypeEnum.class, required = false)
    private String fulfillmentType;

    private List<String> locationIds;

    public String getLineId() {
        return lineId;
    }

    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    public String getUom() {
        return uom;
    }

    public void setUom(String uom) {
        this.uom = uom;
    }

    public String getCarrierServiceCode() {
        return carrierServiceCode;
    }

    public void setCarrierServiceCode(String carrierServiceCode) {
        this.carrierServiceCode = carrierServiceCode;
    }

    public String getLineType() {
        return lineType;
    }

    public void setLineType(String lineType) {
        this.lineType = lineType;
    }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public Integer getRequiredQuantity() {
        return requiredQuantity;
    }

    public void setRequiredQuantity(Integer requiredQuantity) {
        this.requiredQuantity = requiredQuantity;
    }

    public String getFulfillmentType() {
        return fulfillmentType;
    }

    public void setFulfillmentType(String fulfillmentType) {
        this.fulfillmentType = fulfillmentType;
    }

    public List<String> getLocationIds() {
        return locationIds;
    }

    public void setLocationIds(List<String> locationIds) {
        this.locationIds = locationIds;
    }

    /*@Override
    public String toString() {
        return "ItemRequestDto{" +
                "itemId='" + itemId + '\'' +
                ", requiredQuantity=" + requiredQuantity +
                '}';
    }

    public static final class Builder {
        private String itemId;
        private Integer requiredQuantity;

        private Builder() {
        }

        public static Builder anItemDto() {
            return new Builder();
        }

        public Builder withSkuId(String itemId) {
            this.itemId = itemId;
            return this;
        }

        public Builder withRequiredQuantity(Integer requiredQuantity) {
            this.requiredQuantity = requiredQuantity;
            return this;
        }

        public SourcingOptionsRequestItemDto build() {
            SourcingOptionsRequestItemDto itemDto = new SourcingOptionsRequestItemDto();
            itemDto.setItemId(itemId);
            itemDto.setRequiredQuantity(requiredQuantity);
            return itemDto;
        }
    }*/
}
