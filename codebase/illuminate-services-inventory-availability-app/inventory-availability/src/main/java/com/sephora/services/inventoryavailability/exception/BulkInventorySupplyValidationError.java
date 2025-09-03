package com.sephora.services.inventoryavailability.exception;

import lombok.Data;

import javax.validation.ConstraintViolation;
import java.util.List;
import java.util.Set;

@Data
public class BulkInventorySupplyValidationError {
    private String productId;
    private String locationId;
    private List<String> validationErrors;
}
