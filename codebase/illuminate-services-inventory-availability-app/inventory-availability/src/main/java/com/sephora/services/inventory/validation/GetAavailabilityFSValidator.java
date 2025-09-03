package com.sephora.services.inventory.validation;

import java.util.Set;
import javax.validation.Validator;
import javax.validation.ConstraintViolation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sephora.services.common.inventory.exception.SepValidationException;

@Component
public class GetAavailabilityFSValidator {
	@Autowired
	Validator validator;
	public void validateItem(Object object) throws SepValidationException {
		Set<ConstraintViolation<Object>> validationResults = validator.validate(object);
		if (validationResults.isEmpty() == false) {
			throw new SepValidationException(validationResults);
		}
	}
}
