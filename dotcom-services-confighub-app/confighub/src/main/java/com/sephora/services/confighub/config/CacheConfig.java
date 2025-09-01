package com.sephora.services.confighub.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.RemovalCause;
import java.util.concurrent.TimeUnit;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** CaffeineCache configuration for Confighub */
@EnableCaching
@Configuration
@Slf4j
@ConfigurationProperties(prefix = "spring.cache")
public class CacheConfig {

  @Value("${expiryTimeout:14}")
  private int expiryTimeout;
  /**
   * Caffeine cache configuration
   *
   * @return
   */
  @Bean
  public Caffeine caffeineConfig() {
    return Caffeine.newBuilder()
        .expireAfterWrite(expiryTimeout, TimeUnit.DAYS) // Increased to 14 days before HSE 2024
        .evictionListener(
            (Object key, Object value, RemovalCause cause) ->
                log.info(String.format("Key %s was evicted (%s)%n", key, cause)));
  }

  /**
   * Cache manager configuration
   *
   * @param caffeine
   * @return
   */
  @Bean
  public CacheManager cacheManager(Caffeine caffeine) {
    CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager();
    caffeineCacheManager.getCache("atgConfigs");
    caffeineCacheManager.setCaffeine(caffeine);
    return caffeineCacheManager;
  }
}
