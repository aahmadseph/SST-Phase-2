package com.sephora.services.sourcingoptions.config.feign;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.platform.app.configuration.annotation.RequiresContextRefreshOnUpdate;
import com.sephora.platform.app.configuration.annotation.RunTimeConfiguration;
import com.sephora.services.sourcingoptions.client.InventoryServiceClient;
import com.sephora.services.sourcingoptions.client.logger.FeignLogger;
import feign.*;
import feign.httpclient.ApacheHttpClient;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "sourcing.options.feign.inventory")
@RunTimeConfiguration
public class InventoryServiceClientConfiguration {

    @Autowired
    private ObjectMapper mapper;

    private String serviceUrl;

    @Value("${connectionTimeout:3000}")
    private int connectionTimeout;

    @Value("${readTimeout:3000}")
    private int readTimeout;

    @Value("${defaultMaxPerRouteConnections:50}")
    private int defaultMaxPerRouteConnections;

    @Value("${maxTotalConnections:100}")
    private int maxTotalConnections;

    @Value("${retryPeriod:100}")
    private long retryPeriod;

    @Value("${retryMaxPeriod:500}")
    private long retryMaxPeriod;

    @Value("${retryMaxAttempts:3}")
    private int retryMaxAttempts;

    @Value("${inactivityTimeout:180000}")
    private int inactivityTimeout;

    @Autowired
    private Logger.Level feignLoggerLevel;

    @Bean
    @RefreshScope
    public InventoryServiceClient inventoryAvailabilityServiceClient() {
        Request.Options options = new Request.Options(connectionTimeout, readTimeout);

        return Feign.builder()
                .client(createApacheHttpClient())
                .retryer(createRetryer())
                .logger(new FeignLogger())
                .logLevel(feignLoggerLevel)
                .encoder(new JacksonEncoder(mapper))
                .decoder(new JacksonDecoder(mapper))
                .options(options)
                .target(InventoryServiceClient.class, serviceUrl);
    }

    private Retryer createRetryer() {
        return new Retryer.Default(retryPeriod, retryMaxPeriod, retryMaxAttempts);
    }

    private Client createApacheHttpClient() {
        PoolingHttpClientConnectionManager httpClientConnectionManager = new PoolingHttpClientConnectionManager();

        httpClientConnectionManager.setDefaultMaxPerRoute(defaultMaxPerRouteConnections);
        httpClientConnectionManager.setMaxTotal(maxTotalConnections);
        httpClientConnectionManager.setValidateAfterInactivity(inactivityTimeout);

        return new ApacheHttpClient(HttpClientBuilder.create()
                .setConnectionManager(httpClientConnectionManager)
                .build());
    }

    @RequiresContextRefreshOnUpdate
    public String getServiceUrl() {
        return serviceUrl;
    }

    public void setServiceUrl(String serviceUrl) {
        this.serviceUrl = serviceUrl;
    }

    @RequiresContextRefreshOnUpdate
    public int getConnectionTimeout() {
        return connectionTimeout;
    }

    public void setConnectionTimeout(int connectionTimeout) {
        this.connectionTimeout = connectionTimeout;
    }

    @RequiresContextRefreshOnUpdate
    public int getReadTimeout() {
        return readTimeout;
    }

    public void setReadTimeout(int readTimeout) {
        this.readTimeout = readTimeout;
    }

    @RequiresContextRefreshOnUpdate
    public int getDefaultMaxPerRouteConnections() {
        return defaultMaxPerRouteConnections;
    }

    public void setDefaultMaxPerRouteConnections(int defaultMaxPerRouteConnections) {
        this.defaultMaxPerRouteConnections = defaultMaxPerRouteConnections;
    }

    @RequiresContextRefreshOnUpdate
    public int getMaxTotalConnections() {
        return maxTotalConnections;
    }

    public void setMaxTotalConnections(int maxTotalConnections) {
        this.maxTotalConnections = maxTotalConnections;
    }

    @RequiresContextRefreshOnUpdate
    public long getRetryPeriod() {
        return retryPeriod;
    }

    public void setRetryPeriod(long retryPeriod) {
        this.retryPeriod = retryPeriod;
    }

    @RequiresContextRefreshOnUpdate
    public long getRetryMaxPeriod() {
        return retryMaxPeriod;
    }

    public void setRetryMaxPeriod(long retryMaxPeriod) {
        this.retryMaxPeriod = retryMaxPeriod;
    }

    @RequiresContextRefreshOnUpdate
    public int getRetryMaxAttempts() {
        return retryMaxAttempts;
    }

    public void setRetryMaxAttempts(int retryMaxAttempts) {
        this.retryMaxAttempts = retryMaxAttempts;
    }
}