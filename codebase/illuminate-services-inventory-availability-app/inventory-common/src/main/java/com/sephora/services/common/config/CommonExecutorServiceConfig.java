package com.sephora.services.common.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.CustomizableThreadFactory;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Configuration
@ConditionalOnMissingBean(ExecutorService.class)
public class CommonExecutorServiceConfig
{
    @Bean
    public ExecutorService threadPoolTaskExecutorService() {

        ExecutorService executorService =
                new ThreadPoolExecutor(10, 50,
                        180, TimeUnit.SECONDS,
                        new SynchronousQueue<>(),
                        new CustomizableThreadFactory("commonExecutorService"));

        return executorService;
    }
}
