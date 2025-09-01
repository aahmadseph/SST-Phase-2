package com.sephora.services.inventory.service;

import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.cosmos.repository.ItemRepository;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.cosmos.doc.item.ItemDoc;
import lombok.extern.log4j.Log4j2;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.List;
@Log4j2
@Service
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public class ItemService {
    @Autowired(required = false)
    private ItemRepository itemRepository;

    public ItemDoc get(String itemId, String organizationCode) throws AvailabilityServiceException {
        try{
            log.info("item fetch request received with itemId={}, organizationCode={}", itemId, organizationCode);
            List<ItemDoc> items = itemRepository.findByItemIdAndOrganizationCode(itemId, organizationCode);
            if(items != null && !items.isEmpty()){
                return items.get(0);
            }else{
                log.info("item not found for request, itemId={}, organizationCode={}", itemId, organizationCode);
                throw new AvailabilityServiceException(HttpStatus.SC_NOT_FOUND, ErrorResponseDTO.builder()
                        .error(ErrorDetails.builder()
                                .code(MessagesAndCodes.ITEM_NOT_FOUND_ERROR_CODE)
                                .message(MessagesAndCodes.ITEM_NOT_FOUND_ERROR_CODE_MESSAGE)
                                .build())
                        .build());
            }

        }catch(Exception e){
            if(e instanceof AvailabilityServiceException){
                throw e;
            }
            log.error("Exception occured while getting item information from db for request, itemId={}, organizationCode={}", itemId, organizationCode);
            log.error(e);
            throw new AvailabilityServiceException(HttpStatus.SC_NOT_FOUND, ErrorResponseDTO.builder()
                    .error(ErrorDetails.builder()
                            .code(MessagesAndCodes.ITEM_NOT_FOUND_ERROR_CODE)
                            .message(MessagesAndCodes.ITEM_NOT_FOUND_ERROR_CODE_MESSAGE)
                            .build())
                    .build());
        }
    }
}
