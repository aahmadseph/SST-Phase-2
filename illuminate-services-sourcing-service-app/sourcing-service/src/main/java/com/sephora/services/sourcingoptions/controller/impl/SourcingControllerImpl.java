package com.sephora.services.sourcingoptions.controller.impl;

import java.util.List;
import java.util.Objects;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sephora.platform.common.swagger.annotation.ControllerDocumentation;
import com.sephora.services.sourcingoptions.controller.SourcingController;
import com.sephora.services.sourcingoptions.exception.SourcingServiceException;
import com.sephora.services.sourcingoptions.model.BatchOperationResultBean;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMappingFilterDto;
import com.sephora.services.sourcingoptions.model.dto.ZoneMapsDto;
import com.sephora.services.sourcingoptions.model.dto.promisedate.shipnodedelay.ShipNodeDelayRequestDto;
import com.sephora.services.sourcingoptions.service.ShipNodeDelayService;
import com.sephora.services.sourcingoptions.service.SourcingOptionsService;
import com.sephora.services.sourcingoptions.service.ZoneMapCsvUploadService;
import com.sephora.services.sourcingoptions.service.ZoneMapService;

import lombok.extern.log4j.Log4j2;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


/**
 * @author Vitaliy Oleksiyenko
 */
@ControllerDocumentation
@RestController
@RequestMapping("/v1/sourcing")
@Validated
@EnableSwagger2
@Log4j2
public class SourcingControllerImpl implements SourcingController {

    @Autowired
    private ZoneMapService zoneMapService;
    
    @Autowired
    private ZoneMapCsvUploadService zoneMapCsvUploadService;

    @Autowired
    @Qualifier("sourcingOptionsServiceImpl")
    private SourcingOptionsService sourcingOptionsService;
    
    @Autowired
    private ShipNodeDelayService shipnodeDelayService;
    
    @Override
    @GetMapping("/zone_maps")
    public ResponseEntity<Object> getZoneMapping(ZoneMappingFilterDto zoneMappingFilterDto) throws SourcingServiceException {
        log.info("Looking for zone map: {}", zoneMappingFilterDto);
        List<ZoneMapDto> zoneMapList = zoneMapService.getZoneMap(zoneMappingFilterDto);
        return new ResponseEntity<>(zoneMapList, HttpStatus.OK);
    }
    
	@Override
    @GetMapping("/zone_map_count")
	public ResponseEntity<Object> getZoneMappingCount(ZoneMappingFilterDto zoneMappingFilterDto) throws SourcingServiceException {
        log.info("Looking for zone map: {}", zoneMappingFilterDto);
        List<ZoneMapDto> zoneMapList = zoneMapService.getZoneMap(zoneMappingFilterDto);
        log.info("Zone mapping retrieved.Count is : {}", zoneMapList.size());
        return new ResponseEntity<>(zoneMapList.size(), HttpStatus.OK);
	}

    @Override
    @PostMapping("/zone_maps")
    public ResponseEntity<Object> uploadZoneMaps(ZoneMapsDto zoneMapsDto) throws SourcingServiceException {
        log.info("Uploading zone mappings. {}", zoneMapsDto);

        BatchOperationResultBean batchOperationResultBean = zoneMapService.uploadZoneMaps(zoneMapsDto);

        return batchOperationResultBean == null || batchOperationResultBean.getFailedRecordCount() > 0
                || !Objects.equals(batchOperationResultBean.getRecordCount(), batchOperationResultBean.getProcessedRecordCount())
            ? new ResponseEntity<>(batchOperationResultBean, HttpStatus.INTERNAL_SERVER_ERROR)
            : new ResponseEntity<>(batchOperationResultBean, HttpStatus.OK);
    }
    
