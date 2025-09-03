package com.sephora.services.product.service.commercetools.config;


import com.commercetools.api.client.ProjectApiRoot;
import com.commercetools.api.defaultconfig.ApiRootBuilder;
import com.commercetools.api.defaultconfig.ServiceRegion;
import com.commercetools.http.okhttp3.BuilderOptions;
import com.commercetools.http.okhttp3.CtOkHttp3Client;
import com.sephora.services.product.service.commercetools.MDCCorrelationIdProvider;
import com.sephora.services.product.service.commercetools.config.properties.CommerceToolsConfigurationProperties;
import com.sephora.services.product.utils.AsyncUtils;
import io.vrap.rmf.base.client.oauth2.ClientCredentials;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.task.ThreadPoolTaskExecutorCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.core.task.TaskDecorator;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Configuration class for Commerce Tools integration.
 */
@Component
@EnableConfigurationProperties(CommerceToolsConfigurationProperties.class)
@Slf4j
public class CommerceToolsConfig {

    public static final String COMMERCE_TOOLS_EXECUTOR = "commerceToolsExecutor";

    @Bean(COMMERCE_TOOLS_EXECUTOR)
    public ExecutorService commerceToolsExecutor(ObjectProvider<TaskDecorator> taskDecorator,
                                                 ObjectProvider<ThreadPoolTaskExecutorCustomizer> taskExecutorCustomizers,
                                                 CommerceToolsConfigurationProperties properties) {
        var taskExecutorBuilder = AsyncUtils.taskExecutorBuilder(properties.getExecutor(), taskExecutorCustomizers, taskDecorator);
        ThreadPoolTaskExecutor threadPoolTaskExecutor = taskExecutorBuilder.build();
        AsyncUtils.initializeThreadPoolExecutor(threadPoolTaskExecutor);
        return threadPoolTaskExecutor.getThreadPoolExecutor();
    }

    @Bean
    public ProjectApiRoot projectApiRoot(CommerceToolsConfigurationProperties properties,
                                         @Qualifier(COMMERCE_TOOLS_EXECUTOR)
                                         ExecutorService commerceToolsExecutor) {
        var region = ServiceRegion.GCP_US_CENTRAL1;
        try {
            region = ServiceRegion.valueOf(properties.getRegion());
        } catch (IllegalArgumentException e) {
            log.error("Invalid region: {}. Use default region: {}", properties.getRegion(), ServiceRegion.GCP_US_CENTRAL1);
        }

        var apiUrl = StringUtils.defaultIfEmpty(properties.getApiUrl(), region.getApiUrl());
        var authUrl = StringUtils.defaultIfEmpty(properties.getAuthUrl(), region.getOAuthTokenUrl());

        // See detail about tuning https://commercetools.github.io/commercetools-sdk-java-v2/javadoc/com/commercetools/docs/meta/ClientTuning.html
        BuilderOptions options = builderOptions ->
                builderOptions.connectTimeout(properties.getConnectionTimeout().toMillis(), TimeUnit.MILLISECONDS)
                        .readTimeout(properties.getReadTimeout().toMillis(), TimeUnit.MILLISECONDS)
                        .writeTimeout(properties.getWriteTimeout().toMillis(), TimeUnit.MILLISECONDS)
                        .addInterceptor(new CtOkHttp3Client.UnzippingInterceptor());

        var builder = ApiRootBuilder.of(
                        // Create client with timeouts
                        new CtOkHttp3Client(commerceToolsExecutor,
                                properties.getMaxRequests(),
                                properties.getMaxRequests(),
                                options)
                )
                .defaultClient(ClientCredentials.of()
                                .withClientId(properties.getClientId())
                                .withClientSecret(properties.getClientSecret())
                                .build(),
                        authUrl,
                        apiUrl)
                .addCorrelationIdProvider(MDCCorrelationIdProvider.of(properties.getProjectKey()));
        // .withPolicies(policyBuilder ->
        //         policyBuilder.withRetry(retry ->
        //                 retry
        //                         .maxRetries(properties.getMaxRetries())
        //                         .statusCodes(
        //                                 Arrays.asList(
        //                                         HttpStatusCode.SERVICE_UNAVAILABLE_503,
        //                                         HttpStatusCode.INTERNAL_SERVER_ERROR_500
        //                                 )
        //                         )
        //                        .failures(List.of(ConnectException.class))
        //         ));

        if (properties.isEnableGzip()) {
            builder.addAcceptGZipMiddleware();
        }
        return builder.build(properties.getProjectKey());
    }

}
