package com.sephora.services.sourcingoptions.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.azure.documentdb.bulkexecutor.BulkImportResponse;
import com.microsoft.azure.documentdb.bulkexecutor.DocumentBulkExecutor;
import com.sephora.platform.common.utils.DateTimeProvider;
import com.sephora.services.sourcingoptions.exception.NotFoundException;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.mapper.ZoneMapMapper;
import com.sephora.services.sourcingoptions.model.BatchOperationResultBean;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.model.cosmos.ZoneMap;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMappingFilterDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapsDto;
import com.sephora.services.sourcingoptions.repository.cosmos.ZoneMapRepository;
import com.sephora.services.sourcingoptions.service.ShipNodeService;
import com.sephora.services.sourcingoptions.service.ZoneMapService;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.sephora.services.sourcingoptions.service.impl.ShipNodeServiceImpl.SEPARATOR;
import static com.sephora.services.sourcingoptions.validation.ValidationConstants.NODE_PRIORITY_PIPE_PATTERN;
import static java.util.stream.Collectors.toList;

@Service
@Log4j2

public class ZoneMapServiceImpl implements ZoneMapService {

    public static final String ZONE_MAPPING_NOT_FOUND = "getZoneMapping.zoneMap.notFound";
    public static final String UPLOADED_ZONE_MAPPING_NOT_FOUND = "uploadZoneMapping.zoneMaps.notFound";
 

    @Value("${sourcing.options.zonemapping.clearBeforeUpsert:false}")
    private boolean clearBeforeUpsert;

    @Autowired(required = false)
    private ZoneMapRepository zoneMapRepository;

    @Autowired
    private ZoneMapMapper zoneMapMapper;

    @Autowired
    private ShipNodeService shipNodeService;

    @Autowired
    private DateTimeProvider dateTimeProvider;

    @Autowired(required = false)
    private DocumentBulkExecutor zoneMapBulkExecutor;

    @Autowired
    private ObjectMapper mapper;
    


    @Override
    public List<ZoneMapDto> getZoneMap(ZoneMappingFilterDto input) throws SourcingServiceException {
        List<ZoneMap> zoneMapList;
        try {
            List<String> priorities = zoneMapMapper.convertPriority(input.getNodePriority());
            zoneMapList = zoneMapRepository.findByCriteria(input.getEnterpriseCode(),
                input.getFromZipCode(),
                input.getToZipCode(),
                priorities);
        } catch (Exception e) {
            log.error("Error during getting Zone Mappings by: {}", input, e);
            throw new SourcingServiceException(e);
        }

        if (CollectionUtils.isEmpty(zoneMapList)) {
            log.error("Unable to find zone map for request: {}", input);
            throw new NotFoundException(ZONE_MAPPING_NOT_FOUND, input);
        }

        log.info("Get Zone Mappings by criteria: {}. " + "Mappings list: {}", input, zoneMapList);

        return zoneMapMapper.convertList(zoneMapList);
    }

    @Override
    public BatchOperationResultBean uploadZoneMaps(/*@NotNull //TODO why annotation doesn't work?*/ ZoneMapsDto zoneMapsDto) throws SourcingServiceException {
        validateRequestedShipNodes(zoneMapsDto);
        return processZoneMapUpdate(zoneMapsDto);
    }

