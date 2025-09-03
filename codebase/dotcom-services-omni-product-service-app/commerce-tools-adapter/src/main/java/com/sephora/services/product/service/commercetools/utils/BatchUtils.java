package com.sephora.services.product.service.commercetools.utils;

import com.commercetools.api.models.ResourcePagedQueryResponse;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.time.StopWatch;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.function.BiFunction;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;

@UtilityClass
@Slf4j
public class BatchUtils {

    /**
     * Loads all items in batches using the provided loader function.
     *
     * @param batchSize the size of each batch to load
     * @param loader    a function that takes an offset and a batch size, and returns a Pageable object containing the results
     * @param async     if true, the loading will be done asynchronously using the provided executor; otherwise, it will be done synchronously
     * @param executor  the executor to use for asynchronous loading
     * @param <T>       data type
     * @return list of all loaded items
     * @throws RuntimeException if loader function fails or if any CompletableFuture throws an exception
     */
    public static <T> List<T> loadAllWithBatch(long batchSize,
                                               BiFunction<Long, Long, ResourcePagedQueryResponse<T>> loader,
                                               boolean async,
                                               Executor executor) {
        StopWatch sw = StopWatch.createStarted();
        // get first page to get total count
        var offset = 0L;
        var pageable = loader.apply(offset, batchSize);
        if (isNull(pageable) || isNull(pageable.getTotal()) || pageable.getTotal() <= 0) {
            return List.of();
        }
        if (pageable.getTotal() <= batchSize) {
            return pageable.getResults();
        }

        List<CompletableFuture<List<T>>> futures = new ArrayList<>();
        // Add the first page results to the futures list
        futures.add(CompletableFuture.completedFuture(pageable.getResults()));
        offset += batchSize;

        while (offset <= pageable.getTotal()) {
            long finalOffset = offset;
            Supplier<List<T>> task = () -> loader.apply(finalOffset, batchSize).getResults();
            if (async) {
                futures.add(CompletableFuture.supplyAsync(task, executor));
            } else {
                futures.add(CompletableFuture.completedFuture(task.get()));
            }
            offset += batchSize;
        }

        // Each future can throw timeoutException, so join is enough
        var result = futures.stream().map(CompletableFuture::join)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());

        sw.stop();
        log.debug("Time taken for batch loading = {} ms", sw.getTime());
        return result;
    }

}
