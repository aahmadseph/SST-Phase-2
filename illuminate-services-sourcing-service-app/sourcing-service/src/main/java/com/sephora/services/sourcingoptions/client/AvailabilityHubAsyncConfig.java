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

package com.sephora.services.sourcingoptions.client;


import com.sephora.platform.logging.LoggingTaskDecorator;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.ThreadPoolExecutor;

@EnableAsync
@Configuration("availabilityHubAsyncConfig")
@ConfigurationProperties(prefix = "availabilityhub.client.async")
@Log4j2
public class AvailabilityHubAsyncConfig {

    public static final String THREAD_POOL = "availabilityHubReservationThreadPoolTaskExecutor";

    private static final String THREAD_NUMBER_SEPARATOR = "-";

    @Value("${corePoolSize:10}")
    private int corePoolSize;

    @Value("${maxPoolSize:20}")
    private int maxPoolSize;

    @Value("${queueCapacity:0}")
    private int queueCapacity;

    @Value("${keepAlive:180}")
    private int keepAlive;

    @Value("${threadNamePrefix:" + THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}")
    private String threadNamePrefix;

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

    public int getCorePoolSize() {
        return corePoolSize;
    }

    public int getMaxPoolSize() {
        return maxPoolSize;
    }

    public int getQueueCapacity() {
        return queueCapacity;
    }

    public String getThreadNamePrefix() {
        return threadNamePrefix;
    }

    public void setCorePoolSize(int corePoolSize) {
        this.corePoolSize = corePoolSize;
    }

    public void setMaxPoolSize(int maxPoolSize) {
        this.maxPoolSize = maxPoolSize;
    }

    public void setQueueCapacity(int queueCapacity) {
        this.queueCapacity = queueCapacity;
    }

    public void setThreadNamePrefix(String threadNamePrefix) {
        this.threadNamePrefix = threadNamePrefix;
    }
}
