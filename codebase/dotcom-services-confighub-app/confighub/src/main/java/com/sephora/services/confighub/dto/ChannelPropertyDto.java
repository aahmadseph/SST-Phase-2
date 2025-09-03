package com.sephora.services.confighub.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Schema(name = "ChannelPropertyDto")
@NoArgsConstructor
@AllArgsConstructor
public class ChannelPropertyDto {

    @Schema(description = "User Id", required = true)
    @NotBlank
    private String user;

    @Schema(description = "List of configuration properties", required = true)
    @NotEmpty
    private List<PropertyValuesDto> properties;
}
