package com.sephora.services.product.service.commercetools.repository;

import com.commercetools.api.client.ProjectApiRoot;
import com.commercetools.api.models.graph_ql.GraphQLRequest;
import com.commercetools.api.models.graph_ql.GraphQLVariablesMap;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.netflix.graphql.types.errors.TypedGraphQLError;
import com.sephora.services.product.service.commercetools.config.properties.CommerceToolsConfigurationProperties;
import com.sephora.services.product.service.commercetools.dto.CommonGraphResponse;
import com.sephora.services.product.service.commercetools.repository.exception.ConcurrentModificationRepositoryException;
import com.sephora.services.product.service.commercetools.repository.exception.RepositoryException;
import com.sephora.services.product.service.commercetools.repository.exception.RetriableRepositoryException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.vrap.rmf.base.client.ApiHttpResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.lang.reflect.Type;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import static org.apache.commons.collections4.CollectionUtils.isNotEmpty;

@Slf4j
@RequiredArgsConstructor
@Component
public class CommerceToolsQueryExecutor {

    private static final String CONCURRENT_MODIFICATION_CODE = "concurrentmodification";
    private static final String EXTENSION_CODE = "code";

    private final CommerceToolsConfigurationProperties commerceToolsConfigurationProperties;
    private final ProjectApiRoot apiRoot;

    //TODO configure retry on CommerceToolsConfiguration for apiRoot
    @Retry(name = "commerce-tools-query-executor")
    @CircuitBreaker(name = "commerceToolsCircuitBreaker")
    public <T> T executeTypedRequest(GraphQLRequest request, Class<T> responseClass) {
        return executeTypedRequest(request, responseClass, commerceToolsConfigurationProperties.getWaitTimeout());
    }

    private <T> T executeTypedRequest(GraphQLRequest request, Class<T> responseClass, Duration timeout) {
        if (timeout == null) {
            timeout = commerceToolsConfigurationProperties.getWaitTimeout();
        }
        CommonGraphResponse<T> response;
        try {
            response = apiRoot
                    .graphql()
                    .post(request)
                    .execute(
                            new TypeReference<CommonGraphResponse<T>>() {
                                @Override
                                public Type getType() {
                                    return TypeFactory.defaultInstance()
                                            .constructParametricType(
                                                    CommonGraphResponse.class,
                                                    TypeFactory.defaultInstance()
                                                            .constructFromCanonical(responseClass.getCanonicalName()));
                                }
                            })
                    .thenApply(ApiHttpResponse::getBody)
                    .get(timeout.toMillis(), TimeUnit.MILLISECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted while fetching BI Rewards Product Keys", e);
            throw new RepositoryException(e);
        } catch (ExecutionException | TimeoutException e) {
            log.error("Error executing request {}", e.getMessage());
            log.debug("Query = {}; Variables = {}", request.getQuery(),
                    Optional.ofNullable(request.getVariables())
                            .map(GraphQLVariablesMap::values)
                            .orElse(null)
            );
            //TODO configure retry on CommerceToolsConfiguration for apiRoot
            throw new RetriableRepositoryException("Error executing request", e);
        }
        checkErrors(response);
        return response.getData();
    }

    protected void checkErrors(CommonGraphResponse<?> graphResponse) {
        if (graphResponse == null) {
            throw new RepositoryException("Exception occurred during processing request");
        }
        if (graphResponse.getData() == null && isNotEmpty(graphResponse.getErrors())) {
            for (TypedGraphQLError error : graphResponse.getErrors()) {
                log.error("GraphQL error: {}", error);
            }
            if (isConcurrentModificationError(graphResponse.getErrors().getFirst())) {
                // TODO configure concurrent modification exception on CommerceToolsConfiguration for apiRoot
                throw new ConcurrentModificationRepositoryException("Concurrent modification error occurred");
            }
            throw new RepositoryException("Exception occurred during processing request");
        }
    }

    protected boolean isConcurrentModificationError(TypedGraphQLError error) {
        Map<String, Object> extensions = error.getExtensions();
        if (!MapUtils.isEmpty(extensions)) {
            var code = StringUtils.lowerCase(String.valueOf(extensions.get(EXTENSION_CODE)));
            if (code != null) {
                return code.equals(CONCURRENT_MODIFICATION_CODE);
            }
        }
        return false;
    }

}
