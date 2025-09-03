package com.sephora.services.confighub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.metrics.cache.CacheMetricsAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.loadbalancer.config.LoadBalancerCacheAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.client.RestTemplate;


@EnableAutoConfiguration(exclude = { SimpleDiscoveryClientAutoConfiguration.class,
		  RedisAutoConfiguration.class, RedisRepositoriesAutoConfiguration.class,
		  CacheMetricsAutoConfiguration.class,
		  LoadBalancerCacheAutoConfiguration.class })

 
@SpringBootApplication(scanBasePackages = {
        "com.sephora.platform",
        "com.sephora.services.confighub"
}, exclude = {
        SimpleDiscoveryClientAutoConfiguration.class
    })


@EnableDiscoveryClient
@EntityScan(basePackages = "com.sephora.services.confighub.entity")
@EnableJpaRepositories(basePackages = {"com.sephora.services.confighub.repository"})
@EnableAsync
@EnableConfigServer
@EnableCaching
public class ConfighubApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConfighubApplication.class, args);
    }

    
     @Bean
     public RestTemplate restTemplate() { return new RestTemplate(); }

}
