package com.sephora.services.sourcingoptions.validation;

import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestDto;
import com.sephora.services.sourcingoptions.model.dto.SourcingOptionsRequestItemDto;
import org.apache.commons.lang3.StringUtils;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.List;

public class FulfillmentTypeValidator implements ConstraintValidator<FulfillmentTypeValid, SourcingOptionsRequestDto> {

    @Override
    public void initialize(FulfillmentTypeValid constraintAnnotation) {

    }



    @Override
    public boolean isValid(SourcingOptionsRequestDto value, ConstraintValidatorContext context) {
        if(value == null){
            return false;
        }
        if(isItemValid(value.getItems()) || StringUtils.isNotBlank(value.getFulfillmentType())){
            return true;
        }
        return false;
    }

    private boolean isItemValid(List<SourcingOptionsRequestItemDto> items) {
        if(items == null){
            return false;
        }
        return items.stream()
                .allMatch(sourcingOptionsRequestItemDto ->
                        StringUtils.isNotBlank(sourcingOptionsRequestItemDto.getFulfillmentType()));
    }
}
