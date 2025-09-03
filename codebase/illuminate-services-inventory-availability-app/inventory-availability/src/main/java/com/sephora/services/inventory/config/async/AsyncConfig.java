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

package com.sephora.services.inventory.config.async;

import com.sephora.platform.app.configuration.annotation.RequiresContextRefreshOnUpdate;
import com.sephora.platform.app.configuration.annotation.RunTimeConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.CustomizableThreadFactory;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@ConditionalOnProperty(prefix = "inventory.async", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableAsync
@RunTimeConfiguration
@Configuration("inventoryAsyncConfig")
@ConfigurationProperties(prefix = "inventory.async")
public class AsyncConfig {

    public static final String THREAD_POOL = "inventoryExecutorService-";
    public static final String THREADPOOL_TASKEXECUTOR_SERVICE = "threadPoolTaskExecutorService";

    private static final String THREAD_NUMBER_SEPARATOR = "-";

    @Value("${corePoolSize:10}")
    private int corePoolSize;

    @Value("${maxPoolSize:100}")
    private int maxPoolSize;

    @Value("${queueCapacity:100}")
    private int queueCapacity;

    @Value("${keepAlive:180}")
    private long keepAlive;

    @Value("${threadNamePrefix:" + THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}")
    private String threadNamePrefix;

    @Bean(THREADPOOL_TASKEXECUTOR_SERVICE)
    @RefreshScope
    public ExecutorService threadPoolTaskExecutorService() {

        ExecutorService executorService =
                new ThreadPoolExecutor(corePoolSize, maxPoolSize,
                        keepAlive, TimeUnit.SECONDS,
                        new SynchronousQueue<>(),
                        new CustomizableThreadFactory(threadNamePrefix));

        return executorService;
    }

    @RequiresContextRefreshOnUpdate
    public int getCorePoolSize() {
        return corePoolSize;
    }

    @RequiresContextRefreshOnUpdate
    public int getMaxPoolSize() {
        return maxPoolSize;
    }

    @RequiresContextRefreshOnUpdate
    public int getQueueCapacity() {
        return queueCapacity;
    }

    @RequiresContextRefreshOnUpdate
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
