package com.sephora.services.sourcingoptions.validation;

import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.sephora.platform.common.utils.DateTimeUtils;

public class DateTimeParameterValidator implements ConstraintValidator<DateTime, String> {

    private String dateFormat;

    @Override
    public void initialize(DateTime constraintAnnotation) {
        dateFormat = constraintAnnotation.format();
    }

    @Override
    public boolean isValid(String inputDate, ConstraintValidatorContext constraintValidatorContext) {
        if (StringUtils.isNotEmpty(inputDate)) {
            try {
                DateTimeUtils.toLocalDateTime(inputDate, dateFormat);
            } catch (Exception exc) {
                return false;
            }
        }
        return true;
    }
}
