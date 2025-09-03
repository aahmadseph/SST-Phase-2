package com.sephora.services.confighub.config;


import java.util.concurrent.TimeUnit;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.platform.app.configuration.annotation.RequiresContextRefreshOnUpdate;
import com.sephora.platform.app.configuration.annotation.RunTimeConfiguration;
import com.sephora.services.confighub.client.ConfighubServiceClient;

import feign.Client;
import feign.Feign;
import feign.Logger;
import feign.Request;
import feign.Retryer;
import feign.httpclient.ApacheHttpClient;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.slf4j.Slf4jLogger;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "configserver.integration.self")
@RunTimeConfiguration
public class ConfighubServiceClientConfig {

    private static final String CONNFIGHUB_HTTP_CLIENT = "confighubHttpClient";
    private static final String CONNFIGHUB_RETRYER = "confighubRetryer";

    @Autowired
    private ObjectMapper objectMapper;

    private String serviceUrl;


    @Getter(onMethod_ = {@RequiresContextRefreshOnUpdate})
    @Value("${connectionTimeout:20000}")
    private int connectionTimeout;

    @Getter(onMethod_ = {@RequiresContextRefreshOnUpdate})
    @Value("${readTimeout:60000}")
    private int readTimeout;

    @Getter(onMethod_ = {@RequiresContextRefreshOnUpdate})
    @Value("${defaultMaxPerRouteConnections:50}")
    private int defaultMaxPerRouteConnections;

    @Getter(onMethod_ = {@RequiresContextRefreshOnUpdate})
    @Value("${maxTotalConnections:100}")
    private int maxTotalConnections;

    @Getter(onMethod_ = {@RequiresContextRefreshOnUpdate})
    @Value("${closeIdleConnectionsTime:3000}")
    private int closeIdleConnectionsTime;

    @Getter(onMethod_ = {@RequiresContextRefreshOnUpdate})
    @Value("${validateAfterInactivityTime:60000}")
    private int validateAfterInactivityTime;

    @Getter(onMethod_ = {@RequiresContextRefreshOnUpdate})
    @Value("${keepAliveStrategyInSeconds:3}")
    private int keepAliveStrategyInSeconds;

    @Getter(onMethod_ = {@RequiresContextRefreshOnUpdate})
    @Value("${retryPeriod:1}")
    private long retryPeriod;

    @Getter(onMethod_ = {@RequiresContextRefreshOnUpdate})
    @Value("${retryMaxPeriod:100}")
    private long retryMaxPeriod;

    @Getter(onMethod_ = {@RequiresContextRefreshOnUpdate})
    @Value("${retryMaxAttempt:0}")
    private int retryMaxAttempt;

    @Bean
    @RefreshScope
    public ConfighubServiceClient confighubServiceClient() {
        Request.Options options = new Request.Options(connectionTimeout, TimeUnit.MILLISECONDS, readTimeout, TimeUnit.MILLISECONDS, true);
        return Feign.builder()
            .retryer(retryer())
            .client(createApacheHttpClient())
            .encoder(new JacksonEncoder(objectMapper))
            .decoder(new JacksonDecoder(objectMapper))
            .logger(new Slf4jLogger())
            .logLevel(Logger.Level.FULL)
            .options(options)
            .target(ConfighubServiceClient.class, serviceUrl);
    }

    @Bean(CONNFIGHUB_HTTP_CLIENT)
    @RefreshScope
    public Client createApacheHttpClient() {
        PoolingHttpClientConnectionManager httpClientConnectionManager = new PoolingHttpClientConnectionManager();
        httpClientConnectionManager.setDefaultMaxPerRoute(defaultMaxPerRouteConnections);
        httpClientConnectionManager.setMaxTotal(maxTotalConnections);
        httpClientConnectionManager.setValidateAfterInactivity(validateAfterInactivityTime);

        return new ApacheHttpClient(
            HttpClientBuilder.create()
                .setConnectionManager(httpClientConnectionManager)
                .disableCookieManagement()
                .build());
    }

    @Bean(CONNFIGHUB_RETRYER)
    @RefreshScope
    public Retryer retryer() {
        return new Retryer.Default(retryPeriod, retryMaxPeriod, retryMaxAttempt);
    }
    
}
