package com.sephora.services.sourcingoptions.repository.cosmos.impl;

import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
import com.sephora.platform.database.cosmosdb.repository.support.QuerySupportedCosmosRepository;
import com.sephora.platform.database.cosmosdb.utils.CosmosQueryBuilder;
import com.sephora.services.sourcingoptions.model.cosmos.SourcingRule;
import com.sephora.services.sourcingoptions.repository.cosmos.CustomSourcingRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.List;

import static com.sephora.platform.database.cosmosdb.utils.WhereStatements.equal;
import static com.sephora.services.sourcingoptions.config.CosmosConfig.COSMOS_TEMPLATE;
import static com.sephora.services.sourcingoptions.model.cosmos.Constants.*;

public class CustomSourcingRuleRepositoryImpl extends QuerySupportedCosmosRepository<SourcingRule, String>
        implements CustomSourcingRuleRepository {

    public CustomSourcingRuleRepositoryImpl(@Autowired @Qualifier(COSMOS_TEMPLATE) CustomCosmosTemplate cosmosTemplate) {
        super(cosmosTemplate, SourcingRule.class);
    }

    @Override
    public SourcingRule findByCriteria(String enterpriseCode, String sellerCode, String fulfilmentType,
                                       String destinationType) {
        String query = CosmosQueryBuilder.select()
            .where(equal(ENTERPRISE_CODE, enterpriseCode))
            .where(equal(SELLER_CODE, sellerCode))
            .where(equal(FULFILMENT_TYPE, fulfilmentType))
            .whereIf(destinationType != null,
                () -> equal(DESTINATION_TYPE, destinationType))
            .build();

        List<SourcingRule> result = queryDocuments(query, enterpriseCode);

        return result.stream()
            .findFirst()
            .orElse(null);
    }
}
