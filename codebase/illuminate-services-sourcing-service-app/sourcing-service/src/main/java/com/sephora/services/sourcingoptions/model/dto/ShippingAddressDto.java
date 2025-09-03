package com.sephora.services.sourcingoptions.model.dto;

import com.sephora.platform.common.validation.Enum;
import com.sephora.services.sourcingoptions.model.CountryEnum;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

import static com.sephora.services.sourcingoptions.validation.ValidationConstants.COUNTRY_ALLOWED_VALUES;

/**
 * @author Vitaliy Oleksiyenko
 */
@ApiModel(value = "ShippingAddress")
public class ShippingAddressDto implements Serializable {

    @ApiModelProperty(value = "${SourcingOptionsRequest.shippingAddress.state.value}")
    private String state;

    @ApiModelProperty(value = "${SourcingOptionsRequest.shippingAddress.zipCode.value}")
    private String zipCode;

    /*@ApiModelProperty(value = "${SourcingOptionsRequest.shippingAddress.country.value}", required = true,
            allowableValues = COUNTRY_ALLOWED_VALUES)*/
    //@Enum(enumClass = CountryEnum.class, required = true)
    //CountryValidation added as custom validation
    private String country;

    /**
     * @return the state
     */
    public String getState() {
        return state;
    }

    /**
     * @param state the state to set
     */
    public void setState(String state) {
        this.state = state;
    }

    /**
     * @return the zipCode
     */
    public String getZipCode() {
        return zipCode;
    }

    /**
     * @param zipCode the zipCode to set
     */
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    /**
     * @return the country
     */
    public String getCountry() {
        return country;
    }

    /**
     * @param country the country to set
     */
    public void setCountry(String country) {
        this.country = country;
    }

    @Override
    public String toString() {
        return "ShippingAddressDto{" +
                "state='" + state + '\'' +
                ", zipCode='" + zipCode + '\'' +
                ", country='" + country + '\'' +
                '}';
    }

    public static final class Builder {
        private String state;
        private String zipCode;
        private String country;

        private Builder() {
        }

        public static Builder aShippingAddressDto() {
            return new Builder();
        }

        public Builder withState(String state) {
            this.state = state;
            return this;
        }

        public Builder withZipCode(String zipCode) {
            this.zipCode = zipCode;
            return this;
        }

        public Builder withCountry(String country) {
            this.country = country;
            return this;
        }

        public ShippingAddressDto build() {
            ShippingAddressDto shippingAddressDto = new ShippingAddressDto();
            shippingAddressDto.setState(state);
            shippingAddressDto.setZipCode(zipCode);
            shippingAddressDto.setCountry(country);
            return shippingAddressDto;
        }
    }
}
