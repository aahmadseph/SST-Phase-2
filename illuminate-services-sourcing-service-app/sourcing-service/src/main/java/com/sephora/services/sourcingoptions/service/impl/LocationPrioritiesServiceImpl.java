package com.sephora.services.sourcingoptions.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sephora.services.sourcingoptions.client.AzureTableClient;
import com.sephora.services.sourcingoptions.model.*;
import com.sephora.services.sourcingoptions.model.cosmos.ZipCodeDetails;
import com.sephora.services.sourcingoptions.model.dto.*;
import com.sephora.services.sourcingoptions.service.LocationPrioritiesService;
import com.sephora.services.sourcingoptions.config.*;

import jodd.util.StringUtil;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.jcache.JCacheCacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.cache.Cache;
import java.util.*;
import java.util.stream.Collectors;

import static com.sephora.services.sourcingoptions.SourcingOptionConstants.*;
import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.LOCATION_PRIORITY_CACHE_NAME;
import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.SOURCING_CACHE_MANAGER;

@Service
@Log4j2
public class LocationPrioritiesServiceImpl implements LocationPrioritiesService {

    @Autowired
    LocationPrioritiesConfig locationPrioritiesConfig;

    @Autowired
    @Qualifier("redisSourcingServiceTemplate")
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    @Qualifier(SOURCING_CACHE_MANAGER)
    private JCacheCacheManager cacheManager;

    @Autowired
    private AzureTableClient azureTableClient;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Persist the location priorities across given zip codes in azure table storage and redis cache.
     * @param zoneMapDocuments object represents the zone mapping records. Each record includes zip code and list of preferred DCs.
     * @param enterpriseCode enterprise code to identify the region (US or CA).
     */
    @Override
    public void persistLocationPriorities(List<ZipCodeDetails> zoneMapDocuments, EnterpriseCodeEnum enterpriseCode) {
        long startTime = System.currentTimeMillis();
        log.info("Started persisting location priorities for enterprise code: {}", enterpriseCode);
        if (zoneMapDocuments == null || enterpriseCode == null) {
            log.warn("Zone map documents or enterprise code is null.");
            return;
        }
        String country = EnterpriseCodeEnum.SEPHORACA.equals(enterpriseCode) ? CA : US;
        zoneMapDocuments.stream()
                .filter(Objects::nonNull)
                .forEach(doc -> processLocationPriorities(doc, country));
        log.info("Completed persisting location priorities for enterprise code: {} took: {} ms",
                enterpriseCode, System.currentTimeMillis() - startTime);
    }

    private void processLocationPriorities(ZipCodeDetails doc, String country) {
        List<LocationPriority> locationPriorities = buildLocationPriorities(doc.getPriority());
        if (null == doc.getFromZipCode() || null == doc.getToZipCode() || locationPriorities.isEmpty()) {
            log.error("Skipping zip code persistence due to missing zip code details for fromZipCode: {}, toZipCode: {} and priority: {}",
                    doc.getFromZipCode(), doc.getToZipCode(), doc.getPriority());
            return;
        }
        if (US.equals(country)) {
            try {
                saveInAzureTable(country, doc.getFromZipCode(), locationPriorities);
                saveInRedis(country, doc.getFromZipCode(), locationPriorities);
            } catch (Exception e) {
                log.error("Failed to persist entity for country: {} zipCode: {}. Error: {}", country, doc.getFromZipCode(), e.getMessage(), e);
            }
        } else {
            // Generate all possible combination of zip codes in the given range.
            List<String> zipCodes = new ArrayList<>();
            try {
                zipCodes = generateZipCodesInRange(doc.getFromZipCode(), doc.getToZipCode());
            } catch(Exception e) {
                log.error("Unable to generate zip codes for given range: {} to {}. Error: {}",
                        doc.getFromZipCode(), doc.getToZipCode(), e.getMessage(), e);
            }
            zipCodes.forEach(zip -> {
                try {
                    saveInAzureTable(country, zip, locationPriorities);
                    saveInRedis(country, doc.getFromZipCode(), locationPriorities);
                } catch (Exception e) {
                    log.error("Failed to persist entity for country: {} zipCode: {}. Error: {}", country, doc.getFromZipCode(), e.getMessage(), e);
                }
            });
        }
    }

    private void saveInRedis(String country, String zipCode, List<LocationPriority> priorities) {
        LocationPrioritiesCacheDto cacheDto = new LocationPrioritiesCacheDto();
        cacheDto.setLocationPriorities(priorities);
        String cacheKey = String.format(ZONE_MAPPING_CACHE_KEY, country, zipCode);
        try {
            redisTemplate.opsForValue().set(cacheKey, cacheDto);
        } catch (Exception e) {
            log.error("Error while saving location priorities in Redis for key: {}. Error: {}", cacheKey, e.getMessage(), e);
        }
    }

