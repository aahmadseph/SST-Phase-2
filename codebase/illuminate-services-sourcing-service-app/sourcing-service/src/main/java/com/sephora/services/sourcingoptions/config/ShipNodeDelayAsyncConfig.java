package com.sephora.services.sourcingoptions.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import com.sephora.platform.logging.LoggingTaskDecorator;

import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@ConfigurationProperties(prefix="shipnodedelay.async")
public class ShipNodeDelayAsyncConfig {

    public static final String SHIPNODE_DELAY_TASK_EXECUTOR ="shipNodeDelayTaskExecutor";

    @Value("${corePoolSize:5}")
    private int corePoolSize;

    @Value("${maxPoolSize:5}")
    private int maxPoolSize;

    @Value("${queueCapacity:100}")
    private int queueCapacity;

    @Value("${keepAlive:180}")
    private int keepAlive;

    @Value("${threadNamePrefix:shipment-async}")
    private String threadNamePrefix;

    @Bean(SHIPNODE_DELAY_TASK_EXECUTOR)
    public AsyncTaskExecutor shipmentFeignAsyncTaskExecutor(){
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setThreadNamePrefix(threadNamePrefix);
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setKeepAliveSeconds(keepAlive);
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        //TODO reference from sephora
        executor.setTaskDecorator(new LoggingTaskDecorator());
        executor.afterPropertiesSet();
        return executor;
    }
}
