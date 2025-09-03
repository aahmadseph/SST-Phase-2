package com.sephora.services.confighub.dto;

import javax.validation.constraints.NotBlank;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(name = "UpdatePropertyValuesDto")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class UpdatePropertyValuesDto {
	
    @Schema(description = "User Id", required = true)
    @NotBlank
    private String user;
    
    @Schema(description = "Group Id", required = true)
    private String groupId;
    
    @Schema(description = "Property Key", required = true) 
    private String propKey;
    
    @Schema(description = "Property Description", required = true)
    private String description;

    @Schema(description = "Property Value")
    private String propValue;
   
    @Schema(description = "Property Value")
    private ChannelValuesDto propChannelValues;

    @Schema(description = "Ui Consume", required = true)
    private String uiConsume;
}
