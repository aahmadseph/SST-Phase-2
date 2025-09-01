package com.sephora.services.sourcingoptions.config;

import com.sephora.platform.app.configuration.annotation.RequiresContextRefreshOnUpdate;
import com.sephora.platform.app.configuration.annotation.RunTimeConfiguration;
import com.sephora.platform.logging.LoggingTaskDecorator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.*;

@ConditionalOnProperty(prefix = "sourcing.options.async", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableAsync
@Configuration
@ConfigurationProperties(prefix = "sourcing.options.async")
@RunTimeConfiguration
public class AsyncConfig {

    public static final String THREAD_POOL = "sourcingOptionsThreadPoolTaskExecutor";
    //public static final String COMMITS_THREAD_POOL = "soucingOptionssourcingHubTestTaskExecutor";

    private static final String THREAD_NUMBER_SEPARATOR = "-";

    @Value("${corePoolSize:20}")
    private int corePoolSize;

    @Value("${maxPoolSize:20}")
    private int maxPoolSize;

    @Value("${queueCapacity:100}")
    private int queueCapacity;

    @Value("${threadNamePrefix:" + THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}")
    private String threadNamePrefix;

    @Value("${keepAlive:180}")
    private int keepAlive;

    private Integer commitsThreadLimit = 500;

    @Bean(THREAD_POOL)
    @RefreshScope
    public Executor threadPoolTaskExecutor() {
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

    /**
     * @return the corePoolSize
     */
    @RequiresContextRefreshOnUpdate
    public int getCorePoolSize() {
        return corePoolSize;
    }

    /**
     * @param corePoolSize the corePoolSize to set
     */
    public void setCorePoolSize(int corePoolSize) {
        this.corePoolSize = corePoolSize;
    }

    /**
     * @return the maxPoolSize
     */
    @RequiresContextRefreshOnUpdate
    public int getMaxPoolSize() {
        return maxPoolSize;
    }

    /**
     * @param maxPoolSize the maxPoolSize to set
     */
    public void setMaxPoolSize(int maxPoolSize) {
        this.maxPoolSize = maxPoolSize;
    }

    /**
     * @return the queueCapacity
     */
    @RequiresContextRefreshOnUpdate
    public int getQueueCapacity() {
        return queueCapacity;
    }

    /**
     * @param queueCapacity the queueCapacity to set
     */
    public void setQueueCapacity(int queueCapacity) {
        this.queueCapacity = queueCapacity;
    }

    @RequiresContextRefreshOnUpdate
    public int getKeepAlive() {
        return keepAlive;
    }

    public void setKeepAlive(int keepAlive) {
        this.keepAlive = keepAlive;
    }

    public Integer getCommitsThreadLimit() {
        return commitsThreadLimit;
    }

    public void setCommitsThreadLimit(Integer commitsThreadLimit) {
        this.commitsThreadLimit = commitsThreadLimit;
    }
}