    private void saveInAzureTable(String partitionKey, String rowKey, List<LocationPriority> priorities) throws JsonProcessingException {
        SourcingLocationByPriorityEntity entity = new SourcingLocationByPriorityEntity();
        entity.setPartitionKey(partitionKey);
        entity.setRowKey(rowKey);
        entity.setLocationPriorities(objectMapper.writeValueAsString(priorities));
        azureTableClient.upsertEntity(locationPrioritiesConfig.getAzureTableName(), partitionKey, rowKey, entity);
    }

    private List<LocationPriority> buildLocationPriorities(List<String> priorities) {
        List<LocationPriority> result = new ArrayList<>();
        if (null == priorities || priorities.isEmpty()) {
            return result;
        }
        // Currently, only the first location from the priority list is being persisted.
        LocationPriority lp = new LocationPriority();
        lp.setLocationId(priorities.get(0));
        lp.setPriority(String.valueOf(1));
        result.add(lp);
        return result;
    }

    /**
     * Generate all possible combination of zip codes in the given range.
     * Assumes the zip codes follow a fixed 3 character format: [Letter A-Z][Digit 0-9][Letter A-Z].
     * @param from string represents the starting zip code in the range (must be exactly 3 characters).
     * @param to string represents the ending zip code in the range (must be exactly 3 characters).
     * @return list of strings representing all possible zip codes in the range.
     */
    private static List<String> generateZipCodesInRange(String from, String to) {
        if (from == null || to == null || from.length() != 3 || to.length() != 3) {
            throw new IllegalArgumentException("Zip codes must be exactly 3 characters long and not null");
        }
        int fromVal = zipCodeToInt(from);
        int toVal = zipCodeToInt(to);
        if (fromVal > toVal) {
            throw new IllegalArgumentException("From zip code must be less than or equal to To zip code");
        }
        List<String> result = new ArrayList<>();
        for (int val = fromVal; val <= toVal; val++) {
            result.add(intToZipCode(val));
        }
        return result;
    }

    private static int zipCodeToInt(String zip) {
        return (zip.charAt(0) - 'A') * 260 + (zip.charAt(1) - '0') * 26 + (zip.charAt(2) - 'A');
    }

    private static String intToZipCode(int value) {
        int first = value / 260;
        int rem = value % 260;
        int second = rem / 26;
        int third = rem % 26;
        return "" + (char) ('A' + first) + second + (char) ('A' + third);
    }

