package com.sephora.services.sourcingoptions.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

import com.sephora.services.common.dynamicconfig.config.DynamicConfigConfiguration;
import com.sephora.services.sourcingoptions.config.*;
import com.sephora.services.sourcingoptions.model.EnterpriseCodeEnum;
import com.sephora.services.sourcingoptions.service.CarrierServiceService;
import com.sephora.services.sourcingoptions.service.ShipNodeCacheService;

import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.sephora.platform.common.exception.NotFoundException;
import com.sephora.platform.common.validation.exception.ValidationException;
import com.sephora.platform.logging.RequestLoggingFilterConfig;
import com.sephora.services.sourcingoptions.client.AvailabilityHubCustomInventoryClient;
import com.sephora.services.sourcingoptions.exception.AHBadRequestException;
import com.sephora.services.sourcingoptions.exception.AHPromiseDateException;
import com.sephora.services.sourcingoptions.mapper.ShipNodeDelayMapper;
import com.sephora.services.sourcingoptions.model.SourcingOptionsMapperContext;
import com.sephora.services.sourcingoptions.model.cosmos.ShipNode;
import com.sephora.services.sourcingoptions.model.dto.promisedate.shipnodedelay.ShipNodeDelayRequestDto;
import com.sephora.services.sourcingoptions.model.dto.promisedate.shipnodedelay.ah.request.AHShipNodeDelayRequestDto;
import com.sephora.services.sourcingoptions.service.ShipNodeDelayService;
import com.sephora.services.sourcingoptions.service.ShipNodeService;
import com.sephora.services.sourcingoptions.util.SourcingUtils;

import feign.FeignException;
import lombok.extern.log4j.Log4j2;

import static com.sephora.services.sourcingoptions.service.impl.ShipNodeServiceImpl.SHIP_NODE_NOT_FOUND_ERROR;

@Service
@Log4j2
public class ShipnodeDelayServiceImpl implements ShipNodeDelayService {

	private final String AH_BADREQUEST_ERROR = "ah.shipnodedelay.badrequest";
	private final String AH_INTERNAL_SERVER_ERROR = "ah.shipnodedelay.servererror";
	private final String PROMISDATE_INTERNAL_SERVER_ERROR = "sourcing-service.shipnodedelay.servererror";

	@Autowired
	AvailabilityHubCustomInventoryClient availabilityHubCustomInventoryClient;

	@Autowired
	RequestLoggingFilterConfig requestLoggingFilterConfig;

	@Autowired
	ShipNodeDelayMapper shipNodeDelayMapper;
	
	@Autowired
    private ShipNodeService shipNodeService;
	
	@Autowired
	private ShipNodeCacheService shipNodeCacheService;
	
	@Autowired
	SourcingOptionsConfiguration sourcingOptionsConfiguration;

	@Autowired
	private AvailabilityConfiguration availabilityConfiguration;

	@Autowired
	private CarrierServiceService carrierServiceService;

	@Autowired
	@Qualifier(ShipNodeDelayAsyncConfig.SHIPNODE_DELAY_TASK_EXECUTOR)
	private AsyncTaskExecutor asyncTaskExecutor;

	@Autowired
	private DynamicConfigWrapperServiceImpl dynamicConfigService;

	@Autowired
	private DynamicConfigConfiguration dynamicConfigConfiguration;

	@Autowired
	private SourcingOptionsAHConfiguration sourcingOptionsAHConfiguration;
	
	@Value("${sourcing.options.availabilityhub.redisCache.useCache:false}")
    private boolean userRedisCache;
	

