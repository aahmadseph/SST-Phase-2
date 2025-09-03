package com.sephora.services.sourcingoptions.client;

import feign.Logger;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
@ConfigurationProperties(prefix = "feign.logger")
@Data
public class FeignLoggerConfiguration {

    private String level = "BASIC";

    @Bean
    public Logger.Level feignLoggerLevel(){
        if(StringUtils.isEmpty(level)){
            return Logger.Level.NONE;
        }else{
            return Logger.Level.valueOf(level);
        }
    }
}
