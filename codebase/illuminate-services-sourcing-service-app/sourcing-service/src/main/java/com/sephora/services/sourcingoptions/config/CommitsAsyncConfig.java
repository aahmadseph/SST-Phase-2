package com.sephora.services.sourcingoptions.config;

import com.sephora.platform.logging.LoggingTaskDecorator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@ConfigurationProperties(prefix="commits.async")
public class CommitsAsyncConfig {

    public static final String COMMITS_THREAD_POOL = "commitsTaskExecutor";

    private static final String THREAD_NUMBER_SEPARATOR = "-";

    @Value("${corePoolSize:20}")
    private int corePoolSize;

    @Value("${maxPoolSize:20}")
    private int maxPoolSize;

    @Value("${queueCapacity:100}")
    private int queueCapacity;

    @Value("${threadNamePrefix:" + COMMITS_THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}")
    private String threadNamePrefix;

    @Value("${keepAlive:180}")
    private int keepAlive;

    @Bean(COMMITS_THREAD_POOL)
    public Executor commitsThreadPoolTaskExecutor() {
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
}
