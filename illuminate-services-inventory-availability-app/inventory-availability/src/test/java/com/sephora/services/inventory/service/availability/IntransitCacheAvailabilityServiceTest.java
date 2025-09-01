package com.sephora.services.inventory.service.availability;

import com.sephora.services.inventory.model.intransitbydate.ArrivalDate;
import com.sephora.services.inventory.model.intransitbydate.InTransitByDateDTO;
import com.sephora.services.inventory.service.availability.impl.IntransitCacheAvailabilityService;
import com.sephora.services.inventoryavailability.AvailabilityConfig;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.Mockito;
import org.mockito.stubbing.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AvailabilityConfig.class})
public class IntransitCacheAvailabilityServiceTest {

    private final String CACHE_NAME = "inTransitLoad";
    private final String PRODUCT_ID = "23412";
    private final String LOCATION_ID1 = "0410";
    private final String LOCATION_ID2 = "0712";

    @MockBean(answer = Answers.RETURNS_DEEP_STUBS)
    @Qualifier("redisInventoryServiceTemplate")
    private RedisTemplate<String, Object> invRedisTemplate;

    @Autowired
    IntransitCacheAvailabilityService intransitCacheAvailabilityService;

    @Before
    public void setUp() {
        intransitCacheAvailabilityService.setWaitTimeoutInSeconds(10L);
        intransitCacheAvailabilityService.setInTransitCacheName(CACHE_NAME);
    }

    @Test
    public void whenRedisReturnListOfData_shouldReturnMap() {
        List<String> productList = List.of(PRODUCT_ID);
        List<String> locationList = List.of(LOCATION_ID1, LOCATION_ID2);
        when(invRedisTemplate.opsForValue().multiGet(anyList())).thenAnswer((Answer<List<Object>>) invocation -> {
            List<String> cacheKeys = invocation.getArgument(0);
            List<Object> results = new ArrayList<>();
            for (String cacheKey : cacheKeys) {
                if (cacheKey.equals("inTransitLoad" + "_" + LOCATION_ID1 + "_" + PRODUCT_ID)) {
                    results.add(InTransitByDateDTO.builder()
                            .eventTimestamp("2021-11-17T02:12:48.926-07:00")
                            .location(LOCATION_ID1)
                            .sku(PRODUCT_ID)
                            .arrivalDates(List.of(ArrivalDate.builder().date("2024-06-06").quantity(2).build()))
                            .build());
                }
            }
            return results;
        });
        Map<String, Map<String, InTransitByDateDTO>> intransitAvailabilityMap =
                intransitCacheAvailabilityService.getIntransitAvailability(new HashSet<>(productList), new HashSet<>(locationList));
        assertNotNull(intransitAvailabilityMap);
        assertNotNull(intransitAvailabilityMap.get(LOCATION_ID1).get(PRODUCT_ID));
        assertNull(intransitAvailabilityMap.get(LOCATION_ID2));
        Mockito.verify(invRedisTemplate.opsForValue(), times(2)).multiGet(any());
    }

    @Test
    public void whenRedisReturnEmptyList_shouldReturnEmptyMap() {
        List<String> productList = List.of(PRODUCT_ID);
        List<String> locationList = List.of(LOCATION_ID1, LOCATION_ID2);
        when(invRedisTemplate.opsForValue().multiGet(any())).thenReturn(new ArrayList<>());
        Map<String, Map<String, InTransitByDateDTO>> intransitAvailabilityMap =
                intransitCacheAvailabilityService.getIntransitAvailability(new HashSet<>(productList), new HashSet<>(locationList));
        assertNotNull(intransitAvailabilityMap);
        assertTrue(intransitAvailabilityMap.isEmpty());
        Mockito.verify(invRedisTemplate.opsForValue(), times(2)).multiGet(any());
    }

    @Test
    public void whenRedisThrowException_shouldReturnEmptyMap() {
        List<String> productList = List.of(PRODUCT_ID);
        List<String> locationList = List.of(LOCATION_ID1, LOCATION_ID2);
        when(invRedisTemplate.opsForValue().multiGet(any())).thenThrow(new RuntimeException());
        Map<String, Map<String, InTransitByDateDTO>> intransitAvailabilityMap =
                intransitCacheAvailabilityService.getIntransitAvailability(new HashSet<>(productList), new HashSet<>(locationList));
        assertNotNull(intransitAvailabilityMap);
        assertTrue(intransitAvailabilityMap.isEmpty());
        Mockito.verify(invRedisTemplate.opsForValue(), times(2)).multiGet(any());
    }
}
