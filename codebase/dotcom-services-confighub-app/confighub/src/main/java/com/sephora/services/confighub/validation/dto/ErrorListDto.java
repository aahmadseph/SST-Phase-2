package com.sephora.services.confighub.validation.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;


@Schema(name = "Errors")
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
@Getter
@Setter
@ToString
public class ErrorListDto {

    @Schema(description = "Correlation Id")
    private String correlationId;

    @Schema(description = "Errors list")
    private List<ErrorDto> errors;

    public static class ErrorListDtoBuilder {

        public ErrorListDtoBuilder addError(ErrorDto error) {
            if (this.errors == null) {
                this.errors = new ArrayList<>();
            }

            this.errors.add(error);

            return this;
        }
    }
}
