/*
 * This software is the confidential and proprietary information of
 * sephora.com and may not be used, reproduced, modified, distributed,
 * publicly displayed or otherwise disclosed without the express written
 * consent of sephora.com.
 *
 * This software is a work of authorship by sephora.com and protected by
 * the copyright laws of the United States and foreign jurisdictions.
 *
 * Copyright 2019 sephora.com, Inc. All rights reserved.
 */

package com.sephora.services.inventoryavailability.config.redis;


import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import com.sephora.platform.logging.LoggingTaskDecorator;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

//@ConditionalOnProperty(prefix = "yantriks", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableAsync
@Configuration("redisCacheAsyncConfig")
@ConfigurationProperties(prefix = "inventory")
@Log4j2
@Getter
@Setter
public class GetAvailabilityForSitePagesAsyncConfig {

    public static final String THREAD_POOL = "GetAvailabilityFSPThreadPoolTaskExecutor";
    public static final String THREAD_POOL_V2 = "GetAvailabilityFSPThreadPoolTaskExecutorV2";
    public static final String INTRANSIT_THREAD_POOL = "IntransitAvailabilityThreadPoolTaskExecutor";

    private static final String THREAD_NUMBER_SEPARATOR = "-";

    @Value("${sitePageAvailability.async.corePoolSize:10}")
    private int corePoolSize;

    @Value("${sitePageAvailability.async.maxPoolSize:20}")
    private int maxPoolSize;

    @Value("${sitePageAvailability.async.queueCapacity:10}")
    private int queueCapacity;

    @Value("${sitePageAvailability.async.keepAlive:180}")
    private int keepAlive;

    @Value("${sitePageAvailability.async.threadNamePrefix:" + THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}")
    private String threadNamePrefix;

    //V2 thread pool config - Start
    @Value("${sitePageAvailability.v2.async.corePoolSize:10}")
    private int corePoolSizeV2;

    @Value("${sitePageAvailability.v2.async.maxPoolSize:20}")
    private int maxPoolSizeV2;

    @Value("${sitePageAvailability.v2.async.queueCapacity:10}")
    private int queueCapacityV2;

    @Value("${sitePageAvailability.v2.async.keepAlive:180}")
    private int keepAliveV2;

    @Value("${sitePageAvailability.v2.async.threadNamePrefix:" + THREAD_POOL_V2 + THREAD_NUMBER_SEPARATOR +"}")
    private String threadNamePrefixV2;
    //V2 thread pool config - End
    
    //Availabilit hub config
    public static final String AH_THREAD_POOL = "AHGetAvailabilityFSPThreadPoolTaskExecutor";
    
    @Value("${sitePageAvailability.availabilityhub.async.corePoolSize:10}")
    private int ahCorePoolSize;

    @Value("${sitePageAvailability.availabilityhub.async.maxPoolSize:20}")
    private int ahMaxPoolSize;

    @Value("${sitePageAvailability.availabilityhub.async.queueCapacity:10}")
    private int ahQueueCapacity;

    @Value("${sitePageAvailability.availabilityhub.async.keepAlive:180}")
    private int ahKeepAlive;

    @Value("${sitePageAvailability.availabilityhub.async.threadNamePrefix:" + AH_THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}")
    private String ahThreadNamePrefix;
    //End Availability hub config

    //V2 Availability hub config
    public static final String V2_AH_THREAD_POOL = "V2AHGetAvailabilityFSPThreadPoolTaskExecutor";

    @Value("${sitePageAvailability.v2Availabilityhub.async.corePoolSize:10}")
    private int ahCorePoolSizeV2;

    @Value("${sitePageAvailability.v2Availabilityhub.async.maxPoolSize:20}")
    private int ahMaxPoolSizeV2;

    @Value("${sitePageAvailability.v2Availabilityhub.async.queueCapacity:10}")
    private int ahQueueCapacityV2;

    @Value("${sitePageAvailability.v2Availabilityhub.async.keepAlive:180}")
    private int ahKeepAliveV2;

    @Value("${sitePageAvailability.v2Availabilityhub.async.threadNamePrefix:" + V2_AH_THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}")
    private String ahThreadNamePrefixV2;
    //End Availability hub config

