package com.sephora.services.productaggregationservice.productaggregationservice.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sephora.services.productaggregationservice.productaggregationservice.configuration.exception.ReferenceItemNotFoundException;
import com.sephora.services.productaggregationservice.productaggregationservice.dto.ReferenceDto;
import com.sephora.services.productaggregationservice.productaggregationservice.mapper.ReferenceItemMapper;
import com.sephora.services.productaggregationservice.productaggregationservice.model.ReferenceItem;
import com.sephora.services.productaggregationservice.productaggregationservice.model.ReferenceStatusEnum;
import com.sephora.services.productaggregationservice.productaggregationservice.repository.ReferenceRepository;
import com.sephora.services.productaggregationservice.productaggregationservice.service.ProductAggregationServiceService;

@Service
public class ProductAggregationServiceServiceImpl implements ProductAggregationServiceService {

   @Autowired
   private ReferenceRepository referenceRepository;

   @Autowired
   private ReferenceItemMapper referenceItemMapper;

   @Override
   public List<ReferenceDto> updateReferenceStatusByName(List<String> referenceNames, String referenceStatus) {

      List<ReferenceItem> referenceItemList = new ArrayList<>();

      referenceNames.forEach(name -> referenceItemList.addAll(referenceRepository.findByName(name)));

      referenceItemList.forEach(item -> item.setReferenceStatus(referenceStatus));

      referenceRepository.saveAll(referenceItemList);

      List<String> ids = new ArrayList<>();

      referenceItemList.forEach(item -> ids.add(item.getId()));

      List<ReferenceDto> referenceDtos = new ArrayList<>();

      List<ReferenceItem> referenceItemListUpdated = referenceRepository.findByIdIn(ids);

      referenceItemListUpdated.forEach(item -> referenceDtos.add(referenceItemMapper.toDto(item)));

      return referenceDtos;

   }

   @Override
   public List<ReferenceDto> findReferenceItemsByStatus(ReferenceStatusEnum referenceStatus) {
      List<ReferenceItem> referenceItemList = referenceRepository.findByReferenceStatus(referenceStatus);

      List<ReferenceDto> referenceDtos = new ArrayList<>();

      referenceItemList.forEach(item -> referenceDtos.add(referenceItemMapper.toDto(item)));

      return referenceDtos;
   }

   @Override
   public List<ReferenceDto> findReferenceItemsByName(String name) {
      List<ReferenceItem> referenceItemList = referenceRepository.findByName(name);

      List<ReferenceDto> referenceDtos = new ArrayList<>();

      referenceItemList.forEach(item -> referenceDtos.add(referenceItemMapper.toDto(item)));

      return referenceDtos;
   }

   @Override
   public ReferenceDto findById(String id) throws ReferenceItemNotFoundException {
      Optional<ReferenceItem> optionalReferenceItem = referenceRepository.findById(id);

      if (optionalReferenceItem.isPresent()) {
         ReferenceItem referenceItem = optionalReferenceItem.get();
         return referenceItemMapper.toDto(referenceItem);
      } else {
         throw new ReferenceItemNotFoundException("Item with id [" + id + "] not found");
      }
   }
   
   @Override
   public ReferenceDto findByReferenceId(String id) throws ReferenceItemNotFoundException {
      Optional<ReferenceItem> optionalReferenceItem = referenceRepository.findById(id);
      
      if (optionalReferenceItem.isPresent()) {
         ReferenceItem referenceItem = optionalReferenceItem.get();
         return referenceItemMapper.toDto(referenceItem);
      } else {
         throw new ReferenceItemNotFoundException("Item with id [" + id + "] not found");
      }
   }

   @Override
   public ReferenceDto add(ReferenceDto referenceDto) {
      ReferenceItem referenceItem = referenceItemMapper.toEntity(referenceDto);
      referenceItem.setId(UUID.randomUUID().toString());
      ReferenceItem item = referenceRepository.save(referenceItem);

      return referenceItemMapper.toDto(item);
   }
}