	@Override
	public void publishShipnodeDelay(ShipNodeDelayRequestDto shipNodeDelayRequestDto) throws Exception {

		try {
			log.debug("Recieved publish ship node delay request: {}", shipNodeDelayRequestDto);
			log.debug("Converting publish ship node delay request to yantriks formate: {}", shipNodeDelayRequestDto);
			SourcingOptionsMapperContext sourcingOptionsAHConfiguration = new SourcingOptionsMapperContext();
			sourcingOptionsAHConfiguration.setTimeZone(getDcLocalTimeZone(shipNodeDelayRequestDto.getShipNode()));
			sourcingOptionsAHConfiguration.setTimeZoneOffset(SourcingUtils.getZoneOffset(sourcingOptionsAHConfiguration.getTimeZone()));
			sourcingOptionsAHConfiguration.setConfiguration(sourcingOptionsConfiguration);
			List<CompletableFuture<AHShipNodeDelayRequestDto>> futures = submitRequests(shipNodeDelayRequestDto, sourcingOptionsAHConfiguration, true);
			try{
				CompletableFuture.allOf(futures.toArray(new CompletableFuture[futures.size()])).join();
				log.info("Shipnode delay requests created successfully");
			}catch(CompletionException ex){
				throw ex.getCause();
			}
		} catch (Throwable ex) {
			log.debug("An exception occured while publishing ship node delay: {}", shipNodeDelayRequestDto, ex);
			handleException((Exception) ex);
		}

	}

	private List<CompletableFuture<AHShipNodeDelayRequestDto>> submitRequests(ShipNodeDelayRequestDto shipNodeDelayRequestDto, SourcingOptionsMapperContext sourcingOptionsAHConfiguration, Boolean create){
		List<AHShipNodeDelayRequestDto> generatedRequests = createShipNodeDelayRequests(shipNodeDelayRequestDto, sourcingOptionsAHConfiguration);
		List<CompletableFuture<AHShipNodeDelayRequestDto>> futures = new ArrayList<>();
		if(generatedRequests != null) {
			for (AHShipNodeDelayRequestDto request : generatedRequests) {
				CompletableFuture<AHShipNodeDelayRequestDto> future = CompletableFuture.supplyAsync(() -> create ? this.createShipNodeDelay(request) : this.updateShipnode(request), asyncTaskExecutor);
				futures.add(future);
			}
		}
		return futures;
	}