    @Override
    @PostMapping(value = "/zone_maps/csv/{enterpriseCode}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadCsvFile(@PathVariable("enterpriseCode") EnterpriseCodeEnum enterpriseCode, 
    		@RequestParam("file") MultipartFile file) throws SourcingServiceException {
        log.info("Recived zone map csv file: {} for enterpriseCode: {}", file.getOriginalFilename(), enterpriseCode.toValue());
        zoneMapCsvUploadService.uploadCvsZoneMaps(enterpriseCode, file);
        log.info("Successfully upload zone map csv file: {} for enterpriseCode: {}", file.getOriginalFilename(), enterpriseCode.toValue());
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    @Override
    @PostMapping(value = "/zone_maps/csv/sourcinghub/{enterpriseCode}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadCsvFileForSourcingHub(@PathVariable("enterpriseCode") EnterpriseCodeEnum enterpriseCode,
                                                      @RequestParam("file") MultipartFile file,
                                                      @RequestParam(name = "publishExternally", defaultValue = "true") Boolean publishExternally
    ) throws SourcingServiceException {
        log.info("Recived zone map csv file: {} for enterpriseCode: {}", file.getOriginalFilename(), enterpriseCode.toValue());
        zoneMapCsvUploadService.uploadCsvZoneMapsForSourcingHub(enterpriseCode, file, publishExternally);
        log.info("Successfully upload zone map csv file: {} for enterpriseCode: {}", file.getOriginalFilename(), enterpriseCode.toValue());
        return new ResponseEntity<>("", HttpStatus.OK);
    }

    @Override
    @PostMapping(value = "/zone_maps/csv/process/{enterpriseCode}")
    public ResponseEntity processZoneMapCsvFile(@PathVariable("enterpriseCode") EnterpriseCodeEnum enterpriseCode) throws SourcingServiceException {
        log.info("Recieved process zone map request for enterpriseCode: {}", enterpriseCode);
        BatchOperationResultBean result = zoneMapCsvUploadService.processCvsZoneMaps(enterpriseCode);
        log.info("Successfully processed zone map for enterpriseCode: {} and result: {}", enterpriseCode, result);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @Override
    @DeleteMapping("/zone_maps")
    public ResponseEntity<Object> removeZoneMapping(ZoneMappingFilterDto zoneMappingFilterDto) throws SourcingServiceException {
        log.debug("Removed Zone Mappings by criteria: {}", zoneMappingFilterDto);
        zoneMapService.deleteZoneMaps(zoneMappingFilterDto);
        return ResponseEntity.ok().build();
    }

    @Override
    @PostMapping("/sourceItems")
    public ResponseEntity getSourceItems(SourcingOptionsRequestDto sourcingOptionsRequest) throws Exception {
        log.info("Get SourceItems for request: {}", sourcingOptionsRequest);
        return new ResponseEntity<>(sourcingOptionsService.getSourcingOptions(sourcingOptionsRequest), HttpStatus.OK);
    }

    @Override
    @PostMapping("/shipNodeDelay")
	public ResponseEntity publishShipnodeDelay(ShipNodeDelayRequestDto shipNodeDelayelayRequestDto) throws Exception {
    	log.debug("Recieved publishShipnodeDelay request: {}", shipNodeDelayelayRequestDto);
		shipnodeDelayService.publishShipnodeDelay(shipNodeDelayelayRequestDto);
		log.debug("Successfully published delay for the request: {}", shipNodeDelayelayRequestDto);
		return ResponseEntity.ok().build();
	}

	@Override
	@PutMapping("/shipNodeDelay")
	public ResponseEntity updateShipnodeDelay(ShipNodeDelayRequestDto shipNodeDelayelayRequestDto)
			throws Exception {
		log.debug("Recieved updateShipnodeDelay request: {}", shipNodeDelayelayRequestDto);
		shipnodeDelayService.updateShipnodeDelay(shipNodeDelayelayRequestDto);
		log.debug("Successfully updated shipnode delay for the request: {}", shipNodeDelayelayRequestDto);
		return ResponseEntity.ok().build();
	}

	@Override
	@DeleteMapping("/shipNodeDelay/{ruleId}/{levelOfService}/{shipNode}")
	public ResponseEntity deleteShipnodeDelay(@PathVariable String ruleId, @PathVariable String levelOfService, @PathVariable String shipNode) throws Exception {
		shipnodeDelayService.deleteShipnodeDelay(ruleId, levelOfService, shipNode);
		return null;
	}


}
