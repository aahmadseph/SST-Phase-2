package com.sephora.services.sourcingoptions.repository.cosmos;

import com.sephora.services.sourcingoptions.model.cosmos.SourcingRule;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public interface CustomSourcingRuleRepository {

    SourcingRule findByCriteria(
            @NonNull String enterpriseCode,
            @NonNull String sellerCode,
            @NonNull String fulfilmentType,
            @Nullable String destinationType);
}
