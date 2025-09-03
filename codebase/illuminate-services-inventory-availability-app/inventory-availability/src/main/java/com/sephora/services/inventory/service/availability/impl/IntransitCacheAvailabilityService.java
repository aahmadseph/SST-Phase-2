package com.sephora.services.inventory.service.availability.impl;

import com.sephora.services.inventory.model.intransitbydate.InTransitByDateDTO;
import com.sephora.services.inventoryavailability.utils.AvailabilityUtils;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.sephora.services.inventoryavailability.config.redis.GetAvailabilityForSitePagesAsyncConfig.INTRANSIT_THREAD_POOL;


@Service
@Log4j2
@Getter
@Setter
public class IntransitCacheAvailabilityService {

    @Autowired
    @Qualifier("redisInventoryServiceTemplate")
    private RedisTemplate<String, Object> invRedisTemplate;

    @Value("${inventory.site-page-availability.inTransitCacheName}")
    private String inTransitCacheName;

    @Value("${sitePageAvailability.inTransitAvailability.async.batchSize:1}")
    private int batchSize;

    @Value("${sitePageAvailability.inTransitAvailability.async.waitTimeoutInSeconds}")
    private long waitTimeoutInSeconds;

    @Autowired
    @Qualifier(INTRANSIT_THREAD_POOL)
    private AsyncTaskExecutor threadPoolTaskExecutor;

    public Map<String, Map<String, InTransitByDateDTO>> getIntransitAvailability(Set<String> productList, Set<String> locationList) {
        Map<String, CompletableFuture<Map<String, InTransitByDateDTO>>> intransitAvailabilityFutureMap = locationList.stream()
                .collect(Collectors.toMap(
                        locationId -> locationId,
                        locationId -> CompletableFuture.supplyAsync(
                                () -> getIntransitAvailabilityByLocation(productList, locationId),
                                threadPoolTaskExecutor
                        )
                ));
        return intransitAvailabilityFutureMap.entrySet().stream()
                .map(entry -> Map.entry(entry.getKey(), entry.getValue().join()))
                .filter(entry -> !entry.getValue().isEmpty())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    private Map<String, InTransitByDateDTO> getIntransitAvailabilityByLocation(Set<String> productList, String locationId) {
        HashMap<String, InTransitByDateDTO> response = new HashMap<>();
        Collection<List<String>> productBatches = convertToBatch(productList);

        List<CompletableFuture<Map<String, InTransitByDateDTO>>> availabilityByLocationFutureList = productBatches.stream().map(productBatch ->
                CompletableFuture.supplyAsync(() -> {
                    Map<String, InTransitByDateDTO> intransitAvailabilityMap = new HashMap<>();
                    List<String> intransitInventoryCacheKeys = new ArrayList<>();
                    intransitInventoryCacheKeys.addAll(productBatch.stream()
                            .map(productId ->
                                    AvailabilityUtils.createIntransitAvailabilityRedisCacheKey(inTransitCacheName, productId, locationId))
                            .collect(Collectors.toList()));
                    try {
                        long startTimeIntransitInventoryCache = System.currentTimeMillis();
                        log.debug("Fetching data from cache with number of key(s): {}", intransitInventoryCacheKeys.size());

                        // Read intransit inventory data from redis with key cacheName_locationId_productId.
                        List<Object> intransitInventoryCacheDatas = invRedisTemplate.opsForValue().multiGet(intransitInventoryCacheKeys);

                        log.info("Successfully fetched records with: {} records out of: {}, took: {} ms", intransitInventoryCacheDatas.size(), intransitInventoryCacheKeys.size(),
                                System.currentTimeMillis() - startTimeIntransitInventoryCache);

                        if (!CollectionUtils.isEmpty(intransitInventoryCacheDatas)) {
                            intransitInventoryCacheDatas.stream()
                                    .map(InTransitByDateDTO.class::cast)
                                    .filter(Objects::nonNull)
                                    .filter(inTransitByDateDTO -> !ObjectUtils.isEmpty(inTransitByDateDTO.getLocation()) && !CollectionUtils.isEmpty(inTransitByDateDTO.getArrivalDates()))
                                    .forEach(inTransitByDateDTO -> intransitAvailabilityMap.put(inTransitByDateDTO.getSku(), inTransitByDateDTO));
                        }
                    } catch (Exception e) {
                        log.error("An exception occurred while fetching cache:{} ", e.getMessage(), e);
                        log.info("Cache miss product(s): {}, location: {}",  Arrays.toString(productList.toArray()), locationId);
                    }
                    return intransitAvailabilityMap;
                })).collect(Collectors.toList());

        availabilityByLocationFutureList.forEach(availabilityByLocationFuture -> {
            try {
                response.putAll(availabilityByLocationFuture.get(waitTimeoutInSeconds, TimeUnit.SECONDS));
            } catch (InterruptedException e) {
                log.error("An exception occur while fetching availability from cache by batch", e);
            } catch (ExecutionException e) {
                log.error("An exception occur while fetching availability from cache by batch", e);
            } catch (TimeoutException e) {
                throw new RuntimeException(e);
            }
        });

        return response;
    }

    private Collection<List<String>> convertToBatch(Set<String> list) {
        final AtomicInteger counter = new AtomicInteger();
        return list.stream()
                .collect(Collectors.groupingBy(it -> counter.getAndIncrement() / batchSize)).values();
    }
}