	private AHShipNodeDelayRequestDto updateShipnode(AHShipNodeDelayRequestDto ahShipNodeDelayRequestDto) {
		try {
			availabilityHubCustomInventoryClient.updateShipNodeDelay(ahShipNodeDelayRequestDto,
					MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
		} catch (Exception e) {
			if (e instanceof FeignException.NotFound) {
				log.debug(
						"Re-submtting publish ship node delay request to Yantriks due to conflict for the shipNode: {}",
						ahShipNodeDelayRequestDto.getLocationId());
				availabilityHubCustomInventoryClient.publishShipNodeDelay(ahShipNodeDelayRequestDto,
						MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
			} else {
				throw e;
			}
		}
		log.info("Successfully submitted publish ship node delay request to yantriks: {}, ",
				ahShipNodeDelayRequestDto);
		return ahShipNodeDelayRequestDto;
	}

	private AHShipNodeDelayRequestDto createShipNodeDelay(AHShipNodeDelayRequestDto ahShipNodeDelayRequestDto){
		try {
			availabilityHubCustomInventoryClient.publishShipNodeDelay(ahShipNodeDelayRequestDto,
					MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
		} catch (Exception e) {
			if (e instanceof FeignException.Conflict) {
				log.debug(
						"Re-submtting publish ship node delay request to Yantriks due to conflict for the shipNode: {}",
						ahShipNodeDelayRequestDto.getLocationId());
				availabilityHubCustomInventoryClient.updateShipNodeDelay(ahShipNodeDelayRequestDto,
						MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
			} else {
				throw e;
			}
		}
		log.info("Successfully submitted publish ship node delay request to yantriks: {}, ",
				ahShipNodeDelayRequestDto);
		return ahShipNodeDelayRequestDto;
	}

	private List<AHShipNodeDelayRequestDto> createShipNodeDelayRequests(ShipNodeDelayRequestDto shipNodeDelayRequestDto, SourcingOptionsMapperContext mapperContext){
		String enterpriseCode = findEnterpriseCode(shipNodeDelayRequestDto.getShipNode());
		if(enterpriseCode != null){
			List<AHShipNodeDelayRequestDto> shipNodeRequests = new ArrayList<>();
			//adding original level of service received in the request.
			// Regardless of whether configuration exists or not
			// we are sending the request with original level of service
			mapperContext.setLevelOfService(shipNodeDelayRequestDto.getLevelOfService());
			AHShipNodeDelayRequestDto shipNodeRequest = shipNodeDelayMapper.convert(shipNodeDelayRequestDto, mapperContext);
			shipNodeRequests.add(shipNodeRequest);
			CarrierLevelConfiguration carrierLevelConfiguration = dynamicConfigService.getShipNodeDelayConfiguration();
			if(carrierLevelConfiguration != null
					&& carrierLevelConfiguration.getLevelOfService() != null
					&& carrierLevelConfiguration.getLevelOfService().containsKey(enterpriseCode)){
				Map<String, List<String>> levelOfServiceMap = carrierLevelConfiguration.getLevelOfService().get(enterpriseCode);
				log.debug("Successfully converted publish ship node delay request to yantriks formate: {}",
						shipNodeRequest);
				if(levelOfServiceMap != null && levelOfServiceMap.containsKey(shipNodeDelayRequestDto.getLevelOfService())){
					List<String> levelOfServices = levelOfServiceMap.get(shipNodeDelayRequestDto.getLevelOfService());
					for(String levelOfService: levelOfServices){
						// level of service is already added as it is the original level of service in request
						if(!levelOfService.equals(shipNodeDelayRequestDto.getLevelOfService())){
							mapperContext.setLevelOfService(levelOfService);
							AHShipNodeDelayRequestDto configShipNodeRequest = shipNodeDelayMapper.convert(shipNodeDelayRequestDto, mapperContext);
							log.debug("Successfully converted publish ship node delay request to yantriks formate: {}",
									configShipNodeRequest);
							shipNodeRequests.add(configShipNodeRequest);
						}
					}
				}
			}
			return shipNodeRequests;
		}
		return null;
	}

	private String findEnterpriseCode(String shipNode){
		if(availabilityConfiguration != null){
			if(availabilityConfiguration.getUsLocations().contains(shipNode)){
				return EnterpriseCodeEnum.SEPHORAUS.toValue();
			}else if(availabilityConfiguration.getCaLocations().contains(shipNode)){
				return EnterpriseCodeEnum.SEPHORACA.toValue();
			}
		}
		return null;
	}

	@Override
	public void updateShipnodeDelay(ShipNodeDelayRequestDto shipNodeDelayRequestDto) throws Exception {
		try {
			log.debug("Recieved udate ship node delay request: {}", shipNodeDelayRequestDto);
			log.debug("Converting update ship node delay request to yantriks formate: {}", shipNodeDelayRequestDto);
			SourcingOptionsMapperContext sourcingOptionsAHConfiguration = new SourcingOptionsMapperContext();
			sourcingOptionsAHConfiguration.setTimeZone(getDcLocalTimeZone(shipNodeDelayRequestDto.getShipNode()));
			sourcingOptionsAHConfiguration.setTimeZoneOffset(SourcingUtils.getZoneOffset(sourcingOptionsAHConfiguration.getTimeZone()));
			sourcingOptionsAHConfiguration.setConfiguration(sourcingOptionsConfiguration);

			List<CompletableFuture<AHShipNodeDelayRequestDto>> futures = submitRequests(shipNodeDelayRequestDto, sourcingOptionsAHConfiguration, false);
			try{
				CompletableFuture.allOf(futures.toArray(new CompletableFuture[futures.size()])).join();
				log.info("Shipnode delay requests updated successfully");
			}catch(CompletionException completionException){
				throw completionException.getCause();
			}

		}catch (Throwable ex) {
			log.debug("An exception occured while updating ship node delay: {}", shipNodeDelayRequestDto, ex);
			handleException((Exception) ex);
		}
	}

	private void deleteShipnodeDelayAsync(String ruleId){
		log.info("deleting shipnode delay with ruleId {}", ruleId);
		availabilityHubCustomInventoryClient.deleteShipNodeDelay(
				sourcingOptionsAHConfiguration.getOrgId(), ruleId,
				MDC.get(requestLoggingFilterConfig.getCorrelationIdMDCKeyName()));
	}
	
	@Override
	public void deleteShipnodeDelay(String ruleId, String levelOfService, String shipNode) throws Exception {
		try {
			log.debug("Received delete ship node delay with ruleId: {}", ruleId);
			List<String> ruleIds = getRuleIds(ruleId, levelOfService, shipNode);
			List<CompletableFuture<Void>> futures = new ArrayList<>();
			for(String rule: ruleIds){
				CompletableFuture<Void> future = CompletableFuture.runAsync(() ->
						this.deleteShipnodeDelayAsync(rule), asyncTaskExecutor);
				futures.add(future);
			}
			try{
				CompletableFuture.allOf(futures.toArray(new CompletableFuture[futures.size()])).join();
				log.info("Shipnode delay for ruleId {} deleted successfully", ruleId);
			}catch(CompletionException completionException){
				throw completionException.getCause();
			}
		} catch (Throwable ex) {
			log.debug("An exception occured while deleting ship node delay: {}", ruleId, ex);
			handleException((Exception) ex);
		}
		
	}

	private List<String> getRuleIds(String ruleId, String levelOfService, String shipNode) {
		String enterpriseCode = findEnterpriseCode(shipNode);
		List<String> ruleIds = new ArrayList<>();
		//adding default ruleId
		ruleIds.add(ruleId);
		if(enterpriseCode != null){
			CarrierLevelConfiguration carrierLevelConfiguration = dynamicConfigService.getShipNodeDelayConfiguration();
			if(carrierLevelConfiguration != null
					&& carrierLevelConfiguration.getLevelOfService() != null
					&& carrierLevelConfiguration.getLevelOfService().containsKey(enterpriseCode)) {
				Map<String, List<String>> levelOfServiceMap = carrierLevelConfiguration.getLevelOfService().get(enterpriseCode);
				if (levelOfServiceMap != null && levelOfServiceMap.containsKey(levelOfService)) {
					List<String> levelOfServices = levelOfServiceMap.get(levelOfService);
					for (String serviceLevel : levelOfServices) {
						// level of service is already added as it is the original level of service in request
						if (!serviceLevel.equals(levelOfService)) {
							ruleIds.add(ruleId + "_" + serviceLevel.split("_")[1]);
						}
					}
				}
			}
		}
		return ruleIds;
	}

	private String getDcLocalTimeZone(String shipNodeNumber) {
		ShipNode shipNode = null;
		if(userRedisCache) {
			shipNode = shipNodeCacheService.getById(shipNodeNumber);
		} else {
			shipNode = shipNodeService.getById(shipNodeNumber);
		}
		if(null != shipNode) {
			//return SourcingUtils.getZoneOffset(shipNode.get().getTimeZone());
			return shipNode.getTimeZone();
		} else {
			throw new NotFoundException(SHIP_NODE_NOT_FOUND_ERROR,shipNode);
		}
	
	}
	
	private void handleException(Exception ex) throws Exception {
		FeignException feignException = null;
		if (ex instanceof ValidationException) {
			throw ex;
		} else if (ex instanceof FeignException) {
			feignException = (FeignException) ex;
		} else if (ex.getCause() instanceof FeignException) {
			feignException = (FeignException) ex.getCause();
		}

		if (null != feignException) {
			if (feignException.status() == HttpStatus.BAD_REQUEST.value()) {
				throw new AHBadRequestException(AH_BADREQUEST_ERROR, feignException.getMessage());
			} else {
				throw new AHPromiseDateException(AH_INTERNAL_SERVER_ERROR, null);
			}
		} else {
			throw new AHPromiseDateException(PROMISDATE_INTERNAL_SERVER_ERROR, ex.getMessage());
		}
	}

	

	

}