    //Cache async config
    public static final String CACHE_THREAD_POOL = "CacheGetAvailabilityFSPThreadPoolTaskExecutor";
    @Value("${sitePageAvailability.cacheAavailability.async.corePoolSize:10}")
    private int cacheCorePoolSize;

    @Value("${sitePageAvailability.cacheAavailability.async.maxPoolSize:20}")
    private int cacheMaxPoolSize;

    @Value("${sitePageAvailability.cacheAavailability.async.queueCapacity:10}")
    private int cacheQueueCapacity;

    @Value("${sitePageAvailability.cacheAavailability.async.keepAlive:180}")
    private int cacheKeepAlive;

    @Value("${sitePageAvailability.cacheAavailability.async.threadNamePrefix:" + CACHE_THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}")
    private String cacheThreadNamePrefix;
    //End Cache async config

    //V2 Cache async config
    public static final String V2_CACHE_THREAD_POOL = "V2CacheGetAvailabilityFSPThreadPoolTaskExecutor";
    @Value("${sitePageAvailability.v2cacheAvailability.async.corePoolSize:10}")
    private int v2cacheCorePoolSize;

    @Value("${sitePageAvailability.v2cacheAvailability.async.maxPoolSize:20}")
    private int v2cacheMaxPoolSize;

    @Value("${sitePageAvailability.v2cacheAvailability.async.queueCapacity:10}")
    private int v2cacheQueueCapacity;

    @Value("${sitePageAvailability.v2cacheAvailability.async.keepAlive:180}")
    private int v2cacheKeepAlive;

    @Value("${sitePageAvailability.v2cacheAvailability.async.threadNamePrefix:" + V2_CACHE_THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}")
    private String v2cacheThreadNamePrefix;
    //End Cache async config

    @Bean(THREAD_POOL)
    @RefreshScope
    public AsyncTaskExecutor threadPoolTaskExecutor() {
    	log.info("corePoolSize :{},maxPoolSize:{},queueCapacity:{},threadNamePrefix:{},keepAlive:{}",corePoolSize,maxPoolSize,queueCapacity,threadNamePrefix,keepAlive);
    	ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setThreadNamePrefix(threadNamePrefix);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setKeepAliveSeconds(keepAlive);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setTaskDecorator(new LoggingTaskDecorator());
        executor.afterPropertiesSet();

        return executor;
    }

    @Bean(THREAD_POOL_V2)
    @RefreshScope
    public AsyncTaskExecutor threadPoolTaskExecutorV2() {
        log.info("corePoolSize :{},maxPoolSize:{},queueCapacity:{},threadNamePrefix:{},keepAlive:{}",corePoolSizeV2,maxPoolSizeV2,queueCapacityV2,threadNamePrefixV2,keepAliveV2);
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSizeV2);
        executor.setMaxPoolSize(maxPoolSizeV2);
        executor.setQueueCapacity(queueCapacityV2);
        executor.setThreadNamePrefix(threadNamePrefixV2);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setKeepAliveSeconds(keepAliveV2);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setTaskDecorator(new LoggingTaskDecorator());
        executor.afterPropertiesSet();

