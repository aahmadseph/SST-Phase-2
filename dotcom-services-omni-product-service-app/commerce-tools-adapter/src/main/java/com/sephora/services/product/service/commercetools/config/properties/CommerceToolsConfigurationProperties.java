package com.sephora.services.product.service.commercetools.config.properties;

import com.commercetools.api.defaultconfig.ServiceRegion;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.task.TaskExecutionProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@ConfigurationProperties(prefix = "sephora.commercetools")
@Getter
@Setter
public class CommerceToolsConfigurationProperties {
    private String projectKey;
    private String clientId;
    private String clientSecret;
    private String authUrl;
    private String apiUrl;
    private String scopes;
    private Duration connectionTimeout;
    private Duration readTimeout;
    private Duration writeTimeout;
    private int maxRequests;
    private int threadCount;
    private Duration waitTimeout;
    private String region = ServiceRegion.GCP_US_CENTRAL1.name();
    private boolean enableGzip = false;
    private TaskExecutionProperties executor = new TaskExecutionProperties();
    private int maxRetries = 3;

}
