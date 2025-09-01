package com.sephora.services.inventoryavailability.service;

import com.sephora.platform.cache.service.CacheService;
import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.common.inventory.model.ErrorDetailInfo;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.common.inventory.validators.Validator;
import com.sephora.services.inventoryavailability.AvailabilityConstants;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.availability.metrics.MicroMeterMetricsRecorder;
import com.sephora.services.inventoryavailability.exception.HoldItemException;
import com.sephora.services.inventoryavailability.mapping.ItemHoldMapper;
import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateProduct;
import com.sephora.services.inventoryavailability.model.itemhold.request.ItemHoldUpdateRequestDto;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;

import javax.validation.ConstraintViolation;
import java.util.*;

@Service
@Log4j2
public class HoldItemService extends AbstractAvailabilityService {

    @Autowired
    @Qualifier("redisInventoryServiceTemplate")
    private RedisTemplate<String, Object> invRedisTemplate;
	
    @Autowired
    private CacheService cacheService;

    @Value("${itemhold.cache.name:ItemHold}")
    private String itemHoldCacheName;
    @Autowired
    private ItemHoldMapper itemHoldMapper;
    @Autowired
    private Validator validator;

    @Value("${itemhold.request.limit:100}")
    private Integer requestLimit;

    public void updateHoldItemStatus(ItemHoldUpdateRequestDto itemHoldUpdateRequestDto) throws HoldItemException {
        try {
            log.info("itemhold update request received, {}", itemHoldUpdateRequestDto);
            validator.validateItem(itemHoldUpdateRequestDto);
            if(itemHoldUpdateRequestDto.getProducts().size() > requestLimit){
                throw new HoldItemException(400, ErrorResponseDTO.builder()
                        .error(ErrorDetails.builder()
                                .code(MessagesAndCodes.ITEM_HOLD_VALIDATION_ERROR_CODE)
                                .message(MessagesAndCodes.ITEM_HOLD_VALIDATION_ERROR_CODE_MESSAGE)
                                .errors(Arrays.asList(ErrorDetailInfo.builder()
                                        .reason("400")
                                        .message("Request limit exceeded. Request limit is restricted to " + requestLimit + "")
                                        .build()))
                                .build())
                        .build());
            }
            Map<Object, Object> itemHoldCacheUpdates = null;
            Set<String> removableCacheUpdates = null;

            for (ItemHoldUpdateProduct product : itemHoldUpdateRequestDto.getProducts()) {
                if (product.getOnhold()) {
                    if (itemHoldCacheUpdates == null) {
                        itemHoldCacheUpdates = new HashMap<>();
                    }
                    itemHoldCacheUpdates.put(generateKey(itemHoldCacheName, product, itemHoldUpdateRequestDto.getSellingChannel()),
                            itemHoldMapper.convert(product, itemHoldUpdateRequestDto.getSellingChannel()));
                } else {
                    if (removableCacheUpdates == null) {
                        removableCacheUpdates = new HashSet<>();
                    }
                    removableCacheUpdates.add(generateKey(itemHoldCacheName, product, itemHoldUpdateRequestDto.getSellingChannel()));
                }
            }
            if (itemHoldCacheUpdates != null) {
                log.debug("updating itemhold cache with {} items, {}",itemHoldCacheUpdates.size(),  itemHoldCacheUpdates);
                //cacheService.putCacheItems(itemHoldCacheName, itemHoldCacheUpdates);
                
                invRedisTemplate.opsForValue().multiSet(new HashMap<String, Object>((Map)itemHoldCacheUpdates));
                
            }
            if (removableCacheUpdates != null) {
                log.debug("removing from itemhold cache with {} items, {}", removableCacheUpdates.size(), removableCacheUpdates);
                //cacheService.removeCacheItems(itemHoldCacheName, removableCacheUpdates);
                
                invRedisTemplate.delete(removableCacheUpdates);
            }
        } catch (Exception e) {
            handleException(e, itemHoldUpdateRequestDto);
        }
    }

    private void handleException(Exception e, Object request) throws HoldItemException {
        String code = null;
        String message = null;
        Integer httpStatus = 500;
        log.error("ItemHold request failed ({}), because of reason {}", request, e);
        if (e instanceof SepValidationException) {
            recordMicrometerMetrics(AvailabilityConstants.GET_AVAILABILITY_URI, MicroMeterMetricsRecorder.DATA_VALIDATION_ERROR);

            log.error("validation failed for holdItem request, {}", request);
            SepValidationException sepValidationException = (SepValidationException) e;
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
            ErrorDetails errorDetails = new ErrorDetails();
            errorDetails.setCode(MessagesAndCodes.ITEM_HOLD_VALIDATION_ERROR_CODE);
            errorDetails.setMessage(MessagesAndCodes.ITEM_HOLD_VALIDATION_ERROR_CODE_MESSAGE);
            List<ErrorDetailInfo> errorDetailInfos = new ArrayList<>();
            for (ConstraintViolation<Object> violation : sepValidationException.getViolations()) {
                log.error(" Validation failed for instance of class:'{}'" +
                                " with property path: '{}'" +
                                " with property value: '{}'" +
                                " and error message is '{}'"
                        , request.getClass().toString()
                        , violation.getPropertyPath()
                        , violation.getInvalidValue()
                        , violation.getMessage()
                );
                ErrorDetailInfo info = new ErrorDetailInfo();
                info.setReason(String.valueOf(HttpStatus.BAD_REQUEST.value()));
                info.setMessage("validation failed for property '"
                        + violation.getPropertyPath()
                        + "' message : "
                        + violation.getMessage());
                errorDetailInfos.add(info);
            }
            errorDetails.setErrors(errorDetailInfos);
            errorResponseDTO.setError(errorDetails);
            throw new HoldItemException(HttpStatus.BAD_REQUEST.value(), errorResponseDTO);
        } else {
            log.error("Unknown error happened {}", e);
            //recordMicrometerMetrics(AvailabilityConstants.GET_AVAILABILITY_URI, MicroMeterMetricsRecorder.UNKNOWN_ERROR);
            throw new HoldItemException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    ErrorResponseDTO.builder()
                            .error(ErrorDetails.builder()
                                    .code(MessagesAndCodes.GET_AVAILABILITY_UNKNOWN_ERROR_CODE)
                                    .message(MessagesAndCodes.GET_AVAILABILITY_UNKNOWN_ERROR_CODE_MESSAGE)
                                    .build())
                            .build());
        }
    }

    private String generateKey(String cacheName, ItemHoldUpdateProduct product, String sellingChannel) {
        return cacheName + "_" + product.getProductId() + "_" + sellingChannel + "_ItemHold";
    }
}

