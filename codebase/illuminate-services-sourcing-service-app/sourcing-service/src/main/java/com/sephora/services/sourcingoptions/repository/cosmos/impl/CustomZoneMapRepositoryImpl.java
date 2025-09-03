package com.sephora.services.sourcingoptions.repository.cosmos.impl;

import com.sephora.platform.database.cosmosdb.CustomCosmosTemplate;
import com.sephora.platform.database.cosmosdb.repository.support.QuerySupportedCosmosRepository;
import com.sephora.platform.database.cosmosdb.utils.CosmosQueryBuilder;
import com.sephora.services.sourcingoptions.model.cosmos.ZoneMap;
import com.sephora.services.sourcingoptions.repository.cosmos.CustomZoneMapRepository;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.List;

import static com.sephora.platform.database.cosmosdb.utils.WhereStatements.arrayEquals;
import static com.sephora.platform.database.cosmosdb.utils.WhereStatements.equal;
import static com.sephora.services.sourcingoptions.config.CosmosConfig.COSMOS_TEMPLATE;
import static com.sephora.services.sourcingoptions.model.cosmos.Constants.*;
import static java.text.MessageFormat.format;


public class CustomZoneMapRepositoryImpl extends QuerySupportedCosmosRepository<ZoneMap, String>
        implements CustomZoneMapRepository {

    public CustomZoneMapRepositoryImpl(@Autowired @Qualifier(COSMOS_TEMPLATE) CustomCosmosTemplate cosmosTemplate) {
        super(cosmosTemplate, ZoneMap.class);
    }

    @Override
    public List<ZoneMap> findByCriteria(String enterpriseCode, String fromZipCode, String toZipCode, List<String> priority) {
        String query = CosmosQueryBuilder.select()
            .whereIf(enterpriseCode != null,
                () -> equal(ENTERPRISE_CODE, enterpriseCode))
            .whereIf(fromZipCode != null,
                () -> equal(FROM_ZIP_CODE, fromZipCode))
            .whereIf(toZipCode != null,
                () -> equal(TO_ZIP_CODE, toZipCode))
            .whereIf(CollectionUtils.isNotEmpty(priority),
                () -> arrayEquals(PRIORITY, priority))
            .build();

        return queryDocuments(query, enterpriseCode);
    }

    @Override
    public List<ZoneMap> findByEnterpriseCodeAndZipCode(String enterpriseCode, String zipCode) {
        String query = format("SELECT * FROM ROOT r WHERE r.enterpriseCode = \"{0}\"  "
                                  + "AND (IS_NULL(r.fromZipCode) OR r.fromZipCode <= \"{1}\" ) "
                                  + "AND (IS_NULL(r.toZipCode) OR r.toZipCode >= \"{1}\" )",
                              enterpriseCode, zipCode);

        return queryDocuments(query, enterpriseCode);
    }

    @Override
    public void deleteByEnterpriseCode(String enterpriseCode) {
        String query = CosmosQueryBuilder.select()
            .where(equal(ENTERPRISE_CODE, enterpriseCode))
            .build();

        deleteDocumentsSync(query, enterpriseCode);
    }

    @Override
    public int deleteByCriteria(String enterpriseCode, String fromZipCode, String toZipCode, List<String> priority) {
        String query = CosmosQueryBuilder.select()
            .whereIf(enterpriseCode != null,
                     () -> equal(ENTERPRISE_CODE, enterpriseCode))
            .whereIf(fromZipCode != null,
                     () -> equal(FROM_ZIP_CODE, fromZipCode))
            .whereIf(toZipCode != null,
                     () -> equal(TO_ZIP_CODE, toZipCode))
            .whereIf(CollectionUtils.isNotEmpty(priority),
                     () -> arrayEquals(PRIORITY, priority))
            .build();

        return deleteDocumentsSync(query, enterpriseCode).size();     
    }

}
