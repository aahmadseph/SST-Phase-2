package com.sephora.services.sourcingoptions.validation;

import com.sephora.services.sourcingoptions.model.dto.ZipCodeRangeDto;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class ZipCodeValidator implements ConstraintValidator<ValidZipCode, ZipCodeRangeDto> {

    @Override
    public void initialize(ValidZipCode notEmptyFields) {
    }

    @Override
    public boolean isValid(ZipCodeRangeDto zipCodeRange, ConstraintValidatorContext constraintValidatorContext) {
        if (StringUtils.isEmpty(zipCodeRange.getToZipCode()) || StringUtils.isEmpty(zipCodeRange.getFromZipCode())) {
            return true;
        }
        return StringUtils.compare(zipCodeRange.getToZipCode(), zipCodeRange.getFromZipCode()) >= 0;
    }
}
