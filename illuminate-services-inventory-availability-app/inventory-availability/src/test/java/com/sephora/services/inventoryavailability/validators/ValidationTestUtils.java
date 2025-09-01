package com.sephora.services.inventoryavailability.validators;

import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.common.inventory.model.BaseDTO;
import com.sephora.services.common.inventory.validators.Validator;
import org.junit.Assert;

public class ValidationTestUtils {
    public static void validate(Validator validator, BaseDTO validatingObject, Integer expectedErrorCount){
        try{
            validator.validateItem(validatingObject);
            Assert.assertEquals((long) expectedErrorCount, 0l);
        } catch (SepValidationException ex){
            Assert.assertEquals((long) expectedErrorCount, ex.getViolations().size());
        }
    }
}
