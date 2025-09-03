package com.sephora.services.inventoryavailability.service;

import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.common.inventory.model.ErrorDetailInfo;
import com.sephora.services.common.inventory.model.ErrorDetails;
import com.sephora.services.common.inventory.model.ErrorResponseDTO;
import com.sephora.services.common.inventory.validators.Validator;
import com.sephora.services.inventoryavailability.MessagesAndCodes;
import com.sephora.services.inventoryavailability.cosmos.repository.InvBulkSupplyRepository;
import com.sephora.services.inventoryavailability.exception.AvailabilityServiceException;
import com.sephora.services.inventoryavailability.model.supply.InventorySupplyDTO;
import com.sephora.services.inventoryavailability.model.cosmos.doc.bulksupply.BulkInventorySupplyDto;
import lombok.extern.log4j.Log4j2;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolation;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
@ConditionalOnProperty(prefix = "availability", name="enableInventoryUi", havingValue = "true")
public class BulkInventorySupplyService {
    @Autowired
    BulkInventorySupplyServiceAsync asyncBulkInventorySupplyService;
    @Autowired
    Validator validator;
    @Autowired(required = false)
    InvBulkSupplyRepository bulkSupplyRepository;

    public void updateInventorySupply(BulkInventorySupplyDto request) throws AvailabilityServiceException {
        //validate
        //List<String> errors = new ArrayList<>();
        Boolean validationFailed = false;
        List<ErrorDetailInfo> validationErrors = new ArrayList<>();
        for(InventorySupplyDTO inventorySupplyRequest: request.getInventorySupplyRequests()){
            try {
                log.info("validating inventory supply request received in bulk request with productId {} and quantity {}", inventorySupplyRequest.getProductId(), inventorySupplyRequest.getQuantity());
                validator.validateItem(inventorySupplyRequest);
            }catch (SepValidationException e){
                log.error("validation failed for bulk order", e);
                //errors.add(e.getMessage());
                ErrorDetailInfo error = new ErrorDetailInfo();
                error.setErrorItemId(inventorySupplyRequest.getProductId() + "-" + inventorySupplyRequest.getLocationId());

                List<String> errorStrings = new ArrayList<>();
                StringBuilder errorStringBuilder = new StringBuilder();
                for(ConstraintViolation<Object> violation: e.getViolations()){
                    errorStrings.add(violation.getMessage());
                    errorStringBuilder.append(violation.getMessage() + " || ");
                }
                error.setMessage(errorStringBuilder.toString());
                validationErrors.add(error);
                validationFailed = true;
            }
        }
        if(!validationFailed){
            //if there are no validation errors, starts a thread with bulk update requests.
            request.setId(UUID.randomUUID().toString());
            bulkSupplyRepository.save(request);
            asyncBulkInventorySupplyService.updateBulkRequest(request);
        }else{
            //there are validation errors, which will be sent back to the one which requests.
            throw new AvailabilityServiceException(HttpStatus.SC_BAD_REQUEST, ErrorResponseDTO.builder()
                    .error(ErrorDetails.builder()
                            .code(MessagesAndCodes.BULK_INVENTORY_SUPPLY_VALIDATION_ERROR_CODE)
                            .message(MessagesAndCodes.BULK_INVENTORY_SUPPLY_VALIDATION_ERROR_CODE_MESSAGE)
                            .errors(validationErrors)
                            .build())
                    .build());
        }

    }
}
