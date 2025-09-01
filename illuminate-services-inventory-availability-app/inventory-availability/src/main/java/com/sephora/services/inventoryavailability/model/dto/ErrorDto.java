package com.sephora.services.inventoryavailability.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @author Vitaliy Oleksiyenko
 */
@ApiModel(value = "Error")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorDto {

    @ApiModelProperty(value = "${Error.error.code}")
    private String errorCode;

    @ApiModelProperty(value = "${Error.error.message}")
    private String errorMessage;

    /**
     * @return the errorCode
     */
    public String getErrorCode() {
        return errorCode;
    }

    /**
     * @param errorCode the errorCode to set
     */
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    /**
     * @return the errorMessage
     */
    public String getErrorMessage() {
        return errorMessage;
    }

    /**
     * @param errorMessage the errorMessage to set
     */
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public static final class Builder {
        private String errorCode;
        private String errorMessage;

        private Builder() {
        }

        public static Builder anErrorDto() {
            return new Builder();
        }

        public Builder withErrorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        }

        public Builder withErrorCode(String errorCode) {
            this.errorCode = errorCode;
            return this;
        }

        public ErrorDto build() {
            ErrorDto errorDto = new ErrorDto();
            errorDto.setErrorCode(errorCode);
            errorDto.setErrorMessage(errorMessage);
            return errorDto;
        }
    }
}
