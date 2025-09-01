package com.sephora.services.product.utils;

import lombok.experimental.UtilityClass;
import org.slf4j.MDC;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.task.TaskExecutionProperties;
import org.springframework.boot.autoconfigure.task.TaskSchedulingProperties;
import org.springframework.boot.task.ThreadPoolTaskExecutorBuilder;
import org.springframework.boot.task.ThreadPoolTaskExecutorCustomizer;
import org.springframework.boot.task.ThreadPoolTaskSchedulerBuilder;
import org.springframework.boot.task.ThreadPoolTaskSchedulerCustomizer;
import org.springframework.core.task.TaskDecorator;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.Map;
import java.util.concurrent.ThreadPoolExecutor;

@UtilityClass
public class AsyncUtils {

    public static ThreadPoolTaskExecutorBuilder taskExecutorBuilder(TaskExecutionProperties properties,
                                                                    ObjectProvider<ThreadPoolTaskExecutorCustomizer> threadPoolTaskExecutorCustomizers,
                                                                    ObjectProvider<TaskDecorator> taskDecorator) {
        TaskExecutionProperties.Pool pool = properties.getPool();
        ThreadPoolTaskExecutorBuilder builder = new ThreadPoolTaskExecutorBuilder();
        builder = builder.queueCapacity(pool.getQueueCapacity());
        builder = builder.corePoolSize(pool.getCoreSize());
        builder = builder.maxPoolSize(pool.getMaxSize());
        builder = builder.allowCoreThreadTimeOut(pool.isAllowCoreThreadTimeout());
        builder = builder.keepAlive(pool.getKeepAlive());
        builder = builder.acceptTasksAfterContextClose(pool.getShutdown().isAcceptTasksAfterContextClose());
        TaskExecutionProperties.Shutdown shutdown = properties.getShutdown();
        builder = builder.awaitTermination(shutdown.isAwaitTermination());
        builder = builder.awaitTerminationPeriod(shutdown.getAwaitTerminationPeriod());
        builder = builder.threadNamePrefix(properties.getThreadNamePrefix());
        builder = builder.customizers(threadPoolTaskExecutorCustomizers.orderedStream()::iterator);
        builder = builder.taskDecorator(taskDecorator.getIfUnique());
        return builder;
    }

    public static void initializeThreadPoolExecutor(ThreadPoolTaskExecutor threadPoolTaskExecutor) {
        threadPoolTaskExecutor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        threadPoolTaskExecutor.initialize();
    }

    public static Runnable mdcAwareRunnable(Runnable runnable) {
        Map<String, String> callerContextCopy = MDC.getCopyOfContextMap();
        return () -> {
            Map<String, String> executorContextCopy = null;

            try {
                executorContextCopy = MDC.getCopyOfContextMap();
                MDC.clear();
                if (callerContextCopy != null) {
                    MDC.setContextMap(callerContextCopy);
                }

                runnable.run();
            } finally {
                MDC.clear();
                if (executorContextCopy != null) {
                    MDC.setContextMap(executorContextCopy);
                }
            }
        };
    }

    public static ThreadPoolTaskSchedulerBuilder threadPoolTaskSchedulerBuilder(TaskSchedulingProperties properties,
                                                                  ObjectProvider<ThreadPoolTaskSchedulerCustomizer> threadPoolTaskSchedulerCustomizers) {
        TaskSchedulingProperties.Shutdown shutdown = properties.getShutdown();
        ThreadPoolTaskSchedulerBuilder builder = new ThreadPoolTaskSchedulerBuilder();
        builder = builder.poolSize(properties.getPool().getSize());
        builder = builder.awaitTermination(shutdown.isAwaitTermination());
        builder = builder.awaitTerminationPeriod(shutdown.getAwaitTerminationPeriod());
        builder = builder.threadNamePrefix(properties.getThreadNamePrefix());
        builder = builder.customizers(threadPoolTaskSchedulerCustomizers);
        return builder;
    }

}
