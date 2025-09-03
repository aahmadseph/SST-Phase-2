package com.sephora.services.sourcingoptions.service;

import com.sephora.services.sourcingoptions.model.cosmos.SourcingRule;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import org.springframework.cache.annotation.Cacheable;

import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.SOURCING_CACHE_MANAGER;
import static com.sephora.services.sourcingoptions.config.cache.SourcingOptionsCacheConfig.SOURCING_RULE_CACHE_NAME;

public interface SourcingRulesService {
    
    @Cacheable(cacheNames = SOURCING_RULE_CACHE_NAME,
               key = "#sourcingOptionsRequest.enterpriseCode + '__' + #sourcingOptionsRequest.sellerCode + '__' + " +
                     "#sourcingOptionsRequest.fulfillmentType + '__' + #destinationType",
               cacheManager = SOURCING_CACHE_MANAGER, unless = "#result == null")
    SourcingRule getSourcingRules(SourcingOptionsRequestDto sourcingOptionsRequest, String destinationType);
}