    private BatchOperationResultBean processZoneMapUpdate(ZoneMapsDto zoneMapsDto) throws SourcingServiceException {
        try {
        	
            // In normal cases(i.e almost always) same records will be coming with different node priority values.
        	// When that is the case, we need not delete the existing records as the UPSERT operation will 
        	// update the records. 
        	// DELETE oepration is time consuming and thats why we decided to switch of this. The flag
        	// is given to give a provision to enable clearance if at all a need arises

        	if ( true == clearBeforeUpsert) {
	            log.info("Deleting existing Zone Mappings for {}", zoneMapsDto.getEnterpriseCode());
	
	            zoneMapRepository.deleteByEnterpriseCode(zoneMapsDto.getEnterpriseCode());
	            
	            log.info("Succesfully deleted existing Zone Mappings");
	            
        	} else {
	            log.info("clearBeforeUpsert is false.So NOT deleting existing records before UPSERT");
        	}
            
            
            AtomicInteger documentsCount = new AtomicInteger(0);
            List<String> documents = zoneMapsDto.getZones().stream()
                .map(z -> {
                    documentsCount.getAndAdd(z.getZipCodeRanges().size());
                    return z.getZipCodeRanges().stream()
                        .map(zm -> zoneMapMapper.createFrom(zoneMapsDto, zm, z.getNodePriority()))
                        .map(zm -> {
                            try {
                                zm.updateId();
                                zm.setCreatedAt(dateTimeProvider.dateTimeNowInPST());

                                return mapper.writeValueAsString(zm);
                            } catch (JsonProcessingException e) {
                                log.error("Error occurred while converting ZoneMap {} to json: {}", zm, e);
                            }
                            return null;
                        })
                        .filter(Objects::nonNull)
                        .collect(toList());
                })
                .flatMap(Collection::stream)
                .collect(toList());

            
            log.info("Begin bulk import of updated Zone Mappings {}", documents.size() );

            BulkImportResponse importResponse = zoneMapBulkExecutor.importAll(documents, true, true, null);

            log.info("Imported {} documents; consumed RU: {}; time taken: {}.", importResponse.getNumberOfDocumentsImported(),
                    importResponse.getTotalRequestUnitsConsumed(), importResponse.getTotalTimeTaken());
            if (importResponse.getNumberOfDocumentsImported() < documents.size()) {
                log.error("Bulk import error. BadInputDocuments: {}; import error: {}", importResponse.getBadInputDocuments(), importResponse.getErrors());
                importResponse.getFailedImports().forEach(fi -> {
                    log.error("DocumentsFailedToImport: {}; BulkImportFailureException: {}", fi.getDocumentsFailedToImport(), fi.getBulkImportFailureException());
                });
            }

            return BatchOperationResultBean.builder()
                    .recordCount(documentsCount.intValue())
                    .processedRecordCount(importResponse.getNumberOfDocumentsImported())
                    .failedRecordCount(importResponse.getBadInputDocuments().size() + importResponse.getFailedImports().size())
                    .build();
        } catch(Exception ex) {
            log.error("Error occurred during zone maps uploading", ex);
            throw new SourcingServiceException(ex);
        }
    }
    
    private void validateRequestedShipNodes(ZoneMapsDto zoneMapsDto) {
        Set<String> requestShipNodes = zoneMapsDto.getZones().stream()
                                           .flatMap(s -> NODE_PRIORITY_PIPE_PATTERN.splitAsStream(s.getNodePriority()))
                                           .collect(Collectors.toSet());

        Set<String> shipNodes = shipNodeService.findAllShipNode().stream()
            .map(ShipNode::getId)
            .collect(Collectors.toSet());

        if (!CollectionUtils.containsAll(shipNodes, requestShipNodes)) {
            Collection<String> notFoundRequestedShipNodes = CollectionUtils.removeAll(requestShipNodes, shipNodes);
            log.error("Unable to find shipNodes={} during uploading zone maps", notFoundRequestedShipNodes);
            throw new NotFoundException(UPLOADED_ZONE_MAPPING_NOT_FOUND,
                                        StringUtils.join(notFoundRequestedShipNodes, SEPARATOR));
        }
    }

    @Override
    public void deleteZoneMaps(ZoneMappingFilterDto zoneMappingFilterDto) throws SourcingServiceException {
        int result;
        try {
            List<String> priorities = zoneMapMapper.convertPriority(zoneMappingFilterDto.getNodePriority());
            result = zoneMapRepository.deleteByCriteria(zoneMappingFilterDto.getEnterpriseCode(), zoneMappingFilterDto.getFromZipCode(),
                    zoneMappingFilterDto.getToZipCode(), priorities);
        } catch (Exception e) {
            log.error("Error during remove Zone Mappings by: {}", zoneMappingFilterDto, e);
            throw new SourcingServiceException(e);
        }

        log.info("Removed {} Zone Mappings by criteria: {}", result, zoneMappingFilterDto);
    }

    @Override
    public List<String> getPriorityByEnterpriseCodeAndZipCode(String enterpriseCode, String zipCode) {
        List<ZoneMap> zoneMapList = zoneMapRepository.findByEnterpriseCodeAndZipCode(enterpriseCode, zipCode);
        if (CollectionUtils.isNotEmpty(zoneMapList)) {
            if (zoneMapList.size() > 1) {
                log.warn("Found more than one Zone Map for zip code={} and enterpriseCode={}; zoneMapList={}!" +
                        "Use first value from the list.", zipCode, enterpriseCode, zoneMapList);
            }
            return zoneMapList.get(0).getPriority();
        }
        return null;
    }
}
