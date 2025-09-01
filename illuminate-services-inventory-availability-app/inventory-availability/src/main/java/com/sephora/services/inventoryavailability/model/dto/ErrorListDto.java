package com.sephora.services.inventoryavailability.model.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * @author Vitaliy Oleksiyenko
 */
@ApiModel(value = "Errors")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorListDto {

    @ApiModelProperty(value = "${Errors.errors}")
    private List<ErrorDto> errors;

    /**
     * @return the errors
     */
    public List<ErrorDto> getErrors() {
        return errors;
    }

    /**
     * @param errors the errors to set
     */
    public void setErrors(List<ErrorDto> errors) {
        this.errors = errors;
    }

    public static final class Builder {

        List<ErrorDto> errors = new ArrayList<>();

        private Builder() {
        }

        public static Builder anErrorListDto() {
            return new Builder();
        }

        public Builder withError(String errorCode, String errorMessage) {
            ErrorDto errorDto = new ErrorDto();
            errorDto.setErrorMessage(errorMessage);
            errorDto.setErrorCode(errorCode);
            errors.add(errorDto);
            return this;
        }

        public Builder withError(ErrorDto error) {
            errors.add(error);

            return this;
        }

        public Builder withErrorCode(String errorCode) {
            ErrorDto errorDto = new ErrorDto();
            errorDto.setErrorCode(errorCode);
            errors.add(errorDto);
            return this;
        }

        public Builder withErrorMessage(String errorMessage) {
            ErrorDto errorDto = new ErrorDto();
            errorDto.setErrorMessage(errorMessage);
            errors.add(errorDto);
            return this;
        }

        public ErrorListDto build() {
            ErrorListDto errorListDto = new ErrorListDto();
            errorListDto.setErrors(errors);
            return errorListDto;
        }
    }
}
