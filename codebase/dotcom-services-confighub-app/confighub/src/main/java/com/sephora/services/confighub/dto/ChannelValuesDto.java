package com.sephora.services.confighub.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Schema(name = "ChannelValuesDto")
@AllArgsConstructor
@NoArgsConstructor
public class ChannelValuesDto {

    @Schema(description = "base")
    private String base;
    
    @Schema(description = "iphoneApp")
    private String iphoneApp;
    
    @Schema(description = "androidApp")
    private String androidApp;
    
    @Schema(description = "web")
    private String web;
    
    @Schema(description = "rwd")
    private String rwd;

    @Schema(description = "mobileWeb")
    private String mobileWeb;


}
