package com.sephora.services.confighub.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.FieldNameConstants;
import org.springframework.http.HttpStatus;

import java.util.Arrays;
import java.util.List;

@Schema(name = "Error")
@Builder
@FieldNameConstants
@Data
@AllArgsConstructor
@Getter
@Setter
public class ErrorResponseDto {

    private HttpStatus status;
    private String message;
    private List<String> errors;


    public ErrorResponseDto(HttpStatus status, String message, String error) {
        super();
        this.status = status;
        this.message = message;
        errors = Arrays.asList(error);
    }
}
