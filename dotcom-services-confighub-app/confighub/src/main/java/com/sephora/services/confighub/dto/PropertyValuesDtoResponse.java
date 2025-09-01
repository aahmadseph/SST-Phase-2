package com.sephora.services.confighub.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Schema(name = "PropertyValuesDtoResponse")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PropertyValuesDtoResponse {

    @Schema(description = "Group Id", required = true)
    private String groupId; 
    
    @Schema(description = "Property Key", required = true) 
    private String propKey;
    
    @Schema(description = "Property Description", required = true)
    private String description;

    @Schema(description = "Property Value")
    private Object propChannelValues;

    @Schema(description = "Property Value")
    private String propValue;

    @Schema(description = "Config Id", required = true)
    private Long configId;

    @Schema(description = "User", required = true)
    private String user;

    @Schema(description = "Ui Consume", required = true)
    private String uiConsume;

    @Schema(description = "Modified Date", required = true)
    private LocalDateTime modifiedDate;
}
