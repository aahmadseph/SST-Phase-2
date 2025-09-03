package com.sephora.services.sourcingoptions.service.impl;

import com.sephora.services.sourcingoptions.model.cosmos.SourcingRule;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.repository.cosmos.SourcingRuleRepository;
import com.sephora.services.sourcingoptions.service.SourcingRulesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SourcingRulesServiceImpl implements SourcingRulesService {
    
    @Autowired(required = false)
    private SourcingRuleRepository sourcingRuleRepository;

    @Override
    public SourcingRule getSourcingRules(SourcingOptionsRequestDto sourcingOptionsRequest, String destinationType) {
        return sourcingRuleRepository.findByCriteria(
            sourcingOptionsRequest.getEnterpriseCode(),
            sourcingOptionsRequest.getSellerCode(),
            sourcingOptionsRequest.getFulfillmentType(),
            destinationType);
    }
}
