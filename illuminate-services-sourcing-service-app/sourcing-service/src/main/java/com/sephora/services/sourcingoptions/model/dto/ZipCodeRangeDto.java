package com.sephora.services.sourcingoptions.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sephora.services.sourcingoptions.validation.ValidZipCode;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotEmpty;

import static com.sephora.services.sourcingoptions.validation.ValidationConstants.FROM_ZIP_CODE_MAX_LENGTH;
import static com.sephora.services.sourcingoptions.validation.ValidationConstants.TO_ZIP_CODE_MAX_LENGTH;

@JsonInclude(JsonInclude.Include.NON_NULL)
@ApiModel(value = "ZipCodeRange")
@ValidZipCode
public class ZipCodeRangeDto {

    @ApiModelProperty(value = "${ZoneMap.fromZipCode.value}", required = true, position = 1)
    @NotEmpty
    @Length(max = FROM_ZIP_CODE_MAX_LENGTH)
    private String fromZipCode;

    @ApiModelProperty(value = "${ZoneMap.toZipCode.value}", required = true, position = 2)
    @NotEmpty
    @Length(max = TO_ZIP_CODE_MAX_LENGTH)
    private String toZipCode;

    public String getFromZipCode() {
        return fromZipCode;
    }

    public void setFromZipCode(String fromZipCode) {
        this.fromZipCode = fromZipCode;
    }

    public String getToZipCode() {
        return toZipCode;
    }

    public void setToZipCode(String toZipCode) {
        this.toZipCode = toZipCode;
    }

    @Override
    public String toString() {
        return "ZipCodeRangeDto{" +
               "fromZipCode='" + fromZipCode + '\'' +
               ", toZipCode='" + toZipCode + '\'' +
               '}';
    }

    public static final class ZipCodeRangeBuilder {

        private String fromZipCode;
        private String toZipCode;

        private ZipCodeRangeBuilder() {
        }

        public static ZipCodeRangeBuilder anZipCodeRangeDto() {
            return new ZipCodeRangeBuilder();
        }

        public ZipCodeRangeBuilder withFromZipCode(String fromZipCode) {
            this.fromZipCode = fromZipCode;
            return this;
        }

        public ZipCodeRangeBuilder withToZipCode(String toZipCode) {
            this.toZipCode = toZipCode;
            return this;
        }

        public ZipCodeRangeDto build() {
            ZipCodeRangeDto zipCodeRangeDto = new ZipCodeRangeDto();
            zipCodeRangeDto.setFromZipCode(fromZipCode);
            zipCodeRangeDto.setToZipCode(toZipCode);
            return zipCodeRangeDto;
        }
    }
}
