package com.sephora.services.confighub.config;

import java.util.concurrent.TimeUnit;

import com.sephora.services.confighub.client.ATGUtilConfigClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.platform.app.configuration.annotation.RunTimeConfiguration;

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
@ConfigurationProperties(prefix = "configserver.integration.atg")
@RunTimeConfiguration
public class ATGUtilClientConfig {

  @Autowired private ObjectMapper objectMapper;

  private String utilUrl;

  @Value("${connectionTimeout:3000}")
  private int connectionTimeout;

  @Value("${readTimeout:6000}")
  private int readTimeout;

  @Value("${digestAlgorithm:SHA-256}")
  private String digestAlgorithm;

  @Value("${apiTSFormat:EEE, d MMM yyyy HH:mm:ss 'UTC'}")
  private String apiTSFormat;

  private boolean atgEnabled;

  private boolean migratedConfigEnabled;

  private String deviceId;

  private String saat;

  private boolean isATGdependent;

  @Bean
  @RefreshScope
  public ATGUtilConfigClient atgUtilConfigClient() {
    Request.Options options =
        new Request.Options(
            connectionTimeout, TimeUnit.MILLISECONDS, readTimeout, TimeUnit.MILLISECONDS, true);
    return Feign.builder()
        .retryer(new Retryer.Default(100L, TimeUnit.SECONDS.toMillis(3L), 3))
        .client(new ApacheHttpClient())
        .encoder(new JacksonEncoder(objectMapper))
        .decoder(new JacksonDecoder(objectMapper))
        .logger(new Slf4jLogger())
        .logLevel(Logger.Level.FULL)
        .options(options)
        .target(ATGUtilConfigClient.class, utilUrl);
  }
}
