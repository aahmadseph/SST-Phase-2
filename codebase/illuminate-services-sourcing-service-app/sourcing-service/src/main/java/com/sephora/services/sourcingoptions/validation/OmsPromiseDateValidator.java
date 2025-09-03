package com.sephora.services.sourcingoptions.validation;

import com.sephora.services.sourcingoptions.SourcingOptionConstants;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class OmsPromiseDateValidator implements ConstraintValidator<OmsLineIdValid, SourcingOptionsRequestDto> {
    @Override
    public void initialize(OmsLineIdValid constraintAnnotation) {

    }

    @Override
    public boolean isValid(SourcingOptionsRequestDto value, ConstraintValidatorContext context) {
        if(value.getSourceSystem()!= null && value.getSourceSystem().equals(SourcingOptionConstants.OMS) && value.getItems() != null){
            return !value.getItems().stream()
                    .anyMatch(sourcingOptionsRequestItemDto -> StringUtils.isEmpty(sourcingOptionsRequestItemDto.getLineId()));
        }
        return true;
    }
}
