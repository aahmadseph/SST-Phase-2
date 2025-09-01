package com.sephora.services.common.inventory.validators.custom;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.util.StringUtils;

public class DateValidator implements ConstraintValidator<Date, String>{
	
	protected String pattern;
	
	@Override
	public void initialize(Date date) {
		pattern = date.value();
	}

	@Override
	public boolean isValid(String dateValue, ConstraintValidatorContext context) {
		DateFormat simpleDateFormat = new SimpleDateFormat(pattern);
		try {
			if(!StringUtils.isEmpty(dateValue)) {
				simpleDateFormat.parse(dateValue);
			} 
			return true;
		} catch (DateTimeParseException | ParseException e) {
			return false;
		}
		
	}

}
