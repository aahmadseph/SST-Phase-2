package com.sephora.services.productaggregationservice.productaggregationservice.repository;

import java.util.List;


import com.azure.spring.data.cosmos.repository.CosmosRepository;
import org.springframework.stereotype.Repository;

import com.sephora.services.productaggregationservice.productaggregationservice.model.ReferenceItem;
import com.sephora.services.productaggregationservice.productaggregationservice.model.ReferenceStatusEnum;

@Repository("referenceItemsRepositoryCosmos")
public interface ReferenceRepository extends CosmosRepository<ReferenceItem, String> {

   List<ReferenceItem> findByIdIn(List<String> referenceIds);

   List<ReferenceItem> findByReferenceStatus(ReferenceStatusEnum status);

   List<ReferenceItem> findByName(String name);
}
