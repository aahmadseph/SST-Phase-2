package com.sephora.services.sourcingoptions.repository.cosmos;

import com.sephora.services.sourcingoptions.model.cosmos.ZoneMap;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

import java.util.List;

public interface CustomZoneMapRepository {

    List<ZoneMap> findByCriteria(@Nullable String enterpriseCode,
                                 @Nullable String fromZipCode,
                                 @Nullable String toZipCode,
                                 @Nullable List<String> priority);

    List<ZoneMap> findByEnterpriseCodeAndZipCode(@NonNull String enterpriseCode,
                                                 @NonNull String zipCode);

    void deleteByEnterpriseCode(@NonNull String enterpriseCode);

    int deleteByCriteria(@Nullable String enterpriseCode,
                         @Nullable String fromZipCode,
                         @Nullable String toZipCode,
                         @Nullable List<String> priority);
}