        return executor;
    }

    @Bean(AH_THREAD_POOL)
    @RefreshScope
    public AsyncTaskExecutor ahThreadPoolTaskExecutor() {
    	log.info("corePoolSize :{},maxPoolSize:{},queueCapacity:{},threadNamePrefix:{},keepAlive:{}",ahCorePoolSize,ahMaxPoolSize,ahQueueCapacity,ahThreadNamePrefix,ahKeepAlive);
    	ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(ahCorePoolSize);
        executor.setMaxPoolSize(ahMaxPoolSize);
        executor.setQueueCapacity(ahQueueCapacity);
        executor.setThreadNamePrefix(ahThreadNamePrefix);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setKeepAliveSeconds(ahKeepAlive);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setTaskDecorator(new LoggingTaskDecorator());
        executor.afterPropertiesSet();

        return executor;
    }

    @Bean(V2_AH_THREAD_POOL)
    @RefreshScope
    public AsyncTaskExecutor ahThreadPoolTaskExecutorV2() {
        log.info("corePoolSize :{},maxPoolSize:{},queueCapacity:{},threadNamePrefix:{},keepAlive:{}",ahCorePoolSizeV2,ahMaxPoolSizeV2,ahQueueCapacityV2,ahThreadNamePrefixV2,ahKeepAliveV2);
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(ahCorePoolSizeV2);
        executor.setMaxPoolSize(ahMaxPoolSizeV2);
        executor.setQueueCapacity(ahQueueCapacityV2);
        executor.setThreadNamePrefix(ahThreadNamePrefixV2);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setKeepAliveSeconds(ahKeepAliveV2);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setTaskDecorator(new LoggingTaskDecorator());
        executor.afterPropertiesSet();

        return executor;
    }

    @Bean(V2_CACHE_THREAD_POOL)
    @RefreshScope
    public AsyncTaskExecutor v2cacheThreadPoolTaskExecutor() {
        log.info("corePoolSize :{},maxPoolSize:{},queueCapacity:{},threadNamePrefix:{},keepAlive:{}",v2cacheCorePoolSize,v2cacheMaxPoolSize,v2cacheQueueCapacity,v2cacheThreadNamePrefix,v2cacheKeepAlive);
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(v2cacheCorePoolSize);
        executor.setMaxPoolSize(v2cacheMaxPoolSize);
        executor.setQueueCapacity(v2cacheQueueCapacity);
        executor.setThreadNamePrefix(v2cacheThreadNamePrefix);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setKeepAliveSeconds(v2cacheKeepAlive);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setTaskDecorator(new LoggingTaskDecorator());
        executor.afterPropertiesSet();

        return executor;
    }

    @Bean(CACHE_THREAD_POOL)
    @RefreshScope
    public AsyncTaskExecutor cacheThreadPoolTaskExecutor() {
    	log.info("corePoolSize :{},maxPoolSize:{},queueCapacity:{},threadNamePrefix:{},keepAlive:{}",cacheCorePoolSize,cacheMaxPoolSize,cacheQueueCapacity,cacheThreadNamePrefix,cacheKeepAlive);
    	ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(cacheCorePoolSize);
        executor.setMaxPoolSize(cacheMaxPoolSize);
        executor.setQueueCapacity(cacheQueueCapacity);
        executor.setThreadNamePrefix(cacheThreadNamePrefix);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setKeepAliveSeconds(cacheKeepAlive);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setTaskDecorator(new LoggingTaskDecorator());
        executor.afterPropertiesSet();

        return executor;
    }  

    @Bean(INTRANSIT_THREAD_POOL)
    @RefreshScope
    public AsyncTaskExecutor inTransitThreadPoolTaskExecutor(
            @Value("${sitePageAvailability.inTransitAvailability.async.corePoolSize:10}") int inTransitCorePoolSize,
            @Value("${sitePageAvailability.inTransitAvailability.async.maxPoolSize:20}") int inTransitMaxPoolSize,
            @Value("${sitePageAvailability.inTransitAvailability.async.queueCapacity:10}") int inTransitQueueCapacity,
            @Value("${sitePageAvailability.inTransitAvailability.async.keepAlive:180}") int inTransitKeepAlive,
            @Value("${sitePageAvailability.inTransitAvailability.async.threadNamePrefix:" + INTRANSIT_THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}") String inTransitThreadNamePrefix) {
        log.info("InTransit thread pool config - corePoolSize :{}, maxPoolSize:{}, queueCapacity:{}, threadNamePrefix:{}, keepAlive:{}",  inTransitCorePoolSize, inTransitMaxPoolSize, inTransitQueueCapacity, inTransitThreadNamePrefix, inTransitKeepAlive);
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(inTransitCorePoolSize);
        executor.setMaxPoolSize(inTransitMaxPoolSize);
        executor.setQueueCapacity(inTransitQueueCapacity);
        executor.setThreadNamePrefix(inTransitThreadNamePrefix);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setKeepAliveSeconds(inTransitKeepAlive);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setTaskDecorator(new LoggingTaskDecorator());
        executor.afterPropertiesSet();

        return executor;
    }
}
