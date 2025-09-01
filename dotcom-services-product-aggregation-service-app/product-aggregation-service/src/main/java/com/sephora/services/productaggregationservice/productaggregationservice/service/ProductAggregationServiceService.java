package com.sephora.services.productaggregationservice.productaggregationservice.service;

import java.util.List;

import com.sephora.services.productaggregationservice.productaggregationservice.configuration.exception.ReferenceItemNotFoundException;
import com.sephora.services.productaggregationservice.productaggregationservice.dto.ReferenceDto;
import com.sephora.services.productaggregationservice.productaggregationservice.model.ReferenceStatusEnum;

public interface ProductAggregationServiceService {

   List<ReferenceDto> updateReferenceStatusByName(List<String> referenceNames, String referenceStatus);

   List<ReferenceDto> findReferenceItemsByStatus(ReferenceStatusEnum referenceStatusEnum);

   List<ReferenceDto> findReferenceItemsByName(String name);

   ReferenceDto findById(String id) throws ReferenceItemNotFoundException;
   
   ReferenceDto findByReferenceId(String id) throws ReferenceItemNotFoundException;
   
   ReferenceDto add(ReferenceDto referenceDto);

}
