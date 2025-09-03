package com.sephora.services.confighub.config;

import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import com.sephora.platform.logging.LoggingTaskDecorator;

import lombok.extern.log4j.Log4j2;
@Log4j2
@Configuration
public class MigrationAsyncConfig {
	public static final String THREAD_POOL = "migrationExecutorService-";
	private static final String THREAD_NUMBER_SEPARATOR = "-";
	
	@Value("${configserver.migration.async.corePoolSize:10}")
    private int corePoolSize;

    @Value("${configserver.migration.async.maxPoolSize:20}")
    private int maxPoolSize;

    @Value("${configserver.migration.async.queueCapacity:10}")
    private int queueCapacity;

    @Value("${configserver.migration.async.keepAlive:180}")
    private int keepAlive;
    
    @Value("${configserver.migration.async.threadNamePrefix:" + THREAD_POOL + THREAD_NUMBER_SEPARATOR +"}")
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
    
}
