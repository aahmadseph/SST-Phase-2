package com.sephora.services.sourcingoptions.config;


import javax.servlet.MultipartConfigElement;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

import com.sephora.platform.app.configuration.annotation.RequiresContextRefreshOnUpdate;
import com.sephora.platform.app.configuration.annotation.RunTimeConfiguration;

import lombok.Setter;

@Configuration
@RunTimeConfiguration
@ConfigurationProperties(prefix = "sourcing.options.file-upload")
@Setter
public class FileUploadConfiguration {

    @Value("${maxUploadFileSize:75MB}")
    private String maxUploadFileSize;

    @Bean
    @RefreshScope
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(DataSize.parse(getMaxUploadFileSize()));
        factory.setMaxRequestSize(DataSize.parse(getMaxUploadFileSize()));
        return factory.createMultipartConfig();
    }
    
    @RequiresContextRefreshOnUpdate
    public String getMaxUploadFileSize() {
        return maxUploadFileSize;
    }
}