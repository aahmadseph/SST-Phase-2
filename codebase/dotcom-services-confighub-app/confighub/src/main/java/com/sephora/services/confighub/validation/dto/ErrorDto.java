package com.sephora.services.confighub.validation.dto;
import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Schema(name = "Error")
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
@Getter
@Setter
@ToString
public class ErrorDto {

    @Schema(description = "Error Code")
    private String code;

    @Schema(description = "Error Message")
    private String error;

    @Schema(description = "Related field")
    private String field;
}