    /**
     * Get the location priorities for a given zip code and country from the cache and azure table storage based on the priority order configured.
     * @param input object represents the location by priority input. Input includes zip code and country.
     */
    @Override
    public LocationsByPriorityResponse getLocationPriorities(LocationsByPriorityInput input) {
        log.info("Getting location priorities for input: {}", input);
        LocationsByPriorityResponse response = new LocationsByPriorityResponse();
        response.setZipCode(input.getZipCode());
        response.setCountry(input.getCountry());
        if (StringUtil.isEmpty(input.getZipCode()) || input.getZipCode().length() < 3) {
            log.error("Zip codes are null/empty or not valid.");
            return response;
        }
        String zipPrefix = input.getZipCode().substring(0, 3);
        List<PriorityConfig> priorityConfigs = locationPrioritiesConfig.getPriorityConfig();
        List<String> priorityOrder = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(priorityConfigs)) {
            priorityOrder = priorityConfigs.stream()
                    .filter(config -> config.getRequestOrigin().stream()
                            .anyMatch(origin -> origin.equalsIgnoreCase(input.getRequestOrigin())))
                    .flatMap(config -> config.getPriorityOrder().stream())
                    .collect(Collectors.toList());
        }
        // If priorityOrder is not found, set default order (CACHE -> AZURE_TABLE_STORAGE)
        if (priorityOrder.isEmpty()) {
            log.info("No priority configuration found for request origin {}. Using default priority order.", input.getRequestOrigin());
            priorityOrder = Arrays.asList(CACHE, AZURE_TABLE);
        }
        boolean cacheMiss = false;
        // Fetch data based on the priority order configured.
        for (String priority : priorityOrder) {
            List<LocationPriority> locationPriorities = null;
            if (CACHE.equals(priority)) {
                locationPriorities = fetchFromJCache(input.getCountry().name(), zipPrefix);
                if (CollectionUtils.isEmpty(locationPriorities)) {
                    locationPriorities = fetchFromRedis(input.getCountry().name(), zipPrefix);
                    if (CollectionUtils.isNotEmpty(locationPriorities)) {
                        saveInJCache(input.getCountry().name(), zipPrefix, locationPriorities);
                    }
                }
                if (CollectionUtils.isNotEmpty(locationPriorities)) {
                    response.setLocationPriorities(locationPriorities);
                    return response;
                }
                cacheMiss = true;
            }
            if (AZURE_TABLE.equals(priority)) {
                locationPriorities = fetchFromAzureTable(input.getCountry(), zipPrefix);
                if (CollectionUtils.isNotEmpty(locationPriorities)) {
                    if (cacheMiss) {
                        saveInRedis(input.getCountry().name(), zipPrefix, locationPriorities);
                        saveInJCache(input.getCountry().name(), zipPrefix, locationPriorities);
                    }
                    response.setLocationPriorities(locationPriorities);
                    return response;
                }
            }
        }
        return response;
    }

    private List<LocationPriority> fetchFromJCache(String country, String zip) {
        String key = country + "_" + zip;
        try {
            Cache<Object, Object> cache = cacheManager
                    .getCacheManager()
                    .getCache(LOCATION_PRIORITY_CACHE_NAME, Object.class, Object.class);
            LocationPrioritiesCacheDto dto = (LocationPrioritiesCacheDto) cache.get(key);
            if (null != dto && null != dto.getLocationPriorities()) {
                return dto.getLocationPriorities();
            }
        } catch (Exception e) {
            log.error("Error fetching from JCache for key: {}: {}", key, e.getMessage(), e);
        }
        return Collections.emptyList();
    }

    private void saveInJCache(String country, String zip, List<LocationPriority> locationPriorities) {
        String key = country + "_" + zip;
        try {
            Cache<Object, Object> cache = cacheManager
                    .getCacheManager()
                    .getCache(LOCATION_PRIORITY_CACHE_NAME, Object.class, Object.class);
            if (null != locationPriorities) {
                LocationPrioritiesCacheDto value = new LocationPrioritiesCacheDto(locationPriorities);
                cache.put(key, value);
            }
        } catch (Exception e) {
            log.error("Error while saving to JCache for key: {}: {}", key, e.getMessage(), e);
        }
    }

    private List<LocationPriority> fetchFromRedis(String country, String zip) {
        String cacheKey = String.format(ZONE_MAPPING_CACHE_KEY, country, zip);
        long startTime = System.currentTimeMillis();
        try {
            LocationPrioritiesCacheDto dto = (LocationPrioritiesCacheDto) redisTemplate.opsForValue().get(cacheKey);
            if (dto != null) {
                log.debug("Location priorities found in Redis for key: {} in {} ms", cacheKey, System.currentTimeMillis() - startTime);
                return dto.getLocationPriorities();
            }
            log.warn("No location priorities found in Redis for key: {} in {} ms", cacheKey, System.currentTimeMillis() - startTime);
        } catch (Exception e) {
            log.error("Error fetching from Redis for key: {}: {}", cacheKey, e.getMessage(), e);
        }
        return Collections.emptyList();
    }

    private List<LocationPriority> fetchFromAzureTable(CountryEnum country, String zipPrefix) {
        try {
            long startTime = System.currentTimeMillis();
            log.info("Fetching from Azure table storage for country: {}, zip prefix: {}", country, zipPrefix);
            AzureTableQueryResponse entity = azureTableClient.getEntityByKeys(locationPrioritiesConfig.getAzureTableName(), country.toString(), zipPrefix);
            if (entity != null && CollectionUtils.isNotEmpty(entity.getValue())) {
                AzureTableEntityResponse tableEntity = entity.getValue().get(0);
                String rawJson = (String) tableEntity.getProperties().get("LocationPriorities");
                if (!ObjectUtils.isEmpty(rawJson)) {
                    List<LocationPriority> priorities = objectMapper.readValue(rawJson, List.class);
                    log.info("Successfully fetched {} location priorities from Azure Table Storage in {} ms", priorities.size(), System.currentTimeMillis() - startTime);
                    return priorities;
                }
            }
            log.warn("No data found in Azure Table Storage for country: {} and zip prefix: {} in {} ms", country, zipPrefix, System.currentTimeMillis() - startTime);
        } catch (Exception e) {
            log.error("Error fetching from Azure Table Storage for country: {} and zip prefix: {}: {}", country, zipPrefix, e.getMessage(), e);
        }
        return Collections.emptyList();
    }
}
