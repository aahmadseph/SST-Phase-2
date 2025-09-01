package com.sephora.services.common.inventory.validators;

import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;

import org.springframework.stereotype.Component;
import com.sephora.services.common.inventory.exception.SepValidationException;
import com.sephora.services.common.inventory.model.BaseDTO;

@Component
public class Validator {

	private static javax.validation.Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

	public void validateItem(BaseDTO object) throws SepValidationException {
		Set<ConstraintViolation<Object>> validationResults = validator.validate(object);
		if (validationResults.isEmpty() == false) {
			throw new SepValidationException(validationResults);
		}
	}
}
