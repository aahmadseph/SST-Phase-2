package com.sephora.services.sourcingoptions.repository.cosmos;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.sephora.services.sourcingoptions.model.cosmos.SourcingRule;
import org.springframework.stereotype.Repository;

@Repository(SourcingRuleRepository.SOURCING_RULE_REPOSITORY)
public interface SourcingRuleRepository extends CosmosRepository<SourcingRule, String>, CustomSourcingRuleRepository {
    String SOURCING_RULE_REPOSITORY = "sourcingRuleRepositoryCosmos";
}
