package com.sephora.services.sourcingoptions.client;

import com.sephora.services.sourcingoptions.client.decoder.AzureTableStorageClientDecoder;
import com.sephora.services.sourcingoptions.client.logger.FeignLogger;
import com.sephora.services.sourcingoptions.config.feign.AzureSasTokenInterceptor;
import feign.Feign;
import feign.Logger;
import feign.Request;
import feign.Retryer;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "azure.table")
@Log4j2
public class AzureTableStorageClientConfiguration {

    @Setter
    private String host;

    @Value("${azure.table.feign.retryPeriod:100}")
    private long retryPeriod;

    @Value("${azure.table.feign.maxRetryPeriod:500}")
    private long maxRetryPeriod;

    @Value("${azure.table.feign.maxRetryAttempts:2}")
    private int maxRetryAttempts;

    @Value("${azure.table.feign.connectionTimeout:5000}")
    private int connectionTimeout;

    @Value("${azure.table.feign.readTimeout:1000}")
    private int readTimeout;

    @Autowired
    private Logger.Level feignLoggerLevel;

    @Autowired
    @Qualifier("AzureTableStorageClientDecoder")
    private AzureTableStorageClientDecoder azureTableStorageClientDecoder;

    @Bean
    @RefreshScope
    public AzureTableClient azureTableStorageClient(AzureSasTokenInterceptor interceptor) {
        Request.Options options = new Request.Options(connectionTimeout, readTimeout);

        return Feign.builder()
                .client(new feign.httpclient.ApacheHttpClient(HttpClients.createDefault()))
                .options(options)
                .retryer(new Retryer.Default(retryPeriod, maxRetryPeriod, maxRetryAttempts))
                .requestInterceptor(interceptor)
                .logger(new FeignLogger())
                .logLevel(feignLoggerLevel)
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .errorDecoder(azureTableStorageClientDecoder)
                .target(AzureTableClient.class, host);
    }
}
