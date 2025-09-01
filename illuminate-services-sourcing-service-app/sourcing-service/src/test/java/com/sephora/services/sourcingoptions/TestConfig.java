package com.sephora.services.sourcingoptions;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.platform.cache.CacheEvictionService;
import com.sephora.services.sourcingoptions.mapper.SourcingOptionsMapper;
import com.sephora.services.sourcingoptions.mapper.SourcingShipNodeMapper;
import com.sephora.services.sourcingoptions.mapper.ZoneMapMapper;
import com.sephora.services.sourcingoptions.service.impl.ZoneMapCsvUploadServiceImpl;
import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Scope;

import static com.sephora.platform.cache.impl.RemoteCacheEvictionService.REMOTE_CACHE_EVICTION_SERVICE;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

@Configuration("sourcingOptionsTestConfig")
public class TestConfig {

    @Bean
    @Scope("prototype")
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    @Scope("prototype")
    public CacheEvictionService testCacheEvictionService() {
        return spy(CacheEvictionService.class);
    }

    @Primary
    @Bean
    @Scope("prototype")
    public SourcingOptionsMapper testSourcingOptionsMapper() {
        return SourcingOptionsMapper.INSTANCE;
    }

    @Primary
    @Bean
    @Scope("prototype")
    public SourcingShipNodeMapper testShipNodeMapper() {
        return SourcingShipNodeMapper.INSTANCE;
    }

    @Primary
    @Bean
    @Scope("prototype")
    public ZoneMapMapper testZoneMapMapper() {
        return ZoneMapMapper.INSTANCE;
    }

    @Bean(REMOTE_CACHE_EVICTION_SERVICE)
    @Scope("prototype")
    public CacheEvictionService remoteCacheEvictionService(){
       return mock(CacheEvictionService.class);
    }
    
    @Bean
    @Scope("prototype")
    public ZoneMapCsvUploadServiceImpl zoneMapCsvUploadService() {
    	return new ZoneMapCsvUploadServiceImpl();
    }

    @Bean
    @Scope("prototype")
    public Logger.Level loggerLevel(){
        return Logger.Level.BASIC;
    }
}