package com.sephora.services.confighub.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Configuration
@ConfigurationProperties(prefix = "test")
@Data
@Slf4j
public class TestConfig {

    private String value1;
    
    private String value2;
    
    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) {
        log.info("value1:{}", value1);
        log.info("value2:{}", value2);
    }
}
