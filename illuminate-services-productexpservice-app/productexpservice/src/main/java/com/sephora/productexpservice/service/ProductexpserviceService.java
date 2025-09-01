package com.sephora.productexpservice.service;

import java.util.List;

import com.sephora.productexpservice.configuration.exception.ReferenceItemNotFoundException;
import com.sephora.productexpservice.dto.ReferenceDto;
import com.sephora.productexpservice.model.ReferenceStatusEnum;

public interface ProductexpserviceService {

   List<ReferenceDto> updateReferenceStatusByName(List<String> referenceNames, String referenceStatus);

   List<ReferenceDto> findReferenceItemsByStatus(ReferenceStatusEnum referenceStatusEnum);

   List<ReferenceDto> findReferenceItemsByName(String name);

   ReferenceDto findById(String id) throws ReferenceItemNotFoundException;
   
   ReferenceDto findByReferenceId(String id) throws ReferenceItemNotFoundException;
   
   ReferenceDto add(ReferenceDto referenceDto);

}
